import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../rateLimiter";
import { getSecureCookieOptions, getClearCookieOptions, REMEMBER_ME_MAX_AGE, DEFAULT_SESSION_MAX_AGE } from "../cookies";

describe("Security Suite", () => {
  describe("RateLimiter", () => {
    it("should allow requests within limit and block when exceeded", () => {
      const testIp = `192.168.1.${Math.floor(Math.random() * 10000)}`;
      const action = "test_login";

      // 1st to 3rd attempt
      expect(checkRateLimit(testIp, action, 3, 10).success).toBe(true);
      expect(checkRateLimit(testIp, action, 3, 10).success).toBe(true);
      expect(checkRateLimit(testIp, action, 3, 10).success).toBe(true);

      // 4th attempt exceeds limit
      const exceeded = checkRateLimit(testIp, action, 3, 10);
      expect(exceeded.success).toBe(false);
      expect(exceeded.remaining).toBe(0);
      expect(exceeded.error).toBeDefined();
    });
  });

  describe("CookieOptions", () => {
    it("should configure strict HttpOnly and SameSite attributes", () => {
      const standardOpts = getSecureCookieOptions(false);
      expect(standardOpts.httpOnly).toBe(true);
      expect(standardOpts.sameSite).toBe("lax");
      expect(standardOpts.maxAge).toBe(DEFAULT_SESSION_MAX_AGE);

      const rememberOpts = getSecureCookieOptions(true);
      expect(rememberOpts.httpOnly).toBe(true);
      expect(rememberOpts.maxAge).toBe(REMEMBER_ME_MAX_AGE);

      const clearOpts = getClearCookieOptions();
      expect(clearOpts.maxAge).toBe(0);
      expect(clearOpts.httpOnly).toBe(true);
    });
  });
});
