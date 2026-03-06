<?php

namespace App\Http\Requests\Landlord;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRentalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('landlord');
    }

    public function rules(): array
    {
        return [
            'rental_start_date' => ['sometimes', 'required', 'date'],
            'rental_end_date' => ['nullable', 'date', 'after_or_equal:rental_start_date'],
            'rental_duration' => ['nullable', 'integer', 'min:0'],
            'monthly_rent' => ['sometimes', 'required', 'numeric', 'min:0'],
            'status' => ['sometimes', 'required', 'in:active,inactive'],
        ];
    }
}
