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
        'message',
        'rental_duration'
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

    public function tenant()
    {
        return $this->hasOneThrough(User::class, TenantProfile::class, 'id', 'id', 'tenant_profile_id', 'user_id');
    }

    public function landlord()
    {
        return $this->hasOneThrough(User::class, LandlordProfile::class, 'id', 'id', 'landlord_profile_id', 'user_id');
    }
}
