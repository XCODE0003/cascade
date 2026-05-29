<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('signup_ip', 45)->nullable()->after('fingerprint');
            $table->string('last_ip', 45)->nullable()->after('signup_ip');

            $table->index('signup_ip');
            $table->index('fingerprint');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['signup_ip']);
            $table->dropIndex(['fingerprint']);
            $table->dropColumn(['signup_ip', 'last_ip']);
        });
    }
};
