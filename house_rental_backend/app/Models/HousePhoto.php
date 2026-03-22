<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HousePhoto extends Model
{
    //
    protected $fillable = [
        'house_id',
        'photo_path',
        'is_panorama'
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }
}
