/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, MapPin, Grid, Layers, Eye, Smartphone, AlertCircle, ShoppingBag, EyeOff } from 'lucide-react';
import { DonationItem } from '../types';

interface ExploreViewProps {
  items: DonationItem[];
  onSelectItem: (item: DonationItem) => void;
  onRequestItem: (item: DonationItem) => void;
}

export default function ExploreView({ items, onSelectItem, onRequestItem }: ExploreViewProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredItem, setHoveredItem] = useState<DonationItem | null>(null);

  // Filters from the screenshots
  const filters = [
    { id: 'all', label: 'Tout' },
    { id: 'nearby', label: 'Proches', icon: 'near_me' },
    { id: 'newest', label: 'Récents' },
    { id: 'furniture', label: 'Mobilier' },
    { id: 'appliances', label: 'Électroménager' },
  ];

  // Filtering logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (selectedFilter === 'furniture') {
        matchesFilter = item.category.toLowerCase().includes('furniture') || item.category.toLowerCase().includes('mobilier');
      } else if (selectedFilter === 'appliances') {
        matchesFilter = item.category.toLowerCase().includes('appliance') || item.category.toLowerCase().includes('électro');
      } else if (selectedFilter === 'newest') {
        // simulation (e.g. newer listed ones)
        matchesFilter = true;
      } else if (selectedFilter === 'nearby') {
        matchesFilter = item.location.includes('Brooklyn') || item.location.includes('Queens') || item.location.includes('Downtown');
      }

      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, selectedFilter]);

  // Clean condition mappings
  const conditionLabels: Record<string, string> = {
    new: 'Neuf',
    excellent: 'Excellent',
    good: 'Bon état',
    fair: 'Satisfaisant',
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] overflow-hidden">
      
      {/* Search and Filters Header Section */}
      <div className="p-4 bg-white border-b border-slate-100 space-y-3 z-10 shrink-0">
        
        {/* Input box */}
        <div className="relative flex items-center max-w-lg mx-auto">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input 
            type="text"
            placeholder="Rechercher des dons ou villes (ex: Brooklyn, NY)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm outline-hidden placeholder:text-slate-400"
          />
        </div>

        {/* Chips filter list */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 max-w-lg mx-auto shrink-0">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedFilter === filter.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main split display body tab */}
      <div className="flex-1 relative bg-slate-50">
        
        {/* Floating Toggle view panel (Map View / List View) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-25">
          <div className="bg-white/95 backdrop-blur-xs p-1 rounded-full flex gap-1 shadow-md border border-slate-200/80">
            <button 
              onClick={() => setViewMode('map')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Carte Interactive
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Liste des Dons
            </button>
          </div>
        </div>

        {/* VIEW 1: MAP VIEW */}
        {viewMode === 'map' && (
          <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
            
            {/* Custom interactive Vector landscape background illustration representing Amman/NY roads & block networks */}
            <svg className="w-full h-full min-w-[700px] bg-slate-100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Central city park */}
              <rect x="15%" y="20%" width="30%" height="25%" rx="12" fill="#dcfce7" opacity="0.85" />
              <text x="30%" y="33%" fill="#166534" className="text-xs font-semibold" textAnchor="middle">Parc de la Fraternité</text>

              {/* Waterway / Canal */}
              <path d="M-50,300 C200,280 400,450 900,400" fill="none" stroke="#e0f2fe" strokeWidth="48" strokeLinecap="round" opacity="0.9" />
              <text x="450" y="440" fill="#0369a1" className="text-[10px] font-bold" transform="rotate(10 450 440)">Fleuve d'Entraide</text>

              {/* District blocks */}
              <rect x="60%" y="15%" width="25%" height="18%" rx="10" fill="#f1f5f9" stroke="#cbd5e1" strokeDasharray="3 3" />
              <text x="72%" y="25%" fill="#475569" className="text-[10px] uppercase font-bold" textAnchor="middle">Zone Commerciale</text>

              <rect x="55%" y="55%" width="30%" height="30%" rx="10" fill="#f1f5f9" stroke="#cbd5e1" strokeDasharray="3 3" />
              <text x="70%" y="70%" fill="#475569" className="text-[10px] uppercase font-bold" textAnchor="middle">Quartier Résidentiel</text>

              {/* Primary roads system */}
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ffffff" strokeWidth="22" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />
              
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#ffffff" strokeWidth="22" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />
            </svg>

            {/* Gradient bottom and top labels */}
            <div className="absolute top-16 left-4 bg-slate-900/80 text-white text-[10px] py-1 px-2.5 rounded-full backdrop-blur-xs font-mono font-medium">
              Simulation GPS : {filteredItems.length} dons localisés
            </div>

            {/* Interactive Pins overlay mapping */}
            {filteredItems.map((item, idx) => {
              const isHovered = hoveredItem?.id === item.id;
              const emojiIcon = item.category.toLowerCase().includes('furniture') ? '🛋️' :
                                item.category.toLowerCase().includes('cloth') ? '👕' :
                                item.category.toLowerCase().includes('appliances') ? '🔌' :
                                item.category.toLowerCase().includes('toys') ? '🧸' : '📚';

              return (
                <div 
                  key={item.id}
                  className="absolute transition-transform duration-300 transform -translate-x-1/2 -translate-y-1/2 z-20 hover:scale-110"
                  style={{ left: `${item.coordinates.x}%`, top: `${item.coordinates.y}%` }}
                >
                  <div className="relative">
                    {/* Ring aura indicator */}
                    <div className="absolute -inset-3 bg-primary/20 rounded-full animate-ping pointer-events-none" style={{ animationDelay: `${idx * 0.4}s` }}></div>
                    
                    {/* Main trigger map pin */}
                    <button
                      onClick={() => setHoveredItem(isHovered ? null : item)}
                      className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-md relative z-10 cursor-pointer transition-all focus:outline-hidden ${
                        isHovered ? 'bg-secondary text-white scale-110' : 'bg-primary text-white'
                      }`}
                    >
                      <span className="text-xl">{emojiIcon}</span>
                    </button>

                    {/* Hover status Tooltip detail card popup */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 p-2.5 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-24 object-cover rounded-lg mb-2"
                          referrerPolicy="no-referrer"
                        />
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px]">
                          <MapPin className="w-3 h-3 text-secondary" />
                          <span className="text-slate-400 capitalize truncate">{item.location}</span>
                        </div>
                        <div className="mt-2.5 flex gap-1.5 justify-between">
                          <button
                            onClick={() => onSelectItem(item)}
                            className="bg-primary hover:bg-primary-container text-white text-[9px] font-bold px-2.5 py-1 rounded-sm w-full transition-all cursor-pointer"
                          >
                            Consulter
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Instruction widget if no markers are selected */}
            <div className="absolute bottom-4 left-4 right-4 max-w-sm mx-auto bg-white/95 backdrop-blur-xs p-3.5 rounded-xl text-center border border-slate-200 shadow-lg text-xs leading-relaxed text-slate-500">
              💡 Cliquez sur les repères de la carte pour consulter les détails des objets proposés et entrer en contact avec les donateurs.
            </div>
          </div>
        )}

        {/* VIEW 2: LIST VIEW */}
        {viewMode === 'list' && (
          <div className="absolute inset-0 overflow-y-auto w-full h-full p-4 pt-16 pb-20">
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center text-slate-400 max-w-md mx-auto space-y-3">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700">Aucun résultat trouvé sur la liste</p>
                <p className="text-xs text-slate-400">Essayez d'élargir vos termes de recherche ou sélectionnez un autre badge filtre pour actualiser.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                {filteredItems.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-100">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 bg-secondary-container text-on-secondary-container text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                          Disponible
                        </span>
                      </div>
                      
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{item.category}</span>
                            <h3 className="font-display font-bold text-slate-800 text-sm leading-snug line-clamp-1 mt-0.5">{item.title}</h3>
                          </div>
                          <span className="text-[10px] bg-slate-100 px-2.5 py-1 text-slate-600 font-semibold rounded-sm shrink-0 border border-slate-200/50">
                            {conditionLabels[item.condition]}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>{item.location} • Publié {item.timePosted}</span>
                        </div>
                        
                        <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed font-light">
                          {item.description || "Aucune description fournie. Cet objet d'entraide communautaire attend impatiemment de trouver une nouvelle utilité."}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex gap-2">
                      <button 
                        onClick={() => onSelectItem(item)}
                        className="flex-1 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
                      >
                        Fiche Détails
                      </button>
                      <button 
                        onClick={() => onRequestItem(item)}
                        disabled={item.status !== 'available'}
                        className="flex-1 py-2 bg-primary hover:bg-primary-container text-white rounded-lg text-xs font-semibold active:scale-98 transition-all disabled:opacity-55 cursor-pointer"
                      >
                        Demander
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
