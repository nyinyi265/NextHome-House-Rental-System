<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class LandlordProfile extends Model
{
    use HasRoles;
    protected $fillable = [
        'user_id',
        'verified_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function houses()
    {
        return $this->hasMany(House::class, 'landlord_profile_id');
    }

    public function rentalApplications()
    {
        return $this->hasMany(RentalApplication::class, 'landlord_profile_id');
    }
}
