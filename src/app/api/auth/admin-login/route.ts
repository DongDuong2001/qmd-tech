import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit, getClientIp } from "@/shared/security/rateLimiter";
import {
  ADMIN_COOKIE_NAME,
  getAdminCookieOptions,
  getClearCookieOptions,
} from "@/shared/security/cookies";

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

    // Default admin credentials (Can be overridden via env vars in production)
    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPasscode = process.env.ADMIN_SECRET_PASSCODE || "QmdTech@2026!Admin";

    const isMatch =
      username?.trim() === validUsername &&
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

    // Set HttpOnly Admin Token
    const adminToken = Buffer.from(
      JSON.stringify({
        role: "admin",
        user: validUsername,
        issuedAt: Date.now(),
      })
    ).toString("base64url");

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
