<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
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

        $holdHours = (int) SystemSetting::get('hold_hours', 72);

        return back()->with('success', $holdHours > 0
            ? "Заявка на вывод создана. Холд {$holdHours} ч."
            : 'Заявка на вывод создана и ожидает выплаты.');
    }
}
