<?php

namespace App\Http\Controllers;

use App\Models\QueueEntry;
use App\Services\ReinvestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    public function __construct(protected ReinvestService $reinvestService) {}

    public function reinvest(Request $request, int $levelId): RedirectResponse
    {
        $entry = QueueEntry::where('user_id', $request->user()->id)
            ->where('level_id', $levelId)
            ->where('status', 'active')
            ->firstOrFail();

        try {
            $this->reinvestService->reinvest($request->user(), $entry->level_id);
        } catch (\Exception $e) {
            return back()->withErrors(['reinvest' => $e->getMessage()]);
        }

        return back()->with('success', 'Реинвест выполнен.');
    }

    /**
     * Toggle the per-level "Авто-вход" (auto-reinvest after cycle) flag.
     */
    public function toggleAutoReinvest(Request $request, int $levelId): RedirectResponse
    {
        $data = $request->validate(['enabled' => 'required|boolean']);

        $entry = QueueEntry::where('user_id', $request->user()->id)
            ->where('level_id', $levelId)
            ->whereIn('status', ['active', 'grey'])
            ->firstOrFail();

        $entry->update(['auto_reinvest' => $data['enabled']]);

        return back()->with('success', $data['enabled'] ? 'Авто-вход включён.' : 'Авто-вход выключен.');
    }
}
