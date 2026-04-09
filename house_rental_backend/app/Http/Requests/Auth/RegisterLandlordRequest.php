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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'phone_number' => 'nullable|string|max:20',
            'profile_path' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'document_path' => 'nullable|file|mimes:pdf,jpg,jpeg,png,gif|max:5120',
        ];
    }
}
