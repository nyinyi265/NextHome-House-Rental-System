<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterLandlordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

/**
     * Get the validation rules that apply to the request.
     * Always make user fields nullable - controller handles the logic based on auth status.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'password' => 'nullable|string',
            'phone_number' => 'nullable|string|max:20',
            'profile_path' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'document_path' => 'nullable|file|mimes:pdf,jpg,jpeg,png,gif|max:5120',
        ];
    }
}
