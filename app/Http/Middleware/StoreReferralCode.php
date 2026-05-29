<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StoreReferralCode
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->has('ref') && ! $request->session()->has('referrer_id')) {
            $ref = (int) $request->query('ref');
            if ($ref > 0) {
                $request->session()->put('referrer_id', $ref);
            }
        }

        return $next($request);
    }
}
