<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Furniture extends Model
{
    protected $table = 'furnitures';
    protected $fillable = [
        'name'
    ];

    public function houses()
    {
        return $this->belongsToMany(House::class, 'house_furnitures', 'furniture_id', 'house_id');
    }
}
