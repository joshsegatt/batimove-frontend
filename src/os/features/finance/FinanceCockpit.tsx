import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Wallet, Receipt, CreditCard, Activity } from 'lucide-react';
import { LeadItem } from '../../../../../services/supabaseClient';

export function FinanceCockpit({ leads, loading }: { leads: LeadItem[], loading: boolean }) {
  // Financial calculations
  const totalLeads = leads.length;
  
  // Fake safe sum: only parse valid volumes
  const totalVolume = leads.reduce((acc, lead) => {
    if (lead.status === 'Won' || lead.status === 'Completed') {
      const vol = parseFloat(lead.volume?.replace(/[^0-9.]/g, '') || '0');
      return acc + (isNaN(vol) ? 0 : vol);
    }
    return acc;
  }, 0);
  
  // Pending
  const pendingLeads = leads.filter(l => l.status === 'New' || l.status === 'Negotiation');
  const pendingCount = pendingLeads.length;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        <div className="md:col-span-2 h-64 rounded-3xl bg-gray-100 p-6" />
        <div className="h-64 rounded-3xl bg-gray-100 p-6" />
      </div>
    );
  }

  // EMPTY STATE
  if (totalLeads === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white border border-gray-200/50 shadow-sm mt-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Wallet className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun Devis</h3>
        <p className="text-gray-500 max-w-sm font-medium mb-6">Commencez par ajouter votre premier client pour voir vos statistiques financières ici.</p>
        <button className="h-10 px-6 rounded-xl bg-gray-900 text-white font-medium shadow-lg shadow-gray-900/20 active:scale-95 transition-transform">
          Créer un Devis
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-2">
      {/* Bento Grid Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Main Revenue Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 h-64 rounded-[32px] bg-white border border-gray-200/60 shadow-sm p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
             <ArrowRight className="w-6 h-6 text-gray-300" />
          </div>

          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
             </div>
             <span className="font-semibold text-gray-500 text-sm tracking-wide uppercase">Chiffre d'Affaires</span>
          </div>

          <div>
             <div className="text-[40px] sm:text-[56px] font-semibold tracking-tighter text-gray-900 leading-none tabular-nums">
               CHF {totalVolume.toLocaleString('fr-CH', { minimumFractionDigits: 2 })}
             </div>
             <div className="text-emerald-600 font-medium mt-2 flex items-center gap-1 text-sm">
                +12.5% <span className="text-gray-400 font-normal">depuis le mois dernier</span>
             </div>
          </div>
        </motion.div>
        
        {/* Pending Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-64 rounded-[32px] bg-gray-900 text-white shadow-xl shadow-gray-900/10 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
             <ArrowRight className="w-6 h-6 text-gray-500" />
          </div>

          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                <Receipt className="w-5 h-5" />
             </div>
             <span className="font-medium text-gray-400 text-sm tracking-wide">Devis en attente</span>
          </div>

          <div>
             <div className="text-[48px] sm:text-[56px] font-semibold tracking-tighter text-white leading-none tabular-nums">
               {pendingCount}
             </div>
             <div className="text-gray-400 font-medium mt-2 text-sm">
                A relancer d'urgence
             </div>
          </div>
        </motion.div>
      </div>

      {/* Bento Grid Bottom Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="h-40 rounded-[24px] bg-white border border-gray-200/60 p-5 flex flex-col justify-between hover:border-gray-300 transition-colors cursor-pointer">
           <CreditCard className="w-6 h-6 text-gray-400" />
           <div>
             <div className="text-2xl font-semibold tracking-tight text-gray-900 tabular-nums">0</div>
             <div className="text-xs font-medium text-gray-500 mt-0.5">Factures Impayées</div>
           </div>
        </div>

        <div className="h-40 rounded-[24px] bg-white border border-gray-200/60 p-5 flex flex-col justify-between hover:border-gray-300 transition-colors cursor-pointer">
           <Activity className="w-6 h-6 text-gray-400" />
           <div>
             <div className="text-2xl font-semibold tracking-tight text-gray-900 tabular-nums">{totalLeads}</div>
             <div className="text-xs font-medium text-gray-500 mt-0.5">Missions Totales</div>
           </div>
        </div>

      </div>
    </div>
  );
}
