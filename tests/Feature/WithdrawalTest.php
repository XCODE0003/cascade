<?php

use App\Models\QueueEntry;
use App\Models\SystemSetting;
use App\Models\User;
use App\Services\DepositService;
use App\Services\WithdrawalService;
use Database\Seeders\LevelSeeder;

beforeEach(function () {
    $this->seed(LevelSeeder::class);
});

function withdrawalService(): WithdrawalService
{
    return app(WithdrawalService::class);
}

test('withdrawal is blocked without a satisfied double lock', function () {
    $user = User::factory()->create(['balance' => 100]);

    // 5/5 cells but the 7-day window has not elapsed.
    QueueEntry::factory()->for($user)->create([
        'cells_filled' => 5,
        'unlock_at' => now()->addDay(),
    ]);

    expect(fn () => withdrawalService()->request($user->fresh(), 50, 'TWalletAddr'))
        ->toThrow(RuntimeException::class);

    expect((float) $user->fresh()->balance)->toBe(100.0);
});

test('withdrawal is blocked below the minimum threshold', function () {
    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->ready()->create();

    expect(fn () => withdrawalService()->request($user->fresh(), 10, 'TWalletAddr'))
        ->toThrow(RuntimeException::class);
});

test('withdrawal succeeds with a ready entry and leaves the queue untouched', function () {
    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->ready()->create();

    $withdrawal = withdrawalService()->request($user->fresh(), 50, 'TWalletAddr');

    expect($withdrawal->status)->toBe('hold')
        ->and((float) $user->fresh()->balance)->toBe(50.0);

    // Вывод снимает только баланс — ячейки и очередь не трогаются.
    $entry = QueueEntry::first();
    expect($entry->status)->toBe('active')
        ->and($entry->is_locked)->toBeFalse()
        ->and($entry->cells_filled)->toBe(5);
});

test('only one active withdrawal is allowed at a time', function () {
    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->ready()->create();

    withdrawalService()->request($user->fresh(), 30, 'TWalletAddr');

    QueueEntry::factory()->for($user)->ready()->create();

    expect(fn () => withdrawalService()->request($user->fresh(), 30, 'TWalletAddr'))
        ->toThrow(RuntimeException::class);
});

test('rejecting a withdrawal refunds balance and leaves the entry active', function () {
    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->ready()->create();

    $withdrawal = withdrawalService()->request($user->fresh(), 50, 'TWalletAddr');
    withdrawalService()->reject($withdrawal->fresh());

    expect((float) $user->fresh()->balance)->toBe(100.0);

    // Запись очереди не менялась ни при заявке, ни при отклонении.
    $entry = QueueEntry::first();
    expect($entry->status)->toBe('active')
        ->and($entry->is_locked)->toBeFalse()
        ->and($entry->cells_filled)->toBe(5);
});

// Режим теста: при нулевом холде заявка сразу готова к выплате.
test('zero hold hours creates a withdrawal that is immediately pending', function () {
    SystemSetting::set('hold_hours', 0);

    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->ready()->create();

    $withdrawal = withdrawalService()->request($user->fresh(), 50, 'TWalletAddr');

    expect($withdrawal->status)->toBe('pending');
});

// Выплата не закрывает цикл: запись 5/5 остаётся активной и готовой к
// реинвесту — продолжать цикл можно только реинвестом, не новым депозитом.
test('approving a payout leaves the queue entry active and ready', function () {
    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->ready()->create(['level_id' => 1]);

    $withdrawal = withdrawalService()->request($user->fresh(), 50, 'TWalletAddr');
    $withdrawal->update(['hold_until' => now()->subMinute()]);

    withdrawalService()->approve($withdrawal->fresh());

    $entry = QueueEntry::where('user_id', $user->id)->first();
    expect($entry->status)->toBe('active')
        ->and($entry->cells_filled)->toBe(5)
        ->and($entry->isReady())->toBeTrue();

    // Уровень уже активен — повторный депозит на него отклоняется.
    expect(fn () => app(DepositService::class)->createExternalDeposit($user->fresh(), 1))
        ->toThrow(RuntimeException::class, 'Этот уровень уже активен.');
});

test('the release-holds command moves expired holds to pending', function () {
    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->ready()->create();

    $withdrawal = withdrawalService()->request($user->fresh(), 50, 'TWalletAddr');
    $withdrawal->update(['hold_until' => now()->subHour()]);

    $this->artisan('cascade:release-holds')->assertSuccessful();

    expect($withdrawal->fresh()->status)->toBe('pending');
});
