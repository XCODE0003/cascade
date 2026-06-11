<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Release withdrawal holds (hold → pending) once the 72h window passes.
Schedule::command('cascade:release-holds')->everyFiveMinutes()->withoutOverlapping();

// Авто-реинвест: opt-in («Авто-вход после цикла») должен срабатывать почти
// сразу после завершения цикла, поэтому гоняем каждые 5 минут (а не раз в час).
Schedule::command('cascade:auto-reinvest')->everyFiveMinutes()->withoutOverlapping();
