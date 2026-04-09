<?php

namespace App\Http\Controllers\API\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\HouseService;
use App\Http\Responses\Landlord\HouseResponse; // reusing existing response
use App\Traits\HttpResponse;
use App\Models\RentalApplication;
use App\Models\Rental;

class HouseController extends Controller
{
    use HttpResponse;
    protected HouseService $service;

    public function __construct(HouseService $service)
    {
        $this->service = $service;
    }

    /**
     * List all houses for tenants (excluding applied/rented houses).
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'min_price',
            'max_price',
            'type',
            'bedrooms',
            'bathrooms',
            'min_area',
            'max_area',
            'city',
            'street',
            'township',
            'area',
            'amenties',
            'furnitures'
        ]);

        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 12);

        // Get tenant profile ID from authenticated user
        $tenantProfileId = null;
        if ($request->user()) {
            $tenantProfile = $request->user()->tenantProfile;
            if ($tenantProfile) {
                $tenantProfileId = $tenantProfile->id;
            }
        }

        $houses = $this->service->listForTenants($filters, $tenantProfileId, $page, $perPage);
        return $this->success(true, HouseResponse::list($houses), 'House Retrieved Successfully!', 200);
    }

    /**
     * Show a single house to tenant.
     */
    public function show(Request $request, $idOrSlug): JsonResponse
    {
        $house = $this->service->find($idOrSlug);
        $houseId = $house->id;

        // Check if house has an active rental
        $hasActiveRental = Rental::where('house_id', $houseId)
            ->where('status', 'active')
            ->exists();

        // Check if this tenant has a pending/approved application
        $tenantProfileId = null;
        $hasApplication = false;
        if ($request->user()) {
            $tenantProfile = $request->user()->tenantProfile;
            if ($tenantProfile) {
                $tenantProfileId = $tenantProfile->id;
                $hasApplication = RentalApplication::where('house_id', $houseId)
                    ->where('tenant_profile_id', $tenantProfileId)
                    ->whereIn('status', ['pending', 'approved'])
                    ->exists();
            }
        }

        $houseData = HouseResponse::single($house);
        $houseData['is_available'] = !$hasActiveRental && !$hasApplication;
        $houseData['application_status'] = $hasApplication ?
            RentalApplication::where('house_id', $houseId)
                ->where('tenant_profile_id', $tenantProfileId)
                ->first()->status ?? null : null;

        return $this->success(true, $houseData, 'House Retrieved Successfully!', 200);
    }

    public function getHousesByType(Request $request, $type): JsonResponse
    {
        // Get tenant profile ID from authenticated user
        $tenantProfileId = null;
        if ($request->user()) {
            $tenantProfile = $request->user()->tenantProfile;
            if ($tenantProfile) {
                $tenantProfileId = $tenantProfile->id;
            }
        }

        $houses = $this->service->listForTenants(['type' => $type], $tenantProfileId);
        return $this->success(true, HouseResponse::list($houses), 'House retrieved by type!', 200);
    }
}
