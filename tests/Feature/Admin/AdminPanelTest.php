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
