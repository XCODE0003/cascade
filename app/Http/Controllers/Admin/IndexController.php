<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deposit;
use App\Models\Level;
use App\Models\QueueEntry;
use App\Models\SystemSetting;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class IndexController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('admin/Index', [
            'stats' => $this->stats(),
            'users' => $this->users(),
            'deposits' => $this->deposits(),
            'withdrawals' => $this->withdrawals(),
            'queues' => $this->queues(),
            'settings' => $this->settings(),
        ]);
    }

    /**
     * @return array<string, int|float>
     */
    protected function stats(): array
    {
        return [
            'users_total' => User::count(),
            'users_active' => QueueEntry::whereIn('status', ['active', 'grey'])->distinct('user_id')->count('user_id'),
            'balance_liability' => (float) User::sum('balance'),
            'deposits_pending' => Deposit::where('status', 'pending')->count(),
            'deposits_total' => (float) Deposit::where('status', 'approved')->sum('amount'),
            'withdrawals_pending' => Withdrawal::whereIn('status', ['hold', 'pending'])->count(),
            'withdrawals_total' => (float) Withdrawal::where('status', 'approved')->sum('amount'),
            'queue_active' => QueueEntry::where('status', 'active')->count(),
        ];
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    protected function users()
    {
        return User::query()
            ->withCount(['referrals', 'deposits', 'withdrawals'])
            ->withSum(['deposits as deposits_sum' => fn ($q) => $q->where('status', 'approved')], 'amount')
            ->with(['queueEntries' => fn ($q) => $q->whereIn('status', ['active', 'grey'])])
            ->orderByDesc('created_at')
            ->limit(200)
            ->get()
            ->map(fn (User $u) => [
                'id' => $u->id,
                'tag' => 'u_'.$u->id,
                'name' => $u->name,
                'email' => $u->email,
                'balance' => (float) $u->balance,
                'is_admin' => (bool) $u->is_admin,
                'referrer' => $u->referrer_id ? 'u_'.$u->referrer_id : null,
                'referrals_count' => (int) $u->referrals_count,
                'deposits_count' => (int) $u->deposits_count,
                'deposits_sum' => (float) ($u->deposits_sum ?? 0),
                'withdrawals_count' => (int) $u->withdrawals_count,
                'max_level' => (int) ($u->queueEntries->max('level_id') ?? 0),
                'deposit_address' => $u->deposit_address,
                'last_seen' => $u->last_seen_at?->diffForHumans(null, true, true),
                'joined' => $u->created_at->diffForHumans(null, true, true),
            ]);
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    protected function deposits()
    {
        return Deposit::with('user', 'level')
            ->orderByRaw("CASE status WHEN 'pending' THEN 0 ELSE 1 END")
            ->orderByDesc('created_at')
            ->limit(100)
            ->get()
            ->map(fn ($d) => [
                'id' => '#DEP-'.str_pad($d->id, 5, '0', STR_PAD_LEFT),
                'raw_id' => $d->id,
                'user' => 'u_'.$d->user_id,
                'level' => $d->level_id,
                'amount' => (float) $d->amount,
                'ref' => $d->user->referrer_id ? 'u_'.$d->user->referrer_id : '—',
                'age' => $d->created_at->diffForHumans(null, true, true),
                'status' => $d->status,
            ]);
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    protected function withdrawals()
    {
        return Withdrawal::with('user')
            ->orderByRaw("CASE status WHEN 'hold' THEN 0 WHEN 'pending' THEN 1 ELSE 2 END")
            ->orderByDesc('created_at')
            ->limit(100)
            ->get()
            ->map(fn ($w) => [
                'id' => '#WD-'.str_pad($w->id, 4, '0', STR_PAD_LEFT),
                'raw_id' => $w->id,
                'user' => 'u_'.$w->user_id,
                'amount' => (float) $w->amount,
                'holdLeft' => $w->status === 'hold' ? max(0, (int) now()->diffInHours($w->hold_until, false)) : null,
                'total' => 72,
                'status' => $w->status,
                'created' => $w->created_at->diffForHumans(null, true, true),
            ]);
    }

    /**
     * @return Collection<int, mixed>
     */
    protected function queues()
    {
        return Level::all()->mapWithKeys(function ($level) {
            $entries = QueueEntry::where('level_id', $level->id)
                ->where('status', 'active')
                ->with('user')
                ->orderBy('position')
                ->get()
                ->map(fn ($e) => [
                    'raw_id' => $e->id,
                    'pos' => $e->position,
                    'user' => 'u_'.$e->user_id,
                    'filled' => $e->cells_filled,
                    'status' => $e->isReady() ? 'ready' : ($e->status === 'grey' ? 'grey' : 'locked'),
                    'timer' => $e->isReady() ? 'Готов' : $e->unlock_at->diffForHumans(null, true),
                    'joined' => $e->created_at->diffForHumans(null, true),
                ]);

            return [$level->id => $entries];
        });
    }

    /**
     * @return array<string, mixed>
     */
    protected function settings(): array
    {
        return [
            'hold_hours' => SystemSetting::get('hold_hours', 72),
            'double_lock_days' => SystemSetting::get('double_lock_days', 7),
            'auto_reinvest_days' => SystemSetting::get('auto_reinvest_days', 3),
            'min_withdrawal' => SystemSetting::get('min_withdrawal', 30),

            // Effective WestWallet config (system_settings overriding .env).
            'westwallet_base_url' => (string) config('services.westwallet.base_url'),
            'westwallet_public_key' => (string) config('services.westwallet.public_key'),
            'westwallet_private_key' => (string) config('services.westwallet.private_key'),
            'westwallet_currency' => (string) config('services.westwallet.currency'),
            'westwallet_ipn_secret' => (string) config('services.westwallet.ipn_secret'),
            'westwallet_auto_payout' => (bool) config('services.westwallet.auto_payout'),
        ];
    }
}
