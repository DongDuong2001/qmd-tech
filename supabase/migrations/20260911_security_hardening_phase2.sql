-- ========================================================================
-- QMD-Tech Production Security Hardening Phase 2
-- 1. Hardened Stock Decrement RPC (Input validation, search_path, execute permissions)
-- 2. Lockdown RLS on Orders and Order Items (Prevent anonymous direct insert)
-- 3. Atomic Checkout Procedure (Transactional order, items, and stock decrement)
-- 4. Order Capability Secret Token (order_access_token)
-- ========================================================================

-- 1. Hardened decrement_product_stock procedure
CREATE OR REPLACE FUNCTION decrement_product_stock(
    p_product_id UUID,
    p_quantity INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_rows INT;
BEGIN
    -- Strict input boundary validation: reject null, negative, zero or abnormally high quantity
    IF p_quantity IS NULL OR p_quantity <= 0 OR p_quantity > 50 THEN
        RETURN FALSE;
    END IF;

    UPDATE public.products
    SET
        stock = stock - p_quantity,
        updated_at = NOW()
    WHERE id = p_product_id
      AND stock >= p_quantity;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    RETURN v_rows > 0;
END;
$$;

-- Revoke public execution rights from public, anon, and authenticated
REVOKE EXECUTE ON FUNCTION decrement_product_stock(UUID, INT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION decrement_product_stock(UUID, INT) FROM anon;
REVOKE EXECUTE ON FUNCTION decrement_product_stock(UUID, INT) FROM authenticated;
GRANT EXECUTE ON FUNCTION decrement_product_stock(UUID, INT) TO service_role;

-- 2. Add Capability Secret Token to orders for secure unredacted guest lookup
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_access_token VARCHAR(64);
CREATE INDEX IF NOT EXISTS idx_orders_access_token ON orders(order_access_token);

-- 3. Lockdown RLS on orders and order_items (Prevent direct browser insert via anon key)
DROP POLICY IF EXISTS "Users can create orders with identity integrity" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON orders;

-- Drop any public insert on order_items
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Allow public insert on order_items" ON order_items;

-- Ensure orders and order_items RLS is active
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view only their own orders and items
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
              AND orders.user_id = auth.uid()
        )
    );

-- Allow service_role full administrative access to orders and order_items
DROP POLICY IF EXISTS "Service role orders full access" ON orders;
CREATE POLICY "Service role orders full access" ON orders
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role order_items full access" ON order_items;
CREATE POLICY "Service role order_items full access" ON order_items
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- 4. Atomic Checkout Procedure (Single Transaction: Stock Validation + Decrement + Order + Items)
CREATE OR REPLACE FUNCTION create_order_atomic(
    p_order JSONB,
    p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order_id UUID;
    v_item RECORD;
    v_product_id UUID;
    v_quantity INT;
    v_unit_price BIGINT;
    v_total_price BIGINT;
    v_rows INT;
BEGIN
    -- Extract order id or generate new one
    IF p_order->>'id' IS NOT NULL AND p_order->>'id' <> '' THEN
        v_order_id := (p_order->>'id')::UUID;
    ELSE
        v_order_id := uuid_generate_v4();
    END IF;

    -- Step A: Validate and atomically decrement stock for all items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_product_id := (v_item.value->>'product_id')::UUID;
        v_quantity := (v_item.value->>'quantity')::INT;

        IF v_quantity IS NULL OR v_quantity <= 0 OR v_quantity > 50 THEN
            RAISE EXCEPTION 'So luong san pham khong hop le: % (ID: %)', v_quantity, v_product_id;
        END IF;

        UPDATE public.products
        SET
            stock = stock - v_quantity,
            updated_at = NOW()
        WHERE id = v_product_id
          AND stock >= v_quantity;

        GET DIAGNOSTICS v_rows = ROW_COUNT;
        IF v_rows = 0 THEN
            RAISE EXCEPTION 'San pham % khong du ton kho de hoan tat don hang', v_product_id;
        END IF;
    END LOOP;

    -- Step B: Insert the order record
    INSERT INTO public.orders (
        id,
        order_code,
        user_id,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        shipping_city,
        shipping_district,
        status,
        subtotal_vnd,
        shipping_fee_vnd,
        discount_vnd,
        total_vnd,
        payment_method,
        payment_status,
        shipping_provider,
        custom_build_id,
        order_access_token,
        notes,
        created_at,
        updated_at
    ) VALUES (
        v_order_id,
        p_order->>'order_code',
        CASE WHEN p_order->>'user_id' IS NOT NULL AND p_order->>'user_id' <> '' THEN (p_order->>'user_id')::UUID ELSE NULL END,
        p_order->>'customer_name',
        COALESCE(p_order->>'customer_email', ''),
        p_order->>'customer_phone',
        p_order->>'shipping_address',
        COALESCE(p_order->>'shipping_city', 'Ha Noi'),
        COALESCE(p_order->>'shipping_district', ''),
        COALESCE(p_order->>'status', 'pending'),
        (p_order->>'subtotal_vnd')::BIGINT,
        COALESCE((p_order->>'shipping_fee_vnd')::BIGINT, 0),
        COALESCE((p_order->>'discount_vnd')::BIGINT, 0),
        (p_order->>'total_vnd')::BIGINT,
        COALESCE(p_order->>'payment_method', 'sepay'),
        COALESCE(p_order->>'payment_status', 'unpaid'),
        COALESCE(p_order->>'shipping_provider', 'ghn'),
        CASE WHEN p_order->>'custom_build_id' IS NOT NULL AND p_order->>'custom_build_id' <> '' THEN (p_order->>'custom_build_id')::UUID ELSE NULL END,
        p_order->>'order_access_token',
        COALESCE(p_order->>'notes', ''),
        NOW(),
        NOW()
    );

    -- Step C: Insert order items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_product_id := (v_item.value->>'product_id')::UUID;
        v_quantity := (v_item.value->>'quantity')::INT;
        v_unit_price := (v_item.value->>'unit_price_vnd')::BIGINT;
        v_total_price := COALESCE((v_item.value->>'total_price_vnd')::BIGINT, v_unit_price * v_quantity);

        INSERT INTO public.order_items (
            id,
            order_id,
            product_id,
            quantity,
            unit_price_vnd,
            total_price_vnd,
            created_at
        ) VALUES (
            CASE WHEN v_item.value->>'id' IS NOT NULL AND v_item.value->>'id' <> '' THEN (v_item.value->>'id')::UUID ELSE uuid_generate_v4() END,
            v_order_id,
            v_product_id,
            v_quantity,
            v_unit_price,
            v_total_price,
            NOW()
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_code', p_order->>'order_code'
    );
END;
$$;

-- Revoke public access to create_order_atomic, grant strictly to service_role
REVOKE EXECUTE ON FUNCTION create_order_atomic(JSONB, JSONB) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION create_order_atomic(JSONB, JSONB) FROM anon;
REVOKE EXECUTE ON FUNCTION create_order_atomic(JSONB, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION create_order_atomic(JSONB, JSONB) TO service_role;
