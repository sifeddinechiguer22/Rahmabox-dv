<?php

namespace App\Http\Controllers;

use App\Models\DonationItem;
use App\Http\Requests\StoreDonationItemRequest;
use App\Http\Resources\DonationItemResource;
use Illuminate\Http\Request;

class DonationItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DonationItem::with('donor');
        
        $items = $query->orderBy('created_at', 'desc')->get();

        if ($request->has(['latitude', 'longitude'])) {
            $lat = (float) $request->latitude;
            $lng = (float) $request->longitude;
            $radius = (float) $request->query('radius', 50); // distance in km

            $items = $items->filter(function ($item) use ($lat, $lng, $radius) {
                if (is_null($item->latitude) || is_null($item->longitude)) {
                    return false;
                }
                
                // Haversine formula
                $earthRadius = 6371; // km
                $dLat = deg2rad((float) $item->latitude - $lat);
                $dLng = deg2rad((float) $item->longitude - $lng);
                
                $a = sin($dLat / 2) * sin($dLat / 2) +
                     cos(deg2rad($lat)) * cos(deg2rad((float) $item->latitude)) *
                     sin($dLng / 2) * sin($dLng / 2);
                     
                $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
                $distance = $earthRadius * $c;
                
                $item->distance = $distance;
                return $distance <= $radius;
            });
            
            // Sort by distance
            $items = $items->sortBy('distance')->values();
        }

        return DonationItemResource::collection($items);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDonationItemRequest $request)
    {
        $validated = $request->validated();
        
        // Default coordinates if not provided
        $lat = $validated['latitude'] ?? 33.5731;
        $lng = $validated['longitude'] ?? -7.5898;

        // Handle image upload or preset url
        $imageUrl = 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600';
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('donations', 'public');
            $imageUrl = '/storage/' . $path;
        } elseif ($request->filled('image_url')) {
            $imageUrl = $request->input('image_url');
        } elseif ($request->filled('image') && is_string($request->input('image'))) {
            $imageUrl = $request->input('image');
        }

        $item = DonationItem::create([
            'title'       => $validated['title'],
            'category'    => $validated['category'],
            'condition'   => $validated['condition'],
            'location'    => $validated['location'],
            'description' => $validated['description'] ?? '',
            'image_url'   => $imageUrl,
            'status'      => $validated['status'] ?? 'available',
            'donor_id'    => $request->user()->id,
            'latitude'    => $lat,
            'longitude'   => $lng,
        ]);

        return new DonationItemResource($item);
    }

    /**
     * Display the specified resource.
     */
    public function show(DonationItem $item)
    {
        return new DonationItemResource($item->load('donor'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DonationItem $item)
    {
        // Authorize: only the donor can update the item
        if ($item->donor_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'category'    => 'sometimes|required|string|max:255',
            'condition'   => 'sometimes|required|string|in:new,excellent,good,fair',
            'location'    => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image_url'   => 'nullable|string',
            'status'      => 'sometimes|required|string|in:available,requested,donated',
            'latitude'    => 'nullable|numeric',
            'longitude'   => 'nullable|numeric',
        ]);

        $item->update($request->only([
            'title', 'category', 'condition', 'location', 'description', 'image_url', 'status', 'latitude', 'longitude'
        ]));

        return new DonationItemResource($item);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, DonationItem $item)
    {
        // Authorize: only the donor can delete the item
        if ($item->donor_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $item->delete();

        return response()->json(['message' => 'Don supprimé avec succès.']);
    }
}
