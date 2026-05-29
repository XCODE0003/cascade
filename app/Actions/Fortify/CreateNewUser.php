<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Jobs\GenerateUserDepositAddress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function __construct(protected Request $request) {}

    /**
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $ip = $this->request->ip();
        $fingerprint = $this->request->input('fingerprint') ?: null;

        $referrerId = $this->resolveReferrer(
            $this->request->session()->get('referrer_id'),
            $ip,
            $fingerprint,
        );

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'referrer_id' => $referrerId,
            'fingerprint' => $fingerprint,
            'signup_ip' => $ip,
            'last_ip' => $ip,
        ]);

        $this->request->session()->forget('referrer_id');

        // Generate a real WestWallet deposit address for the user out-of-band.
        GenerateUserDepositAddress::dispatch($user->id);

        return $user;
    }

    /**
     * Anti-abuse (TЗ 7.1): reject the referrer if it looks like a self-referral
     * (same IP or browser fingerprint as the inviter), or if it would create a
     * circular referral chain.
     */
    protected function resolveReferrer(mixed $referrerId, ?string $ip, ?string $fingerprint): ?int
    {
        if (! $referrerId) {
            return null;
        }

        $referrer = User::find($referrerId);

        if (! $referrer) {
            return null;
        }

        // Self-referral via shared IP or fingerprint → drop the inviter.
        if ($ip !== null && $referrer->signup_ip === $ip) {
            return null;
        }

        if ($fingerprint !== null && $referrer->fingerprint === $fingerprint) {
            return null;
        }

        // Circular reference guard: walk the inviter's ancestry defensively.
        $seen = [];
        $cursor = $referrer;
        while ($cursor !== null) {
            if (isset($seen[$cursor->id])) {
                return null;
            }
            $seen[$cursor->id] = true;
            $cursor = $cursor->referrer_id ? User::find($cursor->referrer_id) : null;
        }

        return (int) $referrer->id;
    }
}
