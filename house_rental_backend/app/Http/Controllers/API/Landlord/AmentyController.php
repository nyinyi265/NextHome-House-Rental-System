<?php

namespace App\Http\Controllers\API\Landlord;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\AmentyService;
use App\Http\Requests\Landlord\StoreAmentyRequest;
use App\Http\Requests\Landlord\UpdateAmentyRequest;
use App\Traits\HttpResponse;
use App\Http\Responses\Landlord\AmentyResponse;

class AmentyController extends Controller
{
    use HttpResponse;

    protected AmentyService $service;

    public function __construct(AmentyService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $amenties = $this->service->list();
        return $this->success(true, AmentyResponse::list($amenties), 'Amenities retrieved', 200);
    }

    public function store(StoreAmentyRequest $request): JsonResponse
    {
        $data = $request->validated();
        $amenty = $this->service->create($data);
        return $this->success(true, AmentyResponse::created($amenty), 'Amenity created', 201);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $amenty = $this->service->find($id);
        return $this->success(true, AmentyResponse::single($amenty), 'Amenity retrieved', 200);
    }

    public function update(UpdateAmentyRequest $request, $id): JsonResponse
    {
        $data = $request->validated();
        $amenty = $this->service->update($id, $data);
        return $this->success(true, AmentyResponse::updated($amenty), 'Amenity updated', 200);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->success(true, AmentyResponse::deleted(), 'Amenity deleted', 200);
    }
}
