<?php

use App\Models\LedgerEntry;
use App\Models\QueueEntry;
use App\Models\User;
use Database\Seeders\LevelSeeder;

beforeEach(function () {
    $this->seed(LevelSeeder::class);
});

test('idle 5/5 accounts past the threshold are force-reinvested', function () {
    $user = User::factory()->create(['last_seen_at' => now()->subDays(5)]);
    $entry = QueueEntry::factory()->for($user)->ready()->create(['position' => 1]);

    $this->artisan('cascade:auto-reinvest')->assertSuccessful();

    $entry->refresh();

    expect($entry->cells_filled)->toBe(0)
        ->and($entry->status)->toBe('active');

    expect(
        LedgerEntry::where('user_id', $user->id)->where('type', 'auto_reinvest')->exists()
    )->toBeTrue();
});

test('recently active users are not force-reinvested', function () {
    $user = User::factory()->create(['last_seen_at' => now()]);
    $entry = QueueEntry::factory()->for($user)->ready()->create();

    $this->artisan('cascade:auto-reinvest')->assertSuccessful();

    expect($entry->fresh()->cells_filled)->toBe(5);
});

test('opt-in auto-reinvest fires for an active user once the cycle completes', function () {
    // Recently active (not an absentee) but opted into auto-reinvest.
    $user = User::factory()->create(['last_seen_at' => now()]);
    $entry = QueueEntry::factory()->for($user)->ready()->create(['auto_reinvest' => true]);

    $this->artisan('cascade:auto-reinvest')->assertSuccessful();

    expect($entry->fresh()->cells_filled)->toBe(0);
});

test('opt-in auto-reinvest does not fire before the lock elapses', function () {
    $user = User::factory()->create(['last_seen_at' => now()]);
    $entry = QueueEntry::factory()->for($user)->create([
        'auto_reinvest' => true,
        'cells_filled' => 5,
        'unlock_at' => now()->addDay(),
    ]);

    $this->artisan('cascade:auto-reinvest')->assertSuccessful();

    expect($entry->fresh()->cells_filled)->toBe(5);
});

test('a user can toggle auto-reinvest on their queue entry', function () {
    $user = User::factory()->create();
    $entry = QueueEntry::factory()->for($user)->create(['level_id' => 1, 'auto_reinvest' => false]);

    $this->actingAs($user)
        ->post(route('queue.auto-reinvest', 1), ['enabled' => true])
        ->assertRedirect();

    expect($entry->fresh()->auto_reinvest)->toBeTrue();

    $this->actingAs($user)
        ->post(route('queue.auto-reinvest', 1), ['enabled' => false]);

    expect($entry->fresh()->auto_reinvest)->toBeFalse();
});
