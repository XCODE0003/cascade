<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Level extends Model
{
    public $incrementing = false;

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'entry_amount' => 'decimal:2',
            'cell_payout' => 'decimal:2',
            'cycle_payout' => 'decimal:2',
        ];
    }

    public function queueEntries(): HasMany
    {
        return $this->hasMany(QueueEntry::class);
    }
}
