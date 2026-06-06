<?php

use App\Models\Deposit;
use App\Models\LedgerEntry;
use App\Models\QueueEntry;
use App\Models\User;
use App\Services\DepositService;
use App\Services\ReinvestService;
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

// Зелёная (реферальная) ячейка трекается отдельно: 60% деньгами + ячейка,
// БЕЗ дополнительной выплаты cell_income (это и был баг «60% + 30% рефу»).
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

    // Ровно 60% от 20 USDT деньгами, без cell_income за зелёную ячейку.
    expect((float) $referrer->fresh()->balance)->toBe(12.0);
    expect(LedgerEntry::where('user_id', $referrer->id)->where('type', 'cell_income')->count())->toBe(0);
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

// Главная претензия заказчика: рефу 60% (зелёная ячейка), первому в очереди
// 30% (жёлтая ячейка), больше никому ничего — суммарно ровно 90%.
test('split pays 60% to the referrer and 30% to the queue head, nothing else', function () {
    $referrer = User::factory()->create();
    $referral = User::factory()->create(['referrer_id' => $referrer->id]);
    $queueHead = User::factory()->create();

    QueueEntry::factory()->for($referrer)->create(['level_id' => 1, 'position' => 1]);
    $headEntry = QueueEntry::factory()->for($queueHead)->create(['level_id' => 1, 'position' => 2]);

    $deposit = depositService()->createExternalDeposit($referral, 1);
    depositService()->confirmDeposit($deposit);

    // 60% = 12 USDT пригласившему деньгами.
    expect((float) $referrer->fresh()->balance)->toBe(12.0);

    // 30% = 6 USDT жёлтой ячейкой первому в очереди (реф исключён анти-циклом).
    expect((float) $queueHead->fresh()->balance)->toBe(6.0);

    $headEntry->refresh();
    expect($headEntry->cells_filled)->toBe(1)
        ->and($headEntry->bonus_cells_filled)->toBe(0);

    // Сумма всех выплат по депозиту = 90% (18 из 20 USDT).
    $paidOut = (float) LedgerEntry::whereIn('type', ['referral_bonus', 'cell_income'])->sum('amount');
    expect($paidOut)->toBe(18.0);
});

test('without a qualifying referrer the whole 90% cascades into the queue', function () {
    $referrer = User::factory()->create(); // нет записи на уровне — не квалифицирован
    $referral = User::factory()->create(['referrer_id' => $referrer->id]);
    $queueHead = User::factory()->create();

    $headEntry = QueueEntry::factory()->for($queueHead)->create(['level_id' => 1, 'position' => 1]);

    $deposit = depositService()->createExternalDeposit($referral, 1);
    depositService()->confirmDeposit($deposit);

    // Реф ничего не получает, но первому в очереди уходят все 3 жёлтые ячейки.
    expect((float) $referrer->fresh()->balance)->toBe(0.0)
        ->and((float) $queueHead->fresh()->balance)->toBe(18.0)
        ->and($headEntry->fresh()->cells_filled)->toBe(3)
        ->and($headEntry->fresh()->bonus_cells_filled)->toBe(0);

    expect(
        LedgerEntry::where('user_id', $referrer->id)->where('type', 'bonus_cell_missed')->exists()
    )->toBeTrue();

    // В очередь ушли все 90% (18 из 20 USDT).
    $paidOut = (float) LedgerEntry::whereIn('type', ['referral_bonus', 'cell_income'])->sum('amount');
    expect($paidOut)->toBe(18.0);
});

// Перелив: если первому не хватает места (4/5), остаток уходит следующему.
test('cascade overflows to the next entry when the head fills up', function () {
    $head = User::factory()->create();
    $next = User::factory()->create();
    $depositor = User::factory()->create(); // без рефки → 3 ячейки каскадом

    $headEntry = QueueEntry::factory()->for($head)->create([
        'level_id' => 1, 'cells_filled' => 4, 'position' => 1,
    ]);
    $nextEntry = QueueEntry::factory()->for($next)->create(['level_id' => 1, 'position' => 2]);

    $deposit = depositService()->createExternalDeposit($depositor, 1);
    depositService()->confirmDeposit($deposit);

    // Первому — 1 ячейка (до 5/5), следующему — оставшиеся 2.
    expect($headEntry->fresh()->cells_filled)->toBe(5)
        ->and((float) $head->fresh()->balance)->toBe(6.0)
        ->and($nextEntry->fresh()->cells_filled)->toBe(2)
        ->and((float) $next->fresh()->balance)->toBe(12.0);
});

// Регрессия 500/504: полная запись (5/5) в голове очереди зацикливала
// distributeCells и вешала подтверждение депозита в админке.
test('deposit confirm completes when the queue head is already 5/5', function () {
    $fullHead = User::factory()->create();
    $next = User::factory()->create();
    $depositor = User::factory()->create();

    QueueEntry::factory()->for($fullHead)->create(['level_id' => 1, 'cells_filled' => 5, 'position' => 1]);
    $nextEntry = QueueEntry::factory()->for($next)->create(['level_id' => 1, 'position' => 2]);

    $deposit = depositService()->createExternalDeposit($depositor, 1);
    depositService()->confirmDeposit($deposit);

    // Депозитор без рефки → 3 ячейки; голова 5/5 пропускается, всё следующему.
    expect($deposit->fresh()->status)->toBe('approved')
        ->and($nextEntry->fresh()->cells_filled)->toBe(3)
        ->and((float) $next->fresh()->balance)->toBe(18.0);
});

// Анти-спам: депозит нельзя плодить повторными кликами (баг с u_15).
test('a second pending deposit for the same level is rejected', function () {
    $user = User::factory()->create();

    depositService()->createExternalDeposit($user, 1);

    expect(fn () => depositService()->createExternalDeposit($user, 1))
        ->toThrow(RuntimeException::class);
});

test('a deposit for an already active level is rejected', function () {
    $user = User::factory()->create();
    QueueEntry::factory()->for($user)->create(['level_id' => 1]);

    expect(fn () => depositService()->createExternalDeposit($user, 1))
        ->toThrow(RuntimeException::class, 'Этот уровень уже активен.');
});

test('upgrading an already active level from balance is rejected', function () {
    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->create(['level_id' => 1]);

    expect(fn () => depositService()->upgradeFromBalance($user, 1))
        ->toThrow(RuntimeException::class, 'Этот уровень уже активен.');

    expect((float) $user->fresh()->balance)->toBe(100.0);
});

// Старые задвоенные pending-депозиты (созданные до фикса) не дублируют очередь.
test('confirming the second of two legacy pending deposits fails safely', function () {
    $user = User::factory()->create();

    $first = depositService()->createExternalDeposit($user, 1);
    $second = Deposit::create([
        'user_id' => $user->id,
        'level_id' => 1,
        'amount' => 20,
        'type' => 'external',
        'status' => 'pending',
    ]);

    depositService()->confirmDeposit($first);

    expect(fn () => depositService()->confirmDeposit($second->fresh()))
        ->toThrow(RuntimeException::class);

    expect(QueueEntry::where('user_id', $user->id)->where('level_id', 1)->count())->toBe(1)
        ->and($second->fresh()->status)->toBe('pending');
});

// Реинвест работает по тем же правилам сплита, что и депозит.
test('reinvest pays the referrer and the queue like a deposit', function () {
    $referrer = User::factory()->create();
    $user = User::factory()->create(['referrer_id' => $referrer->id, 'balance' => 0]);
    $other = User::factory()->create();

    $referrerEntry = QueueEntry::factory()->for($referrer)->create(['level_id' => 1, 'position' => 1]);
    $userEntry = QueueEntry::factory()->for($user)->ready()->create(['level_id' => 1, 'position' => 2]);
    $otherEntry = QueueEntry::factory()->for($other)->create(['level_id' => 1, 'position' => 3]);

    app(ReinvestService::class)->reinvest($user, 1);

    $userEntry->refresh();
    expect($userEntry->cells_filled)->toBe(0)
        ->and($userEntry->position)->toBe(4);

    // 60% рефу (зелёная ячейка), 30% жёлтой ячейкой следующему в очереди.
    expect((float) $referrer->fresh()->balance)->toBe(12.0)
        ->and($referrerEntry->fresh()->bonus_cells_filled)->toBe(1)
        ->and((float) $other->fresh()->balance)->toBe(6.0)
        ->and($otherEntry->fresh()->cells_filled)->toBe(1);
});

// Прямой POST реинвеста до полного цикла не должен качать деньги из котла.
test('reinvest is rejected before the cycle is complete', function () {
    $user = User::factory()->create(['balance' => 0]);

    // 2/5 ячеек — цикл не завершён.
    QueueEntry::factory()->for($user)->create(['level_id' => 1, 'cells_filled' => 2, 'position' => 1]);

    expect(fn () => app(ReinvestService::class)->reinvest($user, 1))
        ->toThrow(RuntimeException::class);

    // 5/5, но замок ещё не истёк.
    $locked = User::factory()->create(['balance' => 0]);
    QueueEntry::factory()->for($locked)->create([
        'level_id' => 1, 'cells_filled' => 5, 'position' => 2, 'unlock_at' => now()->addDay(),
    ]);

    expect(fn () => app(ReinvestService::class)->reinvest($locked, 1))
        ->toThrow(RuntimeException::class);
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
