<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Ставится при первом выполнении условий двойного замка (или при
            // реинвесте). После этого вывод остатка баланса остаётся доступен,
            // даже если активная запись сброшена реинвестом в 0/5.
            $table->timestamp('withdrawal_unlocked_at')->nullable()->after('last_seen_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('withdrawal_unlocked_at');
        });
    }
};
