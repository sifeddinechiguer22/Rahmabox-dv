<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatSessionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        
        // Find the other participant in the chat
        $contact = $this->donor_id === $user->id ? $this->receiver : $this->donor;
        
        // Get last message
        $lastMsg = $this->messages()->orderBy('created_at', 'desc')->first();
        
        // Determine if there are unread messages for current user
        $unread = $this->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->exists();

        return [
            'id'            => (string) $this->id,
            'contactName'   => $contact ? $contact->name : 'Utilisateur supprimé',
            'contactRole'   => $contact ? $contact->role : 'donateur',
            'contactAvatar' => $contact ? strtoupper(substr($contact->name, 0, 1)) : 'U',
            'itemTitle'     => $this->donationItem ? $this->donationItem->title : 'Objet supprimé',
            'itemId'        => (string) $this->donation_item_id,
            'lastMessage'   => $lastMsg ? $lastMsg->content : 'Aucun message pour le moment.',
            'unread'        => $unread,
            'messages'      => ChatMessageResource::collection($this->whenLoaded('messages')),
        ];
    }
}
