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
     * Manual reinvest: повторный вход по правилам депозита (60% пригласившему,
     * 30% первому в очереди). Запись сбрасывается в 0/5 и уходит в конец очереди.
     */
    public function reinvest(User $user, int $levelId): void
    {
        DB::transaction(function () use ($user, $levelId) {
            $entry = QueueEntry::where('user_id', $user->id)
                ->where('level_id', $levelId)
                ->where('status', 'active')
                ->lockForUpdate()
                ->firstOrFail();

            // Реинвест доступен только после полного цикла: иначе прямой POST
            // (в обход задизейбленной кнопки) запускал бы сплит 60/30 из
            // котла бесплатно и бесконечно.
            if (! $entry->isReady()) {
                throw new \RuntimeException('Реинвест доступен после полного цикла (5/5) и истечения замка.');
            }

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

            // Реинвест работает как депозит: 60% пригласившему (зелёная
            // ячейка), 30% первому в очереди (жёлтая), анти-цикл внутри.
            $this->queueService->distributeSplit($user, $levelId);
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

        // Авто-реинвест — те же правила сплита, что и у депозита.
        $this->queueService->distributeSplit($user, $entry->level_id);
    }
}
