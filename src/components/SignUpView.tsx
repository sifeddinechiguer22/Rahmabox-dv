/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, ArrowLeft, Gift, Home, Building2, HandHeart, Package } from 'lucide-react';
import { API_BASE_URL, initializeCsrfToken, getCsrfToken } from '../api';
import { backendRoleFromFrontend, frontendRoleFromBackend } from '../services/apiService';
import { signInWithGoogle } from '../firebase';
import { UserRole } from '../types';

interface SignUpViewProps {
  onSignUpSuccess: (profile: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    role: UserRole;
    token?: string;
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
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const rolesList: { id: UserRole; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'donor', label: 'Donateur', desc: 'Je souhaite offrir des objets', icon: <Gift className="w-3.5 h-3.5" /> },
    { id: 'beneficiary', label: 'Bénéficiaire', desc: 'Je recherche des dons d\'entraide', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'association', label: 'Association', desc: 'Nous redistribuons à l\'échelle', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'volunteer', label: 'Bénévole', desc: 'J\'aide à collecter & acheminer', icon: <HandHeart className="w-3.5 h-3.5" /> },
    { id: 'center', label: 'Point Collecte', desc: 'Nous stockons les dons reçus', icon: <Package className="w-3.5 h-3.5" /> },
  ];

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setErrorMessage('');
    try {
      const googleUser = await signInWithGoogle();
      onSignUpSuccess({
        fullName: googleUser.fullName,
        email: googleUser.email,
        phone: googleUser.phone,
        city: googleUser.city,
        role: frontendRoleFromBackend(googleUser.role),
        token: googleUser.token,
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Échec Google.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !city || !password || !confirmPassword) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if ((role === 'association' || role === 'center') && (!companyName || !registrationNumber)) {
      setErrorMessage('Merci de renseigner le nom de l’association / centre et le numéro d’enregistrement.');
      return;
    }

    setIsLoading(true);

    try {
      await initializeCsrfToken();

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          password_confirmation: confirmPassword,
          role: backendRoleFromFrontend[role],
          phone,
          city,
          postal_code: '',
          latitude: 0,
          longitude: 0,
          company_name: role === 'association' ? companyName : '',
          registration_number: role === 'association' ? registrationNumber : '',
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        const apiError = payload.message ||
          (payload.errors ? Object.values(payload.errors).flat()[0] : undefined) ||
          'Échec de l’inscription.';
        setErrorMessage(apiError);
        setIsLoading(false);
        return;
      }

      const user = payload.data;

      // B3d register, redirect l login
      onNavigateToLogin();
    } catch (error) {
      setErrorMessage('Impossible de contacter le serveur.');
      setIsLoading(false);
    }
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
                  <span className="mr-1.5 inline-flex">{item.icon}</span>
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

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-1" htmlFor="confirm-password-signup">
              Confirmer le mot de passe
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl bg-white h-12 px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <Lock className="text-slate-400 w-5 h-5 mr-2 shrink-0" />
              <input
                id="confirm-password-signup"
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent border-none focus:outline-hidden text-slate-850 text-sm focus:ring-0 p-0"
              />
            </div>
          </div>

          {(role === 'association' || role === 'center') && (
            <>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-1" htmlFor="company-name-signup">
                  Nom de l'association / du centre
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white h-12 px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                  <input
                    id="company-name-signup"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Association solidarité"
                    className="flex-1 bg-transparent border-none focus:outline-hidden text-slate-850 text-sm focus:ring-0 p-0"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-1" htmlFor="registration-number-signup">
                  Numéro d'enregistrement
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white h-12 px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                  <input
                    id="registration-number-signup"
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="SIRET / N° registre"
                    className="flex-1 bg-transparent border-none focus:outline-hidden text-slate-850 text-sm focus:ring-0 p-0"
                  />
                </div>
              </div>
            </>
          )}

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

          {errorMessage && (
            <div className="text-sm text-rose-600 font-medium px-2 py-2 rounded-xl bg-rose-50 border border-rose-100 mt-3">
              {errorMessage}
            </div>
          )}
        </form>

        <div className="relative flex items-center py-2 shrink-0">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase tracking-wide">Ou s'inscrire avec</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="grid grid-cols-1 gap-3 shrink-0">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="flex items-center justify-center gap-3 border border-slate-200 h-12 rounded-xl bg-white hover:bg-slate-50 transition-colors text-sm font-semibold cursor-pointer text-slate-700 disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <img alt="Google" className="w-5 h-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
            )}
            Continuer avec Google
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
