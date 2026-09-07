import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/modules/settings/service";
import { requireAdmin } from "@/shared/security/adminAuth";

export async function GET() {
  try {
    const settings = await settingsService.getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load settings";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const body = await req.json();
    const updated = await settingsService.updateSettings(body);

    return NextResponse.json({
      success: true,
      message: "Cập nhật cấu hình website thành công!",
      settings: updated,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update settings";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
