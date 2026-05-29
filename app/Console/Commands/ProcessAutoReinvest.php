<?php

namespace App\Console\Commands;

use App\Services\ReinvestService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('cascade:auto-reinvest')]
#[Description('Force-reinvest idle 5/5 accounts past the inactivity threshold (TЗ 4.3 / 7.5).')]
class ProcessAutoReinvest extends Command
{
    public function handle(ReinvestService $reinvestService): int
    {
        // Opt-in toggles first (immediate on cycle completion), then absentees.
        $reinvestService->processAutoReinvestForOptIns();
        $reinvestService->processAutoReinvestForAbsentees();

        $this->info('Auto-reinvest pass completed.');

        return self::SUCCESS;
    }
}
