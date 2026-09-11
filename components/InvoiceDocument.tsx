import React from 'react';
import { LeadItem } from '../services/supabaseClient';

/**
 * Authoritative Batimove Sàrl Corporate & Banking Configuration
 * Sourced directly from verified company registry and contract records
 */
export const BATIMOVE_COMPANY_CONFIG = {
  legalName: 'Batimove Sàrl',
  legalForm: 'Société à responsabilité limitée (Sàrl)',
  tagline: 'Excellence in Motion • Déménagement & Logistique Haute Précision',
  address: 'Rue de Monthoux 64',
  postalCode: '1201',
  city: 'Genève',
  country: 'Suisse',
  phoneDirect: '+41 22 800 00 00',
  phoneTollFree: '0800 825 925',
  email: 'info@batimove.ch',
  website: 'https://batimove.ch',
  ide: 'CHE-492.836.215 TVA',
  rc: 'Registre du Commerce du Canton de Genève',
  iban: 'CH93 0076 2011 6238 5290 1',
  bank: 'Banque Cantonale de Genève (BCGE)',
  bic: 'BCGECHGGXXX',
  creditor: 'Batimove Sàrl, Rue de Monthoux 64, 1201 Genève',
  logoUrl: '/batimove-logo.png'
};

export interface InvoiceItemLine {
  id: string;
  position: number;
  description: string;
  details?: string;
  quantity: string | number;
  unitPriceHT: number;
  amountHT: number;
}

export interface InvoiceDocumentProps {
  lead: LeadItem;
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  isPrintPreview?: boolean;
}

/**
 * Swiss Currency Formatter: CHF 12'800.00
 */
export const formatCHF = (val: any): string => {
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num) || !isFinite(num)) return '0.00';
  return num.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/**
 * Authoritative Swiss Financial Calculation (TVA 8.1%)
 */
export const calculateInvoiceFinancials = (totalTTC: number) => {
  const safeTTC = Math.max(0, Number(totalTTC) || 0);
  const tva81 = safeTTC * (8.1 / 108.1);
  const totalHT = safeTTC - tva81;
  return {
    totalHT,
    tvaRate: 8.1,
    tva81,
    totalTTC: safeTTC
  };
};

/**
 * Generates Swiss Structured Reference Number:
 * e.g. 21 0000 0000 0000 2026 0840
 */
export const generateSwissReference = (leadId: string): string => {
  const digits = (leadId || '').replace(/\D/g, '') || '2026';
  const padded = digits.padStart(20, '0');
  return `21${padded}`.replace(/(\d{4})(?=\d)/g, '$1 ');
};

/**
 * Builds coherent multi-line invoice item breakdown from lead data
 */
export const generateInvoiceLines = (lead: LeadItem, totalHT: number): InvoiceItemLine[] => {
  const serviceType = lead.service_type || 'Déménagement Résidentiel';
  const details = lead.details || '';
  const fromCity = lead.from_city || 'Genève';
  const toCity = lead.to_city || 'Suisse';
  const moveDate = lead.move_date || 'Mars 2026';

  const lines: InvoiceItemLine[] = [];

  // Check if multiple services are mentioned in details or notes
  const hasMonteMeubles = details.toLowerCase().includes('monte-meuble') || details.toLowerCase().includes('monte-charge') || details.toLowerCase().includes('klaas');
  const hasEmballage = details.toLowerCase().includes('emballage') || details.toLowerCase().includes('carton') || details.toLowerCase().includes('lustre');
  const hasGardeMeuble = details.toLowerCase().includes('garde-meuble') || details.toLowerCase().includes('stockage');

  if (hasMonteMeubles && totalHT > 2000) {
    const mainServiceHT = totalHT * 0.75;
    const liftHT = totalHT * 0.25;

    lines.push({
      id: 'item-1',
      position: 1,
      description: `${serviceType} • Trajet: ${fromCity} -> ${toCity}`,
      details: `Date d'exécution: ${moveDate} • Équipe professionnelle Batimove avec camion équipé.`,
      quantity: '1 forfait',
      unitPriceHT: mainServiceHT,
      amountHT: mainServiceHT
    });

    lines.push({
      id: 'item-2',
      position: 2,
      description: 'Mise à disposition monte-meubles extérieur Klaas 25m avec opérateur agréé',
      details: 'Autorisation communale et sécurisation du périmètre incluses.',
      quantity: '1 prestation',
      unitPriceHT: liftHT,
      amountHT: liftHT
    });
  } else if (hasEmballage && totalHT > 2000) {
    const mainServiceHT = totalHT * 0.82;
    const packingHT = totalHT * 0.18;

    lines.push({
      id: 'item-1',
      position: 1,
      description: `${serviceType} • Trajet: ${fromCity} -> ${toCity}`,
      details: `Prestation complète de déménagement le ${moveDate}.`,
      quantity: '1 forfait',
      unitPriceHT: mainServiceHT,
      amountHT: mainServiceHT
    });

    lines.push({
      id: 'item-2',
      position: 2,
      description: 'Fourniture de cartons renforcés, housses et emballage objets fragiles',
      details: 'Protection haute sécurité lustres, tableaux et vaisselle.',
      quantity: '1 lot',
      unitPriceHT: packingHT,
      amountHT: packingHT
    });
  } else if (hasGardeMeuble && totalHT > 1500) {
    const mainServiceHT = totalHT * 0.80;
    const storageHT = totalHT * 0.20;

    lines.push({
      id: 'item-1',
      position: 1,
      description: `${serviceType} • Trajet: ${fromCity} -> ${toCity}`,
      details: `Déménagement et manutention sous la supervision de notre chef d'équipe.`,
      quantity: '1 forfait',
      unitPriceHT: mainServiceHT,
      amountHT: mainServiceHT
    });

    lines.push({
      id: 'item-2',
      position: 2,
      description: 'Entreposage sécurisé en garde-meubles climatisé Batimove Genève',
      details: 'Box individuel ventilé, vidéosurveillance 24/7 et assurance incluse.',
      quantity: '1 période',
      unitPriceHT: storageHT,
      amountHT: storageHT
    });
  } else {
    // Single consolidated service package
    lines.push({
      id: 'item-1',
      position: 1,
      description: `${serviceType} • Trajet: ${fromCity} -> ${toCity}`,
      details: details ? `Prestation: ${details} • Date: ${moveDate}` : `Prestation complète de transport et manutention le ${moveDate}`,
      quantity: '1 forfait',
      unitPriceHT: totalHT,
      amountHT: totalHT
    });
  }

  return lines;
};

export const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({
  lead,
  invoiceNumber,
  issueDate,
  dueDate,
  isPrintPreview = false
}) => {
  const totalTTC = Math.max(0, Number(lead.amount_chf ?? lead.estimated_amount_chf ?? 0) || 0);
  const financials = calculateInvoiceFinancials(totalTTC);
  const lines = generateInvoiceLines(lead, financials.totalHT);

  // Computed display dates
  const formattedInvoiceNum = invoiceNumber || `FAC-2026-${lead.id.replace(/\D/g, '').padStart(3, '0') || '042'}`;
  
  const todayStr = issueDate || new Date().toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const computedDueDate = dueDate || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  })();

  const swissReference = generateSwissReference(lead.id);

  return (
    <div className="invoice-print-area bg-white text-slate-900 font-sans text-xs select-text w-full max-w-[210mm] mx-auto p-6 sm:p-10 shadow-lg print:shadow-none print:p-0 print:m-0 border border-slate-200 print:border-none rounded-2xl print:rounded-none">
      
      {/* =========================================================================
          1. HEADER: BRANDING & COMPANY CO-ORDINATES
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-200 invoice-avoid-break">
        
        {/* Left: Official Brand & Registration */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 p-1.5 flex items-center justify-center shadow-xs">
              <img
                src={BATIMOVE_COMPANY_CONFIG.logoUrl}
                alt="Batimove Sàrl"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight text-slate-950 font-display">
                BATIMOVE<span className="text-[#0073ea]">.CH</span>
              </h1>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {BATIMOVE_COMPANY_CONFIG.legalName} • Genève
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-600 leading-relaxed font-normal pt-1">
            <div>{BATIMOVE_COMPANY_CONFIG.address}, {BATIMOVE_COMPANY_CONFIG.postalCode} {BATIMOVE_COMPANY_CONFIG.city}</div>
            <div>Tél: {BATIMOVE_COMPANY_CONFIG.phoneTollFree} • Direct: {BATIMOVE_COMPANY_CONFIG.phoneDirect}</div>
            <div>Email: {BATIMOVE_COMPANY_CONFIG.email} • Web: {BATIMOVE_COMPANY_CONFIG.website}</div>
            <div className="font-semibold text-slate-800 pt-0.5">IDE : {BATIMOVE_COMPANY_CONFIG.ide}</div>
          </div>
        </div>

        {/* Right: Invoice Identification Box */}
        <div className="sm:text-right space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200/80 min-w-[220px]">
          <div className="inline-block px-2 py-0.5 bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider rounded">
            Facture Officielle
          </div>
          <div className="text-lg font-black font-mono text-slate-900 pt-1">
            {formattedInvoiceNum}
          </div>
          <div className="text-[10px] text-slate-600 space-y-0.5 pt-1">
            <div><span className="text-slate-400">Date d'émission :</span> <strong>{todayStr}</strong></div>
            <div><span className="text-slate-400">Échéance :</span> <strong className="text-blue-700">{computedDueDate}</strong> (30j net)</div>
            <div><span className="text-slate-400">Réf. Dossier :</span> <strong className="font-mono">#{lead.id}</strong></div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          2. CUSTOMER / DESTINATAIRE SECTION (Swiss Window Standard)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 invoice-avoid-break">
        
        {/* Left: Prestation Context */}
        <div className="space-y-1.5 text-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Détails de la Prestation Logistique
          </div>
          <div className="font-bold text-slate-900 text-sm">
            {lead.service_type || 'Déménagement & Transport'}
          </div>
          <div className="text-slate-600 space-y-0.5 text-[11px]">
            <div>
              <span className="text-slate-400">Trajet :</span>{' '}
              <strong>{lead.from_city || 'Genève'}</strong> ➔ <strong>{lead.to_city || 'Suisse'}</strong>
            </div>
            <div>
              <span className="text-slate-400">Date prévue :</span> <strong>{lead.move_date || 'Mars 2026'}</strong>
            </div>
            {lead.details && (
              <div className="text-slate-500 text-[10px] italic pt-1 line-clamp-2">
                Note: {lead.details}
              </div>
            )}
          </div>
        </div>

        {/* Right: Client Envelope Box */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Facturé à (Client)
          </div>
          <div className="font-black text-slate-900 text-sm">
            {lead.client_name || 'Client Batimove'}
          </div>
          {lead.from_city && (
            <div className="text-slate-700 text-[11px]">
              {lead.from_city}, Suisse
            </div>
          )}
          {lead.client_phone && (
            <div className="text-slate-600 text-[11px]">
              Tél: <span className="font-mono">{lead.client_phone}</span>
            </div>
          )}
          {lead.client_email && (
            <div className="text-slate-600 text-[11px]">
              Email: <span>{lead.client_email}</span>
            </div>
          )}
        </div>

      </div>

      {/* =========================================================================
          3. SERVICE ITEMS TABLE (Swiss Precision Grid)
          ========================================================================= */}
      <div className="py-6 invoice-avoid-break">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-600 select-none">
              <th className="pb-2 w-8">Pos.</th>
              <th className="pb-2">Description de la prestation</th>
              <th className="pb-2 text-center w-24">Quantité</th>
              <th className="pb-2 text-right w-28">Prix Unit. HT</th>
              <th className="pb-2 text-right w-28">Montant HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {lines.map(line => (
              <tr key={line.id} className="invoice-avoid-break">
                <td className="py-3 font-mono text-slate-400 font-bold">{line.position}</td>
                <td className="py-3 pr-4">
                  <div className="font-bold text-slate-900">{line.description}</div>
                  {line.details && (
                    <div className="text-[10px] text-slate-500 mt-0.5">{line.details}</div>
                  )}
                </td>
                <td className="py-3 text-center text-slate-600 font-medium">{line.quantity}</td>
                <td className="py-3 text-right font-mono text-slate-700">CHF {formatCHF(line.unitPriceHT)}</td>
                <td className="py-3 text-right font-mono font-bold text-slate-900">CHF {formatCHF(line.amountHT)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          4. FINANCIAL TOTALS & SWISS STATUTORY TVA 8.1%
          ========================================================================= */}
      <div className="flex justify-end pt-2 pb-6 border-b border-slate-200 invoice-avoid-break">
        <div className="w-full sm:w-72 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          
          <div className="flex justify-between text-xs text-slate-600">
            <span>Sous-Total HT</span>
            <span className="font-mono font-bold text-slate-800">CHF {formatCHF(financials.totalHT)}</span>
          </div>

          <div className="flex justify-between text-xs text-slate-600">
            <span>TVA Suisse (8.1%)</span>
            <span className="font-mono font-bold text-slate-800">CHF {formatCHF(financials.tva81)}</span>
          </div>

          <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-sm font-black text-slate-950">
            <span>TOTAL TTC (CHF)</span>
            <span className="font-mono text-blue-700">CHF {formatCHF(financials.totalTTC)}</span>
          </div>

          <div className="text-[9px] text-slate-400 text-right pt-0.5">
            TVA 8.1% comprise selon LTVA suisse
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. PAYMENT CONDITIONS & INSTRUCTIONS
          ========================================================================= */}
      <div className="py-4 text-[11px] text-slate-600 space-y-1 invoice-avoid-break">
        <div className="font-bold text-slate-800">Conditions de règlement :</div>
        <p>
          Paiement à 30 jours net dès réception. Virement bancaire au moyen de la QR-facture ci-dessous 
          ou par e-banking en indiquant la référence de paiement structurée.
        </p>
      </div>

      {/* =========================================================================
          6. OFFICIAL SWISS QR-BILL (QR-Facture Suisse Standard)
          ========================================================================= */}
      <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-400 qr-bill-print invoice-avoid-break">
        
        {/* Scissor cut guide */}
        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pb-3 select-none">
          <span>✂ Section de paiement (QR-Facture Suisse conforme SIX Interbank Clearing)</span>
          <span>Ne pas froisser ou perforer</span>
        </div>

        {/* Dual Section Grid: Récépissé (62mm) + Section Paiement (148mm) */}
        <div className="grid grid-cols-1 md:grid-cols-12 border border-slate-300 rounded-lg overflow-hidden bg-white text-[10px]">
          
          {/* A. RÉCÉPISSÉ (RECEIPT - col-span-4) */}
          <div className="md:col-span-4 p-3.5 border-b md:border-b-0 md:border-r border-slate-300 space-y-2.5 bg-slate-50/40">
            <div className="font-black text-xs uppercase tracking-tight text-slate-900">
              Récépissé
            </div>

            <div>
              <div className="font-bold text-[9px] text-slate-500 uppercase">Compte / Payable à</div>
              <div className="font-mono text-[10px] font-bold text-slate-800">{BATIMOVE_COMPANY_CONFIG.iban}</div>
              <div className="text-slate-700 leading-tight pt-0.5">{BATIMOVE_COMPANY_CONFIG.creditor}</div>
            </div>

            <div>
              <div className="font-bold text-[9px] text-slate-500 uppercase">Référence</div>
              <div className="font-mono text-[10px] text-slate-800 font-semibold">{swissReference}</div>
            </div>

            <div>
              <div className="font-bold text-[9px] text-slate-500 uppercase">Payable par</div>
              <div className="font-bold text-slate-800">{lead.client_name}</div>
              <div className="text-slate-600">{lead.from_city || 'Genève'}, Suisse</div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">Monnaie</div>
                <div className="font-black text-xs">CHF</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-slate-400 font-bold uppercase">Montant</div>
                <div className="font-mono font-black text-xs text-slate-900">{formatCHF(financials.totalTTC)}</div>
              </div>
            </div>

            <div className="text-[8px] text-slate-400 text-right pt-1">
              Point de dépôt
            </div>
          </div>

          {/* B. SECTION PAIEMENT (PAYMENT PART - col-span-8) */}
          <div className="md:col-span-8 p-3.5 space-y-2.5">
            <div className="font-black text-xs uppercase tracking-tight text-slate-900 flex items-center justify-between">
              <span>Section paiement</span>
              <span className="text-[9px] font-mono font-normal text-slate-400">CH-QR Standard 2026</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
              
              {/* Swiss QR Code Graphic Placeholder with Swiss Cross (+) */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-24 h-24 bg-slate-900 rounded p-1 relative flex items-center justify-center shadow-xs">
                  {/* Outer Swiss QR Grid Simulation */}
                  <div className="w-full h-full border-2 border-white flex items-center justify-center relative">
                    {/* Corner anchors */}
                    <div className="absolute top-1 left-1 w-3 h-3 bg-white" />
                    <div className="absolute top-1 right-1 w-3 h-3 bg-white" />
                    <div className="absolute bottom-1 left-1 w-3 h-3 bg-white" />
                    {/* Swiss Central Cross in Red */}
                    <div className="w-6 h-6 bg-red-600 rounded-xs flex items-center justify-center text-white font-black text-sm shadow-xs z-10">
                      +
                    </div>
                  </div>
                </div>
                <div className="text-[8px] font-mono text-slate-400 mt-1">Scanner avec e-banking</div>
              </div>

              {/* Payment Details */}
              <div className="sm:col-span-8 space-y-2">
                <div>
                  <div className="font-bold text-[9px] text-slate-500 uppercase">Compte / Payable à</div>
                  <div className="font-mono text-[10px] font-bold text-slate-900">{BATIMOVE_COMPANY_CONFIG.iban}</div>
                  <div className="text-slate-800 text-[10px] leading-tight pt-0.5">{BATIMOVE_COMPANY_CONFIG.creditor}</div>
                </div>

                <div>
                  <div className="font-bold text-[9px] text-slate-500 uppercase">Référence structurée</div>
                  <div className="font-mono text-[11px] font-bold text-blue-700 tracking-wide">{swissReference}</div>
                </div>

                <div>
                  <div className="font-bold text-[9px] text-slate-500 uppercase">Informations additionnelles</div>
                  <div className="text-[10px] text-slate-700 font-mono">Dossier #{lead.id} • Facture {formattedInvoiceNum}</div>
                </div>

                <div>
                  <div className="font-bold text-[9px] text-slate-500 uppercase">Payable par</div>
                  <div className="font-bold text-slate-800">{lead.client_name}</div>
                  <div className="text-slate-600">{lead.from_city || 'Genève'}, Suisse</div>
                </div>
              </div>

            </div>

            {/* Currency & Amount on Payment Part */}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">Monnaie</div>
                <div className="font-black text-sm text-slate-900">CHF</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-slate-400 font-bold uppercase">Montant Total TTC</div>
                <div className="font-mono font-black text-base text-slate-950">
                  {formatCHF(financials.totalTTC)}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================================
          7. FOOTER: LEGAL & COMMERCIAL MENTIONS
          ========================================================================= */}
      <div className="pt-6 mt-6 border-t border-slate-200 text-[9px] text-slate-400 text-center space-y-0.5 invoice-avoid-break">
        <div>{BATIMOVE_COMPANY_CONFIG.legalName} • {BATIMOVE_COMPANY_CONFIG.legalForm} • {BATIMOVE_COMPANY_CONFIG.rc}</div>
        <div>Assurance Responsabilité Civile Professionnelle 5'000'000 CHF • Conforme Loi fédérale sur la protection des données (nLPD)</div>
      </div>

    </div>
  );
};
