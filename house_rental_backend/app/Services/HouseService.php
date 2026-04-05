<?php

namespace App\Services;

use App\Models\House;
use App\Models\Rental;
use App\Models\RentalApplication;
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
     * Return all houses (for public/tenant browsing).
     *
     * @param array $filters
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function listAll(array $filters = [])
    {
        $query = House::with(['housePhotos', 'amenties', 'furnitures']);

        // Apply filters
        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }
        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        if (!empty($filters['bedrooms'])) {
            $query->where('bedrooms', '>=', $filters['bedrooms']);
        }
        if (!empty($filters['bathrooms'])) {
            $query->where('bathrooms', '>=', $filters['bathrooms']);
        }
        if (!empty($filters['min_area'])) {
            $query->where('area', '>=', $filters['min_area']);
        }
        if (!empty($filters['max_area'])) {
            $query->where('area', '<=', $filters['max_area']);
        }
        if (!empty($filters['city'])) {
            $query->where('city', 'like', '%' . $filters['city'] . '%');
        }
        if (!empty($filters['street'])) {
            $query->where('street', 'like', '%' . $filters['street'] . '%');
        }
        if (!empty($filters['township'])) {
            $query->where('township', 'like', '%' . $filters['township'] . '%');
        }
        if (!empty($filters['area'])) {
            $query->where('area', 'like', '%' . $filters['area'] . '%');
        }
        if (!empty($filters['amenties'])) {
            $query->whereHas('amenties', function ($q) use ($filters) {
                $q->whereIn('amenties.id', $filters['amenties']);
            });
        }
        if (!empty($filters['furnitures'])) {
            $query->whereHas('furnitures', function ($q) use ($filters) {
                $q->whereIn('furnitures.id', $filters['furnitures']);
            });
        }

        return $query->get();
    }

    /**
     * Return all houses for tenants, excluding houses they have applied for or are currently rented.
     *
     * @param array $filters
     * @param int|null $tenantProfileId If provided, excludes houses with pending/approved applications and active rentals
     * @param int $page
     * @param int $perPage
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function listForTenants(array $filters = [], ?int $tenantProfileId = null, int $page = 1, int $perPage = 12)
    {
        $query = House::with(['housePhotos', 'amenties', 'furnitures']);

        // Apply filters
        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }
        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        if (!empty($filters['bedrooms'])) {
            $query->where('bedrooms', '>=', $filters['bedrooms']);
        }
        if (!empty($filters['bathrooms'])) {
            $query->where('bathrooms', '>=', $filters['bathrooms']);
        }
        if (!empty($filters['min_area'])) {
            $query->where('area', '>=', $filters['min_area']);
        }
        if (!empty($filters['max_area'])) {
            $query->where('area', '<=', $filters['max_area']);
        }
        if (!empty($filters['city'])) {
            $query->where('city', 'like', '%' . $filters['city'] . '%');
        }
        if (!empty($filters['street'])) {
            $query->where('street', 'like', '%' . $filters['street'] . '%');
        }
        if (!empty($filters['township'])) {
            $query->where('township', 'like', '%' . $filters['township'] . '%');
        }
        if (!empty($filters['area'])) {
            $query->where('area', 'like', '%' . $filters['area'] . '%');
        }
        if (!empty($filters['amenties'])) {
            $query->whereHas('amenties', function ($q) use ($filters) {
                $q->whereIn('amenties.id', $filters['amenties']);
            });
        }
        if (!empty($filters['furnitures'])) {
            $query->whereHas('furnitures', function ($q) use ($filters) {
                $q->whereIn('furnitures.id', $filters['furnitures']);
            });
        }

        // Exclude houses that the tenant has already applied for (pending or approved)
        // and houses that are currently rented (active rental)
        if ($tenantProfileId !== null) {
            // Get house IDs that have pending or approved applications from this tenant
            $appliedHouseIds = RentalApplication::where('tenant_profile_id', $tenantProfileId)
                ->whereIn('status', ['pending', 'approved'])
                ->pluck('house_id')
                ->toArray();

            // Get house IDs that have active rentals
            $rentedHouseIds = Rental::where('status', 'active')
                ->pluck('house_id')
                ->toArray();

            // Combine and exclude both
            $excludeIds = array_merge($appliedHouseIds, $rentedHouseIds);
            $query->whereNotIn('id', $excludeIds);
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Find any house by id (used by tenant viewer).
     *
     * @param int $id
     * @return House
     */
    public function find(int $id): House
    {
        return House::with(['housePhotos', 'amenties', 'furnitures'])->findOrFail($id);
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

    public function getHousesByType(string $type){
        return House::with(['housePhotos', 'amenties', 'furnitures'])->where('type', $type)->get();
    }

}
