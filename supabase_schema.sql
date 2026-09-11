-- =========================================================================
-- BATIMOVE SÀRL - CONFIGURATION TABLES SUPABASE (BATIMOVE OS)
-- Copiez et collez ce script dans : Supabase Dashboard -> SQL Editor -> Run
-- =========================================================================

-- 1. Table des Leads / Devis / Factures
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    service_type TEXT NOT NULL DEFAULT 'Déménagement Résidentiel',
    amount_chf NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'nouveau', -- 'nouveau', 'en_cours', 'confirme', 'termine'
    from_city TEXT DEFAULT 'Genève',
    to_city TEXT DEFAULT 'Genève',
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table des Clôtures Financières Mensuelles (Fiduciaire Suisse)
CREATE TABLE IF NOT EXISTS public.financial_records (
    id TEXT PRIMARY KEY,
    month TEXT NOT NULL,
    year INTEGER NOT NULL,
    total_revenue_chf NUMERIC NOT NULL DEFAULT 0,
    vat_tva_8_1_chf NUMERIC NOT NULL DEFAULT 0,
    net_revenue_chf NUMERIC NOT NULL DEFAULT 0,
    moves_count INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Politiques de Sécurité RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture et l'écriture avec la clé anon configurée
CREATE POLICY "Batimove OS Leads Access" 
ON public.leads 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Batimove OS Financial Access" 
ON public.financial_records 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- 4. Données de démonstration initiales (Suisse Romande)
INSERT INTO public.leads (id, client_name, client_email, client_phone, service_type, amount_chf, status, from_city, to_city, details)
VALUES 
  ('BM-2026-084', 'Alexandre de Senarclens', 'alexandre.senarclens@bluewin.ch', '+41 79 342 18 90', 'Déménagement Résidentiel Premium', 3450.00, 'confirme', 'Cologny (GE)', 'Vandoeuvres (GE)', 'Villa de maître 9 pièces, emballage objets d''art et lustres Baccarat.'),
  ('BM-2026-083', 'Clinique La Colline S.A.', 'direction.logistique@lacolline.ch', '+41 22 702 60 00', 'Transfert Entreprise / B2B', 12800.00, 'termine', 'Genève Centre', 'Champel (GE)', 'Transfert département administratif et matériel informatique sensible.'),
  ('BM-2026-082', 'Famille Favre & Cie', 'm.favre@gmail.com', '+41 78 812 44 20', 'Déménagement Résidentiel', 2150.00, 'en_cours', 'Lausanne Ouchy', 'Pully (VD)', 'Appartement 4.5 pièces au 3ème étage avec monte-meubles.'),
  ('BM-2026-081', 'Cabinet Notarial Pic-Pic', 'secretariat@notaires-ge.ch', '+41 22 819 12 00', 'Débarras & Destruction Écologique', 1650.00, 'termine', 'Genève Rive', 'Genève Vernier', 'Débarras archives certifié conforme nLPD avec certificat de destruction.')
ON CONFLICT (id) DO NOTHING;
