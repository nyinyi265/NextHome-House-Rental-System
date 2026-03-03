<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amenty extends Model
{
    //
    protected $fillable = [
        'name'
    ];

    public function houses()
    {
        return $this->belongsToMany(House::class, 'house_amenties', 'amenty_id', 'house_id');
    }
}
