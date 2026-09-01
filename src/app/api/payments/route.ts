import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/modules/payments/service";
import { handleApiError } from "@/shared/middleware/errorHandler";

export async function POST(request: NextRequest) {
  try {
    const { provider, paymentInput } = await request.json();
    const result = await paymentService.createPayment(provider, paymentInput);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
