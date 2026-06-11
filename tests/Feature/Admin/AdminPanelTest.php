<?php

use App\Models\QueueEntry;
use App\Models\User;
use App\Models\Withdrawal;
use Database\Seeders\LevelSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('non-admin users cannot access the admin panel', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)
        ->get(route('admin.index'))
        ->assertForbidden();
});

test('admins see the panel with users, stats and tables', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    User::factory()->count(3)->create();

    $this->actingAs($admin)
        ->get(route('admin.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Index')
            ->has('stats')
            ->where('stats.users_total', 4)
            ->has('users', 4)
            ->has('users.0', fn (Assert $u) => $u
                ->where('tag', fn ($tag) => str_starts_with($tag, 'u_'))
                ->hasAll(['id', 'name', 'email', 'balance', 'is_admin', 'deposit_address', 'referrals_count'])
                ->etc()
            )
            ->has('deposits')
            ->has('withdrawals')
            ->has('queues')
            ->has('settings'),
        );
});

// Для теста заказчику нужно снимать ограничения на вывод «в ноль»: нулевые
// тайминги принимаются и применяются к уже существующим записям всех уровней.
test('admin can zero out timings and they apply to existing records', function () {
    $this->seed(LevelSeeder::class);

    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();

    $entry = QueueEntry::factory()->for($user)->create([
        'level_id' => 1,
        'unlock_at' => now()->addDays(7),
    ]);

    $withdrawal = Withdrawal::create([
        'user_id' => $user->id,
        'amount' => 50,
        'wallet_address' => 'TWalletAddr',
        'status' => 'hold',
        'hold_until' => now()->addHours(72),
    ]);

    $this->actingAs($admin)
        ->post(route('admin.settings.update'), [
            'hold_hours' => 0,
            'double_lock_days' => 0,
            'auto_reinvest_days' => 3,
            'min_withdrawal' => 0,
            'westwallet_auto_payout' => false,
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($entry->fresh()->unlock_at->lte(now()))->toBeTrue()
        ->and($withdrawal->fresh()->status)->toBe('pending');
});

test('shortened lock applies to existing entries on every level', function () {
    $this->seed(LevelSeeder::class);

    $admin = User::factory()->create(['is_admin' => true]);

    $entries = collect([1, 2, 3, 4])->map(fn (int $levelId) => QueueEntry::factory()->create([
        'level_id' => $levelId,
        'unlock_at' => now()->addDays(7),
    ]));

    $this->actingAs($admin)
        ->post(route('admin.settings.update'), [
            'hold_hours' => 72,
            'double_lock_days' => 1,
            'auto_reinvest_days' => 3,
            'min_withdrawal' => 30,
            'westwallet_auto_payout' => false,
        ])
        ->assertSessionHasNoErrors();

    $entries->each(function (QueueEntry $entry) {
        expect($entry->fresh()->unlock_at->lte(now()->addDay()))->toBeTrue();
    });
});

// Q1: позицию в очереди можно двигать по одной строке (вверх/вниз), а не
// только в начало/конец.
test('admin can move a queue entry up and down by one position', function () {
    $this->seed(LevelSeeder::class);
    $admin = User::factory()->create(['is_admin' => true]);

    QueueEntry::factory()->create(['level_id' => 1, 'position' => 1, 'status' => 'active']);
    $b = QueueEntry::factory()->create(['level_id' => 1, 'position' => 2, 'status' => 'active']);
    $c = QueueEntry::factory()->create(['level_id' => 1, 'position' => 3, 'status' => 'active']);

    $this->actingAs($admin)
        ->post(route('admin.queue.move-down', $b))
        ->assertRedirect();

    expect($b->fresh()->position)->toBe(3)
        ->and($c->fresh()->position)->toBe(2);

    $this->actingAs($admin)
        ->post(route('admin.queue.move-up', $b))
        ->assertRedirect();

    expect($b->fresh()->position)->toBe(2)
        ->and($c->fresh()->position)->toBe(3);
});

test('moving the top entry up and the bottom entry down are safe no-ops', function () {
    $this->seed(LevelSeeder::class);
    $admin = User::factory()->create(['is_admin' => true]);

    $top = QueueEntry::factory()->create(['level_id' => 1, 'position' => 1, 'status' => 'active']);
    $bottom = QueueEntry::factory()->create(['level_id' => 1, 'position' => 2, 'status' => 'active']);

    $this->actingAs($admin)->post(route('admin.queue.move-up', $top))->assertRedirect();
    $this->actingAs($admin)->post(route('admin.queue.move-down', $bottom))->assertRedirect();

    expect($top->fresh()->position)->toBe(1)
        ->and($bottom->fresh()->position)->toBe(2);
});

// Кнопка ручного запуска авто-реинвеста в админке (диагностика без планировщика).
test('admin can trigger auto-reinvest manually', function () {
    $this->seed(LevelSeeder::class);
    $admin = User::factory()->create(['is_admin' => true]);

    $user = User::factory()->create(['balance' => 30, 'last_seen_at' => now()]);
    $entry = QueueEntry::factory()->for($user)->ready()->create([
        'level_id' => 1, 'auto_reinvest' => true, 'position' => 1,
    ]);

    $this->actingAs($admin)
        ->post(route('admin.queue.auto-reinvest-run'))
        ->assertRedirect()
        ->assertSessionHas('success');

    // Запись с включённым «Авто-входом» и готовым циклом была реинвестирована.
    expect($entry->fresh()->cells_filled)->toBe(0);
});

// Q4 / Q5: очередь отдаёт логин (имя+email), а пользователи — список всех
// рефералов и все активные уровни.
test('queue rows expose the user login, user rows expose referrals and all levels', function () {
    $this->seed(LevelSeeder::class);
    $admin = User::factory()->create(['is_admin' => true]);

    $inviter = User::factory()->create(['name' => 'Inviter', 'email' => 'inviter@example.test']);
    User::factory()->count(2)->create(['referrer_id' => $inviter->id]);

    QueueEntry::factory()->for($inviter)->create(['level_id' => 2, 'status' => 'active', 'position' => 1]);
    QueueEntry::factory()->for($inviter)->create(['level_id' => 3, 'status' => 'active', 'position' => 1]);

    $this->actingAs($admin)
        ->get(route('admin.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('queues.2.0.name', 'Inviter')
            ->where('queues.2.0.email', 'inviter@example.test')
            ->where('users', function ($users) use ($inviter) {
                $row = collect($users)->firstWhere('id', $inviter->id);

                return $row['referrals_count'] === 2
                    && count($row['referrals']) === 2
                    && $row['active_levels'] === [2, 3];
            })
            ->etc()
        );
});
