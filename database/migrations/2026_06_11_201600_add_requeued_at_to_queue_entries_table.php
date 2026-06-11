<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            // Момент начала текущего цикла: ставится при входе в очередь и
            // обновляется при реинвесте. Используется для отображения «В очереди
            // с …», чтобы порядок очереди читался корректно (created_at остаётся
            // временем самого первого входа и для этого не годится).
            $table->timestamp('requeued_at')->nullable()->after('unlock_at');
        });

        // Backfill для уже существующих записей.
        DB::table('queue_entries')->whereNull('requeued_at')->update([
            'requeued_at' => DB::raw('created_at'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            $table->dropColumn('requeued_at');
        });
    }
};
