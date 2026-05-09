<?php

namespace App\Http\Controllers\API\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\RentalApplicationService;
use App\Http\Requests\Tenant\StoreRentalApplicationRequest;
use App\Http\Requests\Tenant\UpdateRentalApplicationRequest;
use App\Traits\HttpResponse;
use App\Http\Responses\RentalApplicationResponse;
use App\Models\RentalApplication;
use App\Models\Rental;
use App\Models\Notification;

class RentalApplicationController extends Controller
{
    use HttpResponse;

    protected RentalApplicationService $service;

    public function __construct(RentalApplicationService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $tenantProfileId = $request->user()->tenantProfile->id;
        $apps = $this->service->listByTenant($tenantProfileId);
        return $this->success(true, RentalApplicationResponse::list($apps), 'Applications retrieved', 200);
    }

    public function store(StoreRentalApplicationRequest $request): JsonResponse
    {
        $tenantProfileId = $request->user()->tenantProfile->id;
        $data = $request->validated();
        $houseId = $data['house_id'];

        // Check if tenant already has a pending or approved application for this house
        $existingApplication = RentalApplication::where('house_id', $houseId)
            ->where('tenant_profile_id', $tenantProfileId)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingApplication) {
            return $this->fail(false, null, 'You already have an active application for this house', 422);
        }

        // Check if house already has an active rental
        $activeRental = Rental::where('house_id', $houseId)
            ->where('status', 'active')
            ->first();

        if ($activeRental) {
            return $this->fail(false, null, 'This house is already rented', 422);
        }

        $app = $this->service->create($data, $tenantProfileId);
        
        // Create notification for landlord
        $house = $app->house;
        $landlord = $house->landlordProfile?->user;
        
        if ($landlord) {
            $tenantName = $app->tenantProfile?->user?->name ?? 'A tenant';
            $houseTitle = $house->title ?? 'your property';
            
            Notification::create([
                'user_id' => $landlord->id,
                'type' => 'rental_application',
                'message' => "New rental application from {$tenantName} for '{$houseTitle}'",
                'url' => "/landlord/rental-applications/{$app->id}",
                'data' => [
                    'application_id' => $app->id,
                    'house_id' => $houseId,
                    'tenant_name' => $tenantName,
                ],
            ]);
        }
        
        // Create notification for tenant confirming their application
        $tenantUser = $request->user();
        if ($tenantUser) {
            $houseTitle = $house->title ?? 'the property';
            Notification::create([
                'user_id' => $tenantUser->id,
                'type' => 'rental_application_submitted',
                'message' => "Your rental application for '{$houseTitle}' has been submitted successfully.",
                'url' => "/tenant/my-applications/{$app->id}",
                'data' => [
                    'application_id' => $app->id,
                    'house_id' => $houseId,
                    'status' => 'pending',
                ],
            ]);
        }
        
        return $this->success(true, RentalApplicationResponse::created($app), 'Application submitted', 201);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $tenantProfileId = $request->user()->tenantProfile->id;
        $app = $this->service->findForTenant($id, $tenantProfileId);
        return $this->success(true, RentalApplicationResponse::single($app), 'Application retrieved', 200);
    }

    public function update(UpdateRentalApplicationRequest $request, $id): JsonResponse
    {
        $tenantProfileId = $request->user()->tenantProfile->id;
        $data = $request->validated();
        $app = $this->service->updateByTenant($id, $data, $tenantProfileId);
        
        // Notify tenant that their application was updated (e.g., message changed)
        $tenantUser = $request->user();
        $house = $app->house;
        
        if ($tenantUser && $house) {
            Notification::create([
                'user_id' => $tenantUser->id,
                'type' => 'rental_application_updated',
                'message' => "Your rental application for '{$house->title}' has been updated.",
                'url' => "/tenant/my-applications/{$app->id}",
                'data' => [
                    'application_id' => $app->id,
                    'house_id' => $house->id,
                ],
            ]);
        }
        
        return $this->success(true, RentalApplicationResponse::updated($app), 'Application updated', 200);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $tenantProfileId = $request->user()->tenantProfile->id;
        $app = $this->service->findForTenant($id, $tenantProfileId);
        $this->service->deleteForTenant($id, $tenantProfileId);
        
        // Notify landlord that application was cancelled
        $landlord = $app->landlordProfile?->user;
        $house = $app->house;
        
        if ($landlord) {
            $tenantName = $app->tenantProfile?->user?->name ?? 'A tenant';
            $houseTitle = $house?->title ?? 'your property';
            
            Notification::create([
                'user_id' => $landlord->id,
                'type' => 'rental_application_cancelled',
                'message' => "Rental application from {$tenantName} for '{$houseTitle}' has been cancelled",
                'url' => "/landlord/rental-applications/{$app->id}",
                'data' => [
                    'application_id' => $app->id,
                    'house_id' => $house?->id,
                ],
            ]);
        }
        
        // Notify tenant that their application was cancelled
        $tenantUser = $request->user();
        if ($tenantUser) {
            $houseTitle = $house?->title ?? 'the property';
            Notification::create([
                'user_id' => $tenantUser->id,
                'type' => 'rental_application_cancelled_self',
                'message' => "Your rental application for '{$houseTitle}' has been cancelled",
                'url' => "/tenant/my-applications",
                'data' => [
                    'application_id' => $app->id,
                    'house_id' => $house?->id,
                ],
            ]);
        }
        
        return $this->success(true, RentalApplicationResponse::deleted(), 'Application cancelled', 200);
    }
}
