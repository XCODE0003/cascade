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
     * Handle a WestWallet IPN (deposit notification) callback.
     *
     * WestWallet posts JSON describing a transaction received at one of the
     * addresses we generated. We match it to the owning user by address and
     * confirm their oldest pending external deposit.
     */
    public function __invoke(Request $request): JsonResponse
    {
        if (! $this->signatureIsValid($request)) {
            Log::warning('WestWallet IPN rejected: invalid signature.', ['ip' => $request->ip()]);

            return response()->json(['error' => 'invalid signature'], 403);
        }

        $data = $request->all();
        $address = $data['address'] ?? null;
        $status = strtolower((string) ($data['status'] ?? ''));

        if (! $address) {
            return response()->json(['error' => 'missing address'], 422);
        }

        // Only act on settled deposits.
        if (! in_array($status, ['completed', 'confirmed', 'success', 'paid'], true)) {
            return response()->json(['status' => 'ignored']);
        }

        $user = User::where('deposit_address', $address)->first();

        if (! $user) {
            Log::warning('WestWallet IPN for unknown address.', ['address' => $address]);

            return response()->json(['status' => 'unknown address']);
        }

        $deposit = Deposit::where('user_id', $user->id)
            ->where('type', 'external')
            ->where('status', 'pending')
            ->oldest()
            ->first();

        if (! $deposit) {
            Log::info('WestWallet IPN: no pending deposit to confirm.', [
                'user_id' => $user->id,
                'address' => $address,
            ]);

            return response()->json(['status' => 'no pending deposit']);
        }

        if (! empty($data['txid']) || ! empty($data['blockchain_hash'])) {
            $deposit->tx_hash = (string) ($data['txid'] ?? $data['blockchain_hash']);
            $deposit->save();
        }

        $this->depositService->confirmDeposit($deposit);

        return response()->json(['status' => 'ok']);
    }

    protected function signatureIsValid(Request $request): bool
    {
        $secret = config('services.westwallet.ipn_secret');

        // If no secret is configured, accept (dev / sandbox). Configure
        // WESTWALLET_IPN_SECRET in production to enforce verification.
        if (empty($secret)) {
            return true;
        }

        $provided = $request->header('X-Sign') ?? (string) $request->input('sign', '');
        $expected = hash_hmac('sha256', $request->getContent(), (string) $secret);

        return hash_equals($expected, (string) $provided);
    }
}
