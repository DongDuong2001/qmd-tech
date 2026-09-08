import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { checkRateLimit, getClientIp } from "@/shared/security/rateLimiter";
import {
  ADMIN_COOKIE_NAME,
  getAdminCookieOptions,
  getClearCookieOptions,
} from "@/shared/security/cookies";
import { createAdminToken } from "@/shared/security/jwt";

function timingSafeStringEqual(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

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

    const configuredUser = process.env.QMD_ADMIN_USER || process.env.ADMIN_USERNAME;
    const configuredPassword = process.env.QMD_ADMIN_PASSWORD || process.env.ADMIN_SECRET_PASSCODE;

    if (!configuredUser || !configuredPassword) {
      console.error("CRITICAL: Admin credentials (QMD_ADMIN_USER / QMD_ADMIN_PASSWORD) are not configured.");
      return NextResponse.json(
        {
          success: false,
          error: "Hệ thống quản trị chưa được thiết lập tài khoản bảo mật trong biến môi trường máy chủ.",
        },
        { status: 500 }
      );
    }

    const isUserMatch = timingSafeStringEqual(
      (username || "").trim().toLowerCase(),
      configuredUser.toLowerCase()
    );
    const isPassMatch = timingSafeStringEqual(
      passcode || "",
      configuredPassword
    );

    if (!isUserMatch || !isPassMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "Tên đăng nhập hoặc mật mã quản trị viên không chính xác.",
        },
        { status: 401 }
      );
    }

    // Generate Cryptographically Signed Admin JWT Token
    const adminToken = await createAdminToken(configuredUser);

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
