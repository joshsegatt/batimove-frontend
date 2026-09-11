import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  QrCode, 
  FileText, 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  Send, 
  Download, 
  Printer, 
  Check, 
  Sparkles, 
  Building2, 
  Share2, 
  X, 
  Sliders, 
  RefreshCw,
  Wallet,
  Landmark,
  FileSpreadsheet,
  Snowflake,
  TrendingUp,
  Receipt,
  UserCheck,
  ChevronLeft,
  Smartphone,
  Laptop
} from 'lucide-react';
import { 
  LeadItem, 
  saveLead, 
  updateLeadStatus 
} from '../../services/supabaseClient';
import { 
  BATIMOVE_COMPANY_CONFIG, 
  calculateInvoiceFinancials, 
  formatCHF,
  InvoiceDocument
} from '../InvoiceDocument';
import { exportInvoiceToPdf } from '../../utils/pdfExport';
import { UserProfile } from '../../services/adminAuth';

interface FinancialAppViewProps {
  leads: LeadItem[];
  currentUser: UserProfile;
  onRefreshLeads?: () => void;
  onClose?: () => void;
}

type TabType = 'home' | 'cards' | 'quick_send' | 'history' | 'search';

export const FinancialAppView: React.FC<FinancialAppViewProps> = ({
  leads,
  currentUser,
  onRefreshLeads,
  onClose
}) => {
  // Navigation state within the financial app
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'mobile' | 'expanded'>('mobile');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'paid' | 'pending' | 'quote'>('all');

  // Quick Invoicing (Send Money Flow) State
  const [keypadAmount, setKeypadAmount] = useState<string>('1500');
  const [selectedClient, setSelectedClient] = useState<LeadItem | null>(leads[0] || null);
  const [selectedService, setSelectedService] = useState<string>('Déménagement Résidentiel');
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  // Invoice Preview Modal State
  const [previewLead, setPreviewLead] = useState<LeadItem | null>(null);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const invoicePrintRef = useRef<HTMLDivElement>(null);

  // Computed Financial Metrics from Real Leads
  const metrics = useMemo(() => {
    let totalTTC = 0;
    let paidTTC = 0;
    let pendingTTC = 0;

    leads.forEach(l => {
      const amt = Number(l.amount_chf ?? l.estimated_amount_chf ?? 0);
      if (!isNaN(amt) && amt > 0) {
        totalTTC += amt;
        if (l.status === 'facture') {
          paidTTC += amt;
        } else if (l.status === 'confirme' || l.status === 'en_cours' || l.status === 'visite') {
          pendingTTC += amt;
        }
      }
    });

    const financials = calculateInvoiceFinancials(totalTTC);
    const paidFinancials = calculateInvoiceFinancials(paidTTC);
    const pendingFinancials = calculateInvoiceFinancials(pendingTTC);

    return {
      totalTTC,
      paidTTC,
      pendingTTC,
      tva81: financials.tva81,
      totalHT: financials.totalHT,
      paidHT: paidFinancials.totalHT,
      pendingHT: pendingFinancials.totalHT,
      count: leads.length,
      paidCount: leads.filter(l => l.status === 'facture').length
    };
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(item => {
      const matchesSearch = 
        !searchQuery ||
        item.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.client_email && item.client_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.client_phone && item.client_phone.includes(searchQuery)) ||
        (item.id && String(item.id).includes(searchQuery));

      if (!matchesSearch) return false;

      if (selectedFilter === 'paid') return item.status === 'facture';
      if (selectedFilter === 'pending') return item.status === 'confirme' || item.status === 'en_cours';
      if (selectedFilter === 'quote') return item.status === 'nouveau' || item.status === 'visite';
      return true;
    });
  }, [leads, searchQuery, selectedFilter]);

  // Handle Keypad Input
  const handleKeypadPress = (val: string) => {
    if (val === 'backspace') {
      setKeypadAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (val === '.') {
      if (!keypadAmount.includes('.')) {
        setKeypadAmount(prev => prev + '.');
      }
    } else {
      setKeypadAmount(prev => {
        if (prev === '0') return val;
        if (prev.length >= 7) return prev;
        return prev + val;
      });
    }
  };

  // Quick Action to generate/save lead and trigger QR invoice
  const handleCreateFastInvoice = async () => {
    const numAmount = parseFloat(keypadAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Veuillez spécifier un montant valide en Francs Suisses (CHF).');
      return;
    }

    setIsGeneratingInvoice(true);
    try {
      const clientName = selectedClient ? selectedClient.client_name : 'Client Particulier Genève';
      const newLeadData: Partial<LeadItem> = {
        client_name: clientName,
        client_phone: selectedClient?.client_phone || '+41 22 800 00 00',
        client_email: selectedClient?.client_email || 'facturation@client-suisse.ch',
        from_city: selectedClient?.from_city || 'Genève',
        to_city: selectedClient?.to_city || 'Lausanne',
        service_type: selectedService,
        amount_chf: numAmount,
        estimated_amount_chf: numAmount,
        status: 'facture',
        notes: `Facture Express générée via Batimove OS Mobile FinTech - TVA 8.1% incluse.`
      };

      const saved = await saveLead(newLeadData);
      if (saved) {
        setPreviewLead(saved);
        if (onRefreshLeads) onRefreshLeads();
      }
    } catch (e: any) {
      console.error('Erreur génération facture express:', e);
      alert('Erreur lors de la création de la facture: ' + e.message);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  // Export CSV for Fiduciary (Bexio / Winbiz)
  const handleExportCsv = () => {
    const headers = ['Dossier_ID', 'Client', 'Telephone', 'Email', 'Service', 'Date', 'Statut', 'Montant_HT_CHF', 'TVA_8_1_CHF', 'Total_TTC_CHF'];
    const rows = leads.map(l => {
      const ttc = Number(l.amount_chf ?? l.estimated_amount_chf ?? 0);
      const fin = calculateInvoiceFinancials(ttc);
      return [
        `"${l.id}"`,
        `"${l.client_name.replace(/"/g, '""')}"`,
        `"${l.client_phone || ''}"`,
        `"${l.client_email || ''}"`,
        `"${l.service_type || 'Déménagement'}"`,
        `"${new Date(l.created_at || Date.now()).toLocaleDateString('fr-CH')}"`,
        `"${l.status}"`,
        fin.totalHT.toFixed(2),
        fin.tva81.toFixed(2),
        ttc.toFixed(2)
      ].join(';');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Batimove_Journal_Financier_TVA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-[#050B14] min-h-screen text-slate-100 font-sans selection:bg-sky-500 selection:text-white py-4 px-2 sm:px-4">
      
      {/* Top Controller Bar (Device Framing Switch & Close) */}
      <div className="max-w-md mx-auto mb-3 flex items-center justify-between px-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300">Batimove OS • Swiss FinTech Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(prev => prev === 'mobile' ? 'expanded' : 'mobile')}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
            title="Basculer vue mobile / grand écran"
          >
            {viewMode === 'mobile' ? <Laptop className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="text-[11px] hidden sm:inline font-medium">
              {viewMode === 'mobile' ? 'Vue Écran' : 'Vue Mobile'}
            </span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-all cursor-pointer border border-white/10"
              title="Fermer le mode application"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Container / Mobile Phone Shell */}
      <div className={`mx-auto transition-all duration-300 ${
        viewMode === 'mobile'
          ? 'max-w-[420px] rounded-[3rem] border-[6px] border-[#18283E] shadow-[0_25px_80px_rgba(0,10,30,0.85)] bg-[#070F1C] overflow-hidden relative min-h-[850px] pb-24'
          : 'max-w-5xl rounded-3xl border border-sky-500/20 bg-[#070F1C] p-6 shadow-2xl relative pb-12'
      }`}>

        {/* Dynamic Island & iOS Status Bar (Visible in Mobile View) */}
        {viewMode === 'mobile' && (
          <div className="pt-2 px-7 flex items-center justify-between select-none">
            <span className="text-[13px] font-semibold text-white tracking-tight">9:41</span>
            {/* Dynamic Island */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-2 px-2 shadow-inner border border-white/5">
              <span className="w-2 h-2 rounded-full bg-sky-400/80" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white">
              <span className="text-[11px] font-mono font-medium">5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-white/80 p-0.5 flex items-center">
                <div className="h-full w-full bg-white rounded-xs" />
              </div>
            </div>
          </div>
        )}

        {/* App Header */}
        <div className="px-6 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 shadow-md shadow-sky-500/20">
              <div className="w-full h-full rounded-full bg-[#0B1E33] flex items-center justify-center font-bold text-sky-400 text-sm">
                BM
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white leading-none">Batimove Sàrl</h3>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">BCGE • CHE-492.836.215 TVA</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('cards')}
              className="w-9 h-9 rounded-full bg-[#112338] border border-sky-500/20 hover:border-sky-400/50 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Cartes & Rapprochement"
            >
              <CreditCard className="w-4 h-4 text-sky-400" />
            </button>
            <button 
              onClick={onRefreshLeads}
              className="w-9 h-9 rounded-full bg-[#112338] border border-sky-500/20 hover:border-sky-400/50 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Synchroniser"
            >
              <RefreshCw className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            SCREEN 1: HOME / TRÉSORERIE & FEED (Reference Center Screen)
            ========================================================================= */}
        {activeTab === 'home' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="px-5 space-y-5 mt-2"
          >
            {/* HERO SQUIRCLE CARD (Batimove Royal Electric Blue) */}
            <div className="relative rounded-[2.2rem] bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#014275] text-white p-6 shadow-2xl shadow-sky-900/40 border border-sky-300/30 overflow-hidden">
              
              {/* Subtle background glow effect */}
              <div className="absolute -top-16 -right-16 w-44 h-44 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-blue-600/30 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sky-100">
                    Trésorerie & Chiffre d'Affaires
                  </span>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 rounded-full text-sky-200 hover:text-white transition-colors cursor-pointer"
                    title={showBalance ? "Masquer" : "Afficher"}
                  >
                    {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-mono text-sky-100 font-medium">AFC TVA 8.1%</span>
                </div>
              </div>

              {/* Total Balance Display */}
              <div className="mt-3 relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-sky-200">CHF</span>
                  <span className="text-3xl sm:text-4xl font-black tracking-tight font-sans">
                    {showBalance ? formatCHF(metrics.totalTTC) : '••••••••'}
                  </span>
                </div>

                {/* Trend Badge */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/30 border border-white/10 text-emerald-300 text-xs font-bold shadow-inner">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>+24.8%</span>
                  </div>
                  <span className="text-xs text-sky-100/80">
                    {metrics.paidCount} dossiers encaissés
                  </span>
                </div>
              </div>

              {/* 4 Hero Quick Actions (Identical to reference!) */}
              <div className="mt-6 grid grid-cols-4 gap-2 pt-4 border-t border-white/15 relative z-10">
                
                {/* 1. Facturer (Send equivalent) */}
                <button
                  onClick={() => setActiveTab('quick_send')}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white transition-all transform active:scale-95 shadow-md">
                    <ArrowUpRight className="w-5 h-5 text-sky-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <span className="text-[11px] font-semibold text-sky-100">Facturer</span>
                </button>

                {/* 2. Encaisser (Request equivalent) */}
                <button
                  onClick={() => setActiveTab('cards')}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white transition-all transform active:scale-95 shadow-md">
                    <ArrowDownLeft className="w-5 h-5 text-emerald-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                  <span className="text-[11px] font-semibold text-sky-100">Encaisser</span>
                </button>

                {/* 3. QR-Facture (Payment equivalent) */}
                <button
                  onClick={() => {
                    const firstFacture = leads.find(l => l.status === 'facture') || leads[0];
                    if (firstFacture) setPreviewLead(firstFacture);
                  }}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white transition-all transform active:scale-95 shadow-md">
                    <QrCode className="w-5 h-5 text-sky-200" />
                  </div>
                  <span className="text-[11px] font-semibold text-sky-100">QR-Bill</span>
                </button>

                {/* 4. Fiduciaire / Export (Withdraw equivalent) */}
                <button
                  onClick={handleExportCsv}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white transition-all transform active:scale-95 shadow-md">
                    <FileSpreadsheet className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="text-[11px] font-semibold text-sky-100">Bexio CSV</span>
                </button>

              </div>

              {/* Bottom Curved Notch / Pull Pill Indicator */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-12 h-4 bg-[#070F1C] rounded-t-full flex items-center justify-center border-t border-sky-400/20">
                  <ChevronDown className="w-3 h-3 text-sky-400/80 -mt-0.5" />
                </div>
              </div>

            </div>

            {/* PRIORITY CONTACTS / CLIENTS CAROUSEL */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Clients & Dossiers Récents
                </span>
                <button 
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                >
                  Voir tout &gt;
                </button>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {/* Quick Add Client Button */}
                <button 
                  onClick={() => setActiveTab('quick_send')}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-sky-500/40 hover:border-sky-400 flex items-center justify-center text-sky-400 bg-sky-500/10 transition-all group-hover:scale-105">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300">Nouveau</span>
                </button>

                {/* Recent Clients List */}
                {leads.slice(0, 5).map((lead) => {
                  const initials = lead.client_name
                    .split(' ')
                    .map(n => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <button
                      key={lead.id}
                      onClick={() => {
                        setSelectedClient(lead);
                        setActiveTab('quick_send');
                      }}
                      className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#112338] border border-sky-500/30 flex items-center justify-center font-bold text-xs text-white group-hover:border-sky-400 group-hover:scale-105 transition-all shadow-md relative">
                        {initials}
                        {lead.status === 'facture' && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070F1C]" />
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-300 truncate max-w-[64px]">
                        {lead.client_name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TRANSACTIONS / MOVEMENTS FEED */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Transactions en Temps Réel
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Aujourd'hui
                </span>
              </div>

              {/* Transactions List */}
              <div className="space-y-2.5">
                {filteredLeads.slice(0, 6).map((item) => {
                  const amt = Number(item.amount_chf ?? item.estimated_amount_chf ?? 0);
                  const isPaid = item.status === 'facture';
                  const isPending = item.status === 'confirme' || item.status === 'en_cours';

                  return (
                    <div 
                      key={item.id}
                      onClick={() => setPreviewLead(item)}
                      className="p-3.5 rounded-2xl bg-[#0C1829] hover:bg-[#102035] border border-white/5 hover:border-sky-500/30 flex items-center justify-between transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        {/* Squircle Status Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isPaid 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : isPending 
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {isPaid ? (
                            <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-sky-400" />
                          )}
                        </div>

                        {/* Transaction Details */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-white group-hover:text-sky-300 transition-colors">
                              {item.client_name}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-400">
                              #BM-{item.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-[180px] mt-0.5">
                            {item.service_type || 'Déménagement'} • {item.from_city || 'Genève'}
                          </p>
                        </div>
                      </div>

                      {/* Amount & Status */}
                      <div className="text-right">
                        <div className={`text-xs font-black font-mono ${
                          isPaid ? 'text-emerald-400' : 'text-slate-200'
                        }`}>
                          {isPaid ? '+ ' : ''}CHF {formatCHF(amt)}
                        </div>
                        <span className={`inline-block text-[9px] font-semibold uppercase tracking-wider mt-0.5 ${
                          isPaid ? 'text-emerald-400/80' : isPending ? 'text-sky-400/80' : 'text-amber-400/80'
                        }`}>
                          {isPaid ? 'Encaissé' : isPending ? 'Confirmé' : 'Devis'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </motion.div>
        )}

        {/* =========================================================================
            SCREEN 2: BCGE CARDS & BENTO ACTION GRID (Reference Right Screen)
            ========================================================================= */}
        {activeTab === 'cards' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="px-5 space-y-5 mt-2"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveTab('home')}
                className="w-9 h-9 rounded-full bg-[#112338] border border-sky-500/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-sm text-white">Comptes & Cartes BCGE</h3>
              <div className="w-9" />
            </div>

            {/* REALISTIC SWISS BCGE VIRTUAL CORPORATE CARD */}
            <div className="w-full aspect-[1.58/1] rounded-[2rem] bg-gradient-to-tr from-[#081B33] via-[#0E2E56] to-[#0284c7] border border-sky-400/40 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white select-none">
              
              {/* Background Glass Patterns */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-300/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-900/40 rounded-full blur-xl pointer-events-none" />

              {/* Card Top Row */}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="font-black tracking-tight text-lg leading-none text-white">
                    BCGE
                  </div>
                  <span className="text-[10px] text-sky-200 font-medium">
                    Banque Cantonale de Genève
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold tracking-widest text-sky-100 uppercase">
                    VISA CORPORATE
                  </span>
                  <div className="text-[9px] font-mono text-emerald-300">
                    Actif • Rapprochement OK
                  </div>
                </div>
              </div>

              {/* Chip & Contactless Icons */}
              <div className="flex items-center gap-3 relative z-10 my-1">
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 border border-amber-500/40 shadow-inner flex items-center justify-center">
                  <div className="w-6 h-4 border border-amber-600/30 rounded-xs grid grid-cols-2 gap-0.5" />
                </div>
                <div className="text-sky-200/80">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.393 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                </div>
              </div>

              {/* Cardholder & IBAN */}
              <div className="relative z-10">
                <div className="text-[10px] text-sky-200/90 uppercase tracking-wider font-semibold">
                  {BATIMOVE_COMPANY_CONFIG.legalName} • Direction
                </div>
                <div className="text-sm sm:text-base font-mono font-bold tracking-wider text-white mt-0.5">
                  CH93 0076 2011 6238 5290 1
                </div>
                <div className="flex justify-between items-center text-[10px] text-sky-200/80 mt-1 font-mono">
                  <span>Valide : 12/28</span>
                  <span>IDE : {BATIMOVE_COMPANY_CONFIG.ide}</span>
                </div>
              </div>

            </div>

            {/* BENTO QUICK ACTIONS GRID (8 tiles like reference!) */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Actions Rapides de Trésorerie
              </span>

              <div className="grid grid-cols-4 gap-2.5">
                
                {/* 1. Facturer */}
                <button
                  onClick={() => setActiveTab('quick_send')}
                  className="p-3 rounded-2xl bg-[#0C1829] hover:bg-[#112338] border border-white/5 hover:border-sky-500/40 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-center"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300">Devis</span>
                </button>

                {/* 2. Facture Rapide */}
                <button
                  onClick={() => setActiveTab('quick_send')}
                  className="p-3 rounded-2xl bg-[#0C1829] hover:bg-[#112338] border border-white/5 hover:border-sky-500/40 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-center"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300">Facture</span>
                </button>

                {/* 3. Relevé Bancaire */}
                <button
                  onClick={() => {
                    alert('Relevé bancaire BCGE synchronisé via e-banking Camt.053.');
                  }}
                  className="p-3 rounded-2xl bg-[#0C1829] hover:bg-[#112338] border border-white/5 hover:border-sky-500/40 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-center"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300">Relevé</span>
                </button>

                {/* 4. TVA 8.1% */}
                <button
                  onClick={() => {
                    alert(`Déclaration Fiscale AFC :\nTotal HT: CHF ${formatCHF(metrics.totalHT)}\nTVA 8.1%: CHF ${formatCHF(metrics.tva81)}\nTotal TTC: CHF ${formatCHF(metrics.totalTTC)}`);
                  }}
                  className="p-3 rounded-2xl bg-[#0C1829] hover:bg-[#112338] border border-white/5 hover:border-sky-500/40 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-center"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300">TVA 8.1%</span>
                </button>

                {/* 5. Acomptes */}
                <button
                  onClick={() => setSelectedFilter('paid')}
                  className="p-3 rounded-2xl bg-[#0C1829] hover:bg-[#112338] border border-white/5 hover:border-sky-500/40 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-center"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300">Acomptes</span>
                </button>

                {/* 6. Clôture */}
                <button
                  onClick={() => {
                    alert('Clôture mensuelle en cours de réconciliation avec la Fiduciaire.');
                  }}
                  className="p-3 rounded-2xl bg-[#0C1829] hover:bg-[#112338] border border-white/5 hover:border-sky-500/40 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-center"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Snowflake className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300">Clôture</span>
                </button>

                {/* 7. Plafond */}
                <button
                  onClick={() => {
                    alert('Plafond mensuel BCGE : CHF 250\'000.00.');
                  }}
                  className="p-3 rounded-2xl bg-[#0C1829] hover:bg-[#112338] border border-white/5 hover:border-sky-500/40 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-center"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300">Plafond</span>
                </button>

                {/* 8. Export Bexio */}
                <button
                  onClick={handleExportCsv}
                  className="p-3 rounded-2xl bg-[#0C1829] hover:bg-[#112338] border border-white/5 hover:border-sky-500/40 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-center"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300">Bexio</span>
                </button>

              </div>
            </div>

            {/* Account Breakdown Summary Card */}
            <div className="p-4 rounded-2xl bg-[#0C1829] border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Encaissé (TTC)</span>
                <span className="font-mono font-bold text-emerald-400">CHF {formatCHF(metrics.paidTTC)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">En attente d'encaissement</span>
                <span className="font-mono font-bold text-amber-400">CHF {formatCHF(metrics.pendingTTC)}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                <span className="text-slate-400">TVA Déductible / Collectée</span>
                <span className="font-mono font-bold text-sky-400">CHF {formatCHF(metrics.tva81)}</span>
              </div>
            </div>

          </motion.div>
        )}

        {/* =========================================================================
            SCREEN 3: QUICK INVOICING / SEND FLOW (Reference Left Screen)
            ========================================================================= */}
        {activeTab === 'quick_send' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="px-5 space-y-4 mt-2"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveTab('home')}
                className="w-9 h-9 rounded-full bg-[#112338] border border-sky-500/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-sm text-white">Facturation Express (CHF)</h3>
              <div className="w-9" />
            </div>

            {/* Source Account Pill (BCGE) */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#0284c7]/30 to-[#0B1E33] border border-sky-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xs">
                  BC
                </div>
                <div>
                  <span className="text-[10px] text-sky-300 uppercase font-semibold block">Créditer sur</span>
                  <span className="text-xs font-bold text-white">BCGE Compte Pro (CHF)</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-sky-200">
                CHF {formatCHF(metrics.totalTTC)}
              </span>
            </div>

            {/* Large Amount Display */}
            <div className="py-2 text-center">
              <span className="text-xs text-slate-400 block mb-1 font-semibold uppercase tracking-wider">
                Montant de la Facture
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-sky-400">CHF</span>
                <span className="text-4xl font-black text-white font-sans tracking-tight">
                  {keypadAmount}
                </span>
                <span className="w-0.5 h-8 bg-sky-400 animate-pulse" />
              </div>
              
              {/* Quick Preset Buttons */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {['500', '1500', '2800', '4500'].map(val => (
                  <button
                    key={val}
                    onClick={() => setKeypadAmount(val)}
                    className="px-2.5 py-1 rounded-full bg-[#112338] hover:bg-sky-500/20 text-xs font-mono text-sky-300 border border-sky-500/20 cursor-pointer transition-all"
                  >
                    CHF {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Selector */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Destinataire / Client
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {leads.slice(0, 4).map(l => {
                  const isSel = selectedClient?.id === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setSelectedClient(l)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 cursor-pointer transition-all flex items-center gap-2 ${
                        isSel 
                          ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20' 
                          : 'bg-[#0C1829] text-slate-300 border-white/10 hover:border-sky-500/40'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{l.client_name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NUMERIC TOUCH KEYPAD (Identical to reference!) */}
            <div className="grid grid-cols-3 gap-2 pt-1 max-w-[280px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  className="h-11 rounded-2xl bg-[#0C1829] hover:bg-[#13253F] active:bg-sky-500/20 border border-white/5 hover:border-sky-500/30 text-white font-bold text-base flex items-center justify-center transition-all cursor-pointer select-none"
                >
                  {key === 'backspace' ? (
                    <X className="w-4 h-4 text-slate-400" />
                  ) : (
                    key
                  )}
                </button>
              ))}
            </div>

            {/* Curved Action Button: Generate Swiss QR-Bill */}
            <div className="pt-2">
              <button
                onClick={handleCreateFastInvoice}
                disabled={isGeneratingInvoice}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-[#0284c7] hover:from-sky-400 hover:to-sky-600 active:scale-98 text-white font-bold text-sm shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingInvoice ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Génération de la Facture Suisse...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    <span>Générer la Facture Suisse QR-Bill</span>
                  </>
                )}
              </button>
            </div>

          </motion.div>
        )}

        {/* =========================================================================
            SCREEN 4: FULL HISTORY / FIDUCIARY VIEW
            ========================================================================= */}
        {activeTab === 'history' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="px-5 space-y-4 mt-2"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveTab('home')}
                className="w-9 h-9 rounded-full bg-[#112338] border border-sky-500/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-sm text-white">Grand Livre & Dossiers</h3>
              <button
                onClick={handleExportCsv}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 cursor-pointer"
              >
                Export CSV
              </button>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'paid', label: 'Encaissés' },
                { id: 'pending', label: 'En Attente' },
                { id: 'quote', label: 'Devis' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-all ${
                    selectedFilter === f.id
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-[#0C1829] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Full List */}
            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {filteredLeads.map(lead => {
                const amt = Number(lead.amount_chf ?? lead.estimated_amount_chf ?? 0);
                const isPaid = lead.status === 'facture';

                return (
                  <div
                    key={lead.id}
                    onClick={() => setPreviewLead(lead)}
                    className="p-3 rounded-2xl bg-[#0C1829] hover:bg-[#112338] border border-white/5 flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{lead.client_name}</span>
                        <span className="text-[10px] font-mono text-slate-400">#BM-{lead.id}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {lead.service_type || 'Déménagement'} • {new Date(lead.created_at || Date.now()).toLocaleDateString('fr-CH')}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-white">
                        CHF {formatCHF(amt)}
                      </div>
                      <span className={`text-[9px] font-semibold uppercase ${
                        isPaid ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            SCREEN 5: GLOBAL SEARCH
            ========================================================================= */}
        {activeTab === 'search' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-5 space-y-4 mt-2"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveTab('home')}
                className="w-9 h-9 rounded-full bg-[#112338] border border-sky-500/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-sm text-white">Recherche Universelle</h3>
              <div className="w-9" />
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone, email ou dossier..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0C1829] border border-sky-500/30 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-all font-sans"
              />
            </div>

            <div className="space-y-2">
              {filteredLeads.map(item => (
                <div
                  key={item.id}
                  onClick={() => setPreviewLead(item)}
                  className="p-3 rounded-xl bg-[#0C1829] hover:bg-[#112338] border border-white/5 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h4 className="font-bold text-xs text-white">{item.client_name}</h4>
                    <p className="text-[10px] text-slate-400">{item.client_phone || item.client_email || 'Genève'}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-300">
                    CHF {formatCHF(item.amount_chf ?? item.estimated_amount_chf ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            FLOATING CURVED BOTTOM NAVIGATION DOCK (Signature element from reference!)
            ========================================================================= */}
        <div className="absolute bottom-4 left-0 right-0 px-6 pointer-events-none z-30">
          <div className="max-w-[340px] mx-auto rounded-full bg-[#081524]/90 backdrop-blur-xl border border-sky-400/30 p-2 shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center justify-around pointer-events-auto">
            
            {/* 1. Home */}
            <button
              onClick={() => setActiveTab('home')}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'home' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Accueil"
            >
              <Building2 className="w-5 h-5" />
            </button>

            {/* 2. Cards */}
            <button
              onClick={() => setActiveTab('cards')}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'cards' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Comptes BCGE"
            >
              <CreditCard className="w-5 h-5" />
            </button>

            {/* 3. CENTER HERO ELEVATED GLOWING BUTTON (Instant Action / QR Scanner) */}
            <button
              onClick={() => setActiveTab('quick_send')}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/40 border-2 border-[#070F1C] -mt-5 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              title="Facturation Rapide"
            >
              <QrCode className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            </button>

            {/* 4. History */}
            <button
              onClick={() => setActiveTab('history')}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'history' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Historique & TVA"
            >
              <FileText className="w-5 h-5" />
            </button>

            {/* 5. Search */}
            <button
              onClick={() => setActiveTab('search')}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'search' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Recherche"
            >
              <Search className="w-5 h-5" />
            </button>

          </div>
        </div>

      </div>

      {/* =========================================================================
          SWISS QR-BILL & A4 PDF INVOICE PREVIEW MODAL
          ========================================================================= */}
      {previewLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0B1E33] border border-sky-500/30 rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl p-4 sm:p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-white text-base">
                  Facture Officielle Batimove Sàrl & QR-Bill Suisse
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    if (!invoicePrintRef.current) return;
                    setIsPdfExporting(true);
                    try {
                      await exportInvoiceToPdf(invoicePrintRef.current, previewLead.id, previewLead.client_name);
                    } finally {
                      setIsPdfExporting(false);
                    }
                  }}
                  disabled={isPdfExporting}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isPdfExporting ? 'Export...' : 'Télécharger PDF A4'}</span>
                </button>
                <button
                  onClick={() => setPreviewLead(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Render (A4 Swiss Document) */}
            <div className="overflow-x-auto bg-slate-900/50 p-2 rounded-2xl flex justify-center">
              <div ref={invoicePrintRef} className="w-full max-w-[800px]">
                <InvoiceDocument
                  lead={previewLead}
                  isPrintPreview={false}
                />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
