/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Menu, Bell, Search, PlusCircle, ArrowRight, MapPin, Sparkles, AlertCircle, Shirt, Sofa, Plug, Gamepad2, BookOpen, HandHeart } from 'lucide-react';
import { DonationItem, ActiveTab } from '../types';
import { motion } from 'motion/react';

interface HomeViewProps {
  items: DonationItem[];
  onSelectItem: (item: DonationItem) => void;
  onChangeTab: (tab: ActiveTab) => void;
  donorCount: number;
}

export default function HomeView({ items, onSelectItem, onChangeTab, donorCount }: HomeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Categories defined as in the screenshots
  const categories = [
    { id: 'all', label: 'Tout', icon: <Sparkles className="w-6 h-6" /> },
    { id: 'clothing', label: 'Vêtements', icon: <Shirt className="w-6 h-6" /> },
    { id: 'furniture', label: 'Mobilier', icon: <Sofa className="w-6 h-6" /> },
    { id: 'appliances', label: 'Électroménager', icon: <Plug className="w-6 h-6" /> },
    { id: 'toys', label: 'Jouets', icon: <Gamepad2 className="w-6 h-6" /> },
    { id: 'education', label: 'Éducation', icon: <BookOpen className="w-6 h-6" /> },
  ];

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner Slide */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[21/9] flex items-center bg-primary shadow-lg border border-primary/20">
          {/* Cover image with subtle low-opacity vector overlay */}
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-35 hover:scale-105 transition-transform duration-1000" 
            alt="Warm inviting human donation center" 
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent z-5"></div>
          
          <div className="relative z-10 p-6 md:p-12 max-w-2xl text-white space-y-4">
            <span className="bg-tertiary text-on-tertiary text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> Économie Circulaire
            </span>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-lg">
              Transformez votre encombrement en espoir.
            </h2>
            <p className="text-white/80 text-xs sm:text-sm md:text-base max-w-md hidden sm:block font-light">
              Donnez vos vêtements, meubles, livres et jouets inutilisés pour soutenir des familles locales et des associations à impact direct.
            </p>
            <button 
              onClick={() => onChangeTab('post')}
              className="bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed/90 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 group cursor-pointer"
            >
              Publier un Don
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-on-tertiary-fixed group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Search bar embedded into home screen for swift exploration */}
      <section className="px-4">
        <div className="relative flex items-center w-full max-w-md mx-auto">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input 
            type="text"
            placeholder="Rechercher des dons par titre, ville, mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm shadow-xs placeholder:text-slate-400 outline-hidden"
          />
        </div>
      </section>

      {/* Horizontal Scrollable Categories Filter */}
      <section className="py-2 space-y-3">
        <div className="flex justify-between items-center px-4">
          <h3 className="font-display text-lg font-bold text-slate-900">Catégories d'entraide</h3>
          <button 
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="text-primary hover:text-primary-container text-xs font-semibold cursor-pointer"
          >
            Réinitialiser
          </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 hide-scrollbar">
          {categories.map((cat, idx) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-2 min-w-[84px] group focus:outline-hidden cursor-pointer`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 transform group-active:scale-90 ${
                  isActive 
                    ? 'bg-secondary text-white shadow-md ring-4 ring-emerald-50' 
                    : 'bg-surface-container-high text-slate-700 hover:bg-surface-container-highest'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-xs font-medium truncate max-w-[85px] ${isActive ? 'text-secondary font-bold' : 'text-slate-600'}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Impact Progress Section */}
      <section className="px-4">
        <div className="bg-surface-container-low border border-slate-200/80 p-5 rounded-2xl flex flex-col sm:flex-row items-center sm:items-stretch gap-4 relative overflow-hidden shadow-xs">
          <div className="absolute -right-6 -bottom-6 opacity-10 text-secondary pointer-events-none">
            <HandHeart className="w-24 h-24" />
          </div>
          
          <div className="flex-1 w-full space-y-3">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">NOTRE IMPACT COMMUNAUTAIRE</p>
            <div className="flex items-baseline gap-2">
              <h4 className="font-display text-3xl font-bold text-primary">{1240 + donorCount}</h4>
              <span className="text-sm text-slate-500 font-medium">objets offerts avec amour ce mois-ci</span>
            </div>
            
            {/* Elegant progress slider */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-700 w-4/5" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>Objectif mensuel: 1 500 objets</span>
              <span>{Math.round(((1240 + donorCount) / 1500) * 100)}% Atteint</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Donations Header & Grid */}
      <section className="px-4 space-y-4">
        <div className="flex justify-between items-center mb-1">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">Dons récents</h3>
            <p className="text-xs text-slate-400">Objets trouvés près de chez vous de façon solidaire</p>
          </div>
          <button 
            onClick={() => onChangeTab('explore')}
            className="text-primary hover:text-primary-container text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            Filtre Carte <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-2xl">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium">Aucun don ne correspond à vos filtres actuels.</p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-xs text-primary font-bold underline cursor-pointer"
            >
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item, idx) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
              >
                {/* Image panel with tags */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden shrink-0">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                    alt={item.title} 
                    src={item.imageUrl}
                    referrerPolicy="no-referrer"
                  />
                  {idx === 0 && (
                    <span className="absolute top-3 left-3 bg-secondary text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
                      Nouveau
                    </span>
                  )}
                  {item.status !== 'available' && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
                      Déjà Réservé
                    </span>
                  )}
                </div>

                {/* Card Content container */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      {item.category}
                    </span>
                    <h4 className="font-display font-semibold text-slate-900 group-hover:text-primary transition-colors text-sm sm:text-base line-clamp-1">
                      {item.title}
                    </h4>
                    
                    {/* Location detail */}
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Date Posted and Details CTA trigger */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs mt-auto">
                    <span className="text-slate-400 font-light">Publié {item.timePosted}</span>
                    <button 
                      onClick={() => onSelectItem(item)}
                      className="text-primary hover:text-primary-container font-semibold flex items-center gap-1 cursor-pointer focus:outline-hidden"
                    >
                      Détails <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
    </div>
  );
}
