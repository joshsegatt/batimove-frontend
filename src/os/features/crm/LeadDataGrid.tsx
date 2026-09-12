import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Phone, Trash2, Edit2, FileText, ChevronDown, Check } from 'lucide-react';
import { LeadItem, deleteLead, updateLeadStatus } from '../../../../services/supabaseClient';
import { cn } from '../../core/utils/cn';

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  Negotiation: 'bg-purple-100 text-purple-700',
  Won: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-gray-100 text-gray-700',
  Lost: 'bg-red-100 text-red-700',
};

const STATUS_OPTIONS = ['New', 'Contacted', 'Negotiation', 'Won', 'Completed', 'Lost'];

export function LeadDataGrid({ leads, onReload }: { leads: LeadItem[], onReload: () => void }) {
  const [activeStatusPopover, setActiveStatusPopover] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const next = new Set(selectedLeads);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedLeads(next);
  };

  const selectAll = () => {
    if (selectedLeads.size === leads.length) setSelectedLeads(new Set());
    else setSelectedLeads(new Set(leads.map(l => l.id)));
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActiveStatusPopover(null);
    try {
      await updateLeadStatus(id, newStatus);
      onReload(); // Refresh data
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
      try {
        await deleteLead(id);
        onReload();
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden flex flex-col">
      {/* Table Header */}
      <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_100px] gap-4 p-4 border-b border-gray-200/60 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
        <div className="flex items-center justify-center">
          <input 
            type="checkbox" 
            checked={selectedLeads.size === leads.length && leads.length > 0}
            onChange={selectAll}
            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
          />
        </div>
        <div>Client & Trajet</div>
        <div>Volume / Prix</div>
        <div>Date prévue</div>
        <div>Statut</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col divide-y divide-gray-100">
        {leads.length === 0 ? (
           <div className="p-8 text-center text-sm text-gray-500 font-medium">Aucun devis trouvé.</div>
        ) : (
          leads.map((lead) => (
            <div 
              key={lead.id} 
              className={cn(
                "grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_100px] gap-4 p-4 items-center group transition-colors hover:bg-gray-50/80 cursor-pointer relative",
                selectedLeads.has(lead.id) && "bg-blue-50/30"
              )}
            >
              <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  checked={selectedLeads.has(lead.id)}
                  onChange={() => toggleSelection(lead.id)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                />
              </div>

              {/* Client Info */}
              <div className="flex flex-col truncate">
                <span className="font-semibold text-gray-900 text-sm truncate">{lead.client_name || 'Client Inconnu'}</span>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 truncate">
                  <span className="truncate max-w-[80px]">{lead.moving_from || 'N/A'}</span>
                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[80px]">{lead.moving_to || 'N/A'}</span>
                </div>
              </div>

              {/* Volume & Price */}
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 text-sm tabular-nums">CHF {lead.price || '0.00'}</span>
                <span className="text-xs text-gray-500 mt-0.5">{lead.volume || '0 m³'}</span>
              </div>

              {/* Date */}
              <div className="text-sm font-medium text-gray-600">
                {lead.moving_date ? new Date(lead.moving_date).toLocaleDateString('fr-CH') : 'Non définie'}
              </div>

              {/* Status Badge with Popover (Inline Edit) */}
              <div className="relative flex items-center" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setActiveStatusPopover(activeStatusPopover === lead.id ? null : lead.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-transform active:scale-95",
                    STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-700'
                  )}
                >
                  {lead.status}
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>

                {/* Status Dropdown */}
                <AnimatePresence>
                  {activeStatusPopover === lead.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl shadow-black/10 border border-gray-200 p-1 z-50"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(lead.id, status)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between hover:bg-gray-50 transition-colors",
                            lead.status === status ? "text-gray-900" : "text-gray-600"
                          )}
                        >
                          {status}
                          {lead.status === status && <Check className="w-4 h-4 text-gray-900" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hover Actions */}
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                 <button className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition-colors">
                   <Phone className="w-4 h-4" />
                 </button>
                 <button className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition-colors">
                   <FileText className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => handleDelete(lead.id)}
                   className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Bulk Action Bar Placeholder */}
      <AnimatePresence>
        {selectedLeads.size > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-[100]"
          >
            <span className="text-sm font-semibold">{selectedLeads.size} sélectionné(s)</span>
            <div className="w-px h-4 bg-white/20" />
            <button className="text-sm font-medium hover:text-red-400 transition-colors">Supprimer</button>
            <button className="text-sm font-medium hover:text-blue-400 transition-colors">Exporter</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// ArrowRight icon for UI
function ArrowRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  )
}
