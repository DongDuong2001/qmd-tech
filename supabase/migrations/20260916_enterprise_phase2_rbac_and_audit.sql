-- ========================================================================
-- QMD-Tech Enterprise Platform Hardening - Phase 2
-- Migration: 20260916_enterprise_phase2_rbac_and_audit.sql
-- Description:
--   1. Create admin_users table for departmental RBAC accounts.
--   2. Create audit_logs table for immutable tracking of administrative actions.
--   3. Secure with RLS and search indices.
-- ========================================================================

-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'support',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public cannot read admin_users" ON public.admin_users;
CREATE POLICY "Public cannot read admin_users"
    ON public.admin_users
    FOR SELECT
    TO anon
    USING (false);

DROP POLICY IF EXISTS "Service role has full access to admin_users" ON public.admin_users;
CREATE POLICY "Service role has full access to admin_users"
    ON public.admin_users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id VARCHAR(100),
    admin_user_email VARCHAR(255),
    admin_role VARCHAR(50) DEFAULT 'admin',
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON public.audit_logs(admin_user_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public cannot read audit_logs" ON public.audit_logs;
CREATE POLICY "Public cannot read audit_logs"
    ON public.audit_logs
    FOR SELECT
    TO anon
    USING (false);

DROP POLICY IF EXISTS "Service role has full access to audit_logs" ON public.audit_logs;
CREATE POLICY "Service role has full access to audit_logs"
    ON public.audit_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
