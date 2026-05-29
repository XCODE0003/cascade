<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('balance', 20, 2)->default(0)->after('email');
            $table->foreignId('referrer_id')->nullable()->constrained('users')->nullOnDelete()->after('balance');
            $table->string('fingerprint')->nullable()->after('referrer_id');
            $table->timestamp('last_seen_at')->nullable()->after('fingerprint');
            $table->boolean('is_admin')->default(false)->after('last_seen_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['balance', 'referrer_id', 'fingerprint', 'last_seen_at', 'is_admin']);
        });
    }
};
