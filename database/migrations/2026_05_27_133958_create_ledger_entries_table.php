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
        Schema::create('ledger_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // deposit_confirmed | withdrawal_requested | withdrawal_approved | withdrawal_rejected | referral_bonus | cell_income | reinvest | auto_reinvest | upgrade | system_fee | bonus_cell_missed
            $table->decimal('amount', 20, 2);
            $table->decimal('balance_after', 20, 2);
            $table->nullableMorphs('reference');
            $table->foreignId('queue_entry_id')->nullable()->constrained('queue_entries')->nullOnDelete();
            $table->unsignedTinyInteger('level_id')->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id', 'created_at']);
            $table->index(['user_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ledger_entries');
    }
};
