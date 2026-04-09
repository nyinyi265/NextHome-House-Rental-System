<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandlordProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Traits\HttpResponse;

class LandlordRequestController extends Controller
{
    use HttpResponse;

    public function index(): JsonResponse
    {
        $landlords = LandlordProfile::with(['user', 'documents'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success(true, $landlords, 'Landlord requests retrieved', 200);
    }

    public function pending(): JsonResponse
    {
        $landlords = LandlordProfile::with(['user', 'documents'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success(true, $landlords, 'Pending landlord requests retrieved', 200);
    }

    public function approve(Request $request, $id): JsonResponse
    {
        $landlordProfile = LandlordProfile::findOrFail($id);
        
        $landlordProfile->update([
            'status' => 'approved',
            'verified_at' => now(),
        ]);

        return $this->success(true, $landlordProfile->fresh(['user']), 'Landlord approved successfully', 200);
    }

    public function reject(Request $request, $id): JsonResponse
    {
        $landlordProfile = LandlordProfile::findOrFail($id);
        
        $landlordProfile->update([
            'status' => 'rejected',
        ]);

        return $this->success(true, $landlordProfile->fresh(['user']), 'Landlord rejected', 200);
    }
}