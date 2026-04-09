<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandlordDocument extends Model
{
    //
    protected $fillable = ['landlord_profile_id', 'document_type', 'document_path'];

    public function landlordProfile()
    {
        return $this->belongsTo(LandlordProfile::class);
    }
}
