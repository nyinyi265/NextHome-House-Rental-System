<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Furniture extends Model
{
    protected $fillable = [
        'name'
    ];

    public function houseFurnitures()
    {
        return $this->hasMany(HouseFurniture::class);
    }
}
