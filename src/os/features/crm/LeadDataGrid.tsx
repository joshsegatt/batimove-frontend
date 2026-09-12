import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Phone, MessageSquare, Trash2, Edit2, 
  ChevronDown, ChevronRight, Check, LayoutGrid, List, ArrowRight, 
  X, Download, Layers, AlertCircle, Sparkles
} from 'lucide-react';
import { LeadItem, deleteLead, updateLeadStatus, updateLeadDetails } from '../../../../services/supabaseClient';
import { KanbanBoard } from './KanbanBoard';
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
  termine: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-700', label: 'Terminé' },
  annule: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Annulé' },
};

const ALL_STATUSES: LeadItem['status'][] = ['nouveau', 'visite', 'en_cours', 'confirme', 'facture', 'termine', 'annule'];

type PriorityType = 'Urgente' | 'Haute' | 'Normale' | 'Basse';

const PRIORITY_META: Record<PriorityType, { bg: string; text: string; dot: string }> = {
  Urgente: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
  Haute: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  Normale: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  Basse: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-600', dot: 'bg-gray-400' },
};

export function LeadDataGrid({ leads, onReload, onSelectLead, initialFilter }: LeadDataGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>(initialFilter || 'ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grouped' | 'kanban'>('grouped');
  const [activeStatusPopover, setActiveStatusPopover] = useState<string | null>(null);
  const [activePriorityPopover, setActivePriorityPopover] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

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
        badgeColor: 'bg-emerald-100 text-emerald-800',
        items: filteredLeads.filter(l => l.status === 'confirme' || l.status === 'facture')
      },
      {
        id: 'pending',
        title: 'Devis en Négociation & Visites',
        color: 'border-l-blue-500',
        badgeColor: 'bg-blue-100 text-blue-800',
        items: filteredLeads.filter(l => l.status === 'nouveau' || l.status === 'visite' || l.status === 'en_cours')
      },
      {
        id: 'archived',
        title: 'Dossiers Clôturés ou Annulés',
        color: 'border-l-gray-400',
        badgeColor: 'bg-gray-100 text-gray-800',
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
      onReload();
    } catch (err) {
      alert('Erreur changement statut');
    }
  };

  const handlePriorityChange = async (lead: LeadItem, newPriority: PriorityType) => {
    setActivePriorityPopover(null);
    try {
      const currentNotes = lead.notes || '';
      const clean = currentNotes.replace(/Priorité:[^|]*\|?/, '').trim();
      const updatedNotes = `${clean} | Priorité: ${newPriority}`;
      await updateLeadDetails(lead.id, { notes: updatedNotes });
      onReload();
    } catch (err) {
      alert('Erreur mise à jour priorité');
    }
  };

  const getLeadPriority = (lead: LeadItem): PriorityType => {
    if (lead.notes?.includes('Priorité: Urgente')) return 'Urgente';
    if (lead.notes?.includes('Priorité: Haute')) return 'Haute';
    if (lead.notes?.includes('Priorité: Basse')) return 'Basse';
    return 'Normale';
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Confirmer la suppression de ce devis ?")) {
      try {
        await deleteLead(id);
        onReload();
      } catch (err) {
        alert('Erreur suppression');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Supprimer définitivement ${selectedLeads.size} dossier(s) ?`)) {
      for (const id of selectedLeads) {
        try {
          await deleteLead(id);
        } catch (e) {
          console.error(e);
        }
      }
      setSelectedLeads(new Set());
      onReload();
    }
  };

  const formatCHF = (amount?: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Render a Single Lead Row
  const renderRow = (lead: LeadItem) => {
    const cleanPhone = (lead.client_phone || '').replace(/[^0-9]/g, '');
    const statusMeta = STATUS_COLORS[lead.status] || STATUS_COLORS.nouveau;
    const priority = getLeadPriority(lead);
    const priorityMeta = PRIORITY_META[priority];
    const amount = lead.amount_chf || lead.estimated_amount_chf || 0;

    return (
      <div
        key={lead.id}
        onClick={() => onSelectLead(lead)}
        className={cn(
          "grid grid-cols-[36px_100px_1.5fr_1fr_1.1fr_100px_120px_90px] gap-3 p-3.5 items-center group transition-colors hover:bg-gray-50/80 cursor-pointer text-xs relative",
          selectedLeads.has(lead.id) && "bg-blue-50/30"
        )}
      >
        {/* Checkbox */}
        <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={selectedLeads.has(lead.id)}
            onChange={() => toggleSelection(lead.id)}
            className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
          />
        </div>

        {/* ID */}
        <div className="font-mono font-semibold text-gray-500">
          {lead.id}
        </div>

        {/* Client Name & Phone */}
        <div className="flex flex-col truncate">
          <span className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {lead.client_name}
          </span>
          <span className="text-[11px] text-gray-400 font-mono">{lead.client_phone}</span>
        </div>

        {/* Service Type */}
        <div className="text-gray-600 truncate font-medium">
          {lead.service_type || 'Déménagement'}
        </div>

        {/* Route & Date */}
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-1 font-medium text-gray-800 truncate">
            <span className="truncate">{lead.from_city || 'Genève'}</span>
            <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
            <span className="truncate">{lead.to_city || 'Suisse'}</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-0.5">{lead.move_date || 'Date à fixer'}</span>
        </div>

        {/* Priority Badge Popover (Monday.com style) */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setActivePriorityPopover(activePriorityPopover === lead.id ? null : lead.id)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-transform active:scale-95",
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
                className="absolute top-full left-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-200 p-1 z-50"
              >
                {(['Urgente', 'Haute', 'Normale', 'Basse'] as PriorityType[]).map(pr => (
                  <button
                    key={pr}
                    onClick={() => handlePriorityChange(lead, pr)}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-gray-50",
                      priority === pr ? "text-gray-900 bg-gray-50" : "text-gray-600"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={cn("w-1.5 h-1.5 rounded-full", PRIORITY_META[pr].dot)} />
                      {pr}
                    </span>
                    {priority === pr && <Check className="w-3 h-3 text-gray-900" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Montant & Status Popover */}
        <div className="flex flex-col gap-1" onClick={e => e.stopPropagation()}>
          <span className="font-bold text-gray-900 tabular-nums">
            {formatCHF(amount)}
          </span>

          <div className="relative">
            <button
              onClick={() => setActiveStatusPopover(activeStatusPopover === lead.id ? null : lead.id)}
              className={cn(
                "flex items-center justify-between gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-transform active:scale-95",
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
                  className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-200 p-1 z-50"
                >
                  {ALL_STATUSES.map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(lead.id, st)}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-gray-50",
                        lead.status === st ? "text-gray-900 bg-gray-50" : "text-gray-600"
                      )}
                    >
                      {STATUS_COLORS[st]?.label || st}
                      {lead.status === st && <Check className="w-3.5 h-3.5 text-gray-900" />}
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
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Appeler"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => handleDelete(lead.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Control Bar: Search, Status Tabs, View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher client, ID, ville, téléphone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-gray-200 text-xs focus:border-gray-900 focus:outline-none placeholder:text-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills and View Mode */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedStatusTab('ALL')}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors",
                selectedStatusTab === 'ALL' ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              Tous ({leads.length})
            </button>
            <button
              onClick={() => setSelectedStatusTab('nouveau')}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors",
                selectedStatusTab === 'nouveau' ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              Nouveaux ({leads.filter(l => l.status === 'nouveau').length})
            </button>
            <button
              onClick={() => setSelectedStatusTab('confirme')}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors",
                selectedStatusTab === 'confirme' ? "bg-emerald-600 text-white" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              Confirmés ({leads.filter(l => l.status === 'confirme').length})
            </button>
          </div>

          {/* Mode Switcher: Grouped vs Table vs Kanban */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('grouped')}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                viewMode === 'grouped' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
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
                viewMode === 'table' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
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
                viewMode === 'kanban' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
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
                className={cn("bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden border-l-4", group.color)}
              >
                {/* Collapsible Group Header */}
                <div 
                  onClick={() => toggleGroup(group.id)}
                  className="p-3.5 bg-gray-50/70 border-b border-gray-200/60 flex items-center justify-between cursor-pointer hover:bg-gray-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {isCollapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-800">{group.title}</h4>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", group.badgeColor)}>
                      {group.items.length}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-gray-700 tabular-nums">
                    Total : {formatCHF(groupSum)}
                  </div>
                </div>

                {/* Group Content */}
                {!isCollapsed && (
                  <div className="divide-y divide-gray-100">
                    {group.items.length === 0 ? (
                      <div className="p-6 text-center text-xs font-medium text-gray-400">
                        Aucun dossier dans ce groupe.
                      </div>
                    ) : (
                      group.items.map(lead => renderRow(lead))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW: SIMPLE FLAT TABLE */
        <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
          {/* Header Row */}
          <div className="grid grid-cols-[36px_100px_1.5fr_1fr_1.1fr_100px_120px_90px] gap-3 p-3.5 border-b border-gray-200/70 bg-gray-50/70 text-[11px] font-bold text-gray-400 uppercase tracking-wider items-center">
            <div className="flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                onChange={selectAll}
                className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
              />
            </div>
            <div>Réf</div>
            <div>Client</div>
            <div>Prestation</div>
            <div>Trajet & Date</div>
            <div>Priorité</div>
            <div>Montant / Statut</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {filteredLeads.length === 0 ? (
              <div className="p-10 text-center text-sm font-medium text-gray-400">
                Aucun dossier correspondant aux critères.
              </div>
            ) : (
              filteredLeads.map(lead => renderRow(lead))
            )}
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedLeads.size > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 z-[100] border border-white/10"
          >
            <span className="text-xs font-bold">{selectedLeads.size} sélectionné(s)</span>
            <div className="w-px h-4 bg-white/20" />
            <button 
              onClick={handleBulkDelete}
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Supprimer la sélection
            </button>
            <button 
              onClick={() => setSelectedLeads(new Set())}
              className="text-xs text-gray-400 hover:text-white"
            >
              Désélectionner
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
