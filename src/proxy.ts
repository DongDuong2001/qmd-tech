import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "./shared/security/cookies";
import { verifyAdminToken } from "./shared/security/jwt";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. Redirect legacy English routes to Vietnamese
  if (pathname.startsWith("/en")) {
    const newPath = pathname.replace(/^\/en/, "/vi");
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // 1. Admin Route Guard with Cryptographic JWT Verification
  const isAdminRoute =
    pathname.includes("/admin") && !pathname.includes("/admin/login");

  if (isAdminRoute) {
    const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const verification = adminToken ? await verifyAdminToken(adminToken) : { valid: false };

    if (!verification.valid) {
      const loginUrl = new URL("/vi/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Next-Intl Localization Routing
  const response = intlMiddleware(request) || NextResponse.next();

  // 3. Attach Comprehensive Security Hardening Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: ["/", "/(vi|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};

export default proxy;

