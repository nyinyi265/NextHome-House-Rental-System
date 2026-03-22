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

                // Use PHP's getimagesize to get image dimensions
                $imageInfo = getimagesize($file);
                $width = $imageInfo[0];
                $height = $imageInfo[1];

                // Consider panorama if width is at least 1.8x the height
                $isPanorama = $width / $height >= 1.8;

                $photoData['is_panorama'] = $isPanorama;
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

        // Handle photo deletion
        if ($request->has('delete_photos')) {
            $deletePhotoIds = $request->input('delete_photos');
            foreach ($deletePhotoIds as $photoId) {
                $this->photoService->delete($photoId, $house->id, $landlordProfileId);
            }
        }

        // Handle new photo uploads
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $photoData = [];

                // Use PHP's getimagesize to get image dimensions
                $imageInfo = getimagesize($file);
                $width = $imageInfo[0];
                $height = $imageInfo[1];

                // Consider panorama if width is at least 1.8x the height
                $isPanorama = $width / $height >= 1.8;

                $photoData['is_panorama'] = $isPanorama;
                $photoData['photo_path'] = $file->store('house_photos', 'public');
                $this->photoService->create($house->id, $landlordProfileId, $photoData);
            }
        }

        $house->load(['housePhotos', 'amenties', 'furnitures']);

        return $this->success(true, HouseResponse::updated($house), 'House updated', 200);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $landlordProfileId = $request->user()->landlordProfile->id;
        $this->service->delete($id, $landlordProfileId);
        return $this->success(true, HouseResponse::deleted(), 'House deleted', 200);
    }
}
