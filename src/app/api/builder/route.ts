import { NextRequest, NextResponse } from "next/server";
import { builderService } from "@/modules/builder/service";
import { handleApiError } from "@/shared/middleware/errorHandler";
import { AUTH_COOKIE_NAME } from "@/shared/security/cookies";
import { verifyJWT } from "@/shared/security/jwt";
import { ComponentSlot, Product } from "@/shared/types";

const ALLOWED_SLOTS = new Set<ComponentSlot>([
  "cpu",
  "motherboard",
  "ram",
  "gpu",
  "storage",
  "psu",
  "case",
  "cooling",
]);

function sanitizeSlots(rawSlots: unknown): Record<ComponentSlot, Product | null> {
  const result: Record<ComponentSlot, Product | null> = {
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    storage: null,
    psu: null,
    case: null,
    cooling: null,
  };

  if (!rawSlots || typeof rawSlots !== "object") {
    return result;
  }

  for (const [key, value] of Object.entries(rawSlots)) {
    if (ALLOWED_SLOTS.has(key as ComponentSlot) && value && typeof value === "object") {
      result[key as ComponentSlot] = value as Product;
    }
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, slots, build, quoteInput } = body;

    if (action === "evaluate") {
      const sanitizedSlots = sanitizeSlots(slots);
      const evaluation = builderService.evaluateBuild(sanitizedSlots);
      return NextResponse.json({ success: true, data: evaluation });
    }

    if (action === "save") {
      if (!build || typeof build !== "object") {
        return NextResponse.json(
          { success: false, error: { message: "Dữ liệu cấu hình không hợp lệ." } },
          { status: 400 }
        );
      }

      // Re-evaluate build server-side to guarantee price and wattage integrity
      const slotsToEvaluate = sanitizeSlots(build.items || slots);
      const evaluated = builderService.evaluateBuild(slotsToEvaluate);

      // Extract verified user id if logged in
      let userId: string | undefined;
      const userToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
      if (userToken) {
        const verified = await verifyJWT(userToken);
        if (verified.valid && verified.payload?.sub) {
          userId = String(verified.payload.sub);
        }
      }

      const result = await builderService.saveBuild(
        {
          ...evaluated,
          name: typeof build.name === "string" ? build.name.trim().slice(0, 100) : "Custom PC Configuration",
        },
        userId
      );
      return NextResponse.json({ success: true, data: result });
    }

    if (action === "quote") {
      if (!quoteInput || typeof quoteInput !== "object") {
        return NextResponse.json(
          { success: false, error: { message: "Dữ liệu yêu cầu báo giá không hợp lệ." } },
          { status: 400 }
        );
      }
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

