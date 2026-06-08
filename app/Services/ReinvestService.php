<?php

namespace App\Services;

use App\Models\LedgerEntry;
use App\Models\QueueEntry;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReinvestService
{
    public function __construct(
        protected QueueService $queueService
    ) {}

    /**
     * Manual reinvest. В отличие от депозита, реинвест НЕ зависит от того, кто
     * кого пригласил: списывает entry с баланса, удерживает 10% сервису и
     * раздаёт все 90% в очередь тремя жёлтыми ячейками (каскад). Запись
     * сбрасывается в 0/5 и уходит в конец очереди.
     */
    public function reinvest(User $user, int $levelId): void
    {
        DB::transaction(function () use ($user, $levelId) {
            $entry = QueueEntry::where('user_id', $user->id)
                ->where('level_id', $levelId)
                ->where('status', 'active')
                ->lockForUpdate()
                ->firstOrFail();

            // Реинвест доступен только после полного цикла (5/5 + истёкший замок).
            if (! $entry->isReady()) {
                throw new \RuntimeException('Реинвест доступен после полного цикла (5/5) и истечения замка.');
            }

            $this->resetAndCascade($entry, ['manual' => true], 'reinvest');
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
            $this->safeAutoReinvest($entry, ['opt_in' => true]);
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
            $this->safeAutoReinvest($entry, ['idle_days' => $idleDays]);
        }
    }

    /**
     * Один авто-реинвест в отдельной транзакции. Пользователя, у которого не
     * хватает баланса на повторный вход, пропускаем (а не валим весь батч).
     *
     * @param  array<string, mixed>  $meta
     */
    protected function safeAutoReinvest(QueueEntry $entry, array $meta): void
    {
        try {
            DB::transaction(function () use ($entry, $meta) {
                $locked = QueueEntry::lockForUpdate()->find($entry->id);

                if ($locked && $locked->isReady()) {
                    $this->resetAndCascade($locked, $meta, 'auto_reinvest');
                }
            });
        } catch (\RuntimeException $e) {
            Log::info('Auto-reinvest skipped.', [
                'queue_entry_id' => $entry->id,
                'reason' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Единое тело реинвеста (ручного и авто): списать entry с баланса, удержать
     * 10% сервису, открыть постоянный доступ к выводу, сбросить запись в 0/5,
     * отправить её в конец очереди и раздать 90% тремя жёлтыми ячейками.
     * Must run inside a DB transaction.
     *
     * @param  array<string, mixed>  $meta
     */
    protected function resetAndCascade(QueueEntry $entry, array $meta, string $type): void
    {
        $user = User::lockForUpdate()->find($entry->user_id);
        $level = $entry->level;
        $amount = (float) $level->entry_amount;

        // Повторный вход оплачивается из заработанного баланса.
        if (bccomp((string) $user->balance, (string) $amount, 2) < 0) {
            throw new \RuntimeException('Недостаточно средств на балансе для реинвеста.');
        }

        $feePercent = (float) SystemSetting::get('service_fee_percent', 10);
        $serviceFee = round($amount * $feePercent / 100, 2);

        // Списываем entry с баланса.
        $user->balance = bcsub((string) $user->balance, (string) $amount, 2);

        // Цикл выполнен — вывод остатка остаётся доступен и после сброса записи.
        if ($user->withdrawal_unlocked_at === null) {
            $user->withdrawal_unlocked_at = now();
        }

        $user->save();

        LedgerEntry::create([
            'user_id' => $user->id,
            'type' => $type,
            'amount' => -$amount,
            'balance_after' => $user->balance,
            'queue_entry_id' => $entry->id,
            'level_id' => $entry->level_id,
            'meta' => $meta,
        ]);

        // Сервисные 10% (учётная запись, баланс уже уменьшен на полную сумму).
        LedgerEntry::create([
            'user_id' => $user->id,
            'type' => 'system_fee',
            'amount' => -$serviceFee,
            'balance_after' => $user->balance,
            'queue_entry_id' => $entry->id,
            'level_id' => $entry->level_id,
        ]);

        $maxPos = QueueEntry::where('level_id', $entry->level_id)
            ->where('status', 'active')
            ->max('position') ?? 0;

        $entry->cells_filled = 0;
        $entry->bonus_cells_filled = 0;
        $entry->position = $maxPos + 1;
        $entry->unlock_at = now()->addDays((int) SystemSetting::get('double_lock_days', 7));
        $entry->save();

        // Все 90% в очередь: 3 жёлтые ячейки каскадом (анти-цикл — без себя/рефа).
        $this->queueService->distributeCells($entry->level_id, 3, $user->id);
    }
}
