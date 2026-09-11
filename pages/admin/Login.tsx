import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRight, KeyRound, AlertCircle, Smartphone, User, Check, Users } from 'lucide-react';
import { verifyAdminPin, getUsersList, fetchUsersListSafe, UserProfile } from '../../services/adminAuth';

interface LoginProps {
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [pin, setPin] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const list = getUsersList();
    setUsers(list);
    if (list.length > 0) {
      setSelectedUser(list[0]); // Default to Alexandre (Directeur Général)
    }

    // Safely sync with backend directory without exposing hashes or PINs
    fetchUsersListSafe().then(remoteUsers => {
      if (remoteUsers && remoteUsers.length > 0) {
        setUsers(remoteUsers);
      }
    });
  }, []);

  const handleSelectUser = (user: UserProfile) => {
    setSelectedUser(user);
    setPin('');
    setError(false);
    setErrorMessage('');
  };

  const processPin = async (code: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(false);

    try {
      const res = await verifyAdminPin(code, remember, selectedUser?.id);
      if (res.valid) {
        onSuccess();
      } else {
        setError(true);
        setErrorMessage(res.message || 'Code PIN incorrect pour cet utilisateur.');
        setPin('');
      }
    } catch {
      setError(true);
      setErrorMessage('Erreur de connexion. Veuillez réessayer.');
      setPin('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 6) return;
    processPin(pin);
  };

  const handleKeyPadClick = (digit: string) => {
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 6) {
        processPin(next);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#07182B] flex flex-col justify-between items-center relative overflow-hidden font-sans text-slate-100 p-4 sm:p-6 select-none">
      {/* Ambient Luxury Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 sm:w-[600px] sm:h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 sm:w-[600px] sm:h-[600px] bg-sky-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Brand Pill with Original Batimove Logo */}
      <div className="pt-4 sm:pt-8 z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 backdrop-blur-md shadow-lg">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>Portail Exécutif Sécurisé • Batimove Sàrl Genève</span>
        </div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm sm:max-w-md bg-white/[0.04] border border-white/10 rounded-3xl p-6 sm:p-7 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] z-10 my-auto"
      >
        {/* Brand Header with Official Batimove Logo */}
        <div className="text-center mb-5">
          <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-white/10 border border-white/20 p-2 flex items-center justify-center shadow-lg shadow-sky-500/10 backdrop-blur-sm">
            <img 
              src="/batimove-logo.png" 
              alt="Batimove Suisse Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-extrabold text-2xl text-white tracking-tight">
            BATIMOVE<span className="text-sky-400">.OS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Sélectionnez votre profil d'équipe pour vous authentifier
          </p>
        </div>

        {/* Multi-User Profile Selector (Monday.com team picker) */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>Membre de l'Équipe</span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal">PIN 6 chiffres</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {users.map(u => {
              const isSelected = selectedUser?.id === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectUser(u)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-400 text-white shadow-md shadow-sky-500/10'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl ${u.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                    {u.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs truncate text-white leading-tight">
                      {u.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                      {u.role.replace('Responsable ', '').replace('Conseiller ', '')}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected User Indicator */}
        {selectedUser && (
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-slate-300 mb-4">
            <div className="flex items-center gap-2 truncate">
              <span className="text-slate-400">Connecter :</span>
              <strong className="text-white truncate">{selectedUser.name}</strong>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30 shrink-0">
              {selectedUser.role}
            </span>
          </div>
        )}

        {/* 6-Digit PIN Indicators */}
        <div className="flex justify-center items-center gap-3 my-4">
          {[0, 1, 2, 3, 4, 5].map(idx => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                error
                  ? 'bg-red-500 ring-4 ring-red-500/20'
                  : pin.length > idx
                  ? 'bg-sky-400 ring-4 ring-sky-400/25 scale-110'
                  : 'bg-white/15 border border-white/20'
              }`}
            />
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-xs text-red-400 font-medium mb-3 bg-red-500/10 py-2 px-3 rounded-xl border border-red-500/20 text-center"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage || 'Code PIN incorrect. Veuillez réessayer.'}</span>
          </motion.div>
        )}

        {/* Form Input (for keyboard desktop access) */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setPin(val);
                setError(false);
                if (val.length === 6) {
                  processPin(val);
                }
              }}
              placeholder="••••••"
              className="w-full text-center text-xl font-mono tracking-[0.4em] bg-black/30 border border-white/10 focus:border-sky-400 rounded-xl py-2.5 text-white placeholder:text-slate-600 outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Remember Device Option */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-sky-500 focus:ring-sky-400 cursor-pointer"
              />
              <span>Mémoriser session</span>
            </label>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <Smartphone className="w-3 h-3 text-sky-400" />
              <span>PWA Prête</span>
            </span>
          </div>

          <button
            type="submit"
            disabled={pin.length < 6 || isSubmitting}
            className="w-full bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#075985] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <span>Ouvrir l'Espace de Travail</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Numeric Keypad for Mobile Touch Screens */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/10">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (key === '⌫') handleBackspace();
                else if (key) handleKeyPadClick(key);
              }}
              disabled={!key}
              className={`h-10 sm:h-11 rounded-xl text-base font-semibold flex items-center justify-center transition-all cursor-pointer ${
                !key
                  ? 'invisible'
                  : key === '⌫'
                  ? 'bg-white/5 hover:bg-white/15 text-slate-300 active:scale-95'
                  : 'bg-white/5 hover:bg-white/15 active:bg-white/25 text-white active:scale-95 border border-white/5'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Footer Legal & Security */}
      <div className="pb-4 text-center text-xs text-slate-500 z-10 flex items-center gap-2">
        <Lock className="w-3.5 h-3.5 text-slate-400" />
        <span>Données chiffrées selon les standards de la LPD Suisse (nLPD) • Genève</span>
      </div>
    </div>
  );
};
