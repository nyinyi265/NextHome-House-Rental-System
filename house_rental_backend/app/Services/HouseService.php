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
        return House::with(['housePhotos', 'amenties', 'furnitures'])
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
        $house = House::create($data);

        if (! empty($data['amenty_ids'])) {
            $house->amenties()->sync($data['amenty_ids']);
        }
        if (! empty($data['furniture_ids'])) {
            $house->furnitures()->sync($data['furniture_ids']);
        }

        return $house;
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
        return House::with(['housePhotos', 'amenties', 'furnitures'])
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

        if (array_key_exists('amenty_ids', $data)) {
            $house->amenties()->sync($data['amenty_ids'] ?? []);
        }
        if (array_key_exists('furniture_ids', $data)) {
            $house->furnitures()->sync($data['furniture_ids'] ?? []);
        }

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
