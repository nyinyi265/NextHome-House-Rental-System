<?php

namespace App\Http\Requests\Landlord;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $houseId = $this->route('id');
        return [
            'title' => 'sometimes|required|string|max:255',
            'slug' => [
                'sometimes',
                'required',
                'string',
                Rule::unique('houses', 'slug')->ignore($this->route('house')),
            ],
            'apartment_number' => 'nullable|integer',
            'type' => 'nullable|in:apartment,house,condo',
            'floor' => 'nullable|integer',
            'area' => 'nullable|integer',
            'street' => 'nullable|string|max:255',
            'township' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|required|numeric|min:0',
            'is_available' => 'nullable|boolean',
            'available_from' => 'nullable|date',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpg,jpeg,png,gif|max:4096',
        ];
    }
}
