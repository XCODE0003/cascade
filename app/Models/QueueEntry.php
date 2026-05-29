<?php

namespace App\Models;

use Database\Factories\QueueEntryFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QueueEntry extends Model
{
    /** @use HasFactory<QueueEntryFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id', 'level_id', 'cells_filled', 'status', 'is_locked', 'auto_reinvest', 'position', 'unlock_at',
    ];

    protected function casts(): array
    {
        return [
            'cells_filled' => 'integer',
            'position' => 'integer',
            'is_locked' => 'boolean',
            'auto_reinvest' => 'boolean',
            'unlock_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function isReady(): bool
    {
        return $this->cells_filled >= 5 && now()->gte($this->unlock_at);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeForQueue(Builder $query, int $levelId): Builder
    {
        return $query->where('level_id', $levelId)->active()->orderBy('position');
    }
}
