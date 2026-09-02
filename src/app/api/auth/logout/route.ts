import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  REMEMBER_COOKIE_NAME,
  getClearCookieOptions,
} from "@/shared/security/cookies";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const clearOptions = getClearCookieOptions();

    cookieStore.set(AUTH_COOKIE_NAME, "", clearOptions);
    cookieStore.set(REFRESH_COOKIE_NAME, "", clearOptions);
    cookieStore.set(REMEMBER_COOKIE_NAME, "", clearOptions);

    return NextResponse.json({
      success: true,
      message: "Đăng xuất thành công!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi đăng xuất.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
