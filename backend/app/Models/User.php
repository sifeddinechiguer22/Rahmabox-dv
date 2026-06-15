<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password',
        'phone', 'city', 'role',
        'company_name', 'registration_number',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the donation items posted by the user.
     */
    public function donationItems(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DonationItem::class, 'donor_id');
    }

    /**
     * Get the chat sessions where the user is the donor.
     */
    public function donorChatSessions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ChatSession::class, 'donor_id');
    }

    /**
     * Get the chat sessions where the user is the receiver.
     */
    public function receiverChatSessions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ChatSession::class, 'receiver_id');
    }

    /**
     * Get the chat messages sent by the user.
     */
    public function chatMessages(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ChatMessage::class, 'sender_id');
    }
}
