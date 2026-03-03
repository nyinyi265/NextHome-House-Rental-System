<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseFurniture extends Model
{
    protected $fillable = [
        'house_id',
        'furniture_id'
    ];
}
