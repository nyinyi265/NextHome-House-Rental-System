<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseFurniture extends Model
{
    protected $fillable = [
        'house_id',
        'furniture_id'
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function furniture()
    {
        return $this->belongsTo(Furniture::class);
    }
}
