<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'name'                => 'required|string|max:255',
            'email'               => 'required|string|email|max:255|unique:users',
            'password'            => 'required|string|min:6|confirmed',
            'role'                => 'required|string|in:donateur,beneficiaire,association,benevole',
            'phone'               => 'nullable|string|max:50',
            'city'                => 'required|string|max:255',
            'company_name'        => 'required_if:role,association|string|max:255|nullable',
            'registration_number' => 'required_if:role,association|string|max:255|nullable',
        ];
    }
}
