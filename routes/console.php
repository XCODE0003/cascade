<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Release withdrawal holds (hold → pending) once the 72h window passes.
Schedule::command('cascade:release-holds')->everyFiveMinutes()->withoutOverlapping();

// Force-reinvest idle 5/5 accounts past the inactivity threshold.
Schedule::command('cascade:auto-reinvest')->hourly()->withoutOverlapping();
