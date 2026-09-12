import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, Receipt, FileCheck, AlertCircle, Clock, Calendar } from 'lucide-react';
import { LeadItem } from '../../../../services/supabaseClient';
import { BatteryProgress } from '../../core/components/BatteryProgress';
import { cn } from '../../core/utils/cn';

interface FinanceCockpitProps {
  leads: LeadItem[];
  loading: boolean;
  activeFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
}

type AccountingPeriod = 'month' | 'q1' | 'year' | 'all';

export function FinanceCockpit({ leads, loading, activeFilter, onFilterChange }: FinanceCockpitProps) {
  const [period, setPeriod] = useState<AccountingPeriod>('all');

  // Filter leads based on selected accounting period
  const periodLeads = useMemo(() => {
    if (period === 'all') return leads;
    
    return leads.filter(l => {
      const dateStr = l.move_date || l.created_at || '';
      if (period === 'month') {
        return dateStr.includes('03.2026') || dateStr.includes('2026-03');
      }
      if (period === 'q1') {
        return dateStr.includes('01.2026') || dateStr.includes('02.2026') || dateStr.includes('03.2026') ||
               dateStr.includes('2026-01') || dateStr.includes('2026-02') || dateStr.includes('2026-03');
      }
      if (period === 'year') {
        return dateStr.includes('2026');
      }
      return true;
    });
  }, [leads, period]);

  // 1. Confirmed / Invoiced Revenue (CA Réalisé)
  const confirmedLeads = periodLeads.filter(l => l.status === 'confirme' || l.status === 'facture' || l.status === 'termine');
  const totalRevenue = confirmedLeads.reduce((acc, lead) => {
    const val = lead.amount_chf || lead.estimated_amount_chf || 0;
    return acc + Number(val);
  }, 0);

  // 2. TVA 8.1% (Swiss Standard VAT)
  const tvaAmount = totalRevenue * (8.1 / 108.1);
  const revenueHT = totalRevenue - tvaAmount;

  // 3. Pipeline in Negotiation / Pending (Devis en Attente)
  const pendingLeads = periodLeads.filter(l => l.status === 'nouveau' || l.status === 'visite' || l.status === 'en_cours');
  const pipelineValue = pendingLeads.reduce((acc, lead) => {
    const val = lead.amount_chf || lead.estimated_amount_chf || 0;
    return acc + Number(val);
  }, 0);

  // 4. Invoiced / Pending Payment
  const invoicedLeads = periodLeads.filter(l => l.status === 'facture');
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
        <div className="md:col-span-2 h-44 rounded-3xl bg-slate-200/60" />
        <div className="h-44 rounded-3xl bg-slate-200/60" />
        <div className="h-44 rounded-3xl bg-slate-200/60" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* Control Bar: Accounting Period Selector */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pl-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="uppercase tracking-wider text-[10px]">Période Fiscale</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setPeriod('month')}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
              period === 'month' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            Mois en cours
          </button>
          <button
            onClick={() => setPeriod('q1')}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
              period === 'q1' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            Trimestre Q1
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
              period === 'year' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            Exercice 2026
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
              period === 'all' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            Tout
          </button>
        </div>
      </div>

      {/* Active Drill-Down Banner */}
      {activeFilter && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-blue-50/80 border border-blue-200/70 text-blue-900 text-xs font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Filtre actif : <strong>{activeFilter}</strong> ({periodLeads.length} dossiers affichés)</span>
          </div>
          <button 
            onClick={() => onFilterChange?.(null)}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline ml-4"
          >
            Réinitialiser
          </button>
        </div>
      )}

      {/* Monday.com Work OS Signature: Pipeline Distribution Battery */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Distribution du Pipeline (Monday.com Battery)</span>
          </div>
          <span className="text-slate-500 font-mono text-[11px] font-semibold">{periodLeads.length} dossiers au total</span>
        </div>
        <BatteryProgress leads={periodLeads} size="md" showLegend={true} />
      </div>

      {/* Main Bento Cards Grid with Luxury Micro-Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Chiffre d'Affaires Confirmé (Drill-down: confirme) */}
        <motion.div 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onFilterChange?.(activeFilter === 'confirme' ? null : 'confirme')}
          className={cn(
            "p-5 rounded-2xl bg-white border transition-all cursor-pointer relative overflow-hidden group shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_-6px_rgba(0,0,0,0.07)]",
            activeFilter === 'confirme' 
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20" 
              : "border-slate-200/80 hover:border-slate-300"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
              {confirmedLeads.length} missions
            </span>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            CA Confirmé (TTC)
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {formatCHF(totalRevenue)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>TVA 8.1% : {formatCHF(tvaAmount)}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
          </div>
        </motion.div>

        {/* Card 2: Devis en Négociation / Pipeline (Drill-down: en_attente) */}
        <motion.div 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onFilterChange?.(activeFilter === 'en_attente' ? null : 'en_attente')}
          className={cn(
            "p-5 rounded-2xl bg-white border transition-all cursor-pointer relative overflow-hidden group shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_-6px_rgba(0,0,0,0.07)]",
            activeFilter === 'en_attente' 
              ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20" 
              : "border-slate-200/80 hover:border-slate-300"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full">
              {pendingLeads.length} en cours
            </span>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Pipeline Devis
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {formatCHF(pipelineValue)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Potentiel à convertir</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
        </motion.div>

        {/* Card 3: Facturé en attente d'encaissement (Drill-down: facture) */}
        <motion.div 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onFilterChange?.(activeFilter === 'facture' ? null : 'facture')}
          className={cn(
            "p-5 rounded-2xl bg-white border transition-all cursor-pointer relative overflow-hidden group shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_-6px_rgba(0,0,0,0.07)]",
            activeFilter === 'facture' 
              ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20" 
              : "border-slate-200/80 hover:border-slate-300"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
              {invoicedLeads.length} factures
            </span>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Facturé en attente
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {formatCHF(invoicedValue)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>En attente de virement</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors" />
          </div>
        </motion.div>

        {/* Card 4: Taux de Conversion & Total Dossiers */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-slate-900 text-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.25)] flex flex-col justify-between relative overflow-hidden group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {periodLeads.length > 0 ? Math.round((confirmedLeads.length / periodLeads.length) * 100) : 0}% Conversion
              </span>
            </div>

            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Dossiers ({period === 'all' ? 'Total' : period.toUpperCase()})
            </div>
            <div className="text-2xl font-bold tracking-tight text-white tabular-nums">
              {periodLeads.length}
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 font-medium">
            Moyenne : {periodLeads.length > 0 ? formatCHF(totalRevenue / (confirmedLeads.length || 1)) : 'CHF 0.00'} / mission
          </div>
        </motion.div>

      </div>
    </div>
  );
}
