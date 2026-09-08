import { NextResponse } from "next/server";
import { careerService } from "@/modules/careers/service";

export async function GET() {
  try {
    const careers = await careerService.getPublicCareers();
    return NextResponse.json({ success: true, careers });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load careers.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
