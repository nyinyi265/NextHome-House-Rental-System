<?php

namespace App\Http\Controllers\API\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\RentalService;
use App\Traits\HttpResponse;
use App\Http\Responses\RentalResponse;

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
        $tenantProfileId = $request->user()->tenantProfile->id;
        $rentals = $this->service->listByTenant($tenantProfileId);
        return $this->success(true, RentalResponse::list($rentals), 'Rentals retrieved', 200);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $tenantProfileId = $request->user()->tenantProfile->id;
        $rental = $this->service->findForTenant($id, $tenantProfileId);
        return $this->success(true, RentalResponse::single($rental), 'Rental retrieved', 200);
    }
}
