import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, FileSpreadsheet, Download, CheckCircle2, TrendingUp, 
  TrendingDown, Receipt, ShieldCheck, Plus, Trash2, X, Wallet, 
  ArrowUpRight, ArrowDownRight, Tag
} from 'lucide-react';
import { 
  LeadItem, 
  FinancialRecord, 
  saveFinancialRecord, 
  deleteFinancialRecord 
} from '../../../../services/supabaseClient';
import { useToast } from '../../core/components/ToastContext';
import { cn } from '../../core/utils/cn';

interface FiduciaryViewProps {
  leads: LeadItem[];
  financialRecords: FinancialRecord[];
  onSelectLead: (lead: LeadItem) => void;
  onReload: () => void;
}

export function FiduciaryView({ leads, financialRecords, onSelectLead, onReload }: FiduciaryViewProps) {
  const [activeTab, setActiveTab] = useState<'tva' | 'ledger'>('tva');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Record Form
  const [recordType, setRecordType] = useState<'revenu' | 'depense'>('depense');
  const [description, setDescription] = useState('');
  const [amountChf, setAmountChf] = useState<number>(250);
  const [category, setCategory] = useState('carburant');
  const [supplier, setSupplier] = useState('');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [tvaRate, setTvaRate] = useState<number>(8.1);

  // 1. Calculations from billable leads (Confirmed & Invoiced)
  const billableLeads = leads.filter(l => l.status === 'confirme' || l.status === 'facture' || l.status === 'termine');
  const totalRevenueTTC = billableLeads.reduce((sum, l) => sum + (l.amount_chf || l.estimated_amount_chf || 0), 0);
  const totalTVACollectee = totalRevenueTTC * (8.1 / 108.1);
  const totalRevenueHT = totalRevenueTTC - totalTVACollectee;

  // 2. Calculations from expense records
  const totalDepenses = financialRecords
    .filter(r => r.type === 'depense')
    .reduce((sum, r) => sum + r.amount_chf, 0);

  const totalRevenusManuels = financialRecords
    .filter(r => r.type === 'revenu')
    .reduce((sum, r) => sum + r.amount_chf, 0);

  const soldeNet = (totalRevenueTTC + totalRevenusManuels) - totalDepenses;

  const formatCHF = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const { toast, confirm } = useToast();

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amountChf) {
      toast.error('Champs manquants', 'Veuillez renseigner la description et le montant.');
      return;
    }

    try {
      await saveFinancialRecord({
        record_date: new Date().toLocaleDateString('fr-CH'),
        type: recordType,
        category,
        description,
        amount_chf: Number(amountChf),
        tva_rate: Number(tvaRate),
        client_or_supplier: supplier || (recordType === 'revenu' ? 'Client' : 'Fournisseur'),
        invoice_ref: invoiceRef || `MOUV-${Date.now().toString().slice(-4)}`,
        status: 'paye'
      });
      setShowAddModal(false);
      setDescription('');
      setSupplier('');
      setInvoiceRef('');
      toast.success('Écriture enregistrée', `${recordType === 'revenu' ? 'Revenu' : 'Dépense'} de CHF ${amountChf}.- ajouté.`);
      onReload();
    } catch (err) {
      toast.error('Erreur', 'Impossible d\'ajouter l\'écriture financière');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    const ok = await confirm({
      title: "Supprimer l'écriture comptable ?",
      message: "Cette écriture sera définitivement retirée du grand livre fiduciaire.",
      confirmLabel: "Supprimer",
      isDestructive: true
    });

    if (ok) {
      try {
        await deleteFinancialRecord(id);
        toast.success("Écriture supprimée", "Le registre a été mis à jour.");
        onReload();
      } catch (err) {
        toast.error("Erreur", "Échec de suppression de l'écriture");
      }
    }
  };

  const exportCSV = () => {
    const headers = ['Réf', 'Date', 'Type', 'Catégorie', 'Description', 'Tiers / Client', 'Montant CHF', 'Taux TVA'];
    const rows = [
      ...billableLeads.map(l => [
        l.id,
        l.move_date || '2026',
        'Revenu Déménagement',
        l.service_type,
        `Facture ${l.id}`,
        `"${l.client_name}"`,
        (l.amount_chf || l.estimated_amount_chf || 0).toFixed(2),
        '8.1%'
      ]),
      ...financialRecords.map(r => [
        r.invoice_ref || r.id,
        r.record_date,
        r.type === 'revenu' ? 'Revenu' : 'Dépense',
        r.category,
        `"${r.description}"`,
        `"${r.client_or_supplier || ''}"`,
        r.amount_chf.toFixed(2),
        `${r.tva_rate}%`
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BATIMOVE_Journal_Comptable_TVA_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">
              Conformité Fiscale & Bancaire Suisse — BCGE / AFC
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Contrôle Financier & Fiduciaire</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            TVA suisse à 8.1%, livre de caisse, entrées/sorties et rapprochement bancaire. Batimove Sàrl — IDE: CHE-492.836.215 TVA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Dépense / Revenu
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-gray-900 text-xs font-bold hover:bg-gray-100 active:scale-95 transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Financial Overview Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Encaissements */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenus (TTC)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 tabular-nums">
            {formatCHF(totalRevenueTTC + totalRevenusManuels)}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Factures émises + encaissements</span>
        </div>

        {/* Total Dépenses */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Dépenses</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600 tabular-nums">
            {formatCHF(totalDepenses)}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Carburant, entretien, salaires</span>
        </div>

        {/* Marge Nette / Trésorerie */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Résultat Net Exploitation</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className={cn("text-2xl font-bold tabular-nums", soldeNet >= 0 ? "text-emerald-600" : "text-red-600")}>
            {formatCHF(soldeNet)}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Solde après déduction des coûts</span>
        </div>

        {/* TVA 8.1% Collectée */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">TVA Suisse Due (8.1%)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 tabular-nums">
            {formatCHF(totalTVACollectee)}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Base nette HT : {formatCHF(totalRevenueHT)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('tva')}
          className={cn(
            "py-3 px-4 border-b-2 transition-colors",
            activeTab === 'tva' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          Extrait Facturation & TVA Suisse ({billableLeads.length})
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={cn(
            "py-3 px-4 border-b-2 transition-colors",
            activeTab === 'ledger' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          Grand Livre des Dépenses & Flux ({financialRecords.length})
        </button>
      </div>

      {/* TAB 1: TVA BREAKDOWN */}
      {activeTab === 'tva' && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h4 className="font-bold text-sm text-gray-900">Journal des Factures Déménagements & Prestations</h4>
            <span className="text-xs text-gray-400">{billableLeads.length} factures enregistrées</span>
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
      )}

      {/* TAB 2: EXPENSES & LEDGER */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h4 className="font-bold text-sm text-gray-900">Écritures Financières & Coûts d'Exploitation</h4>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter une écriture
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="grid grid-cols-[100px_1fr_1.5fr_1fr_100px_60px] gap-4 p-3.5 bg-gray-50/70 text-[11px] font-bold text-gray-400 uppercase items-center">
              <div>Date</div>
              <div>Catégorie</div>
              <div>Description / Tiers</div>
              <div>Montant CHF</div>
              <div>Statut</div>
              <div className="text-right">Action</div>
            </div>

            {financialRecords.length === 0 ? (
              <div className="p-10 text-center text-sm font-medium text-gray-400">
                Aucune dépense ou écriture manuelle enregistrée.
              </div>
            ) : (
              financialRecords.map(rec => (
                <div
                  key={rec.id}
                  className="grid grid-cols-[100px_1fr_1.5fr_1fr_100px_60px] gap-4 p-3.5 items-center hover:bg-gray-50 transition-colors text-xs"
                >
                  <span className="font-medium text-gray-600">{rec.record_date}</span>
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700 capitalize">
                      {rec.category}
                    </span>
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-gray-900 block truncate">{rec.description}</span>
                    <span className="text-[11px] text-gray-400">{rec.client_or_supplier}</span>
                  </div>
                  <div className="font-bold tabular-nums">
                    <span className={rec.type === 'depense' ? 'text-red-600' : 'text-emerald-600'}>
                      {rec.type === 'depense' ? '-' : '+'}{formatCHF(rec.amount_chf)}
                    </span>
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {rec.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => handleDeleteRecord(rec.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Supprimer écriture"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Financial Movement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 z-10 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nouvelle Écriture Comptable</h3>
            <form onSubmit={handleAddRecord} className="space-y-3">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRecordType('depense')}
                  className={cn(
                    "py-1.5 rounded-lg text-xs font-bold transition-all",
                    recordType === 'depense' ? "bg-white text-red-600 shadow-sm" : "text-gray-500"
                  )}
                >
                  Dépense / Coût
                </button>
                <button
                  type="button"
                  onClick={() => setRecordType('revenu')}
                  className={cn(
                    "py-1.5 rounded-lg text-xs font-bold transition-all",
                    recordType === 'revenu' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"
                  )}
                >
                  Encaissement / Revenu
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Plein Carburant Iveco GE-4921"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Montant (CHF) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={amountChf}
                    onChange={e => setAmountChf(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold tabular-nums focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none bg-white"
                  >
                    <option value="carburant">Carburant & Péages</option>
                    <option value="entretien">Entretien Véhicules</option>
                    <option value="salaires">Équipe & Extras</option>
                    <option value="materiel">Cartons & Emballages</option>
                    <option value="assurance">Assurances & RC</option>
                    <option value="autre">Autre frais</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tiers / Fournisseur</label>
                  <input
                    type="text"
                    placeholder="ex: Shell Genève"
                    value={supplier}
                    onChange={e => setSupplier(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Réf / Justificatif</label>
                  <input
                    type="text"
                    placeholder="TICKET-9821"
                    value={invoiceRef}
                    onChange={e => setInvoiceRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
                >
                  Enregistrer l'écriture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
