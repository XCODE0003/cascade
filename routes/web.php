<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepositController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\WestWalletIpnController;
use App\Http\Controllers\WithdrawalController;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\TrackLastSeen;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

// Marketing concept pages (linked from the footer).
Route::inertia('/double-lock', 'marketing/DoubleLock')->name('pages.double-lock');
Route::inertia('/cascade', 'marketing/Cascade')->name('pages.cascade');
Route::inertia('/anti-abuse', 'marketing/AntiAbuse')->name('pages.anti-abuse');
Route::inertia('/acid', 'marketing/Acid')->name('pages.acid');
Route::inertia('/hold', 'marketing/Hold')->name('pages.hold');

// WestWallet deposit notifications (IPN). CSRF-exempt; verified by signature.
Route::post('webhooks/westwallet', WestWalletIpnController::class)->name('webhooks.westwallet');

Route::middleware(['auth', 'verified', TrackLastSeen::class])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('partners', PartnerController::class)->name('partners');
    Route::get('history', HistoryController::class)->name('history');

    Route::get('wallet', WalletController::class)->name('wallet');

    // Deposits
    Route::post('deposits', [DepositController::class, 'store'])->name('deposits.store');
    Route::post('deposits/upgrade', [DepositController::class, 'upgrade'])->name('deposits.upgrade');

    // Withdrawals
    Route::post('withdrawals', [WithdrawalController::class, 'store'])->name('withdrawals.store');

    // Queue actions
    Route::post('queue/{levelId}/reinvest', [QueueController::class, 'reinvest'])->name('queue.reinvest');
    Route::post('queue/{levelId}/auto-reinvest', [QueueController::class, 'toggleAutoReinvest'])->name('queue.auto-reinvest');

    // Admin panel
    Route::middleware(EnsureAdmin::class)->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', Admin\IndexController::class)->name('index');

        Route::post('deposits/{deposit}/approve', [Admin\DepositController::class, 'approve'])->name('deposits.approve');
        Route::post('deposits/{deposit}/reject', [Admin\DepositController::class, 'reject'])->name('deposits.reject');

        Route::post('withdrawals/{withdrawal}/approve', [Admin\WithdrawalController::class, 'approve'])->name('withdrawals.approve');
        Route::post('withdrawals/{withdrawal}/reject', [Admin\WithdrawalController::class, 'reject'])->name('withdrawals.reject');

        Route::post('queue/auto-reinvest/run', [Admin\QueueController::class, 'runAutoReinvest'])->name('queue.auto-reinvest-run');
        Route::post('queue/{entry}/move-front', [Admin\QueueController::class, 'moveToFront'])->name('queue.move-front');
        Route::post('queue/{entry}/move-up', [Admin\QueueController::class, 'moveUp'])->name('queue.move-up');
        Route::post('queue/{entry}/move-down', [Admin\QueueController::class, 'moveDown'])->name('queue.move-down');
        Route::post('queue/{entry}/move-back', [Admin\QueueController::class, 'moveToBack'])->name('queue.move-back');
        Route::post('queue/{entry}/remove', [Admin\QueueController::class, 'remove'])->name('queue.remove');

        Route::delete('users/{user}', [Admin\UserController::class, 'destroy'])->name('users.destroy');

        Route::post('settings', [Admin\SettingController::class, 'update'])->name('settings.update');
    });
});

require __DIR__.'/settings.php';
