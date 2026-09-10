import { ProductSpecDefinition, SpecValidationResult } from "@/shared/types/specs";

export function normalizeCategorySlug(slug?: string): string {
  if (!slug) return "";
  const s = slug.trim().toLowerCase();
  const map: Record<string, string> = {
    gpu: "vga",
    "card-man-hinh": "vga",
    motherboard: "mainboard",
    "bo-mach-chu": "mainboard",
    storage: "ssd",
    hdd: "ssd",
    "o-cung": "ssd",
    "nguon-may-tinh": "psu",
    "vo-case": "case",
    "tan-nhiet": "cooling",
    "man-hinh": "monitor",
  };
  return map[s] || s;
}

export const CATEGORY_SPEC_DEFINITIONS: Record<string, ProductSpecDefinition[]> = {
  // 1. CPU (Processors)
  cpu: [
    {
      category_slug: "cpu",
      key: "socket",
      label_vi: "Socket CPU",
      label_en: "CPU Socket",
      type: "select",
      options: ["AM5", "AM4", "LGA1700", "LGA1851", "LGA1200"],
      required: true,
      sort_order: 1,
      is_filterable: true,
      is_compatibility_key: true,
    },
    {
      category_slug: "cpu",
      key: "cores",
      label_vi: "Số nhân xử lý",
      label_en: "Cores",
      type: "number",
      unit: "Nhân",
      required: true,
      sort_order: 2,
      is_filterable: true,
      is_compatibility_key: false,
      validation: { min: 1, max: 128 },
    },
    {
      category_slug: "cpu",
      key: "threads",
      label_vi: "Số luồng xử lý",
      label_en: "Threads",
      type: "number",
      unit: "Luồng",
      required: true,
      sort_order: 3,
      is_filterable: true,
      is_compatibility_key: false,
      validation: { min: 1, max: 256 },
    },
    {
      category_slug: "cpu",
      key: "base_clock_ghz",
      label_vi: "Xung nhịp cơ bản",
      label_en: "Base Clock",
      type: "number",
      unit: "GHz",
      required: true,
      sort_order: 4,
      is_filterable: false,
      is_compatibility_key: false,
      validation: { min: 0.5, max: 10 },
    },
    {
      category_slug: "cpu",
      key: "boost_clock_ghz",
      label_vi: "Xung nhịp tối đa (Boost)",
      label_en: "Boost Clock",
      type: "number",
      unit: "GHz",
      required: true,
      sort_order: 5,
      is_filterable: true,
      is_compatibility_key: false,
      validation: { min: 0.5, max: 10 },
    },
    {
      category_slug: "cpu",
      key: "cache_mb",
      label_vi: "Bộ nhớ đệm (Cache)",
      label_en: "Cache",
      type: "number",
      unit: "MB",
      required: false,
      sort_order: 6,
      is_filterable: false,
      is_compatibility_key: false,
      validation: { min: 1, max: 512 },
    },
    {
      category_slug: "cpu",
      key: "tdp_watts",
      label_vi: "Công suất tiêu thụ (TDP)",
      label_en: "TDP",
      type: "number",
      unit: "W",
      required: true,
      sort_order: 7,
      is_filterable: true,
      is_compatibility_key: true,
      validation: { min: 15, max: 500 },
    },
    {
      category_slug: "cpu",
      key: "integrated_graphics",
      label_vi: "Đồ họa tích hợp (iGPU)",
      label_en: "Integrated Graphics",
      type: "boolean",
      required: false,
      sort_order: 8,
      is_filterable: true,
      is_compatibility_key: false,
    },
    {
      category_slug: "cpu",
      key: "ram_type",
      label_vi: "Chuẩn RAM hỗ trợ",
      label_en: "Supported Memory",
      type: "select",
      options: ["DDR5", "DDR4", "DDR5/DDR4"],
      required: true,
      sort_order: 9,
      is_filterable: true,
      is_compatibility_key: true,
    },
  ],

  // 2. VGA / GPU (Graphics Cards)
  vga: [
    {
      category_slug: "vga",
      key: "chipset",
      label_vi: "Chipset đồ họa",
      label_en: "GPU Chipset",
      type: "string",
      required: true,
      sort_order: 1,
      is_filterable: true,
      is_compatibility_key: false,
    },
    {
      category_slug: "vga",
      key: "vram_gb",
      label_vi: "Dung lượng VRAM",
      label_en: "VRAM Capacity",
      type: "number",
      unit: "GB",
      required: true,
      sort_order: 2,
      is_filterable: true,
      is_compatibility_key: false,
      validation: { min: 1, max: 128 },
    },
    {
      category_slug: "vga",
      key: "vram_type",
      label_vi: "Chuẩn bộ nhớ VRAM",
      label_en: "VRAM Type",
      type: "select",
      options: ["GDDR6X", "GDDR6", "GDDR7", "HBM3"],
      required: false,
      sort_order: 3,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "vga",
      key: "bus_width_bit",
      label_vi: "Băng thông bộ nhớ",
      label_en: "Memory Bus",
      type: "number",
      unit: "bit",
      required: false,
      sort_order: 4,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "vga",
      key: "length_mm",
      label_vi: "Chiều dài card đồ họa",
      label_en: "Card Length",
      type: "number",
      unit: "mm",
      required: true,
      sort_order: 5,
      is_filterable: false,
      is_compatibility_key: true,
      validation: { min: 100, max: 500 },
    },
    {
      category_slug: "vga",
      key: "slots",
      label_vi: "Độ dày khe cắm PCIe",
      label_en: "Slot Width",
      type: "number",
      unit: "Slots",
      required: false,
      sort_order: 6,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "vga",
      key: "tdp_watts",
      label_vi: "Công suất tiêu thụ (TGP)",
      label_en: "TGP",
      type: "number",
      unit: "W",
      required: true,
      sort_order: 7,
      is_filterable: true,
      is_compatibility_key: true,
      validation: { min: 30, max: 1000 },
    },
    {
      category_slug: "vga",
      key: "recommended_psu_watts",
      label_vi: "Công suất nguồn đề xuất",
      label_en: "Recommended PSU",
      type: "number",
      unit: "W",
      required: true,
      sort_order: 8,
      is_filterable: true,
      is_compatibility_key: false,
      validation: { min: 200, max: 2000 },
    },
    {
      category_slug: "vga",
      key: "power_connectors",
      label_vi: "Cổng cấp nguồn phụ",
      label_en: "Power Connectors",
      type: "string",
      required: false,
      sort_order: 9,
      is_filterable: false,
      is_compatibility_key: false,
    },
  ],

  // 3. MAINBOARD (Motherboards)
  mainboard: [
    {
      category_slug: "mainboard",
      key: "socket",
      label_vi: "Socket CPU hỗ trợ",
      label_en: "Supported Socket",
      type: "select",
      options: ["AM5", "AM4", "LGA1700", "LGA1851", "LGA1200"],
      required: true,
      sort_order: 1,
      is_filterable: true,
      is_compatibility_key: true,
    },
    {
      category_slug: "mainboard",
      key: "chipset",
      label_vi: "Chipset bo mạch chủ",
      label_en: "Chipset",
      type: "string",
      required: true,
      sort_order: 2,
      is_filterable: true,
      is_compatibility_key: false,
    },
    {
      category_slug: "mainboard",
      key: "form_factor",
      label_vi: "Kích thước bo mạch (Form Factor)",
      label_en: "Form Factor",
      type: "select",
      options: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"],
      required: true,
      sort_order: 3,
      is_filterable: true,
      is_compatibility_key: true,
    },
    {
      category_slug: "mainboard",
      key: "ram_type",
      label_vi: "Chuẩn RAM tương thích",
      label_en: "RAM Type",
      type: "select",
      options: ["DDR5", "DDR4"],
      required: true,
      sort_order: 4,
      is_filterable: true,
      is_compatibility_key: true,
    },
    {
      category_slug: "mainboard",
      key: "ram_slots",
      label_vi: "Số khe cắm RAM",
      label_en: "Memory Slots",
      type: "number",
      unit: "Khe",
      required: true,
      sort_order: 5,
      is_filterable: false,
      is_compatibility_key: false,
      validation: { min: 2, max: 8 },
    },
    {
      category_slug: "mainboard",
      key: "max_ram_gb",
      label_vi: "Dung lượng RAM tối đa",
      label_en: "Max Memory Capacity",
      type: "number",
      unit: "GB",
      required: false,
      sort_order: 6,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "mainboard",
      key: "pcie_version",
      label_vi: "Phiên bản khe cắm PCIe",
      label_en: "PCIe Version",
      type: "select",
      options: ["5.0", "4.0", "3.0"],
      required: false,
      sort_order: 7,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "mainboard",
      key: "m2_slots",
      label_vi: "Số khe cắm SSD M.2 NVMe",
      label_en: "M.2 Slots",
      type: "number",
      unit: "Khe",
      required: false,
      sort_order: 8,
      is_filterable: false,
      is_compatibility_key: false,
    },
  ],

  // 4. RAM (Memory)
  ram: [
    {
      category_slug: "ram",
      key: "ram_type",
      label_vi: "Chuẩn thế hệ RAM",
      label_en: "Memory Type",
      type: "select",
      options: ["DDR5", "DDR4"],
      required: true,
      sort_order: 1,
      is_filterable: true,
      is_compatibility_key: true,
    },
    {
      category_slug: "ram",
      key: "capacity_gb",
      label_vi: "Dung lượng bộ nhớ",
      label_en: "Total Capacity",
      type: "number",
      unit: "GB",
      required: true,
      sort_order: 2,
      is_filterable: true,
      is_compatibility_key: false,
      validation: { min: 4, max: 256 },
    },
    {
      category_slug: "ram",
      key: "kit",
      label_vi: "Quy cách đóng gói",
      label_en: "Kit Configuration",
      type: "string",
      required: false,
      sort_order: 3,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "ram",
      key: "speed_mhz",
      label_vi: "Tốc độ Bus RAM",
      label_en: "Memory Speed",
      type: "number",
      unit: "MHz",
      required: true,
      sort_order: 4,
      is_filterable: true,
      is_compatibility_key: false,
      validation: { min: 2133, max: 10000 },
    },
    {
      category_slug: "ram",
      key: "timing",
      label_vi: "Độ trễ (Timing/CAS)",
      label_en: "Latency Timing",
      type: "string",
      required: false,
      sort_order: 5,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "ram",
      key: "voltage",
      label_vi: "Điện áp hoạt động",
      label_en: "Operating Voltage",
      type: "number",
      unit: "V",
      required: false,
      sort_order: 6,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "ram",
      key: "xmp_support",
      label_vi: "Hỗ trợ ép xung XMP/EXPO",
      label_en: "XMP/EXPO Support",
      type: "boolean",
      required: false,
      sort_order: 7,
      is_filterable: true,
      is_compatibility_key: false,
    },
  ],

  // 5. SSD / STORAGE
  ssd: [
    {
      category_slug: "ssd",
      key: "form_factor",
      label_vi: "Hệ số hình thức (Form Factor)",
      label_en: "Form Factor",
      type: "select",
      options: ["M.2 2280", "2.5 inch", "3.5 inch"],
      required: true,
      sort_order: 1,
      is_filterable: true,
      is_compatibility_key: false,
    },
    {
      category_slug: "ssd",
      key: "interface",
      label_vi: "Giao thức kết nối",
      label_en: "Interface",
      type: "string",
      required: true,
      sort_order: 2,
      is_filterable: true,
      is_compatibility_key: false,
    },
    {
      category_slug: "ssd",
      key: "capacity_gb",
      label_vi: "Dung lượng lưu trữ",
      label_en: "Capacity",
      type: "number",
      unit: "GB",
      required: true,
      sort_order: 3,
      is_filterable: true,
      is_compatibility_key: false,
      validation: { min: 120, max: 32000 },
    },
    {
      category_slug: "ssd",
      key: "read_speed_mb",
      label_vi: "Tốc độ đọc tuần tự",
      label_en: "Sequential Read",
      type: "number",
      unit: "MB/s",
      required: false,
      sort_order: 4,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "ssd",
      key: "write_speed_mb",
      label_vi: "Tốc độ ghi tuần tự",
      label_en: "Sequential Write",
      type: "number",
      unit: "MB/s",
      required: false,
      sort_order: 5,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "ssd",
      key: "tbw",
      label_vi: "Độ bền ghi dữ liệu (TBW)",
      label_en: "Endurance (TBW)",
      type: "number",
      unit: "TBW",
      required: false,
      sort_order: 6,
      is_filterable: false,
      is_compatibility_key: false,
    },
  ],

  // 6. PSU (Power Supply)
  psu: [
    {
      category_slug: "psu",
      key: "wattage",
      label_vi: "Công suất thực định danh",
      label_en: "Total Wattage",
      type: "number",
      unit: "W",
      required: true,
      sort_order: 1,
      is_filterable: true,
      is_compatibility_key: true,
      validation: { min: 250, max: 2500 },
    },
    {
      category_slug: "psu",
      key: "efficiency",
      label_vi: "Chứng nhận hiệu suất 80 Plus",
      label_en: "80 Plus Certification",
      type: "select",
      options: ["80 Plus Bronze", "80 Plus Gold", "80 Plus Platinum", "80 Plus Titanium", "Standard"],
      required: false,
      sort_order: 2,
      is_filterable: true,
      is_compatibility_key: false,
    },
    {
      category_slug: "psu",
      key: "modular",
      label_vi: "Cơ chế cáp nguồn (Modular)",
      label_en: "Cable Management",
      type: "select",
      options: ["Full Modular", "Semi-Modular", "Non-Modular"],
      required: false,
      sort_order: 3,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "psu",
      key: "atx_version",
      label_vi: "Tiêu chuẩn nguồn ATX",
      label_en: "ATX Standard",
      type: "string",
      required: false,
      sort_order: 4,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "psu",
      key: "pcie5_ready",
      label_vi: "Hỗ trợ cáp chuẩn PCIe 5.0 (12VHPWR)",
      label_en: "PCIe 5.0 Ready",
      type: "boolean",
      required: false,
      sort_order: 5,
      is_filterable: true,
      is_compatibility_key: false,
    },
  ],

  // 7. CASE (PC Enclosure)
  case: [
    {
      category_slug: "case",
      key: "supported_motherboards",
      label_vi: "Kích cỡ bo mạch chủ hỗ trợ",
      label_en: "Motherboard Support",
      type: "array_string",
      required: true,
      sort_order: 1,
      is_filterable: true,
      is_compatibility_key: true,
    },
    {
      category_slug: "case",
      key: "max_gpu_length_mm",
      label_vi: "Chiều dài VGA tối đa",
      label_en: "Max GPU Length",
      type: "number",
      unit: "mm",
      required: true,
      sort_order: 2,
      is_filterable: false,
      is_compatibility_key: true,
      validation: { min: 150, max: 600 },
    },
    {
      category_slug: "case",
      key: "max_cpu_cooler_height_mm",
      label_vi: "Chiều cao tản nhiệt CPU tối đa",
      label_en: "Max CPU Cooler Height",
      type: "number",
      unit: "mm",
      required: true,
      sort_order: 3,
      is_filterable: false,
      is_compatibility_key: true,
      validation: { min: 50, max: 250 },
    },
    {
      category_slug: "case",
      key: "radiator_support_mm",
      label_vi: "Hỗ trợ két tản nhiệt nước",
      label_en: "Radiator Support",
      type: "array_number",
      unit: "mm",
      required: false,
      sort_order: 4,
      is_filterable: false,
      is_compatibility_key: true,
    },
    {
      category_slug: "case",
      key: "form_factor",
      label_vi: "Phân loại kích cỡ case",
      label_en: "Case Form Factor",
      type: "string",
      required: false,
      sort_order: 5,
      is_filterable: true,
      is_compatibility_key: false,
    },
  ],

  // 8. COOLING (Coolers & Fans)
  cooling: [
    {
      category_slug: "cooling",
      key: "radiator_size_mm",
      label_vi: "Kích thước két tản nhiệt nước",
      label_en: "Radiator Size",
      type: "number",
      unit: "mm",
      required: false,
      sort_order: 1,
      is_filterable: true,
      is_compatibility_key: true,
    },
    {
      category_slug: "cooling",
      key: "supported_sockets",
      label_vi: "Danh sách Socket CPU hỗ trợ",
      label_en: "Supported Sockets",
      type: "array_string",
      required: true,
      sort_order: 2,
      is_filterable: true,
      is_compatibility_key: true,
    },
    {
      category_slug: "cooling",
      key: "tdp_cooling_capacity_watts",
      label_vi: "Công suất giải nhiệt tối đa",
      label_en: "Cooling Capacity",
      type: "number",
      unit: "W",
      required: false,
      sort_order: 3,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "cooling",
      key: "fan_rpm",
      label_vi: "Tốc độ quạt tản nhiệt",
      label_en: "Fan Speed",
      type: "string",
      unit: "RPM",
      required: false,
      sort_order: 4,
      is_filterable: false,
      is_compatibility_key: false,
    },
    {
      category_slug: "cooling",
      key: "height_mm",
      label_vi: "Chiều cao khối tản nhiệt khí",
      label_en: "Cooler Height",
      type: "number",
      unit: "mm",
      required: false,
      sort_order: 5,
      is_filterable: false,
      is_compatibility_key: true,
      validation: { min: 20, max: 200 },
    },
    {
      category_slug: "cooling",
      key: "cooler_type",
      label_vi: "Loại tản nhiệt",
      label_en: "Cooler Type",
      type: "select",
      options: ["Air Cooler", "AIO Liquid 240mm", "AIO Liquid 360mm", "Custom Watercooling"],
      required: false,
      sort_order: 6,
      is_filterable: true,
      is_compatibility_key: false,
    },
  ],
};

// Aliases for alternate category slugs
CATEGORY_SPEC_DEFINITIONS.gpu = CATEGORY_SPEC_DEFINITIONS.vga;
CATEGORY_SPEC_DEFINITIONS.motherboard = CATEGORY_SPEC_DEFINITIONS.mainboard;
CATEGORY_SPEC_DEFINITIONS.storage = CATEGORY_SPEC_DEFINITIONS.ssd;

export function getSpecDefinitionsForCategory(categorySlug: string): ProductSpecDefinition[] {
  const norm = normalizeCategorySlug(categorySlug);
  return CATEGORY_SPEC_DEFINITIONS[norm] || [];
}

export const SPEC_KEY_ALIASES: Record<string, string[]> = {
  supported_motherboards: ["form_factor_support", "supported_form_factors"],
  supported_sockets: ["socket_support"],
  radiator_support_mm: ["supported_radiators", "radiators_mm"],
  height_mm: ["height"],
};

export function validateAndNormalizeSpecs(
  categorySlug: string,
  rawSpecs: unknown
): SpecValidationResult {
  const errors: string[] = [];
  const normalizedSpecs: Record<string, unknown> = {};

  if (!rawSpecs || typeof rawSpecs !== "object" || Array.isArray(rawSpecs)) {
    return {
      isValid: false,
      errors: ["Thông số kỹ thuật specs phải là một JSON object hợp lệ."],
      normalizedSpecs: {},
    };
  }

  const rawObj = rawSpecs as Record<string, unknown>;
  const defs = getSpecDefinitionsForCategory(categorySlug);

  // If category has no schema definitions (e.g., gear, accessories), accept sanitized fields as generic
  if (defs.length === 0) {
    for (const [k, v] of Object.entries(rawObj)) {
      if (v !== undefined && v !== null && v !== "") {
        normalizedSpecs[k] = v;
      }
    }
    return {
      isValid: true,
      errors: [],
      normalizedSpecs,
    };
  }

  const allowedKeyMap = new Map<string, ProductSpecDefinition>();
  for (const def of defs) {
    allowedKeyMap.set(def.key, def);
    const aliases = SPEC_KEY_ALIASES[def.key];
    if (aliases) {
      for (const alias of aliases) {
        allowedKeyMap.set(alias, def);
      }
    }
  }

  // 1. Process and validate defined schema keys
  for (const def of defs) {
    let rawVal = rawObj[def.key];
    if ((rawVal === undefined || rawVal === null || rawVal === "") && SPEC_KEY_ALIASES[def.key]) {
      for (const alias of SPEC_KEY_ALIASES[def.key]) {
        if (rawObj[alias] !== undefined && rawObj[alias] !== null && rawObj[alias] !== "") {
          rawVal = rawObj[alias];
          break;
        }
      }
    }

    if (rawVal === undefined || rawVal === null || rawVal === "") {
      if (def.required) {
        errors.push(`Trường thông số '${def.label_vi}' (${def.key}) là bắt buộc đối với danh mục này.`);
      }
      continue;
    }

    switch (def.type) {
      case "number": {
        const num = typeof rawVal === "number" ? rawVal : parseFloat(String(rawVal).trim());
        if (isNaN(num)) {
          errors.push(`Trường '${def.label_vi}' (${def.key}) phải là giá trị số.`);
        } else {
          if (def.validation?.min !== undefined && num < def.validation.min) {
            errors.push(`'${def.label_vi}' không được nhỏ hơn ${def.validation.min}.`);
          }
          if (def.validation?.max !== undefined && num > def.validation.max) {
            errors.push(`'${def.label_vi}' không được lớn hơn ${def.validation.max}.`);
          }
          normalizedSpecs[def.key] = num;
        }
        break;
      }

      case "boolean": {
        if (typeof rawVal === "boolean") {
          normalizedSpecs[def.key] = rawVal;
        } else {
          const str = String(rawVal).trim().toLowerCase();
          normalizedSpecs[def.key] = str === "true" || str === "1" || str === "yes";
        }
        break;
      }

      case "select":
      case "string": {
        const str = String(rawVal).trim();
        if (str.length === 0) {
          if (def.required) {
            errors.push(`Trường '${def.label_vi}' không được để trống.`);
          }
        } else {
          // Compatibility normalization: standard sockets uppercase
          if (def.key === "socket" || def.key === "ram_type") {
            normalizedSpecs[def.key] = str.toUpperCase();
          } else {
            normalizedSpecs[def.key] = str;
          }
        }
        break;
      }

      case "array_string": {
        if (Array.isArray(rawVal)) {
          normalizedSpecs[def.key] = rawVal.map((v) => String(v).trim()).filter(Boolean);
        } else if (typeof rawVal === "string") {
          normalizedSpecs[def.key] = rawVal.split(",").map((v) => v.trim()).filter(Boolean);
        } else {
          errors.push(`Trường '${def.label_vi}' phải là danh sách chuỗi.`);
        }
        break;
      }

      case "array_number": {
        if (Array.isArray(rawVal)) {
          const nums = rawVal
            .map((v) => (typeof v === "number" ? v : parseFloat(String(v).trim())))
            .filter((n) => !isNaN(n));
          normalizedSpecs[def.key] = nums;
        } else if (typeof rawVal === "string") {
          const nums = rawVal
            .split(",")
            .map((v) => parseFloat(v.trim()))
            .filter((n) => !isNaN(n));
          normalizedSpecs[def.key] = nums;
        } else {
          errors.push(`Trường '${def.label_vi}' phải là danh sách số.`);
        }
        break;
      }
    }
  }

  // 2. Reject foreign cross-category fields (e.g. CPU specs containing vram_gb or GPU specs containing socket)
  const crossCategoryPollution: string[] = [];
  for (const rawKey of Object.keys(rawObj)) {
    if (!allowedKeyMap.has(rawKey)) {
      // Check if this key belongs to another distinct category
      let foundInOtherCategory: string | null = null;
      for (const [otherSlug, otherDefs] of Object.entries(CATEGORY_SPEC_DEFINITIONS)) {
        if (otherSlug === categorySlug || otherSlug === normalizeCategorySlug(categorySlug)) continue;
        if (otherDefs.some((d) => d.key === rawKey)) {
          foundInOtherCategory = otherSlug;
          break;
        }
      }
      if (foundInOtherCategory) {
        crossCategoryPollution.push(`Trường '${rawKey}' thuộc danh mục '${foundInOtherCategory}', không hợp lệ cho sản phẩm danh mục '${categorySlug}'.`);
      } else {
        // Keep non-conflicting custom metadata fields
        normalizedSpecs[rawKey] = rawObj[rawKey];
      }
    }
  }

  if (crossCategoryPollution.length > 0) {
    errors.push(...crossCategoryPollution);
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalizedSpecs: errors.length === 0 ? normalizedSpecs : rawObj,
  };
}

export function formatSpecValue(
  def: ProductSpecDefinition,
  value: unknown,
  locale: "vi" | "en" = "vi"
): string {
  if (value === undefined || value === null) {
    return "—";
  }

  if (typeof value === "boolean") {
    if (locale === "vi") {
      return value ? "Có" : "Không";
    }
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    const joined = value.join(", ");
    return def.unit ? `${joined} ${def.unit}` : joined;
  }

  const str = String(value);
  if (def.unit && typeof value === "number") {
    return `${str} ${def.unit}`;
  }

  return str;
}
