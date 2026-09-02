import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/shared/db/supabase";
import {
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  REMEMBER_COOKIE_NAME,
  getSecureCookieOptions,
  getClearCookieOptions,
} from "@/shared/security/cookies";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
    const rememberMe = cookieStore.get(REMEMBER_COOKIE_NAME)?.value === "true";

    if (!token) {
      return NextResponse.json({ success: true, user: null });
    }

    // 1. Verify token with Supabase
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (!userError && userData?.user) {
      return NextResponse.json({
        success: true,
        user: {
          id: userData.user.id,
          email: userData.user.email,
          user_metadata: userData.user.user_metadata,
          created_at: userData.user.created_at,
        },
      });
    }

    // 2. Token expired -> Attempt refresh with refresh token
    if (refreshToken) {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (!refreshError && refreshData?.session && refreshData?.user) {
        const cookieOptions = getSecureCookieOptions(rememberMe);
        cookieStore.set(AUTH_COOKIE_NAME, refreshData.session.access_token, cookieOptions);
        cookieStore.set(REFRESH_COOKIE_NAME, refreshData.session.refresh_token, cookieOptions);

        return NextResponse.json({
          success: true,
          user: {
            id: refreshData.user.id,
            email: refreshData.user.email,
            user_metadata: refreshData.user.user_metadata,
            created_at: refreshData.user.created_at,
          },
        });
      }
    }

    // 3. Invalidation -> Clear stale cookies
    const clearOptions = getClearCookieOptions();
    cookieStore.set(AUTH_COOKIE_NAME, "", clearOptions);
    cookieStore.set(REFRESH_COOKIE_NAME, "", clearOptions);
    cookieStore.set(REMEMBER_COOKIE_NAME, "", clearOptions);

    return NextResponse.json({ success: true, user: null });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi kiểm tra phiên đăng nhập.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
