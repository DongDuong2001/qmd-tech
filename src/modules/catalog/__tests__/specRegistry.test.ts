import { describe, it, expect } from "vitest";
import {
  normalizeCategorySlug,
  getSpecDefinitionsForCategory,
  validateAndNormalizeSpecs,
  formatSpecValue,
} from "../specRegistry";
import { ProductSpecDefinition } from "@/shared/types/specs";

describe("Product Spec Definitions & Registry", () => {
  describe("normalizeCategorySlug", () => {
    it("normalizes alias slugs to canonical hardware category names", () => {
      expect(normalizeCategorySlug("gpu")).toBe("vga");
      expect(normalizeCategorySlug("card-man-hinh")).toBe("vga");
      expect(normalizeCategorySlug("motherboard")).toBe("mainboard");
      expect(normalizeCategorySlug("bo-mach-chu")).toBe("mainboard");
      expect(normalizeCategorySlug("storage")).toBe("ssd");
      expect(normalizeCategorySlug("o-cung")).toBe("ssd");
      expect(normalizeCategorySlug("nguon-may-tinh")).toBe("psu");
      expect(normalizeCategorySlug("vo-case")).toBe("case");
      expect(normalizeCategorySlug("tan-nhiet")).toBe("cooling");
      expect(normalizeCategorySlug("cpu")).toBe("cpu");
    });

    it("handles whitespace and casing gracefully", () => {
      expect(normalizeCategorySlug("  GPU  ")).toBe("vga");
      expect(normalizeCategorySlug("Motherboard")).toBe("mainboard");
      expect(normalizeCategorySlug(undefined)).toBe("");
    });
  });

  describe("getSpecDefinitionsForCategory", () => {
    it("returns defined schema for primary hardware categories", () => {
      const cpuDefs = getSpecDefinitionsForCategory("cpu");
      expect(cpuDefs.length).toBeGreaterThan(0);
      expect(cpuDefs.some((d) => d.key === "socket")).toBe(true);
      expect(cpuDefs.some((d) => d.key === "tdp_watts")).toBe(true);

      const vgaDefs = getSpecDefinitionsForCategory("vga");
      expect(vgaDefs.some((d) => d.key === "vram_gb")).toBe(true);
      expect(vgaDefs.some((d) => d.key === "length_mm")).toBe(true);

      const mbDefs = getSpecDefinitionsForCategory("mainboard");
      expect(mbDefs.some((d) => d.key === "form_factor")).toBe(true);

      const ramDefs = getSpecDefinitionsForCategory("ram");
      expect(ramDefs.some((d) => d.key === "ram_type")).toBe(true);
      expect(ramDefs.some((d) => d.key === "speed_mhz")).toBe(true);
    });

    it("resolves alias slugs like gpu, motherboard, storage", () => {
      const gpuDefs = getSpecDefinitionsForCategory("gpu");
      expect(gpuDefs.some((d) => d.key === "vram_gb")).toBe(true);

      const storageDefs = getSpecDefinitionsForCategory("storage");
      expect(storageDefs.some((d) => d.key === "read_speed_mb")).toBe(true);
    });

    it("returns empty array for unknown or unconfigured category", () => {
      const gearDefs = getSpecDefinitionsForCategory("ban-phim-co");
      expect(gearDefs).toEqual([]);
    });
  });

  describe("validateAndNormalizeSpecs", () => {
    it("validates and normalizes valid CPU specs", () => {
      const rawCpu = {
        socket: "am5",
        cores: 8,
        threads: 16,
        base_clock_ghz: "4.2",
        boost_clock_ghz: 5.0,
        tdp_watts: 120,
        ram_type: "ddr5",
        custom_warranty_tag: "Chinh hang",
      };

      const result = validateAndNormalizeSpecs("cpu", rawCpu);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.normalizedSpecs.socket).toBe("AM5");
      expect(result.normalizedSpecs.ram_type).toBe("DDR5");
      expect(result.normalizedSpecs.base_clock_ghz).toBe(4.2);
      expect(result.normalizedSpecs.custom_warranty_tag).toBe("Chinh hang");
    });

    it("detects and rejects cross-category field pollution", () => {
      // CPU with GPU-specific field (vram_gb)
      const pollutedCpu = {
        socket: "LGA1700",
        cores: 16,
        threads: 24,
        base_clock_ghz: 3.4,
        boost_clock_ghz: 5.4,
        tdp_watts: 253,
        ram_type: "DDR5",
        vram_gb: 16,
      };

      const result = validateAndNormalizeSpecs("cpu", pollutedCpu);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("vram_gb");
    });

    it("flags missing required fields for defined categories", () => {
      const incompleteVga = {
        chipset: "RTX 4070 Ti Super",
        // missing vram_gb, length_mm, tdp_watts, recommended_psu_watts
      };

      const result = validateAndNormalizeSpecs("vga", incompleteVga);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("vram_gb"))).toBe(true);
      expect(result.errors.some((e) => e.includes("length_mm"))).toBe(true);
    });

    it("normalizes array fields from strings or arrays", () => {
      const caseSpecs = {
        form_factor_support: "E-ATX, ATX, Micro-ATX, Mini-ITX",
        max_gpu_length_mm: "420",
        max_cpu_cooler_height_mm: 180,
        radiator_support_mm: "240, 280, 360",
      };

      const result = validateAndNormalizeSpecs("case", caseSpecs);
      expect(result.isValid).toBe(true);
      expect(result.normalizedSpecs.supported_motherboards).toEqual([
        "E-ATX",
        "ATX",
        "Micro-ATX",
        "Mini-ITX",
      ]);
      expect(result.normalizedSpecs.radiator_support_mm).toEqual([240, 280, 360]);
      expect(result.normalizedSpecs.max_gpu_length_mm).toBe(420);
    });

    it("gracefully accepts non-category objects when category has no schema", () => {
      const genericSpecs = { color: "White", switch_type: "Red" };
      const result = validateAndNormalizeSpecs("accessory", genericSpecs);
      expect(result.isValid).toBe(true);
      expect(result.normalizedSpecs).toEqual(genericSpecs);
    });
  });

  describe("formatSpecValue", () => {
    const numDef: ProductSpecDefinition = {
      category_slug: "cpu",
      key: "tdp_watts",
      label_vi: "Cong suat tieu thu",
      label_en: "TDP",
      type: "number",
      unit: "W",
      required: true,
      sort_order: 1,
      is_filterable: true,
      is_compatibility_key: true,
    };

    const boolDef: ProductSpecDefinition = {
      category_slug: "cpu",
      key: "integrated_graphics",
      label_vi: "Do hoa tich hop",
      label_en: "Integrated Graphics",
      type: "boolean",
      required: false,
      sort_order: 2,
      is_filterable: false,
      is_compatibility_key: false,
    };

    const arrayDef: ProductSpecDefinition = {
      category_slug: "case",
      key: "radiator_support_mm",
      label_vi: "Ho tro ket tan nhiet",
      label_en: "Radiator Support",
      type: "array_number",
      unit: "mm",
      required: false,
      sort_order: 3,
      is_filterable: false,
      is_compatibility_key: true,
    };

    it("formats numbers with unit", () => {
      expect(formatSpecValue(numDef, 120)).toBe("120 W");
    });

    it("formats booleans bilingually", () => {
      expect(formatSpecValue(boolDef, true, "vi")).toBe("Có");
      expect(formatSpecValue(boolDef, false, "vi")).toBe("Không");
      expect(formatSpecValue(boolDef, true, "en")).toBe("Yes");
      expect(formatSpecValue(boolDef, false, "en")).toBe("No");
    });

    it("formats arrays with commas and unit", () => {
      expect(formatSpecValue(arrayDef, [240, 360])).toBe("240, 360 mm");
    });

    it("handles null or undefined with fallback dash", () => {
      expect(formatSpecValue(numDef, null)).toBe("—");
      expect(formatSpecValue(numDef, undefined)).toBe("—");
    });
  });
});
