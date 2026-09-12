import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Phone, MessageSquare, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { LeadItem, updateLeadStatus } from '../../../../services/supabaseClient';
import { cn } from '../../core/utils/cn';

interface KanbanBoardProps {
  leads: LeadItem[];
  onSelectLead: (lead: LeadItem) => void;
  onReload: () => void;
}

const COLUMNS: { id: LeadItem['status']; title: string; color: string; badgeColor: string }[] = [
  { id: 'nouveau', title: 'Nouveaux Devis', color: 'border-t-blue-500', badgeColor: 'bg-blue-100 text-blue-800' },
  { id: 'visite', title: 'Visites Techniques', color: 'border-t-indigo-500', badgeColor: 'bg-indigo-100 text-indigo-800' },
  { id: 'en_cours', title: 'En Négociation', color: 'border-t-amber-500', badgeColor: 'bg-amber-100 text-amber-800' },
  { id: 'confirme', title: 'Confirmés', color: 'border-t-emerald-500', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { id: 'facture', title: 'Facturés', color: 'border-t-purple-500', badgeColor: 'bg-purple-100 text-purple-800' },
  { id: 'termine', title: 'Terminés', color: 'border-t-gray-500', badgeColor: 'bg-gray-100 text-gray-800' },
];

export function KanbanBoard({ leads, onSelectLead, onReload }: KanbanBoardProps) {
  const formatCHF = (val: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleQuickAdvance = async (e: React.MouseEvent, lead: LeadItem) => {
    e.stopPropagation();
    const statusOrder: LeadItem['status'][] = ['nouveau', 'visite', 'en_cours', 'confirme', 'facture', 'termine'];
    const currentIndex = statusOrder.indexOf(lead.status);
    if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
      const nextStatus = statusOrder[currentIndex + 1];
      try {
        await updateLeadStatus(lead.id, nextStatus);
        onReload();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-4 pt-1">
      <div className="flex gap-4 min-w-[1300px]">
        {COLUMNS.map(col => {
          const colLeads = leads.filter(l => l.status === col.id);
          const colSum = colLeads.reduce((sum, l) => sum + (l.amount_chf || l.estimated_amount_chf || 0), 0);

          return (
            <div 
              key={col.id} 
              className="flex-1 min-w-[280px] max-w-[320px] bg-gray-50/70 rounded-2xl border border-gray-200/60 flex flex-col max-h-[calc(100vh-250px)]"
            >
              {/* Column Header */}
              <div className={cn("p-3.5 border-b border-gray-200/60 border-t-4 rounded-t-2xl bg-white", col.color)}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-gray-700">{col.title}</span>
                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", col.badgeColor)}>
                    {colLeads.length}
                  </span>
                </div>
                <div className="mt-1 text-xs font-semibold text-gray-500 tabular-nums">
                  Total : {formatCHF(colSum)}
                </div>
              </div>

              {/* Cards List */}
              <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5">
                {colLeads.length === 0 ? (
                  <div className="p-6 text-center text-xs font-medium text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    Aucun dossier
                  </div>
                ) : (
                  colLeads.map(lead => {
                    const cleanPhone = (lead.client_phone || '').replace(/[^0-9]/g, '');
                    const amount = lead.amount_chf || lead.estimated_amount_chf || 0;

                    return (
                      <motion.div
                        key={lead.id}
                        whileHover={{ y: -2 }}
                        onClick={() => onSelectLead(lead)}
                        className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-sm hover:shadow hover:border-gray-300 transition-all cursor-pointer group flex flex-col justify-between relative"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                              {lead.id}
                            </span>
                            <span className="text-xs font-bold text-gray-900 tabular-nums">
                              {formatCHF(amount)}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {lead.client_name}
                          </h4>

                          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{lead.from_city || 'Genève'}</span>
                            <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                            <span className="truncate">{lead.to_city || 'Suisse'}</span>
                          </div>

                          {lead.move_date && (
                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span>{lead.move_date}</span>
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            {lead.client_phone && (
                              <a 
                                href={`tel:${lead.client_phone}`}
                                className="w-6 h-6 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors"
                                title="Appeler"
                              >
                                <Phone className="w-3 h-3 text-blue-600" />
                              </a>
                            )}
                            {lead.client_phone && (
                              <a 
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-6 h-6 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors"
                                title="WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          {col.id !== 'termine' && (
                            <button
                              onClick={(e) => handleQuickAdvance(e, lead)}
                              className="flex items-center gap-0.5 text-[10px] font-bold text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
                              title="Avancer à l'étape suivante"
                            >
                              Suivant
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
