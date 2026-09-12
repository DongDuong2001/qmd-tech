-- ========================================================================
-- QMD-Tech Enterprise Platform Hardening - Phase 1
-- Migration: 20260915_enterprise_phase1_inventory_and_payments.sql
-- Description:
--   1. Create payment_transactions table for SePay webhook idempotency & audit.
--   2. Atomic RPC cancel_order_and_restock_atomic to restore inventory when cancelling orders.
--   3. Atomic RPC restock_order_items_atomic to restore inventory when deleting uncancelled orders.
-- ========================================================================

-- 1. Create payment_transactions table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    order_code VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'sepay',
    transaction_id VARCHAR(150) UNIQUE NOT NULL,
    amount_vnd BIGINT NOT NULL,
    transfer_type VARCHAR(20) NOT NULL DEFAULT 'in',
    account_number VARCHAR(100),
    content TEXT,
    raw_payload JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'success',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_code 
    ON public.payment_transactions(order_code);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_tx_id 
    ON public.payment_transactions(transaction_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at 
    ON public.payment_transactions(created_at DESC);

-- Enable RLS on payment_transactions
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public cannot read payment_transactions" ON public.payment_transactions;
CREATE POLICY "Public cannot read payment_transactions"
    ON public.payment_transactions
    FOR SELECT
    TO anon
    USING (false);

DROP POLICY IF EXISTS "Service role has full access to payment_transactions" ON public.payment_transactions;
CREATE POLICY "Service role has full access to payment_transactions"
    ON public.payment_transactions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. Atomic Order Cancellation and Restock RPC
CREATE OR REPLACE FUNCTION cancel_order_and_restock_atomic(
    p_order_id UUID,
    p_reason TEXT DEFAULT 'Huy bo boi quan tri vien',
    p_admin_user TEXT DEFAULT 'admin'
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
    v_restocked_count INT := 0;
BEGIN
    SET search_path = public, extensions;

    -- Lock order row for update
    SELECT * INTO v_order
    FROM public.orders
    WHERE id = p_order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Khong tim thay don hang % trong he thong', p_order_id;
    END IF;

    -- If already cancelled, do not restock again
    IF v_order.status = 'cancelled' THEN
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Don hang da o trang thai huy truoc do, khong can hoan kho.',
            'restocked_items', 0
        );
    END IF;

    -- Iterate through items and restore stock atomically
    FOR v_item IN 
        SELECT product_id, quantity 
        FROM public.order_items 
        WHERE order_id = p_order_id
    LOOP
        UPDATE public.products
        SET stock = stock + v_item.quantity,
            updated_at = NOW()
        WHERE id = v_item.product_id;

        v_restocked_count := v_restocked_count + v_item.quantity;
    END LOOP;

    -- Update order status to cancelled with notes
    UPDATE public.orders
    SET status = 'cancelled',
        notes = COALESCE(notes || E'\n', '') || '[HUY DON] ' || p_reason || ' (Boi: ' || p_admin_user || ' luc ' || NOW()::TEXT || ')',
        updated_at = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'order_code', v_order.order_code,
        'restocked_items', v_restocked_count,
        'status', 'cancelled'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Atomic Restock on Order Deletion RPC
CREATE OR REPLACE FUNCTION restock_order_items_atomic(
    p_order_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
    v_restocked_count INT := 0;
BEGIN
    SET search_path = public, extensions;

    SELECT * INTO v_order
    FROM public.orders
    WHERE id = p_order_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Don hang khong ton tai');
    END IF;

    -- If order was not cancelled, restore items before deletion
    IF v_order.status <> 'cancelled' THEN
        FOR v_item IN 
            SELECT product_id, quantity 
            FROM public.order_items 
            WHERE order_id = p_order_id
        LOOP
            UPDATE public.products
            SET stock = stock + v_item.quantity,
                updated_at = NOW()
            WHERE id = v_item.product_id;

            v_restocked_count := v_restocked_count + v_item.quantity;
        END LOOP;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', p_order_id,
        'restocked_items', v_restocked_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
