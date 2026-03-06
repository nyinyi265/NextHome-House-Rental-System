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
            'status' => ['required', 'in:pending,approved,rejected'],
            'message' => ['sometimes', 'string'],
        ];
    }
}
