<?php

namespace App\Http\Requests\Landlord;

use Illuminate\Foundation\Http\FormRequest;

class StoreHousePhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // middleware ensures landlord
    }

    public function rules(): array
    {
        return [
            'photo_path' => 'required|image|mimes:jpg,jpeg,png,gif',
        ];
    }
}
