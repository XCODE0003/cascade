<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $totalDeposited = (float) $user->deposits()
            ->where('status', 'approved')
            ->sum('amount');

        $totalWithdrawn = (float) $user->withdrawals()
            ->where('status', 'approved')
            ->sum('amount');

        $pendingHolds = $user->withdrawals()
            ->whereIn('status', ['hold', 'pending'])
            ->count();

        $deposits = $user->deposits()
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn ($d) => [
                'id' => '#DEP-'.str_pad($d->id, 5, '0', STR_PAD_LEFT),
                'level' => $d->level_id,
                'amount' => (float) $d->amount,
                'type' => $d->type,
                'status' => $d->status,
                'wallet_address' => $d->wallet_address,
                'created' => $d->created_at->diffForHumans(null, true, true),
            ]);

        $withdrawals = $user->withdrawals()
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn ($w) => [
                'id' => '#WD-'.str_pad($w->id, 4, '0', STR_PAD_LEFT),
                'amount' => (float) $w->amount,
                'status' => $w->status,
                'wallet_address' => $w->wallet_address,
                'hold_until' => $w->hold_until?->toDateTimeString(),
                'created' => $w->created_at->diffForHumans(null, true, true),
            ]);

        return Inertia::render('Wallet', [
            'balance' => (float) $user->balance,
            'depositAddress' => $user->deposit_address,
            'minWithdrawal' => (float) SystemSetting::get('min_withdrawal', 30),
            'totalDeposited' => $totalDeposited,
            'totalWithdrawn' => $totalWithdrawn,
            'pendingHolds' => $pendingHolds,
            'deposits' => $deposits,
            'withdrawals' => $withdrawals,
        ]);
    }
}
