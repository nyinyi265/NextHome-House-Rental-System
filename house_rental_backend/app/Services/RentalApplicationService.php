<?php

namespace App\Services;

use App\Models\House;
use App\Models\RentalApplication;
use App\Models\Rental;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RentalApplicationService
{
    public function listByTenant(int $tenantProfileId)
    {
        return RentalApplication::with(['house', 'landlordProfile'])
            ->where('tenant_profile_id', $tenantProfileId)
            ->get();
    }

    public function listByLandlord(int $landlordProfileId)
    {
        return RentalApplication::with(['house', 'tenantProfile'])
            ->where('landlord_profile_id', $landlordProfileId)
            ->get();
    }

    public function findForTenant(int $id, int $tenantProfileId): RentalApplication
    {
        return RentalApplication::with(['house', 'landlordProfile'])
            ->where('tenant_profile_id', $tenantProfileId)
            ->findOrFail($id);
    }

    public function findForLandlord(int $id, int $landlordProfileId): RentalApplication
    {
        return RentalApplication::with(['house', 'tenantProfile'])
            ->where('landlord_profile_id', $landlordProfileId)
            ->findOrFail($id);
    }

    public function create(array $data, int $tenantProfileId): RentalApplication
    {
        $data['tenant_profile_id'] = $tenantProfileId;

        // look up house to determine landlord
        $house = House::findOrFail($data['house_id']);
        $data['landlord_profile_id'] = $house->landlord_profile_id;

        // defaults
        $data['application_date'] = $data['application_date'] ?? now()->toDateString();
        $data['status'] = $data['status'] ?? 'pending';

        return RentalApplication::create($data);
    }

    public function updateByTenant(int $id, array $data, int $tenantProfileId): RentalApplication
    {
        $app = $this->findForTenant($id, $tenantProfileId);
        $app->update($data);
        return $app;
    }

    public function updateStatus(int $id, array $data, int $landlordProfileId): RentalApplication
    {
        $app = $this->findForLandlord($id, $landlordProfileId);
        $app->update($data);

        // If status is approved, create a Rental record
        if ($data['status'] === 'approved') {
            $house = $app->house;

            // Use rental_duration from application, default to 3 months if not provided
            $duration = $app->rental_duration ?? 3;

            Rental::create([
                'house_id' => $app->house_id,
                'tenant_profile_id' => $app->tenant_profile_id,
                'landlord_profile_id' => $app->landlord_profile_id,
                'rental_start_date' => now()->toDateString(),
                'rental_end_date' => now()->addMonths($duration)->toDateString(),
                'rental_duration' => $duration,
                'monthly_rent' => $house->price,
                'status' => 'active',
            ]);
        }

        return $app;
    }

    public function deleteForTenant(int $id, int $tenantProfileId): void
    {
        $app = $this->findForTenant($id, $tenantProfileId);
        $app->delete();
    }

    public function deleteForLandlord(int $id, int $landlordProfileId): void
    {
        $app = $this->findForLandlord($id, $landlordProfileId);
        $app->delete();
    }
}
