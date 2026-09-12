import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://cysywrrrtcxgowupvrzk.supabase.co';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5c3l3cnJydGN4Z293dXB2cnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzA4NDYsImV4cCI6MjEwNDYwNjg0Nn0.Yl_-xZcnWjaBXITVEbsv9abE-SgMCm5eZdkdTgkVQBE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface LeadItem {
  id: string;
  created_at?: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  service_type: string;
  from_city?: string;
  to_city?: string;
  move_date?: string;
  details?: string;
  amount_chf?: number;
  estimated_amount_chf: number;
  status: 'nouveau' | 'visite' | 'en_cours' | 'confirme' | 'facture' | 'annule' | 'termine';
  notes?: string;
  owner_id?: 'user-anderson' | 'user-josue';
  owner_name?: string;
  version?: number;
  updated_at?: string;
  idempotency_key?: string;
}

export interface FinancialRecord {
  id: string;
  created_at?: string;
  record_date: string;
  type: 'revenu' | 'depense';
  category: string;
  description: string;
  amount_chf: number;
  tva_rate: number;
  client_or_supplier?: string;
  invoice_ref?: string;
  status: 'paye' | 'en_attente';
}

export const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'BM-2026-084',
    created_at: '2026-03-08T10:15:00Z',
    client_name: 'Alexandre de Senarclens',
    client_phone: '+41 79 342 18 90',
    client_email: 'alexandre.senarclens@bluewin.ch',
    service_type: 'Déménagement Résidentiel Premium',
    from_city: 'Cologny (GE)',
    to_city: 'Vandoeuvres (GE)',
    move_date: '18.03.2026',
    details: 'Villa de maître 9 pièces, emballage objets d art et lustres Baccarat.',
    amount_chf: 3450,
    estimated_amount_chf: 3450,
    status: 'confirme',
    notes: 'Visite technique effectuée, équipe de 4 déménageurs assignée'
  },
  {
    id: 'BM-2026-083',
    created_at: '2026-03-09T14:30:00Z',
    client_name: 'Clinique La Colline S.A.',
    client_phone: '+41 22 702 60 00',
    client_email: 'direction.logistique@lacolline.ch',
    service_type: 'Transfert Entreprise / B2B',
    from_city: 'Genève Centre',
    to_city: 'Champel (GE)',
    move_date: '24.03.2026',
    details: 'Transfert département administratif et matériel informatique sensible.',
    amount_chf: 12800,
    estimated_amount_chf: 12800,
    status: 'facture',
    notes: 'Contrat signé, facturation 50% acompte reçu'
  },
  {
    id: 'BM-2026-082',
    created_at: '2026-03-09T16:45:00Z',
    client_name: 'Famille Favre & Cie',
    client_phone: '+41 78 812 44 20',
    client_email: 'm.favre@gmail.com',
    service_type: 'Déménagement Résidentiel',
    from_city: 'Lausanne Ouchy',
    to_city: 'Pully (VD)',
    move_date: '28.03.2026',
    details: 'Appartement 4.5 pièces au 3ème étage avec monte-meubles.',
    amount_chf: 2150,
    estimated_amount_chf: 2150,
    status: 'en_cours',
    notes: 'Devis envoyé, rappel client prévu demain'
  },
  {
    id: 'BM-2026-081',
    created_at: '2026-03-07T11:00:00Z',
    client_name: 'Cabinet Notarial Pic-Pic',
    client_phone: '+41 22 819 12 00',
    client_email: 'secretariat@notaires-ge.ch',
    service_type: 'Débarras & Destruction Écologique',
    from_city: 'Genève Rive',
    to_city: 'Genève Vernier',
    move_date: '15.03.2026',
    details: 'Débarras archives certifié conforme nLPD avec certificat de destruction.',
    amount_chf: 1650,
    estimated_amount_chf: 1650,
    status: 'facture',
    notes: 'Prestation terminée et validée'
  }
];

export const INITIAL_FINANCIAL: FinancialRecord[] = [
  {
    id: 'fin-001',
    created_at: '2026-03-01T08:00:00Z',
    record_date: '01.03.2026',
    type: 'revenu',
    category: 'demenagement',
    description: 'Facture BM-2026-083 (Clinique La Colline)',
    amount_chf: 12800,
    tva_rate: 8.1,
    client_or_supplier: 'Clinique La Colline',
    invoice_ref: 'FAC-2026-042',
    status: 'paye'
  },
  {
    id: 'fin-002',
    created_at: '2026-03-03T09:15:00Z',
    record_date: '03.03.2026',
    type: 'revenu',
    category: 'demenagement',
    description: 'Facture BM-2026-084 (M. de Senarclens)',
    amount_chf: 3450,
    tva_rate: 8.1,
    client_or_supplier: 'A. de Senarclens',
    invoice_ref: 'FAC-2026-043',
    status: 'paye'
  },
  {
    id: 'fin-003',
    created_at: '2026-03-04T14:20:00Z',
    record_date: '04.03.2026',
    type: 'depense',
    category: 'carburant',
    description: 'Carburant Flotte Iveco - Station Eni Vernier',
    amount_chf: 840,
    tva_rate: 8.1,
    client_or_supplier: 'Eni Suisse SA',
    invoice_ref: 'TICK-44910',
    status: 'paye'
  },
  {
    id: 'fin-004',
    created_at: '2026-03-05T11:00:00Z',
    record_date: '05.03.2026',
    type: 'depense',
    category: 'assurance',
    description: 'Prime Mensuelle RC Professionnelle & Flotte',
    amount_chf: 1450,
    tva_rate: 0,
    client_or_supplier: 'Helvetia Assurances',
    invoice_ref: 'POL-99201',
    status: 'paye'
  },
  {
    id: 'fin-005',
    created_at: '2026-03-06T15:30:00Z',
    record_date: '06.03.2026',
    type: 'revenu',
    category: 'debarras',
    description: 'Prestation Cabinet Notarial Pic-Pic',
    amount_chf: 1650,
    tva_rate: 8.1,
    client_or_supplier: 'Cabinet Pic-Pic',
    invoice_ref: 'FAC-2026-044',
    status: 'paye'
  }
];

const LOCAL_STORAGE_LEADS = 'batimove_os_leads_v2';
const LOCAL_STORAGE_FINANCIAL = 'batimove_os_financial_v2';
const LOCAL_STORAGE_LEAD_OWNERS = 'batimove_lead_owners_map_v1';

export const getStoredLeadOwners = (): Record<string, { owner_id: string; owner_name: string }> => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEAD_OWNERS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
};

export const setStoredLeadOwner = (leadId: string, ownerId: string, ownerName: string) => {
  try {
    const current = getStoredLeadOwners();
    current[leadId] = { owner_id: ownerId, owner_name: ownerName };
    localStorage.setItem(LOCAL_STORAGE_LEAD_OWNERS, JSON.stringify(current));
  } catch {}
};

const resolveLeadOwner = (item: any, storedOwners: Record<string, { owner_id: string; owner_name: string }>): { owner_id: string; owner_name: string } => {
  const leadId = String(item.id || '');
  const stored = storedOwners[leadId];
  if (stored && stored.owner_id) {
    return {
      owner_id: stored.owner_id,
      owner_name: stored.owner_name || (stored.owner_id === 'user-josue' ? 'Josue Segat' : 'Anderson Martins')
    };
  }

  if (item.owner_id && (item.owner_id === 'user-josue' || item.owner_id === 'user-anderson')) {
    return {
      owner_id: item.owner_id,
      owner_name: item.owner_name || (item.owner_id === 'user-josue' ? 'Josue Segat' : 'Anderson Martins')
    };
  }

  if (item.notes && typeof item.notes === 'string' && item.notes.includes('[owner:')) {
    const match = item.notes.match(/\[owner:(user-[a-z]+)\]/);
    if (match && match[1]) {
      const oid = match[1];
      return {
        owner_id: oid,
        owner_name: oid === 'user-josue' ? 'Josue Segat' : 'Anderson Martins'
      };
    }
  }

  // Initial distribution fallback only if never explicitly set
  const defaultOwnerId = (leadId && (leadId.endsWith('1') || leadId.endsWith('3'))) ? 'user-josue' : 'user-anderson';
  return {
    owner_id: defaultOwnerId,
    owner_name: defaultOwnerId === 'user-josue' ? 'Josue Segat' : 'Anderson Martins'
  };
};

const getSessionAuthToken = (): string => {
  return sessionStorage.getItem('batimove_os_session_auth_v4') || 
         localStorage.getItem('batimove_os_remembered_auth_v4') ||
         sessionStorage.getItem('batimove_os_session_auth_v3') || 
         localStorage.getItem('batimove_os_remembered_auth_v3') || '';
};

export const fetchLeads = async (): Promise<LeadItem[]> => {
  const token = getSessionAuthToken();
  const storedOwners = getStoredLeadOwners();

  try {
    if (token) {
      const { data, error } = await supabase.rpc('get_dashboard_leads', { p_token: token });
      if (!error && data && Array.isArray(data)) {
        const normalized: LeadItem[] = data.map((item: any) => {
          const amt = Math.max(0, Number(item.amount_chf ?? item.estimated_amount_chf ?? 0) || 0);
          let st = item.status;
          if (st === 'termine') st = 'facture';
          const { owner_id, owner_name } = resolveLeadOwner(item, storedOwners);

          return {
            id: String(item.id || `BM-2026-${Math.floor(100 + Math.random() * 900)}`),
            created_at: item.created_at || new Date().toISOString(),
            client_name: String(item.client_name || 'Client Inconnu'),
            client_phone: String(item.client_phone || '+41 22 800 00 00'),
            client_email: item.client_email ? String(item.client_email) : '',
            service_type: String(item.service_type || 'Déménagement Résidentiel'),
            from_city: String(item.from_city || 'Genève'),
            to_city: String(item.to_city || 'Vaud'),
            move_date: item.move_date || 'Mars 2026',
            details: item.details || '',
            amount_chf: amt,
            estimated_amount_chf: amt,
            status: st || 'nouveau',
            notes: item.notes || '',
            owner_id,
            owner_name,
            version: Number(item.version || 1),
            updated_at: item.updated_at || item.created_at || new Date().toISOString(),
            idempotency_key: item.idempotency_key || ''
          };
        });
        localStorage.setItem(LOCAL_STORAGE_LEADS, JSON.stringify(normalized));
        return normalized;
      }
    }
    
    // Fallback direct query if permitted by RLS
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && Array.isArray(data) && data.length > 0) {
      const normalized: LeadItem[] = data.map((item: any) => {
        const amt = Math.max(0, Number(item.amount_chf ?? item.estimated_amount_chf ?? 0) || 0);
        let st = item.status;
        if (st === 'termine') st = 'facture';
        const { owner_id, owner_name } = resolveLeadOwner(item, storedOwners);

        return {
          id: String(item.id || `BM-2026-${Math.floor(100 + Math.random() * 900)}`),
          created_at: item.created_at || new Date().toISOString(),
          client_name: String(item.client_name || 'Client Inconnu'),
          client_phone: String(item.client_phone || '+41 22 800 00 00'),
          client_email: item.client_email ? String(item.client_email) : '',
          service_type: String(item.service_type || 'Déménagement Résidentiel'),
          from_city: String(item.from_city || 'Genève'),
          to_city: String(item.to_city || 'Vaud'),
          move_date: item.move_date || 'Mars 2026',
          details: item.details || '',
          amount_chf: amt,
          estimated_amount_chf: amt,
          status: st || 'nouveau',
          notes: item.notes || '',
          owner_id,
          owner_name,
          version: Number(item.version || 1),
          updated_at: item.updated_at || item.created_at || new Date().toISOString(),
          idempotency_key: item.idempotency_key || ''
        };
      });
      localStorage.setItem(LOCAL_STORAGE_LEADS, JSON.stringify(normalized));
      return normalized;
    }
  } catch (err) {
    console.warn('Supabase leads fetch notice, reading local cache:', err);
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_LEADS);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {}
  }
  localStorage.setItem(LOCAL_STORAGE_LEADS, JSON.stringify(INITIAL_LEADS));
  return INITIAL_LEADS;
};

export const saveLead = async (lead: Partial<LeadItem>): Promise<LeadItem> => {
  const amt = Math.max(0, Number(lead.amount_chf ?? lead.estimated_amount_chf ?? 0) || 0);
  const token = getSessionAuthToken();
  const idempotencyKey = lead.idempotency_key || `idem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const newLead: LeadItem = {
    id: lead.id || `BM-2026-${Math.floor(100 + Math.random() * 900)}`,
    created_at: new Date().toISOString(),
    client_name: lead.client_name || 'Nouveau Client',
    client_phone: lead.client_phone || '+41 79 000 00 00',
    client_email: lead.client_email || '',
    service_type: lead.service_type || 'Déménagement Résidentiel',
    from_city: lead.from_city || 'Genève',
    to_city: lead.to_city || 'Lausanne',
    move_date: lead.move_date || 'Mars 2026',
    details: lead.details || '',
    amount_chf: amt,
    estimated_amount_chf: amt,
    status: (lead.status as any) || 'en_cours',
    notes: lead.notes || '',
    owner_id: lead.owner_id || 'user-anderson',
    owner_name: lead.owner_name || 'Anderson Martins',
    version: 1,
    idempotency_key: idempotencyKey
  };

  try {
    if (token) {
      const { data, error } = await supabase.rpc('save_lead_secure', {
        p_token: token,
        p_lead: newLead,
        p_idempotency_key: idempotencyKey
      });
      if (!error && data) {
        newLead.id = data.id || newLead.id;
        newLead.version = data.version || 1;
      }
    } else {
      // Public site insertion (System 1)
      await supabase.from('leads').insert([{
        id: newLead.id,
        client_name: newLead.client_name,
        client_phone: newLead.client_phone,
        client_email: newLead.client_email,
        service_type: newLead.service_type,
        from_city: newLead.from_city,
        to_city: newLead.to_city,
        move_date: newLead.move_date,
        details: newLead.details,
        amount_chf: newLead.amount_chf,
        status: newLead.status,
        notes: newLead.notes,
        idempotency_key: idempotencyKey,
        version: 1,
        created_at: newLead.created_at
      }]);
    }
  } catch (err) {
    console.warn('Supabase write notice, storing locally:', err);
  }

  const current = await fetchLeads();
  const updated = [newLead, ...current.filter(c => c.id !== newLead.id)];
  localStorage.setItem(LOCAL_STORAGE_LEADS, JSON.stringify(updated));
  return newLead;
};

export interface UpdateLeadResult {
  success: boolean;
  lead?: LeadItem;
  error?: 'CONCURRENCY_CONFLICT' | 'PERMISSION_DENIED' | 'NOT_FOUND' | 'ERROR';
  message?: string;
}

export const updateLeadStatus = async (
  id: string, 
  status: LeadItem['status'], 
  notes?: string,
  expectedVersion?: number
): Promise<UpdateLeadResult> => {
  return updateLeadDetails(id, { status, ...(notes ? { notes } : {}) }, expectedVersion);
};

export const updateLeadDetails = async (
  id: string, 
  updates: Partial<LeadItem>,
  expectedVersion?: number
): Promise<UpdateLeadResult> => {
  if (updates.owner_id || updates.owner_name) {
    const oId = updates.owner_id || 'user-anderson';
    const oName = updates.owner_name || (oId === 'user-josue' ? 'Josue Segat' : 'Anderson Martins');
    setStoredLeadOwner(id, oId, oName);
  }

  const token = getSessionAuthToken();
  try {
    if (token) {
      const { data, error } = await supabase.rpc('update_lead_secure', {
        p_token: token,
        p_id: id,
        p_updates: updates,
        p_expected_version: expectedVersion ?? null
      });

      if (error) {
        const msg = error.message || '';
        if (msg.includes('PERMISSION_DENIED')) {
          return { success: false, error: 'PERMISSION_DENIED', message: msg };
        }
        return { success: false, error: 'ERROR', message: msg };
      }

      if (data && data.success === false && data.error === 'CONCURRENCY_CONFLICT') {
        return {
          success: false,
          error: 'CONCURRENCY_CONFLICT',
          message: data.message || 'Ce dossier a été modifié par un autre utilisateur.'
        };
      }

      if (data && data.success && data.data) {
        const saved = data.data;
        const current = await fetchLeads();
        let updatedLead: LeadItem | null = null;
        const updated = current.map(item => {
          if (item.id === id) {
            updatedLead = { ...item, ...saved };
            return updatedLead;
          }
          return item;
        });
        localStorage.setItem(LOCAL_STORAGE_LEADS, JSON.stringify(updated));
        return { success: true, lead: updatedLead || undefined };
      }
    }

    // Direct update fallback if RPC not yet deployed
    await supabase.from('leads').update(updates).eq('id', id);
  } catch (err) {
    console.warn('Supabase details update notice:', err);
  }

  const current = await fetchLeads();
  let updatedLead: LeadItem | null = null;
  const updated = current.map(item => {
    if (item.id === id) {
      updatedLead = { ...item, ...updates, version: (item.version || 1) + 1 };
      return updatedLead;
    }
    return item;
  });
  localStorage.setItem(LOCAL_STORAGE_LEADS, JSON.stringify(updated));
  return { success: true, lead: updatedLead || undefined };
};

export const deleteLead = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const token = getSessionAuthToken();
  try {
    if (token) {
      const { data, error } = await supabase.rpc('delete_lead_secure', {
        p_token: token,
        p_id: id
      });

      if (error) {
        const msg = error.message || '';
        if (msg.includes('PERMISSION_DENIED')) {
          return { success: false, message: "Action refusée : Seul le Directeur Général est autorisé à supprimer des dossiers." };
        }
        return { success: false, message: msg };
      }

      if (data && data.success) {
        const current = await fetchLeads();
        const updated = current.filter(item => item.id !== id);
        localStorage.setItem(LOCAL_STORAGE_LEADS, JSON.stringify(updated));
        return { success: true };
      }
    }

    await supabase.from('leads').delete().eq('id', id);
  } catch (err: any) {
    console.warn('Supabase delete notice:', err);
  }

  const current = await fetchLeads();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_LEADS, JSON.stringify(updated));
  return { success: true };
};

export const bulkUpdateLeadStatus = async (
  ids: string[], 
  status: LeadItem['status']
): Promise<{ success: boolean; count: number }> => {
  try {
    for (const id of ids) {
      await updateLeadStatus(id, status);
    }
    return { success: true, count: ids.length };
  } catch (err) {
    console.error("Bulk status update error:", err);
    return { success: false, count: 0 };
  }
};

export const bulkAssignLeadOwner = async (
  ids: string[], 
  ownerId: 'user-anderson' | 'user-josue',
  ownerName: string
): Promise<{ success: boolean; count: number }> => {
  try {
    for (const id of ids) {
      await updateLeadDetails(id, { owner_id: ownerId, owner_name: ownerName });
    }
    return { success: true, count: ids.length };
  } catch (err) {
    console.error("Bulk assign owner error:", err);
    return { success: false, count: 0 };
  }
};

export const bulkDeleteLeads = async (
  ids: string[]
): Promise<{ success: boolean; count: number }> => {
  try {
    let deleted = 0;
    for (const id of ids) {
      const res = await deleteLead(id);
      if (res.success) deleted++;
    }
    return { success: true, count: deleted };
  } catch (err) {
    console.error("Bulk delete leads error:", err);
    return { success: false, count: 0 };
  }
};

export const fetchFinancialRecords = async (): Promise<FinancialRecord[]> => {
  const token = getSessionAuthToken();
  try {
    if (token) {
      const { data, error } = await supabase.rpc('get_financial_records_secure', {
        p_token: token
      });

      if (!error && data && Array.isArray(data)) {
        const normalized: FinancialRecord[] = data.map((item: any) => ({
          id: String(item.id || `fin-${Date.now()}`),
          created_at: item.created_at || new Date().toISOString(),
          record_date: item.record_date || (item.created_at ? item.created_at.slice(0, 10) : '01.03.2026'),
          type: item.type || 'revenu',
          category: item.category || 'demenagement',
          description: item.description || item.notes || 'Prestation Déménagement',
          amount_chf: Math.max(0, Number(item.amount_chf) || 0),
          tva_rate: Number(item.tva_rate ?? 8.1),
          client_or_supplier: item.client_or_supplier || 'Batimove Client',
          invoice_ref: item.invoice_ref || item.id || 'FAC-2026',
          status: item.status || 'paye'
        }));
        localStorage.setItem(LOCAL_STORAGE_FINANCIAL, JSON.stringify(normalized));
        return normalized;
      }
    }

    const { data, error } = await supabase
      .from('financial_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && Array.isArray(data) && data.length > 0) {
      const normalized: FinancialRecord[] = data.map((item: any) => ({
        id: String(item.id || `fin-${Date.now()}`),
        created_at: item.created_at || new Date().toISOString(),
        record_date: item.record_date || (item.created_at ? item.created_at.slice(0, 10) : '01.03.2026'),
        type: item.type || 'revenu',
        category: item.category || 'demenagement',
        description: item.description || item.notes || 'Prestation Déménagement',
        amount_chf: Math.max(0, Number(item.amount_chf ?? item.total_revenue_chf ?? 0) || 0),
        tva_rate: Number(item.tva_rate ?? 8.1),
        client_or_supplier: item.client_or_supplier || 'Batimove Client',
        invoice_ref: item.invoice_ref || item.id || 'FAC-2026',
        status: item.status || 'paye'
      }));
      localStorage.setItem(LOCAL_STORAGE_FINANCIAL, JSON.stringify(normalized));
      return normalized;
    }
  } catch (err) {
    console.warn('Supabase financial fetch notice:', err);
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_FINANCIAL);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  localStorage.setItem(LOCAL_STORAGE_FINANCIAL, JSON.stringify(INITIAL_FINANCIAL));
};

export const saveFinancialRecord = async (record: Omit<FinancialRecord, 'id' | 'created_at'>): Promise<FinancialRecord> => {
  const newRecord: FinancialRecord = {
    ...record,
    id: `fin-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('financial_records')
      .insert([newRecord])
      .select()
      .single();

    if (!error && data) {
      const current = await fetchFinancialRecords();
      localStorage.setItem(LOCAL_STORAGE_FINANCIAL, JSON.stringify([data, ...current]));
      return data as FinancialRecord;
    }
  } catch (err) {
    console.warn('Supabase financial write error:', err);
  }

  const current = await fetchFinancialRecords();
  const updated = [newRecord, ...current];
  localStorage.setItem(LOCAL_STORAGE_FINANCIAL, JSON.stringify(updated));
  return newRecord;
};

export interface FleetVehicle {
  id: string;
  name: string;
  driver: string;
  capacity: string;
  status: string;
  city: string;
  next?: string;
  next_mission?: string;
  team?: string;
}

const LOCAL_STORAGE_FLEET = 'batimove_os_fleet_v1';

export const INITIAL_FLEET: FleetVehicle[] = [
  { id: '1', name: 'Iveco Daily 30m³ (GE-4921)', driver: 'Yannick M.', capacity: '30 m³', status: 'En mission', city: 'Cologny', next: '14:30', next_mission: '14:30', team: 'Équipe Alpha' },
  { id: '2', name: 'Iveco Eurocargo 45m³ (GE-8102)', driver: 'Marc V.', capacity: '45 m³', status: 'En mission', city: 'Genève Centre', next: '16:00', next_mission: '16:00', team: 'Équipe Bêta' },
  { id: '3', name: 'Renault Master 20m³ (VD-2910)', driver: 'David L.', capacity: '20 m³', status: 'Disponible', city: 'Dépôt Vernier', next: 'Demain', next_mission: 'Demain', team: 'Équipe Gamma' },
  { id: '4', name: 'Monte-Meubles Klaas 25m (GE-119)', driver: 'Spécialiste Levage', capacity: 'Élévateur 400kg', status: 'Réservé', city: 'Champel', next: '10:00', next_mission: '10:00', team: 'Équipe Levage' }
];

export const fetchFleetVehicles = async (): Promise<FleetVehicle[]> => {
  try {
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data && Array.isArray(data) && data.length > 0) {
      const normalized: FleetVehicle[] = data.map((item: any) => ({
        id: String(item.id),
        name: String(item.name || 'Véhicule Flotte'),
        driver: String(item.driver || 'Chauffeur Non Assigné'),
        capacity: String(item.capacity || '30 m³'),
        status: String(item.status || 'Disponible'),
        city: String(item.city || 'Genève'),
        next: String(item.next || item.next_mission || 'Libre'),
        next_mission: String(item.next_mission || item.next || 'Libre'),
        team: String(item.team || 'Équipe Logistique')
      }));
      localStorage.setItem(LOCAL_STORAGE_FLEET, JSON.stringify(normalized));
      return normalized;
    }
  } catch (err) {
    console.warn('Supabase fleet fetch error:', err);
  }

  const saved = localStorage.getItem(LOCAL_STORAGE_FLEET);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  localStorage.setItem(LOCAL_STORAGE_FLEET, JSON.stringify(INITIAL_FLEET));
  return INITIAL_FLEET;
};

export const saveFleetVehicle = async (vehicle: FleetVehicle): Promise<FleetVehicle> => {
  try {
    await supabase.from('fleet_vehicles').upsert([vehicle]);
  } catch (err) {
    console.warn('Supabase fleet write error:', err);
  }
  const current = await fetchFleetVehicles();
  const updated = [vehicle, ...current.filter(v => v.id !== vehicle.id)];
  localStorage.setItem(LOCAL_STORAGE_FLEET, JSON.stringify(updated));
  return vehicle;
};

export const updateFleetVehicleStatus = async (id: string, status: string): Promise<void> => {
  try {
    await supabase.from('fleet_vehicles').update({ status }).eq('id', id);
  } catch (err) {
    console.warn('Supabase fleet update error:', err);
  }
  const current = await fetchFleetVehicles();
  const updated = current.map(v => v.id === id ? { ...v, status } : v);
  localStorage.setItem(LOCAL_STORAGE_FLEET, JSON.stringify(updated));
};

export const deleteFleetVehicle = async (id: string): Promise<{ success: boolean }> => {
  try {
    await supabase.from('fleet_vehicles').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase fleet delete error:', err);
  }
  const current = await fetchFleetVehicles();
  const updated = current.filter(v => v.id !== id);
  localStorage.setItem(LOCAL_STORAGE_FLEET, JSON.stringify(updated));
  return { success: true };
};

export const deleteFinancialRecord = async (id: string): Promise<{ success: boolean }> => {
  try {
    await supabase.from('financial_records').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase financial delete error:', err);
  }
  const current = await fetchFinancialRecords();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(LOCAL_STORAGE_FINANCIAL, JSON.stringify(updated));
  return { success: true };
};


