import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/modules/payments/service";
import { SePayWebhookPayload } from "@/modules/payments/types";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const body: SePayWebhookPayload = await req.json();

    const result = await paymentService.processSePayWebhook(body, authHeader);

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xử lý webhook SePay.";
    console.warn("SePay Webhook Warning:", msg);
    return NextResponse.json(
      {
        success: false,
        error: msg,
      },
      { status: 400 }
    );
  }
}
