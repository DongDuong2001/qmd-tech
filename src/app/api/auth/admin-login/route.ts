import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit, getClientIp } from "@/shared/security/rateLimiter";
import {
  ADMIN_COOKIE_NAME,
  getAdminCookieOptions,
  getClearCookieOptions,
} from "@/shared/security/cookies";
import { createAdminToken } from "@/shared/security/jwt";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, "admin_login", 5, 900); // 5 attempts per 15 mins
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Tài khoản tạm thời bị khóa do nhập sai nhiều lần. Vui lòng thử lại sau 15 phút.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, passcode } = body;

    // Default admin credentials configured via QMD_ADMIN_USER and QMD_ADMIN_PASSWORD
    const validUsername =
      process.env.QMD_ADMIN_USER ||
      process.env.ADMIN_USERNAME ||
      "admin@qmd.tech";
    const validPasscode =
      process.env.QMD_ADMIN_PASSWORD ||
      process.env.ADMIN_SECRET_PASSCODE ||
      "qmd@135";

    const isMatch =
      username?.trim().toLowerCase() === validUsername.toLowerCase() &&
      passcode === validPasscode;

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "Tên đăng nhập hoặc mật mã quản trị viên không chính xác.",
        },
        { status: 401 }
      );
    }

    // Generate Cryptographically Signed Admin JWT Token
    const adminToken = await createAdminToken(validUsername);

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, adminToken, getAdminCookieOptions());

    return NextResponse.json({
      success: true,
      message: "Xác thực Quản Trị Viên thành công!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, "", getClearCookieOptions());
    return NextResponse.json({
      success: true,
      message: "Đã đăng xuất khỏi hệ thống quản trị.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
