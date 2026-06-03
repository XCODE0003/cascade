<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Hard-delete a user. Related deposits, withdrawals, queue entries and
     * ledger entries cascade away (FK cascadeOnDelete); the user's referrals
     * are detached (referrer_id nullOnDelete), preserving the downline.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->withErrors(['user' => 'Нельзя удалить собственный аккаунт.']);
        }

        if ($user->is_admin) {
            return back()->withErrors(['user' => 'Нельзя удалить администратора.']);
        }

        $user->delete();

        return back()->with('success', 'Пользователь удалён.');
    }
}
