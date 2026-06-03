<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * How many of the entry's filled cells came from referral bonus cells
     * (rendered gold), as opposed to regular cascade cells (rendered green).
     */
    public function up(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            $table->unsignedTinyInteger('bonus_cells_filled')->default(0)->after('cells_filled');
        });
    }

    public function down(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            $table->dropColumn('bonus_cells_filled');
        });
    }
};
