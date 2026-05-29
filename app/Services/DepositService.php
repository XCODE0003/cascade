<?php

namespace App\Services;

use App\Models\Deposit;
use App\Models\LedgerEntry;
use App\Models\Level;
use App\Models\SystemSetting;
use App\Models\User;
use App\Services\WestWallet\WestWalletClient;
use Illuminate\Support\Facades\DB;

class DepositService
{
    public function __construct(
        protected QueueService $queueService,
        protected WestWalletClient $westWallet,
    ) {}

    public function createExternalDeposit(User $user, int $levelId): Deposit
    {
        $level = Level::findOrFail($levelId);

        return Deposit::create([
            'user_id' => $user->id,
            'level_id' => $levelId,
            'amount' => $level->entry_amount,
            'wallet_address' => $this->depositAddressFor($user),
            'type' => 'external',
            'status' => 'pending',
        ]);
    }

    public function upgradeFromBalance(User $user, int $levelId): Deposit
    {
        $level = Level::findOrFail($levelId);

        if (bccomp((string) $user->balance, (string) $level->entry_amount, 2) < 0) {
            throw new \RuntimeException('Недостаточно средств на балансе.');
        }

        return DB::transaction(function () use ($user, $level, $levelId) {
            $deposit = Deposit::create([
                'user_id' => $user->id,
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
        });
    }

    public function confirmDeposit(Deposit $deposit): void
    {
        if ($deposit->status !== 'pending') {
            throw new \RuntimeException('Депозит уже обработан.');
        }

        DB::transaction(function () use ($deposit) {
            $this->processSplit($deposit);
            $deposit->status = 'approved';
            $deposit->confirmed_at = now();
            $deposit->save();
        });
    }

    /**
     * Core 10/60/30 split. Must be called inside a DB transaction.
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

        $directBonus = round($amount * 0.60, 2);

        $referrer = $user->referrer_id ? User::lockForUpdate()->find($user->referrer_id) : null;
        $referrerEntry = $referrer
            ? $referrer->queueEntries()
                ->where('level_id', $deposit->level_id)
                ->where('status', 'active')
                ->lockForUpdate()
                ->first()
            : null;

        $referrerMaxLevel = $referrer ? $this->getMaxActiveLevel($referrer) : 0;

        if ($referrerEntry && $referrerMaxLevel >= $deposit->level_id) {
            // Referrer qualifies: 60% cash bonus + 1 bonus cell
            $referrer->balance = bcadd((string) $referrer->balance, (string) $directBonus, 2);
            $referrer->save();

            LedgerEntry::create([
                'user_id' => $referrer->id,
                'type' => 'referral_bonus',
                'amount' => $directBonus,
                'balance_after' => $referrer->balance,
                'reference_type' => Deposit::class,
                'reference_id' => $deposit->id,
                'level_id' => $deposit->level_id,
                'meta' => ['from_user_id' => $user->id],
            ]);

            // Bonus cell: if referrer full (5/5), overspill to queue
            if ($referrerEntry->cells_filled >= 5) {
                $this->queueService->distributeCells($deposit->level_id, 1, $user->id);
            } else {
                $cellPayout = (float) $deposit->level->cell_payout;
                $referrerEntry->cells_filled += 1;
                $referrerEntry->save();

                $referrer->balance = bcadd((string) $referrer->balance, (string) $cellPayout, 2);
                $referrer->save();

                LedgerEntry::create([
                    'user_id' => $referrer->id,
                    'type' => 'cell_income',
                    'amount' => $cellPayout,
                    'balance_after' => $referrer->balance,
                    'queue_entry_id' => $referrerEntry->id,
                    'level_id' => $deposit->level_id,
                    'meta' => ['bonus_cell' => true, 'from_user_id' => $user->id],
                ]);
            }

            // 30% → 1 cell to queue
            $this->queueService->distributeCells($deposit->level_id, 1, $user->id);
        } else {
            // Trim / no referrer: 90% → 3 cells cascade
            if ($referrer) {
                LedgerEntry::create([
                    'user_id' => $referrer->id,
                    'type' => 'bonus_cell_missed',
                    'amount' => 0,
                    'balance_after' => $referrer->balance,
                    'reference_type' => Deposit::class,
                    'reference_id' => $deposit->id,
                    'level_id' => $deposit->level_id,
                    'meta' => ['from_user_id' => $user->id, 'missed_amount' => $directBonus],
                ]);
            }

            $this->queueService->distributeCells($deposit->level_id, 3, $user->id);
        }
    }

    protected function getMaxActiveLevel(User $user): int
    {
        return (int) ($user->queueEntries()->where('status', 'active')->max('level_id') ?? 0);
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

        $result = $this->westWallet->generateAddress(
            currency: (string) config('services.westwallet.currency'),
            ipnUrl: route('webhooks.westwallet'),
            label: 'user:'.$user->id,
        );

        $user->forceFill(['deposit_address' => $result['address']])->save();

        return $result['address'];
    }
}
