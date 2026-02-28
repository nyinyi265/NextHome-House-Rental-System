<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amenty extends Model
{
    //
    protected $fillable = [
        'name'
    ];

    public function houseAmenties()
    {
        return $this->hasMany(HouseAmenty::class);
    }
}
