<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            // Per-level "Авто-вход" toggle (TЗ 6.1 / 4.3): auto-reinvest as soon
            // as the double lock is satisfied for this entry.
            $table->boolean('auto_reinvest')->default(false)->after('is_locked');
        });
    }

    public function down(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            $table->dropColumn('auto_reinvest');
        });
    }
};
