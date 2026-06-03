<?php

use App\Models\Deposit;
use App\Models\LedgerEntry;
use App\Models\QueueEntry;
use App\Models\User;
use App\Services\DepositService;
use Database\Seeders\LevelSeeder;
use Database\Seeders\SystemSettingSeeder;

beforeEach(function () {
    $this->seed(LevelSeeder::class);
    $this->seed(SystemSettingSeeder::class);
});

function depositService(): DepositService
{
    return app(DepositService::class);
}

// Bug #5a: dashboard 500 for the first account that filled 5/5 (future unlock).
// Root cause was formatCountdown() type-hinting Carbon while datetime casts
// resolve to CarbonImmutable.
test('dashboard loads for a 5/5 future-unlock account with ledger history', function () {
    $user = User::factory()->create(['balance' => 150]);

    QueueEntry::factory()->for($user)->create([
        'level_id' => 1,
        'cells_filled' => 5,
        'status' => 'active',
        'position' => 1,
        'unlock_at' => now()->addDays(3),
    ]);

    LedgerEntry::create([
        'user_id' => $user->id,
        'type' => 'cell_income',
        'amount' => 6,
        'balance_after' => 150,
        'level_id' => 1,
        'meta' => ['cells_added' => 1],
    ]);

    $this->actingAs($user)->get(route('dashboard'))->assertOk();
});

// Bug #2: a fresh cell looked like it "didn't land" when a stale grey entry
// with a lower id shadowed the active entry on the dashboard.
test('dashboard shows the active entry, not a stale grey one', function () {
    $user = User::factory()->create();

    QueueEntry::factory()->for($user)->create([
        'level_id' => 1, 'status' => 'grey', 'cells_filled' => 0, 'position' => 1,
    ]);
    QueueEntry::factory()->for($user)->create([
        'level_id' => 1, 'status' => 'active', 'cells_filled' => 2, 'position' => 2,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('queues.0.filled', 2));
});

// Bug #2: the direct referrer's bonus cell is tracked separately so it can be
// rendered gold; an indirect upline only gets regular cascade cells.
test('direct referral credits a tracked bonus cell to the referrer', function () {
    $referrer = User::factory()->create();
    $referral = User::factory()->create(['referrer_id' => $referrer->id]);

    $entry = QueueEntry::factory()->for($referrer)->create([
        'level_id' => 1, 'cells_filled' => 0, 'bonus_cells_filled' => 0, 'position' => 1,
    ]);

    $deposit = depositService()->createExternalDeposit($referral, 1);
    depositService()->confirmDeposit($deposit);

    $entry->refresh();

    expect($entry->cells_filled)->toBe(1)
        ->and($entry->bonus_cells_filled)->toBe(1);
});

test('indirect upline receives a regular (non-bonus) cascade cell', function () {
    $u1 = User::factory()->create();
    $u2 = User::factory()->create(['referrer_id' => $u1->id]);
    $u3 = User::factory()->create(['referrer_id' => $u2->id]);

    $e1 = QueueEntry::factory()->for($u1)->create(['level_id' => 1, 'position' => 1]);
    QueueEntry::factory()->for($u2)->create(['level_id' => 1, 'position' => 2]);

    $deposit = depositService()->createExternalDeposit($u3, 1);
    depositService()->confirmDeposit($deposit);

    $e1->refresh();

    expect($e1->cells_filled)->toBe(1)
        ->and($e1->bonus_cells_filled)->toBe(0);
});

// Bug #3: double approval (race / double-click) must not double-process.
test('confirming a deposit twice throws and does not double-process', function () {
    $user = User::factory()->create();

    $deposit = depositService()->createExternalDeposit($user, 1);
    depositService()->confirmDeposit($deposit);

    expect(fn () => depositService()->confirmDeposit($deposit->fresh()))
        ->toThrow(RuntimeException::class);

    // The depositor was enqueued exactly once (no double enqueue).
    expect(QueueEntry::where('user_id', $user->id)->where('level_id', 1)->count())->toBe(1);
    expect(Deposit::where('id', $deposit->id)->where('status', 'approved')->count())->toBe(1);
});

// Bug #4: admin can hard-delete a regular user; related rows cascade away.
test('admin can delete a regular user and related records cascade', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $victim = User::factory()->create();

    QueueEntry::factory()->for($victim)->create(['level_id' => 1]);
    LedgerEntry::create([
        'user_id' => $victim->id, 'type' => 'system_fee', 'amount' => -2, 'balance_after' => 0,
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $victim))
        ->assertRedirect();

    expect(User::find($victim->id))->toBeNull()
        ->and(QueueEntry::where('user_id', $victim->id)->count())->toBe(0)
        ->and(LedgerEntry::where('user_id', $victim->id)->count())->toBe(0);
});

test('admin cannot delete themselves or another admin', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $otherAdmin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertSessionHasErrors('user');

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $otherAdmin))
        ->assertSessionHasErrors('user');

    expect(User::find($admin->id))->not->toBeNull()
        ->and(User::find($otherAdmin->id))->not->toBeNull();
});
