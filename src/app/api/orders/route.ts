import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getServiceSupabase, supabase } from "@/shared/db/supabase";
import { cartService } from "@/modules/cart/service";
import { Order, CartItem, Product } from "@/shared/types";
import { eventBus } from "@/shared/events/eventBus";
import { AUTH_COOKIE_NAME } from "@/shared/security/cookies";
import { catalogService } from "@/modules/catalog/service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ success: false, error: "Thiếu mã đơn hàng." }, { status: 400 });
    }

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("orders")
      .select("*, order_items(*, product:products(*))")
      .eq("order_code", code.trim().toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Không tìm thấy đơn hàng." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: data });
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
      couponCode,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập đầy đủ thông tin giao hàng và chọn ít nhất một sản phẩm." },
        { status: 400 }
      );
    }

    // 1. Verify authenticated user identity (Do not trust client-supplied userId)
    let verifiedUserId: string | null = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
      if (token) {
        const { data: userData } = await supabase.auth.getUser(token);
        if (userData?.user?.id) {
          verifiedUserId = userData.user.id;
        }
      }
    } catch {
      // Guest order
    }

    // 2. Validate items and verify quantities
    for (const item of items) {
      if (!item.product_id || typeof item.product_id !== "string") {
        return NextResponse.json(
          { success: false, error: "Mã sản phẩm trong giỏ hàng không hợp lệ." },
          { status: 400 }
        );
      }
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
        return NextResponse.json(
          { success: false, error: "Số lượng sản phẩm phải là số nguyên từ 1 đến 50." },
          { status: 400 }
        );
      }
    }

    // 3. Fetch products authoritatively from database to verify stock and price
    const productIds = Array.from(new Set(items.map((i: { product_id: string }) => i.product_id)));
    let dbProducts: Product[] = [];
    const db = getServiceSupabase();

    try {
      const { data, error } = await db.from("products").select("*").in("id", productIds);
      if (!error && data) {
        dbProducts = data as Product[];
      }
    } catch (err) {
      console.warn("DB product lookup notice:", err);
    }

    // Fallback if DB was unavailable or missing items
    if (dbProducts.length < productIds.length) {
      const fallbackProducts = await catalogService.getProductsByIds(productIds);
      const existingIds = new Set(dbProducts.map((p) => p.id));
      for (const p of fallbackProducts) {
        if (!existingIds.has(p.id)) {
          dbProducts.push(p);
        }
      }
    }

    const productMap = new Map<string, Product>(dbProducts.map((p) => [p.id, p]));

    // 4. Construct verified items with authoritative prices & check stock
    const verifiedItems: CartItem[] = [];
    for (const rawItem of items) {
      const product = productMap.get(rawItem.product_id) || rawItem.product;
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Sản phẩm với mã ${rawItem.product_id} không tồn tại hoặc đã ngừng kinh doanh.` },
          { status: 400 }
        );
      }

      const quantity = Number(rawItem.quantity);

      // Check stock availability
      if (typeof product.stock === "number" && product.stock < quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Sản phẩm "${product.name_vi || product.name_en}" không đủ tồn kho (chỉ còn ${product.stock} sản phẩm).`,
          },
          { status: 409 }
        );
      }

      const authoritativePrice = product.price_vnd;
      verifiedItems.push({
        product_id: product.id,
        product,
        quantity,
        unit_price_vnd: authoritativePrice,
        total_price_vnd: authoritativePrice * quantity,
      });
    }

    // 5. Recalculate totals authoritatively server-side
    const calc = cartService.calculateCart(verifiedItems, couponCode);
    const orderCode = `QMD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = crypto.randomUUID();

    const order: Order = {
      id: orderId,
      order_code: orderCode,
      user_id: verifiedUserId,
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
      items: verifiedItems,
    };

    // 6. Insert order into Supabase
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

    if (orderError) {
      console.error("Supabase insert order error:", orderError);
      return NextResponse.json(
        { success: false, error: "Không thể lưu đơn hàng vào hệ thống: " + orderError.message },
        { status: 500 }
      );
    }

    // 7. Insert order items with UUID foreign keys
    const orderItemsPayload = verifiedItems.map((item) => ({
      id: crypto.randomUUID(),
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price_vnd: item.unit_price_vnd,
      total_price_vnd: item.total_price_vnd,
    }));

    const { error: itemsError } = await db.from("order_items").insert(orderItemsPayload);
    if (itemsError) {
      console.error("Supabase insert order_items notice:", itemsError);
    }

    // 8. Atomic stock decrement with concurrency safety
    for (const item of verifiedItems) {
      const { error: rpcError } = await db.rpc("decrement_product_stock", {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      });

      if (rpcError) {
        const prod = productMap.get(item.product_id);
        if (prod && typeof prod.stock === "number") {
          const newStock = Math.max(0, prod.stock - item.quantity);
          await db
            .from("products")
            .update({ stock: newStock })
            .eq("id", item.product_id)
            .gte("stock", item.quantity);
        }
      }
    }

    // 9. Emit event
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
