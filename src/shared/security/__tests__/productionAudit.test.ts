import { describe, it, expect } from "vitest";
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
});
