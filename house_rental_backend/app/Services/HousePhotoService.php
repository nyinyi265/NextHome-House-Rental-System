<?php

namespace App\Services;

use App\Models\House;
use App\Models\HousePhoto;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;

class HousePhotoService
{
    /**
     * Ensure the house belongs to landlord profile and return it
     *
     * @param int $houseId
     * @param int $landlordProfileId
     * @return House
     * @throws ModelNotFoundException
     */
    protected function verifyOwnership(int $houseId, int $landlordProfileId): House
    {
        return House::where('id', $houseId)
            ->where('landlord_profile_id', $landlordProfileId)
            ->firstOrFail();
    }

    /**
     * List photos for house belonging to landlord.
     */
    public function list(int $houseId, int $landlordProfileId)
    {
        $house = $this->verifyOwnership($houseId, $landlordProfileId);
        return $house->housePhotos;
    }

    /**
     * Add photo to house.
     */
    public function create(int $houseId, int $landlordProfileId, array $data): HousePhoto
    {
        $house = $this->verifyOwnership($houseId, $landlordProfileId);
        $data['house_id'] = $house->id;
        return HousePhoto::create($data);
    }

    /**
     * Update a photo record belonging to house owned by landlord.
     */
    public function update(int $photoId, int $houseId, int $landlordProfileId, array $data): HousePhoto
    {
        $house = $this->verifyOwnership($houseId, $landlordProfileId);
        $photo = $house->housePhotos()->where('id', $photoId)->firstOrFail();
        $photo->update($data);
        return $photo;
    }

    /**
     * Remove photo.
     */
    public function delete(int $photoId, int $houseId, int $landlordProfileId): void
    {
        $house = $this->verifyOwnership($houseId, $landlordProfileId);
        $photo = $house->housePhotos()->where('id', $photoId)->firstOrFail();
        // delete file from public disk if exists
        if ($photo->photo_path && Storage::disk('public')->exists($photo->photo_path)) {
            Storage::disk('public')->delete($photo->photo_path);
        }
        $photo->delete();
    }
}
