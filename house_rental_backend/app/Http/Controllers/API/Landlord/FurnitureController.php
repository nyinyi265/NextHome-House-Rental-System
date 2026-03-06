<?php

namespace App\Http\Controllers\API\Landlord;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\FurnitureService;
use App\Http\Requests\Landlord\StoreFurnitureRequest;
use App\Http\Requests\Landlord\UpdateFurnitureRequest;
use App\Traits\HttpResponse;
use App\Http\Responses\Landlord\FurnitureResponse;

class FurnitureController extends Controller
{
    use HttpResponse;

    protected FurnitureService $service;

    public function __construct(FurnitureService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $furnitures = $this->service->list();
        return $this->success(true, FurnitureResponse::list($furnitures), 'Furnitures retrieved', 200);
    }

    public function store(StoreFurnitureRequest $request): JsonResponse
    {
        $data = $request->validated();
        $furniture = $this->service->create($data);
        return $this->success(true, FurnitureResponse::created($furniture), 'Furniture created', 201);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $furniture = $this->service->find($id);
        return $this->success(true, FurnitureResponse::single($furniture), 'Furniture retrieved', 200);
    }

    public function update(UpdateFurnitureRequest $request, $id): JsonResponse
    {
        $data = $request->validated();
        $furniture = $this->service->update($id, $data);
        return $this->success(true, FurnitureResponse::updated($furniture), 'Furniture updated', 200);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->success(true, FurnitureResponse::deleted(), 'Furniture deleted', 200);
    }
}
