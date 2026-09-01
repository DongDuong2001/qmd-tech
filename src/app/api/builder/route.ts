import { NextRequest, NextResponse } from "next/server";
import { builderService } from "@/modules/builder/service";
import { handleApiError } from "@/shared/middleware/errorHandler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, slots, build, quoteInput } = body;

    if (action === "evaluate") {
      const evaluation = builderService.evaluateBuild(slots);
      return NextResponse.json({ success: true, data: evaluation });
    }

    if (action === "save") {
      const result = await builderService.saveBuild(build);
      return NextResponse.json({ success: true, data: result });
    }

    if (action === "quote") {
      const result = await builderService.requestQuote(quoteInput);
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json(
      { success: false, error: { message: "Invalid action" } },
      { status: 400 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
