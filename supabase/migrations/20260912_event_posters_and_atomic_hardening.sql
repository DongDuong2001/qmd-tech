-- ========================================================================
-- QMD-Tech Security Hardening Phase 3 & Event Posters Architecture
-- Migration: 20260912_event_posters_and_atomic_hardening.sql
-- Description:
--   1. Add position column to banners table for middle carousel and side banners.
--   2. Hardened create_order_atomic RPC using core gen_random_uuid() and defense-in-depth price verification.
-- ========================================================================

-- 1. Add position column to banners table if it does not exist
ALTER TABLE IF EXISTS public.banners 
    ADD COLUMN IF NOT EXISTS position VARCHAR(50) DEFAULT 'hero';

CREATE INDEX IF NOT EXISTS idx_banners_position_active 
    ON public.banners (position, is_active, display_order);

-- 2. Hardened create_order_atomic RPC using core gen_random_uuid()
CREATE OR REPLACE FUNCTION create_order_atomic(
    p_order JSONB,
    p_items JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_product_id UUID;
    v_quantity INT;
    v_rows INT;
    v_created_order JSONB;
    v_unit_price BIGINT;
    v_canonical_subtotal BIGINT := 0;
    v_shipping_fee BIGINT;
    v_discount BIGINT;
    v_total BIGINT;
BEGIN
    -- Secure search_path to prevent hijacking
    SET search_path = public, extensions;

    -- Validate input items presence
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Don hang phai co it nhat mot san pham hop le';
    END IF;

    -- Resolve or generate Order ID safely using gen_random_uuid()
    IF p_order->>'id' IS NOT NULL AND p_order->>'id' <> '' THEN
        v_order_id := (p_order->>'id')::UUID;
    ELSE
        v_order_id := gen_random_uuid();
    END IF;

    -- Step A: Validate stock and atomically decrement stock for all items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_product_id := (v_item.value->>'product_id')::UUID;
        v_quantity := (v_item.value->>'quantity')::INT;

        -- Strict quantity boundary validation (1 .. 50)
        IF v_quantity IS NULL OR v_quantity <= 0 OR v_quantity > 50 THEN
            RAISE EXCEPTION 'So luong san pham khong hop le: % (ID: %)', v_quantity, v_product_id;
        END IF;

        -- Verify product exists and fetch authoritative price (defense-in-depth)
        SELECT price_vnd INTO v_unit_price
        FROM public.products
        WHERE id = v_product_id;

        IF v_unit_price IS NULL THEN
            RAISE EXCEPTION 'San pham % khong ton tai trong he thong', v_product_id;
        END IF;

        v_canonical_subtotal := v_canonical_subtotal + (v_unit_price * v_quantity);

        -- Atomically decrement stock with row lock
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

    v_shipping_fee := COALESCE((p_order->>'shipping_fee_vnd')::BIGINT, 0);
    v_discount := COALESCE((p_order->>'discount_vnd')::BIGINT, 0);
    v_total := GREATEST(0, v_canonical_subtotal + v_shipping_fee - v_discount);

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
        v_canonical_subtotal,
        v_shipping_fee,
        v_discount,
        v_total,
        COALESCE(p_order->>'payment_method', 'sepay'),
        COALESCE(p_order->>'payment_status', 'unpaid'),
        COALESCE(p_order->>'shipping_provider', 'standard'),
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

        SELECT price_vnd INTO v_unit_price
        FROM public.products
        WHERE id = v_product_id;

        INSERT INTO public.order_items (
            id,
            order_id,
            product_id,
            quantity,
            unit_price_vnd,
            total_price_vnd,
            created_at
        ) VALUES (
            CASE WHEN v_item.value->>'id' IS NOT NULL AND v_item.value->>'id' <> '' THEN (v_item.value->>'id')::UUID ELSE gen_random_uuid() END,
            v_order_id,
            v_product_id,
            v_quantity,
            v_unit_price,
            v_unit_price * v_quantity,
            NOW()
        );
    END LOOP;

    -- Step D: Return created order details
    SELECT json_build_object(
        'id', o.id,
        'order_code', o.order_code,
        'status', o.status,
        'total_vnd', o.total_vnd,
        'order_access_token', o.order_access_token,
        'created_at', o.created_at
    )::JSONB INTO v_created_order
    FROM public.orders o
    WHERE o.id = v_order_id;

    RETURN v_created_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Lock down execution to service_role only
REVOKE EXECUTE ON FUNCTION create_order_atomic(JSONB, JSONB) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION create_order_atomic(JSONB, JSONB) FROM anon;
REVOKE EXECUTE ON FUNCTION create_order_atomic(JSONB, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION create_order_atomic(JSONB, JSONB) TO service_role;
