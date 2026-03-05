<?php

namespace App\Http\Controllers\API\Landlord;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\HousePhotoService;
use App\Traits\HttpResponse;
use App\Http\Responses\Landlord\HousePhotoResponse;
use App\Http\Requests\Landlord\StoreHousePhotoRequest;
use App\Http\Requests\Landlord\UpdateHousePhotoRequest;

class HousePhotoController extends Controller
{
    use HttpResponse;

    protected HousePhotoService $service;

    public function __construct(HousePhotoService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request, $houseId): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $photos = $this->service->list($houseId, $landlordProfileId);
        return $this->success(true, HousePhotoResponse::list($photos), 'Photos retrieved', 200);
    }

    public function store(StoreHousePhotoRequest $request, $houseId): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $data = $request->validated();
        if ($request->hasFile('photo_path')) {
            $data['photo_path'] = $request->file('photo_path')->store('house_photos', 'public');
        }
        $photo = $this->service->create($houseId, $landlordProfileId, $data);
        return $this->success(true, HousePhotoResponse::created($photo), 'Photo added', 201);
    }

    public function show(Request $request, $houseId, $photoId): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $photo = $this->service->update($photoId, $houseId, $landlordProfileId, []); // reuse update to fetch
        return $this->success(true, HousePhotoResponse::single($photo), 'Photo retrieved', 200);
    }

    public function update(UpdateHousePhotoRequest $request, $houseId, $photoId): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $data = $request->validated();
        if ($request->hasFile('photo_path')) {
            $data['photo_path'] = $request->file('photo_path')->store('house_photos', 'public');
        }
        $photo = $this->service->update($photoId, $houseId, $landlordProfileId, $data);
        return $this->success(true, HousePhotoResponse::updated($photo), 'Photo updated', 200);
    }

    public function destroy(Request $request, $houseId, $photoId): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $this->service->delete($photoId, $houseId, $landlordProfileId);
        return $this->success(true, HousePhotoResponse::deleted(), 'Photo deleted', 200);
    }
}
