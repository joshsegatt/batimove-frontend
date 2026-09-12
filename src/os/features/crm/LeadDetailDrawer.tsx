import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Phone, MessageSquare, Mail, Download, Trash2, 
  Save, Calendar, MapPin, DollarSign, Shield, CheckCircle2,
  FileText, ExternalLink, Loader2, History, Truck, Users, AlertTriangle
} from 'lucide-react';
import { LeadItem, updateLeadDetails, deleteLead } from '../../../../services/supabaseClient';
import { InvoiceDocument } from '../../../../components/InvoiceDocument';
import { exportInvoiceToPdf } from '../../../../utils/pdfExport';
import { ActivityLog } from './ActivityLog';
import { QuickMessageModal } from './QuickMessageModal';
import { cn } from '../../core/utils/cn';

interface LeadDetailDrawerProps {
  lead: LeadItem | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function LeadDetailDrawer({ lead, onClose, onUpdate }: LeadDetailDrawerProps) {
  if (!lead) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'invoice'>('details');
  const [formData, setFormData] = useState<LeadItem>({ ...lead });
  const [saving, setSaving] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [showQuickMsg, setShowQuickMsg] = useState(false);
  const [quickMsgChannel, setQuickMsgChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const invoiceRef = useRef<HTMLDivElement>(null);

  const cleanPhone = (lead.client_phone || '').replace(/[^0-9]/g, '');

  const handleChange = (field: keyof LeadItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateLeadDetails(lead.id, formData);
      onUpdate();
      alert('Dossier mis à jour avec succès');
    } catch (err: any) {
      alert('Erreur: ' + (err?.message || 'Échec de sauvegarde'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Confirmer la suppression définitive du dossier ${lead.id} (${lead.client_name}) ?`)) {
      try {
        await deleteLead(lead.id);
        onUpdate();
        onClose();
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleExportPdf = async () => {
    if (!invoiceRef.current) return;
    try {
      setExportingPdf(true);
      const res = await exportInvoiceToPdf(
        invoiceRef.current,
        lead.id,
        lead.client_name
      );
      if (!res.success) {
        alert('Erreur génération PDF: ' + (res.error || 'Inconnue'));
      }
    } catch (err: any) {
      alert('Erreur PDF: ' + err.message);
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200/70 flex items-center justify-between bg-white sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                {lead.id}
              </span>
              <span className={cn(
                "text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize",
                lead.status === 'confirme' ? "bg-emerald-100 text-emerald-800" :
                lead.status === 'facture' ? "bg-blue-100 text-blue-800" :
                lead.status === 'annule' ? "bg-red-100 text-red-800" :
                "bg-amber-100 text-amber-800"
              )}>
                {lead.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1">{lead.client_name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 active:scale-95 transition-all shadow-sm disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Enregistrer
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar with Quick Communication Templates */}
        <div className="px-6 py-3 bg-gray-50/80 border-b border-gray-200/60 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            {lead.client_phone && (
              <>
                <a 
                  href={`tel:${lead.client_phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-300 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  Appeler
                </a>
                <button 
                  onClick={() => {
                    setQuickMsgChannel('whatsapp');
                    setShowQuickMsg(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 shadow-sm active:scale-95 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp Templates
                </button>
              </>
            )}
            {lead.client_email && (
              <button 
                onClick={() => {
                  setQuickMsgChannel('email');
                  setShowQuickMsg(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-300 shadow-sm active:scale-95 transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-purple-600" />
                Email Modèles
              </button>
            )}
          </div>

          <button 
            onClick={handleDelete}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Supprimer
          </button>
        </div>

        {/* Tab Navigation (3 Tabs: Details, Activity Feed, Swiss Invoice) */}
        <div className="flex items-center px-6 border-b border-gray-200 text-xs font-semibold">
          <button 
            onClick={() => setActiveTab('details')}
            className={cn(
              "py-3 px-3 border-b-2 transition-colors",
              activeTab === 'details' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            Informations & Logistique
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={cn(
              "py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5",
              activeTab === 'activity' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            <History className="w-3.5 h-3.5" />
            Historique & Activité
          </button>
          <button 
            onClick={() => setActiveTab('invoice')}
            className={cn(
              "py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5",
              activeTab === 'invoice' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            Facture Suisse QR
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: DETAILS & LOGISTICS ALLOCATION */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nom du client</label>
                  <input 
                    type="text"
                    value={formData.client_name || ''}
                    onChange={(e) => handleChange('client_name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Statut du dossier</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none capitalize bg-white"
                  >
                    <option value="nouveau">Nouveau</option>
                    <option value="visite">Visite planifiée</option>
                    <option value="en_cours">En cours / Négociation</option>
                    <option value="confirme">Confirmé</option>
                    <option value="facture">Facturé</option>
                    <option value="termine">Terminé</option>
                    <option value="annule">Annulé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Téléphone</label>
                  <input 
                    type="text"
                    value={formData.client_phone || ''}
                    onChange={(e) => handleChange('client_phone', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email</label>
                  <input 
                    type="email"
                    value={formData.client_email || ''}
                    onChange={(e) => handleChange('client_email', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Lieu de départ</label>
                  <input 
                    type="text"
                    value={formData.from_city || ''}
                    onChange={(e) => handleChange('from_city', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Lieu d'arrivée</label>
                  <input 
                    type="text"
                    value={formData.to_city || ''}
                    onChange={(e) => handleChange('to_city', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Date d'intervention</label>
                  <input 
                    type="text"
                    value={formData.move_date || ''}
                    onChange={(e) => handleChange('move_date', e.target.value)}
                    placeholder="ex: 24.03.2026"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Montant Devis (CHF TTC)</label>
                  <input 
                    type="number"
                    value={formData.amount_chf ?? formData.estimated_amount_chf ?? 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      handleChange('amount_chf', val);
                      handleChange('estimated_amount_chf', val);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold tabular-nums focus:border-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* FLEET & TEAM ALLOCATION (Monday.com Resource Assignment) */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Affectation Flotte & Équipe Opérationnelle
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Véhicule Assigné
                    </label>
                    <select
                      value={formData.notes?.includes('Véhicule:') ? formData.notes.split('Véhicule:')[1]?.split('|')[0]?.trim() : 'Iveco Daily 30m³'}
                      onChange={(e) => {
                        const currentNotes = formData.notes || '';
                        const clean = currentNotes.replace(/Véhicule:[^|]*\|?/, '').trim();
                        handleChange('notes', `${clean} | Véhicule: ${e.target.value}`);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:border-gray-900 focus:outline-none bg-white"
                    >
                      <option value="Iveco Daily 30m³ (GE-4921)">Iveco Daily 30m³ (GE-4921)</option>
                      <option value="Renault Master 22m³ (GE-3810)">Renault Master 22m³ (GE-3810)</option>
                      <option value="Mercedes Sprinter 19m³ (VD-8491)">Mercedes Sprinter 19m³ (VD-8491)</option>
                      <option value="Monte-meubles Böcker (GE-9021)">Monte-meubles Böcker (GE-9021)</option>
                      <option value="Non assigné">Non assigné</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Équipe Responsable
                    </label>
                    <select
                      value={formData.notes?.includes('Équipe:') ? formData.notes.split('Équipe:')[1]?.split('|')[0]?.trim() : 'Équipe Alpha'}
                      onChange={(e) => {
                        const currentNotes = formData.notes || '';
                        const clean = currentNotes.replace(/Équipe:[^|]*\|?/, '').trim();
                        handleChange('notes', `${clean} | Équipe: ${e.target.value}`);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:border-gray-900 focus:outline-none bg-white"
                    >
                      <option value="Équipe 1 (Supervision Anderson M.)">Équipe 1 (Supervision Anderson M.)</option>
                      <option value="Équipe 2 (Supervision Josue S.)">Équipe 2 (Supervision Josue S.)</option>
                      <option value="Équipe Partenaire B2B">Équipe Partenaire B2B</option>
                      <option value="À définir">À définir</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Prestation</label>
                <input 
                  type="text"
                  value={formData.service_type || ''}
                  onChange={(e) => handleChange('service_type', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Détails de l'inventaire / Accès</label>
                <textarea 
                  rows={2}
                  value={formData.details || ''}
                  onChange={(e) => handleChange('details', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Consignes Internes & Logistiques</label>
                <textarea 
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY LOG & AUDIT FEED */}
          {activeTab === 'activity' && (
            <ActivityLog lead={formData} />
          )}

          {/* TAB 3: SWISS QR INVOICE */}
          {activeTab === 'invoice' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div>
                  <div className="text-sm font-bold text-blue-900">Facture Officielle Batimove Sàrl</div>
                  <div className="text-xs text-blue-700 mt-0.5">Conforme aux normes suisses QR-Facture & TVA 8.1%</div>
                </div>
                <button 
                  onClick={handleExportPdf}
                  disabled={exportingPdf}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
                >
                  {exportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  Télécharger PDF
                </button>
              </div>

              {/* Rendered Invoice Paper Container */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner bg-gray-50 p-4">
                <div ref={invoiceRef} className="bg-white mx-auto shadow-md">
                  <InvoiceDocument lead={formData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Communication Templates Modal */}
      <QuickMessageModal
        isOpen={showQuickMsg}
        onClose={() => setShowQuickMsg(false)}
        lead={formData}
        defaultChannel={quickMsgChannel}
      />
    </div>
  );
}
