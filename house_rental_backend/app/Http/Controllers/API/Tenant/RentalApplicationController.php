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
        $app = $this->service->create($data, $tenantProfileId);
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
        return $this->success(true, RentalApplicationResponse::updated($app), 'Application updated', 200);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $tenantProfileId = $request->user()->tenantProfile->id;
        $this->service->deleteForTenant($id, $tenantProfileId);
        return $this->success(true, RentalApplicationResponse::deleted(), 'Application cancelled', 200);
    }
}
