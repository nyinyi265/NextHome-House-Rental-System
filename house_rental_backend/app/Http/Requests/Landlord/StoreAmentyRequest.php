<?php

namespace App\Http\Requests\Landlord;

use Illuminate\Foundation\Http\FormRequest;

class StoreAmentyRequest extends FormRequest
{
    public function authorize()
    {
        // only landlords can manage amenities
        return $this->user() && $this->user()->hasRole('landlord');
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
