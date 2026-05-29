<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    public function run(): void
    {
        $levels = [
            ['id' => 1, 'entry_amount' => 20.00, 'cell_payout' => 6.00, 'cycle_payout' => 30.00],
            ['id' => 2, 'entry_amount' => 100.00, 'cell_payout' => 30.00, 'cycle_payout' => 150.00],
            ['id' => 3, 'entry_amount' => 700.00, 'cell_payout' => 210.00, 'cycle_payout' => 1050.00],
            ['id' => 4, 'entry_amount' => 2000.00, 'cell_payout' => 600.00, 'cycle_payout' => 3000.00],
        ];

        foreach ($levels as $level) {
            Level::updateOrCreate(['id' => $level['id']], $level);
        }
    }
}
