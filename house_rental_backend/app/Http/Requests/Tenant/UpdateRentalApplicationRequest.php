<?php

namespace App\Http\Requests\Tenant;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRentalApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('tenant');
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string'],
        ];
    }
}
