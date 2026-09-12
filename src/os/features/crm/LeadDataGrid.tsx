import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Phone, MessageSquare, Trash2, Edit2, 
  ChevronDown, ChevronRight, Check, LayoutGrid, List, ArrowRight, 
  X, Download, Layers, AlertCircle, Sparkles, User, Users, Calendar
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
import { KanbanBoard } from './KanbanBoard';
import { BatteryProgress } from '../../core/components/BatteryProgress';
import { useToast } from '../../core/components/ToastContext';
import { cn } from '../../core/utils/cn';

interface LeadDataGridProps {
  leads: LeadItem[];
  onReload: () => void;
  onSelectLead: (lead: LeadItem) => void;
  initialFilter?: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  nouveau: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Nouveau' },
  visite: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', label: 'Visite planifiée' },
  en_cours: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'En négociation' },
  confirme: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Confirmé' },
  facture: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', label: 'Facturé' },
  termine: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', label: 'Terminé' },
  annule: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Annulé' },
};

const ALL_STATUSES: LeadItem['status'][] = ['nouveau', 'visite', 'en_cours', 'confirme', 'facture', 'termine', 'annule'];

type PriorityType = 'Urgente' | 'Haute' | 'Normale' | 'Basse';

const PRIORITY_META: Record<PriorityType, { bg: string; text: string; dot: string }> = {
  Urgente: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
  Haute: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  Normale: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  Basse: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' },
};

const TEAM_DIRECTORS = [
  { id: 'user-anderson', name: 'Anderson Martins', initials: 'AM', bg: 'bg-[#0052A3]', role: 'Directeur Général' },
  { id: 'user-josue', name: 'Josue Segat', initials: 'JS', bg: 'bg-emerald-700', role: 'Directeur Associé' }
];

export function LeadDataGrid({ leads, onReload, onSelectLead, initialFilter }: LeadDataGridProps) {
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

  // Group Definitions (Monday.com work groups)
  const groupedData = useMemo(() => {
    return [
      {
        id: 'confirmed',
        title: 'Missions Confirmées & Facturées',
        color: 'border-l-emerald-500',
        badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
        items: filteredLeads.filter(l => l.status === 'confirme' || l.status === 'facture')
      },
      {
        id: 'pending',
        title: 'Devis en Négociation & Visites Techniques',
        color: 'border-l-blue-500',
        badgeColor: 'bg-blue-50 text-blue-800 border border-blue-200',
        items: filteredLeads.filter(l => l.status === 'nouveau' || l.status === 'visite' || l.status === 'en_cours')
      },
      {
        id: 'archived',
        title: 'Dossiers Clôturés ou Archivés',
        color: 'border-l-slate-400',
        badgeColor: 'bg-slate-100 text-slate-800 border border-slate-200',
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

  const handleOwnerChange = async (lead: LeadItem, director: typeof TEAM_DIRECTORS[0]) => {
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

  const getLeadOwner = (lead: LeadItem) => {
    if (lead.owner_id === 'user-josue' || lead.owner_name?.includes('Josue')) {
      return TEAM_DIRECTORS[1];
    }
    return TEAM_DIRECTORS[0];
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

  const handleBulkAssign = async (director: typeof TEAM_DIRECTORS[0]) => {
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

  // Render a Single Lead Row
  const renderRow = (lead: LeadItem) => {
    const statusMeta = STATUS_COLORS[lead.status] || STATUS_COLORS.nouveau;
    const priority = getLeadPriority(lead);
    const priorityMeta = PRIORITY_META[priority];
    const owner = getLeadOwner(lead);
    const amount = lead.amount_chf || lead.estimated_amount_chf || 0;

    return (
      <div
        key={lead.id}
        onClick={() => onSelectLead(lead)}
        className={cn(
          "grid grid-cols-[36px_85px_1.3fr_75px_1fr_1.1fr_90px_125px_65px] gap-2.5 p-3 items-center group transition-colors duration-150 hover:bg-slate-50/90 cursor-pointer text-xs relative",
          selectedLeads.has(lead.id) ? "bg-blue-50/40" : "bg-white"
        )}
      >
        {/* Checkbox */}
        <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={selectedLeads.has(lead.id)}
            onChange={() => toggleSelection(lead.id)}
            className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
          />
        </div>

        {/* ID */}
        <div className="font-mono font-semibold text-slate-500 text-[11px]">
          {lead.id}
        </div>

        {/* Client Name & Phone */}
        <div className="flex flex-col truncate pr-2">
          <span className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {lead.client_name}
          </span>
          <span className="text-[11px] text-slate-400 font-mono truncate">{lead.client_phone}</span>
        </div>

        {/* Responsable (Owner AM / JS) with Popover */}
        <div className="relative flex items-center justify-start" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setActiveOwnerPopover(activeOwnerPopover === lead.id ? null : lead.id)}
            className={cn(
              "w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-bold shadow-sm transition-transform active:scale-95 border border-black/10",
              owner.bg
            )}
            title={`Responsable : ${owner.name} (${owner.role}) - Cliquer pour réattribuer`}
          >
            {owner.initials}
          </button>

          <AnimatePresence>
            {activeOwnerPopover === lead.id && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-2xl shadow-[0_12px_36px_-4px_rgba(0,0,0,0.14)] border border-slate-200/90 p-1.5 z-50 ring-1 ring-black/5"
              >
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Attribuer à la direction
                </div>
                {TEAM_DIRECTORS.map(dir => (
                  <button
                    key={dir.id}
                    onClick={() => handleOwnerChange(lead, dir)}
                    className={cn(
                      "w-full text-left px-2 py-1.5 rounded-xl text-xs flex items-center justify-between hover:bg-slate-50 transition-colors",
                      owner.id === dir.id ? "bg-slate-100 font-bold text-slate-900" : "text-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("w-6 h-6 rounded-lg text-white text-[10px] font-bold flex items-center justify-center", dir.bg)}>
                        {dir.initials}
                      </span>
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

        {/* Service Type */}
        <div className="text-slate-600 truncate font-medium text-[11px]">
          {lead.service_type || 'Déménagement'}
        </div>

        {/* Route & Inline Date Editing */}
        <div className="flex flex-col truncate" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-1 font-medium text-slate-800 truncate">
            <span className="truncate">{lead.from_city || 'Genève'}</span>
            <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
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
              className="text-[11px] text-slate-400 mt-0.5 hover:text-blue-600 hover:underline cursor-text transition-colors flex items-center gap-1"
              title="Cliquer pour modifier la date directement"
            >
              <Calendar className="w-2.5 h-2.5 opacity-60" />
              {lead.move_date || 'Date à fixer'}
            </span>
          )}
        </div>

        {/* Priority Badge Popover */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setActivePriorityPopover(activePriorityPopover === lead.id ? null : lead.id)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-transform active:scale-95 shadow-sm",
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
                className="absolute top-full left-0 mt-1.5 w-36 bg-white rounded-2xl shadow-[0_12px_36px_-4px_rgba(0,0,0,0.14)] border border-slate-200/90 p-1.5 z-50 ring-1 ring-black/5"
              >
                {(['Urgente', 'Haute', 'Normale', 'Basse'] as PriorityType[]).map(pr => (
                  <button
                    key={pr}
                    onClick={() => handlePriorityChange(lead, pr)}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors",
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

        {/* Montant (Inline Edit) & Status Popover */}
        <div className="flex flex-col gap-0.5" onClick={e => e.stopPropagation()}>
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
              className="font-bold text-slate-900 tabular-nums text-xs hover:text-blue-600 cursor-text transition-colors"
              title="Cliquer pour modifier le montant en 1 clic"
            >
              {formatCHF(amount)}
            </span>
          )}

          <div className="relative">
            <button
              onClick={() => setActiveStatusPopover(activeStatusPopover === lead.id ? null : lead.id)}
              className={cn(
                "flex items-center justify-between gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-transform active:scale-95 shadow-sm w-full",
                statusMeta.bg,
                statusMeta.text
              )}
            >
              <span className="truncate">{statusMeta.label}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-60 flex-shrink-0" />
            </button>

            <AnimatePresence>
              {activeStatusPopover === lead.id && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-2xl shadow-[0_12px_36px_-4px_rgba(0,0,0,0.14)] border border-slate-200/90 p-1.5 z-50 ring-1 ring-black/5"
                >
                  {ALL_STATUSES.map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(lead.id, st)}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors",
                        lead.status === st ? "text-slate-900 bg-slate-100 font-bold" : "text-slate-600"
                      )}
                    >
                      {STATUS_COLORS[st]?.label || st}
                      {lead.status === st && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Hover Actions */}
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
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
            onClick={() => handleDelete(lead.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher client, réf, ville, responsable..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-slate-400 focus:outline-none transition-all placeholder:text-slate-400"
          />
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
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
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
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
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
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
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
                className={cn(
                  "bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] border-l-4 transition-shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] overflow-hidden", 
                  group.color
                )}
              >
                {/* Collapsible Group Header */}
                <div 
                  onClick={() => toggleGroup(group.id)}
                  className="p-3.5 bg-slate-50/70 border-b border-slate-200/60 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {isCollapsed ? <ChevronRight className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">{group.title}</h4>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", group.badgeColor)}>
                      {group.items.length}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-700 tabular-nums">
                    Total : {formatCHF(groupSum)}
                  </div>
                </div>

                {/* Group Content */}
                {!isCollapsed && (
                  <div>
                    {/* Header Columns inside Group */}
                    <div className="grid grid-cols-[36px_85px_1.3fr_75px_1fr_1.1fr_90px_125px_65px] gap-2.5 px-3 py-2 border-b border-slate-100 bg-slate-50/40 text-[10px] font-bold text-slate-400 uppercase tracking-wider items-center">
                      <div className="flex items-center justify-center">
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
                          className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                      </div>
                      <div>Réf</div>
                      <div>Client</div>
                      <div>Responsable</div>
                      <div>Prestation</div>
                      <div>Trajet & Date</div>
                      <div>Priorité</div>
                      <div>Montant & Statut</div>
                      <div className="text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {group.items.length === 0 ? (
                        <div className="p-6 text-center text-xs font-medium text-slate-400">
                          Aucun dossier dans ce groupe.
                        </div>
                      ) : (
                        group.items.map(lead => renderRow(lead))
                      )}
                    </div>

                    {/* Monday.com Group Summary Footer with Battery Bar */}
                    {group.items.length > 0 && (
                      <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
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
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-[36px_85px_1.3fr_75px_1fr_1.1fr_90px_125px_65px] gap-2.5 p-3.5 border-b border-slate-200/70 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider items-center">
            <div className="flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                onChange={selectAll}
                className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
            </div>
            <div>Réf</div>
            <div>Client</div>
            <div>Responsable</div>
            <div>Prestation</div>
            <div>Trajet & Date</div>
            <div>Priorité</div>
            <div>Montant & Statut</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {filteredLeads.length === 0 ? (
              <div className="p-10 text-center text-sm font-medium text-slate-400">
                Aucun dossier correspondant aux critères.
              </div>
            ) : (
              filteredLeads.map(lead => renderRow(lead))
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
