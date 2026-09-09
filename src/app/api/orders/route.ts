import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getServiceSupabase, supabase } from "@/shared/db/supabase";
import { cartService } from "@/modules/cart/service";
import { Order, CartItem, Product } from "@/shared/types";
import { eventBus } from "@/shared/events/eventBus";
import { AUTH_COOKIE_NAME } from "@/shared/security/cookies";
import { checkRateLimit, getClientIp } from "@/shared/security/rateLimiter";
import { requireAdmin } from "@/shared/security/adminAuth";
import { verifyJWT } from "@/shared/security/jwt";

function maskName(name?: string | null): string {
  if (!name) return "***";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].length <= 2 ? `${parts[0][0]}***` : `${parts[0][0]}***${parts[0].slice(-1)}`;
  }
  return `${parts[0]} *** ${parts[parts.length - 1]}`;
}

function maskEmail(email?: string | null): string {
  if (!email || !email.includes("@")) return "***@***.***";
  const [local, domain] = email.split("@");
  const maskedLocal = local.length <= 2 ? `${local[0]}***` : `${local[0]}***${local.slice(-1)}`;
  return `${maskedLocal}@${domain}`;
}

function maskPhone(phone?: string | null): string {
  if (!phone) return "***";
  const clean = phone.replace(/\s+/g, "");
  if (clean.length < 6) return "***";
  return `${clean.slice(0, 3)}****${clean.slice(-2)}`;
}

function maskAddress(address?: string | null, city?: string | null): string {
  if (!address) return city || "***";
  return `***, ${city || "Việt Nam"}`;
}

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(ip, "get_order", 20, 60);
    if (!rl.success) {
      return NextResponse.json({ success: false, error: rl.error }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!code || !/^[A-Z0-9_-]{3,50}$/.test(code)) {
      return NextResponse.json({ success: false, error: "Mã đơn hàng không hợp lệ." }, { status: 400 });
    }

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("orders")
      .select("*, order_items(*, product:products(*))")
      .eq("order_code", code)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Không tìm thấy đơn hàng." }, { status: 404 });
    }

    // Check if requester is Admin
    const adminCheck = await requireAdmin(req);
    const isAdmin = adminCheck.authorized;

    // Check if requester is authenticated Order Owner
    let isOwner = false;
    const userToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (userToken && data.user_id) {
      const verified = await verifyJWT(userToken);
      if (verified.valid && verified.payload?.sub === data.user_id) {
        isOwner = true;
      }
    }

function timingSafeStringEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

    // Check if requester provided valid order_access_token (guest capability secret token)
    const queryToken = searchParams.get("token")?.trim();
    const headerToken = req.headers.get("x-order-token")?.trim();
    const providedToken = queryToken || headerToken;
    const hasValidAccessToken = !!(
      providedToken &&
      data.order_access_token &&
      timingSafeStringEqual(providedToken, data.order_access_token)
    );

    // Full order details for Admin, Owner, or possessor of valid order_access_token
    if (isAdmin || isOwner || hasValidAccessToken) {
      return NextResponse.json({ success: true, order: data, isRedacted: false });
    }

    // Redacted public order tracking response for anonymous inquiries (anti-IDOR & PII leak prevention)
    const redactedOrder = {
      id: data.id,
      order_code: data.order_code,
      status: data.status,
      payment_status: data.payment_status,
      payment_method: data.payment_method,
      shipping_provider: data.shipping_provider,
      tracking_code: data.tracking_code,
      total_vnd: data.total_vnd,
      subtotal_vnd: data.subtotal_vnd,
      shipping_fee_vnd: data.shipping_fee_vnd,
      discount_vnd: data.discount_vnd,
      created_at: data.created_at,
      customer_name: maskName(data.customer_name),
      customer_email: maskEmail(data.customer_email),
      customer_phone: maskPhone(data.customer_phone),
      shipping_city: data.shipping_city,
      shipping_district: data.shipping_district,
      shipping_address: maskAddress(data.shipping_address, data.shipping_city),
      order_items: Array.isArray(data.order_items)
        ? data.order_items.map((item: {
            id: string;
            product_id: string;
            quantity: number;
            unit_price_vnd: number;
            total_price_vnd: number;
            product?: {
              id: string;
              name_vi: string;
              name_en: string;
              slug: string;
              images: string[];
            } | null;
          }) => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price_vnd: item.unit_price_vnd,
            total_price_vnd: item.total_price_vnd,
            product: item.product
              ? {
                  id: item.product.id,
                  name_vi: item.product.name_vi,
                  name_en: item.product.name_en,
                  slug: item.product.slug,
                  images: item.product.images,
                }
              : null,
          }))
        : [],
    };

    return NextResponse.json({ success: true, order: redactedOrder, isRedacted: true });
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
      shippingProvider = "standard",
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

    // 3. Fetch products authoritatively from database to verify stock and price (Fail Closed)
    const productIds = Array.from(new Set(items.map((i: { product_id: string }) => i.product_id)));
    const db = getServiceSupabase();

    const { data: dbData, error: dbError } = await db
      .from("products")
      .select("*")
      .in("id", productIds)
      .eq("is_active", true);

    if (dbError) {
      console.error("Orders API: Database error looking up products:", dbError);
      return NextResponse.json(
        { success: false, error: "Hệ thống đang bận, không thể xác thực sản phẩm. Vui lòng thử lại sau." },
        { status: 503 }
      );
    }

    const dbProducts: Product[] = (dbData as Product[]) || [];
    const productMap = new Map<string, Product>(dbProducts.map((p) => [p.id, p]));

    // 4. Construct verified items strictly with authoritative prices & check stock
    const verifiedItems: CartItem[] = [];
    for (const rawItem of items) {
      const product = productMap.get(rawItem.product_id);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Sản phẩm với mã "${rawItem.product_id}" không tồn tại hoặc đã ngừng kinh doanh.` },
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
    const orderAccessToken = crypto.randomBytes(32).toString("hex");

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
      order_access_token: orderAccessToken,
      notes: notes || "",
      created_at: new Date().toISOString(),
      items: verifiedItems,
    };

    // Prepare atomic checkout payloads
    const orderPayload = {
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
      order_access_token: order.order_access_token,
      notes: order.notes,
    };

    const orderItemsPayload = verifiedItems.map((item) => ({
      id: crypto.randomUUID(),
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price_vnd: item.unit_price_vnd,
      total_price_vnd: item.total_price_vnd,
    }));

    // 6. Execute atomic transaction via create_order_atomic RPC (Single DB Transaction)
    const { data: rpcData, error: rpcError } = await db.rpc("create_order_atomic", {
      p_order: orderPayload,
      p_items: orderItemsPayload,
    });

    if (rpcError) {
      console.error("create_order_atomic RPC error:", rpcError);
      // Check for business validation errors from RPC (e.g. stock exhaustion or invalid quantity)
      if (
        rpcError.message?.includes("ton kho") ||
        rpcError.message?.includes("So luong") ||
        rpcError.message?.includes("khong ton tai")
      ) {
        return NextResponse.json(
          { success: false, error: rpcError.message },
          { status: 409 }
        );
      }

      // Fail-closed: Never fallback to partial non-atomic insert
      return NextResponse.json(
        {
          success: false,
          error: "Hệ thống xử lý đơn hàng đang bận hoặc gặp sự cố tạm thời. Vui lòng thử lại sau.",
        },
        { status: 503 }
      );
    }

    if (!rpcData) {
      return NextResponse.json(
        {
          success: false,
          error: "Không thể khởi tạo đơn hàng. Giao dịch đã được hủy an toàn.",
        },
        { status: 500 }
      );
    }

    if (typeof rpcData === "object" && rpcData !== null && "total_vnd" in rpcData) {
      const canonicalTotal = Number((rpcData as Record<string, unknown>).total_vnd);
      if (!Number.isNaN(canonicalTotal) && canonicalTotal > 0) {
        order.total_vnd = canonicalTotal;
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
