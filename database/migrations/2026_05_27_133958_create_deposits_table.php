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
        Schema::create('deposits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('level_id');
            $table->foreign('level_id')->references('id')->on('levels');
            $table->decimal('amount', 12, 2);
            $table->string('wallet_address')->nullable();
            $table->string('tx_hash')->nullable();
            $table->string('type')->default('external'); // external | upgrade
            $table->string('status')->default('pending'); // pending | approved | rejected
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deposits');
    }
};
