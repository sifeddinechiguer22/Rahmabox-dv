/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, MapPin, Calendar, Heart, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { DonationItem, UserRole } from '../types';

interface ItemDetailsModalProps {
  item: DonationItem | null;
  onClose: () => void;
  onRequest: (item: DonationItem) => void;
}

export default function ItemDetailsModal({ item, onClose, onRequest }: ItemDetailsModalProps) {
  if (!item) return null;

  const conditionLabels: Record<string, string> = {
    new: 'Neuf',
    excellent: 'Excellent état',
    good: 'Bon état',
    fair: 'État satisfaisant',
  };

  const conditionColors: Record<string, string> = {
    new: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    excellent: 'bg-teal-100 text-teal-800 border-teal-200',
    good: 'bg-blue-100 text-blue-800 border-blue-200',
    fair: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-outline-variant animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Banner image with overlays */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-100">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"></div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 p-2 rounded-full transition-all focus:outline-hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tag on image */}
          <span className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {item.category}
          </span>

          {/* Title and location inside image bottom area */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className={`text-xs px-2.5 py-1 rounded-sm border font-medium inline-block mb-2 ${conditionColors[item.condition] || 'bg-slate-100'}`}>
              {conditionLabels[item.condition] || item.condition}
            </span>
            <h3 className="font-display text-2xl font-semibold leading-tight drop-shadow-sm">{item.title}</h3>
          </div>
        </div>

        {/* Content of detail modal */}
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-y-2 items-center justify-between text-sm text-slate-500 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Publié {item.timePosted}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-emerald-700 capitalize">{item.status}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-medium text-slate-900">Description de l'objet</h4>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {item.description || "Aucune description supplémentaire n'a été fournie pour cet objet. Il est disponible gratuitement pour toute personne ou association qui pourrait en avoir l'utilité."}
            </p>
          </div>

          {/* Donor Information Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold font-display text-sm">
                {item.donorName ? item.donorName[0].toUpperCase() : 'D'}
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Parrain du don</p>
                <p className="text-sm font-semibold text-slate-900">{item.donorName || 'Donateur Anonyme'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-secondary bg-emerald-50 px-2.5 py-1 rounded-sm">
              <Shield className="w-3.5 h-3.5" />
              <span>Donateur Vérifié</span>
            </div>
          </div>

          {/* Security note and policy guidelines */}
          <div className="text-xs text-slate-400 bg-slate-55 flex gap-2">
            <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <p>
              En demandant cet objet, vous vous engagez à respecter le règlement d'entraide de <strong>RahmaBox</strong>. La revente d'objets donnés est strictement interdite.
            </p>
          </div>

          {/* Dynamic action buttons */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all active:scale-98"
            >
              Fermer
            </button>
            <button
              onClick={() => onRequest(item)}
              disabled={item.status !== 'available'}
              className="flex-[2] py-3.5 bg-primary hover:bg-primary-container text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 group disabled:opacity-55 disabled:cursor-not-allowed"
            >
              {item.status === 'available' ? (
                <>
                  Demander l'objet
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                'Déjà réservé/donné'
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
