<?php

namespace App\Services\WestWallet;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

/**
 * Thin client for the WestWallet REST API (https://westwallet.io/api_docs).
 *
 * Authentication uses an HMAC-SHA256 signature. Every request carries three
 * headers: the public key, a unix-timestamp nonce, and the signature computed
 * over `nonce + json_body` using the private key.
 */
class WestWalletClient
{
    public function __construct(
        protected string $baseUrl,
        protected ?string $publicKey,
        protected ?string $privateKey,
    ) {}

    public function isConfigured(): bool
    {
        return ! empty($this->publicKey) && ! empty($this->privateKey);
    }

    /**
     * Generate a new deposit address for the given currency.
     *
     * @return array{address: string, dest_tag: string|null, currency: string}
     */
    public function generateAddress(string $currency, ?string $ipnUrl = null, ?string $label = null): array
    {
        $payload = array_filter([
            'currency' => $currency,
            'ipn_url' => $ipnUrl,
            'label' => $label,
        ], fn ($value) => $value !== null && $value !== '');

        $response = $this->request('POST', '/address/generate', $payload);

        if (empty($response['address'])) {
            throw new WestWalletException('WestWallet did not return an address: '.json_encode($response));
        }

        return [
            'address' => (string) $response['address'],
            'dest_tag' => isset($response['dest_tag']) ? (string) $response['dest_tag'] : null,
            'currency' => (string) ($response['currency'] ?? $currency),
        ];
    }

    /**
     * Send an on-chain payout (withdrawal) to an external address.
     *
     * @return array{id: string|null, status: string|null}
     */
    public function sendPayout(string $currency, string $address, float $amount, ?string $label = null): array
    {
        $payload = array_filter([
            'currency' => $currency,
            'address' => $address,
            'amount' => number_format($amount, 8, '.', ''),
            'label' => $label,
        ], fn ($value) => $value !== null && $value !== '');

        $response = $this->request('POST', '/create_withdrawal', $payload);

        return [
            'id' => isset($response['id']) ? (string) $response['id'] : null,
            'status' => isset($response['status']) ? (string) $response['status'] : null,
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    protected function request(string $method, string $endpoint, array $payload = []): array
    {
        if (! $this->isConfigured()) {
            throw new WestWalletException('WestWallet credentials are not configured.');
        }

        $body = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $nonce = (string) time();
        $signature = hash_hmac('sha256', $nonce.$body, (string) $this->privateKey);

        $response = $this->httpClient()
            ->withHeaders([
                'X-API-KEY' => $this->publicKey,
                'X-NONCE' => $nonce,
                'X-API-SIGN' => $signature,
            ])
            ->withBody($body, 'application/json')
            ->send($method, $endpoint);

        if ($response->failed()) {
            throw new WestWalletException(
                "WestWallet request to {$endpoint} failed with status {$response->status()}: {$response->body()}"
            );
        }

        $data = $response->json();

        if (! is_array($data)) {
            throw new WestWalletException("WestWallet returned an unexpected response for {$endpoint}.");
        }

        if (($data['error'] ?? null) !== null) {
            throw new WestWalletException('WestWallet error: '.json_encode($data['error']));
        }

        return $data;
    }

    protected function httpClient(): PendingRequest
    {
        return Http::baseUrl(rtrim($this->baseUrl, '/'))
            ->acceptJson()
            ->timeout(15);
    }
}
