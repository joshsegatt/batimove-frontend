import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Clock, User, ShieldCheck, History, CheckCircle2 } from 'lucide-react';
import { LeadItem } from '../../../../services/supabaseClient';
import { getCurrentUser } from '../../../../services/adminAuth';

export interface AuditEvent {
  id: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  type: 'comment' | 'status_change' | 'system';
  content: string;
}

interface ActivityLogProps {
  lead: LeadItem;
}

export function ActivityLog({ lead }: ActivityLogProps) {
  const currentUser = getCurrentUser();
  const storageKey = `batimove_os_activity_${lead.id}`;

  const [events, setEvents] = useState<AuditEvent[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}

    // Default initial timeline
    return [
      {
        id: 'evt-init',
        authorName: 'Système Batimove',
        authorRole: 'Serveur Web',
        timestamp: lead.created_at ? new Date(lead.created_at).toLocaleString('fr-CH') : '08.03.2026, 10:15',
        type: 'system',
        content: `Dossier créé avec succès pour ${lead.client_name}. Prestation : ${lead.service_type}.`
      },
      {
        id: 'evt-stat',
        authorName: 'Alexandre de Senarclens',
        authorRole: 'Directeur Général',
        timestamp: 'Hier à 14:30',
        type: 'status_change',
        content: `Statut validé : ${lead.status.toUpperCase()} — Montant initial : CHF ${lead.amount_chf || lead.estimated_amount_chf || 0}.-`
      }
    ];
  });

  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newEvt: AuditEvent = {
      id: `evt-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      timestamp: new Date().toLocaleString('fr-CH', { dateStyle: 'short', timeStyle: 'short' }),
      type: 'comment',
      content: newComment.trim()
    };

    const updated = [newEvt, ...events];
    setEvents(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
    setNewComment('');
  };

  return (
    <div className="space-y-4">
      {/* Comment Input Box */}
      <form onSubmit={handleAddComment} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 focus-within:border-gray-900 transition-colors">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
          Ajouter une mise à jour / consigne pour l'équipe
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Commenter en tant que ${currentUser.name}...`}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-900 focus:outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-30 active:scale-95 transition-all flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            Publier
          </button>
        </div>
      </form>

      {/* Timeline Feed */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <History className="w-3.5 h-3.5" />
          Journal d'audit & Communications internes ({events.length})
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {events.map(evt => (
            <div key={evt.id} className="relative group">
              {/* Dot indicator */}
              <div className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
                evt.type === 'comment' ? 'bg-blue-600' :
                evt.type === 'status_change' ? 'bg-emerald-600' : 'bg-gray-400'
              }`} />

              <div className="p-3 rounded-2xl bg-white border border-gray-200/80 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <span>{evt.authorName}</span>
                    <span className="text-[10px] font-semibold text-gray-400">({evt.authorRole})</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{evt.timestamp}</span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-normal">
                  {evt.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
