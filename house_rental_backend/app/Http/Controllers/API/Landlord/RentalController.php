<?php

namespace App\Http\Controllers\API\Landlord;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\RentalService;
use App\Http\Requests\Landlord\StoreRentalRequest;
use App\Http\Requests\Landlord\UpdateRentalRequest;
use App\Traits\HttpResponse;
use App\Http\Responses\RentalResponse;
use App\Models\Notification;

class RentalController extends Controller
{
    use HttpResponse;

    protected RentalService $service;

    public function __construct(RentalService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $rentals = $this->service->listByLandlord($landlordProfileId);
        return $this->success(true, RentalResponse::list($rentals), 'Rentals retrieved', 200);
    }

    public function store(StoreRentalRequest $request): JsonResponse
    {
        $data = $request->validated();
        $rental = $this->service->create($data);
        
        // Create notification for tenant when rental is created
        $tenant = $rental->tenantProfile?->user;
        $house = $rental->house;
        
        if ($tenant) {
            $landlordName = $rental->landlordProfile?->user?->name ?? 'Your landlord';
            $houseTitle = $house?->title ?? 'the property';
            
            Notification::create([
                'user_id' => $tenant->id,
                'type' => 'rental_created',
                'message' => "Your rental for '{$houseTitle}' has been created by {$landlordName}. Welcome home!",
                'url' => "/tenant/rentals/{$rental->id}",
                'data' => [
                    'rental_id' => $rental->id,
                    'house_id' => $house?->id,
                    'monthly_rent' => $rental->monthly_rent,
                ],
            ]);
        }
        
        return $this->success(true, RentalResponse::created($rental), 'Rental created', 201);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $rental = $this->service->findForLandlord($id, $landlordProfileId);
        return $this->success(true, RentalResponse::single($rental), 'Rental retrieved', 200);
    }

    public function update(UpdateRentalRequest $request, $id): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $data = $request->validated();
        $rental = $this->service->update($id, $data, $landlordProfileId);
        return $this->success(true, RentalResponse::updated($rental), 'Rental updated', 200);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $this->service->delete($id, $landlordProfileId);
        return $this->success(true, RentalResponse::deleted(), 'Rental deleted', 200);
    }
}
