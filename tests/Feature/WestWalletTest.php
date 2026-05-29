<?php

use App\Jobs\GenerateUserDepositAddress;
use App\Models\User;
use App\Services\WestWallet\WestWalletClient;
use App\Services\WestWallet\WestWalletException;
use Illuminate\Support\Facades\Http;

it('generates an address and sends signed auth headers', function () {
    Http::fake([
        'api.westwallet.io/*' => Http::response([
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
            && $request->hasHeader('X-NONCE')
            && $request->hasHeader('X-API-SIGN')
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

it('rejects an ipn callback with an invalid signature', function () {
    config(['services.westwallet.ipn_secret' => 'shhh']);

    $this->postJson(route('webhooks.westwallet'), [
        'address' => 'TXyz',
        'status' => 'completed',
    ], ['X-Sign' => 'wrong'])
        ->assertStatus(403);
});

it('ignores an ipn callback for an unknown address', function () {
    config(['services.westwallet.ipn_secret' => null]);

    $this->postJson(route('webhooks.westwallet'), [
        'address' => 'TUnknownAddress',
        'status' => 'completed',
    ])
        ->assertOk()
        ->assertJson(['status' => 'unknown address']);
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
