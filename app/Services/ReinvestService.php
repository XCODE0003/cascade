<?php

namespace App\Services;

use App\Models\LedgerEntry;
use App\Models\QueueEntry;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReinvestService
{
    public function __construct(
        protected QueueService $queueService
    ) {}

    /**
     * Manual reinvest: user sends 90% of entry back into queue.
     * Their queue entry resets to 0/5 and moves to end of queue.
     */
    public function reinvest(User $user, int $levelId): void
    {
        DB::transaction(function () use ($user, $levelId) {
            $entry = QueueEntry::where('user_id', $user->id)
                ->where('level_id', $levelId)
                ->where('status', 'active')
                ->lockForUpdate()
                ->firstOrFail();

            $level = $entry->level;
            $amount = (float) $level->entry_amount;
            $feePercent = (float) SystemSetting::get('service_fee_percent', 10);

            $fee = round($amount * $feePercent / 100, 2);

            LedgerEntry::create([
                'user_id' => $user->id,
                'type' => 'reinvest',
                'amount' => 0,
                'balance_after' => $user->balance,
                'queue_entry_id' => $entry->id,
                'level_id' => $levelId,
            ]);

            // Reset entry and move to back of queue
            $maxPos = QueueEntry::where('level_id', $levelId)
                ->where('status', 'active')
                ->max('position') ?? 0;

            $entry->cells_filled = 0;
            $entry->bonus_cells_filled = 0;
            $entry->position = $maxPos + 1;
            $entry->unlock_at = now()->addDays((int) SystemSetting::get('double_lock_days', 7));
            $entry->save();

            // Distribute 3 cells to others (anti-cycle: exclude self and referrer)
            $this->queueService->distributeCells($levelId, 3, $user->id);
        });
    }

    /**
     * Auto-reinvest entries whose owner opted in via the "Авто-вход" toggle and
     * whose double lock (5/5 cells + 7 days) is now satisfied. (TЗ 6.1 / 4.3)
     * Called by a scheduled command.
     */
    public function processAutoReinvestForOptIns(): void
    {
        $entries = QueueEntry::where('status', 'active')
            ->where('auto_reinvest', true)
            ->where('cells_filled', 5)
            ->where('unlock_at', '<=', now())
            ->get();

        foreach ($entries as $entry) {
            DB::transaction(function () use ($entry) {
                $this->resetAndCascade($entry, ['opt_in' => true]);
            });
        }
    }

    /**
     * Process auto-reinvest for users who have been idle past the configured threshold.
     * Called by a scheduled command.
     */
    public function processAutoReinvestForAbsentees(): void
    {
        $idleDays = (int) SystemSetting::get('auto_reinvest_days', 3);

        // Find entries: 5/5 cells, unlock_at passed, user hasn't been seen for $idleDays
        $entries = QueueEntry::where('status', 'active')
            ->where('cells_filled', 5)
            ->where('unlock_at', '<=', now())
            ->whereHas('user', function ($q) use ($idleDays) {
                $q->where(function ($q2) use ($idleDays) {
                    $q2->whereNull('last_seen_at')
                        ->orWhere('last_seen_at', '<=', now()->subDays($idleDays));
                });
            })
            ->get();

        foreach ($entries as $entry) {
            DB::transaction(function () use ($entry, $idleDays) {
                $this->resetAndCascade($entry, ['idle_days' => $idleDays]);
            });
        }
    }

    /**
     * Shared auto-reinvest body: reset the entry to 0/5, move it to the back of
     * the queue, restart the lock timer, and cascade 3 cells to others.
     * Must run inside a DB transaction.
     *
     * @param  array<string, mixed>  $meta
     */
    protected function resetAndCascade(QueueEntry $entry, array $meta): void
    {
        $user = User::lockForUpdate()->find($entry->user_id);

        LedgerEntry::create([
            'user_id' => $user->id,
            'type' => 'auto_reinvest',
            'amount' => 0,
            'balance_after' => $user->balance,
            'queue_entry_id' => $entry->id,
            'level_id' => $entry->level_id,
            'meta' => $meta,
        ]);

        $maxPos = QueueEntry::where('level_id', $entry->level_id)
            ->where('status', 'active')
            ->max('position') ?? 0;

        $entry->cells_filled = 0;
        $entry->bonus_cells_filled = 0;
        $entry->position = $maxPos + 1;
        $entry->unlock_at = now()->addDays((int) SystemSetting::get('double_lock_days', 7));
        $entry->save();

        $this->queueService->distributeCells($entry->level_id, 3, $user->id);
    }
}
