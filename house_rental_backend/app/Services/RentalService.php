<?php

namespace App\Services;

use App\Models\House;
use App\Models\Rental;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RentalService
{
    /**
     * List rentals belonging to landlord's houses.
     */
    public function listByLandlord(int $landlordProfileId)
    {
        // now that rentals store landlord_profile_id directly, we can filter on it
        return Rental::with(['house', 'tenantProfile'])
            ->where('landlord_profile_id', $landlordProfileId)
            ->get();
    }

    /**
     * List rentals for a tenant profile.
     */
    public function listByTenant(int $tenantProfileId)
    {
        return Rental::with('house')
            ->where('tenant_profile_id', $tenantProfileId)
            ->get();
    }

    public function findForLandlord(int $id, int $landlordProfileId): Rental
    {
        return Rental::with(['house', 'tenantProfile'])
            ->where('landlord_profile_id', $landlordProfileId)
            ->findOrFail($id);
    }

    public function findForTenant(int $id, int $tenantProfileId): Rental
    {
        return Rental::with('house')
            ->where('tenant_profile_id', $tenantProfileId)
            ->findOrFail($id);
    }

    public function create(array $data): Rental
    {
        // automatically set landlord_profile_id based on house
        if (isset($data['house_id'])) {
            $house = House::findOrFail($data['house_id']);
            $data['landlord_profile_id'] = $house->landlord_profile_id;
        }

        return Rental::create($data);
    }

    public function update(int $id, array $data, int $landlordProfileId): Rental
    {
        $rental = $this->findForLandlord($id, $landlordProfileId);
        $rental->update($data);
        return $rental;
    }

    public function delete(int $id, int $landlordProfileId): void
    {
        $rental = $this->findForLandlord($id, $landlordProfileId);
        $rental->delete();
    }
}
