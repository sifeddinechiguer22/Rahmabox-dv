<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDonationItemRequest extends FormRequest
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
            'title'         => 'required|string|max:255',
            'category'      => 'required|string|max:255',
            'condition'     => 'required|string|in:new,excellent,good,fair',
            'location'      => 'required|string|max:255',
            'description'   => 'nullable|string',
            'image'         => 'nullable',
            'image_url'     => 'nullable|string',
            'status'        => 'nullable|string|in:available,requested,donated',
            'latitude'      => 'nullable|numeric',
            'longitude'     => 'nullable|numeric',
        ];
    }
}
