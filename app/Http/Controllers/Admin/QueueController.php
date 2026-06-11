<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QueueEntry;
use App\Services\QueueService;
use App\Services\ReinvestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class QueueController extends Controller
{
    public function __construct(
        protected QueueService $queueService,
        protected ReinvestService $reinvestService,
    ) {}

    /**
     * Запустить авто-реинвест вручную (диагностика без ожидания планировщика):
     * прогоняет opt-in (включённый «Авто-вход») и отсутствующих пользователей.
     */
    public function runAutoReinvest(): RedirectResponse
    {
        $optIns = $this->reinvestService->processAutoReinvestForOptIns();
        $absentees = $this->reinvestService->processAutoReinvestForAbsentees();
        $total = $optIns + $absentees;

        return back()->with('success', $total > 0
            ? "Авто-реинвест выполнен для {$total} записей."
            : 'Готовых к авто-реинвесту записей не найдено (нужно 5/5, истёкший замок и баланс на повторный вход).');
    }

    public function moveToFront(QueueEntry $entry): RedirectResponse
    {
        $entry->position = 0;
        $entry->save();
        $this->queueService->renumber($entry->level_id);

        return back()->with('success', 'Позиция обновлена.');
    }

    /**
     * Move the entry up one row (swap positions with the active neighbour
     * directly above it). No-op when it is already at the top.
     */
    public function moveUp(QueueEntry $entry): RedirectResponse
    {
        $this->swapWithNeighbour($entry, 'up');

        return back()->with('success', 'Позиция обновлена.');
    }

    /**
     * Move the entry down one row (swap positions with the active neighbour
     * directly below it). No-op when it is already at the bottom.
     */
    public function moveDown(QueueEntry $entry): RedirectResponse
    {
        $this->swapWithNeighbour($entry, 'down');

        return back()->with('success', 'Позиция обновлена.');
    }

    /**
     * Swap the entry's position with its immediate active neighbour, then
     * renumber the level so positions stay contiguous.
     *
     * @param  'up'|'down'  $direction
     */
    protected function swapWithNeighbour(QueueEntry $entry, string $direction): void
    {
        DB::transaction(function () use ($entry, $direction) {
            $neighbour = QueueEntry::where('level_id', $entry->level_id)
                ->where('status', 'active')
                ->where('id', '!=', $entry->id)
                ->when(
                    $direction === 'up',
                    fn ($q) => $q->where('position', '<', $entry->position)->orderByDesc('position'),
                    fn ($q) => $q->where('position', '>', $entry->position)->orderBy('position'),
                )
                ->lockForUpdate()
                ->first();

            if (! $neighbour) {
                return;
            }

            [$entry->position, $neighbour->position] = [$neighbour->position, $entry->position];
            $entry->save();
            $neighbour->save();

            $this->queueService->renumber($entry->level_id);
        });
    }

    public function moveToBack(QueueEntry $entry): RedirectResponse
    {
        $max = QueueEntry::where('level_id', $entry->level_id)
            ->where('status', 'active')
            ->max('position') ?? 0;

        $entry->position = $max + 1;
        $entry->save();
        $this->queueService->renumber($entry->level_id);

        return back()->with('success', 'Позиция обновлена.');
    }

    public function remove(QueueEntry $entry): RedirectResponse
    {
        $entry->update(['status' => 'grey']);
        $this->queueService->renumber($entry->level_id);

        return back()->with('success', 'Участник выведен из очереди.');
    }
}
