<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use App\Services\WithdrawalService;
use Illuminate\Http\RedirectResponse;

class WithdrawalController extends Controller
{
    public function __construct(protected WithdrawalService $withdrawalService) {}

    public function approve(Withdrawal $withdrawal): RedirectResponse
    {
        // Release expired holds first
        $this->withdrawalService->releaseExpiredHolds();

        try {
            $this->withdrawalService->approve($withdrawal);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['withdrawal' => $e->getMessage()]);
        }

        return back()->with('success', 'Выплата подтверждена.');
    }

    public function reject(Withdrawal $withdrawal): RedirectResponse
    {
        try {
            $this->withdrawalService->reject($withdrawal);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['withdrawal' => $e->getMessage()]);
        }

        return back()->with('success', 'Заявка отклонена, средства возвращены.');
    }
}
