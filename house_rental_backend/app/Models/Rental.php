<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;

class Rental extends Model
{
    use SoftDeletes, HasRoles;

    protected $fillable = [
        'house_id',
        'tenant_profile_id',
        'landlord_profile_id',
        'rental_start_date',
        'rental_end_date',
        'rental_duration',
        'monthly_rent',
        'status',
        'deleted_at',
    ];

    protected $casts = [
        'rental_start_date' => 'date',
        'rental_end_date' => 'date',
        'status' => 'string',
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
