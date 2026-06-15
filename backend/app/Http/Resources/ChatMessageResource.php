<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatMessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $userId = $request->user() ? $request->user()->id : null;

        return [
            'id'            => (string) $this->id,
            'chatSessionId' => (string) $this->chat_session_id,
            'senderId'      => (string) $this->sender_id,
            'senderName'    => $this->sender ? $this->sender->name : 'Inconnu',
            'content'       => $this->content,
            'timestamp'     => $this->created_at ? $this->created_at->format('H:i') : "À l'instant",
            'isMine'        => $this->sender_id === $userId,
            'createdAt'     => $this->created_at ? $this->created_at->toIso8601String() : null,
        ];
    }
}
