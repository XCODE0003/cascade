<?php

namespace App\Providers;

use App\Models\SystemSetting;
use App\Services\WestWallet\WestWalletClient;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(WestWalletClient::class, fn () => new WestWalletClient(
            baseUrl: (string) config('services.westwallet.base_url'),
            publicKey: config('services.westwallet.public_key'),
            privateKey: config('services.westwallet.private_key'),
        ));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->applyWestWalletOverrides();
    }

    /**
     * Let admins manage WestWallet credentials from the panel: values stored in
     * system_settings override the .env defaults at runtime.
     */
    protected function applyWestWalletOverrides(): void
    {
        try {
            if (! Schema::hasTable('system_settings')) {
                return;
            }
        } catch (\Throwable) {
            // Database not reachable yet (build step, pre-migration boot, etc.).
            return;
        }

        $map = [
            'westwallet_base_url' => 'services.westwallet.base_url',
            'westwallet_public_key' => 'services.westwallet.public_key',
            'westwallet_private_key' => 'services.westwallet.private_key',
            'westwallet_currency' => 'services.westwallet.currency',
            'westwallet_ipn_secret' => 'services.westwallet.ipn_secret',
            'westwallet_auto_payout' => 'services.westwallet.auto_payout',
        ];

        $stored = SystemSetting::whereIn('key', array_keys($map))->pluck('value', 'key');

        foreach ($map as $key => $configPath) {
            $value = $stored[$key] ?? null;

            if ($value === null || $value === '') {
                continue;
            }

            config([
                $configPath => $key === 'westwallet_auto_payout'
                    ? filter_var($value, FILTER_VALIDATE_BOOLEAN)
                    : $value,
            ]);
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
