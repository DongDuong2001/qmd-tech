-- ========================================================================
-- Site Settings & Flash Sale / Golden Hour Schema (PostgreSQL / Supabase)
-- ========================================================================

CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name VARCHAR(255) DEFAULT 'QMD-Tech',
    slogan TEXT DEFAULT 'Gaming PC & Linh Kien May Tinh Chuyen Nghiep',
    hotline VARCHAR(50) DEFAULT '1900.8888',
    hotline_support VARCHAR(50) DEFAULT '0988.888.888',
    support_email VARCHAR(255) DEFAULT 'contact@qmdtech.vn',
    business_model VARCHAR(50) DEFAULT 'online',
    business_model_text TEXT DEFAULT 'Ban hang & Lap rap PC Online Toan Quoc',
    headquarters_address TEXT DEFAULT 'So 18 Pho Cau Giay, Quan Cau Giay, Ha Noi',
    has_showrooms BOOLEAN DEFAULT false,
    showrooms JSONB DEFAULT '[]'::jsonb,
    bo_cong_thuong_registered BOOLEAN DEFAULT false,
    bo_cong_thuong_badge_url TEXT DEFAULT '',
    bo_cong_thuong_link TEXT DEFAULT '',
    bo_cong_thuong_license_no TEXT DEFAULT '',
    working_hours TEXT DEFAULT '8:30 - 21:00 (Tat ca cac ngay trong tuan)',
    facebook_url TEXT DEFAULT 'https://facebook.com/qmdtech',
    zalo_url TEXT DEFAULT 'https://zalo.me/0988888888',
    youtube_url TEXT DEFAULT 'https://youtube.com/@qmdtech',
    free_shipping_threshold_vnd BIGINT DEFAULT 5000000,
    flash_sale_enabled BOOLEAN DEFAULT true,
    flash_sale_title TEXT DEFAULT 'GIO VANG GIA TOT',
    flash_sale_subtitle TEXT DEFAULT 'Linh kien chinh hang • Bao hanh 1 doi 1 trong 30 ngay • So luong uu dai co han',
    flash_sale_end_time TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public site_settings read" ON site_settings;
CREATE POLICY "Public site_settings read" ON site_settings
    FOR SELECT USING (true);

-- Service role full access
DROP POLICY IF EXISTS "Service role site_settings manage" ON site_settings;
CREATE POLICY "Service role site_settings manage" ON site_settings
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');