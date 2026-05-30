<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CascadeUserSeeder extends Seeder
{
    public function run(): void
    {
        // firstOrCreate (not updateOrCreate): demo accounts are created once and
        // never clobbered on subsequent deploys/seeds (preserves password changes).
        User::firstOrCreate(
            ['email' => 'test@cascade.dev'],
            [
                'name' => 'Тест',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'balance' => 1248.00,
                'is_admin' => false,
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@cascade.dev'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
                'balance' => 0,
                'is_admin' => true,
            ]
        );
    }
}
