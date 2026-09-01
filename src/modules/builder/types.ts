import { ComponentSlot, CustomBuild, Product } from "@/shared/types";

export interface BuildState {
  id?: string;
  name: string;
  slots: Record<ComponentSlot, Product | null>;
}

export interface CompatibilityCheckResult {
  status: "compatible" | "warning" | "incompatible";
  issues: {
    type: "socket" | "ram_type" | "power_draw" | "form_factor" | "gpu_clearance" | "missing_component";
    severity: "error" | "warning" | "info";
    message_vi: string;
    message_en: string;
  }[];
  estimatedWattage: number;
  recommendedPsuWattage: number;
  performanceTier: "budget" | "mid_range" | "high_end" | "enthusiast";
  totalPriceVnd: number;
}

export interface QuoteRequestInput {
  build: CustomBuild;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  note?: string;
}
