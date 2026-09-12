import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Phone, MessageSquare, Trash2, Edit2, 
  ChevronDown, ChevronRight, Check, LayoutGrid, List, ArrowRight, 
  X, Download, Layers, AlertCircle, Sparkles, User, Users, Calendar, Plus, MapPin
} from 'lucide-react';
import { 
  LeadItem, 
  deleteLead, 
  updateLeadStatus, 
  updateLeadDetails,
  bulkUpdateLeadStatus,
  bulkAssignLeadOwner,
  bulkDeleteLeads
} from '../../../../services/supabaseClient';
import { getUsersList, UserProfile } from '../../../../services/adminAuth';
import { KanbanBoard } from './KanbanBoard';
import { BatteryProgress } from '../../core/components/BatteryProgress';
import { useToast } from '../../core/components/ToastContext';
import { cn } from '../../core/utils/cn';

interface LeadDataGridProps {
  leads: LeadItem[];
  onReload: () => void;
  onSelectLead: (lead: LeadItem) => void;
  onOpenNewLead?: () => void;
  initialFilter?: string | null;
}

// Signature Monday.com Vibrant Solid Colors
const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  nouveau: { bg: 'bg-[#579BFC] hover:bg-[#4387E8]', text: 'text-white', label: 'Nouveau' },
  visite: { bg: 'bg-[#A25DDC] hover:bg-[#8F48CB]', text: 'text-white', label: 'Visite planifiée' },
  en_cours: { bg: 'bg-[#00C875] hover:bg-[#00B066]', text: 'text-white', label: 'En cours' },
  confirme: { bg: 'bg-[#037F4C] hover:bg-[#02663D]', text: 'text-white', label: 'Gagné / Confirmé' },
  facture: { bg: 'bg-[#FDAB3D] hover:bg-[#E59728]', text: 'text-white', label: 'Facturé' },
  termine: { bg: 'bg-[#797E93] hover:bg-[#64687C]', text: 'text-white', label: 'Terminé' },
  annule: { bg: 'bg-[#E2445C] hover:bg-[#CC344B]', text: 'text-white', label: 'Perdu / Annulé' },
};

const ALL_STATUSES: LeadItem['status'][] = ['nouveau', 'visite', 'en_cours', 'confirme', 'facture', 'termine', 'annule'];

type PriorityType = 'Urgente' | 'Haute' | 'Normale' | 'Basse';

const PRIORITY_META: Record<PriorityType, { bg: string; text: string; dot: string }> = {
  Urgente: { bg: 'bg-red-500 text-white', text: 'text-white', dot: 'bg-white' },
  Haute: { bg: 'bg-amber-500 text-white', text: 'text-white', dot: 'bg-white' },
  Normale: { bg: 'bg-blue-500 text-white', text: 'text-white', dot: 'bg-white' },
  Basse: { bg: 'bg-slate-400 text-white', text: 'text-white', dot: 'bg-white' },
};

export function LeadDataGrid({ leads, onReload, onSelectLead, onOpenNewLead, initialFilter }: LeadDataGridProps) {
  const { toast, confirm } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>(initialFilter || 'ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grouped' | 'kanban'>('grouped');
  
  // Popovers State
  const [activeStatusPopover, setActiveStatusPopover] = useState<string | null>(null);
  const [activePriorityPopover, setActivePriorityPopover] = useState<string | null>(null);
  const [activeOwnerPopover, setActiveOwnerPopover] = useState<string | null>(null);
  
  // Inline Cell Editing State
  const [editingAmountId, setEditingAmountId] = useState<string | null>(null);
  const [editingAmountVal, setEditingAmountVal] = useState<string>('');
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [editingDateVal, setEditingDateVal] = useState<string>('');

  // Bulk Selection & Floating Bar State
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [showBulkStatusMenu, setShowBulkStatusMenu] = useState(false);
  const [showBulkOwnerMenu, setShowBulkOwnerMenu] = useState(false);

  // Collapsible Groups State (Monday.com style)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        lead.client_name?.toLowerCase().includes(query) ||
        lead.id?.toLowerCase().includes(query) ||
        lead.from_city?.toLowerCase().includes(query) ||
        lead.to_city?.toLowerCase().includes(query) ||
        lead.owner_name?.toLowerCase().includes(query) ||
        lead.client_phone?.toLowerCase().includes(query);

      let matchesStatus = true;
      if (selectedStatusTab === 'en_attente') {
        matchesStatus = lead.status === 'nouveau' || lead.status === 'visite' || lead.status === 'en_cours';
      } else if (selectedStatusTab !== 'ALL') {
        matchesStatus = lead.status === selectedStatusTab;
      }

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, selectedStatusTab]);

  // Group Definitions (Monday.com work groups with signature colors)
  const groupedData = useMemo(() => {
    return [
      {
        id: 'incoming',
        title: 'Nouveaux Devis & Demandes Entrantes',
        circleBg: 'bg-[#E2498A]',
        textColor: 'text-[#E2498A]',
        stripeColor: 'bg-[#E2498A]',
        badgeColor: 'bg-rose-50 text-[#E2498A] border border-rose-200',
        items: filteredLeads.filter(l => l.status === 'nouveau' || l.status === 'visite')
      },
      {
        id: 'active',
        title: 'Dossiers en Négociation & Visites',
        circleBg: 'bg-[#0073EA]',
        textColor: 'text-[#0073EA]',
        stripeColor: 'bg-[#0073EA]',
        badgeColor: 'bg-blue-50 text-[#0073EA] border border-blue-200',
        items: filteredLeads.filter(l => l.status === 'en_cours')
      },
      {
        id: 'confirmed',
        title: 'Missions Confirmées & Facturées',
        circleBg: 'bg-[#00C875]',
        textColor: 'text-[#00C875]',
        stripeColor: 'bg-[#00C875]',
        badgeColor: 'bg-emerald-50 text-[#00C875] border border-emerald-200',
        items: filteredLeads.filter(l => l.status === 'confirme' || l.status === 'facture')
      },
      {
        id: 'archived',
        title: 'Dossiers Clôturés ou Archivés',
        circleBg: 'bg-[#797E93]',
        textColor: 'text-[#797E93]',
        stripeColor: 'bg-[#797E93]',
        badgeColor: 'bg-slate-100 text-[#797E93] border border-slate-200',
        items: filteredLeads.filter(l => l.status === 'termine' || l.status === 'annule')
      }
    ];
  }, [filteredLeads]);

  const toggleSelection = (id: string) => {
    const next = new Set(selectedLeads);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedLeads(next);
  };

  const selectAll = () => {
    if (selectedLeads.size === filteredLeads.length) setSelectedLeads(new Set());
    else setSelectedLeads(new Set(filteredLeads.map(l => l.id)));
  };

  const handleStatusChange = async (id: string, newStatus: LeadItem['status']) => {
    setActiveStatusPopover(null);
    try {
      await updateLeadStatus(id, newStatus);
      toast.success("Statut mis à jour", `Dossier passé à ${STATUS_COLORS[newStatus]?.label || newStatus}`);
      onReload();
    } catch (err) {
      toast.error("Erreur", "Impossible de mettre à jour le statut");
    }
  };

  const handlePriorityChange = async (lead: LeadItem, newPriority: PriorityType) => {
    setActivePriorityPopover(null);
    try {
      const currentNotes = lead.notes || '';
      const clean = currentNotes.replace(/Priorité:[^|]*\|?/, '').trim();
      const updatedNotes = `${clean} | Priorité: ${newPriority}`;
      await updateLeadDetails(lead.id, { notes: updatedNotes });
      toast.success("Priorité mise à jour", `Dossier ${lead.id} classé en ${newPriority}`);
      onReload();
    } catch (err) {
      toast.error("Erreur", "Impossible d'ajuster la priorité");
    }
  };

  const handleOwnerChange = async (lead: LeadItem, director: UserProfile) => {
    setActiveOwnerPopover(null);
    try {
      await updateLeadDetails(lead.id, {
        owner_id: director.id as any,
        owner_name: director.name
      });
      toast.success("Responsable assigné", `Dossier confié à ${director.name}`);
      onReload();
    } catch (err) {
      toast.error("Erreur", "Impossible de changer le responsable");
    }
  };

  const handleSaveInlineAmount = async (lead: LeadItem) => {
    const val = parseFloat(editingAmountVal);
    setEditingAmountId(null);
    if (isNaN(val) || val < 0) return;
    try {
      await updateLeadDetails(lead.id, {
        amount_chf: val,
        estimated_amount_chf: val
      });
      toast.success("Montant actualisé", `${formatCHF(val)} pour le dossier ${lead.id}`);
      onReload();
    } catch (err) {
      toast.error("Erreur", "Échec d'actualisation du montant");
    }
  };

  const handleSaveInlineDate = async (lead: LeadItem) => {
    const val = editingDateVal.trim();
    setEditingDateId(null);
    if (!val) return;
    try {
      await updateLeadDetails(lead.id, { move_date: val });
      toast.success("Date enregistrée", `Date fixée au ${val}`);
      onReload();
    } catch (err) {
      toast.error("Erreur", "Échec d'actualisation de la date");
    }
  };

  const getLeadPriority = (lead: LeadItem): PriorityType => {
    if (lead.notes?.includes('Priorité: Urgente')) return 'Urgente';
    if (lead.notes?.includes('Priorité: Haute')) return 'Haute';
    if (lead.notes?.includes('Priorité: Basse')) return 'Basse';
    return 'Normale';
  };

  const getPhoneFlag = (phone?: string) => {
    if (!phone) return '🇨🇭';
    if (phone.includes('+33') || phone.startsWith('06') || phone.startsWith('07')) return '🇫🇷';
    if (phone.includes('+49')) return '🇩🇪';
    if (phone.includes('+39')) return '🇮🇹';
    if (phone.includes('+351')) return '🇵🇹';
    return '🇨🇭';
  };

  const getLeadOwner = (lead: LeadItem): UserProfile => {
    const users = getUsersList();
    if (lead.owner_id === 'user-josue' || lead.owner_name?.includes('Josue')) {
      return users.find(u => u.id === 'user-josue') || users[1] || users[0];
    }
    return users.find(u => u.id === 'user-anderson') || users[0];
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Supprimer ce devis ?",
      message: `Êtes-vous sûr de vouloir supprimer définitivement le dossier ${id} ? Cette action est irréversible.`,
      confirmLabel: "Supprimer",
      isDestructive: true
    });

    if (ok) {
      try {
        const res = await deleteLead(id);
        if (res.success) {
          toast.success("Dossier supprimé", `Le dossier ${id} a été retiré.`);
          onReload();
        } else {
          toast.error("Erreur suppression", res.message || "Action refusée par les droits d'accès.");
        }
      } catch (err) {
        toast.error("Erreur", "Échec de suppression");
      }
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedLeads.size;
    const ok = await confirm({
      title: `Supprimer ${count} dossier(s) ?`,
      message: `Cette action supprimera définitivement ${count} dossier(s) sélectionnés.`,
      confirmLabel: "Supprimer définitivement",
      isDestructive: true
    });

    if (ok) {
      const res = await bulkDeleteLeads(Array.from(selectedLeads));
      setSelectedLeads(new Set());
      toast.success("Suppression en masse", `${res.count} dossier(s) ont été supprimés.`);
      onReload();
    }
  };

  const handleBulkStatus = async (status: LeadItem['status']) => {
    setShowBulkStatusMenu(false);
    const ids = Array.from(selectedLeads);
    const res = await bulkUpdateLeadStatus(ids, status);
    toast.success("Mise à jour en masse", `${res.count} dossier(s) passés à ${STATUS_COLORS[status]?.label || status}.`);
    onReload();
  };

  const handleBulkAssign = async (director: UserProfile) => {
    setShowBulkOwnerMenu(false);
    const ids = Array.from(selectedLeads);
    const res = await bulkAssignLeadOwner(ids, director.id as any, director.name);
    toast.success("Réattribution en masse", `${res.count} dossier(s) assignés à ${director.name}.`);
    onReload();
  };

  const handleExportSelectedCSV = () => {
    const items = leads.filter(l => selectedLeads.has(l.id));
    if (items.length === 0) return;

    const headers = ['Réf', 'Client', 'Téléphone', 'Email', 'Prestation', 'Départ', 'Arrivée', 'Date', 'Montant CHF', 'Statut', 'Responsable'];
    const rows = items.map(l => [
      l.id,
      `"${l.client_name}"`,
      `"${l.client_phone}"`,
      l.client_email || '',
      `"${l.service_type || ''}"`,
      `"${l.from_city || ''}"`,
      `"${l.to_city || ''}"`,
      `"${l.move_date || ''}"`,
      l.amount_chf || l.estimated_amount_chf || 0,
      l.status,
      `"${l.owner_name || 'Anderson Martins'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BATIMOVE_Selection_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Exportation terminée", `${items.length} dossier(s) exportés en CSV.`);
  };

  const formatCHF = (amount?: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Close all popovers when clicking outside
  const hasActivePopover = Boolean(activeStatusPopover || activePriorityPopover || activeOwnerPopover || showBulkStatusMenu || showBulkOwnerMenu);

  // Render a Single Lead Row with Full Monday.com Aesthetics & Stacking Fix
  const renderRow = (lead: LeadItem, index: number, groupStripeColor: string = 'bg-blue-500') => {
    const statusMeta = STATUS_COLORS[lead.status] || STATUS_COLORS.nouveau;
    const priority = getLeadPriority(lead);
    const priorityMeta = PRIORITY_META[priority];
    const owner = getLeadOwner(lead);
    const amount = lead.amount_chf || lead.estimated_amount_chf || 0;
    const phoneFlag = getPhoneFlag(lead.client_phone);
    const isRowActive = activeOwnerPopover === lead.id || activeStatusPopover === lead.id || activePriorityPopover === lead.id;

    return (
      <div
        key={lead.id}
        onClick={() => onSelectLead(lead)}
        className={cn(
          "grid grid-cols-[6px_40px_1.4fr_140px_130px_120px_1.2fr_135px_100px_90px_65px] min-w-[1240px] items-stretch group transition-colors duration-150 cursor-pointer text-xs border-b border-slate-200/70",
          isRowActive ? "z-40 relative shadow-sm" : "z-0 relative",
          selectedLeads.has(lead.id)
            ? "bg-[#E3EFFF]"
            : index % 2 === 0
            ? "bg-[#FAFBFD] hover:bg-[#EEF3F8]"
            : "bg-[#F5F7FA] hover:bg-[#EEF3F8]"
        )}
      >
        {/* 1. Left Colored Stripe (Monday.com signature) */}
        <div className={cn("w-full h-full", groupStripeColor)} />

        {/* 2. Checkbox */}
        <div className="px-2 py-3 border-r border-slate-200/80 flex items-center justify-center" onClick={e => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={selectedLeads.has(lead.id)}
            onChange={() => toggleSelection(lead.id)}
            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* 3. Nom du Client & Speech Bubble (Updates/Comments) */}
        <div className="px-3 py-2.5 border-r border-slate-200/80 flex items-center justify-between gap-2">
          <div className="flex flex-col truncate">
            <span className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {lead.client_name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Réf: {lead.id}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectLead(lead);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 flex-shrink-0"
            title="Consulter les notes et l'historique"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. Responsable / Commercial (Photo / Avatar + 1-Click Dropdown) */}
        <div className="px-2.5 py-2 border-r border-slate-200/80 flex items-center relative" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setActiveOwnerPopover(activeOwnerPopover === lead.id ? null : lead.id)}
            className="inline-flex items-center gap-2 px-2 py-1 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 shadow-2xs transition-all text-left group/owner w-full cursor-pointer"
            title={`Commercial : ${owner.name} (${owner.role}) - Cliquer pour réassigner`}
          >
            {owner.avatarUrl ? (
              <img 
                src={owner.avatarUrl} 
                alt={owner.name} 
                className="w-5 h-5 rounded-full object-cover shadow-xs flex-shrink-0"
              />
            ) : (
              <span className={cn("w-5 h-5 rounded-full text-white text-[9px] font-black flex items-center justify-center shadow-xs flex-shrink-0", owner.avatarBg)}>
                {owner.initials}
              </span>
            )}
            <span className="text-[11px] font-bold text-slate-800 truncate">
              {owner.initials === 'AM' ? 'Anderson M.' : 'Josue S.'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover/owner:text-slate-700 flex-shrink-0 ml-auto" />
          </button>

          <AnimatePresence>
            {activeOwnerPopover === lead.id && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute top-full left-2 mt-1.5 w-52 bg-white rounded-2xl shadow-[0_15px_40px_-5px_rgba(0,0,0,0.25)] border border-slate-200/90 p-1.5 z-50 ring-1 ring-black/10"
              >
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Direction Responsable
                </div>
                {getUsersList().map(dir => (
                  <button
                    key={dir.id}
                    type="button"
                    onClick={() => handleOwnerChange(lead, dir)}
                    className={cn(
                      "w-full text-left px-2 py-1.5 rounded-xl text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer",
                      owner.id === dir.id ? "bg-slate-100 font-bold text-slate-900" : "text-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {dir.avatarUrl ? (
                        <img src={dir.avatarUrl} alt={dir.name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <span className={cn("w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-2xs", dir.avatarBg)}>
                          {dir.initials}
                        </span>
                      )}
                      <div className="flex flex-col truncate">
                        <span className="truncate text-xs font-semibold">{dir.name}</span>
                        <span className="text-[10px] text-slate-400">{dir.role}</span>
                      </div>
                    </div>
                    {owner.id === dir.id && <Check className="w-3.5 h-3.5 text-slate-900 flex-shrink-0" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. Négociation / Statut (Monday.com Signature Full Solid Color Block) */}
        <div className="px-2 py-2 border-r border-slate-200/80 flex items-center justify-center relative" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setActiveStatusPopover(activeStatusPopover === lead.id ? null : lead.id)}
            className={cn(
              "w-full h-7 rounded-md text-[11px] font-bold flex items-center justify-between px-2.5 shadow-sm transition-transform active:scale-95 cursor-pointer",
              statusMeta.bg,
              statusMeta.text
            )}
          >
            <span className="truncate">{statusMeta.label}</span>
            <ChevronDown className="w-3 h-3 opacity-70 flex-shrink-0 ml-1" />
          </button>

          <AnimatePresence>
            {activeStatusPopover === lead.id && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-2xl shadow-[0_15px_40px_-5px_rgba(0,0,0,0.25)] border border-slate-200/90 p-1.5 z-50 ring-1 ring-black/10"
              >
                {ALL_STATUSES.map(st => {
                  const meta = STATUS_COLORS[st] || STATUS_COLORS.nouveau;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(lead.id, st)}
                      className={cn(
                        "w-full text-left px-2.5 py-2 my-0.5 rounded-lg text-xs font-bold flex items-center justify-between transition-all cursor-pointer",
                        meta.bg,
                        meta.text
                      )}
                    >
                      <span>{meta.label}</span>
                      {lead.status === st && <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. Prestation */}
        <div className="px-3 py-2.5 border-r border-slate-200/80 flex items-center text-slate-700 truncate font-semibold text-[11px]">
          {lead.service_type || 'Déménagement'}
        </div>

        {/* 7. Trajet & Date (Pin Icon + Cities) */}
        <div className="px-3 py-2 border-r border-slate-200/80 flex flex-col justify-center truncate" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-1 font-semibold text-slate-800 truncate">
            <span className="text-slate-400">📍</span>
            <span className="truncate">{lead.from_city || 'Genève'}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{lead.to_city || 'Suisse'}</span>
          </div>

          {editingDateId === lead.id ? (
            <input 
              type="text"
              autoFocus
              value={editingDateVal}
              placeholder="ex: 28.03.2026"
              onChange={e => setEditingDateVal(e.target.value)}
              onBlur={() => handleSaveInlineDate(lead)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveInlineDate(lead);
                if (e.key === 'Escape') setEditingDateId(null);
              }}
              className="mt-0.5 px-1.5 py-0.5 rounded border border-blue-500 text-[11px] font-mono outline-none bg-white shadow-inner"
            />
          ) : (
            <span 
              onClick={() => {
                setEditingDateId(lead.id);
                setEditingDateVal(lead.move_date || '');
              }}
              className="text-[11px] text-slate-500 mt-0.5 hover:text-blue-600 hover:underline cursor-text transition-colors flex items-center gap-1"
              title="Cliquer pour modifier la date directement"
            >
              <Calendar className="w-2.5 h-2.5 opacity-60" />
              {lead.move_date || 'Date à fixer'}
            </span>
          )}
        </div>

        {/* 8. Téléphone (Country Flag + Link) */}
        <div className="px-3 py-2.5 border-r border-slate-200/80 flex items-center gap-1.5 font-mono text-[11px] text-slate-600" onClick={e => e.stopPropagation()}>
          <span className="text-sm">{phoneFlag}</span>
          {lead.client_phone ? (
            <a href={`tel:${lead.client_phone}`} className="hover:text-blue-600 hover:underline truncate">
              {lead.client_phone}
            </a>
          ) : (
            <span className="text-slate-400 italic">Non renseigné</span>
          )}
        </div>

        {/* 9. Montant CHF (Bold Tabular + 1-Click Inline Edit) */}
        <div className="px-3 py-2 border-r border-slate-200/80 flex items-center justify-end font-bold text-slate-900 tabular-nums text-xs" onClick={e => e.stopPropagation()}>
          {editingAmountId === lead.id ? (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 font-bold">CHF</span>
              <input 
                type="number"
                autoFocus
                value={editingAmountVal}
                onChange={e => setEditingAmountVal(e.target.value)}
                onBlur={() => handleSaveInlineAmount(lead)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveInlineAmount(lead);
                  if (e.key === 'Escape') setEditingAmountId(null);
                }}
                className="w-20 px-1 py-0.5 rounded border border-blue-500 text-xs font-bold text-slate-900 outline-none shadow-inner"
              />
            </div>
          ) : (
            <span 
              onClick={() => {
                setEditingAmountId(lead.id);
                setEditingAmountVal(String(amount));
              }}
              className="hover:text-blue-600 cursor-text transition-colors"
              title="Cliquer pour modifier le montant"
            >
              {formatCHF(amount)}
            </span>
          )}
        </div>

        {/* 10. Priorité (Vibrant Solid Badge Popover) */}
        <div className="px-2.5 py-2.5 border-r border-slate-200/80 flex items-center justify-center relative" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setActivePriorityPopover(activePriorityPopover === lead.id ? null : lead.id)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold transition-transform active:scale-95 shadow-2xs cursor-pointer",
              priorityMeta.bg,
              priorityMeta.text
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", priorityMeta.dot)} />
            <span>{priority}</span>
          </button>

          <AnimatePresence>
            {activePriorityPopover === lead.id && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute top-full left-0 mt-1.5 w-36 bg-white rounded-2xl shadow-[0_15px_40px_-5px_rgba(0,0,0,0.25)] border border-slate-200/90 p-1.5 z-50 ring-1 ring-black/10"
              >
                {(['Urgente', 'Haute', 'Normale', 'Basse'] as PriorityType[]).map(pr => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => handlePriorityChange(lead, pr)}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer",
                      priority === pr ? "text-slate-900 bg-slate-100 font-bold" : "text-slate-600"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={cn("w-1.5 h-1.5 rounded-full", PRIORITY_META[pr].dot)} />
                      {pr}
                    </span>
                    {priority === pr && <Check className="w-3 h-3 text-slate-900" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 11. Actions */}
        <div className="px-2 py-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          {lead.client_phone && (
            <a
              href={`tel:${lead.client_phone}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Appeler"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => handleDelete(lead.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Supprimer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4 relative">
      {/* Global Transparent Backdrop to dismiss active popovers */}
      {hasActivePopover && (
        <div 
          onClick={() => {
            setActiveStatusPopover(null);
            setActivePriorityPopover(null);
            setActiveOwnerPopover(null);
            setShowBulkStatusMenu(false);
            setShowBulkOwnerMenu(false);
          }}
          className="fixed inset-0 z-40 bg-transparent cursor-default"
        />
      )}

      {/* Top Filter & View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Search & New Lead Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onOpenNewLead && (
            <button
              type="button"
              onClick={onOpenNewLead}
              className="bg-[#0073EA] hover:bg-[#0060C0] text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer flex-shrink-0"
              title="Créer un nouveau devis / lead"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau dossier</span>
            </button>
          )}

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Rechercher client, réf, ville, responsable..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* View & Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedStatusTab('ALL')}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors",
                selectedStatusTab === 'ALL' ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              Tous ({leads.length})
            </button>
            <button
              onClick={() => setSelectedStatusTab('en_attente')}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors",
                selectedStatusTab === 'en_attente' ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              En cours ({leads.filter(l => l.status === 'nouveau' || l.status === 'visite' || l.status === 'en_cours').length})
            </button>
            <button
              onClick={() => setSelectedStatusTab('confirme')}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors",
                selectedStatusTab === 'confirme' ? "bg-emerald-600 text-white" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              Confirmés ({leads.filter(l => l.status === 'confirme').length})
            </button>
          </div>

          {/* Mode Switcher: Grouped vs Table vs Kanban */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grouped')}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                viewMode === 'grouped' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
              title="Vue Groupée par Étapes (Monday.com)"
            >
              <Layers className="w-3.5 h-3.5" />
              Groupé
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                viewMode === 'table' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
              title="Tableau Simple"
            >
              <List className="w-3.5 h-3.5" />
              Tableau
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                viewMode === 'kanban' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
              title="Kanban Board"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Kanban
            </button>
          </div>
        </div>
      </div>

      {/* VIEW: KANBAN MODE */}
      {viewMode === 'kanban' ? (
        <KanbanBoard 
          leads={filteredLeads}
          onSelectLead={onSelectLead}
          onReload={onReload}
        />
      ) : viewMode === 'grouped' ? (
        /* VIEW: GROUPED BY STAGES (Monday.com Work OS Signature) */
        <div className="space-y-4">
          {groupedData.map(group => {
            const groupSum = group.items.reduce((acc, l) => acc + (l.amount_chf || l.estimated_amount_chf || 0), 0);
            const isCollapsed = collapsedGroups[group.id];

            return (
              <div 
                key={group.id} 
                className="bg-[#F8FAFC] rounded-2xl border border-slate-200/90 shadow-xs transition-shadow hover:shadow-md overflow-hidden"
              >
                {/* Collapsible Group Header with Monday.com color styling */}
                <div 
                  onClick={() => toggleGroup(group.id)}
                  className="p-3 bg-[#EEF2F6] border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-200/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {isCollapsed ? <ChevronRight className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2.5 h-2.5 rounded-full", group.stripeColor)} />
                      <h4 className={cn("font-bold text-xs uppercase tracking-wider", group.headerColor)}>
                        {group.title}
                      </h4>
                    </div>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", group.badgeColor)}>
                      {group.items.length}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-700 tabular-nums">
                    Total : {formatCHF(groupSum)}
                  </div>
                </div>

                {/* Group Content Wrapped in Horizontal Scroll with 11-column matching headers */}
                {!isCollapsed && (
                  <div className="w-full overflow-x-auto">
                    {/* Header Columns inside Group matching renderRow grid exactly */}
                    <div className="grid grid-cols-[6px_40px_1.4fr_140px_130px_120px_1.2fr_135px_100px_90px_65px] min-w-[1240px] border-b border-slate-200 bg-[#E2E8F0]/70 text-[10px] font-bold text-slate-600 uppercase tracking-wider items-stretch">
                      <div className="w-full h-full" />
                      <div className="px-2 py-2.5 border-r border-slate-200/80 flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={group.items.length > 0 && group.items.every(i => selectedLeads.has(i.id))}
                          onChange={() => {
                            const next = new Set(selectedLeads);
                            const allSelected = group.items.every(i => next.has(i.id));
                            if (allSelected) {
                              group.items.forEach(i => next.delete(i.id));
                            } else {
                              group.items.forEach(i => next.add(i.id));
                            }
                            setSelectedLeads(next);
                          }}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                      <div className="px-3 py-2.5 border-r border-slate-200/80 flex items-center font-bold">Dossier / Client</div>
                      <div className="px-2.5 py-2.5 border-r border-slate-200/80 flex items-center font-bold text-slate-900 gap-1">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>Responsable</span>
                      </div>
                      <div className="px-2 py-2.5 border-r border-slate-200/80 flex items-center justify-center font-bold">Statut</div>
                      <div className="px-2 py-2.5 border-r border-slate-200/80 flex items-center justify-center font-bold">Priorité</div>
                      <div className="px-3 py-2.5 border-r border-slate-200/80 flex items-center font-bold">Prestation</div>
                      <div className="px-2.5 py-2.5 border-r border-slate-200/80 flex items-center font-bold">Contact Téléphone</div>
                      <div className="px-2.5 py-2.5 border-r border-slate-200/80 flex items-center font-bold">Date Trajet</div>
                      <div className="px-2.5 py-2.5 border-r border-slate-200/80 flex items-center justify-end font-bold">Montant</div>
                      <div className="px-2 py-2.5 text-right flex items-center justify-end font-bold">Actions</div>
                    </div>

                    <div className="divide-y divide-slate-200/60">
                      {group.items.length === 0 ? (
                        <div className="p-8 text-center text-xs font-medium text-slate-400 bg-[#FAFBFD]">
                          Aucun dossier dans ce groupe.
                        </div>
                      ) : (
                        group.items.map((lead, idx) => renderRow(lead, idx, group.stripeColor))
                      )}
                    </div>

                    {/* Monday.com Quick Add Row */}
                    {onOpenNewLead && (
                      <div 
                        onClick={onOpenNewLead}
                        className="px-4 py-2 bg-[#F8FAFC] hover:bg-blue-50/60 border-t border-slate-200/80 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter un dossier dans ce groupe...</span>
                      </div>
                    )}

                    {/* Monday.com Group Summary Footer with Battery Bar */}
                    {group.items.length > 0 && (
                      <div className="p-3 bg-[#EEF2F6]/90 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs min-w-[1240px]">
                        <div className="w-full sm:w-1/2">
                          <BatteryProgress leads={group.items} size="sm" showLegend={false} />
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-[11px] font-medium ml-auto">
                          <span>{group.items.length} dossier(s)</span>
                          <span className="font-bold text-slate-900 text-xs">Total : {formatCHF(groupSum)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW: SIMPLE FLAT TABLE */
        <div className="w-full bg-[#F8FAFC] rounded-2xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
          <div className="w-full overflow-x-auto">
            {/* Header Row matching renderRow grid exactly */}
            <div className="grid grid-cols-[6px_40px_1.4fr_140px_130px_120px_1.2fr_135px_100px_90px_65px] min-w-[1240px] border-b border-slate-200 bg-[#EEF2F6] text-[10px] font-bold text-slate-600 uppercase tracking-wider items-stretch">
              <div className="w-full h-full bg-slate-400" />
              <div className="px-2 py-3 border-r border-slate-200/80 flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                  onChange={selectAll}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <div className="px-3 py-3 border-r border-slate-200/80 flex items-center font-bold">Dossier / Client</div>
              <div className="px-2.5 py-3 border-r border-slate-200/80 flex items-center font-bold text-slate-900 gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Responsable</span>
              </div>
              <div className="px-2 py-3 border-r border-slate-200/80 flex items-center justify-center font-bold">Statut</div>
              <div className="px-2 py-3 border-r border-slate-200/80 flex items-center justify-center font-bold">Priorité</div>
              <div className="px-3 py-3 border-r border-slate-200/80 flex items-center font-bold">Prestation</div>
              <div className="px-2.5 py-3 border-r border-slate-200/80 flex items-center font-bold">Contact Téléphone</div>
              <div className="px-2.5 py-3 border-r border-slate-200/80 flex items-center font-bold">Date Trajet</div>
              <div className="px-2.5 py-3 border-r border-slate-200/80 flex items-center justify-end font-bold">Montant</div>
              <div className="px-2 py-3 text-right flex items-center justify-end font-bold">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-200/60">
              {filteredLeads.length === 0 ? (
                <div className="p-10 text-center text-sm font-medium text-slate-400 bg-[#FAFBFD]">
                  Aucun dossier correspondant aux critères.
                </div>
              ) : (
                filteredLeads.map((lead, idx) => renderRow(lead, idx, 'bg-blue-500'))
              )}
            </div>

            {/* Flat Table Bottom Quick Add */}
            {onOpenNewLead && (
              <div 
                onClick={onOpenNewLead}
                className="px-4 py-2.5 bg-[#F8FAFC] hover:bg-blue-50/60 border-t border-slate-200/80 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un dossier...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar (Power Batch Toolbar Monday.com) */}
      <AnimatePresence>
        {selectedLeads.size > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] border border-white/10 ring-1 ring-black/10"
          >
            <span className="text-xs font-bold text-slate-200 whitespace-nowrap">
              {selectedLeads.size} sélectionné(s)
            </span>
            <div className="w-px h-4 bg-white/20" />

            {/* Bulk Status Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowBulkStatusMenu(prev => !prev);
                  setShowBulkOwnerMenu(false);
                }}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Changer Statut</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {showBulkStatusMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute bottom-full mb-2 left-0 w-44 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-1.5 z-50"
                  >
                    {ALL_STATUSES.map(st => (
                      <button
                        key={st}
                        onClick={() => handleBulkStatus(st)}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-100 flex items-center gap-2"
                      >
                        <span className={cn("w-2 h-2 rounded-full", STATUS_COLORS[st]?.bg?.split(' ')[0] || 'bg-slate-400')} />
                        <span>{STATUS_COLORS[st]?.label || st}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bulk Owner Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowBulkOwnerMenu(prev => !prev);
                  setShowBulkStatusMenu(false);
                }}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-slate-300" />
                <span>Assigner</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {showBulkOwnerMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute bottom-full mb-2 left-0 w-48 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-1.5 z-50"
                  >
                    {TEAM_DIRECTORS.map(dir => (
                      <button
                        key={dir.id}
                        onClick={() => handleBulkAssign(dir)}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 flex items-center gap-2"
                      >
                        <span className={cn("w-5 h-5 rounded-lg text-white text-[10px] font-bold flex items-center justify-center", dir.bg)}>
                          {dir.initials}
                        </span>
                        <span>{dir.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bulk CSV Export */}
            <button 
              onClick={handleExportSelectedCSV}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Exporter la sélection en CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* Bulk Delete */}
            <button 
              onClick={handleBulkDelete}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Supprimer</span>
            </button>

            <button 
              onClick={() => setSelectedLeads(new Set())}
              className="text-xs text-slate-400 hover:text-white p-1 rounded-lg ml-1"
              title="Désélectionner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
