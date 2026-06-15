<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DonationItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'condition',
        'location',
        'description',
        'image_url',
        'status',
        'donor_id',
        'latitude',
        'longitude',
    ];

    /**
     * Get the user that owns the donation item.
     */
    public function donor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'donor_id');
    }

    /**
     * Get the chat sessions for the donation item.
     */
    public function chatSessions(): HasMany
    {
        return $this->hasMany(ChatSession::class, 'donation_item_id');
    }
}
