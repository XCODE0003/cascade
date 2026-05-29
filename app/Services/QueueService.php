<?php

namespace App\Services;

use App\Models\LedgerEntry;
use App\Models\QueueEntry;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class QueueService
{
    /**
     * Distribute N cells to the head of the queue for a given level.
     * Anti-cycle: cells never go to $excludeUserId or their direct referrer.
     *
     * Called inside an existing DB transaction.
     */
    public function distributeCells(int $levelId, int $cells, int $excludeUserId = 0): void
    {
        $remaining = $cells;

        while ($remaining > 0) {
            $entry = QueueEntry::where('level_id', $levelId)
                ->where('status', 'active')
                ->where('user_id', '!=', $excludeUserId)
                ->when($excludeUserId, function ($q) use ($excludeUserId) {
                    // Also exclude direct referrer of the acting user
                    $referrerId = User::where('id', $excludeUserId)->value('referrer_id');
                    if ($referrerId) {
                        $q->where('user_id', '!=', $referrerId);
                    }
                })
                ->orderBy('position')
                ->lockForUpdate()
                ->first();

            if (! $entry) {
                break;
            }

            $canFill = 5 - $entry->cells_filled;
            $toFill = min($remaining, $canFill);

            $entry->cells_filled += $toFill;
            $remaining -= $toFill;

            // Credit cell income to user balance
            $incomePerCell = $entry->level->cell_payout;
            $totalIncome = $incomePerCell * $toFill;

            $user = User::lockForUpdate()->find($entry->user_id);
            $user->balance = bcadd((string) $user->balance, (string) $totalIncome, 2);
            $user->save();

            LedgerEntry::create([
                'user_id' => $user->id,
                'type' => 'cell_income',
                'amount' => $totalIncome,
                'balance_after' => $user->balance,
                'queue_entry_id' => $entry->id,
                'level_id' => $levelId,
                'meta' => ['cells_added' => $toFill],
            ]);

            if ($entry->cells_filled >= 5) {
                // Check double lock: if time condition also met, mark ready
                // Status stays 'active' until user explicitly withdraws/reinvests
                $entry->save();

                // If already full, cascade remaining cells to next in queue
                // (remaining continues in next loop iteration)
            } else {
                $entry->save();
            }
        }
    }

    /**
     * Create a new queue entry for user at given level.
     * Called inside an existing DB transaction.
     */
    public function enqueue(User $user, int $levelId): QueueEntry
    {
        $lockDays = (int) SystemSetting::get('double_lock_days', 7);

        $maxPos = QueueEntry::where('level_id', $levelId)
            ->where('status', 'active')
            ->max('position') ?? 0;

        return QueueEntry::create([
            'user_id' => $user->id,
            'level_id' => $levelId,
            'cells_filled' => 0,
            'status' => 'active',
            'position' => $maxPos + 1,
            'unlock_at' => now()->addDays($lockDays),
        ]);
    }

    /**
     * Re-number positions for a level (called after admin reorders).
     */
    public function renumber(int $levelId): void
    {
        $entries = QueueEntry::where('level_id', $levelId)
            ->where('status', 'active')
            ->orderBy('position')
            ->get();

        foreach ($entries as $i => $entry) {
            $entry->position = $i + 1;
            $entry->save();
        }
    }
}
