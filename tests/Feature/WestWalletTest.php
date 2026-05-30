<?php

use App\Jobs\GenerateUserDepositAddress;
use App\Models\Deposit;
use App\Models\User;
use App\Services\WestWallet\WestWalletClient;
use App\Services\WestWallet\WestWalletException;
use Database\Seeders\LevelSeeder;
use Illuminate\Support\Facades\Http;

it('generates an address and sends signed auth headers', function () {
    Http::fake([
        'api.westwallet.io/*' => Http::response([
            'error' => 'ok',
            'address' => 'TXyz1234567890abcdef',
            'dest_tag' => null,
            'currency' => 'USDTTRC',
        ]),
    ]);

    $client = new WestWalletClient('https://api.westwallet.io', 'pub-key', 'priv-key');

    $result = $client->generateAddress('USDTTRC', 'https://example.test/ipn', 'user:1');

    expect($result['address'])->toBe('TXyz1234567890abcdef');

    Http::assertSent(function ($request) {
        return $request->hasHeader('X-API-KEY', 'pub-key')
            && $request->hasHeader('X-ACCESS-TIMESTAMP')
            && $request->hasHeader('X-ACCESS-SIGN')
            && str_contains((string) $request->body(), 'USDTTRC');
    });
});

it('throws when credentials are missing', function () {
    $client = new WestWalletClient('https://api.westwallet.io', null, null);

    expect(fn () => $client->generateAddress('USDTTRC'))
        ->toThrow(WestWalletException::class);
});

it('throws when the api returns an error', function () {
    Http::fake([
        'api.westwallet.io/*' => Http::response(['error' => 'bad currency']),
    ]);

    $client = new WestWalletClient('https://api.westwallet.io', 'pub', 'priv');

    expect(fn () => $client->generateAddress('NOPE'))
        ->toThrow(WestWalletException::class);
});

it('stores the deposit address on the user via the job', function () {
    config([
        'services.westwallet.public_key' => 'pub',
        'services.westwallet.private_key' => 'priv',
        'services.westwallet.currency' => 'USDTTRC',
    ]);

    Http::fake([
        'api.westwallet.io/*' => Http::response([
            'address' => 'TGeneratedAddress999',
            'currency' => 'USDTTRC',
        ]),
    ]);

    $user = User::factory()->create(['deposit_address' => null]);

    (new GenerateUserDepositAddress($user->id))->handle(app(WestWalletClient::class));

    expect($user->refresh()->deposit_address)->toBe('TGeneratedAddress999');
});

it('skips address generation when westwallet is not configured', function () {
    config([
        'services.westwallet.public_key' => null,
        'services.westwallet.private_key' => null,
    ]);

    $user = User::factory()->create(['deposit_address' => null]);

    (new GenerateUserDepositAddress($user->id))->handle(app(WestWalletClient::class));

    expect($user->refresh()->deposit_address)->toBeNull();
});

it('rejects an ipn callback from a non-allowlisted IP', function () {
    config(['services.westwallet.ipn_secret' => '5.188.51.47']);

    // Test client IP is 127.0.0.1, not in the allowlist.
    $this->postJson(route('webhooks.westwallet'), [
        'address' => 'TXyz',
        'status' => 'completed',
    ])
        ->assertStatus(403);
});

it('ignores an ipn callback for an unknown user', function () {
    config(['services.westwallet.ipn_secret' => null]);

    $this->postJson(route('webhooks.westwallet'), [
        'address' => 'TUnknownAddress',
        'status' => 'completed',
        'amount' => '20',
    ])
        ->assertOk()
        ->assertJson(['status' => 'unknown user']);
});

it('ignores an ipn callback for a non-final status', function () {
    config(['services.westwallet.ipn_secret' => null]);

    $this->postJson(route('webhooks.westwallet'), [
        'address' => 'TWhatever',
        'status' => 'pending',
    ])
        ->assertOk()
        ->assertJson(['status' => 'ignored']);
});

it('confirms a pending deposit and runs the split on a completed IPN', function () {
    $this->seed(LevelSeeder::class);
    config(['services.westwallet.ipn_secret' => null]);

    $user = User::factory()->create(['deposit_address' => 'TDepositAddr123']);
    $deposit = Deposit::create([
        'user_id' => $user->id,
        'level_id' => 1,
        'amount' => 20,
        'wallet_address' => 'TDepositAddr123',
        'type' => 'external',
        'status' => 'pending',
    ]);

    $this->postJson(route('webhooks.westwallet'), [
        'address' => 'TDepositAddr123',
        'status' => 'completed',
        'amount' => '20',
        'currency' => 'USDTTRC',
        'label' => 'user:'.$user->id,
        'blockchain_hash' => '0xabc123',
    ])
        ->assertOk()
        ->assertJson(['status' => 'ok']);

    expect($deposit->fresh()->status)->toBe('approved')
        ->and($deposit->fresh()->tx_hash)->toBe('0xabc123');
});
