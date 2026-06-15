<?php

namespace App\Http\Controllers;

use App\Models\ChatSession;
use App\Models\ChatMessage;
use App\Models\DonationItem;
use App\Http\Requests\StoreChatMessageRequest;
use App\Http\Resources\ChatSessionResource;
use App\Http\Resources\ChatMessageResource;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Get all chat sessions of the logged-in user.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $sessions = ChatSession::where('donor_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->with(['donor', 'receiver', 'donationItem', 'messages'])
            ->orderBy('updated_at', 'desc')
            ->get();

        return ChatSessionResource::collection($sessions);
    }

    /**
     * Start a new chat session for a donation item.
     */
    public function storeSession(Request $request)
    {
        $request->validate([
            'donation_item_id' => 'required|exists:donation_items,id',
        ]);

        $itemId = $request->donation_item_id;
        $user = $request->user();
        $item = DonationItem::findOrFail($itemId);

        // A user shouldn't start a chat with themselves for their own item
        if ($item->donor_id === $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas démarrer une discussion pour votre propre don.'], 400);
        }

        // Check if session already exists
        $session = ChatSession::where('donation_item_id', $itemId)
            ->where('receiver_id', $user->id)
            ->first();

        if (!$session) {
            $session = ChatSession::create([
                'donation_item_id' => $itemId,
                'donor_id'         => $item->donor_id,
                'receiver_id'      => $user->id,
            ]);

            // Create an initial message from the user
            ChatMessage::create([
                'chat_session_id' => $session->id,
                'sender_id'       => $user->id,
                'content'         => "Bonjour ! Est-ce que « {$item->title} » est encore disponible ?",
            ]);
            
            // Simulation: automatically create a response after 1.5 seconds on the frontend or backend.
            // Let's create a simulated response instantly or handle it via a mock receiver message in seed/frontend.
            // For real multi-user, they wait for response. But to keep the same amazing UX as the mock, 
            // the frontend will wait 1.5 seconds and we can also support it there.
        }

        return new ChatSessionResource($session->load(['donor', 'receiver', 'donationItem', 'messages']));
    }

    /**
     * Get all messages in a session.
     */
    public function messages(Request $request, ChatSession $session)
    {
        $user = $request->user();

        // Check if user is participant
        if ($session->donor_id !== $user->id && $session->receiver_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        // Mark incoming messages as read
        ChatMessage::where('chat_session_id', $session->id)
            ->where('sender_id', '!=', $user->id)
            ->update(['is_read' => true]);

        $messages = $session->messages()
            ->orderBy('created_at', 'asc')
            ->get();

        return ChatMessageResource::collection($messages);
    }

    /**
     * Send a message in a session.
     */
    public function sendMessage(StoreChatMessageRequest $request, ChatSession $session)
    {
        $user = $request->user();

        // Check if user is participant
        if ($session->donor_id !== $user->id && $session->receiver_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $message = ChatMessage::create([
            'chat_session_id' => $session->id,
            'sender_id'       => $user->id,
            'content'         => $request->content,
        ]);

        // Touch the session to update its updated_at timestamp
        $session->touch();

        return new ChatMessageResource($message);
    }
}
