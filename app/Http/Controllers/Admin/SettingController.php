<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'hold_hours' => 'required|integer|min:1|max:720',
            'double_lock_days' => 'required|integer|min:1|max:30',
            'auto_reinvest_days' => 'required|integer|min:1|max:30',
            'min_withdrawal' => 'required|numeric|min:1',

            // WestWallet payment gateway
            'westwallet_base_url' => 'nullable|string|max:255',
            'westwallet_public_key' => 'nullable|string|max:255',
            'westwallet_private_key' => 'nullable|string|max:255',
            'westwallet_currency' => 'nullable|string|max:32',
            'westwallet_ipn_secret' => 'nullable|string|max:255',
            'westwallet_auto_payout' => 'required|boolean',
        ]);

        $data['westwallet_auto_payout'] = $data['westwallet_auto_payout'] ? '1' : '0';

        foreach ($data as $key => $value) {
            SystemSetting::set($key, $value ?? '');
        }

        return back()->with('success', 'Настройки сохранены.');
    }
}
