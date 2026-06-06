<?php

namespace App\Services;

use App\Models\Deposit;
use App\Models\LedgerEntry;
use App\Models\Level;
use App\Models\QueueEntry;
use App\Models\SystemSetting;
use App\Models\User;

class QueueService
{
    /**
     * Сплит входа (депозит или реинвест) по правилу 10/60/30:
     * 10% — сервису, 60% — прямому пригласившему (зелёная ячейка),
     * 30% — первому в очереди (жёлтая ячейка).
     *
     * Если квалифицированного пригласившего нет (вход без рефки или реф не
     * активен на уровне), весь котёл (90%) уходит в очередь: 3 жёлтые ячейки
     * каскадом — при заполнении 5/5 остаток переливается следующему.
     *
     * Called inside an existing DB transaction.
     */
    public function distributeSplit(User $user, int $levelId, ?Deposit $deposit = null): void
    {
        $level = Level::findOrFail($levelId);
        $directBonus = round((float) $level->entry_amount * 0.60, 2);

        $referrer = $user->referrer_id ? User::lockForUpdate()->find($user->referrer_id) : null;
        $referrerEntry = $referrer
            ? $referrer->queueEntries()
                ->where('level_id', $levelId)
                ->where('status', 'active')
                ->lockForUpdate()
                ->first()
            : null;

        $referrerMaxLevel = $referrer ? $this->maxActiveLevel($referrer) : 0;

        if ($referrerEntry && $referrerMaxLevel >= $levelId) {
            $this->payReferralShare($referrer, $referrerEntry, $directBonus, $user, $deposit);

            // 30% — одна жёлтая ячейка первому в очереди.
            $this->distributeCells($levelId, 1, $user->id);

            return;
        }

        if ($referrer) {
            // Trim: пригласивший не активен на этом уровне — его 60% уходят в
            // очередь, упущенный бонус фиксируем нулевой записью в леджере.
            LedgerEntry::create([
                'user_id' => $referrer->id,
                'type' => 'bonus_cell_missed',
                'amount' => 0,
                'balance_after' => $referrer->balance,
                'reference_type' => $deposit ? Deposit::class : null,
                'reference_id' => $deposit?->id,
                'level_id' => $levelId,
                'meta' => ['from_user_id' => $user->id, 'missed_amount' => $directBonus],
            ]);
        }

        // Без квалифицированного пригласившего 90% уходит в очередь:
        // 3 жёлтые ячейки каскадом.
        $this->distributeCells($levelId, 3, $user->id);
    }

    /**
     * 60% пригласившему: деньги + зелёная (реферальная) ячейка в его записи.
     * Сама ячейка отдельных денег не приносит — зелёная ячейка и есть
     * визуализация этих 60%. Если запись уже 5/5, деньги выплачиваются без ячейки.
     */
    protected function payReferralShare(User $referrer, QueueEntry $entry, float $bonus, User $from, ?Deposit $deposit): void
    {
        $referrer->balance = bcadd((string) $referrer->balance, (string) $bonus, 2);
        $referrer->save();

        if ($entry->cells_filled < 5) {
            $entry->cells_filled += 1;
            $entry->bonus_cells_filled += 1;
            $entry->save();
        }

        LedgerEntry::create([
            'user_id' => $referrer->id,
            'type' => 'referral_bonus',
            'amount' => $bonus,
            'balance_after' => $referrer->balance,
            'reference_type' => $deposit ? Deposit::class : null,
            'reference_id' => $deposit?->id,
            'queue_entry_id' => $entry->id,
            'level_id' => $entry->level_id,
            'meta' => ['from_user_id' => $from->id, 'green_cell' => true],
        ]);
    }

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
            // cells_filled < 5 обязателен: полная запись (5/5) остаётся в
            // очереди до вывода/реинвеста, и без фильтра цикл зависал бы на
            // ней навсегда (canFill=0) — это и была причина 500/504 при
            // подтверждении депозита в админке.
            $entry = QueueEntry::where('level_id', $levelId)
                ->where('status', 'active')
                ->where('cells_filled', '<', 5)
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
            $entry->save();

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
        }
    }

    /**
     * Create a new queue entry for user at given level.
     * Called inside an existing DB transaction.
     *
     * @throws \RuntimeException if the user is already queued at this level.
     */
    public function enqueue(User $user, int $levelId): QueueEntry
    {
        $alreadyQueued = QueueEntry::where('user_id', $user->id)
            ->where('level_id', $levelId)
            ->whereIn('status', ['active', 'grey'])
            ->exists();

        if ($alreadyQueued) {
            throw new \RuntimeException('У пользователя уже есть запись в очереди этого уровня.');
        }

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

    protected function maxActiveLevel(User $user): int
    {
        return (int) ($user->queueEntries()->where('status', 'active')->max('level_id') ?? 0);
    }
}
