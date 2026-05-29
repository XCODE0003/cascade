<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\WestWallet\WestWalletClient;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class GenerateUserDepositAddress implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;

    public int $backoff = 30;

    public function __construct(public int $userId) {}

    public function handle(WestWalletClient $client): void
    {
        if (! $client->isConfigured()) {
            Log::warning('WestWallet not configured; skipping deposit address generation.', [
                'user_id' => $this->userId,
            ]);

            return;
        }

        $user = User::find($this->userId);

        if (! $user || ! empty($user->deposit_address)) {
            return;
        }

        $result = $client->generateAddress(
            currency: (string) config('services.westwallet.currency'),
            ipnUrl: route('webhooks.westwallet'),
            label: 'user:'.$user->id,
        );

        $user->forceFill(['deposit_address' => $result['address']])->save();
    }
}
