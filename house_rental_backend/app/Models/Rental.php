<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rental extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'house_id',
        'tenant_id',
        'rental_start_date',
        'rental_end_date',
        'rental_duration',
        'monthly_rent',
        'status',
        'deleted_at'
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }
}
