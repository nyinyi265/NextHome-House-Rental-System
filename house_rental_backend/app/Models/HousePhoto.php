<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HousePhoto extends Model
{
    //
    protected $fillable = [
        'house_id',
        'photo_path'
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }
}
