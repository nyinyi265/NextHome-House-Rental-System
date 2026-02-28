<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    protected $fillable = [
        'house_id',
        'tenant_id',
        'rental_start_date',
        'rental_end_date',
        'rental_duration',
        'monthly_rent',
        'status',
        'delete_flg',
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
