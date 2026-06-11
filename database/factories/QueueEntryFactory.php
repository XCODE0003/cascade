<?php

namespace Database\Factories;

use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QueueEntry>
 */
class QueueEntryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'level_id' => 1,
            'cells_filled' => 0,
            'status' => 'active',
            'is_locked' => false,
            'auto_reinvest' => false,
            'position' => 1,
            'unlock_at' => now()->addDays(7),
            'requeued_at' => now(),
        ];
    }

    /**
     * Double lock satisfied: 5/5 cells and the 7-day window already elapsed.
     */
    public function ready(): static
    {
        return $this->state(fn () => [
            'cells_filled' => 5,
            'unlock_at' => now()->subDay(),
        ]);
    }
}
