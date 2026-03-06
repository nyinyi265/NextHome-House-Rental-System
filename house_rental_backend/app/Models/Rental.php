<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rental extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'house_id',
        'tenant_profile_id',
        'rental_start_date',
        'rental_end_date',
        'rental_duration',
        'monthly_rent',
        'status',
        'deleted_at',
    ];

    protected $casts = [
        'rental_start_date' => 'date',
        'rental_end_date' => 'date',
        'status' => 'string',
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function tenantProfile()
    {
        return $this->belongsTo(TenantProfile::class, 'tenant_profile_id');
    }
}
