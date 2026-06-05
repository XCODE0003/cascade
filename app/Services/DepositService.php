<?php

namespace App\Services;

use App\Models\Deposit;
use App\Models\LedgerEntry;
use App\Models\Level;
use App\Models\SystemSetting;
use App\Models\User;
use App\Services\WestWallet\WestWalletClient;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DepositService
{
    public function __construct(
        protected QueueService $queueService,
        protected WestWalletClient $westWallet,
    ) {}

    public function createExternalDeposit(User $user, int $levelId): Deposit
    {
        $level = Level::findOrFail($levelId);

        // Адрес резолвим до транзакции: поход в платёжный шлюз не должен
        // держать блокировку строки пользователя.
        $walletAddress = $this->depositAddressFor($user);

        // Проверка дублей и создание — под блокировкой строки пользователя,
        // иначе два одновременных клика проходят exists() до вставки и плодят
        // pending-депозиты (как у u_15 на тесте).
        return DB::transaction(function () use ($user, $level, $levelId, $walletAddress) {
            $locked = User::lockForUpdate()->findOrFail($user->id);

            $this->assertLevelAvailable($locked, $levelId);

            $hasPending = Deposit::where('user_id', $locked->id)
                ->where('level_id', $levelId)
                ->where('status', 'pending')
                ->exists();

            if ($hasPending) {
                throw new \RuntimeException('По этому уровню уже есть депозит, ожидающий подтверждения.');
            }

            return Deposit::create([
                'user_id' => $locked->id,
                'level_id' => $levelId,
                'amount' => $level->entry_amount,
                'wallet_address' => $walletAddress,
                'type' => 'external',
                'status' => 'pending',
            ]);
        }, 3);
    }

    public function upgradeFromBalance(User $user, int $levelId): Deposit
    {
        $level = Level::findOrFail($levelId);

        // Lock the user row and re-check the balance INSIDE the transaction so
        // a double-click cannot double-spend (the outside read is a fast-fail
        // hint only). Retry up to 3 times on a transient deadlock.
        return DB::transaction(function () use ($user, $level, $levelId) {
            $locked = User::lockForUpdate()->findOrFail($user->id);

            $this->assertLevelAvailable($locked, $levelId);

            if (bccomp((string) $locked->balance, (string) $level->entry_amount, 2) < 0) {
                throw new \RuntimeException('Недостаточно средств на балансе.');
            }

            $deposit = Deposit::create([
                'user_id' => $locked->id,
                'level_id' => $levelId,
                'amount' => $level->entry_amount,
                'type' => 'upgrade',
                'status' => 'pending',
                'confirmed_at' => now(),
            ]);

            $this->processSplit($deposit);

            $deposit->status = 'approved';
            $deposit->save();

            return $deposit;
        }, 3);
    }

    public function confirmDeposit(Deposit $deposit): void
    {
        // Lock the deposit row and re-check its status INSIDE the transaction.
        // This serialises concurrent admin approvals (double-click / IPN race):
        // the second caller waits, then sees status='approved' and throws a
        // RuntimeException instead of crediting the split twice or deadlocking.
        // Retry up to 3 times on a transient deadlock.
        DB::transaction(function () use ($deposit) {
            $locked = Deposit::lockForUpdate()->findOrFail($deposit->id);

            if ($locked->status !== 'pending') {
                throw new \RuntimeException('Депозит уже обработан.');
            }

            $this->processSplit($locked);

            $locked->status = 'approved';
            $locked->confirmed_at = now();
            $locked->save();
        }, 3);
    }

    /**
     * Сплит 10/60/30: комиссия сервиса, постановка в очередь и выплаты
     * (60% пригласившему / 30% первому в очереди) через QueueService.
     * Must be called inside a DB transaction.
     */
    protected function processSplit(Deposit $deposit): void
    {
        $user = User::lockForUpdate()->find($deposit->user_id);
        $amount = (float) $deposit->amount;
        $feePercent = (float) SystemSetting::get('service_fee_percent', 10);

        $serviceFee = round($amount * $feePercent / 100, 2);

        LedgerEntry::create([
            'user_id' => $user->id,
            'type' => 'system_fee',
            'amount' => -$serviceFee,
            'balance_after' => $user->balance,
            'reference_type' => Deposit::class,
            'reference_id' => $deposit->id,
            'level_id' => $deposit->level_id,
        ]);

        // Deduct balance for internal upgrades
        if ($deposit->type === 'upgrade') {
            $user->balance = bcsub((string) $user->balance, (string) $amount, 2);
            $user->save();

            LedgerEntry::create([
                'user_id' => $user->id,
                'type' => 'upgrade',
                'amount' => -$amount,
                'balance_after' => $user->balance,
                'reference_type' => Deposit::class,
                'reference_id' => $deposit->id,
                'level_id' => $deposit->level_id,
            ]);
        }

        // Place user in queue
        $this->queueService->enqueue($user, $deposit->level_id);

        // 60% пригласившему (зелёная ячейка) + 30% первому в очереди (жёлтая).
        $this->queueService->distributeSplit($user, $deposit->level_id, $deposit);
    }

    /**
     * Уровень можно активировать только если по нему нет активной или
     * замороженной (grey) записи в очереди.
     */
    protected function assertLevelAvailable(User $user, int $levelId): void
    {
        $alreadyActive = $user->queueEntries()
            ->where('level_id', $levelId)
            ->whereIn('status', ['active', 'grey'])
            ->exists();

        if ($alreadyActive) {
            throw new \RuntimeException('Этот уровень уже активен.');
        }
    }

    /**
     * Resolve the user's WestWallet deposit address, generating one on demand
     * if the registration job has not yet completed.
     */
    protected function depositAddressFor(User $user): ?string
    {
        if (! empty($user->deposit_address)) {
            return $user->deposit_address;
        }

        if (! $this->westWallet->isConfigured()) {
            return null;
        }

        // Never let a gateway hiccup turn into a 500 — the deposit is still
        // created (admin can assign an address manually / IPN will reconcile).
        try {
            $result = $this->westWallet->generateAddress(
                currency: (string) config('services.westwallet.currency'),
                ipnUrl: route('webhooks.westwallet'),
                label: 'user:'.$user->id,
            );

            $user->forceFill(['deposit_address' => $result['address']])->save();

            return $result['address'];
        } catch (\Throwable $e) {
            Log::warning('WestWallet address generation failed.', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }
}
