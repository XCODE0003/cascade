<?php

namespace App\Http\Controllers;

use App\Models\LedgerEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user()->load(['referrals.queueEntries', 'queueEntries']);

        $referralLink = url('/').'?ref='.$user->id;

        $hasActivePackage = $user->queueEntries->where('status', 'active')->isNotEmpty();

        $totalEarned = (float) $user->ledgerEntries()
            ->where('type', 'referral_bonus')
            ->sum('amount');

        $totalMissed = (float) $user->ledgerEntries()
            ->where('type', 'bonus_cell_missed')
            ->sum(DB::raw('CAST(json_extract(meta, "$.missed_amount") AS REAL)'));

        $activeCount = 0;
        $partners = $user->referrals->map(function ($ref) use (&$activeCount) {
            $activeEntry = $ref->queueEntries->where('status', 'active')->sortByDesc('level_id')->first();
            $isActive = $activeEntry !== null;
            if ($isActive) {
                $activeCount++;
            }

            $earned = (float) LedgerEntry::where('user_id', $user->id ?? 0)
                ->where('type', 'referral_bonus')
                ->whereJsonContains('meta->from_user_id', $ref->id)
                ->sum('amount');

            return [
                'id' => $ref->id,
                'name' => $ref->name,
                'level' => $activeEntry ? $activeEntry->level_id : null,
                'earned' => $earned,
                'joined' => $ref->created_at->diffForHumans(null, true, true),
                'active' => $isActive,
            ];
        })->values()->toArray();

        $filledCells = $user->queueEntries()
            ->where('status', 'active')
            ->orderByDesc('level_id')
            ->value('cells_filled') ?? 0;

        $maxLevel = $user->queueEntries()->where('status', 'active')->max('level_id') ?? 1;

        return Inertia::render('Partners', [
            'referralLink' => $referralLink,
            'referralActive' => $hasActivePackage,
            'totalEarned' => $totalEarned,
            'totalMissed' => $totalMissed,
            'filledCells' => $filledCells,
            'maxLevel' => $maxLevel,
            'partnersCount' => count($partners),
            'activeCount' => $activeCount,
            'partners' => $partners,
        ]);
    }
}
