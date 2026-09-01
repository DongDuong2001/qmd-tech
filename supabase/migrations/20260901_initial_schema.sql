-- ========================================================================
-- QMD-Tech Database Schema (PostgreSQL / Supabase)
-- Modular Monolith: Catalog, Custom PC Builder, Cart, Orders, Reviews
-- ========================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_vi VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    sort_order INT DEFAULT 0,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name_vi VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    desc_vi TEXT,
    desc_en TEXT,
    price_vnd BIGINT NOT NULL CHECK (price_vnd >= 0),
    original_price_vnd BIGINT CHECK (original_price_vnd >= price_vnd),
    price_usd NUMERIC(10, 2) DEFAULT 0,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    brand VARCHAR(100) NOT NULL,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    images TEXT[] NOT NULL DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    warranty_months INT DEFAULT 36,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance & search
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_search_vi ON products USING gin(name_vi gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_search_en ON products USING gin(name_en gin_trgm_ops);

-- 3. Compatibility Rules
CREATE TABLE IF NOT EXISTS compatibility_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    component_type_a VARCHAR(50) NOT NULL, -- e.g. 'cpu'
    component_type_b VARCHAR(50) NOT NULL, -- e.g. 'motherboard'
    rule_type VARCHAR(50) NOT NULL,        -- 'socket_match', 'ram_type', 'tdp_headroom', 'form_factor', 'gpu_clearance'
    rule_value JSONB NOT NULL,
    description_vi TEXT,
    description_en TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Custom Builds
CREATE TABLE IF NOT EXISTS builds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'Custom PC Build',
    share_token VARCHAR(64) UNIQUE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, saved, ordered, quoted
    total_price_vnd BIGINT NOT NULL DEFAULT 0,
    estimated_wattage INT NOT NULL DEFAULT 0,
    performance_tier VARCHAR(50) DEFAULT 'mid_range', -- budget, mid_range, high_end, enthusiast
    compatibility_status VARCHAR(50) DEFAULT 'compatible', -- compatible, warning, incompatible
    notes TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Build Items
CREATE TABLE IF NOT EXISTS build_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    build_id UUID NOT NULL REFERENCES builds(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    slot_type VARCHAR(50) NOT NULL, -- 'cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case', 'cooler'
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price_vnd BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(32) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_district VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, shipping, completed, cancelled
    subtotal_vnd BIGINT NOT NULL,
    shipping_fee_vnd BIGINT NOT NULL DEFAULT 0,
    discount_vnd BIGINT NOT NULL DEFAULT 0,
    total_vnd BIGINT NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- vnpay, momo, zalopay, stripe, cod, bank_transfer
    payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid', -- unpaid, paid, failed, refunded
    payment_transaction_id VARCHAR(255),
    shipping_provider VARCHAR(50), -- ghn, ghtk, express
    tracking_code VARCHAR(100),
    custom_build_id UUID REFERENCES builds(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price_vnd BIGINT NOT NULL,
    total_price_vnd BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Customer Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT NOT NULL,
    locale VARCHAR(10) DEFAULT 'vi',
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- Row Level Security (RLS) Policies
-- ========================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public products read" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public compatibility rules read" ON compatibility_rules FOR SELECT USING (true);
CREATE POLICY "Public reviews read" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public builds read if public" ON builds FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- User-scoped policies
CREATE POLICY "Users can create and manage their own builds" ON builds
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view and manage their build items" ON build_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM builds WHERE builds.id = build_items.build_id AND builds.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
