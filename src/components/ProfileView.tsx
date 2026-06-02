/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, LogOut, ChevronRight, Award, Plus, Calendar, Star, Building, Heart, BadgeCheck } from 'lucide-react';
import { UserProfile, DonationItem, UserRole } from '../types';

interface ProfileViewProps {
  userProfile: UserProfile;
  myItems: DonationItem[];
  onDisconnectProfile: () => void;
  onNavigateToPost: () => void;
  onUpdateItemStatus: (id: string, newStatus: 'available' | 'requested' | 'donated') => void;
}

export default function ProfileView({ userProfile, myItems, onDisconnectProfile, onNavigateToPost, onUpdateItemStatus }: ProfileViewProps) {
  const [activeSegment, setActiveSegment] = useState<'contributions' | 'settings'>('contributions');

  const roleLabels: Record<UserRole, string> = {
    donor: 'Donateur Éco-Responsable',
    beneficiary: 'Bénéficiaire d\'Entraide',
    association: 'Association Partenaire',
    volunteer: 'Bénévole Logistique',
    center: 'Point de Collecte Social',
  };

  const roleEmojis: Record<UserRole, string> = {
    donor: '🎁',
    beneficiary: '🏡',
    association: '🏢',
    volunteer: '🤝',
    center: '📦',
  };

  const conditionLabels: Record<string, string> = {
    new: 'Neuf',
    excellent: 'Excellent',
    good: 'Bon état',
    fair: 'Satisfaisant',
  };

  return (
    <div className="max-w-[650px] mx-auto px-4 pt-6 pb-20 space-y-6">
      
      {/* Immersive Profile header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        
        {/* Background visual halo */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-primary-container/20 rounded-full blur-2xl"></div>

        <div className="relative flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left z-10">
          
          {/* Avatar initial letters */}
          <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-bold font-display text-2xl shadow-md border-4 border-slate-100 shrink-0">
            {userProfile.fullName ? userProfile.fullName[0].toUpperCase() : 'U'}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0 h-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight truncate">{userProfile.fullName}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide inline-flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> Compte Vérifié
              </span>
            </div>

            <p className="text-secondary text-xs sm:text-sm font-semibold flex items-center justify-center sm:justify-start gap-1">
              <span>{roleEmojis[userProfile.role] || '📦'}</span>
              <span>{roleLabels[userProfile.role] || userProfile.role}</span>
            </p>

            <p className="text-xs text-slate-400 font-light mt-1 block">
              Inscrit à <strong>{userProfile.city || 'Downtown, NY'}</strong> • {userProfile.email}
            </p>
          </div>

          {/* Quick Disconnect target */}
          <button
            onClick={onDisconnectProfile}
            title="Se déconnecter"
            className="p-2 border border-rose-100 hover:bg-rose-50 rounded-xl hover:text-rose-600 transition-colors cursor-pointer shrink-0 absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto focus:outline-hidden"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metrics Stat board */}
      <div className="grid grid-cols-2 gap-4">
        
        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-center shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dons publiés par vous</p>
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-secondary shrink-0" />
            <h3 className="font-display text-2xl font-bold text-slate-900">{myItems.length}</h3>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-center shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Badge communauté</p>
          <div className="flex items-center justify-center gap-2">
            <Award className="w-5 h-5 text-amber-500 shrink-0" />
            <h3 className="font-display text-sm font-bold text-slate-900 truncate">
              {myItems.length >= 3 ? 'Parrain Bienfaiteur' : 'Nouveau Donateur'}
            </h3>
          </div>
        </div>

      </div>

      {/* Active profile switch panel contributions vs settings */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        
        {/* Toggle navigation panel tabs */}
        <div className="flex border-b border-slate-100 text-xs sm:text-sm font-semibold select-none">
          <button
            onClick={() => setActiveSegment('contributions')}
            className={`flex-1 text-center py-4 cursor-pointer transition-all ${
              activeSegment === 'contributions'
                ? 'border-b-2 border-primary text-primary bg-slate-50/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mes Annonces de Dons ({myItems.length})
          </button>
          <button
            onClick={() => setActiveSegment('settings')}
            className={`flex-1 text-center py-4 cursor-pointer transition-all ${
              activeSegment === 'settings'
                ? 'border-b-2 border-primary text-primary bg-slate-50/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Informations profil
          </button>
        </div>

        <div className="p-4 sm:p-6 min-h-[250px]">
          
          {/* SEGMENT 1: CONTRIBUTIONS (MY ANNOUNCEMENTS) */}
          {activeSegment === 'contributions' && (
            <div className="space-y-4">
              {myItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-700">Vous n'avez publié aucun don actuellement</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">Chaque objet inutilisé donné fait une immense différence pour votre communauté locale de l'entraide.</p>
                  <button
                    onClick={onNavigateToPost}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 h-10 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Publier un premier don
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5 divide-y divide-slate-100">
                  {myItems.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className={`flex gap-4 pt-3.5 lg:pt-4 ${idx === 0 ? 'pt-0 border-t-0' : ''}`}
                    >
                      {/* Left image thumb */}
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>

                      {/* Info details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-secondary">{item.category}</span>
                        <h4 className="text-sm font-semibold text-slate-900 truncate leading-snug">{item.title}</h4>
                        
                        <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-400">
                          <span className="capitalize">{conditionLabels[item.condition]}</span>
                          <span>•</span>
                          <span>Publié {item.timePosted}</span>
                        </div>

                        {/* Interactive listing management state selectors (Mark as Available / Requested / Donated) */}
                        <div className="flex items-center gap-2 pt-2.5">
                          <span className="text-[10px] font-bold text-slate-400 mr-1">Statut:</span>
                          {[
                            { stateKey: 'available' as const, label: 'Disponible', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                            { stateKey: 'donated' as const, label: 'Cédé/Offert', color: 'bg-slate-100 text-slate-700 border-slate-300' }
                          ].map((stat) => {
                            const isCurrent = item.status === stat.stateKey;
                            return (
                              <button
                                key={stat.stateKey}
                                onClick={() => onUpdateItemStatus(item.id, stat.stateKey)}
                                className={`px-2.5 py-1 text-[9px] font-bold border rounded-sm transition-all cursor-pointer ${
                                  isCurrent 
                                    ? stat.color + ' ring-2 ring-slate-100 scale-103 shadow-xs' 
                                    : 'border-slate-200 text-slate-400 bg-white hover:bg-slate-50'
                                }`}
                              >
                                {stat.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SEGMENT 2: SETTINGS (PROFILE CARD READOUTS) */}
          {activeSegment === 'settings' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Informations de sécurité</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-slate-400 font-medium">Adresse e-mail enregistrée</p>
                  <p className="text-slate-850 font-semibold">{userProfile.email}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-slate-400 font-medium">Numéro de téléphone portable</p>
                  <p className="text-slate-850 font-semibold">{userProfile.phone || 'Non configuré'}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-slate-400 font-medium font-sans">Ville de résidence principale</p>
                  <p className="text-slate-850 font-semibold">{userProfile.city}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-slate-400 font-medium">Rôle sur la plateforme</p>
                  <p className="text-slate-850 font-semibold capitalize">{userProfile.role}</p>
                </div>
              </div>

              {/* Static security details */}
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-xs flex gap-2">
                <Heart className="w-5 h-5 shrink-0 text-rose-500" />
                <p className="leading-relaxed">
                  Votre identité d'entraide solidaire est chiffrée. Nous ne louons, vendons ni ne divulguons d'informations nominatives à des organismes publicitaires tiers.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
