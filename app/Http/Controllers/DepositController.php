<?php

namespace App\Http\Controllers;

use App\Services\DepositService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DepositController extends Controller
{
    public function __construct(protected DepositService $depositService) {}

    /** Create external deposit, return wallet address as flash data. */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate(['level_id' => 'required|integer|in:1,2,3,4']);
        $deposit = $this->depositService->createExternalDeposit($request->user(), $data['level_id']);

        return back()->with('deposit_created', [
            'wallet_address' => $deposit->wallet_address,
            'amount' => (float) $deposit->amount,
            'level_id' => $deposit->level_id,
        ]);
    }

    /** Upgrade using internal balance. */
    public function upgrade(Request $request): RedirectResponse
    {
        $data = $request->validate(['level_id' => 'required|integer|in:1,2,3,4']);

        try {
            $this->depositService->upgradeFromBalance($request->user(), $data['level_id']);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['balance' => $e->getMessage()]);
        }

        return back()->with('success', 'Уровень активирован.');
    }
}
