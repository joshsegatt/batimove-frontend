import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MessageSquare, Mail, Copy, Check, ExternalLink, Send } from 'lucide-react';
import { LeadItem } from '../../../../services/supabaseClient';

interface QuickMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadItem;
  defaultChannel?: 'whatsapp' | 'email';
}

interface TemplateOption {
  id: string;
  title: string;
  badge: string;
  generateText: (lead: LeadItem) => string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'quote',
    title: 'Proposition de Devis Officiel',
    badge: 'Commercial',
    generateText: (l) => 
      `Bonjour ${l.client_name},\n\nL'équipe Batimove a le plaisir de vous transmettre votre proposition pour votre déménagement (${l.from_city || 'Genève'} ➔ ${l.to_city || 'Suisse'}).\n\nMontant estimé : CHF ${l.amount_chf || l.estimated_amount_chf || 0}.- TTC.\n\nRestant à votre entière disposition pour convenir de la date définitive.\n\nCordialement,\nBatimove Sàrl — +41 22 800 00 00`
  },
  {
    id: 'visit',
    title: 'Confirmation de Date & Visite Technique',
    badge: 'Logistique',
    generateText: (l) => 
      `Bonjour ${l.client_name},\n\nNous vous confirmons notre intervention technique pour le dossier ${l.id}, prévue pour le ${l.move_date || 'prochainement'}.\n\nNotre équipe logistique vous contactera 30 minutes avant l'arrivée.\n\nBatimove Sàrl Logistique`
  },
  {
    id: 'invoice',
    title: 'Transmission Facture & QR-IBAN BCGE',
    badge: 'Fiduciaire',
    generateText: (l) => 
      `Bonjour ${l.client_name},\n\nVeuillez trouver la référence de votre facture Batimove Sàrl (${l.id}) pour un montant de CHF ${l.amount_chf || l.estimated_amount_chf || 0}.- TTC.\n\nRèglement par virement bancaire QR-IBAN (Banque Cantonale de Genève) :\nIBAN : CH93 0076 2011 6238 5290 1\nBIC : BCGECHGGXXX\n\nMerci pour votre confiance !`
  },
  {
    id: 'review',
    title: "Demande d'Avis Client (Google Review)",
    badge: 'Qualité',
    generateText: (l) => 
      `Bonjour ${l.client_name},\n\nToute l'équipe Batimove espère que votre emménagement s'est parfaitement déroulé ! Pourriez-vous partager votre expérience en laissant un avis sur notre profil officiel Google ?\n\nLien : https://g.page/r/batimove-geneve/review\n\nUn immense merci pour votre soutien !`
  }
];

export function QuickMessageModal({ isOpen, onClose, lead, defaultChannel = 'whatsapp' }: QuickMessageModalProps) {
  if (!isOpen) return null;

  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);

  const activeTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];
  const messageBody = activeTemplate.generateText(lead);

  const cleanPhone = (lead.client_phone || '').replace(/[^0-9]/g, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(messageBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageBody)}`;
    window.open(url, '_blank');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Batimove Sàrl — Dossier ${lead.id} (${lead.client_name})`);
    const body = encodeURIComponent(messageBody);
    window.location.href = `mailto:${lead.client_email || ''}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Communication Rapide — {lead.client_name}</h3>
              <p className="text-[11px] text-gray-400">Templates suisses prêts à l'envoi pour WhatsApp & Email</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Template Selector Pills */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Choisir un Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TEMPLATES.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    selectedTemplateId === tmpl.id
                      ? 'border-gray-900 bg-gray-50/80 shadow-sm ring-1 ring-gray-900'
                      : 'border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-gray-600 border border-gray-100">
                      {tmpl.badge}
                    </span>
                    {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-gray-900" />}
                  </div>
                  <span className="text-xs font-bold text-gray-900">{tmpl.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Textbox */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Message Pré-rempli (Modifiable)
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-900"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <textarea
              rows={7}
              readOnly
              value={messageBody}
              className="w-full p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-800 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
          <span className="text-[11px] text-gray-400">
            Destinataire : <strong className="text-gray-700">{lead.client_phone || 'Sans tél'}</strong>
          </span>

          <div className="flex items-center gap-2">
            {lead.client_phone && (
              <button
                onClick={handleSendWhatsApp}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-600/20"
              >
                <MessageSquare className="w-4 h-4" />
                Ouvrir WhatsApp
              </button>
            )}

            {lead.client_email && (
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 active:scale-95 transition-all shadow-md"
              >
                <Mail className="w-4 h-4" />
                Envoyer Email
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
