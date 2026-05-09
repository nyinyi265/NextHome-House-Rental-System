<?php

namespace App\Http\Controllers\API\Landlord;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\RentalApplicationService;
use App\Http\Requests\Landlord\UpdateRentalApplicationRequest;
use App\Traits\HttpResponse;
use App\Http\Responses\RentalApplicationResponse;
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
        $landlordProfileId = $request->user()->landlordProfile->id;
        $apps = $this->service->listByLandlord($landlordProfileId);
        return $this->success(true, RentalApplicationResponse::list($apps), 'Applications retrieved', 200);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $app = $this->service->findForLandlord($id, $landlordProfileId);
        return $this->success(true, RentalApplicationResponse::single($app), 'Application retrieved', 200);
    }

    public function update(UpdateRentalApplicationRequest $request, $id): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $data = $request->validated();
        $app = $this->service->updateStatus($id, $data, $landlordProfileId);
        
        // Create notification for tenant when application status changes
        $tenant = $app->tenantProfile?->user;
        $house = $app->house;
        
        if ($tenant) {
            $status = $app->status;
            $houseTitle = $house?->title ?? 'the property';
            $tenantName = $tenant->name;
            
            $message = match($status) {
                'approved' => "Your rental application for '{$houseTitle}' has been approved!",
                'rejected' => "Your rental application for '{$houseTitle}' has been rejected.",
                default => "Your rental application for '{$houseTitle}' has been updated to {$status}."
            };
            
            Notification::create([
                'user_id' => $tenant->id,
                'type' => 'rental_application_status',
                'message' => $message,
                'url' => "/tenant/my-applications",
                'data' => [
                    'application_id' => $app->id,
                    'house_id' => $house?->id,
                    'status' => $status,
                ],
            ]);
        }
        
        return $this->success(true, RentalApplicationResponse::updated($app), 'Application updated', 200);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $this->service->deleteForLandlord($id, $landlordProfileId);
        return $this->success(true, RentalApplicationResponse::deleted(), 'Application deleted', 200);
    }
}
