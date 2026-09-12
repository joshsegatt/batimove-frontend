import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, Receipt, FileCheck, AlertCircle, Clock } from 'lucide-react';
import { LeadItem } from '../../../../services/supabaseClient';
import { cn } from '../../core/utils/cn';

interface FinanceCockpitProps {
  leads: LeadItem[];
  loading: boolean;
  activeFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
}

export function FinanceCockpit({ leads, loading, activeFilter, onFilterChange }: FinanceCockpitProps) {
  // 1. Confirmed / Invoiced Revenue (CA Réalisé)
  const confirmedLeads = leads.filter(l => l.status === 'confirme' || l.status === 'facture' || l.status === 'termine');
  const totalRevenue = confirmedLeads.reduce((acc, lead) => {
    const val = lead.amount_chf || lead.estimated_amount_chf || 0;
    return acc + Number(val);
  }, 0);

  // 2. TVA 8.1% (Swiss Standard VAT)
  const tvaAmount = totalRevenue * (8.1 / 108.1);
  const revenueHT = totalRevenue - tvaAmount;

  // 3. Pipeline in Negotiation / Pending (Devis en Attente)
  const pendingLeads = leads.filter(l => l.status === 'nouveau' || l.status === 'visite' || l.status === 'en_cours');
  const pipelineValue = pendingLeads.reduce((acc, lead) => {
    const val = lead.amount_chf || lead.estimated_amount_chf || 0;
    return acc + Number(val);
  }, 0);

  // 4. Invoiced / Pending Payment
  const invoicedLeads = leads.filter(l => l.status === 'facture');
  const invoicedValue = invoicedLeads.reduce((acc, lead) => {
    const val = lead.amount_chf || lead.estimated_amount_chf || 0;
    return acc + Number(val);
  }, 0);

  const formatCHF = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        <div className="md:col-span-2 h-44 rounded-3xl bg-gray-200/60" />
        <div className="h-44 rounded-3xl bg-gray-200/60" />
        <div className="h-44 rounded-3xl bg-gray-200/60" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Active Drill-Down Banner */}
      {activeFilter && (
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-900 text-xs font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Filtre actif : <strong>{activeFilter}</strong> ({leads.length} dossiers affichés)</span>
          </div>
          <button 
            onClick={() => onFilterChange?.(null)}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline ml-4"
          >
            Réinitialiser
          </button>
        </div>
      )}

      {/* Main Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Chiffre d'Affaires Confirmé (Drill-down: confirme) */}
        <motion.div 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onFilterChange?.(activeFilter === 'confirme' ? null : 'confirme')}
          className={cn(
            "p-5 rounded-2xl bg-white border transition-all cursor-pointer relative overflow-hidden group shadow-sm",
            activeFilter === 'confirme' 
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10" 
              : "border-gray-200/80 hover:border-gray-300"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              {confirmedLeads.length} missions
            </span>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            CA Confirmé (TTC)
          </div>
          <div className="text-2xl font-bold tracking-tight text-gray-900 tabular-nums">
            {formatCHF(totalRevenue)}
          </div>
          <div className="mt-2 text-[11px] text-gray-400 font-medium flex items-center justify-between">
            <span>TVA 8.1% : {formatCHF(tvaAmount)}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
          </div>
        </motion.div>

        {/* Card 2: Devis en Négociation / Pipeline (Drill-down: en_attente) */}
        <motion.div 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onFilterChange?.(activeFilter === 'en_attente' ? null : 'en_attente')}
          className={cn(
            "p-5 rounded-2xl bg-white border transition-all cursor-pointer relative overflow-hidden group shadow-sm",
            activeFilter === 'en_attente' 
              ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/10" 
              : "border-gray-200/80 hover:border-gray-300"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
              {pendingLeads.length} en cours
            </span>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Pipeline Devis
          </div>
          <div className="text-2xl font-bold tracking-tight text-gray-900 tabular-nums">
            {formatCHF(pipelineValue)}
          </div>
          <div className="mt-2 text-[11px] text-gray-400 font-medium flex items-center justify-between">
            <span>Potentiel à convertir</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 transition-colors" />
          </div>
        </motion.div>

        {/* Card 3: Facturé en attente d'encaissement (Drill-down: facture) */}
        <motion.div 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onFilterChange?.(activeFilter === 'facture' ? null : 'facture')}
          className={cn(
            "p-5 rounded-2xl bg-white border transition-all cursor-pointer relative overflow-hidden group shadow-sm",
            activeFilter === 'facture' 
              ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10" 
              : "border-gray-200/80 hover:border-gray-300"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
              {invoicedLeads.length} factures
            </span>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Facturé en attente
          </div>
          <div className="text-2xl font-bold tracking-tight text-gray-900 tabular-nums">
            {formatCHF(invoicedValue)}
          </div>
          <div className="mt-2 text-[11px] text-gray-400 font-medium flex items-center justify-between">
            <span>En attente de paiement</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-amber-600 transition-colors" />
          </div>
        </motion.div>

        {/* Card 4: Taux de Conversion & Total Dossiers */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-gray-900 text-white shadow-sm flex flex-col justify-between relative overflow-hidden group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                {leads.length > 0 ? Math.round((confirmedLeads.length / leads.length) * 100) : 0}% Conversion
              </span>
            </div>

            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Total Dossiers
            </div>
            <div className="text-2xl font-bold tracking-tight text-white tabular-nums">
              {leads.length}
            </div>
          </div>

          <div className="mt-2 text-[11px] text-gray-400 font-medium">
            Moyenne : {leads.length > 0 ? formatCHF(totalRevenue / (confirmedLeads.length || 1)) : 'CHF 0.00'} / mission
          </div>
        </motion.div>

      </div>
    </div>
  );
}
