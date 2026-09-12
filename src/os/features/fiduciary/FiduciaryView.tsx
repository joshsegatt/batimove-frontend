import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, FileSpreadsheet, Download, CheckCircle2, TrendingUp, Receipt, ShieldCheck } from 'lucide-react';
import { LeadItem } from '../../../../services/supabaseClient';
import { cn } from '../../core/utils/cn';

interface FiduciaryViewProps {
  leads: LeadItem[];
  onSelectLead: (lead: LeadItem) => void;
}

export function FiduciaryView({ leads, onSelectLead }: FiduciaryViewProps) {
  const [selectedQuarter, setSelectedQuarter] = useState<'T1' | 'T2' | 'T3' | 'T4' | 'ALL'>('ALL');

  // Filter confirmed, facturé, or terminé
  const billableLeads = leads.filter(l => l.status === 'confirme' || l.status === 'facture' || l.status === 'termine');

  const totalTTC = billableLeads.reduce((sum, l) => sum + (l.amount_chf || l.estimated_amount_chf || 0), 0);
  const totalTVA = totalTTC * (8.1 / 108.1);
  const totalHT = totalTTC - totalTVA;

  const formatCHF = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Client', 'Type', 'Prestation', 'Montant HT (CHF)', 'TVA 8.1% (CHF)', 'Total TTC (CHF)', 'Statut'];
    const rows = billableLeads.map(l => {
      const ttc = l.amount_chf || l.estimated_amount_chf || 0;
      const tva = ttc * (8.1 / 108.1);
      const ht = ttc - tva;
      return [
        l.id,
        l.move_date || l.created_at?.slice(0, 10) || '',
        `"${l.client_name}"`,
        `"${l.service_type}"`,
        ht.toFixed(2),
        tva.toFixed(2),
        ttc.toFixed(2),
        l.status
      ].join(';');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BATIMOVE_Extrait_Fiduciaire_TVA_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Swiss Fiduciary Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">
              Conformité Fiscale Suisse — AFC / Cantons
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Extrait Fiduciaire & Déclaration TVA</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            TVA suisse en vigueur (8.1%). Batimove Sàrl — IDE: CHE-492.836.215 TVA. Export direct pour votre expert-comptable ou fiduciaire.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-gray-900 text-xs font-bold hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
        >
          <Download className="w-4 h-4 text-gray-900" />
          Exporter CSV Comptable
        </button>
      </div>

      {/* Summary Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Chiffre d'Affaires HT</span>
          <div className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{formatCHF(totalHT)}</div>
          <span className="text-[11px] text-gray-400 mt-1 block">Base d'imposition nette</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">TVA Suisse Collectée (8.1%)</span>
          <div className="text-2xl font-bold text-blue-600 mt-1 tabular-nums">{formatCHF(totalTVA)}</div>
          <span className="text-[11px] text-gray-400 mt-1 block">À reverser à l'Administration Fiscale</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Encaissé (TTC)</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">{formatCHF(totalTTC)}</div>
          <span className="text-[11px] text-gray-400 mt-1 block">{billableLeads.length} dossiers facturés ou confirmés</span>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h4 className="font-bold text-sm text-gray-900">Journal des Factures & Dossiers Éligibles</h4>
          <span className="text-xs text-gray-400">{billableLeads.length} écritures</span>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-[100px_1.5fr_1fr_1fr_1fr_100px] gap-4 p-3.5 bg-gray-50/70 text-[11px] font-bold text-gray-400 uppercase">
            <div>Réf / ID</div>
            <div>Client</div>
            <div>Montant HT</div>
            <div>TVA (8.1%)</div>
            <div>Total TTC</div>
            <div className="text-right">Statut</div>
          </div>

          {billableLeads.map(lead => {
            const ttc = lead.amount_chf || lead.estimated_amount_chf || 0;
            const tva = ttc * (8.1 / 108.1);
            const ht = ttc - tva;

            return (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="grid grid-cols-[100px_1.5fr_1fr_1fr_1fr_100px] gap-4 p-3.5 items-center hover:bg-gray-50 transition-colors cursor-pointer text-xs"
              >
                <span className="font-mono font-bold text-gray-700">{lead.id}</span>
                <span className="font-semibold text-gray-900 truncate">{lead.client_name}</span>
                <span className="text-gray-600 tabular-nums">{formatCHF(ht)}</span>
                <span className="text-blue-600 font-medium tabular-nums">{formatCHF(tva)}</span>
                <span className="font-bold text-gray-900 tabular-nums">{formatCHF(ttc)}</span>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                    {lead.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
