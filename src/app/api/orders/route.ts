import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/modules/orders/service";
import { handleApiError } from "@/shared/middleware/errorHandler";

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const order = await orderService.createOrder(input);

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
