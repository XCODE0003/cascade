<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('non-admin users cannot access the admin panel', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)
        ->get(route('admin.index'))
        ->assertForbidden();
});

test('admins see the panel with users, stats and tables', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    User::factory()->count(3)->create();

    $this->actingAs($admin)
        ->get(route('admin.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Index')
            ->has('stats')
            ->where('stats.users_total', 4)
            ->has('users', 4)
            ->has('users.0', fn (Assert $u) => $u
                ->where('tag', fn ($tag) => str_starts_with($tag, 'u_'))
                ->hasAll(['id', 'name', 'email', 'balance', 'is_admin', 'deposit_address', 'referrals_count'])
                ->etc()
            )
            ->has('deposits')
            ->has('withdrawals')
            ->has('queues')
            ->has('settings'),
        );
});
