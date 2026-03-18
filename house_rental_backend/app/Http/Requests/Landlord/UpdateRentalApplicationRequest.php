<?php

namespace App\Http\Requests\Landlord;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRentalApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('landlord');
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'required', 'in:pending,approved,rejected'],
            'message' => ['sometimes', 'string'],
            'rental_duration' => ['sometimes', 'integer', 'min:1', 'max:24'],
        ];
    }
}
