<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => (string) $this->id,
            'title'       => $this->title,
            'category'    => $this->category,
            'condition'   => $this->condition,
            'location'    => $this->location,
            'description' => $this->description,
            'imageUrl'    => $this->image_url,
            'status'      => $this->status,
            'donorName'   => $this->donor ? $this->donor->name : 'Inconnu',
            'donorId'     => (string) $this->donor_id,
            'latitude'    => $this->latitude ? (float) $this->latitude : null,
            'longitude'   => $this->longitude ? (float) $this->longitude : null,
            'distance'    => $this->when(isset($this->distance), function () {
                return round($this->distance, 1);
            }),
            'coordinates' => [
                'x' => $this->longitude ? (float) $this->longitude : 0,
                'y' => $this->latitude ? (float) $this->latitude : 0,
            ],
            'timePosted'  => $this->created_at ? $this->created_at->diffForHumans() : "À l'instant",
            'createdAt'   => $this->created_at ? $this->created_at->toIso8601String() : null,
        ];
    }
}
