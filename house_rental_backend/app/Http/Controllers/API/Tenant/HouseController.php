<?php

namespace App\Http\Controllers\API\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\HouseService;
use App\Http\Responses\Landlord\HouseResponse; // reusing existing response
use App\Traits\HttpResponse;

class HouseController extends Controller
{
    use HttpResponse;
    protected HouseService $service;

    public function __construct(HouseService $service)
    {
        $this->service = $service;
    }

    /**
     * List all houses for tenants (no landlord filter).
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

        $houses = $this->service->listAll($filters);
        return $this->success(true, HouseResponse::list($houses), 'House Retrieved Successfully!', 200);
    }

    /**
     * Show a single house to tenant.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $house = $this->service->find($id);
        return $this->success(true, HouseResponse::single($house), 'House Retrieved Successfully!', 200);
    }

    public function getHousesByType(Request $request, $type): JsonResponse
    {
        $houses = $this->service->getHousesByType($type);
        return $this->success(true, HouseResponse::list($houses), 'House retrieved by type!', 200);
    }
}
