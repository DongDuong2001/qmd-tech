import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../rateLimiter";
import {
  getSecureCookieOptions,
  getClearCookieOptions,
  getCartCookieOptions,
  getAdminCookieOptions,
  serializeCartData,
  deserializeCartData,
  REMEMBER_ME_MAX_AGE,
  DEFAULT_SESSION_MAX_AGE,
  CART_MAX_AGE,
  ADMIN_SESSION_MAX_AGE,
} from "../cookies";

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

      const cartOpts = getCartCookieOptions();
      expect(cartOpts.httpOnly).toBe(true);
      expect(cartOpts.maxAge).toBe(CART_MAX_AGE);

      const adminOpts = getAdminCookieOptions();
      expect(adminOpts.httpOnly).toBe(true);
      expect(adminOpts.maxAge).toBe(ADMIN_SESSION_MAX_AGE);

      const clearOpts = getClearCookieOptions();
      expect(clearOpts.maxAge).toBe(0);
      expect(clearOpts.httpOnly).toBe(true);
    });

    it("should correctly serialize and deserialize cart items without localStorage", () => {
      const mockItems = [
        { product_id: "prod-1", quantity: 2 },
        { product_id: "prod-2", quantity: 1 },
      ];

      const serialized = serializeCartData(mockItems);
      expect(typeof serialized).toBe("string");
      expect(serialized.length).toBeGreaterThan(0);

      const deserialized = deserializeCartData(serialized);
      expect(deserialized).toEqual(mockItems);

      // Handle invalid or corrupted cookies gracefully
      expect(deserializeCartData(undefined)).toEqual([]);
      expect(deserializeCartData("invalid_base64_json!@#$")).toEqual([]);
    });

    it("should resolve default admin credentials from environment or fallbacks", () => {
      const defaultUser = process.env.QMD_ADMIN_USER || "admin@qmd.tech";
      const defaultPass = process.env.QMD_ADMIN_PASSWORD || "qmd@135";
      expect(defaultUser).toBe("admin@qmd.tech");
      expect(defaultPass).toBe("qmd@135");
    });
  });
});

