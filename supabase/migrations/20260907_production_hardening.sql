-- ========================================================================
-- QMD-Tech Production Hardening Migration: 20260907
-- Tightened RLS, Atomic Stock Decrement, State Machine Integrity & Constraints
-- ========================================================================

-- 1. Drop overpermissive order insert policy and recreate with identity binding
DROP POLICY IF EXISTS "Users can create orders" ON orders;

CREATE POLICY "Users can create orders with identity integrity" ON orders
    FOR INSERT WITH CHECK (
        (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
        (auth.uid() IS NULL AND user_id IS NULL)
    );

-- 2. Allow guest and authenticated custom build creation
DROP POLICY IF EXISTS "Users can create and manage their own builds" ON builds;

CREATE POLICY "Users and guests can manage builds" ON builds
    FOR ALL USING (
        is_public = true OR
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    ) WITH CHECK (
        (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
        (user_id IS NULL)
    );

DROP POLICY IF EXISTS "Users can view and manage their build items" ON build_items;

CREATE POLICY "Users and guests can manage build items" ON build_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM builds 
            WHERE builds.id = build_items.build_id 
              AND (builds.is_public = true OR builds.user_id = auth.uid())
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM builds 
            WHERE builds.id = build_items.build_id 
              AND (builds.user_id IS NULL OR builds.user_id = auth.uid())
        )
    );

-- 3. Data Integrity & State Machine CHECK Constraints
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_payment_status'
    ) THEN
        ALTER TABLE orders ADD CONSTRAINT chk_orders_payment_status
            CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_status'
    ) THEN
        ALTER TABLE orders ADD CONSTRAINT chk_orders_status
            CHECK (status IN ('pending', 'processing', 'shipping', 'completed', 'cancelled'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_payment_method'
    ) THEN
        ALTER TABLE orders ADD CONSTRAINT chk_orders_payment_method
            CHECK (payment_method IN ('vnpay', 'momo', 'zalopay', 'stripe', 'cod', 'bank_transfer', 'sepay'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_stock_non_negative'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT chk_products_stock_non_negative
            CHECK (stock >= 0);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_price_non_negative'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT chk_products_price_non_negative
            CHECK (price_vnd >= 0);
    END IF;
END $$;

-- 4. Unique Transaction ID to Prevent Payment Replay Attacks
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_payment_transaction_id 
    ON orders(payment_transaction_id) 
    WHERE payment_transaction_id IS NOT NULL;

-- 5. Atomic Stock Decrement Procedure
CREATE OR REPLACE FUNCTION decrement_product_stock(
    p_product_id UUID,
    p_quantity INT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_rows INT;
BEGIN
    UPDATE products
    SET stock = stock - p_quantity,
        updated_at = NOW()
    WHERE id = p_product_id AND stock >= p_quantity;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    RETURN v_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
