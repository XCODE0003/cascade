<?php

namespace App\Services;

use App\Models\LedgerEntry;
use App\Models\SystemSetting;
use App\Models\User;
use App\Models\Withdrawal;
use App\Services\WestWallet\WestWalletClient;
use App\Services\WestWallet\WestWalletException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WithdrawalService
{
    public function __construct(protected WestWalletClient $westWallet) {}

    /**
     * Create a withdrawal request. Sets all active queue entries to grey.
     */
    public function request(User $user, float $amount, string $walletAddress): Withdrawal
    {
        $minWithdrawal = (float) SystemSetting::get('min_withdrawal', 30);

        if ($amount < $minWithdrawal) {
            throw new \RuntimeException("Минимальная сумма вывода: {$minWithdrawal} USDT.");
        }

        if (bccomp((string) $user->balance, (string) $amount, 2) < 0) {
            throw new \RuntimeException('Недостаточно средств на балансе.');
        }

        if ($user->hasPendingWithdrawal()) {
            throw new \RuntimeException('У вас уже есть активная заявка на вывод.');
        }

        // Double-lock (TЗ 1.1 / 3.5 / 7.4): withdrawal is only unlocked once the
        // user has at least one queue entry with 5/5 cells AND 7 days elapsed.
        if (! $this->hasUnlockedEntry($user)) {
            throw new \RuntimeException('Вывод доступен только после выполнения условий «двойного замка»: 5/5 ячеек и 7 дней с момента входа.');
        }

        return DB::transaction(function () use ($user, $amount, $walletAddress) {
            $holdHours = (int) SystemSetting::get('hold_hours', 72);

            // Freeze balance
            $user->balance = bcsub((string) $user->balance, (string) $amount, 2);
            $user->save();

            $withdrawal = Withdrawal::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'wallet_address' => $walletAddress,
                'status' => 'hold',
                'hold_until' => now()->addHours($holdHours),
            ]);

            LedgerEntry::create([
                'user_id' => $user->id,
                'type' => 'withdrawal_requested',
                'amount' => -$amount,
                'balance_after' => $user->balance,
                'reference_type' => Withdrawal::class,
                'reference_id' => $withdrawal->id,
            ]);

            // Status change instead of deletion (TЗ 7.4 / 3.6.3): freeze active
            // entries (grey + is_locked), reset visible counter to 0/5. Position
            // is preserved so it can be restored if the admin rejects the payout.
            $user->queueEntries()
                ->where('status', 'active')
                ->update(['status' => 'grey', 'is_locked' => true, 'cells_filled' => 0]);

            return $withdrawal;
        });
    }

    /**
     * Admin approves payout after hold expires.
     */
    public function approve(Withdrawal $withdrawal): void
    {
        if (! in_array($withdrawal->status, ['hold', 'pending'])) {
            throw new \RuntimeException('Заявка уже обработана.');
        }

        if (! $withdrawal->isHoldExpired()) {
            throw new \RuntimeException('Холд ещё не истёк.');
        }

        DB::transaction(function () use ($withdrawal) {
            $withdrawal->status = 'approved';
            $withdrawal->processed_at = now();
            $withdrawal->save();

            LedgerEntry::create([
                'user_id' => $withdrawal->user_id,
                'type' => 'withdrawal_approved',
                'amount' => 0,
                'balance_after' => $withdrawal->user->balance,
                'reference_type' => Withdrawal::class,
                'reference_id' => $withdrawal->id,
            ]);
        });

        $this->maybeSendPayout($withdrawal);
    }

    /**
     * Optionally trigger an on-chain payout via WestWallet. Best-effort: a
     * failure is logged but never blocks the (already approved) withdrawal,
     * so admins can still pay out manually.
     */
    protected function maybeSendPayout(Withdrawal $withdrawal): void
    {
        if (! config('services.westwallet.auto_payout') || ! $this->westWallet->isConfigured()) {
            return;
        }

        try {
            $result = $this->westWallet->sendPayout(
                currency: (string) config('services.westwallet.currency'),
                address: (string) $withdrawal->wallet_address,
                amount: (float) $withdrawal->amount,
                label: 'wd:'.$withdrawal->id,
            );

            if ($result['id']) {
                $withdrawal->tx_hash = $result['id'];
                $withdrawal->save();
            }
        } catch (WestWalletException $e) {
            Log::error('WestWallet payout failed; pay out manually.', [
                'withdrawal_id' => $withdrawal->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Admin rejects withdrawal. Refunds balance and restores queue entries.
     */
    public function reject(Withdrawal $withdrawal): void
    {
        if (! in_array($withdrawal->status, ['hold', 'pending'])) {
            throw new \RuntimeException('Заявка уже обработана.');
        }

        DB::transaction(function () use ($withdrawal) {
            $user = User::lockForUpdate()->find($withdrawal->user_id);
            $user->balance = bcadd((string) $user->balance, (string) $withdrawal->amount, 2);
            $user->save();

            $withdrawal->status = 'rejected';
            $withdrawal->processed_at = now();
            $withdrawal->save();

            LedgerEntry::create([
                'user_id' => $user->id,
                'type' => 'withdrawal_rejected',
                'amount' => $withdrawal->amount,
                'balance_after' => $user->balance,
                'reference_type' => Withdrawal::class,
                'reference_id' => $withdrawal->id,
            ]);

            // Restore frozen queue entries to active (position preserved).
            $user->queueEntries()
                ->where('status', 'grey')
                ->where('is_locked', true)
                ->update(['status' => 'active', 'is_locked' => false]);
        });
    }

    /**
     * Whether the user has at least one queue entry satisfying the double lock
     * (5/5 cells and the 7-day unlock timestamp reached).
     */
    protected function hasUnlockedEntry(User $user): bool
    {
        return $user->queueEntries()
            ->where('status', 'active')
            ->where('cells_filled', '>=', 5)
            ->where('unlock_at', '<=', now())
            ->exists();
    }

    /**
     * Move hold → pending when hold expires (called by scheduled job or on check).
     */
    public function releaseExpiredHolds(): void
    {
        Withdrawal::where('status', 'hold')
            ->where('hold_until', '<=', now())
            ->update(['status' => 'pending']);
    }
}
