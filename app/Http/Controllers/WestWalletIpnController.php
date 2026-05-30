<?php

namespace App\Http\Controllers;

use App\Models\Deposit;
use App\Models\User;
use App\Services\DepositService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WestWalletIpnController extends Controller
{
    public function __construct(protected DepositService $depositService) {}

    /**
     * Handle a WestWallet IPN (deposit notification).
     *
     * WestWallet POSTs form/JSON params: id, amount, currency, status, label,
     * address, blockchain_hash, blockchain_confirmations, fee. There is NO
     * request signature — WestWallet authenticates by source IP (default
     * 5.188.51.47). A settled deposit has status == "completed".
     */
    public function __invoke(Request $request): JsonResponse
    {
        if (! $this->ipAllowed($request)) {
            Log::warning('WestWallet IPN rejected: source IP not allowed.', ['ip' => $request->ip()]);

            return response()->json(['error' => 'forbidden'], 403);
        }

        $status = strtolower((string) $request->input('status', ''));
        $address = (string) $request->input('address', '');
        $label = (string) $request->input('label', '');
        $amount = (float) $request->input('amount', 0);

        if ($status !== 'completed') {
            return response()->json(['status' => 'ignored']);
        }

        $user = $this->resolveUser($address, $label);

        if (! $user) {
            Log::warning('WestWallet IPN for unknown user.', ['address' => $address, 'label' => $label]);

            return response()->json(['status' => 'unknown user']);
        }

        // Match the pending external deposit by amount; fall back to the oldest.
        $deposit = Deposit::where('user_id', $user->id)
            ->where('type', 'external')
            ->where('status', 'pending')
            ->get()
            ->sortBy('created_at')
            ->first(fn (Deposit $d) => abs((float) $d->amount - $amount) < 0.01)
            ?? Deposit::where('user_id', $user->id)
                ->where('type', 'external')
                ->where('status', 'pending')
                ->oldest()
                ->first();

        if (! $deposit) {
            // Already processed (WestWallet re-sends "completed") or none pending.
            return response()->json(['status' => 'no pending deposit']);
        }

        // Guard against under-payment: only credit if enough was received.
        if ($amount + 0.01 < (float) $deposit->amount) {
            Log::warning('WestWallet IPN underpaid; not confirming.', [
                'user_id' => $user->id,
                'received' => $amount,
                'expected' => (float) $deposit->amount,
            ]);

            return response()->json(['status' => 'underpaid']);
        }

        if ($hash = (string) $request->input('blockchain_hash', '')) {
            $deposit->tx_hash = $hash;
            $deposit->save();
        }

        try {
            $this->depositService->confirmDeposit($deposit);
        } catch (\Throwable $e) {
            // Idempotent: a duplicate "completed" callback is not an error.
            Log::info('WestWallet IPN confirm skipped.', ['deposit_id' => $deposit->id, 'reason' => $e->getMessage()]);
        }

        return response()->json(['status' => 'ok']);
    }

    protected function resolveUser(string $address, string $label): ?User
    {
        if ($address !== '') {
            $user = User::where('deposit_address', $address)->first();
            if ($user) {
                return $user;
            }
        }

        // We set label "user:<id>" when generating the address.
        if (preg_match('/(\d+)/', $label, $m)) {
            return User::find((int) $m[1]);
        }

        return null;
    }

    /**
     * WestWallet has no IPN signature; it is authenticated by source IP.
     * `services.westwallet.ipn_secret` holds a comma-separated allowlist
     * (e.g. "5.188.51.47"). Empty = allow any (dev only).
     */
    protected function ipAllowed(Request $request): bool
    {
        $allow = (string) config('services.westwallet.ipn_secret', '');

        if (trim($allow) === '') {
            return true;
        }

        $allowed = array_filter(array_map('trim', preg_split('/[\s,]+/', $allow)));

        return in_array($request->ip(), $allowed, true);
    }
}
