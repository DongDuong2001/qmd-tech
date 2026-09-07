import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/modules/payments/service";
import { sepayAdapter } from "@/modules/payments/adapters/sepay";
import { SePayWebhookPayload } from "@/modules/payments/types";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!sepayAdapter.verifyWebhookAuth(authHeader)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: API Key không hợp lệ hoặc bị thiếu.",
        },
        { status: 401 }
      );
    }

    let body: SePayWebhookPayload;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Bad Request: Dữ liệu JSON không hợp lệ.",
        },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Bad Request: Dữ liệu webhook không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const result = await paymentService.processSePayWebhook(body, authHeader);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xử lý webhook SePay.";
    console.error("SePay Webhook Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: msg,
      },
      { status: 500 }
    );
  }
}

