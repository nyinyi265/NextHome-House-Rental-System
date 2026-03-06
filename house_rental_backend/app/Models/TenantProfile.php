<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class TenantProfile extends Model
{
    use HasRoles;
    protected $fillable = [
        'user_id',
        'emergency_contact',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class, 'tenant_profile_id');
    }

    public function rentalApplications()
    {
        return $this->hasMany(RentalApplication::class, 'tenant_profile_id');
    }
}
