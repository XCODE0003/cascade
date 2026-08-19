<?php

use App\Providers\AppServiceProvider;
use Illuminate\Support\Facades\URL;

/**
 * Behind Cloudflare the origin is reached over plain HTTP, so generated URLs
 * must be pinned to https or the browser blocks them as mixed content.
 */
it('forces https url generation when APP_URL is https', function () {
    config(['app.url' => 'https://invest-cascade.com']);

    (new AppServiceProvider(app()))->boot();

    expect(URL::to('/dashboard'))->toStartWith('https://')
        ->and(URL::asset('build/assets/app.js'))->toStartWith('https://');
});

it('leaves the scheme alone when APP_URL is http', function () {
    config(['app.url' => 'http://localhost']);

    (new AppServiceProvider(app()))->boot();

    expect(URL::to('/dashboard'))->toStartWith('http://');
});
