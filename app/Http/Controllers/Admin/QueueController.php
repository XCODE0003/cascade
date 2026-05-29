<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QueueEntry;
use App\Services\QueueService;
use Illuminate\Http\RedirectResponse;

class QueueController extends Controller
{
    public function __construct(protected QueueService $queueService) {}

    public function moveToFront(QueueEntry $entry): RedirectResponse
    {
        $entry->position = 0;
        $entry->save();
        $this->queueService->renumber($entry->level_id);

        return back()->with('success', 'Позиция обновлена.');
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
