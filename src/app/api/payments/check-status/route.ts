import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/modules/orders/service";
import { checkRateLimit, getClientIp } from "@/shared/security/rateLimiter";

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(ip, "check-payment-status", 30, 60);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: rl.error },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderCode = searchParams.get("orderCode")?.trim();

    if (!orderCode || !/^[A-Za-z0-9_-]{3,50}$/.test(orderCode)) {
      return NextResponse.json(
        { success: false, error: "Mã đơn hàng không hợp lệ." },
        { status: 400 }
      );
    }

    const order = await orderService.getOrderByCode(orderCode);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy đơn hàng." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentStatus: order.payment_status,
      status: order.status,
      isPaid: order.payment_status === "paid",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi kiểm tra trạng thái thanh toán.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

