<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deposit;
use App\Services\DepositService;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DepositController extends Controller
{
    public function __construct(protected DepositService $depositService) {}

    public function approve(Request $request, Deposit $deposit): RedirectResponse
    {
        try {
            $this->depositService->confirmDeposit($deposit);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['deposit' => $e->getMessage()]);
        } catch (QueryException $e) {
            // Lock-wait timeout / deadlock under concurrent approval. Don't 500;
            // the deposit is unchanged (transaction rolled back) — admin retries.
            Log::warning('Deposit approval contended; ask admin to retry.', [
                'deposit_id' => $deposit->id,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors(['deposit' => 'Не удалось обработать депозит из-за конкурентного доступа. Повторите попытку.']);
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
