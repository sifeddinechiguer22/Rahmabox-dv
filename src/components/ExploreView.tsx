/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, MapPin, AlertCircle, Loader } from 'lucide-react';
import { DonationItem } from '../types';
import { apiService } from '../services/apiService';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue in Vite build
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ExploreViewProps {
  items: DonationItem[];
  onSelectItem: (item: DonationItem) => void;
  onRequestItem: (item: DonationItem) => void;
}

export default function ExploreView({ items, onSelectItem, onRequestItem }: ExploreViewProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Geolocation states
  const [localItems, setLocalItems] = useState<DonationItem[]>(items);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number | 'all'>('all');
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  // Map references
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  // Sync prop items to localItems on mount or when items prop updates
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // Request browser geolocation on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserCoords(coords);
          setGpsLoading(false);
          initMap(coords.lat, coords.lng);
        },
        (error) => {
          console.warn("GPS Geolocation failed, defaulting to Casablanca:", error);
          setGpsLoading(false);
          const defaultCoords = { lat: 33.5731, lng: -7.5898 }; // Casablanca Center
          setUserCoords(defaultCoords);
          initMap(defaultCoords.lat, defaultCoords.lng);
        }
      );
    } else {
      const defaultCoords = { lat: 33.5731, lng: -7.5898 };
      setUserCoords(defaultCoords);
      initMap(defaultCoords.lat, defaultCoords.lng);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Initialize Map
  const initMap = (lat: number, lng: number) => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([lat, lng], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstance.current = map;
    markersLayer.current = L.layerGroup().addTo(map);
  };

  // Draw markers whenever localItems, userCoords, mapInstance or viewMode changes
  useEffect(() => {
    const map = mapInstance.current;
    const layer = markersLayer.current;
    if (!map || !layer || viewMode !== 'map') return;

    // Clear old markers
    layer.clearLayers();

    // 1. Draw User marker (pulsating circle)
    if (userCoords) {
      L.circleMarker([userCoords.lat, userCoords.lng], {
        radius: 8,
        fillColor: '#3b82f6',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(layer).bindPopup("<strong style='color:#3b82f6;'>Votre position actuelle</strong>");
    }

    // 2. Draw Donation markers
    localItems.forEach((item) => {
      if (item.latitude !== undefined && item.longitude !== undefined && item.latitude !== null && item.longitude !== null) {
        const popupContent = document.createElement('div');
        popupContent.style.width = '170px';
        popupContent.style.fontFamily = 'Inter, sans-serif';
        popupContent.innerHTML = `
          <img src="${item.imageUrl}" style="width:100%; height:90px; object-fit:cover; border-radius:8px;" />
          <h4 style="margin:8px 0 4px; font-weight:bold; font-size:12px; color:#1e293b;">${item.title}</h4>
          <p style="margin:0 0 6px; font-size:10px; color:#64748b;">${item.location}</p>
          ${item.distance !== undefined ? `<p style="margin:0 0 8px; font-size:10px; color:#10b981; font-weight:600;">Distance : ${item.distance} km</p>` : ''}
          <button id="view-btn-${item.id}" style="width:100%; padding:6px 0; background-color:#3b82f6; color:#ffffff; border:none; border-radius:6px; font-size:10px; font-weight:bold; cursor:pointer;">Consulter</button>
        `;

        const marker = L.marker([item.latitude, item.longitude])
          .addTo(layer)
          .bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-btn-${item.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectItem(item);
            };
          }
        });
      }
    });

  }, [localItems, userCoords, viewMode]);

  // Handle distance proximity filter change
  const handleRadiusChange = async (r: number | 'all') => {
    setRadius(r);
    setApiLoading(true);

    try {
      if (r === 'all') {
        const allItems = await apiService.getItems();
        setLocalItems(allItems);
      } else if (userCoords) {
        const filtered = await apiService.getItems({
          latitude: userCoords.lat,
          longitude: userCoords.lng,
          radius: r
        });
        setLocalItems(filtered);
      }
    } catch (e) {
      console.error("Failed to filter items by distance:", e);
    } finally {
      setApiLoading(false);
    }
  };

  // Category filter chips
  const categoriesList = [
    { id: 'all', label: 'Tout' },
    { id: 'furniture', label: 'Mobilier' },
    { id: 'appliances', label: 'Électroménager' },
    { id: 'clothing', label: 'Vêtements' },
    { id: 'education', label: 'Éducation' },
  ];

  // Filtering logic in frontend (for search query and categories)
  const filteredItems = useMemo(() => {
    return localItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (selectedFilter === 'furniture') {
        matchesFilter = item.category.toLowerCase().includes('furniture') || item.category.toLowerCase().includes('mobilier');
      } else if (selectedFilter === 'appliances') {
        matchesFilter = item.category.toLowerCase().includes('appliance') || item.category.toLowerCase().includes('électro');
      } else if (selectedFilter === 'clothing') {
        matchesFilter = item.category.toLowerCase().includes('cloth') || item.category.toLowerCase().includes('vêtement');
      } else if (selectedFilter === 'education') {
        matchesFilter = item.category.toLowerCase().includes('education') || item.category.toLowerCase().includes('livre');
      }

      return matchesSearch && matchesFilter;
    });
  }, [localItems, searchQuery, selectedFilter]);

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
            placeholder="Rechercher des dons ou villes (ex: Maarif)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm outline-hidden placeholder:text-slate-400"
          />
        </div>

        {/* Categories filters list */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 max-w-lg mx-auto shrink-0">
          {categoriesList.map((filter) => (
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

        {/* Distance Proximity Filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 max-w-lg mx-auto shrink-0 border-t border-slate-100 pt-2.5 items-center">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap mr-1">Rayon (GPS) :</span>
          {([
            { id: 'all', label: 'Tout' },
            { id: 5, label: 'Dans les 5 km' },
            { id: 10, label: 'Dans les 10 km' },
            { id: 25, label: 'Dans les 25 km' },
            { id: 50, label: 'Dans les 50 km' }
          ] as { id: number | 'all', label: string }[]).map((dist) => (
            <button
              key={dist.id}
              disabled={dist.id !== 'all' && !userCoords}
              onClick={() => handleRadiusChange(dist.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                radius === dist.id
                  ? 'bg-secondary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50'
              }`}
            >
              {dist.label}
            </button>
          ))}
          {apiLoading && <Loader className="w-4 h-4 text-primary animate-spin ml-2 shrink-0" />}
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
        <div className={`absolute inset-0 w-full h-full z-10 ${viewMode === 'map' ? 'block' : 'hidden'}`}>
          <div ref={mapRef} style={{ height: '100%', width: '100%' }} className="z-10 bg-slate-100" />
          
          {/* Geolocation status indicator */}
          {userCoords && (
            <div className="absolute top-16 left-4 bg-slate-900/80 text-white text-[10px] py-1.5 px-3 rounded-full backdrop-blur-xs font-mono font-medium z-20">
              GPS Actif : {filteredItems.length} dons à proximité
            </div>
          )}

          {/* Warning banner if GPS loading or failed */}
          {gpsLoading && (
            <div className="absolute top-16 left-4 bg-amber-500 text-white text-[10px] py-1.5 px-3 rounded-full backdrop-blur-xs font-sans font-medium z-20 animate-pulse">
              Recherche de votre position GPS...
            </div>
          )}

          {/* Floating help widget */}
          <div className="absolute bottom-4 left-4 right-4 max-w-sm mx-auto bg-white/95 backdrop-blur-xs p-3.5 rounded-xl text-center border border-slate-200 shadow-lg text-xs leading-relaxed text-slate-500 flex items-center justify-center gap-2 z-20">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            Cliquez sur les repères bleus pour voir le détail des dons géolocalisés.
          </div>
        </div>

        {/* VIEW 2: LIST VIEW */}
        {viewMode === 'list' && (
          <div className="absolute inset-0 overflow-y-auto w-full h-full p-4 pt-16 pb-20 z-10">
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center text-slate-400 max-w-md mx-auto space-y-3">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700">Aucun résultat trouvé sur la liste</p>
                <p className="text-xs text-slate-400">Essayez de modifier votre rayon de recherche ou sélectionnez une autre catégorie.</p>
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
                        
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{item.location} • Publié {item.timePosted}</span>
                          </div>
                          {item.distance !== undefined && (
                            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                              À {item.distance} km de vous
                            </span>
                          )}
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
