import { NextRequest, NextResponse } from "next/server";
import { builderService } from "@/modules/builder/service";
import { handleApiError } from "@/shared/middleware/errorHandler";
import { AUTH_COOKIE_NAME } from "@/shared/security/cookies";
import { verifyJWT } from "@/shared/security/jwt";
import { ComponentSlot, Product } from "@/shared/types";

import { getServiceSupabase } from "@/shared/db/supabase";

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

async function rehydrateSlots(rawSlots: unknown): Promise<Record<ComponentSlot, Product | null>> {
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

  const slotToIdMap = new Map<ComponentSlot, string>();
  for (const [key, value] of Object.entries(rawSlots)) {
    if (ALLOWED_SLOTS.has(key as ComponentSlot) && value && typeof value === "object") {
      const prodId = (value as { id?: string }).id;
      if (prodId && typeof prodId === "string") {
        slotToIdMap.set(key as ComponentSlot, prodId);
      }
    }
  }

  if (slotToIdMap.size === 0) {
    return result;
  }

  try {
    const productIds = Array.from(new Set(slotToIdMap.values()));
    const db = getServiceSupabase();
    const { data: dbProducts, error } = await db
      .from("products")
      .select("*")
      .in("id", productIds);

    if (!error && Array.isArray(dbProducts)) {
      const productMap = new Map<string, Product>(dbProducts.map((p) => [p.id, p as Product]));
      for (const [slot, id] of slotToIdMap.entries()) {
        const authoritativeProduct = productMap.get(id);
        if (authoritativeProduct) {
          result[slot] = authoritativeProduct;
        }
      }
    }
  } catch (err) {
    console.warn("Builder API: Product rehydration fallback notice:", err);
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, slots, build, quoteInput } = body;

    if (action === "evaluate") {
      const sanitizedSlots = await rehydrateSlots(slots);
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

      // Re-evaluate build authoritatively server-side to guarantee price and wattage integrity
      const slotsToEvaluate = await rehydrateSlots(build.items || slots);
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

