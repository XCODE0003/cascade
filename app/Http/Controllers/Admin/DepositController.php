<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deposit;
use App\Services\DepositService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DepositController extends Controller
{
    public function __construct(protected DepositService $depositService) {}

    public function approve(Request $request, Deposit $deposit): RedirectResponse
    {
        try {
            $this->depositService->confirmDeposit($deposit);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['deposit' => $e->getMessage()]);
        }

        return back()->with('success', 'Депозит подтверждён.');
    }

    public function reject(Request $request, Deposit $deposit): RedirectResponse
    {
        if ($deposit->status !== 'pending') {
            return back()->withErrors(['deposit' => 'Депозит уже обработан.']);
        }

        $deposit->update(['status' => 'rejected']);

        return back()->with('success', 'Депозит отклонён.');
    }
}
