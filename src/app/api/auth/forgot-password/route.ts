import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/shared/db/supabase";
import { checkRateLimit, getClientIp } from "@/shared/security/rateLimiter";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate Limiting (Max 3 attempts per minute per IP)
    const rateLimit = checkRateLimit(ip, "auth_forgot_password", 3, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Thao tác quá nhanh. Vui lòng thử lại sau giây lát.",
          retryAfter: rateLimit.resetSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập địa chỉ email hợp lệ." },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qmdtech.vercel.app";

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${siteUrl}/tai-khoan?mode=reset-password`,
      });

      if (error) {
        console.warn("Supabase resetPasswordForEmail notice:", error.message);
      }
    } catch (dbErr) {
      console.warn("Supabase auth exception:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Liên kết khôi phục mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến hoặc thư rác.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xử lý yêu cầu khôi phục mật khẩu.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
