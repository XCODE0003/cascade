<?php

namespace App\Http\Controllers;

use App\Models\LedgerEntry;
use App\Models\Level;
use App\Models\SystemSetting;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user()->load('queueEntries.level');

        $levels = Level::all()->keyBy('id');

        $queues = $levels->map(function ($level) use ($user) {
            // Prefer the active entry (the one the cascade actually fills) over a
            // stale grey/frozen entry that may have a lower id — otherwise a fresh
            // cell looks like it "didn't land" because we showed the wrong row.
            $levelEntries = $user->queueEntries->where('level_id', $level->id);
            $entry = $levelEntries->firstWhere('status', 'active')
                ?? $levelEntries->firstWhere('status', 'grey')
                ?? $levelEntries->first();

            if (! $entry) {
                return [
                    'level' => $level->id,
                    'entry' => (float) $level->entry_amount,
                    'payout' => (float) $level->cycle_payout,
                    'filled' => 0,
                    'bonus' => 0,
                    'status' => 'inactive',
                    'timer' => null,
                    'auto' => false,
                ];
            }

            $unlockAt = $entry->unlock_at;
            $timerLabel = null;

            if ($entry->status === 'active' && $entry->cells_filled < 5) {
                $timerLabel = null;
            } elseif ($entry->status === 'active' && $entry->cells_filled >= 5) {
                if (now()->lt($unlockAt)) {
                    $timerLabel = $this->formatCountdown($unlockAt);
                } else {
                    $timerLabel = null; // ready to withdraw
                }
            } elseif ($entry->status === 'grey') {
                $timerLabel = null;
            }

            $status = match (true) {
                $entry->status === 'grey' => 'pending',
                $entry->isReady() => 'ready',
                $entry->status === 'active' && $entry->cells_filled >= 5 => 'locked',
                $entry->status === 'active' => 'locked',
                default => 'inactive',
            };

            return [
                'level' => $level->id,
                'entry' => (float) $level->entry_amount,
                'payout' => (float) $level->cycle_payout,
                'filled' => $entry->cells_filled,
                'bonus' => min($entry->bonus_cells_filled, $entry->cells_filled),
                'status' => $status,
                'timer' => $timerLabel,
                'auto' => (bool) $entry->auto_reinvest,
            ];
        })->values()->toArray();

        $history = $user->ledgerEntries()
            ->latest('created_at')
            ->limit(7)
            ->get()
            ->map(fn ($e) => $this->formatLedgerEntry($e))
            ->toArray();

        return Inertia::render('Dashboard', [
            'balance' => (float) $user->balance,
            'minWithdrawal' => (float) SystemSetting::get('min_withdrawal', 30),
            'holdHours' => (int) SystemSetting::get('hold_hours', 72),
            'queues' => $queues,
            'history' => $history,
        ]);
    }

    private function formatCountdown(CarbonInterface $target): string
    {
        $diff = now()->diff($target);
        $days = $diff->days;
        $h = str_pad($diff->h, 2, '0', STR_PAD_LEFT);
        $m = str_pad($diff->i, 2, '0', STR_PAD_LEFT);
        $s = str_pad($diff->s, 2, '0', STR_PAD_LEFT);

        return "{$days} д {$h}:{$m}:{$s}";
    }

    private function formatLedgerEntry(LedgerEntry $e): array
    {
        $typeMap = [
            'referral_bonus' => ['kind' => 'ref', 'title' => 'Реферальный бонус', 'sign' => 'pos'],
            'cell_income' => ['kind' => 'cell', 'title' => 'Закрашена ячейка', 'sign' => 'gold'],
            'withdrawal_requested' => ['kind' => 'hold', 'title' => 'Заявка на вывод · холд', 'sign' => 'warn'],
            'withdrawal_approved' => ['kind' => 'payout', 'title' => 'Выплата отправлена', 'sign' => 'neg'],
            'withdrawal_rejected' => ['kind' => 'payout', 'title' => 'Вывод отклонён', 'sign' => 'pos'],
            'reinvest' => ['kind' => 'reinv', 'title' => 'Реинвест', 'sign' => 'neg'],
            'auto_reinvest' => ['kind' => 'reinv', 'title' => 'Авто-реинвест', 'sign' => 'neg'],
            'cell_unplaced' => ['kind' => 'other', 'title' => 'Ячейки без получателя (очередь пуста)', 'sign' => 'neu'],
            'deposit_confirmed' => ['kind' => 'deposit', 'title' => 'Депозит подтверждён', 'sign' => 'neu'],
            'upgrade' => ['kind' => 'deposit', 'title' => 'Апгрейд с баланса', 'sign' => 'neg'],
            'system_fee' => ['kind' => 'fee', 'title' => 'Комиссия сервиса', 'sign' => 'neg'],
            'bonus_cell_missed' => ['kind' => 'ref', 'title' => 'Упущенный бонус', 'sign' => 'neg'],
        ];

        $info = $typeMap[$e->type] ?? ['kind' => 'other', 'title' => $e->type, 'sign' => 'neu'];
        $levelLabel = $e->level_id ? "Level {$e->level_id}" : null;

        return [
            'kind' => $info['kind'],
            'title' => $info['title'],
            'sub' => $levelLabel ?? '',
            'amount' => ($e->amount > 0 ? '+' : '').number_format((float) $e->amount, 2, ',', ' '),
            'sign' => $info['sign'],
            'time' => $e->created_at->diffForHumans(null, true, true),
        ];
    }
}
