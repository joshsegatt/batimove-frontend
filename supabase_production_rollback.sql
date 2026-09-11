-- =========================================================================
-- BATIMOVE SÀRL — SUPABASE PRODUCTION ROLLBACK SCRIPT (v3.3)
-- Reverts changes from supabase_production_remediation.sql (v3.3)
-- Safe, Non-Destructive, Preserves Private Snapshot
-- =========================================================================

BEGIN;

-- 1. Restore legacy PIN column in admin_users if deprecated backup exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'admin_users' AND column_name = '_pin_deprecated_backup'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'admin_users' AND column_name = 'pin'
        ) THEN
            ALTER TABLE public.admin_users RENAME COLUMN _pin_deprecated_backup TO pin;
        END IF;
    ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = '_backup_vault' AND table_name = 'admin_users_pre_migration') THEN
        -- Restore pin values from safety snapshot schema
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'admin_users' AND column_name = 'pin'
        ) THEN
            ALTER TABLE public.admin_users ADD COLUMN pin TEXT;
        END IF;
        
        UPDATE public.admin_users u
        SET pin = b.pin
        FROM _backup_vault.admin_users_pre_migration b
        WHERE u.id = b.id;
    END IF;
END $$;

-- 2. Drop Check Constraints
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS chk_leads_amount_positive;
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS chk_leads_est_positive;
ALTER TABLE public.financial_records DROP CONSTRAINT IF EXISTS chk_fin_amount_positive;
ALTER TABLE public.financial_records DROP CONSTRAINT IF EXISTS chk_fin_tva_valid;

-- 3. Drop Unique Index
DROP INDEX IF EXISTS public.idx_leads_idempotency_key;

-- 4. Clean up RPC Policies
DROP POLICY IF EXISTS "Public Fleet View" ON public.fleet_vehicles;
DROP POLICY IF EXISTS "Public Quote Submission Only" ON public.leads;
DROP POLICY IF EXISTS "Authenticated Staff Leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated Financial Access" ON public.financial_records;

-- NOTE: To prevent accidentally exposing plaintext PINs to the public internet
-- during rollback, admin_users RLS remains ENABLED with access restricted to authenticated staff.
CREATE POLICY "Rollback Authenticated Staff Leads" ON public.leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Rollback Authenticated Financial" ON public.financial_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Rollback Authenticated Fleet" ON public.fleet_vehicles FOR ALL TO authenticated USING (true);
CREATE POLICY "Rollback Authenticated Users" ON public.admin_users FOR ALL TO authenticated USING (true);

-- 5. Drop Stored Procedures
DROP FUNCTION IF EXISTS public.verify_admin_pin(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.get_dashboard_leads(TEXT);
DROP FUNCTION IF EXISTS public.save_lead_secure(TEXT, JSONB, TEXT);
DROP FUNCTION IF EXISTS public.update_lead_secure(TEXT, TEXT, JSONB, INTEGER);
DROP FUNCTION IF EXISTS public.delete_lead_secure(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.get_financial_records_secure(TEXT);
DROP FUNCTION IF EXISTS public.get_team_users_safe();
DROP FUNCTION IF EXISTS public.auth_get_user(TEXT);
DROP FUNCTION IF EXISTS public.sha256_hex(TEXT);

COMMIT;
