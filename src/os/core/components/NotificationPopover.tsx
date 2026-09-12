import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Clock, AlertCircle, ArrowRight, X, Calendar, FileText } from 'lucide-react';
import { LeadItem } from '../../../../services/supabaseClient';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadItem[];
  onSelectLead: (lead: LeadItem) => void;
}

export function NotificationPopover({ isOpen, onClose, leads, onSelectLead }: NotificationPopoverProps) {
  if (!isOpen) return null;

  // Derive notifications from actual data
  const newLeads = leads.filter(l => l.status === 'nouveau').slice(0, 3);
  const upcomingMoves = leads.filter(l => l.status === 'confirme' && l.move_date).slice(0, 3);
  const unpaidInvoices = leads.filter(l => l.status === 'facture').slice(0, 2);

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(prev => new Set([...prev, id]));
  };

  return (
    <div className="fixed inset-0 z-[160] overflow-hidden" onClick={onClose}>
      <div className="absolute top-16 right-4 sm:right-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-900" />
              <h4 className="font-bold text-xs text-gray-900">Centre de Notifications</h4>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 text-xs">
            {/* New Leads */}
            {newLeads.map(lead => {
              if (dismissed.has(`new-${lead.id}`)) return null;
              return (
                <div
                  key={`new-${lead.id}`}
                  onClick={() => {
                    onSelectLead(lead);
                    onClose();
                  }}
                  className="p-3.5 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3 group"
                >
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">Nouveau Devis Web</span>
                      <span className="text-[10px] text-gray-400 font-mono">Récent</span>
                    </div>
                    <p className="text-gray-500 truncate mt-0.5">{lead.client_name} ({lead.from_city || 'Genève'})</p>
                    <span className="font-semibold text-blue-600 text-[11px]">CHF {lead.amount_chf || lead.estimated_amount_chf || 0}.-</span>
                  </div>
                  <button
                    onClick={(e) => handleDismiss(`new-${lead.id}`, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-gray-600 transition-opacity"
                    title="Ignorer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* Upcoming Moves */}
            {upcomingMoves.map(lead => {
              if (dismissed.has(`move-${lead.id}`)) return null;
              return (
                <div
                  key={`move-${lead.id}`}
                  onClick={() => {
                    onSelectLead(lead);
                    onClose();
                  }}
                  className="p-3.5 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3 group"
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">Déménagement Programmé</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">Confirmé</span>
                    </div>
                    <p className="text-gray-500 truncate mt-0.5">{lead.client_name} — {lead.move_date}</p>
                    <span className="text-[11px] text-gray-400">{lead.from_city} ➔ {lead.to_city}</span>
                  </div>
                  <button
                    onClick={(e) => handleDismiss(`move-${lead.id}`, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-gray-600 transition-opacity"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* Unpaid Invoices */}
            {unpaidInvoices.map(lead => {
              if (dismissed.has(`inv-${lead.id}`)) return null;
              return (
                <div
                  key={`inv-${lead.id}`}
                  onClick={() => {
                    onSelectLead(lead);
                    onClose();
                  }}
                  className="p-3.5 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3 group"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">Facture en Attente</span>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">À encaisser</span>
                    </div>
                    <p className="text-gray-500 truncate mt-0.5">{lead.client_name} ({lead.id})</p>
                    <span className="font-bold text-gray-900 tabular-nums">CHF {lead.amount_chf || lead.estimated_amount_chf || 0}.-</span>
                  </div>
                  <button
                    onClick={(e) => handleDismiss(`inv-${lead.id}`, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-gray-600 transition-opacity"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50/70 border-t border-gray-100 text-center">
            <span className="text-[11px] font-semibold text-gray-400">
              Sincronisation Supabase en temps réel
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
