<?php

use App\Models\QueueEntry;
use App\Models\User;
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

test('withdrawal succeeds with a ready entry and freezes the queue', function () {
    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->ready()->create();

    $withdrawal = withdrawalService()->request($user->fresh(), 50, 'TWalletAddr');

    expect($withdrawal->status)->toBe('hold')
        ->and((float) $user->fresh()->balance)->toBe(50.0);

    $entry = QueueEntry::first();
    expect($entry->status)->toBe('grey')
        ->and($entry->is_locked)->toBeTrue()
        ->and($entry->cells_filled)->toBe(0);
});

test('only one active withdrawal is allowed at a time', function () {
    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->ready()->create();

    withdrawalService()->request($user->fresh(), 30, 'TWalletAddr');

    QueueEntry::factory()->for($user)->ready()->create();

    expect(fn () => withdrawalService()->request($user->fresh(), 30, 'TWalletAddr'))
        ->toThrow(RuntimeException::class);
});

test('rejecting a withdrawal refunds balance and restores the entry', function () {
    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->ready()->create();

    $withdrawal = withdrawalService()->request($user->fresh(), 50, 'TWalletAddr');
    withdrawalService()->reject($withdrawal->fresh());

    expect((float) $user->fresh()->balance)->toBe(100.0);

    $entry = QueueEntry::first();
    expect($entry->status)->toBe('active')
        ->and($entry->is_locked)->toBeFalse();
});

test('the release-holds command moves expired holds to pending', function () {
    $user = User::factory()->create(['balance' => 100]);
    QueueEntry::factory()->for($user)->ready()->create();

    $withdrawal = withdrawalService()->request($user->fresh(), 50, 'TWalletAddr');
    $withdrawal->update(['hold_until' => now()->subHour()]);

    $this->artisan('cascade:release-holds')->assertSuccessful();

    expect($withdrawal->fresh()->status)->toBe('pending');
});
