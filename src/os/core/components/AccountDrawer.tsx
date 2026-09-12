import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, User, Shield, KeyRound, Users, Check, 
  Lock, ArrowRight, ShieldAlert, Sparkles, Building2
} from 'lucide-react';
import { 
  UserProfile, 
  getCurrentUser, 
  setCurrentUser, 
  getUsersList, 
  updateUserProfile,
  updateMasterPin 
} from '../../../../services/adminAuth';
import { cn } from '../utils/cn';
import { useToast } from './ToastContext';

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceMode: 'team' | 'individual';
  onWorkspaceModeChange: (mode: 'team' | 'individual') => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
}

export function AccountDrawer({
  isOpen,
  onClose,
  workspaceMode,
  onWorkspaceModeChange,
  currentUser,
  onUserChange
}: AccountDrawerProps) {
  if (!isOpen) return null;

  const [tab, setTab] = useState<'switch' | 'security' | 'profile'>('switch');
  const allUsers = getUsersList();

  // Profile Edit State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [savingProfile, setSavingProfile] = useState(false);

  // PIN Change State
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { toast } = useToast();

  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    onUserChange(user);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    toast.success("Profil actif", `Session basculée sur ${user.name}`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = updateUserProfile(currentUser.id, { name, email, phone });
    setSavingProfile(false);
    if (res.success && res.user) {
      onUserChange(res.user);
      toast.success("Profil enregistré", "Vos coordonnées ont été mises à jour.");
    } else {
      toast.error("Erreur", res.message || "Échec de sauvegarde.");
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);
    if (newPin.length < 4) {
      setPinMessage({ type: 'error', text: 'Le code PIN doit comporter au moins 4 chiffres.' });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage({ type: 'error', text: 'Les deux nouveaux codes PIN ne correspondent pas.' });
      return;
    }

    const res = updateMasterPin(currentPin, newPin);
    if (res.success) {
      setPinMessage({ type: 'success', text: 'Code PIN mis à jour avec succès.' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md", currentUser.avatarBg)}>
              {currentUser.initials}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{currentUser.name}</h3>
              <span className="text-xs font-semibold text-gray-500">{currentUser.role}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WORKSPACE SELECTOR: TEAM VS INDIVIDUAL (Monday.com style) */}
        <div className="p-4 bg-gray-50/80 border-b border-gray-100">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Espace de Travail Actif
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onWorkspaceModeChange('team')}
              className={cn(
                "p-3 rounded-xl border text-left transition-all flex flex-col justify-between relative",
                workspaceMode === 'team'
                  ? "bg-white border-gray-900 shadow-sm ring-1 ring-gray-900"
                  : "bg-white/60 border-gray-200 text-gray-500 hover:bg-white"
              )}
            >
              <div className="flex items-center justify-between">
                <Users className={cn("w-4 h-4", workspaceMode === 'team' ? "text-gray-900" : "text-gray-400")} />
                {workspaceMode === 'team' && <Check className="w-3.5 h-3.5 text-gray-900" />}
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold text-gray-900">Équipe Générale</div>
                <div className="text-[10px] text-gray-400">Toutes les opérations</div>
              </div>
            </button>

            <button
              onClick={() => onWorkspaceModeChange('individual')}
              className={cn(
                "p-3 rounded-xl border text-left transition-all flex flex-col justify-between relative",
                workspaceMode === 'individual'
                  ? "bg-white border-gray-900 shadow-sm ring-1 ring-gray-900"
                  : "bg-white/60 border-gray-200 text-gray-500 hover:bg-white"
              )}
            >
              <div className="flex items-center justify-between">
                <User className={cn("w-4 h-4", workspaceMode === 'individual' ? "text-gray-900" : "text-gray-400")} />
                {workspaceMode === 'individual' && <Check className="w-3.5 h-3.5 text-gray-900" />}
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold text-gray-900">Mon Espace</div>
                <div className="text-[10px] text-gray-400">Mes dossiers assignés</div>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-gray-100 text-xs font-semibold">
          <button
            onClick={() => setTab('switch')}
            className={cn(
              "py-3 px-2 border-b-2 transition-colors",
              tab === 'switch' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            Changer de Profil
          </button>
          <button
            onClick={() => setTab('security')}
            className={cn(
              "py-3 px-2 border-b-2 transition-colors",
              tab === 'security' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            Sécurité & PIN
          </button>
          <button
            onClick={() => setTab('profile')}
            className={cn(
              "py-3 px-2 border-b-2 transition-colors",
              tab === 'profile' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            Mes Coordonnées
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: SWITCH USER */}
          {tab === 'switch' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 font-medium">
                Basculez rapidement entre les profils de l'équipe pour gérer les accès et permissions (RBAC Suisse) :
              </p>

              <div className="space-y-2.5">
                {allUsers.map(u => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={cn(
                        "p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                        isCurrent
                          ? "bg-gray-50/80 border-gray-900 ring-1 ring-gray-900 shadow-sm"
                          : "bg-white border-gray-200/80 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm", u.avatarBg)}>
                          {u.initials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">{u.name}</div>
                          <div className="text-[11px] text-gray-500">{u.role}</div>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="px-2 py-0.5 rounded-full bg-gray-900 text-white text-[10px] font-bold">
                          Actif
                        </span>
                      ) : (
                        <button className="text-xs font-semibold text-gray-400 hover:text-gray-900">
                          Sélectionner
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Permissions Summary for Current User */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Permissions du Profil Actif
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={cn("p-2.5 rounded-xl border flex items-center gap-2", currentUser.permissions.canViewFinancials ? "bg-emerald-50/60 border-emerald-200 text-emerald-800 font-medium" : "bg-gray-50 border-gray-200 text-gray-400")}>
                    <Shield className="w-3.5 h-3.5" /> Chiffres Financiers
                  </div>
                  <div className={cn("p-2.5 rounded-xl border flex items-center gap-2", currentUser.permissions.canEditPricing ? "bg-emerald-50/60 border-emerald-200 text-emerald-800 font-medium" : "bg-gray-50 border-gray-200 text-gray-400")}>
                    <Shield className="w-3.5 h-3.5" /> Édition Tarifs
                  </div>
                  <div className={cn("p-2.5 rounded-xl border flex items-center gap-2", currentUser.permissions.canDeleteLeads ? "bg-emerald-50/60 border-emerald-200 text-emerald-800 font-medium" : "bg-gray-50 border-gray-200 text-gray-400")}>
                    <Shield className="w-3.5 h-3.5" /> Suppression Dossiers
                  </div>
                  <div className={cn("p-2.5 rounded-xl border flex items-center gap-2", currentUser.permissions.canManageFleet ? "bg-emerald-50/60 border-emerald-200 text-emerald-800 font-medium" : "bg-gray-50 border-gray-200 text-gray-400")}>
                    <Shield className="w-3.5 h-3.5" /> Gestion Flotte
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY & PIN */}
          {tab === 'security' && (
            <form onSubmit={handleUpdatePin} className="space-y-4">
              <p className="text-xs text-gray-500 font-medium">
                Modifiez votre code PIN d'authentification pour verrouiller l'accès à ce terminal :
              </p>

              {pinMessage && (
                <div className={cn(
                  "p-3 rounded-xl text-xs font-semibold border",
                  pinMessage.type === 'success' ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"
                )}>
                  {pinMessage.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Code PIN Actuel</label>
                <input
                  type="password"
                  required
                  placeholder="••••"
                  value={currentPin}
                  onChange={e => setCurrentPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono tracking-widest focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nouveau Code PIN</label>
                <input
                  type="password"
                  required
                  placeholder="••••"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono tracking-widest focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirmer le Nouveau Code</label>
                <input
                  type="password"
                  required
                  placeholder="••••"
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono tracking-widest focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 active:scale-98 transition-all shadow-sm"
                >
                  Mettre à jour le code PIN
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PROFILE */}
          {tab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom Complet</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Professionnel</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Téléphone Direct</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 active:scale-98 transition-all shadow-sm disabled:opacity-50"
                >
                  {savingProfile ? 'Enregistrement...' : 'Enregistrer le Profil'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
