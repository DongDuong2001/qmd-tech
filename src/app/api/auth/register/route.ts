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

    // 1. Rate Limiting Protection (Max 3 registrations per 10 minutes per IP)
    const rateLimit = checkRateLimit(ip, "auth_register", 3, 600);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimit.error || "Bạn đã tạo quá nhiều tài khoản trong thời gian ngắn. Vui lòng chờ.",
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
    const { fullName, phone, email, password, rememberMe } = body;

    // 2. Strict Input Validation & Sanitization
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Họ và tên phải có ít nhất 2 ký tự." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !/^(0|\+84)[0-9]{8,10}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { success: false, error: "Số điện thoại không đúng định dạng Việt Nam hợp lệ." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Địa chỉ email không đúng định dạng." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Mật khẩu phải có độ dài tối thiểu 8 ký tự để đảm bảo an toàn." },
        { status: 400 }
      );
    }

    // 3. Supabase Auth Registration
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || "Đăng ký thất bại. Email có thể đã tồn tại." },
        { status: 400 }
      );
    }

    // 4. Set HttpOnly Cookie if session was created directly
    if (data.session) {
      const isRemember = Boolean(rememberMe);
      const cookieStore = await cookies();
      const cookieOptions = getSecureCookieOptions(isRemember);

      cookieStore.set(AUTH_COOKIE_NAME, data.session.access_token, cookieOptions);
      cookieStore.set(REFRESH_COOKIE_NAME, data.session.refresh_token, cookieOptions);
      cookieStore.set(REMEMBER_COOKIE_NAME, isRemember ? "true" : "false", cookieOptions);
    }

    return NextResponse.json({
      success: true,
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
        created_at: data.user.created_at,
      } : null,
      message: "Đăng ký tài khoản thành công!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
