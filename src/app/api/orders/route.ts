import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/shared/db/supabase";
import { cartService } from "@/modules/cart/service";
import { Order, CartItem } from "@/shared/types";
import { eventBus } from "@/shared/events/eventBus";

// In-memory fallback cache for orders
let cachedOrders: Order[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ success: false, error: "Thiếu mã đơn hàng." }, { status: 400 });
    }

    // Try Supabase Service Role
    try {
      const db = getServiceSupabase();
      const { data, error } = await db
        .from("orders")
        .select("*, order_items(*, product:products(*))")
        .eq("order_code", code)
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, order: data });
      }
    } catch {
      // Fallback to memory
    }

    const cached = cachedOrders.find((o) => o.order_code.toUpperCase() === code.toUpperCase());
    if (cached) {
      return NextResponse.json({ success: true, order: cached });
    }

    return NextResponse.json({ success: false, error: "Không tìm thấy đơn hàng." }, { status: 404 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi tìm kiếm đơn hàng.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingDistrict,
      paymentMethod = "sepay",
      shippingProvider = "ghn",
      items = [],
      notes,
      customBuildId,
      userId,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập đầy đủ thông tin giao hàng và chọn ít nhất một sản phẩm." },
        { status: 400 }
      );
    }

    const calc = cartService.calculateCart(items as CartItem[]);
    const orderCode = `QMD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `order-${Date.now()}`;

    const order: Order = {
      id: orderId,
      order_code: orderCode,
      user_id: userId || null,
      customer_name: customerName.trim(),
      customer_email: customerEmail?.trim() || "",
      customer_phone: customerPhone.trim(),
      shipping_address: shippingAddress.trim(),
      shipping_city: shippingCity || "Hà Nội",
      shipping_district: shippingDistrict || "",
      status: "pending",
      subtotal_vnd: calc.cart.subtotal_vnd,
      shipping_fee_vnd: calc.cart.shipping_fee_vnd,
      discount_vnd: calc.cart.discount_vnd,
      total_vnd: calc.cart.total_vnd,
      payment_method: paymentMethod,
      payment_status: "unpaid",
      shipping_provider: shippingProvider,
      custom_build_id: customBuildId,
      notes: notes || "",
      created_at: new Date().toISOString(),
      items: items as CartItem[],
    };

    // 1. Insert into Supabase Orders via Service Role
    try {
      const db = getServiceSupabase();
      const { error: orderError } = await db.from("orders").insert({
        id: order.id,
        order_code: order.order_code,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        shipping_address: order.shipping_address,
        shipping_city: order.shipping_city,
        shipping_district: order.shipping_district,
        status: order.status,
        subtotal_vnd: order.subtotal_vnd,
        shipping_fee_vnd: order.shipping_fee_vnd,
        discount_vnd: order.discount_vnd,
        total_vnd: order.total_vnd,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        shipping_provider: order.shipping_provider,
        custom_build_id: order.custom_build_id,
        notes: order.notes,
      });

      if (!orderError) {
        try {
          const orderItemsPayload = (items as CartItem[]).map((item) => ({
            id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price_vnd: item.unit_price_vnd,
            total_price_vnd: item.total_price_vnd,
          }));
          await db.from("order_items").insert(orderItemsPayload);
        } catch {
          // Ignore order_items insert error if table doesn't exist
        }
      }
    } catch (dbErr) {
      console.warn("Supabase insert order notice:", dbErr);
    }

    // 2. Add to cache
    cachedOrders = [order, ...cachedOrders.filter((o) => o.id !== order.id)];

    // 3. Emit event
    await eventBus.emit("order:created", {
      orderId: order.id,
      orderCode: order.order_code,
      totalVnd: order.total_vnd,
      customerEmail: order.customer_email,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      data: order,
      order,
      message: "Đặt hàng thành công!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi tạo đơn hàng.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
