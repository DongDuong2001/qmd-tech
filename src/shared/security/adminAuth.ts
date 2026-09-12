import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, AUTH_COOKIE_NAME } from "./cookies";
import { verifyAdminToken, verifyJWT } from "./jwt";
import { AdminPermission, AdminRole, hasPermission } from "../types/rbac";

export interface RequireAdminResult {
  authorized: boolean;
  user?: string;
  role?: AdminRole;
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
      return {
        authorized: true,
        user: check.user,
        role: (check.role || "super_admin") as AdminRole,
      };
    }
  }

  // 2. Secondary Check: User JWT with verified 'admin' role claim
  const userToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (userToken) {
    const res = await verifyJWT(userToken);
    if (res.valid && res.payload && res.payload.role === "admin") {
      return {
        authorized: true,
        user: (res.payload.user || res.payload.email || "admin") as string,
        role: "super_admin",
      };
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

/**
 * Enforces specific role membership
 */
export async function requireRole(
  req: NextRequest,
  allowedRoles: AdminRole[]
): Promise<RequireAdminResult> {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return auth;
  }

  const userRole = auth.role || "support";
  if (userRole === "super_admin" || userRole === "admin") {
    return auth;
  }

  if (!allowedRoles.includes(userRole)) {
    return {
      authorized: false,
      user: auth.user,
      role: auth.role,
      response: NextResponse.json(
        {
          success: false,
          error: `Forbidden: Vai trò [${userRole}] không có quyền thực hiện thao tác này.`,
        },
        { status: 403 }
      ),
    };
  }

  return auth;
}

/**
 * Enforces granular permission requirement
 */
export async function requirePermission(
  req: NextRequest,
  permission: AdminPermission
): Promise<RequireAdminResult> {
  const auth = await requireAdmin(req);
  if (!auth.authorized) {
    return auth;
  }

  const userRole = auth.role || "support";
  if (!hasPermission(userRole, permission)) {
    return {
      authorized: false,
      user: auth.user,
      role: auth.role,
      response: NextResponse.json(
        {
          success: false,
          error: `Forbidden: Quyền [${permission}] bị từ chối đối với vai trò [${userRole}].`,
        },
        { status: 403 }
      ),
    };
  }

  return auth;
}
