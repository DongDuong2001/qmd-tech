// ========================================================================
// QMD-Tech Security Suite: Strict HttpOnly Cookie Configurations
// ========================================================================

export const AUTH_COOKIE_NAME = "qmd_session_token";
export const REFRESH_COOKIE_NAME = "qmd_refresh_token";
export const REMEMBER_COOKIE_NAME = "qmd_remember_me";

export const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60; // 30 Days in seconds
export const DEFAULT_SESSION_MAX_AGE = 24 * 60 * 60; // 24 Hours in seconds

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
