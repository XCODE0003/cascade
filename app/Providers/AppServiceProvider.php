<?php

namespace App\Providers;

use App\Models\SystemSetting;
use App\Services\WestWallet\WestWalletClient;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
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
        $this->configureUrlScheme();
        $this->configureMailNotifications();
        $this->applyWestWalletOverrides();
    }

    /**
     * Cloudflare terminates TLS at the edge and reaches the origin over plain
     * HTTP, so `X-Forwarded-Proto` says "http" and Laravel would emit http://
     * asset, redirect and Inertia URLs on a page served over https — browsers
     * block those as mixed content. Pin generated URLs to the scheme APP_URL
     * declares (stays http:// locally).
     */
    protected function configureUrlScheme(): void
    {
        if (str_starts_with((string) config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }
    }

    /**
     * Системные письма (активация аккаунта, сброс пароля) на русском,
     * в фирменном оформлении Cascade (тема cascade.css).
     */
    protected function configureMailNotifications(): void
    {
        VerifyEmail::toMailUsing(fn (object $notifiable, string $url): MailMessage => (new MailMessage)
            ->subject('Подтвердите ваш email — Cascade')
            ->greeting('Добро пожаловать в Cascade!')
            ->line('Вы зарегистрировали аккаунт на платформе Cascade. Осталось подтвердить адрес электронной почты — нажмите кнопку ниже.')
            ->action('Подтвердить email', $url)
            ->line('Ссылка действительна 60 минут. Если вы не регистрировались в Cascade, просто проигнорируйте это письмо.')
            ->salutation('С уважением, команда Cascade'));

        ResetPassword::toMailUsing(function (object $notifiable, string $token): MailMessage {
            $url = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            $expire = (int) config('auth.passwords.'.config('auth.defaults.passwords').'.expire', 60);

            return (new MailMessage)
                ->subject('Сброс пароля — Cascade')
                ->greeting('Сброс пароля')
                ->line('Мы получили запрос на сброс пароля для вашего аккаунта Cascade. Чтобы задать новый пароль, нажмите кнопку ниже.')
                ->action('Сбросить пароль', $url)
                ->line("Ссылка действительна {$expire} мин. Если вы не запрашивали сброс — проигнорируйте это письмо, пароль останется прежним.")
                ->salutation('С уважением, команда Cascade');
        });
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
