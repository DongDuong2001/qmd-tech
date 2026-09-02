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

  async saveBuild(
    build: CustomBuild,
    userId?: string
  ): Promise<{ shareToken: string; id: string }> {
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

      // Insert build items
      const itemsToInsert = Object.entries(build.items)
        .filter(([_, product]) => product !== null)
        .map(([slot, product]) => ({
          build_id: buildId,
          product_id: product!.id,
          slot_type: slot,
          quantity: 1,
          unit_price_vnd: product!.price_vnd,
        }));

      if (itemsToInsert.length > 0) {
        await supabase.from("build_items").insert(itemsToInsert);
      }
    } catch {
      // In local mode or offline, keep running smoothly
    }

    await eventBus.emit("build:saved", { buildId, userId });
    return { shareToken, id: buildId };
  }

  async getBuildByShareToken(shareToken: string): Promise<CustomBuild | null> {
    try {
      const { data, error } = await supabase
        .from("builds")
        .select("*, build_items(*, product:products(*))")
        .eq("share_token", shareToken)
        .single();

      if (!error && data) {
        const slots: Record<ComponentSlot, Product | null> = {
          cpu: null,
          motherboard: null,
          ram: null,
          gpu: null,
          storage: null,
          psu: null,
          case: null,
          cooling: null,
        };

        if (Array.isArray(data.build_items)) {
          data.build_items.forEach((item: { slot_type: string; product: Product }) => {
            const slot = item.slot_type as ComponentSlot;
            if (slot && item.product) {
              slots[slot] = item.product;
            }
          });
        }

        return {
          id: data.id,
          user_id: data.user_id,
          name: data.name,
          share_token: data.share_token,
          status: data.status,
          items: slots,
          total_price_vnd: data.total_price_vnd,
          estimated_wattage: data.estimated_wattage,
          recommended_psu_wattage: Math.ceil((data.estimated_wattage * 1.3) / 50) * 50,
          performance_tier: data.performance_tier,
          compatibility_status: data.compatibility_status,
          issues: [],
          notes: data.notes,
        };
      }
    } catch {
      // Fallback
    }
    return null;
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
