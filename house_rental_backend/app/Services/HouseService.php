<?php

namespace App\Services;

use App\Models\House;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class HouseService
{
    /**
     * Return houses belonging to a landlord profile.
     *
     * @param int $landlordProfileId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function listByLandlord(int $landlordProfileId)
    {
        return House::with('housePhotos')
            ->where('landlord_profile_id', $landlordProfileId)
            ->get();
    }

    /**
     * Create a new house record for landlord profile.
     *
     * @param array $data
     * @param int $landlordProfileId
     * @return House
     */
    public function create(array $data, int $landlordProfileId): House
    {
        $data['landlord_profile_id'] = $landlordProfileId;
        return House::create($data);
    }

    /**
     * Find a house by id for given landlord or throw.
     *
     * @param int $id
     * @param int $landlordId
     * @return House
     * @throws ModelNotFoundException
     */
    public function findForLandlord(int $id, int $landlordProfileId): House
    {
        return House::with('housePhotos')
            ->where('landlord_profile_id', $landlordProfileId)
            ->findOrFail($id);
    }

    /**
     * Update house attributes.
     *
     * @param int $id
     * @param array $data
     * @param int $landlordId
     * @return House
     */
    public function update(int $id, array $data, int $landlordProfileId): House
    {
        $house = $this->findForLandlord($id, $landlordProfileId);
        $house->update($data);
        return $house;
    }

    /**
     * Delete a house.
     *
     * @param int $id
     * @param int $landlordId
     * @return void
     */
    public function delete(int $id, int $landlordProfileId): void
    {
        $house = $this->findForLandlord($id, $landlordProfileId);
        $house->delete();
    }
}
