import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/modules/settings/service";
import { verifyJwt } from "@/shared/security/jwt";

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
    // Admin Authorization Check
    const adminToken = req.cookies.get("qmd_admin_session")?.value;
    const jwtToken = req.cookies.get("qmd_access_token")?.value;

    let isAuthorized = false;

    if (adminToken && adminToken.length > 5) {
      isAuthorized = true;
    } else if (jwtToken) {
      const payload = await verifyJwt(jwtToken);
      if (payload && (payload.role === "admin" || payload.email === process.env.QMD_ADMIN_USER)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required." },
        { status: 401 }
      );
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
