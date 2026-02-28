<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    //
    protected $fillable = [
        'title',
        'slug',
        'apartment_number',
        'type',
        'floor',
        'area',
        'street',
        'township',
        'city',
        'bedrooms',
        'bathrooms',
        'description',
        'price',
        'is_available',
        'available_from',
        'delete_flg',
        'deleted_at',
        'landlord_id'
    ];

    public function landlord()
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    public function housePhotos()
    {
        return $this->hasMany(HousePhoto::class);
    }

    public function houseAmenties()
    {
        return $this->hasMany(HouseAmenty::class);
    }

    public function houseFurnitures()
    {
        return $this->hasMany(HouseFurniture::class);
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }

    public function rentalApplications()
    {
        return $this->hasMany(RentalApplication::class);
    }
}
