<?php

namespace App\Services\WestWallet;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

/**
 * Thin client for the WestWallet REST API (https://westwallet.io/api_docs).
 *
 * Auth (per the official client): each request carries
 *   X-API-KEY            — public key
 *   X-ACCESS-TIMESTAMP   — unix timestamp
 *   X-ACCESS-SIGN        — HMAC-SHA256(private_key, "{timestamp}{json_body}")
 * A successful response has "error": "ok".
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
        $response = $this->request('POST', '/address/generate', [
            'currency' => $currency,
            'ipn_url' => $ipnUrl ?? '',
            'label' => $label ?? '',
        ]);

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
        $response = $this->request('POST', '/wallet/create_withdrawal', [
            'currency' => $currency,
            'amount' => number_format($amount, 8, '.', ''),
            'address' => $address,
            'dest_tag' => '',
            'description' => $label ?? '',
            'priority' => 'medium',
        ]);

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

        $body = $payload === []
            ? ''
            : json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $timestamp = (string) time();
        $signature = hash_hmac('sha256', $timestamp.$body, (string) $this->privateKey);

        $response = $this->httpClient()
            ->withHeaders([
                'X-API-KEY' => $this->publicKey,
                'X-ACCESS-SIGN' => $signature,
                'X-ACCESS-TIMESTAMP' => $timestamp,
            ])
            ->withBody($body, 'application/json')
            ->send($method, $endpoint);

        if (in_array($response->status(), [401, 403], true)) {
            throw new WestWalletException("WestWallet rejected the request (HTTP {$response->status()}).");
        }

        $data = $response->json();

        if (! is_array($data)) {
            throw new WestWalletException("WestWallet returned an unexpected response for {$endpoint} (HTTP {$response->status()}).");
        }

        // A successful WestWallet response carries "error": "ok".
        $error = $data['error'] ?? null;
        if ($error !== null && $error !== 'ok') {
            throw new WestWalletException('WestWallet error: '.json_encode($error));
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
