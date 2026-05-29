<?php

namespace App\Console\Commands;

use App\Services\WithdrawalService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('cascade:release-holds')]
#[Description('Move withdrawals whose 72h hold has expired from "hold" to "pending" (TЗ 6.4).')]
class ReleaseExpiredHolds extends Command
{
    public function handle(WithdrawalService $withdrawalService): int
    {
        $withdrawalService->releaseExpiredHolds();

        $this->info('Expired holds released.');

        return self::SUCCESS;
    }
}
