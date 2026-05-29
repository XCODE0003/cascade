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
        Schema::create('queue_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('level_id');
            $table->foreign('level_id')->references('id')->on('levels');
            $table->unsignedTinyInteger('cells_filled')->default(0);
            $table->string('status')->default('active'); // active | grey | pending_withdrawal | completed
            $table->unsignedInteger('position');
            $table->timestamp('unlock_at');
            $table->timestamps();

            $table->index(['level_id', 'status', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('queue_entries');
    }
};
