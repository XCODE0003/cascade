<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'hold_hours' => '72',
            'double_lock_days' => '7',
            'auto_reinvest_days' => '3',
            'min_withdrawal' => '30',
            'service_fee_percent' => '10',
        ];

        foreach ($settings as $key => $value) {
            SystemSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
