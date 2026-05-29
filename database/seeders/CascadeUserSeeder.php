<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CascadeUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'test@cascade.dev'],
            [
                'name' => 'Тест',
                'email' => 'test@cascade.dev',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'balance' => 1248.00,
                'is_admin' => false,
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@cascade.dev'],
            [
                'name' => 'Admin',
                'email' => 'admin@cascade.dev',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
                'balance' => 0,
                'is_admin' => true,
            ]
        );
    }
}
