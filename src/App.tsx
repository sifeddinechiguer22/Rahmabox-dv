/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { getGoogleRedirectResult } from './firebase';
import { apiService, frontendRoleFromBackend } from './services/apiService';
import { Home, Compass, PlusCircle, Mail, User, HeartHandshake, Bell, LogOut, Settings } from 'lucide-react';
import { DonationItem, ActiveTab, UserProfile, ChatSession, ChatMessage, UserRole } from './types';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import PostView from './components/PostView';
import MessagesView from './components/MessagesView';
import ProfileView from './components/ProfileView';
import LoginView from './components/LoginView';
import SignUpView from './components/SignUpView';
import ItemDetailsModal from './components/ItemDetailsModal';

const INITIAL_ITEMS: DonationItem[] = [
  {
    id: 'item_1',
    title: 'Canapé d\'angle "Grey Fabric Sofa"',
    category: 'Furniture', condition: 'excellent', location: 'Downtown, NY', timePosted: 'Il y a 2h',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    description: 'Magnifique canapé d\'angle gris anthracite en tissu lavable.',
    status: 'available', donorName: 'Johnathan Cole', coordinates: { x: 42, y: 38 }
  },
  {
    id: 'item_2',
    title: 'VTT Rockrider 24" Bleu Métallisé',
    category: 'Toys & Sports', condition: 'good', location: 'Brooklyn, NY', timePosted: 'Il y a 5h',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800',
    description: 'Vélo tout terrain robuste de taille 24 pouces.',
    status: 'available', donorName: 'Elena Rostova', coordinates: { x: 30, y: 64 }
  },
  {
    id: 'item_3',
    title: 'Lot de 20 Livres pour Enfants d\'éveil',
    category: 'Education', condition: 'excellent', location: 'Queens, NY', timePosted: 'Il y a 8h',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    description: 'Une superbe collection de livres cartonnés d\'éveil et contes pour enfants.',
    status: 'available', donorName: 'Amine Benjelloun', coordinates: { x: 74, y: 48 }
  }
];

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'chat_1', contactName: 'Secours Solidaire', contactRole: 'association', contactAvatar: 'S',
    itemTitle: 'VTT Rockrider 24" Bleu',
    lastMessage: 'Bonjour ! Nous serions ravis de récupérer le vélo.',
    unread: true,
    messages: [{ id: 'm1', senderId: 'association', senderName: 'Secours Solidaire', content: "Bonjour, serait-il possible de fixer un rdv ?", timestamp: '11:15', isMine: false }]
  },
  {
    id: 'chat_2', contactName: 'Karim S.', contactRole: 'beneficiary', contactAvatar: 'K',
    itemTitle: 'Canapé "Grey Fabric Sofa"',
    lastMessage: 'Pas de problème, je m\'organise pour venir ce samedi.',
    unread: false,
    messages: [
      { id: 'm2', senderId: 'user', senderName: 'Moi', content: "Bonjour Karim, avez-vous un utilitaire ?", timestamp: 'Hier', isMine: true },
      { id: 'm3', senderId: 'beneficiary', senderName: 'Karim S.', content: "Pas de problème ! Je viens avec un utilitaire ce samedi.", timestamp: 'Hier', isMine: false }
    ]
  }
];

const EMPTY_PROFILE: UserProfile = {
  isAuthenticated: false, role: 'donor', fullName: '', email: '',
  phone: '', city: '', avatarUrl: '', itemsPostedCount: 0, itemsRequestedCount: 0,
};

// ── Protected layout shown when logged in ──────────────────────────────────
function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [customAddedCount, setCustomAddedCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [items, setItems] = useState<DonationItem[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const c = localStorage.getItem('rahmabox_profile');
    return c ? JSON.parse(c) : EMPTY_PROFILE;
  });
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('rahmabox_token'));

  const pathToTab: Record<string, ActiveTab> = {
    '/': 'home', '/explore': 'explore', '/post': 'post', '/messages': 'messages', '/profile': 'profile',
  };
  const activeTab: ActiveTab = pathToTab[location.pathname] ?? 'home';

  // Fetch data dynamically depending on active tab
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      if (activeTab === 'home' || activeTab === 'explore' || activeTab === 'profile') {
        try {
          const resItems = await apiService.getItems();
          if (active) setItems(resItems);
        } catch (e) {
          console.error("Failed to load items:", e);
        }
      }
      if (activeTab === 'messages' || activeTab === 'home') {
        try {
          const resChats = await apiService.getChats();
          if (active) setSessions(resChats);
        } catch (e) {
          console.error("Failed to load chats:", e);
        }
      }
    };
    if (userProfile.isAuthenticated) {
      fetchData();
    }
    return () => {
      active = false;
    };
  }, [activeTab, userProfile.isAuthenticated]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // If not authenticated redirect to login
  if (!userProfile.isAuthenticated) return <Navigate to="/login" replace />;

  const goTab = (tab: ActiveTab) => {
    const map: Record<ActiveTab, string> = { home: '/', explore: '/explore', post: '/post', messages: '/messages', profile: '/profile' };
    navigate(map[tab]);
  };

  const handleDisconnect = async () => {
    setDropdownOpen(false);
    try {
      await apiService.logout();
    } catch (_) {}
    localStorage.removeItem('rahmabox_profile');
    localStorage.removeItem('rahmabox_token');
    setAuthToken(null);
    setUserProfile(EMPTY_PROFILE);
    navigate('/login');
  };

  const handleAddItem = async (newItem: Omit<DonationItem, 'id' | 'timePosted' | 'status' | 'donorName' | 'coordinates'> & { imageFile?: File | null }) => {
    try {
      const created = await apiService.createItem(newItem);
      setItems(prev => [created, ...prev]);
      setCustomAddedCount(p => p + 1);
    } catch (err: any) {
      alert("Erreur lors de la création du don : " + err.message);
    }
  };

  const handleRequestItem = async (item: DonationItem) => {
    try {
      const chat = await apiService.startChat(item.id);
      const resChats = await apiService.getChats();
      setSessions(resChats);
      setActiveSessionId(chat.id);
      goTab('messages');
      setSelectedItem(null);
    } catch (err: any) {
      alert("Erreur lors de la demande : " + err.message);
    }
  };

  const handleSendMessage = async (sessionId: string, text: string) => {
    try {
      const newMsg = await apiService.sendMessage(sessionId, text);
      setSessions(prev => prev.map(s => s.id !== sessionId ? s : {
        ...s,
        lastMessage: text,
        unread: false,
        messages: [...(s.messages || []), newMsg]
      }));
    } catch (err: any) {
      console.error("Erreur d'envoi du message :", err);
    }
  };

  const handleUpdateItemStatus = async (id: string, status: 'available' | 'requested' | 'donated') => {
    try {
      const updated = await apiService.updateItemStatus(id, status);
      setItems(prev => prev.map(i => i.id === id ? updated : i));
    } catch (err: any) {
      alert("Erreur lors de la mise à jour du statut : " + err.message);
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home':     return <HomeView items={items} onSelectItem={setSelectedItem} onChangeTab={goTab} donorCount={customAddedCount} />;
      case 'explore':  return <ExploreView items={items} onSelectItem={setSelectedItem} onRequestItem={handleRequestItem} />;
      case 'post':     return <PostView userProfile={userProfile} onAddItem={handleAddItem} onChangeTab={goTab} />;
      case 'messages': return <MessagesView sessions={sessions} onSendMessage={handleSendMessage} activeSessionId={activeSessionId} onSelectSession={(id) => { setActiveSessionId(id); setSessions(prev => prev.map(s => s.id === id ? { ...s, unread: false } : s)); }} />;
      case 'profile':  return <ProfileView userProfile={userProfile} myItems={items.filter(i => i.donorName === userProfile.fullName)} onDisconnectProfile={handleDisconnect} onNavigateToPost={() => goTab('post')} onUpdateItemStatus={handleUpdateItemStatus} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-slate-50">
      <header className="flex justify-between items-center w-full px-4 h-16 bg-white border-b border-slate-100 sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary text-white rounded-lg"><HeartHandshake className="w-5 h-5" /></div>
          <h1 className="font-display font-bold text-lg text-primary tracking-tight leading-none">RahmaBox</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(o => !o)} className="flex items-center gap-2 cursor-pointer focus:outline-none">
              <span className="hidden sm:inline text-xs font-semibold text-slate-600 max-w-[80px] truncate">{userProfile.fullName}</span>
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm border-2 border-primary/20">
                {userProfile.fullName?.[0]?.toUpperCase() ?? 'U'}
              </div>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="font-bold text-slate-800 text-sm truncate">{userProfile.fullName}</p>
                  <p className="text-xs text-slate-400 truncate">{userProfile.email}</p>
                </div>
                <button onClick={() => { setDropdownOpen(false); goTab('profile'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                  <Settings className="w-4 h-4 text-slate-400" /> Mon profil
                </button>
                <button onClick={handleDisconnect} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 cursor-pointer border-t border-slate-100">
                  <LogOut className="w-4 h-4" /> Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto pb-4">{renderView()}</main>

      {selectedItem && <ItemDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} onRequest={handleRequestItem} />}

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xs border-t border-slate-200 shadow-xl flex justify-around items-center py-2 px-1">
        {([['/', 'home', <Home className="w-5 h-5" />, 'Accueil'],
           ['/explore', 'explore', <Compass className="w-5 h-5" />, 'Explorer'],
           ['/post', 'post', <PlusCircle className="w-5 h-5 text-amber-600 animate-pulse" />, 'Donner'],
           ['/messages', 'messages', <Mail className="w-5 h-5" />, 'Messages'],
           ['/profile', 'profile', <User className="w-5 h-5" />, 'Profil'],
        ] as [string, ActiveTab, React.ReactNode, string][]).map(([, tab, icon, label]) => (
          <button key={tab} onClick={() => goTab(tab)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 sm:px-6 rounded-xl transition-all cursor-pointer focus:outline-none ${activeTab === tab ? 'bg-primary/10 text-primary font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
            {icon}
            <span className="text-[10px] mt-1 tracking-wide">{label}</span>
            {tab === 'messages' && sessions.some(s => s.unread) && <span className="absolute top-1.5 right-3 w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Root App with auth routing ─────────────────────────────────────────────
export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const c = localStorage.getItem('rahmabox_profile');
    return c ? JSON.parse(c) : EMPTY_PROFILE;
  });
  const [, setAuthToken] = useState<string | null>(() => localStorage.getItem('rahmabox_token'));

  // Verify auth on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('rahmabox_token');
      if (token) {
        try {
          const user = await apiService.me();
          const profile: UserProfile = {
            isAuthenticated: true,
            role: frontendRoleFromBackend(user.role || 'donateur'),
            fullName: user.name,
            email: user.email,
            phone: user.phone || '',
            city: user.city || '',
            avatarUrl: user.name[0].toUpperCase(),
            itemsPostedCount: 0,
            itemsRequestedCount: 0,
          };
          localStorage.setItem('rahmabox_profile', JSON.stringify(profile));
          setUserProfile(profile);
        } catch (err) {
          console.warn("Session expired or invalid token:", err);
          localStorage.removeItem('rahmabox_profile');
          localStorage.removeItem('rahmabox_token');
          setUserProfile(EMPTY_PROFILE);
        }
      }
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    getGoogleRedirectResult().then((googleUser) => {
      if (!googleUser) return;
      const profile: UserProfile = {
        isAuthenticated: true,
        role: frontendRoleFromBackend(googleUser.role),
        fullName: googleUser.fullName,
        email: googleUser.email,
        phone: googleUser.phone || '',
        city: googleUser.city || '',
        avatarUrl: googleUser.fullName[0].toUpperCase(),
        itemsPostedCount: 0,
        itemsRequestedCount: 0,
      };
      localStorage.setItem('rahmabox_profile', JSON.stringify(profile));
      if (googleUser.token) localStorage.setItem('rahmabox_token', googleUser.token);
      setUserProfile(profile);
    }).catch(() => {});
  }, []);

  const handleLoginSuccess = (data: { fullName: string; email: string; phone: string; city: string; role: UserRole; token?: string }) => {
    const profile: UserProfile = {
      isAuthenticated: true, role: data.role, fullName: data.fullName,
      email: data.email, phone: data.phone, city: data.city,
      avatarUrl: data.fullName[0].toUpperCase(), itemsPostedCount: 0, itemsRequestedCount: 0,
    };
    localStorage.setItem('rahmabox_profile', JSON.stringify(profile));
    if (data.token) { localStorage.setItem('rahmabox_token', data.token); setAuthToken(data.token); }
    setUserProfile(profile);
  };

  const isAuth = userProfile.isAuthenticated;

  return (
    <Routes>
      <Route path="/login" element={isAuth ? <Navigate to="/" replace /> : <LoginView onLoginSuccess={handleLoginSuccess} onNavigateToSignup={() => window.location.href = '/register'} />} />
      <Route path="/register" element={isAuth ? <Navigate to="/" replace /> : <SignUpView onSignUpSuccess={() => window.location.href = '/login'} onNavigateToLogin={() => window.location.href = '/login'} />} />
      <Route path="/" element={<AppLayout />} />
      <Route path="/explore" element={<AppLayout />} />
      <Route path="/post" element={<AppLayout />} />
      <Route path="/messages" element={<AppLayout />} />
      <Route path="/profile" element={<AppLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
