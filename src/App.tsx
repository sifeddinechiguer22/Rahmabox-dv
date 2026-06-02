/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home, Compass, PlusCircle, Mail, User, HeartHandshake, Bell, Menu, Sparkles, MessageCircle } from 'lucide-react';
import { DonationItem, ActiveTab, UserProfile, ChatSession, ChatMessage } from './types';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import PostView from './components/PostView';
import MessagesView from './components/MessagesView';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
import SignUpView from './components/SignUpView';
import ItemDetailsModal from './components/ItemDetailsModal';

// Initial preloaded items taken directly from the high-fidelity screenshots & description
const INITIAL_ITEMS: DonationItem[] = [
  {
    id: 'item_1',
    title: 'Canapé d\'angle "Grey Fabric Sofa"',
    category: 'Furniture',
    condition: 'excellent',
    location: 'Downtown, NY',
    timePosted: 'Il y a 2h',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    description: 'Magnifique canapé d\'angle gris anthracite en tissu lavable. Ultra confortable, idéal pour un grand salon familial ou un local associatif chaleureux. Provenance d\'un foyer sans animaux et non fumeur. À venir récupérer sur place.',
    status: 'available',
    donorName: 'Johnathan Cole',
    coordinates: { x: 42, y: 38 }
  },
  {
    id: 'item_2',
    title: 'VTT Rockrider 24" Bleu Métallisé',
    category: 'Toys & Sports',
    condition: 'good',
    location: 'Brooklyn, NY',
    timePosted: 'Il y a 5h',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800',
    description: 'Vélo tout terrain robuste de taille 24 pouces, idéal pour un adolescent ou jeune adulte de 1m35 à 1m50. Les pneus sont en bon état de marche, freins révisés et dérailleur Shimano fonctionnel.',
    status: 'available',
    donorName: 'Elena Rostova',
    coordinates: { x: 30, y: 64 }
  },
  {
    id: 'item_3',
    title: 'Lot de 20 Livres pour Enfants d\'éveil',
    category: 'Education',
    condition: 'excellent',
    location: 'Queens, NY',
    timePosted: 'Il y a 8h',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    description: 'Une superbe collection de livres cartonnés d\'éveil et contes pour enfants de 3 à 8 ans. Comprend des récits inspirants d\'illustrateurs français, des imagiers, et de petites fables éducatives.',
    status: 'available',
    donorName: 'Amine Benjelloun',
    coordinates: { x: 74, y: 48 }
  }
];

// Initial preloaded chat sessions to simulate active community support
const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'chat_1',
    contactName: 'Secours Solidaire',
    contactRole: 'association',
    contactAvatar: 'S',
    itemTitle: 'VTT Rockrider 24" Bleu',
    lastMessage: 'Bonjour ! Nous serions ravis de récupérer le vélo pour un jeune bénéficiaire.',
    unread: true,
    messages: [
      {
        id: 'm1',
        senderId: 'association',
        senderName: 'Secours Solidaire',
        content: "Bonjour, nous sommes une association basée à Brooklyn. Nous aurions grand besoin du vélo pour un jeune enfant de 11 ans dont la famille est accueillie dans notre centre. Serait-il possible de fixer un rdv ?",
        timestamp: '11:15',
        isMine: false
      }
    ]
  },
  {
    id: 'chat_2',
    contactName: 'Karim S.',
    contactRole: 'beneficiary',
    contactAvatar: 'K',
    itemTitle: 'Canapé "Grey Fabric Sofa"',
    lastMessage: 'Pas de problème, je m\'organise pour venir avec un utilitaire ce samedi.',
    unread: false,
    messages: [
      {
        id: 'm2',
        senderId: 'user',
        senderName: 'Moi',
        content: "Bonjour Karim, oui le canapé est démontable en deux parties principales. Avez-vous un utilitaire ?",
        timestamp: 'Hier',
        isMine: true
      },
      {
        id: 'm3',
        senderId: 'beneficiary',
        senderName: 'Karim S.',
        content: "Pas de problème, merci beaucoup ! Je m'organise pour venir avec un ami et un utilitaire ce samedi matin à votre adresse.",
        timestamp: 'Hier',
        isMine: false
      }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
  
  // App states
  const [items, setItems] = useState<DonationItem[]>(() => {
    const cached = localStorage.getItem('rahmabox_items');
    return cached ? JSON.parse(cached) : INITIAL_ITEMS;
  });

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const cached = localStorage.getItem('rahmabox_sessions');
    return cached ? JSON.parse(cached) : INITIAL_SESSIONS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('rahmabox_profile');
    if (cached) return JSON.parse(cached);
    return {
      isAuthenticated: false,
      role: 'donor',
      fullName: '',
      email: '',
      phone: '',
      city: '',
      avatarUrl: '',
      itemsPostedCount: 0,
      itemsRequestedCount: 0,
    };
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [customAddedCount, setCustomAddedCount] = useState<number>(0);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('rahmabox_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('rahmabox_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('rahmabox_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Authentication Callbacks
  const handleLoginSuccess = (email: string, fullName: string) => {
    setUserProfile({
      isAuthenticated: true,
      role: email.includes('assoc') ? 'association' : 'donor',
      fullName,
      email,
      phone: '+33 6 45 32 10 99',
      city: 'Casablanca',
      avatarUrl: fullName[0].toUpperCase(),
      itemsPostedCount: 0,
      itemsRequestedCount: 2,
    });
    setActiveTab('home');
  };

  const handleSignUpSuccess = (profileData: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    role: any;
  }) => {
    setUserProfile({
      isAuthenticated: true,
      role: profileData.role,
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      city: profileData.city,
      avatarUrl: profileData.fullName[0].toUpperCase(),
      itemsPostedCount: 0,
      itemsRequestedCount: 0,
    });
    setActiveTab('home');
  };

  const handleDisconnect = () => {
    setUserProfile({
      isAuthenticated: false,
      role: 'donor',
      fullName: '',
      email: '',
      phone: '',
      city: '',
      avatarUrl: '',
      itemsPostedCount: 0,
      itemsRequestedCount: 0,
    });
    // Optional: clear cache to reset
    localStorage.removeItem('rahmabox_profile');
    setIsSigningUp(false);
  };

  // Insert newly posted donation item
  const handleAddItem = (newItem: Omit<DonationItem, 'id' | 'timePosted' | 'status' | 'donorName' | 'coordinates'>) => {
    const itemObject: DonationItem = {
      ...newItem,
      id: `item_custom_${Date.now()}`,
      timePosted: "À l'instant",
      status: 'available',
      donorName: userProfile.fullName || "Moi",
      coordinates: {
        x: Math.floor(Math.random() * 50) + 25, // randomize on mock map nicely
        y: Math.floor(Math.random() * 50) + 25
      }
    };

    setItems(prev => [itemObject, ...prev]);
    setCustomAddedCount(prev => prev + 1);
  };

  // Update Item Status from profile dashboard
  const handleUpdateItemStatus = (id: string, newStatus: 'available' | 'requested' | 'donated') => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  // Messaging trigger when requesting an item
  const handleRequestItem = (item: DonationItem) => {
    // Check if session already exists
    const existingSession = sessions.find(s => s.itemTitle === item.title && s.contactName === item.donorName);
    
    if (existingSession) {
      setActiveSessionId(existingSession.id);
      setActiveTab('messages');
      setSelectedItem(null);
      return;
    }

    // Generate new secure message log
    const newSessionId = `chat_session_${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      contactName: item.donorName || "Donateur Solidaire",
      contactRole: 'donor',
      contactAvatar: item.donorName ? item.donorName[0] : 'D',
      itemTitle: item.title,
      lastMessage: `Bonjour ! Je suis intéressé par votre don de « ${item.title} »`,
      unread: false,
      messages: [
        {
          id: `m_init_${Date.now()}`,
          senderId: 'user',
          senderName: 'Moi',
          content: `Bonjour ! Je suis sincèrement intéressé par votre don de « ${item.title} » répertorié à ${item.location}. Es-il encore libre d'attribution et comment pouvons-nous nous organiser pour la remise ? Merci d'avance !`,
          timestamp: 'À l\'instant',
          isMine: true
        }
      ]
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setActiveTab('messages');
    setSelectedItem(null);

    // Simulate instant reaction mock response after 1.5s
    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.id === newSessionId) {
          const autoMsg: ChatMessage = {
            id: `m_resp_${Date.now()}`,
            senderId: 'contact',
            senderName: item.donorName,
            content: `Bonjour ! Merci beaucoup pour votre message. Oui, l'objet « ${item.title} » est absolument disponible et préservé pour vous. Je suis généralement libre en fin de journée (dès 18h) pour programmer la remise en mains propres. Cela vous convient-il ?`,
            timestamp: 'À l\'instant',
            isMine: false
          };
          return {
            ...s,
            unread: true,
            lastMessage: autoMsg.content,
            messages: [...s.messages, autoMsg]
          };
        }
        return s;
      }));
    }, 1500);
  };

  // Send message handler inside chat tab
  const handleSendMessage = (sessionId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: 'user',
      senderName: 'Moi',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    };

    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          lastMessage: text,
          unread: false,
          messages: [...s.messages, newMessage]
        };
      }
      return s;
    }));

    // Trigger intelligent answers based on content keywords
    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.id === sessionId) {
          const lowerText = text.toLowerCase();
          let responseText = "Entendu ! Fixons ensemble un point de rendez-vous solidaire pour sceller ce beau geste.";
          
          if (lowerText.includes('bonjour') || lowerText.includes('salut')) {
            responseText = `Bonjour ! Merci d'avoir écrit, comment puis-je vous guider pour l'acheminement de l'objet « ${s.itemTitle} » ?`;
          } else if (lowerText.includes('adresse') || lowerText.includes('où')) {
            responseText = `Je suis localisé près du point central de la commune de ${userProfile.city || 'Brooklyn'}. Nous pouvons convenir d'une remise d'objet sur la grand place ou directement à l'adresse de collecte de l'association.`;
          } else if (lowerText.includes('merci') || lowerText.includes('parfait')) {
            responseText = `Tout le plaisir est pour moi ! RahmaBox vit à travers vos actions d'entraide circulaires. À très vite !`;
          }

          const autoReply: ChatMessage = {
            id: `m_rep_${Date.now()}`,
            senderId: 'contact',
            senderName: s.contactName,
            content: responseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMine: false
          };

          return {
            ...s,
            lastMessage: autoReply.content,
            unread: true,
            messages: [...s.messages, autoReply]
          };
        }
        return s;
      }));
    }, 1500);
  };

  // If user is not authenticated, render Login/Signup screens
  if (!userProfile.isAuthenticated) {
    if (isSigningUp) {
      return (
        <SignUpView 
          onSignUpSuccess={handleSignUpSuccess}
          onNavigateToLogin={() => setIsSigningUp(false)}
        />
      );
    }
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignup={() => setIsSigningUp(true)}
      />
    );
  }

  // Active view router
  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            items={items}
            onSelectItem={(item) => setSelectedItem(item)}
            onChangeTab={(tab) => setActiveTab(tab)}
            donorCount={customAddedCount}
          />
        );
      case 'explore':
        return (
          <ExploreView 
            items={items}
            onSelectItem={(item) => setSelectedItem(item)}
            onRequestItem={handleRequestItem}
          />
        );
      case 'post':
        return (
          <PostView 
            userProfile={userProfile}
            onAddItem={handleAddItem}
            onChangeTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'messages':
        return (
          <MessagesView 
            sessions={sessions}
            onSendMessage={handleSendMessage}
            activeSessionId={activeSessionId}
            onSelectSession={(id) => {
              setActiveSessionId(id);
              // reset unread indicator on selection
              setSessions(prev => prev.map(s => s.id === id ? { ...s, unread: false } : s));
            }}
          />
        );
      case 'profile':
        const myContributions = items.filter(i => i.donorName === userProfile.fullName);
        return (
          <ProfileView 
            userProfile={userProfile}
            myItems={myContributions}
            onDisconnectProfile={handleDisconnect}
            onNavigateToPost={() => setActiveTab('post')}
            onUpdateItemStatus={handleUpdateItemStatus}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-slate-50">
      
      {/* Dynamic TopAppBar Section */}
      <header className="flex justify-between items-center w-full px-4 h-16 bg-white border-b border-slate-100 sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary text-white rounded-lg block">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h1 className="font-display font-bold text-lg text-primary tracking-tight leading-none">RahmaBox</h1>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-4">
          
          {/* Notifications center mockup */}
          <button className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors focus:outline-hidden cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Mini active user badge */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-semibold text-slate-600 block max-w-[80px] truncate">{userProfile.fullName}</span>
            <div 
              onClick={() => setActiveTab('profile')} 
              className="w-8 h-8 rounded-full bg-emerald-100 text-secondary border border-emerald-200/50 flex items-center justify-center font-bold text-xs shadow-xs hover:scale-105 transition-all cursor-pointer"
            >
              {userProfile.avatarUrl || 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Screen Tab View content container with custom max width fluid styling */}
      <main className="flex-1 max-w-7xl w-full mx-auto pb-4">
        {renderActiveView()}
      </main>

      {/* Integrated Item details modal overlay */}
      {selectedItem && (
        <ItemDetailsModal 
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRequest={handleRequestItem}
        />
      )}

      {/* Dynamic Navigation panel bottom stick bar sticky nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xs border-t border-slate-200 shadow-xl flex justify-around items-center py-2 px-1">
        
        {/* TAB 1: Home */}
        <button 
          onClick={() => { setActiveTab('home'); setActiveSessionId(null); }}
          className={`flex flex-col items-center justify-center py-1 px-3 sm:px-6 rounded-xl transition-all cursor-pointer focus:outline-hidden ${
            activeTab === 'home' 
              ? 'bg-primary/10 text-primary font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5 shrink-0" />
          <span className="text-[10px] mt-1 tracking-wide">Accueil</span>
        </button>

        {/* TAB 2: Explore */}
        <button 
          onClick={() => { setActiveTab('explore'); setActiveSessionId(null); }}
          className={`flex flex-col items-center justify-center py-1 px-3 sm:px-6 rounded-xl transition-all cursor-pointer focus:outline-hidden ${
            activeTab === 'explore' 
              ? 'bg-primary/10 text-primary font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className="w-5 h-5 shrink-0" />
          <span className="text-[10px] mt-1 tracking-wide">Explorer</span>
        </button>

        {/* TAB 3: Post (Donation Button) */}
        <button 
          onClick={() => { setActiveTab('post'); setActiveSessionId(null); }}
          className={`flex flex-col items-center justify-center py-1.5 px-3 sm:px-6 rounded-xl transition-all cursor-pointer focus:outline-hidden ${
            activeTab === 'post' 
              ? 'bg-primary/10 text-primary font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <PlusCircle className="w-5 h-5 shrink-0 text-amber-600 animate-pulse" />
          <span className="text-[10px] mt-1 tracking-wide">Donner</span>
        </button>

        {/* TAB 4: Messages */}
        <button 
          onClick={() => { setActiveTab('messages'); }}
          className={`relative flex flex-col items-center justify-center py-1 px-3 sm:px-6 rounded-xl transition-all cursor-pointer focus:outline-hidden ${
            activeTab === 'messages' 
              ? 'bg-primary/10 text-primary font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Mail className="w-5 h-5 shrink-0" />
          <span className="text-[10px] mt-1 tracking-wide">Messages</span>
          {sessions.some(s => s.unread) && (
            <span className="absolute top-1.5 right-4 w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
          )}
        </button>

        {/* TAB 5: Profile */}
        <button 
          onClick={() => { setActiveTab('profile'); setActiveSessionId(null); }}
          className={`flex flex-col items-center justify-center py-1 px-3 sm:px-6 rounded-xl transition-all cursor-pointer focus:outline-hidden ${
            activeTab === 'profile' 
              ? 'bg-primary/10 text-primary font-bold' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5 shrink-0" />
          <span className="text-[10px] mt-1 tracking-wide">Profil</span>
        </button>

      </nav>

    </div>
  );
}
