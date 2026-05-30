<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\StoreReferralCode;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // App sits behind the Caddy TLS proxy. Trust only the For + Proto
        // headers: Proto gives correct https detection, while NOT trusting the
        // forwarded Host/Port avoids a Symfony getPort() crash ("Uninitialized
        // string offset 0") — the real Host is passed through by Caddy anyway.
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR
                | Request::HEADER_X_FORWARDED_PROTO,
        );

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            StoreReferralCode::class,
        ]);

        // WestWallet posts server-to-server IPN callbacks without a CSRF token.
        $middleware->validateCsrfTokens(except: [
            'webhooks/westwallet',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
