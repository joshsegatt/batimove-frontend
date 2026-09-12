import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2, User, Phone, Mail, MapPin, Calendar, DollarSign } from 'lucide-react';
import { saveLead, LeadItem } from '../../../../services/supabaseClient';
import { useToast } from '../../core/components/ToastContext';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function NewLeadModal({ isOpen, onClose, onCreated }: NewLeadModalProps) {
  if (!isOpen) return null;

  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    service_type: 'Déménagement Résidentiel Premium',
    from_city: '',
    to_city: '',
    move_date: '',
    amount_chf: 1500,
    owner_id: 'user-anderson' as 'user-anderson' | 'user-josue',
    owner_name: 'Anderson Martins',
    status: 'nouveau' as const,
    details: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name || !formData.client_phone) {
      toast.error('Champs obligatoires', 'Veuillez renseigner au moins le nom et le téléphone du client.');
      return;
    }

    try {
      setSaving(true);
      await saveLead({
        ...formData,
        estimated_amount_chf: formData.amount_chf,
        created_at: new Date().toISOString()
      });
      toast.success('Dossier créé', `Le dossier de ${formData.client_name} a été ajouté au pipeline.`);
      onCreated();
      onClose();
    } catch (err: any) {
      toast.error('Erreur création', err?.message || 'Impossible d\'enregistrer le prospect');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Nouveau Devis / Prospect</h3>
              <p className="text-xs text-gray-500">Ajouter directement une affaire au pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom Complet *</label>
              <input 
                type="text"
                required
                placeholder="ex: Jean Dupont"
                value={formData.client_name}
                onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Téléphone *</label>
              <input 
                type="text"
                required
                placeholder="+41 79 123 45 67"
                value={formData.client_phone}
                onChange={e => setFormData({ ...formData, client_phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
              <input 
                type="email"
                placeholder="jean@example.ch"
                value={formData.client_email}
                onChange={e => setFormData({ ...formData, client_email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Montant Estimé (CHF)</label>
              <input 
                type="number"
                value={formData.amount_chf}
                onChange={e => setFormData({ ...formData, amount_chf: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold tabular-nums focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Responsable Direction</label>
              <select 
                value={formData.owner_id}
                onChange={e => {
                  const id = e.target.value as 'user-anderson' | 'user-josue';
                  const name = id === 'user-josue' ? 'Josue Segat' : 'Anderson Martins';
                  setFormData({ ...formData, owner_id: id, owner_name: name });
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none bg-white font-medium"
              >
                <option value="user-anderson">Anderson Martins (Directeur Général)</option>
                <option value="user-josue">Josue Segat (Directeur Associé)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ville de Départ</label>
              <input 
                type="text"
                placeholder="Genève"
                value={formData.from_city}
                onChange={e => setFormData({ ...formData, from_city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ville d'Arrivée</label>
              <input 
                type="text"
                placeholder="Lausanne"
                value={formData.to_city}
                onChange={e => setFormData({ ...formData, to_city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date d'intervention</label>
              <input 
                type="text"
                placeholder="25.04.2026"
                value={formData.move_date}
                onChange={e => setFormData({ ...formData, move_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Prestation</label>
              <select 
                value={formData.service_type}
                onChange={e => setFormData({ ...formData, service_type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none bg-white"
              >
                <option value="Déménagement Résidentiel Premium">Déménagement Résidentiel</option>
                <option value="Transfert Entreprise / B2B">Transfert Entreprise / B2B</option>
                <option value="Transport d'Art & Antiquités">Transport d'Art & Antiquités</option>
                <option value="Garde-meubles & Stockage">Garde-meubles & Stockage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Détails / Volume</label>
            <textarea 
              rows={2}
              placeholder="Appartement 4.5 pièces, étage avec ascenseur..."
              value={formData.details}
              onChange={e => setFormData({ ...formData, details: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:scale-95 transition-all shadow-md disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Créer le Devis
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
