/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';

interface SignUpViewProps {
  onSignUpSuccess: (profile: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    role: UserRole;
  }) => void;
  onNavigateToLogin: () => void;
}

export default function SignUpView({ onSignUpSuccess, onNavigateToLogin }: SignUpViewProps) {
  const [role, setRole] = useState<UserRole>('donor');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const rolesList: { id: UserRole; label: string; desc: string; emoji: string }[] = [
    { id: 'donor', label: 'Donateur', desc: 'Je souhaite offrir des objets', emoji: '🎁' },
    { id: 'beneficiary', label: 'Bénéficiaire', desc: 'Je recherche des dons d\'entraide', emoji: '🏡' },
    { id: 'association', label: 'Association', desc: 'Nous redistribuons à l\'échelle', emoji: '🏢' },
    { id: 'volunteer', label: 'Bénévole', desc: 'J\'aide à collecter & acheminer', emoji: '🤝' },
    { id: 'center', label: 'Point Collecte', desc: 'Nous stockons les dons reçus', emoji: '📦' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !city || !password) {
      alert("Veuillez remplir les informations indispensables !");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess({
        fullName,
        email,
        phone: phone || "Non renseigné",
        city,
        role,
      });
    }, 1500);
  };

  return (
    <div className="max-w-[480px] mx-auto px-4 pt-4 pb-20">
      
      {/* Top action header */}
      <div className="flex justify-between items-center h-16 bg-white sticky top-0 z-15 px-1 rounded-xl mb-4">
        <button 
          onClick={onNavigateToLogin}
          className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95 text-slate-700 cursor-pointer focus:outline-hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-display font-bold text-lg text-primary">RahmaBox</span>
        <div className="w-10"></div> {/* symmetry space */}
      </div>

      {/* Main Container contents */}
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-1">Rejoignez RahmaBox</h1>
          <p className="text-sm text-slate-500 font-light">Commencez dès aujourd'hui à faire une différence.</p>
        </div>

        {/* Role Segmented control slider layout */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800 block">Je m'inscris en tant que...</label>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 shrink-0">
            {rolesList.map((item) => {
              const itemChecked = role === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`px-5 py-2.5 rounded-full border text-xs font-bold whitespace-nowrap transition-all cursor-pointer focus:outline-hidden ${
                    itemChecked
                      ? 'bg-primary border-primary text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-1">{item.emoji}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-primary italic font-medium ml-1">
            * {rolesList.find(r => r.id === role)?.desc}
          </p>
        </div>

        {/* Form Body Fields inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-1" htmlFor="fullname">
              Nom complet
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl bg-white h-12 px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <User className="text-slate-400 w-5 h-5 mr-2 shrink-0" />
              <input
                id="fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="flex-1 bg-transparent border-none focus:outline-hidden text-slate-850 text-sm focus:ring-0 p-0"
              />
            </div>
          </div>

          {/* Email field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-1" htmlFor="email-signup">
              Adresse e-mail
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl bg-white h-12 px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <Mail className="text-slate-400 w-5 h-5 mr-2 shrink-0" />
              <input
                id="email-signup"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="flex-1 bg-transparent border-none focus:outline-hidden text-slate-850 text-sm focus:ring-0 p-0"
              />
            </div>
          </div>

          {/* Phone field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-1" htmlFor="phone-signup">
              Numéro de téléphone
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl bg-white h-12 px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <Phone className="text-slate-400 w-5 h-5 mr-2 shrink-0" />
              <input
                id="phone-signup"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 00 00 00 00"
                className="flex-1 bg-transparent border-none focus:outline-hidden text-slate-850 text-sm focus:ring-0 p-0"
              />
            </div>
          </div>

          {/* City field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-1" htmlFor="city-signup">
              Ville / Commune
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl bg-white h-12 px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <MapPin className="text-slate-400 w-5 h-5 mr-2 shrink-0" />
              <input
                id="city-signup"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Casablanca, Maroc"
                className="flex-1 bg-transparent border-none focus:outline-hidden text-slate-850 text-sm focus:ring-0 p-0"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-1" htmlFor="password-signup">
              Mot de passe
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl bg-white h-12 px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <Lock className="text-slate-400 w-5 h-5 mr-2 shrink-0" />
              <input
                id="password-signup"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent border-none focus:outline-hidden text-slate-850 text-sm focus:ring-0 p-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 focus:outline-hidden"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign Up Button Trigger */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-primary hover:bg-primary-container text-white rounded-xl font-display font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-8"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Création en cours...
              </>
            ) : (
              'Finaliser mon inscription'
            )}
          </button>
        </form>

        {/* Separator design */}
        <div className="relative flex items-center py-2 shrink-0">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase tracking-wide">Ou s'inscrire avec</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Social auth alternative buttons */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <button 
            onClick={() => onSignUpSuccess({ fullName: "Google User", email: "google@gmail.com", phone: "+1(555)-444-444", city: "Casablanca", role: "donor" })}
            className="flex items-center justify-center gap-2 border border-slate-200 h-12 rounded-xl bg-white hover:bg-slate-50 transition-colors text-xs font-semibold cursor-pointer text-slate-700"
          >
            <img alt="Google search emblem" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD9sL8ywwnxctbzUeNv06b1biSLA00sfv2DDcjlusPuuk1l_zw9WqgnfLhPoizYTAGHmPgP9reSHubZ4kTjn8mta5eHbRkCYKreYLqHWh_z1YrMg6YyxW2HyWj-R7LD7qL7tjoCBdy1BlpYZLqkrhT3Wt49QjMg9s2DMNqzIp6qRVR7gWxBu55E-Bi1PcyKqQeckt1KZyreMQ3xza6xGeRkAaU5N9vkUGmrih8DxSUQo68RGMVeCphNdA6Mez6SDWGQpENq988M8Qm" />
            <span>Google</span>
          </button>
          <button 
            onClick={() => onSignUpSuccess({ fullName: "Facebook User", email: "facebook@facebook.com", phone: "+1(555)-333-333", city: "Downtown", role: "volunteer" })}
            className="flex items-center justify-center gap-2 border border-slate-200 h-12 rounded-xl bg-white hover:bg-slate-50 transition-colors text-xs font-semibold cursor-pointer text-slate-700"
          >
            <span className="text-[#1877F2] font-semibold text-sm leading-none">f</span>
            <span>Facebook</span>
          </button>
        </div>

        {/* Bottom sign up toggle */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Déjà inscrit sur RahmaBox ?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-primary font-bold hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-hidden"
            >
              Se connecter
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
