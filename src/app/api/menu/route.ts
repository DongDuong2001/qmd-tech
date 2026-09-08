import { NextResponse } from "next/server";
import { menuService } from "@/modules/menu/service";

export async function GET() {
  try {
    const categories = await menuService.getMenu();
    return NextResponse.json({ success: true, categories });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch menu categories.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
