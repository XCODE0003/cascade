<?php

namespace App\Http\Controllers;

use App\Services\WithdrawalService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WithdrawalController extends Controller
{
    public function __construct(protected WithdrawalService $withdrawalService) {}

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'wallet_address' => 'required|string|max:64',
        ]);

        try {
            $this->withdrawalService->request(
                $request->user(),
                (float) $data['amount'],
                $data['wallet_address']
            );
        } catch (\RuntimeException $e) {
            return back()->withErrors(['withdrawal' => $e->getMessage()]);
        }

        return back()->with('success', 'Заявка на вывод создана. Холд 72 часа.');
    }
}
