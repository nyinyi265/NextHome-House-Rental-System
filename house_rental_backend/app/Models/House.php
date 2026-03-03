<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class House extends Model
{
    use SoftDeletes;
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

    public function amenties()
    {
        return $this->belongsToMany(Amenty::class, 'house_amenties', 'house_id', 'amenty_id');
    }

    public function furnitures()
    {
        return $this->belongsToMany(Furniture::class, 'house_furnitures', 'house_id', 'furniture_id');
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
