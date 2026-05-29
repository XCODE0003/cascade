<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            // Set when an entry is frozen by a pending withdrawal (TЗ 3.6.3),
            // so the position can be restored if the admin rejects the payout.
            $table->boolean('is_locked')->default(false)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            $table->dropColumn('is_locked');
        });
    }
};
