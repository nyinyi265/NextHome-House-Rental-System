<?php

namespace App\Http\Controllers\API\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\HouseService;
use App\Http\Responses\Landlord\HouseResponse; // reusing existing response

class HouseController extends Controller
{
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
        $houses = $this->service->listAll();
        return response()->json(HouseResponse::list($houses), 200);
    }

    /**
     * Show a single house to tenant.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $house = $this->service->find($id);
        return response()->json(HouseResponse::single($house), 200);
    }
}
