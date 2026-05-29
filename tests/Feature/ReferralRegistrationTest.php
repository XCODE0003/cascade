<?php

use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('a ref query parameter is stored in the session', function () {
    $this->get('/?ref=42')
        ->assertSessionHas('referrer_id', 42);
});

test('registration assigns the referrer captured in the session', function () {
    $referrer = User::factory()->create();

    $this->withSession(['referrer_id' => $referrer->id])
        ->post(route('register.store'), [
            'name' => 'Referred User',
            'email' => 'referred@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertRedirect(route('dashboard', absolute: false));

    $this->assertDatabaseHas('users', [
        'email' => 'referred@example.com',
        'referrer_id' => $referrer->id,
    ]);
});

test('registration without a referrer leaves referrer_id null', function () {
    $this->post(route('register.store'), [
        'name' => 'Solo User',
        'email' => 'solo@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->assertDatabaseHas('users', [
        'email' => 'solo@example.com',
        'referrer_id' => null,
    ]);
});

test('a self-referral from the same IP drops the referrer (anti-abuse)', function () {
    // Referrer registered from the same IP the test client uses (127.0.0.1).
    $referrer = User::factory()->create(['signup_ip' => '127.0.0.1']);

    $this->withSession(['referrer_id' => $referrer->id])
        ->post(route('register.store'), [
            'name' => 'Sock Puppet',
            'email' => 'sock@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertRedirect(route('dashboard', absolute: false));

    $this->assertDatabaseHas('users', [
        'email' => 'sock@example.com',
        'referrer_id' => null,
    ]);
});

test('a self-referral from the same fingerprint drops the referrer', function () {
    $referrer = User::factory()->create(['fingerprint' => 'fp_shared', 'signup_ip' => '9.9.9.9']);

    $this->withSession(['referrer_id' => $referrer->id])
        ->post(route('register.store'), [
            'name' => 'Clone',
            'email' => 'clone@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'fingerprint' => 'fp_shared',
        ])
        ->assertRedirect(route('dashboard', absolute: false));

    $this->assertDatabaseHas('users', [
        'email' => 'clone@example.com',
        'referrer_id' => null,
    ]);
});
