// ========================================================================
// QMD-Tech: Category-Specific Product Specs Types & Discriminated Schema
// ========================================================================

export type SpecFieldType =
  | "string"
  | "number"
  | "boolean"
  | "select"
  | "array_string"
  | "array_number";

export interface SpecValidationRules {
  min?: number;
  max?: number;
  pattern?: string;
}

export interface ProductSpecDefinition {
  id?: string;
  category_slug: string;
  key: string;
  label_vi: string;
  label_en: string;
  type: SpecFieldType;
  unit?: string | null;
  options?: string[];
  required: boolean;
  sort_order: number;
  is_filterable: boolean;
  is_compatibility_key: boolean;
  validation?: SpecValidationRules;
  created_at?: string;
}

// 1. CPU (Processors)
export interface CpuProductSpecs {
  socket: "AM5" | "AM4" | "LGA1700" | "LGA1851" | "LGA1200" | string;
  cores: number;
  threads: number;
  base_clock_ghz: number;
  boost_clock_ghz: number;
  cache_mb?: number;
  tdp_watts: number;
  integrated_graphics?: boolean;
  ram_type: "DDR5" | "DDR4" | "DDR5/DDR4" | string;
  [key: string]: unknown;
}

// 2. VGA / GPU (Graphics Cards)
export interface GpuProductSpecs {
  chipset: string;
  vram_gb: number;
  vram_type?: "GDDR6X" | "GDDR6" | "GDDR7" | "HBM3" | string;
  bus_width_bit?: number;
  length_mm: number;
  slots?: number;
  tdp_watts: number;
  recommended_psu_watts: number;
  power_connectors?: string;
  [key: string]: unknown;
}

// 3. Mainboard / Motherboard
export interface MotherboardProductSpecs {
  socket: "AM5" | "AM4" | "LGA1700" | "LGA1851" | "LGA1200" | string;
  chipset: string;
  form_factor: "E-ATX" | "ATX" | "Micro-ATX" | "Mini-ITX" | string;
  ram_type: "DDR5" | "DDR4" | string;
  ram_slots: number;
  max_ram_gb?: number;
  pcie_version?: "5.0" | "4.0" | "3.0" | string;
  m2_slots?: number;
  [key: string]: unknown;
}

// 4. RAM (Memory)
export interface RamProductSpecs {
  ram_type: "DDR5" | "DDR4" | string;
  capacity_gb: number;
  kit?: string;
  speed_mhz: number;
  timing?: string;
  voltage?: number;
  xmp_support?: boolean;
  [key: string]: unknown;
}

// 5. SSD / Storage
export interface StorageProductSpecs {
  form_factor: "M.2 2280" | "2.5 inch" | "3.5 inch" | string;
  interface: string;
  capacity_gb: number;
  read_speed_mb?: number;
  write_speed_mb?: number;
  tbw?: number;
  [key: string]: unknown;
}

// 6. PSU (Power Supply)
export interface PsuProductSpecs {
  wattage: number;
  efficiency?: "80 Plus Bronze" | "80 Plus Gold" | "80 Plus Platinum" | "80 Plus Titanium" | "Standard" | string;
  modular?: "Full Modular" | "Semi-Modular" | "Non-Modular" | string;
  atx_version?: string;
  pcie5_ready?: boolean;
  [key: string]: unknown;
}

// 7. Case (PC Enclosure)
export interface CaseProductSpecs {
  supported_motherboards: string[];
  max_gpu_length_mm: number;
  max_cpu_cooler_height_mm: number;
  radiator_support_mm?: number[];
  form_factor?: string;
  [key: string]: unknown;
}

// 8. Cooling (Fans & Liquid Coolers)
export interface CoolingProductSpecs {
  radiator_size_mm?: number;
  supported_sockets: string[];
  tdp_cooling_capacity_watts?: number;
  fan_rpm?: string;
  height_mm?: number;
  cooler_type?: "Air Cooler" | "AIO Liquid 240mm" | "AIO Liquid 360mm" | "Custom Watercooling" | string;
  [key: string]: unknown;
}

// 9. Generic / Catch-all Specs
export interface GenericProductSpecs {
  [key: string]: unknown;
}

// Discriminated mapping by category slug
export type CategoryProductSpecsMap = {
  cpu: CpuProductSpecs;
  vga: GpuProductSpecs;
  gpu: GpuProductSpecs;
  mainboard: MotherboardProductSpecs;
  motherboard: MotherboardProductSpecs;
  ram: RamProductSpecs;
  ssd: StorageProductSpecs;
  storage: StorageProductSpecs;
  psu: PsuProductSpecs;
  case: CaseProductSpecs;
  cooling: CoolingProductSpecs;
  [key: string]: GenericProductSpecs;
};

export type KnownCategorySlug =
  | "cpu"
  | "vga"
  | "gpu"
  | "mainboard"
  | "motherboard"
  | "ram"
  | "ssd"
  | "storage"
  | "psu"
  | "case"
  | "cooling";

export interface SpecValidationResult {
  isValid: boolean;
  errors: string[];
  normalizedSpecs: Record<string, unknown>;
}

// Standard keys critical for the Custom PC Builder compatibility engine
export const COMPATIBILITY_SPEC_KEYS = [
  "socket",
  "ram_type",
  "tdp_watts",
  "length_mm",
  "supported_motherboards",
  "form_factor",
  "max_gpu_length_mm",
  "max_cpu_cooler_height_mm",
  "radiator_size_mm",
  "radiator_support_mm",
  "supported_sockets",
  "wattage",
  "height_mm",
] as const;

export type CompatibilitySpecKey = (typeof COMPATIBILITY_SPEC_KEYS)[number];
