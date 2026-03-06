<?php

namespace App\Http\Controllers\API\Landlord;

use App\Http\Controllers\Controller;
use App\Models\House;
use App\Services\HouseService;
use App\Services\HousePhotoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Landlord\StoreHouseRequest;
use App\Http\Requests\Landlord\UpdateHouseRequest;
use App\Traits\HttpResponse;
use App\Http\Responses\Landlord\HouseResponse;
use Illuminate\Support\Facades\Log;

class HouseController extends Controller
{
    use HttpResponse;

    protected HouseService $service;
    protected HousePhotoService $photoService;

    public function __construct(HouseService $service, HousePhotoService $photoService)
    {
        $this->service = $service;
        $this->photoService = $photoService;
    }

    public function index(Request $request): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $houses = $this->service->listByLandlord($landlordProfileId);
        return $this->success(true, HouseResponse::list($houses), 'Houses retrieved', 200);
    }

    public function store(StoreHouseRequest $request): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $data = $request->validated();
        $house = $this->service->create($data, $landlordProfileId);

        // handle photos
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $photoData = [];
                $photoData['photo_path'] = $file->store('house_photos', 'public');
                $this->photoService->create($house->id, $landlordProfileId, $photoData);
            }
            // reload relationships
            $house->load(['housePhotos', 'amenties', 'furnitures']);
        } else {
            // in case no new photos, still load related resources
            $house->load(['housePhotos', 'amenties', 'furnitures']);
        }

        return $this->success(true, HouseResponse::created($house), 'House created', 201);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $house = $this->service->findForLandlord($id, $landlordProfileId);
        return $this->success(true, HouseResponse::single($house), 'House retrieved', 200);
    }

    public function update(UpdateHouseRequest $request, $id): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $data = $request->validated();
        $house = $this->service->update($id, $data, $landlordProfileId);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $photoData = [];
                $photoData['photo_path'] = $file->store('house_photos', 'public');
                $this->photoService->create($house->id, $landlordProfileId, $photoData);
            }
            $house->load(['housePhotos', 'amenties', 'furnitures']);
        } else {
            $house->load(['housePhotos', 'amenties', 'furnitures']);
        }

        return $this->success(true, HouseResponse::updated($house), 'House updated', 200);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $this->service->delete($id, $landlordProfileId);
        return $this->success(true, HouseResponse::deleted(), 'House deleted', 200);
    }
}
