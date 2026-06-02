/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, HeartHandshake } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string, name: string) => void;
  onNavigateToSignup: () => void;
}

export default function LoginView({ onLoginSuccess, onNavigateToSignup }: LoginViewProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);

    // Simulate standard authentication delay and feedback sequence
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        // extract name from email or set default
        const userName = email.split('@')[0];
        const readableName = userName.charAt(0).toUpperCase() + userName.slice(1);
        onLoginSuccess(email, readableName || "John Doe");
      }, 800);
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-lg relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Top visual brand bar */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3.5 bg-primary text-white rounded-2xl shadow-md">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-primary">RahmaBox</h1>
        </div>

        {/* Form headers */}
        <div className="text-center sm:text-left space-y-1">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight">Bon retour parmi nous !</h2>
          <p className="text-sm font-light text-slate-500">Connectez-vous pour continuer à œuvrer pour votre entourage.</p>
        </div>

        {/* Real submit form container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block" htmlFor="email">
              Adresse e-mail
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary" />
              <input 
                id="email"
                type="email"
                required
                placeholder="nom@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm outline-hidden text-slate-800"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-500 uppercase tracking-wider block" htmlFor="password">
                Mot de passe
              </label>
              <a href="#" className="font-bold text-primary hover:underline">Mot de passe oublié ?</a>
            </div>
            
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-5 h-5 text-slate-400" />
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm outline-hidden text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 focus:outline-hidden"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Visual submission buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full h-12 rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
                isSuccess 
                  ? 'bg-secondary text-white' 
                  : 'bg-primary hover:bg-primary-container text-white disabled:opacity-75'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Vérification...
                </div>
              ) : isSuccess ? (
                'Connexion réussie ✓'
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* Separator block */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase tracking-wide">Ou continuer avec</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Alternate Social Signups mock panels */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <button 
            type="button"
            onClick={() => onLoginSuccess("volunteer@rahmabox.org", "Association Rahma")}
            className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold cursor-pointer text-slate-700 bg-white"
          >
            <img alt="Google emblem" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD9sL8ywwnxctbzUeNv06b1biSLA00sfv2DDcjlusPuuk1l_zw9WqgnfLhPoizYTAGHmPgP9reSHubZ4kTjn8mta5eHbRkCYKreYLqHWh_z1YrMg6YyxW2HyWj-R7LD7qL7tjoCBdy1BlpYZLqkrhT3Wt49QjMg9s2DMNqzIp6qRVR7gWxBu55E-Bi1PcyKqQeckt1KZyreMQ3xza6xGeRkAaU5N9vkUGmrih8DxSUQo68RGMVeCphNdA6Mez6SDWGQpENq988M8Qm" />
            <span>Google</span>
          </button>
          <button 
            type="button"
            onClick={() => onLoginSuccess("benevole@ahmabox.org", "Bénévole Solidaire")}
            className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold cursor-pointer text-slate-700 bg-white"
          >
            <span className="text-[#1877F2] font-semibold text-sm leading-none shrink-0">f</span>
            <span>Facebook</span>
          </button>
        </div>

        {/* Bottom sign up router */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Nouveau sur la plate-forme ?{' '}
            <button 
              onClick={onNavigateToSignup}
              className="text-secondary font-bold hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-hidden"
            >
              Créer un compte
            </button>
          </p>
        </div>

        {/* Bottom trust badges */}
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-400 select-none opacity-60">
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-secondary" />
            <span>Sécurisé</span>
          </div>
          <span>•</span>
          <span>Anonymat Garanti</span>
        </div>

      </div>
    </div>
  );
}
