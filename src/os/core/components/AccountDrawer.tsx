import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Shield, KeyRound, Users, Check, 
  Lock, ArrowRight, ShieldAlert, Sparkles, Building2,
  Download, Phone, Mail, FileSpreadsheet, ExternalLink
} from 'lucide-react';
import { 
  UserProfile, 
  getCurrentUser, 
  setCurrentUser, 
  getUsersList, 
  updateUserProfile,
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
      version: '4.0.0-enterprise',
      exported_at: new Date().toISOString(),
      user: currentUser,
      team: allUsers,
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
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md">
      {/* Centered Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-2xl bg-[#F8FAFC] rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh] text-slate-900"
      >
        {/* Header with Active User & Close */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-md border border-black/10", currentUser.avatarBg)}>
              {currentUser.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">{currentUser.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.email} • {currentUser.phone}</p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Mode Pill Selector (Team vs Individual) */}
        <div className="px-6 py-3 bg-slate-100/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Mode d'Espace de Travail :
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onWorkspaceModeChange('team');
                toast.success("Espace Équipe", "Affichage de tous les dossiers généraux.");
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                workspaceMode === 'team'
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Équipe Générale</span>
              {workspaceMode === 'team' && <Check className="w-3 h-3 text-emerald-400" />}
            </button>

            <button
              onClick={() => {
                onWorkspaceModeChange('individual');
                toast.success("Mon Espace", `Filtrage activé pour ${currentUser.name}.`);
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                workspaceMode === 'individual'
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              )}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mon Espace ({currentUser.initials})</span>
              {workspaceMode === 'individual' && <Check className="w-3 h-3 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center px-6 border-b border-slate-200 text-xs font-bold bg-white overflow-x-auto gap-2">
          <button
            onClick={() => setTab('switch')}
            className={cn(
              "py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
              tab === 'switch' ? "border-slate-900 text-slate-900 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            Direction & Accès
          </button>
          <button
            onClick={() => setTab('profile')}
            className={cn(
              "py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
              tab === 'profile' ? "border-slate-900 text-slate-900 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            <User className="w-3.5 h-3.5" />
            Mes Coordonnées
          </button>
          <button
            onClick={() => setTab('security')}
            className={cn(
              "py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
              tab === 'security' ? "border-slate-900 text-slate-900 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Sécurité & PIN
          </button>
          <button
            onClick={() => setTab('company')}
            className={cn(
              "py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
              tab === 'company' ? "border-slate-900 text-slate-900 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-900"
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            Entreprise & BCGE
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-[#F8FAFC]">
          {/* TAB 1: SWITCH PROFILE */}
          {tab === 'switch' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Sélectionnez le directeur actif pour cette session. Les modifications et créations seront signées en son nom.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {allUsers.map(u => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative",
                        isSelected 
                          ? "bg-white border-slate-900 shadow-md ring-2 ring-slate-900/10" 
                          : "bg-white/80 border-slate-200/90 hover:bg-white hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm", u.avatarBg)}>
                          {u.initials}
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            <Check className="w-3 h-3" /> Actif
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <h4 className="font-bold text-sm text-slate-900">{u.name}</h4>
                        <span className="text-xs text-slate-500 font-medium">{u.role}</span>
                        <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono space-y-0.5">
                          <p>{u.email}</p>
                          <p>{u.phone}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE EDIT */}
          {tab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nom et Prénom</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-slate-900 focus:outline-none bg-slate-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Officiel</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-slate-900 focus:outline-none bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Téléphone Direct (Suisse)</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-slate-900 focus:outline-none bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                >
                  {savingProfile ? "Enregistrement..." : "Mettre à jour mes coordonnées"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SECURITY & PIN */}
          {tab === 'security' && (
            <form onSubmit={handleUpdatePin} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/70 text-blue-900 text-xs flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  Ce code PIN protège l'accès à la direction générale, aux données confidentielles des clients et à l'extrait financier suisse.
                </span>
              </div>

              {pinMessage && (
                <div className={cn(
                  "p-3 rounded-xl text-xs font-semibold",
                  pinMessage.type === 'success' ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                )}>
                  {pinMessage.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nouveau Code PIN (6 chiffres)</label>
                  <input 
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono tracking-widest text-center focus:border-slate-900 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirmer le Nouveau Code PIN</label>
                  <input 
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono tracking-widest text-center focus:border-slate-900 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                >
                  Modifier le code PIN de sécurité
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: COMPANY CONFIG & BCGE & BACKUP */}
          {tab === 'company' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Coordonnées Légales Suisses</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Raison sociale :</span>
                    <p className="font-bold text-slate-900">{BATIMOVE_COMPANY_CONFIG.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Numéro IDE / TVA Suisse :</span>
                    <p className="font-bold text-slate-900 font-mono">{BATIMOVE_COMPANY_CONFIG.ideTva}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Banque Officielle :</span>
                    <p className="font-bold text-slate-900">{BATIMOVE_COMPANY_CONFIG.bank}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">IBAN BCGE Genève :</span>
                    <p className="font-bold text-slate-900 font-mono">{BATIMOVE_COMPANY_CONFIG.iban}</p>
                  </div>
                </div>
              </div>

              {/* Data Backup Section */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Sauvegarde Intégrale des Données</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Télécharger toutes les affaires, devis et enregistrements en JSON</p>
                </div>
                <button
                  onClick={exportBackupJson}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-600" />
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
