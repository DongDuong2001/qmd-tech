import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/shared/db/supabase";
import { checkRateLimit, getClientIp } from "@/shared/security/rateLimiter";
import {
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  REMEMBER_COOKIE_NAME,
  getSecureCookieOptions,
} from "@/shared/security/cookies";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Rate Limiting Protection (Max 5 attempts per minute per IP)
    const rateLimit = checkRateLimit(ip, "auth_login", 5, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimit.error || "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.",
          retryAfter: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
          },
        }
      );
    }

    const body = await req.json();
    const { email, password, rememberMe } = body;

    // 2. Strict Input Validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Địa chỉ email không hợp lệ." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập mật khẩu." },
        { status: 400 }
      );
    }

    // 3. Supabase Auth Verification
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        {
          success: false,
          error: "Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
        },
        { status: 401 }
      );
    }

    // 4. Secure HttpOnly Cookie Storage (With Remember-Me duration)
    const isRemember = Boolean(rememberMe);
    const cookieStore = await cookies();
    const cookieOptions = getSecureCookieOptions(isRemember);

    cookieStore.set(AUTH_COOKIE_NAME, data.session.access_token, cookieOptions);
    cookieStore.set(REFRESH_COOKIE_NAME, data.session.refresh_token, cookieOptions);
    cookieStore.set(REMEMBER_COOKIE_NAME, isRemember ? "true" : "false", cookieOptions);

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
        created_at: data.user.created_at,
      },
      message: "Đăng nhập thành công!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
