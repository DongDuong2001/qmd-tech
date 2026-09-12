-- ========================================================================
-- QMD-Tech Enterprise Platform Hardening - Phase 3
-- Migration: 20260917_enterprise_phase3_serial_and_rma.sql
-- Description:
--   1. Create product_serials table for hardware serial / IMEI tracking.
--   2. Create warranty_tickets table for RMA lifecycle management.
--   3. Enable RLS and performance indices.
-- ========================================================================

-- 1. Create product_serials table
CREATE TABLE IF NOT EXISTS public.product_serials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    serial_number VARCHAR(150) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'in_stock',
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    customer_phone VARCHAR(50),
    warranty_months INT DEFAULT 36,
    sold_at TIMESTAMPTZ,
    warranty_expires_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_serials_sn ON public.product_serials(serial_number);
CREATE INDEX IF NOT EXISTS idx_product_serials_product ON public.product_serials(product_id);
CREATE INDEX IF NOT EXISTS idx_product_serials_order ON public.product_serials(order_id);
CREATE INDEX IF NOT EXISTS idx_product_serials_phone ON public.product_serials(customer_phone);

ALTER TABLE public.product_serials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active warranty serials" ON public.product_serials;
CREATE POLICY "Public can view active warranty serials"
    ON public.product_serials
    FOR SELECT
    TO anon
    USING (true);

DROP POLICY IF EXISTS "Service role has full access to product_serials" ON public.product_serials;
CREATE POLICY "Service role has full access to product_serials"
    ON public.product_serials
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. Create warranty_tickets (RMA) table
CREATE TABLE IF NOT EXISTS public.warranty_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    serial_number VARCHAR(150) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    issue_description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'received',
    technician_notes TEXT,
    vendor_rma_code VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_warranty_tickets_code ON public.warranty_tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_warranty_tickets_phone ON public.warranty_tickets(customer_phone);
CREATE INDEX IF NOT EXISTS idx_warranty_tickets_sn ON public.warranty_tickets(serial_number);
CREATE INDEX IF NOT EXISTS idx_warranty_tickets_status ON public.warranty_tickets(status);

ALTER TABLE public.warranty_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can lookup their own warranty tickets" ON public.warranty_tickets;
CREATE POLICY "Public can lookup their own warranty tickets"
    ON public.warranty_tickets
    FOR SELECT
    TO anon
    USING (true);

DROP POLICY IF EXISTS "Service role has full access to warranty_tickets" ON public.warranty_tickets;
CREATE POLICY "Service role has full access to warranty_tickets"
    ON public.warranty_tickets
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
