import { describe, it, expect } from "vitest";
import { compatibilityEngine } from "../compatibilityEngine";
import { MOCK_PRODUCTS } from "@/modules/catalog/mockData";
import { ComponentSlot, Product } from "@/shared/types";

describe("CompatibilityEngine", () => {
  const getProductBySku = (sku: string): Product => {
    const product = MOCK_PRODUCTS.find((p) => p.sku === sku);
    if (!product) throw new Error(`Product ${sku} not found in mock data`);
    return product;
  };

  it("should evaluate a matching AM5 build as fully compatible", () => {
    const slots: Record<ComponentSlot, Product | null> = {
      cpu: getProductBySku("CPU-AMD-7800X3D"), // AM5, DDR5, 120W TDP
      motherboard: getProductBySku("MB-ASUS-B650-E"), // AM5, DDR5, ATX
      ram: getProductBySku("RAM-CORSAIR-32G-6000"), // DDR5
      gpu: getProductBySku("GPU-ASUS-4070TIS"), // 285W TDP, 305mm
      storage: getProductBySku("SSD-SAMSUNG-990PRO-2TB"),
      psu: getProductBySku("PSU-CORSAIR-RM850X"), // 850W
      case: getProductBySku("CASE-LIANLI-O11D-EVO"), // ATX supported, max 455mm GPU
      cooling: getProductBySku("COOLER-NZXT-KRAKEN-360"), // Supports AM5
    };

    const result = compatibilityEngine.evaluate(slots);

    expect(result.status).toBe("compatible");
    expect(result.issues).toHaveLength(0);
    expect(result.estimatedWattage).toBe(100 + 120 + 285); // 505W
    expect(result.totalPriceVnd).toBeGreaterThan(50000000);
    expect(result.performanceTier).toBe("enthusiast");
  });

  it("should detect socket mismatch between AMD AM5 CPU and Intel LGA1700 Motherboard", () => {
    const slots: Record<ComponentSlot, Product | null> = {
      cpu: getProductBySku("CPU-AMD-7800X3D"), // AM5
      motherboard: getProductBySku("MB-MSI-Z790-TOMAHAWK"), // LGA1700
      ram: null,
      gpu: null,
      storage: null,
      psu: null,
      case: null,
      cooling: null,
    };

    const result = compatibilityEngine.evaluate(slots);

    expect(result.status).toBe("incompatible");
    const socketIssue = result.issues.find((i) => i.type === "socket");
    expect(socketIssue).toBeDefined();
    expect(socketIssue?.severity).toBe("error");
    expect(socketIssue?.message_en).toContain("Socket mismatch");
  });

  it("should flag insufficient power supply wattage", () => {
    const lowPsu: Product = {
      id: "psu-test-300w",
      sku: "PSU-300W",
      category_id: "c-psu",
      slug: "generic-psu-300w",
      name_vi: "Nguồn 300W",
      name_en: "Generic PSU 300W",
      price_vnd: 500000,
      stock: 5,
      brand: "Generic",
      specs: { wattage: 300 },
      images: [],
    };

    const slots: Record<ComponentSlot, Product | null> = {
      cpu: getProductBySku("CPU-INTEL-14700K"), // 253W TDP
      motherboard: getProductBySku("MB-MSI-Z790-TOMAHAWK"),
      ram: getProductBySku("RAM-CORSAIR-32G-6000"),
      gpu: getProductBySku("GPU-ASUS-4070TIS"), // 285W TDP
      storage: null,
      psu: lowPsu,
      case: null,
      cooling: null,
    };

    const result = compatibilityEngine.evaluate(slots);

    expect(result.status).toBe("incompatible");
    const psuIssue = result.issues.find((i) => i.type === "power_draw");
    expect(psuIssue).toBeDefined();
    expect(psuIssue?.severity).toBe("error");
  });
});
