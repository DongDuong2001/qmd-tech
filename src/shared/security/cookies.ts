// ========================================================================
// QMD-Tech Security Suite: Strict HttpOnly Cookie Configurations
// ========================================================================

export const AUTH_COOKIE_NAME = "qmd_session_token";
export const REFRESH_COOKIE_NAME = "qmd_refresh_token";
export const REMEMBER_COOKIE_NAME = "qmd_remember_me";
export const CART_COOKIE_NAME = "qmd_cart_data";
export const ADMIN_COOKIE_NAME = "qmd_admin_token";

export const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60; // 30 Days in seconds
export const DEFAULT_SESSION_MAX_AGE = 24 * 60 * 60; // 24 Hours in seconds
export const CART_MAX_AGE = 30 * 24 * 60 * 60; // 30 Days in seconds
export const ADMIN_SESSION_MAX_AGE = 12 * 60 * 60; // 12 Hours in seconds

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
}

export function getSecureCookieOptions(rememberMe: boolean = false): CookieOptions {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true, // Prevents JavaScript XSS theft
    secure: isProd, // Requires HTTPS in production
    sameSite: "lax", // Protects against Cross-Site Request Forgery (CSRF)
    path: "/",
    maxAge: rememberMe ? REMEMBER_ME_MAX_AGE : DEFAULT_SESSION_MAX_AGE,
  };
}

export function getCartCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: CART_MAX_AGE,
  };
}

export function getAdminCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}

export function getClearCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Clears the cookie immediately
  };
}

export interface CartCookieItem {
  product_id: string;
  quantity: number;
}

export function serializeCartData(items: CartCookieItem[]): string {
  try {
    const json = JSON.stringify(items);
    return Buffer.from(json).toString("base64url");
  } catch {
    return "";
  }
}

export function deserializeCartData(cookieValue: string | undefined): CartCookieItem[] {
  if (!cookieValue) return [];
  try {
    const json = Buffer.from(cookieValue, "base64url").toString("utf-8");
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) => typeof i?.product_id === "string" && typeof i?.quantity === "number" && i.quantity > 0
    );
  } catch {
    return [];
  }
}
