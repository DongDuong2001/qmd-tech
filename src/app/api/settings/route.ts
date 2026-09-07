import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/modules/settings/service";
import { verifyAdminToken, verifyJWT } from "@/shared/security/jwt";
import { ADMIN_COOKIE_NAME, AUTH_COOKIE_NAME } from "@/shared/security/cookies";

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
    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value || req.cookies.get("qmd_admin_session")?.value;
    const jwtToken = req.cookies.get(AUTH_COOKIE_NAME)?.value || req.cookies.get("qmd_access_token")?.value;

    let isAuthorized = false;

    if (adminToken) {
      const check = await verifyAdminToken(adminToken);
      if (check.valid) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized && jwtToken) {
      const jwtResult = await verifyJWT(jwtToken);
      if (
        jwtResult.valid &&
        jwtResult.payload &&
        (jwtResult.payload.role === "admin" || jwtResult.payload.email === (process.env.QMD_ADMIN_USER || "admin@qmd.tech"))
      ) {
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
