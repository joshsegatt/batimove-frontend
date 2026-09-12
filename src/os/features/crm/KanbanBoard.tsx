import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Phone, MessageSquare, MapPin, Calendar, CheckCircle2, User } from 'lucide-react';
import { LeadItem, updateLeadStatus } from '../../../../services/supabaseClient';
import { useToast } from '../../core/components/ToastContext';
import { cn } from '../../core/utils/cn';

interface KanbanBoardProps {
  leads: LeadItem[];
  onSelectLead: (lead: LeadItem) => void;
  onReload: () => void;
}

const COLUMNS: { id: LeadItem['status']; title: string; color: string; badgeColor: string; activeBorder: string }[] = [
  { id: 'nouveau', title: 'Nouveaux Devis', color: 'border-t-blue-500', badgeColor: 'bg-blue-100 text-blue-800', activeBorder: 'ring-2 ring-blue-400 bg-blue-50/40' },
  { id: 'visite', title: 'Visites Techniques', color: 'border-t-indigo-500', badgeColor: 'bg-indigo-100 text-indigo-800', activeBorder: 'ring-2 ring-indigo-400 bg-indigo-50/40' },
  { id: 'en_cours', title: 'En Négociation', color: 'border-t-amber-500', badgeColor: 'bg-amber-100 text-amber-800', activeBorder: 'ring-2 ring-amber-400 bg-amber-50/40' },
  { id: 'confirme', title: 'Confirmés', color: 'border-t-emerald-500', badgeColor: 'bg-emerald-100 text-emerald-800', activeBorder: 'ring-2 ring-emerald-400 bg-emerald-50/40' },
  { id: 'facture', title: 'Facturés', color: 'border-t-purple-500', badgeColor: 'bg-purple-100 text-purple-800', activeBorder: 'ring-2 ring-purple-400 bg-purple-50/40' },
  { id: 'termine', title: 'Terminés', color: 'border-t-slate-500', badgeColor: 'bg-slate-100 text-slate-800', activeBorder: 'ring-2 ring-slate-400 bg-slate-50/40' },
];

export function KanbanBoard({ leads, onSelectLead, onReload }: KanbanBoardProps) {
  const { toast } = useToast();
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);

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
        const colTitle = COLUMNS.find(c => c.id === nextStatus)?.title || nextStatus;
        toast.success("Étape suivante", `${lead.client_name} -> ${colTitle}`);
        onReload();
      } catch (err) {
        toast.error("Erreur", "Impossible d'avancer le dossier");
      }
    }
  };

  const handleDrop = async (e: React.DragEvent, targetColId: LeadItem['status']) => {
    e.preventDefault();
    setDragOverCol(null);
    const leadId = e.dataTransfer.getData('text/plain') || draggingLeadId;
    setDraggingLeadId(null);
    if (!leadId) return;

    const lead = leads.find(l => l.id === leadId);
    if (lead && lead.status !== targetColId) {
      try {
        await updateLeadStatus(leadId, targetColId);
        const colTitle = COLUMNS.find(c => c.id === targetColId)?.title || targetColId;
        toast.success("Dossier déplacé", `${lead.client_name} déplacé vers ${colTitle}`);
        onReload();
      } catch (err) {
        toast.error("Erreur", "Échec du déplacement du dossier");
      }
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-4 pt-1">
      <div className="flex gap-4 min-w-[1300px]">
        {COLUMNS.map(col => {
          const colLeads = leads.filter(l => l.status === col.id);
          const colSum = colLeads.reduce((sum, l) => sum + (l.amount_chf || l.estimated_amount_chf || 0), 0);
          const isOver = dragOverCol === col.id;

          return (
            <div 
              key={col.id} 
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dragOverCol !== col.id) setDragOverCol(col.id);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDragOverCol(null);
                }
              }}
              onDrop={(e) => handleDrop(e, col.id)}
              className={cn(
                "flex-1 min-w-[280px] max-w-[320px] bg-slate-50/70 rounded-2xl border border-slate-200/70 flex flex-col max-h-[calc(100vh-250px)] transition-all duration-150",
                col.color,
                isOver ? col.activeBorder : ""
              )}
            >
              {/* Column Header */}
              <div className={cn("p-3.5 border-b border-slate-200/60 border-t-4 rounded-t-2xl bg-white", col.color)}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">{col.title}</span>
                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", col.badgeColor)}>
                    {colLeads.length}
                  </span>
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-500 tabular-nums">
                  Total : {formatCHF(colSum)}
                </div>
              </div>

              {/* Cards List */}
              <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5">
                {colLeads.length === 0 ? (
                  <div className="p-8 text-center text-xs font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                    Déposer un dossier ici
                  </div>
                ) : (
                  colLeads.map(lead => {
                    const cleanPhone = (lead.client_phone || '').replace(/[^0-9]/g, '');
                    const amount = lead.amount_chf || lead.estimated_amount_chf || 0;
                    const isDragging = draggingLeadId === lead.id;
                    const isJosue = lead.owner_id === 'user-josue' || lead.owner_name?.includes('Josue');

                    return (
                      <motion.div
                        key={lead.id}
                        draggable={true}
                        onDragStart={(e: any) => {
                          setDraggingLeadId(lead.id);
                          e.dataTransfer.setData('text/plain', lead.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragEnd={() => {
                          setDraggingLeadId(null);
                          setDragOverCol(null);
                        }}
                        whileHover={{ y: -2 }}
                        onClick={() => onSelectLead(lead)}
                        className={cn(
                          "p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing group flex flex-col justify-between relative",
                          isDragging ? "opacity-40 scale-95 border-dashed border-blue-400" : ""
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                              {lead.id}
                            </span>
                            <span className="text-xs font-bold text-slate-900 tabular-nums">
                              {formatCHF(amount)}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {lead.client_name}
                          </h4>

                          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{lead.from_city || 'Genève'}</span>
                            <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                            <span className="truncate">{lead.to_city || 'Suisse'}</span>
                          </div>

                          {lead.move_date && (
                            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span>{lead.move_date}</span>
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            {/* Owner Avatar Badge */}
                            <span 
                              className={cn(
                                "w-5 h-5 rounded-md text-white text-[9px] font-bold flex items-center justify-center shadow-xs",
                                isJosue ? "bg-emerald-700" : "bg-[#0052A3]"
                              )}
                              title={`Responsable : ${isJosue ? 'Josue Segat' : 'Anderson Martins'}`}
                            >
                              {isJosue ? 'JS' : 'AM'}
                            </span>

                            {lead.client_phone && (
                              <a 
                                href={`tel:${lead.client_phone}`}
                                className="w-6 h-6 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
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
                              className="flex items-center gap-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors"
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
