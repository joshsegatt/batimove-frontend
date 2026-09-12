import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Layers, Calendar, Truck, Landmark, 
  User, ArrowRight, X, Sparkles, Building2, Phone
} from 'lucide-react';
import { LeadItem } from '../../../../services/supabaseClient';
import { OsView } from '../layouts/OsLayout';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadItem[];
  onSelectLead: (lead: LeadItem) => void;
  onViewChange: (view: OsView) => void;
  onOpenNewLead: () => void;
  onOpenAccount: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  leads,
  onSelectLead,
  onViewChange,
  onOpenNewLead,
  onOpenAccount
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredLeads = query.trim() ? leads.filter(l => 
    l.client_name?.toLowerCase().includes(query.toLowerCase()) ||
    l.id?.toLowerCase().includes(query.toLowerCase()) ||
    l.from_city?.toLowerCase().includes(query.toLowerCase()) ||
    l.to_city?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5) : [];

  return (
    <div className="fixed inset-0 z-[170] flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
      />

      {/* Palette Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -10 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10"
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            autoFocus
            type="text"
            placeholder="Rechercher un dossier, un client, ou exécuter une action..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full text-sm font-medium text-gray-900 focus:outline-none placeholder:text-gray-400"
          />
          <kbd className="px-2 py-0.5 rounded bg-gray-100 text-gray-400 text-[10px] font-mono border border-gray-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 text-xs">
          {/* Action: New Lead */}
          <button
            onClick={() => {
              onOpenNewLead();
              onClose();
            }}
            className="w-full p-3 rounded-xl hover:bg-gray-50 flex items-center justify-between text-left transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-gray-900">Créer un Nouveau Devis</div>
                <div className="text-gray-400">Ajouter directement un prospect au pipeline</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
          </button>

          {/* Quick Navigations */}
          <div className="px-3 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Navigation Rapide
          </div>

          <div className="grid grid-cols-2 gap-1 px-1">
            <button
              onClick={() => {
                onViewChange('crm');
                onClose();
              }}
              className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-left transition-colors"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-700">Pipeline Devis (CRM)</span>
            </button>

            <button
              onClick={() => {
                onViewChange('operations');
                onClose();
              }}
              className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-left transition-colors"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-gray-700">Planning Missions</span>
            </button>

            <button
              onClick={() => {
                onViewChange('fleet');
                onClose();
              }}
              className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-left transition-colors"
            >
              <Truck className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-gray-700">Flotte Véhicules</span>
            </button>

            <button
              onClick={() => {
                onViewChange('fiduciary');
                onClose();
              }}
              className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-left transition-colors"
            >
              <Landmark className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-gray-700">Extrait Fiduciaire & TVA</span>
            </button>
          </div>

          {/* Leads Matching Query */}
          {filteredLeads.length > 0 && (
            <>
              <div className="px-3 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Dossiers Correspondants
              </div>

              {filteredLeads.map(l => (
                <button
                  key={l.id}
                  onClick={() => {
                    onSelectLead(l);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                      {l.id}
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-gray-900 truncate">{l.client_name}</div>
                      <div className="text-[11px] text-gray-400 truncate">
                        {l.from_city} → {l.to_city} ({l.service_type})
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-gray-900 tabular-nums ml-2 flex-shrink-0">
                    CHF {l.amount_chf || l.estimated_amount_chf || 0}
                  </span>
                </button>
              ))}
            </>
          )}

          {/* Account & Security Link */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => {
                onOpenAccount();
                onClose();
              }}
              className="w-full p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-left text-gray-600"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-medium">Ouvrir le menu Profil, Équipe & Sécurité</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
