/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Camera, Layers, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { DonationItem, ItemCondition, UserRole, UserProfile } from '../types';

interface PostViewProps {
  userProfile: UserProfile;
  onAddItem: (newItem: Omit<DonationItem, 'id' | 'timePosted' | 'status' | 'donorName' | 'coordinates'>) => void;
  onChangeTab: (tab: 'home' | 'explore' | 'post' | 'messages' | 'profile') => void;
}

export default function PostView({ userProfile, onAddItem, onChangeTab }: PostViewProps) {
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [condition, setCondition] = useState<ItemCondition | 'none'>('none');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>(userProfile.city || 'Downtown, NY');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number | null>(null);

  // High quality curated presets to simulate rapid mock donation listings with beautiful images
  const samplePresets = [
    {
      title: "Veste d'hiver rembourrée pour adulte (L)",
      category: "Clothing & Apparel",
      condition: "excellent" as ItemCondition,
      description: "Manteau rembourré extrêmement confortable pour l'hiver froid. Couleur bleu marine, fermeture éclair robuste fonctionnant parfaitement.",
      imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600",
      location: "Brooklyn, NY",
    },
    {
      title: "Table basse en bois d'acacia d'intérieur",
      category: "Furniture",
      condition: "good" as ItemCondition,
      description: "Jolie table basse minimaliste en bois massif d'acacia. Dimensions compactes parfaites pour un salon d'appartement ou une chambre étudiante.",
      imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600",
      location: "Downtown, NY",
    },
    {
      title: "Guitare acoustique d'étude pour débutant",
      category: "Toys & Sports",
      condition: "good" as ItemCondition,
      description: "Guitare acoustique en bois classique de taille 4/4 idéal pour jeune débutant autonome. Les cordes ont été changées récemment.",
      imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=600",
      location: "Queens, NY",
    },
    {
      title: "Aspirateur traîneau puissant Philips 900W",
      category: "Appliances",
      condition: "excellent" as ItemCondition,
      description: "Aspirateur traîneau d'aspiration puissante avec tous ses embouts d'origine disponibles. Sac neuf inséré, filtre lavé récemment.",
      imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=600",
      location: "Manhattan, NY",
    }
  ];

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    const preset = samplePresets[idx];
    setTitle(preset.title);
    setCategory(preset.category);
    setCondition(preset.condition);
    setDescription(preset.description);
    setImageUrl(preset.imageUrl);
    setLocation(preset.location);
  };

  const handleCustomUpload = () => {
    // Generate randomized catalog image
    const customImages = [
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=600", // backpack
      "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=600", // shoes
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=600", // camera
    ];
    const roll = Math.floor(Math.random() * customImages.length);
    setImageUrl(customImages[roll]);
    setTitle("Aspirant Don Utile de " + userProfile.fullName);
    setSelectedPresetIdx(999); // Custom marker
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || condition === 'none') {
      alert("Veuillez remplir les champs obligatoires (Titre, Catégorie, État) !");
      return;
    }

    const finalImage = imageUrl || "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600";

    // Call state update callback
    onAddItem({
      title,
      category,
      condition: condition === 'none' ? 'good' : condition,
      location,
      imageUrl: finalImage,
      description: description || "Objet charitable proposé par l'utilisateur enregistré du portail RahmaBox."
    });

    setStep(2); // Go to success confirmation screen
  };

  const handleFinish = () => {
    // Navigate home
    onChangeTab('home');
  };

  return (
    <div className="max-w-[550px] mx-auto px-4 pt-6 pb-20">
      
      {/* Progress step bar indicator */}
      <div className="flex gap-2 mb-8">
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`} />
        <div className={`h-1.5 flex-1 rounded-full bg-slate-200`} />
      </div>

      {step === 1 ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Headline labels */}
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Que souhaitez-vous donner aujourd'hui ?</h2>
            <p className="text-slate-500 text-sm mt-1">Aidez les autres en fournissant des détails clairs sur votre objet.</p>
          </div>

          {/* Quick presets generator (Simulation panel) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
              Générateur d'annonce rapide (clic unique)
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {samplePresets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className={`p-2 rounded-lg border text-left flex flex-col justify-between h-20 transition-all cursor-pointer select-none text-[10px] ${
                    selectedPresetIdx === idx
                      ? 'border-secondary bg-emerald-50 ring-2 ring-emerald-100'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="font-medium line-clamp-2 leading-tight text-slate-800">{preset.title.split(' ')[0]} {preset.title.split(' ')[1]}</span>
                  <span className="text-secondary uppercase font-semibold text-[9px] tracking-wider">{preset.category.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Picture simulation field */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-800 block">Photo de l'objet (unitaire)</label>
            <div className="flex gap-4">
              
              {/* Manual/Preset upload button click target */}
              <button
                type="button"
                onClick={handleCustomUpload}
                className="w-28 h-28 border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 outline-hidden bg-white"
              >
                <Camera className="w-6 h-6 text-primary" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Prendre</span>
              </button>

              {/* Upload image preview box */}
              {imageUrl ? (
                <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <img src={imageUrl} alt="Donation item preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageUrl(''); setSelectedPresetIdx(null); }}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 focus:outline-hidden"
                  >
                    <span className="text-[10px] font-bold px-1 block leading-none">×</span>
                  </button>
                </div>
              ) : (
                <div className="w-28 h-28 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-1 shrink-0">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-[9px] font-medium font-sans">Pas d'image</span>
                </div>
              )}
            </div>
          </div>

          {/* Form details input grids */}
          <div className="space-y-5">
            {/* Title field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800 block" htmlFor="item-title">
                Titre de l'annonce <span className="text-red-500">*</span>
              </label>
              <input
                id="item-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Veste d'hiver chaude rembourrée"
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm outline-hidden placeholder:text-slate-400"
              />
            </div>

            {/* Selection list */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800 block" htmlFor="category">
                Sélection de catégorie <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm outline-hidden text-slate-700"
              >
                <option value="" disabled>Choisir une catégorie d'attribution...</option>
                <option value="Clothing & Apparel">Équipement Vestimentaire / Vêtements</option>
                <option value="Furniture">Mobilier & Ameublement</option>
                <option value="Appliances">Appareils électroménager</option>
                <option value="Toys & Sports">Jouets d'éveil & Loisirs</option>
                <option value="Education">Livres d'éveil & Fourniture éducative</option>
                <option value="Other">Autre objet utile</option>
              </select>
            </div>

            {/* Condition selection layout */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-slate-800 block">
                État de l'objet <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { key: 'new', dName: 'Neuf' },
                  { key: 'excellent', dName: 'Excellent état' },
                  { key: 'good', dName: 'Bon état' },
                  { key: 'fair', dName: 'État satisfaisant' }
                ].map((itemCond) => {
                  const isChecked = condition === itemCond.key;
                  return (
                    <button
                      type="button"
                      key={itemCond.key}
                      onClick={() => setCondition(itemCond.key as ItemCondition)}
                      className={`h-12 flex items-center justify-center border rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {itemCond.dName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description writeup field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800 block" htmlFor="desc">
                Description de l'usage / Informations complémentaires
              </label>
              <textarea
                id="desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Spécifiez par exemple les dimensions, l'âge, s'il faut venir le chercher sur place, etc."
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm outline-hidden placeholder:text-slate-400 font-sans"
              />
            </div>

            {/* City lookup field */}
            <div className="space-y-1.5 w-full">
              <label className="text-sm font-semibold text-slate-800 block" htmlFor="location">
                Ville / Localisation
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex : Brooklyn, NY"
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm outline-hidden placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Primary Post Submission Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary-container text-white rounded-xl font-display font-semibold transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              Publier le don
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </form>
      ) : (
        /* Success Screen layout step 2 */
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-6 shadow-md animate-in fade-in zoom-in-95 duration-200 my-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-slate-900">Annonce en ligne !</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Votre don <strong className="text-slate-800">« {title} »</strong> a été publié avec succès. Il est désormais visible par tous les bénéficiaires et associations de la plate-forme inscrits à {location}.
            </p>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-left text-xs text-emerald-800 flex gap-2.5">
            <Sparkles className="w-5 h-5 shrink-0 text-secondary" />
            <p className="leading-relaxed font-medium">
              Merci pour votre générosité ! Chaque don partagé est un pas de géant pour pérenniser l'économie circulaire associative et préserver les ressources.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={handleFinish}
              className="w-full h-12 bg-primary hover:bg-primary-container text-white font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-xs"
            >
              Retour à l'accueil
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setCategory('');
                setCondition('none');
                setDescription('');
                setImageUrl('');
                setSelectedPresetIdx(null);
                setStep(1);
              }}
              className="w-full h-12 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-sm transition-all cursor-pointer"
            >
              Publier un autre don
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
