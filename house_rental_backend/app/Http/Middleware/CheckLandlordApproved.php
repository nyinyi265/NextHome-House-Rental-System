<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckLandlordApproved
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Check if user has landlord role
        $hasLandlordRole = $user->hasRole('landlord');
        
        if (!$hasLandlordRole) {
            return response()->json([
                'status' => false,
                'message' => 'Access denied. Landlord role required.'
            ], 403);
        }

        // Check if landlord profile exists and is approved
        $landlordProfile = $user->landlordProfile;
        
        if (!$landlordProfile) {
            return response()->json([
                'status' => false,
                'message' => 'Access denied. Landlord profile not found.'
            ], 403);
        }

        if ($landlordProfile->status !== 'approved') {
            return response()->json([
                'status' => false,
                'message' => 'Access denied. Your landlord account is pending approval.'
            ], 403);
        }

        return $next($request);
    }
}