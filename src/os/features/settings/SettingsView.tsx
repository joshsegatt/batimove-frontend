import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Shield, Users, KeyRound, Download, Check, 
  User, Lock, Save, Plus, Trash2, Mail, Phone, ExternalLink, ShieldCheck
} from 'lucide-react';
import { 
  UserProfile, 
  getUsersList, 
  getCurrentUser, 
  setCurrentUser, 
  updateUserProfile,
  updateMasterPin 
} from '../../../../services/adminAuth';
import { BATIMOVE_COMPANY_CONFIG } from '../../../../components/InvoiceDocument';
import { cn } from '../../core/utils/cn';

interface SettingsViewProps {
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  workspaceMode: 'team' | 'individual';
  onWorkspaceModeChange: (mode: 'team' | 'individual') => void;
}

export function SettingsView({
  currentUser,
  onUserChange,
  workspaceMode,
  onWorkspaceModeChange
}: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'company' | 'team' | 'security' | 'profile'>('company');
  const allUsers = getUsersList();

  // Profile Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);

  // Security Form State
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateUserProfile(currentUser.id, { name, email, phone });
    if (res.success && res.user) {
      onUserChange(res.user);
      alert('Coordonnées du profil enregistrées avec succès.');
    } else {
      alert(res.message);
    }
  };

  const handleSavePin = (e: React.FormEvent) => {
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
      setPinMessage({ type: 'success', text: 'Code PIN de sécurité mis à jour avec succès.' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinMessage({ type: 'error', text: res.message });
    }
  };

  const exportBackupJson = () => {
    const backupData = {
      exported_at: new Date().toISOString(),
      user: currentUser,
      company: BATIMOVE_COMPANY_CONFIG,
      leads: localStorage.getItem('batimove_os_leads_v1') || '[]',
      fleet: localStorage.getItem('batimove_os_fleet_v1') || '[]',
      financial: localStorage.getItem('batimove_os_financial_v1') || '[]'
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BATIMOVE_OS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Paramètres & Configuration de l'Entreprise</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Gouvernance d'entreprise, coordonnées légales suisses, équipe et sécurité
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 text-xs font-semibold overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('company')}
          className={cn(
            "py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
            activeTab === 'company' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          <Building2 className="w-4 h-4" />
          Raison Sociale & BCGE
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={cn(
            "py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
            activeTab === 'team' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          <Users className="w-4 h-4" />
          Équipe & Rôles ({allUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={cn(
            "py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
            activeTab === 'security' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          <Shield className="w-4 h-4" />
          Sécurité & PIN
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            "py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap",
            activeTab === 'profile' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          <User className="w-4 h-4" />
          Mon Profil
        </button>
      </div>

      {/* TAB 1: COMPANY & SWISS LEGAL */}
      {activeTab === 'company' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              <Building2 className="w-4 h-4 text-gray-900" />
              Registre du Commerce & Identité Fiscale
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5 font-medium">Raison Sociale Légale</span>
                <span className="font-bold text-gray-900 text-sm">{BATIMOVE_COMPANY_CONFIG.legalName}</span>
                <span className="text-gray-500 block text-[11px]">{BATIMOVE_COMPANY_CONFIG.legalForm}</span>
              </div>

              <div>
                <span className="text-gray-400 block mb-0.5 font-medium">Numéro IDE / TVA</span>
                <span className="font-mono font-bold text-gray-900 text-sm bg-gray-50 px-2 py-0.5 rounded border border-gray-100 inline-block">
                  {BATIMOVE_COMPANY_CONFIG.ide}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block mb-0.5 font-medium">Siège Social & Registre</span>
                <span className="font-semibold text-gray-900 block">{BATIMOVE_COMPANY_CONFIG.address}, {BATIMOVE_COMPANY_CONFIG.postalCode} {BATIMOVE_COMPANY_CONFIG.city}</span>
                <span className="text-gray-500 text-[11px]">{BATIMOVE_COMPANY_CONFIG.rc}</span>
              </div>

              <div>
                <span className="text-gray-400 block mb-0.5 font-medium">Contact Officiel</span>
                <span className="font-semibold text-gray-900 block">{BATIMOVE_COMPANY_CONFIG.email} • {BATIMOVE_COMPANY_CONFIG.phoneDirect}</span>
                <span className="text-gray-500 text-[11px]">Numéro Gratuit Suisse : {BATIMOVE_COMPANY_CONFIG.phoneTollFree}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Coordonnées Bancaires Officielles (BCGE)
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Établissement Bancaire</span>
                  <span className="font-bold text-gray-900 text-sm">{BATIMOVE_COMPANY_CONFIG.bank}</span>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Numéro IBAN Suisse</span>
                  <span className="font-mono font-bold text-gray-900 text-sm bg-blue-50/60 text-blue-900 px-2 py-1 rounded border border-blue-200 inline-block tracking-wider">
                    {BATIMOVE_COMPANY_CONFIG.iban}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Code BIC / SWIFT</span>
                  <span className="font-mono font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 inline-block">
                    {BATIMOVE_COMPANY_CONFIG.bic}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Format de Facturation</span>
                  <span className="font-semibold text-gray-700">QR-Facture Suisse Standardisée (IS-QR compliant)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={exportBackupJson}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-98 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Exporter la Sauvegarde des Données (JSON)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEAM & RBAC */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-gray-900">Membres de l'Équipe & Rôles d'Accès</h4>
              <p className="text-xs text-gray-500 mt-0.5">Contrôle des permissions selon le modèle suisse de conformité</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onWorkspaceModeChange(workspaceMode === 'team' ? 'individual' : 'team')}
                className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-sm hover:border-gray-300"
              >
                Mode : {workspaceMode === 'team' ? 'Équipe Générale' : 'Mon Espace'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allUsers.map(u => {
              const isCurrent = u.id === currentUser.id;
              return (
                <div
                  key={u.id}
                  className={cn(
                    "p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between",
                    isCurrent ? "border-gray-900 ring-1 ring-gray-900 shadow-sm" : "border-gray-200/80"
                  )}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm", u.avatarBg)}>
                          {u.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-gray-900">{u.name}</h4>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-gray-900 text-white text-[10px] font-bold">
                                Vous
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-gray-500">{u.role}</span>
                        </div>
                      </div>

                      {!isCurrent && (
                        <button
                          onClick={() => {
                            setCurrentUser(u);
                            onUserChange(u);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                        >
                          Activer
                        </button>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-gray-500 mt-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{u.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{u.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                    {u.permissions.canViewFinancials && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-100">
                        Finances & TVA
                      </span>
                    )}
                    {u.permissions.canManageFleet && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-100">
                        Gestion Flotte
                      </span>
                    )}
                    {u.permissions.canEditPricing && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 text-[10px] font-bold border border-purple-100">
                        Édition Tarifs
                      </span>
                    )}
                    {u.permissions.canDeleteLeads && (
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-800 text-[10px] font-bold border border-red-100">
                        Suppression
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & PIN */}
      {activeTab === 'security' && (
        <div className="max-w-md p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-sm text-gray-900">Code PIN de Déverrouillage</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Ce code PIN protège la session en cas de partage de poste ou sur terminal mobile.
            </p>
          </div>

          <form onSubmit={handleSavePin} className="space-y-3">
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
                className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 active:scale-98 transition-all shadow-sm"
              >
                Mettre à jour le code PIN
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-md p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-sm text-gray-900">Coordonnées Personnelles</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Informations affichées lors de vos correspondances avec les clients et sur les factures
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3">
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
                className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 active:scale-98 transition-all shadow-sm"
              >
                Enregistrer les Modifications
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
