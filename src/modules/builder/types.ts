import { ComponentSlot, CustomBuild, Product, CompatibilityIssue } from "@/shared/types";

export interface BuildState {
  id?: string;
  name: string;
  slots: Record<ComponentSlot, Product | null>;
}

export interface CompatibilityCheckResult {
  status: "compatible" | "warning" | "incompatible";
  issues: CompatibilityIssue[];
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
