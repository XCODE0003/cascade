<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QueueEntry;
use App\Models\SystemSetting;
use App\Models\Withdrawal;
use App\Services\WithdrawalService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    public function update(Request $request, WithdrawalService $withdrawalService): RedirectResponse
    {
        $data = $request->validate([
            // 0 разрешён намеренно: на тесте нужно снимать ограничения на
            // вывод полностью, не дожидаясь холда и двойного замка.
            'hold_hours' => 'required|integer|min:0|max:720',
            'double_lock_days' => 'required|integer|min:0|max:30',
            'auto_reinvest_days' => 'required|integer|min:1|max:30',
            'min_withdrawal' => 'required|numeric|min:0',

            // WestWallet payment gateway
            'westwallet_base_url' => 'nullable|string|max:255',
            'westwallet_public_key' => 'nullable|string|max:255',
            'westwallet_private_key' => 'nullable|string|max:255',
            'westwallet_currency' => 'nullable|string|max:32',
            'westwallet_ipn_secret' => 'nullable|string|max:255',
            'westwallet_auto_payout' => 'required|boolean',
        ]);

        $data['westwallet_auto_payout'] = $data['westwallet_auto_payout'] ? '1' : '0';

        // Атомарно: настройки и пересчёт сроков существующих записей не должны
        // расходиться, если параллельный запрос читает их между запросами.
        DB::transaction(function () use ($data, $withdrawalService) {
            foreach ($data as $key => $value) {
                SystemSetting::set($key, $value ?? '');
            }

            $this->applyTimingsToExistingRecords(
                (int) $data['double_lock_days'],
                (int) $data['hold_hours'],
                $withdrawalService,
            );
        });

        return back()->with('success', 'Настройки сохранены.');
    }

    /**
     * Новые тайминги применяются и к уже существующим записям, иначе смена
     * настройки влияет только на новые входы (баг «изменилось только в 1 лвле»).
     * Сроки только сокращаются (LEAST), продлевать задним числом нельзя.
     */
    protected function applyTimingsToExistingRecords(int $lockDays, int $holdHours, WithdrawalService $withdrawalService): void
    {
        $lockDeadline = now()->addDays($lockDays);

        QueueEntry::whereIn('status', ['active', 'grey'])
            ->where('unlock_at', '>', $lockDeadline)
            ->update(['unlock_at' => $lockDeadline]);

        $holdDeadline = now()->addHours($holdHours);

        Withdrawal::where('status', 'hold')
            ->where('hold_until', '>', $holdDeadline)
            ->update(['hold_until' => $holdDeadline]);

        // Сразу переводим истёкшие холды в «ожидает выплаты».
        $withdrawalService->releaseExpiredHolds();
    }
}
