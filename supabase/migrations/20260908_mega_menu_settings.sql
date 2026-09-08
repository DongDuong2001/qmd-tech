-- ========================================================================
-- Mega Menu Customization Settings Schema (PostgreSQL / Supabase)
-- ========================================================================

CREATE TABLE IF NOT EXISTS mega_menu_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_key VARCHAR(50) UNIQUE NOT NULL DEFAULT 'main_header_menu',
    categories JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE mega_menu_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public mega_menu_settings read" ON mega_menu_settings;
CREATE POLICY "Public mega_menu_settings read" ON mega_menu_settings
    FOR SELECT USING (true);

-- Service role full access
DROP POLICY IF EXISTS "Service role mega_menu_settings manage" ON mega_menu_settings;
CREATE POLICY "Service role mega_menu_settings manage" ON mega_menu_settings
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
