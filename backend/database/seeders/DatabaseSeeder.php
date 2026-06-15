<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DonationItem;
use App\Models\ChatSession;
use App\Models\ChatMessage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create the main Test User (Logged in by default)
        $testUser = User::create([
            'name'         => 'Test User',
            'email'        => 'test@example.com',
            'password'     => Hash::make('password'),
            'role'         => 'donateur',
            'phone'        => '+33 6 12 34 56 78',
            'city'         => 'Casablanca',
        ]);

        // 2. Create other mock users
        $johnathan = User::create([
            'name'     => 'Johnathan Cole',
            'email'    => 'johnathan@example.com',
            'password' => Hash::make('password'),
            'role'     => 'donateur',
            'city'     => 'Downtown, NY',
        ]);

        $elena = User::create([
            'name'     => 'Elena Rostova',
            'email'    => 'elena@example.com',
            'password' => Hash::make('password'),
            'role'     => 'donateur',
            'city'     => 'Brooklyn, NY',
        ]);

        $amine = User::create([
            'name'     => 'Amine Benjelloun',
            'email'    => 'amine@example.com',
            'password' => Hash::make('password'),
            'role'     => 'donateur',
            'city'     => 'Queens, NY',
        ]);

        $secours = User::create([
            'name'                => 'Secours Solidaire',
            'email'               => 'secours@example.com',
            'password'            => Hash::make('password'),
            'role'                => 'association',
            'company_name'        => 'Secours Solidaire',
            'registration_number' => '123456789',
            'city'                => 'Brooklyn, NY',
        ]);

        $karim = User::create([
            'name'     => 'Karim S.',
            'email'    => 'karim@example.com',
            'password' => Hash::make('password'),
            'role'     => 'beneficiaire',
            'city'     => 'Downtown, NY',
        ]);

        // 3. Create items
        // Item 1 (owned by Johnathan)
        $item1 = DonationItem::create([
            'title'         => 'Canapé d\'angle "Grey Fabric Sofa"',
            'category'      => 'Furniture',
            'condition'     => 'excellent',
            'location'      => 'Casablanca Center',
            'description'   => 'Magnifique canapé d\'angle gris anthracite en tissu lavable.',
            'image_url'     => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
            'status'        => 'available',
            'donor_id'      => $johnathan->id,
            'latitude'      => 33.5731,
            'longitude'     => -7.5898,
        ]);

        // Item 2 (owned by Elena)
        $item2 = DonationItem::create([
            'title'         => 'VTT Rockrider 24" Bleu Métallisé',
            'category'      => 'Toys & Sports',
            'condition'     => 'good',
            'location'      => 'Maarif, Casablanca',
            'description'   => 'Vélo tout terrain robuste de taille 24 pouces.',
            'image_url'     => 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800',
            'status'        => 'available',
            'donor_id'      => $elena->id,
            'latitude'      => 33.5892,
            'longitude'     => -7.6041,
        ]);

        // Item 3 (owned by Amine)
        $item3 = DonationItem::create([
            'title'         => 'Lot de 20 Livres pour Enfants d\'éveil',
            'category'      => 'Education',
            'condition'     => 'excellent',
            'location'      => 'Rabat',
            'description'   => 'Une superbe collection de livres cartonnés d\'éveil et contes pour enfants.',
            'image_url'     => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
            'status'        => 'available',
            'donor_id'      => $amine->id,
            'latitude'      => 34.0209,
            'longitude'     => -6.8416,
        ]);

        // 4. Create items owned by Test User for active chats
        $testItem1 = DonationItem::create([
            'title'         => 'Vélo Rockrider 24" Bleu',
            'category'      => 'Toys & Sports',
            'condition'     => 'good',
            'location'      => 'Maarif, Casablanca',
            'description'   => 'Vélo de test.',
            'image_url'     => 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800',
            'status'        => 'available',
            'donor_id'      => $testUser->id,
            'latitude'      => 33.5912,
            'longitude'     => -7.6189,
        ]);

        $testItem2 = DonationItem::create([
            'title'         => 'Canapé "Grey Fabric Sofa"',
            'category'      => 'Furniture',
            'condition'     => 'excellent',
            'location'      => 'Oulfa, Casablanca',
            'description'   => 'Canapé de test.',
            'image_url'     => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
            'status'        => 'available',
            'donor_id'      => $testUser->id,
            'latitude'      => 33.5524,
            'longitude'     => -7.6510,
        ]);

        // 5. Create chat sessions
        // Session 1: Secours Solidaire chats with Test User about testItem1
        $session1 = ChatSession::create([
            'donation_item_id' => $testItem1->id,
            'donor_id'         => $testUser->id,
            'receiver_id'      => $secours->id,
        ]);

        ChatMessage::create([
            'chat_session_id' => $session1->id,
            'sender_id'       => $secours->id,
            'content'         => 'Bonjour ! Nous serions ravis de récupérer le vélo.',
        ]);
        ChatMessage::create([
            'chat_session_id' => $session1->id,
            'sender_id'       => $secours->id,
            'content'         => 'Bonjour, serait-il possible de fixer un rdv ?',
        ]);

        // Session 2: Karim chats with Test User about testItem2
        $session2 = ChatSession::create([
            'donation_item_id' => $testItem2->id,
            'donor_id'         => $testUser->id,
            'receiver_id'      => $karim->id,
        ]);

        ChatMessage::create([
            'chat_session_id' => $session2->id,
            'sender_id'       => $testUser->id,
            'content'         => 'Bonjour Karim, avez-vous un utilitaire ?',
        ]);
        ChatMessage::create([
            'chat_session_id' => $session2->id,
            'sender_id'       => $karim->id,
            'content'         => "Pas de problème ! Je viens avec un utilitaire ce samedi.",
        ]);
    }
}
