import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Shield, KeyRound, Users, Check, 
  Lock, ArrowRight, ShieldAlert, Sparkles, Building2,
  Download, Phone, Mail, Camera, Trash2, UploadCloud
} from 'lucide-react';
import { 
  UserProfile, 
  getCurrentUser, 
  setCurrentUser, 
  getUsersList, 
  updateUserProfile,
  updateUserAvatar,
  updateMasterPin 
} from '../../../../services/adminAuth';
import { BATIMOVE_COMPANY_CONFIG } from '../../../../components/InvoiceDocument';
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

  const [tab, setTab] = useState<'switch' | 'profile' | 'security' | 'company'>('switch');
  const [usersList, setUsersList] = useState<UserProfile[]>(() => getUsersList());
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setUsersList(getUsersList());
      toast.success("Profil enregistré", "Vos coordonnées ont été mises à jour.");
    } else {
      toast.error("Erreur", res.message || "Échec de sauvegarde.");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Format invalide", "Veuillez choisir un fichier image (JPG, PNG).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Fichier trop lourd", "L'image ne doit pas dépasser 3 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const res = updateUserAvatar(currentUser.id, base64);
      if (res.success && res.user) {
        onUserChange(res.user);
        setUsersList(getUsersList());
        toast.success("Photo mise à jour", `La photo de profil de ${currentUser.name} a été enregistrée.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    const res = updateUserAvatar(currentUser.id, undefined);
    if (res.success && res.user) {
      onUserChange(res.user);
      setUsersList(getUsersList());
      toast.success("Photo supprimée", "Retour à l'avatar officiel avec monogramme.");
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
      toast.success("Code PIN actualisé", "Le nouveau code d'accès est actif.");
    } else {
      setPinMessage({ type: 'error', text: res.message });
      toast.error("Erreur", res.message);
    }
  };

  const exportBackupJson = () => {
    const leadsRaw = localStorage.getItem('batimove_os_leads_v2') || localStorage.getItem('batimove_os_leads_v1') || '[]';
    const fleetRaw = localStorage.getItem('batimove_os_fleet_v2') || localStorage.getItem('batimove_os_fleet_v1') || '[]';
    const finRaw = localStorage.getItem('batimove_os_financial_v2') || localStorage.getItem('batimove_os_financial_v1') || '[]';

    let leads = [];
    let fleet = [];
    let financial = [];
    try { leads = JSON.parse(leadsRaw); } catch {}
    try { fleet = JSON.parse(fleetRaw); } catch {}
    try { financial = JSON.parse(finRaw); } catch {}

    const backupData = {
      version: '4.2.0-executive',
      exported_at: new Date().toISOString(),
      user: currentUser,
      team: usersList,
      company: BATIMOVE_COMPANY_CONFIG,
      leads,
      fleet,
      financial
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BATIMOVE_OS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sauvegarde exportée", "Fichier JSON complet téléchargé.");
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      {/* Centered Dark Slate Executive Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-2xl bg-[#0F172A] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh] text-slate-100"
      >
        {/* Header with Active User & Close */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#0B1120] flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar / Photo with Photo Change Button */}
            <div className="relative group">
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-13 h-13 rounded-2xl object-cover shadow-lg border-2 border-slate-600"
                />
              ) : (
                <div className={cn("w-13 h-13 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-lg border-2 border-white/10", currentUser.avatarBg)}>
                  {currentUser.initials}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 shadow-md transition-all active:scale-90 cursor-pointer"
                title="Changer la photo"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-white text-base sm:text-lg leading-tight">{currentUser.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email} • {currentUser.phone}</p>
            </div>
          </div>

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload} 
            accept="image/*" 
            className="hidden" 
          />

          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Mode Pill Selector (Team vs Individual) */}
        <div className="px-6 py-3 bg-[#080D1A] border-b border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Espace de Travail Actif :
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onWorkspaceModeChange('team');
                toast.success("Espace Équipe", "Affichage de tous les dossiers de l'entreprise.");
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                workspaceMode === 'team'
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Équipe Générale</span>
              {workspaceMode === 'team' && <Check className="w-3 h-3 text-white" />}
            </button>

            <button
              onClick={() => {
                onWorkspaceModeChange('individual');
                toast.success("Mon Espace", `Filtrage actif pour ${currentUser.name}.`);
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                workspaceMode === 'individual'
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              )}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mon Espace ({currentUser.initials})</span>
              {workspaceMode === 'individual' && <Check className="w-3 h-3 text-white" />}
            </button>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center px-6 border-b border-slate-800 text-xs font-bold bg-[#0B1120] overflow-x-auto gap-2">
          <button
            onClick={() => setTab('switch')}
            className={cn(
              "py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
              tab === 'switch' ? "border-blue-500 text-blue-400 font-extrabold" : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            Direction (2 Comptes)
          </button>
          <button
            onClick={() => setTab('profile')}
            className={cn(
              "py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
              tab === 'profile' ? "border-blue-500 text-blue-400 font-extrabold" : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            <Camera className="w-3.5 h-3.5" />
            Photo & Coordonnées
          </button>
          <button
            onClick={() => setTab('security')}
            className={cn(
              "py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
              tab === 'security' ? "border-blue-500 text-blue-400 font-extrabold" : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Sécurité & PIN
          </button>
          <button
            onClick={() => setTab('company')}
            className={cn(
              "py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
              tab === 'company' ? "border-blue-500 text-blue-400 font-extrabold" : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            Entreprise & BCGE
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-[#0F172A]">
          {/* TAB 1: SWITCH PROFILE (Strictly 2 Directors) */}
          {tab === 'switch' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Basculer instantanément entre les deux directeurs autorisés de Batimove Sàrl. Les modifications et devis seront signés en son nom.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usersList.map(u => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={cn(
                        "p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative",
                        isSelected 
                          ? "bg-slate-800/90 border-blue-500 shadow-lg ring-2 ring-blue-500/20" 
                          : "bg-slate-800/40 border-slate-700/70 hover:bg-slate-800/70 hover:border-slate-600"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        {u.avatarUrl ? (
                          <img 
                            src={u.avatarUrl} 
                            alt={u.name} 
                            className="w-12 h-12 rounded-xl object-cover border border-slate-600 shadow-md"
                          />
                        ) : (
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md", u.avatarBg)}>
                            {u.initials}
                          </div>
                        )}
                        {isSelected && (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                            <Check className="w-3 h-3" /> Session Active
                          </span>
                        )}
                      </div>

                      <div className="mt-4">
                        <h4 className="font-bold text-sm text-white">{u.name}</h4>
                        <span className="text-xs text-blue-400 font-medium">{u.role}</span>
                        <div className="mt-2.5 pt-2.5 border-t border-slate-700/60 text-[11px] text-slate-400 font-mono space-y-1">
                          <p className="truncate">{u.email}</p>
                          <p>{u.phone}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & PHOTO EDIT */}
          {tab === 'profile' && (
            <div className="space-y-4">
              {/* Photo Management Section */}
              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                    />
                  ) : (
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md", currentUser.avatarBg)}>
                      {currentUser.initials}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-white">Photo de Profil</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Visible dans la colonne Responsable et le CRM.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Choisir une photo
                  </button>

                  {currentUser.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-2 rounded-xl bg-slate-700/80 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-600"
                      title="Supprimer et réactiver le monogramme"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </button>
                  )}
                </div>
              </div>

              {/* Coordonnées Form */}
              <form onSubmit={handleSaveProfile} className="space-y-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/70">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nom et Prénom</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-sm font-medium focus:border-blue-500 focus:outline-none bg-slate-900 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Officiel</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-sm font-medium focus:border-blue-500 focus:outline-none bg-slate-900 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Téléphone Direct (Suisse)</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-sm font-medium focus:border-blue-500 focus:outline-none bg-slate-900 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all shadow-md active:scale-95"
                  >
                    {savingProfile ? "Enregistrement..." : "Enregistrer les modifications"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SECURITY & PIN */}
          {tab === 'security' && (
            <form onSubmit={handleUpdatePin} className="space-y-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/70">
              <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-200 text-xs flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>
                  Ce code PIN protège l'accès à la direction générale, aux données confidentielles des clients et à l'extrait fiduciaire suisse.
                </span>
              </div>

              {pinMessage && (
                <div className={cn(
                  "p-3 rounded-xl text-xs font-semibold",
                  pinMessage.type === 'success' ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700" : "bg-rose-900/50 text-rose-300 border border-rose-700"
                )}>
                  {pinMessage.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nouveau Code PIN (6 chiffres)</label>
                  <input 
                    type="password" 
                    maxLength={6}
                    placeholder="••••••"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-sm font-mono tracking-widest text-center focus:border-blue-500 focus:outline-none bg-slate-900 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirmer le Code PIN</label>
                  <input 
                    type="password" 
                    maxLength={6}
                    placeholder="••••••"
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-sm font-mono tracking-widest text-center focus:border-blue-500 focus:outline-none bg-slate-900 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all shadow-md active:scale-95"
                >
                  Mettre à jour le code PIN
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: COMPANY CONFIG & BCGE & BACKUP */}
          {tab === 'company' && (
            <div className="space-y-4">
              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/70 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400">Coordonnées Légales & Bancaires Suisses</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Raison sociale :</span>
                    <p className="font-bold text-white mt-0.5">{BATIMOVE_COMPANY_CONFIG.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Numéro IDE / TVA Suisse :</span>
                    <p className="font-bold text-white font-mono mt-0.5">{BATIMOVE_COMPANY_CONFIG.ideTva}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Banque Officielle :</span>
                    <p className="font-bold text-white mt-0.5">{BATIMOVE_COMPANY_CONFIG.bank}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">IBAN BCGE Genève :</span>
                    <p className="font-bold text-white font-mono mt-0.5">{BATIMOVE_COMPANY_CONFIG.iban}</p>
                  </div>
                </div>
              </div>

              {/* Data Backup Section */}
              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Sauvegarde Intégrale des Données</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Télécharger tous les devis, dossiers et véhicules en JSON</p>
                </div>
                <button
                  onClick={exportBackupJson}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-600"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  Exporter JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
