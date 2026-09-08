import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, AUTH_COOKIE_NAME } from "./cookies";
import { verifyAdminToken, verifyJWT } from "./jwt";

export interface RequireAdminResult {
  authorized: boolean;
  user?: string;
  response?: NextResponse;
}

/**
 * Universal, fail-closed Admin Authorization Guard.
 * Enforces cryptographic HMAC-SHA256 signature verification and admin role check.
 * Rejects forged tokens, missing tokens, and weak lengths.
 */
export async function requireAdmin(req: NextRequest): Promise<RequireAdminResult> {
  // 1. Primary Check: Dedicated HttpOnly Admin Token
  const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (adminToken) {
    const check = await verifyAdminToken(adminToken);
    if (check.valid && check.user) {
      return { authorized: true, user: check.user };
    }
  }

  // 2. Secondary Check: User JWT with verified 'admin' role claim
  const userToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (userToken) {
    const res = await verifyJWT(userToken);
    if (res.valid && res.payload && res.payload.role === "admin") {
      return { authorized: true, user: (res.payload.user || res.payload.email || "admin") as string };
    }
  }

  // 3. Fail closed: strictly unauthorized
  return {
    authorized: false,
    response: NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Quyền truy cập quản trị viên bị từ chối.",
      },
      { status: 401 }
    ),
  };
}
