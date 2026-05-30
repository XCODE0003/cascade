<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'westwallet' => [
        'base_url' => env('WESTWALLET_BASE_URL', 'https://api.westwallet.io'),
        'public_key' => env('WESTWALLET_PUBLIC_KEY'),
        'private_key' => env('WESTWALLET_PRIVATE_KEY'),
        // WestWallet currency code for USDT on the TRON (TRC-20) network.
        'currency' => env('WESTWALLET_CURRENCY', 'USDTTRC'),
        // WestWallet has no IPN signature — it authenticates by source IP.
        // Comma-separated allowlist of IPN source IPs (default 5.188.51.47).
        'ipn_secret' => env('WESTWALLET_IPN_SECRET'),
        // When true, approving a withdrawal triggers an on-chain payout via the
        // WestWallet API. Off by default — admins pay out manually until the
        // API contract is verified against live credentials.
        'auto_payout' => env('WESTWALLET_AUTO_PAYOUT', false),
    ],

];
