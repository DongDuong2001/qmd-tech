import { ComponentSlot, CustomBuild, Product } from "@/shared/types";
import { compatibilityEngine } from "./compatibilityEngine";
import { QuoteRequestInput } from "./types";
import { eventBus } from "@/shared/events/eventBus";
import { supabase } from "@/shared/db/supabase";

export class BuilderService {
  evaluateBuild(slots: Record<ComponentSlot, Product | null>): CustomBuild {
    const check = compatibilityEngine.evaluate(slots);

    return {
      id: `build-${Date.now()}`,
      name: "Custom PC Configuration",
      status: "draft",
      items: slots,
      total_price_vnd: check.totalPriceVnd,
      estimated_wattage: check.estimatedWattage,
      recommended_psu_wattage: check.recommendedPsuWattage,
      performance_tier: check.performanceTier,
      compatibility_status: check.status,
      issues: check.issues,
    };
  }

  async saveBuild(build: CustomBuild, userId?: string): Promise<{ shareToken: string; id: string }> {
    const shareToken = Math.random().toString(36).substring(2, 10);
    const buildId = build.id || `build-${Date.now()}`;

    try {
      await supabase.from("builds").insert({
        id: buildId,
        user_id: userId || null,
        name: build.name,
        share_token: shareToken,
        status: "saved",
        total_price_vnd: build.total_price_vnd,
        estimated_wattage: build.estimated_wattage,
        performance_tier: build.performance_tier,
        compatibility_status: build.compatibility_status,
        is_public: true,
      });
    } catch {
      // In local mode or mock mode, keep running
    }

    await eventBus.emit("build:saved", { buildId, userId });
    return { shareToken, id: buildId };
  }

  async requestQuote(input: QuoteRequestInput): Promise<{ quoteId: string; success: boolean }> {
    const quoteId = `quote-${Date.now()}`;

    await eventBus.emit("build:quote_requested", {
      buildId: input.build.id,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
    });

    return {
      quoteId,
      success: true,
    };
  }
}

export const builderService = new BuilderService();
