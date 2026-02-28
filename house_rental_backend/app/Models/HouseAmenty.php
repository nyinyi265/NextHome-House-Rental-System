<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseAmenty extends Model
{
    protected $fillable = [
        'house_id',
        'amenty_id'
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function amenty()
    {
        return $this->belongsTo(Amenty::class);
    }
}
