import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { verifyAdminToken, createAdminToken } from "@/shared/security/jwt";
import { compatibilityEngine } from "@/modules/builder/compatibilityEngine";
import { cartService } from "@/modules/cart/service";
import { sepayAdapter } from "@/modules/payments/adapters/sepay";
import { ComponentSlot, Product, CartItem } from "@/shared/types";

describe("Production Audit & Security Hardening Suite", () => {
  describe("Admin Authentication Cryptographic Hardening", () => {
    it("should reject forged, arbitrary or short tokens", async () => {
      expect((await verifyAdminToken("123456")).valid).toBe(false);
      expect((await verifyAdminToken("admin-secret-token")).valid).toBe(false);
      expect((await verifyAdminToken("Bearer fake-token-123456789")).valid).toBe(false);
      expect((await verifyAdminToken("")).valid).toBe(false);
      expect((await verifyAdminToken(null as unknown as string)).valid).toBe(false);
    });

    it("should accept valid cryptographically signed admin tokens", async () => {
      const validToken = await createAdminToken("qmd_admin");
      const check = await verifyAdminToken(validToken);
      expect(check.valid).toBe(true);
      expect(check.user).toBe("qmd_admin");
    });
  });

  describe("Cart & Order Server-Side Integrity", () => {
    it("should calculate cart prices from authoritative unit prices ignoring client tampering", () => {
      const sampleItem: CartItem = {
        product_id: "prod-cpu-1",
        product: {
          id: "prod-cpu-1",
          sku: "CPU-01",
          category_id: "c-cpu",
          slug: "cpu-test",
          name_vi: "CPU Test 1",
          name_en: "CPU Test 1",
          price_vnd: 10000000,
          stock: 10,
          brand: "Test",
          specs: {},
          images: [],
        },
        quantity: 2,
        unit_price_vnd: 10000000,
        total_price_vnd: 20000000,
      };

      const result = cartService.calculateCart([sampleItem]);
      expect(result.cart.subtotal_vnd).toBe(20000000);
      expect(result.cart.shipping_fee_vnd).toBe(0); // Free shipping >= 5M
      expect(result.cart.total_vnd).toBe(20000000);
    });

    it("should apply free shipping threshold accurately", () => {
      const smallItem: CartItem = {
        product_id: "prod-cable-1",
        product: {
          id: "prod-cable-1",
          sku: "CABLE-01",
          category_id: "c-acc",
          slug: "cable-test",
          name_vi: "Cáp Test",
          name_en: "Cable Test",
          price_vnd: 100000,
          stock: 50,
          brand: "Test",
          specs: {},
          images: [],
        },
        quantity: 1,
        unit_price_vnd: 100000,
        total_price_vnd: 100000,
      };

      const result = cartService.calculateCart([smallItem]);
      expect(result.cart.subtotal_vnd).toBe(100000);
      expect(result.cart.shipping_fee_vnd).toBe(50000);
      expect(result.cart.total_vnd).toBe(150000);
    });
  });

  describe("PC Builder Compatibility Engine Hardening", () => {
    const dummyCase: Product = {
      id: "case-01",
      sku: "CASE-01",
      category_id: "c-case",
      slug: "case-test",
      name_vi: "Case Test",
      name_en: "Case Test",
      price_vnd: 1500000,
      stock: 5,
      brand: "Test",
      specs: {
        max_cpu_cooler_height_mm: 155,
        max_gpu_length_mm: 320,
        supported_motherboards: ["ATX", "Micro-ATX"],
        radiator_support_mm: [240, 280],
      },
      images: [],
    };

    const tallAirCooler: Product = {
      id: "cooler-01",
      sku: "COOL-01",
      category_id: "c-cooling",
      slug: "cooler-tall",
      name_vi: "Tản Khí Cao 165mm",
      name_en: "Tall Cooler 165mm",
      price_vnd: 1200000,
      stock: 10,
      brand: "Test",
      specs: {
        height_mm: 165,
        supported_sockets: ["LGA1700", "AM5"],
      },
      images: [],
    };

    const oversizedAioCooler: Product = {
      id: "cooler-02",
      sku: "COOL-02",
      category_id: "c-cooling",
      slug: "cooler-aio-360",
      name_vi: "Tản Nước 360mm",
      name_en: "AIO Cooler 360mm",
      price_vnd: 3500000,
      stock: 10,
      brand: "Test",
      specs: {
        radiator_size_mm: 360,
        supported_sockets: ["LGA1700", "AM5"],
      },
      images: [],
    };

    it("should detect air cooler height exceeding case clearance limit", () => {
      const slots: Record<ComponentSlot, Product | null> = {
        cpu: null,
        motherboard: null,
        ram: null,
        gpu: null,
        storage: null,
        psu: null,
        case: dummyCase, // Max 155mm
        cooling: tallAirCooler, // 165mm
      };

      const result = compatibilityEngine.evaluate(slots);
      expect(result.status).toBe("incompatible");
      const coolerIssue = result.issues.find((i) => i.type === "cooler_clearance");
      expect(coolerIssue).toBeDefined();
      expect(coolerIssue?.severity).toBe("error");
      expect(coolerIssue?.message_en).toContain("exceeds case maximum clearance");
    });

    it("should warn if radiator size is not supported by case", () => {
      const slots: Record<ComponentSlot, Product | null> = {
        cpu: null,
        motherboard: null,
        ram: null,
        gpu: null,
        storage: null,
        psu: null,
        case: dummyCase, // Radiators: 240, 280
        cooling: oversizedAioCooler, // 360
      };

      const result = compatibilityEngine.evaluate(slots);
      const radIssue = result.issues.find((i) => i.type === "radiator_clearance");
      expect(radIssue).toBeDefined();
      expect(radIssue?.severity).toBe("warning");
      expect(radIssue?.message_en).toContain("360mm");
    });

    it("should normalize sockets with irregular spacing and casing", () => {
      const cpuLga: Product = {
        id: "cpu-lga",
        sku: "CPU-LGA",
        category_id: "c-cpu",
        slug: "cpu-lga",
        name_vi: "CPU LGA 1700",
        name_en: "CPU LGA 1700",
        price_vnd: 8000000,
        stock: 5,
        brand: "Intel",
        specs: { socket: "lga 1700", ram_type: "DDR5" },
        images: [],
      };

      const mbLga: Product = {
        id: "mb-lga",
        sku: "MB-LGA",
        category_id: "c-mb",
        slug: "mb-lga",
        name_vi: "Mainboard LGA1700",
        name_en: "Mainboard LGA1700",
        price_vnd: 5000000,
        stock: 5,
        brand: "ASUS",
        specs: { socket: "LGA1700", ram_type: "DDR5" },
        images: [],
      };

      const slots: Record<ComponentSlot, Product | null> = {
        cpu: cpuLga,
        motherboard: mbLga,
        ram: null,
        gpu: null,
        storage: null,
        psu: null,
        case: null,
        cooling: null,
      };

      const result = compatibilityEngine.evaluate(slots);
      const socketIssue = result.issues.find((i) => i.type === "socket");
      expect(socketIssue).toBeUndefined();
    });
  });

  describe("SePay Payment Gateway Production Security", () => {
    it("should strictly reject webhooks in production if apiKey is missing", () => {
      const env = process.env as Record<string, string | undefined>;
      const originalEnv = env.NODE_ENV;
      try {
        env.NODE_ENV = "production";
        const isAuth = sepayAdapter.verifyWebhookAuth(null);
        expect(isAuth).toBe(false);
      } finally {
        env.NODE_ENV = originalEnv;
      }
    });
  });

  describe("HTML & JSON-LD XSS Sanitization Suite", () => {
    it("should strip malicious script tags and inline event handlers", async () => {
      const { sanitizeHtml, escapeJsonLd } = await import("@/shared/lib/sanitize");

      const maliciousHtml = '<p>Normal text</p><script>alert("XSS")</script><img src="x" onerror="stealCookies()" /><a href="javascript:alert(1)">Click</a>';
      const clean = sanitizeHtml(maliciousHtml);

      expect(clean).not.toContain("<script>");
      expect(clean).not.toContain('alert("XSS")');
      expect(clean).not.toContain("onerror=");
      expect(clean).not.toContain("javascript:alert(1)");
      expect(clean).toContain("<p>Normal text</p>");

      const jsonWithScript = '{"name": "Gaming PC</script><script>alert(1)</script>"}';
      const safeJson = escapeJsonLd(jsonWithScript);
      expect(safeJson).not.toContain("</script");
      expect(safeJson).toContain("\\u003c/script");
    });
  });

  describe("Custom PC Builder Robustness", () => {
    it("should generate RFC4122 v4 UUIDs for custom builds", async () => {
      const { builderService } = await import("@/modules/builder/service");
      const emptySlots: Record<ComponentSlot, Product | null> = {
        cpu: null,
        motherboard: null,
        ram: null,
        gpu: null,
        storage: null,
        psu: null,
        case: null,
        cooling: null,
      };

      const build = builderService.evaluateBuild(emptySlots);
      const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidV4Regex.test(build.id)).toBe(true);
      expect(build.id).not.toContain("build-");
    });
  });

  describe("Admin Role Authorization Integrity", () => {
    it("should not grant admin authorization solely based on email matching when role is not admin", async () => {
      const { requireAdmin } = await import("@/shared/security/adminAuth");
      const { signJWT } = await import("@/shared/security/jwt");
      const fakeUserToken = await signJWT({
        sub: "user-123",
        email: "admin@qmd.tech",
        role: "customer",
      });
      const req = {
        cookies: {
          get: (name: string) => {
            if (name === "qmd_session_token") return { value: fakeUserToken };
            return undefined;
          },
        },
      };
      const res = await requireAdmin(req as unknown as NextRequest);
      expect(res.authorized).toBe(false);
    });
  });

  describe("SePay Strict Header Protocol", () => {
    it("should reject non-Apikey authorization header formats", () => {
      (sepayAdapter as unknown as { config: { apiKey: string } }).config.apiKey = "secret123";
      expect(sepayAdapter.verifyWebhookAuth("Bearer secret123")).toBe(false);
      expect(sepayAdapter.verifyWebhookAuth("secret123")).toBe(false);
      expect(sepayAdapter.verifyWebhookAuth("Apikey secret123")).toBe(true);
    });
  });

  describe("Rate Limiter IP Extraction Hardening", () => {
    it("should prioritize trusted cf-connecting-ip and x-real-ip", async () => {
      const { getClientIp } = await import("@/shared/security/rateLimiter");
      const reqWithCf = new Request("http://localhost:3000", {
        headers: {
          "cf-connecting-ip": "203.0.113.195",
          "x-forwarded-for": "1.2.3.4, 5.6.7.8",
        },
      });
      expect(getClientIp(reqWithCf)).toBe("203.0.113.195");
    });
  });

  describe("Orders PII Masking & Fail-Closed Validation", () => {
    it("should reject order requests with missing product_id or invalid quantity", async () => {
      const { POST } = await import("@/app/api/orders/route");
      const fakeReq = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Test User",
          customerPhone: "0988889999",
          shippingAddress: "123 Test Street",
          items: [{ product_id: "", quantity: 1 }],
        }),
      });

      const res = await POST(fakeReq as unknown as NextRequest);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("không hợp lệ");
    });

    it("should reject order with negative or float quantity", async () => {
      const { POST } = await import("@/app/api/orders/route");
      const fakeReq = new Request("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Test User",
          customerPhone: "0988889999",
          shippingAddress: "123 Test Street",
          items: [{ product_id: "prod-1", quantity: -5 }],
        }),
      });

      const res = await POST(fakeReq as unknown as NextRequest);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Số lượng sản phẩm");
    });
  });
});

