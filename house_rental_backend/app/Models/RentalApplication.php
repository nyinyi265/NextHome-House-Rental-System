<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RentalApplication extends Model
{
    protected $fillable = [
        'house_id',
        'tenant_profile_id',
        'landlord_profile_id',
        'application_date',
        'status',
        'message'
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function tenantProfile()
    {
        return $this->belongsTo(TenantProfile::class, 'tenant_profile_id');
    }

    public function landlordProfile()
    {
        return $this->belongsTo(LandlordProfile::class, 'landlord_profile_id');
    }
}
