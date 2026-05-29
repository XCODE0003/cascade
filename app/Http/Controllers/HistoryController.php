<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $entries = $user->ledgerEntries()
            ->latest('created_at')
            ->limit(100)
            ->get();

        $totalIncome = (float) $user->ledgerEntries()
            ->whereIn('type', ['referral_bonus', 'cell_income'])
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('amount');

        $totalReinvest = (float) $user->ledgerEntries()
            ->whereIn('type', ['reinvest', 'auto_reinvest'])
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        $totalWithdrawn = abs((float) $user->ledgerEntries()
            ->where('type', 'withdrawal_requested')
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('amount'));

        $totalOps = $user->ledgerEntries()
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        $typeMap = [
            'referral_bonus' => ['kind' => 'ref', 'title' => 'Реферальный бонус', 'sign' => 'pos'],
            'cell_income' => ['kind' => 'cell', 'title' => 'Закрашена ячейка', 'sign' => 'gold'],
            'withdrawal_requested' => ['kind' => 'hold', 'title' => 'Заявка на вывод · холд', 'sign' => 'warn'],
            'withdrawal_approved' => ['kind' => 'payout', 'title' => 'Выплата отправлена', 'sign' => 'neg'],
            'withdrawal_rejected' => ['kind' => 'restore', 'title' => 'Вывод отклонён · возврат', 'sign' => 'pos'],
            'reinvest' => ['kind' => 'reinv', 'title' => 'Реинвест', 'sign' => 'neg'],
            'auto_reinvest' => ['kind' => 'reinv', 'title' => 'Авто-реинвест за прогулы', 'sign' => 'neg'],
            'upgrade' => ['kind' => 'deposit', 'title' => 'Апгрейд с баланса', 'sign' => 'neg'],
            'deposit_confirmed' => ['kind' => 'deposit', 'title' => 'Депозит подтверждён', 'sign' => 'neu'],
            'system_fee' => ['kind' => 'fee', 'title' => 'Комиссия сервиса 10%', 'sign' => 'neg'],
            'bonus_cell_missed' => ['kind' => 'ref', 'title' => 'Упущенный бонус', 'sign' => 'neg'],
        ];

        $rows = $entries->map(function ($e) use ($typeMap) {
            $info = $typeMap[$e->type] ?? ['kind' => 'other', 'title' => $e->type, 'sign' => 'neu'];
            $levelLabel = $e->level_id ? "Level {$e->level_id}" : null;

            return [
                'id' => $e->id,
                'kind' => $info['kind'],
                'title' => $info['title'],
                'sub' => $levelLabel ?? '',
                'amount' => ($e->amount > 0 ? '+' : '').number_format((float) $e->amount, 2, ',', ' '),
                'sign' => $info['sign'],
                'time' => $e->created_at->toDateTimeString(),
                'date' => $e->created_at->locale('ru')->isoFormat('D MMMM'),
            ];
        })->toArray();

        return Inertia::render('History', [
            'totalIncome' => $totalIncome,
            'totalReinvest' => $totalReinvest,
            'totalWithdrawn' => $totalWithdrawn,
            'totalOps' => $totalOps,
            'rows' => $rows,
        ]);
    }
}
