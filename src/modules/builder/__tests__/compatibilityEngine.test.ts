import { describe, it, expect } from "vitest";
import { compatibilityEngine } from "../compatibilityEngine";
import { ComponentSlot, Product } from "@/shared/types";

const TEST_PRODUCTS: Product[] = [
  {
    id: "p1",
    sku: "CPU-AMD-7800X3D",
    category_id: "c-cpu",
    slug: "amd-ryzen-7-7800x3d",
    name_vi: "AMD Ryzen 7 7800X3D",
    name_en: "AMD Ryzen 7 7800X3D",
    price_vnd: 10490000,
    stock: 12,
    brand: "AMD",
    specs: { socket: "AM5", ram_type: "DDR5", tdp_watts: 120 },
    images: [],
  },
  {
    id: "p2",
    sku: "CPU-INTEL-14700K",
    category_id: "c-cpu",
    slug: "intel-core-i7-14700k",
    name_vi: "Intel Core i7-14700K",
    name_en: "Intel Core i7-14700K",
    price_vnd: 10990000,
    stock: 15,
    brand: "Intel",
    specs: { socket: "LGA1700", ram_type: "DDR5", tdp_watts: 253 },
    images: [],
  },
  {
    id: "p3",
    sku: "MB-ASUS-B650-E",
    category_id: "c-mb",
    slug: "asus-rog-strix-b650-e",
    name_vi: "ASUS ROG STRIX B650E-F",
    name_en: "ASUS ROG STRIX B650E-F",
    price_vnd: 7290000,
    stock: 8,
    brand: "ASUS",
    specs: { socket: "AM5", ram_type: "DDR5", form_factor: "ATX" },
    images: [],
  },
  {
    id: "p4",
    sku: "MB-MSI-Z790-TOMAHAWK",
    category_id: "c-mb",
    slug: "msi-mag-z790-tomahawk",
    name_vi: "MSI MAG Z790 TOMAHAWK",
    name_en: "MSI MAG Z790 TOMAHAWK",
    price_vnd: 7490000,
    stock: 6,
    brand: "MSI",
    specs: { socket: "LGA1700", ram_type: "DDR5", form_factor: "ATX" },
    images: [],
  },
  {
    id: "p5",
    sku: "RAM-CORSAIR-32G-6000",
    category_id: "c-ram",
    slug: "corsair-vengeance-rgb-32gb-ddr5",
    name_vi: "Corsair Vengeance RGB 32GB DDR5 6000MHz",
    name_en: "Corsair Vengeance RGB 32GB DDR5 6000MHz",
    price_vnd: 3290000,
    stock: 25,
    brand: "Corsair",
    specs: { ram_type: "DDR5", capacity_gb: 32, speed_mhz: 6000 },
    images: [],
  },
  {
    id: "p6",
    sku: "GPU-ASUS-4070TIS",
    category_id: "c-gpu",
    slug: "asus-tuf-rtx-4070-ti-super",
    name_vi: "ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB",
    name_en: "ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB",
    price_vnd: 24490000,
    stock: 5,
    brand: "ASUS",
    specs: { vram_gb: 16, tdp_watts: 285, length_mm: 305 },
    images: [],
  },
  {
    id: "p7",
    sku: "SSD-SAMSUNG-990PRO-2TB",
    category_id: "c-storage",
    slug: "samsung-990-pro-2tb",
    name_vi: "SSD Samsung 990 PRO 2TB NVMe M.2",
    name_en: "Samsung 990 PRO 2TB NVMe M.2",
    price_vnd: 4890000,
    stock: 14,
    brand: "Samsung",
    specs: { form_factor: "M.2 2280", capacity_gb: 2000 },
    images: [],
  },
  {
    id: "p8",
    sku: "PSU-CORSAIR-RM850X",
    category_id: "c-psu",
    slug: "corsair-rm850x-shift-850w",
    name_vi: "Nguồn Corsair RM850x SHIFT 850W 80 Plus Gold",
    name_en: "Corsair RM850x SHIFT 850W 80 Plus Gold",
    price_vnd: 3890000,
    stock: 10,
    brand: "Corsair",
    specs: { wattage: 850, efficiency: "80 Plus Gold" },
    images: [],
  },
  {
    id: "p9",
    sku: "CASE-LIANLI-O11D-EVO",
    category_id: "c-case",
    slug: "lian-li-o11-dynamic-evo",
    name_vi: "Vỏ Case Lian Li O11 Dynamic EVO Black",
    name_en: "Lian Li O11 Dynamic EVO Black",
    price_vnd: 3990000,
    stock: 7,
    brand: "Lian Li",
    specs: { form_factor_support: ["ATX", "Micro-ATX", "Mini-ITX"], max_gpu_length_mm: 455 },
    images: [],
  },
  {
    id: "p10",
    sku: "COOLER-NZXT-KRAKEN-360",
    category_id: "c-cooling",
    slug: "nzxt-kraken-360-rgb",
    name_vi: "Tản nhiệt nước NZXT Kraken 360 RGB Black",
    name_en: "NZXT Kraken 360 RGB Black",
    price_vnd: 5490000,
    stock: 9,
    brand: "NZXT",
    specs: { socket_support: ["AM5", "AM4", "LGA1700"], radiator_size_mm: 360 },
    images: [],
  },
];

describe("CompatibilityEngine", () => {
  const getProductBySku = (sku: string): Product => {
    const product = TEST_PRODUCTS.find((p) => p.sku === sku);
    if (!product) throw new Error(`Product ${sku} not found in test fixtures`);
    return product;
  };

  it("should evaluate a matching AM5 build as fully compatible", () => {
    const slots: Record<ComponentSlot, Product | null> = {
      cpu: getProductBySku("CPU-AMD-7800X3D"),
      motherboard: getProductBySku("MB-ASUS-B650-E"),
      ram: getProductBySku("RAM-CORSAIR-32G-6000"),
      gpu: getProductBySku("GPU-ASUS-4070TIS"),
      storage: getProductBySku("SSD-SAMSUNG-990PRO-2TB"),
      psu: getProductBySku("PSU-CORSAIR-RM850X"),
      case: getProductBySku("CASE-LIANLI-O11D-EVO"),
      cooling: getProductBySku("COOLER-NZXT-KRAKEN-360"),
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
