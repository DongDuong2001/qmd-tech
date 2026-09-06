import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/modules/orders/service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderCode = searchParams.get("orderCode");

    if (!orderCode) {
      return NextResponse.json(
        { success: false, error: "Thiếu mã đơn hàng." },
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
