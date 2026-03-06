<?php

namespace App\Http\Requests\Landlord;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAmentyRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user() && $this->user()->hasRole('landlord');
    }

    public function rules()
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }
}
