<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class PrivilegedMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    public function handle(Request $request, Closure $next): Response
    {
        // Check if the authenticated user has a privileged role
        if ($request->user() && ($request->user()->role->name === 'admin' || $request->user()->role->name === 'manager')) {
            return $next($request);
        }

        // If the user is not privileged, return a response indicating insufficient privileges
        return response()->json([
            'error' => 'Insufficient privileges',
        ], 403);
    }
}