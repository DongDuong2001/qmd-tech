-- ========================================================================
-- QMD-Tech Database Migration: Event Banners, Prebuilt Deals & Suppliers
-- ========================================================================

-- 1. Event Banners & Posters
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_vi VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    subtitle_vi TEXT,
    subtitle_en TEXT,
    tag VARCHAR(100) DEFAULT 'SỰ KIỆN',
    image_url TEXT NOT NULL,
    target_url VARCHAR(255) NOT NULL DEFAULT '/danh-muc',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Prebuilt PC Deals
CREATE TABLE IF NOT EXISTS prebuilt_deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_vi VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    code VARCHAR(100) UNIQUE NOT NULL,
    price_vnd BIGINT NOT NULL,
    original_price_vnd BIGINT,
    image_url TEXT NOT NULL,
    badge VARCHAR(100) DEFAULT 'DEAL HOT',
    cpu VARCHAR(255) NOT NULL,
    vga VARCHAR(255) NOT NULL,
    ram VARCHAR(255) NOT NULL,
    ssd VARCHAR(255) NOT NULL,
    psu VARCHAR(255),
    mainboard VARCHAR(255),
    case_name VARCHAR(255),
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    supplier_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Hardware Suppliers & Vendors
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    brands TEXT[] NOT NULL DEFAULT '{}',
    address TEXT,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE prebuilt_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Allow public read on prebuilt_deals" ON prebuilt_deals FOR SELECT USING (true);
CREATE POLICY "Allow public read on suppliers" ON suppliers FOR SELECT USING (true);

CREATE POLICY "Allow all on banners for service role" ON banners FOR ALL USING (true);
CREATE POLICY "Allow all on prebuilt_deals for service role" ON prebuilt_deals FOR ALL USING (true);
CREATE POLICY "Allow all on suppliers for service role" ON suppliers FOR ALL USING (true);
