<?php

namespace App\Models;

use Database\Factories\UserFactory;
// TODO(SMTP): вернуть `implements MustVerifyEmail`, когда на проде будет
// рабочий SMTP (Brevo/Gmail). Без него регистрация застревает на странице
// «подтвердите email» — письмо физически некому отправить.
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'balance', 'referrer_id', 'fingerprint', 'signup_ip', 'last_ip', 'deposit_address', 'last_seen_at', 'is_admin'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'balance' => 'decimal:2',
            'last_seen_at' => 'datetime',
            'is_admin' => 'boolean',
        ];
    }

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(User::class, 'referrer_id');
    }

    public function queueEntries(): HasMany
    {
        return $this->hasMany(QueueEntry::class);
    }

    public function deposits(): HasMany
    {
        return $this->hasMany(Deposit::class);
    }

    public function withdrawals(): HasMany
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function ledgerEntries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class);
    }

    public function activeQueueEntryForLevel(int $levelId): ?QueueEntry
    {
        return $this->queueEntries()
            ->where('level_id', $levelId)
            ->whereIn('status', ['active', 'grey'])
            ->first();
    }

    public function hasPendingWithdrawal(): bool
    {
        return $this->withdrawals()->whereIn('status', ['hold', 'pending'])->exists();
    }
}
