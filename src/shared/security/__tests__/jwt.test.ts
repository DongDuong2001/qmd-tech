import { describe, it, expect } from "vitest";
import {
  signJWT,
  verifyJWT,
  createAdminToken,
  verifyAdminToken,
} from "../jwt";

describe("Cryptographic JWT Suite", () => {
  const testSecret = "test_super_secret_jwt_signing_key_1234567890";

  it("should sign and verify a valid JWT token", async () => {
    const payload = { sub: "user-123", email: "customer@qmd.tech", role: "customer" };
    const token = await signJWT(payload, testSecret, 3600);

    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const verified = await verifyJWT<typeof payload>(token, testSecret);
    expect(verified.valid).toBe(true);
    expect(verified.payload?.sub).toBe("user-123");
    expect(verified.payload?.email).toBe("customer@qmd.tech");
    expect(verified.payload?.role).toBe("customer");
  });

  it("should reject tampered JWT signatures", async () => {
    const payload = { role: "user" };
    const token = await signJWT(payload, testSecret, 3600);

    const parts = token.split(".");
    // Tamper with payload by changing base64 string
    const tamperedPayload = btoa(JSON.stringify({ role: "admin" }))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    const verified = await verifyJWT(tamperedToken, testSecret);
    expect(verified.valid).toBe(false);
    expect(verified.error).toContain("không hợp lệ");
  });

  it("should reject tokens signed with a different secret", async () => {
    const token = await signJWT({ user: "admin" }, "wrong_secret_1", 3600);
    const verified = await verifyJWT(token, "different_secret_2");

    expect(verified.valid).toBe(false);
  });

  it("should reject expired JWT tokens", async () => {
    // Expired 10 seconds ago (-10s duration)
    const token = await signJWT({ user: "guest" }, testSecret, -10);
    const verified = await verifyJWT(token, testSecret);

    expect(verified.valid).toBe(false);
    expect(verified.error).toContain("hết hạn");
  });

  it("should create and verify admin JWT tokens", async () => {
    const adminToken = await createAdminToken("admin@qmd.tech");
    expect(typeof adminToken).toBe("string");

    const verification = await verifyAdminToken(adminToken);
    expect(verification.valid).toBe(true);
    expect(verification.user).toBe("admin@qmd.tech");
  });

  it("should reject non-admin roles in verifyAdminToken", async () => {
    const nonAdminToken = await signJWT({ role: "customer", user: "customer@qmd.tech" });
    const verification = await verifyAdminToken(nonAdminToken);

    expect(verification.valid).toBe(false);
    expect(verification.error).toContain("Không có quyền");
  });
});
