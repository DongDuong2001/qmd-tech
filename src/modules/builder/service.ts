import { ComponentSlot, CustomBuild, Product } from "@/shared/types";
import { compatibilityEngine } from "./compatibilityEngine";
import { QuoteRequestInput } from "./types";
import { eventBus } from "@/shared/events/eventBus";
import { getServiceSupabase } from "@/shared/db/supabase";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class BuilderService {
  evaluateBuild(slots: Record<ComponentSlot, Product | null>): CustomBuild {
    const check = compatibilityEngine.evaluate(slots);

    return {
      id: crypto.randomUUID(),
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
    const shareToken = crypto.randomUUID().replace(/-/g, "").substring(0, 12);
    const buildId = UUID_REGEX.test(build.id || "") ? build.id : crypto.randomUUID();
    const db = getServiceSupabase();

    const { error: buildError } = await db.from("builds").insert({
      id: buildId,
      user_id: userId || null,
      name: build.name || "Custom PC Configuration",
      share_token: shareToken,
      status: "saved",
      total_price_vnd: build.total_price_vnd,
      estimated_wattage: build.estimated_wattage,
      performance_tier: build.performance_tier,
      compatibility_status: build.compatibility_status,
      is_public: true,
    });

    if (buildError) {
      console.error("BuilderService.saveBuild error:", buildError);
      throw new Error(`Không thể lưu cấu hình PC: ${buildError.message}`);
    }

    // Insert build items
    const itemsToInsert = Object.entries(build.items)
      .filter(([_, product]) => product !== null)
      .map(([slot, product]) => ({
        id: crypto.randomUUID(),
        build_id: buildId,
        product_id: product!.id,
        slot_type: slot,
        quantity: 1,
        unit_price_vnd: product!.price_vnd,
      }));

    if (itemsToInsert.length > 0) {
      const { error: itemsError } = await db.from("build_items").insert(itemsToInsert);
      if (itemsError) {
        console.error("BuilderService.saveBuild items error:", itemsError);
        throw new Error(`Không thể lưu danh sách linh kiện cấu hình: ${itemsError.message}`);
      }
    }

    await eventBus.emit("build:saved", { buildId, userId });
    return { shareToken, id: buildId };
  }

  async getBuildByShareToken(shareToken: string): Promise<CustomBuild | null> {
    try {
      const db = getServiceSupabase();
      const { data, error } = await db
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
    } catch (err) {
      console.error("BuilderService.getBuildByShareToken error:", err);
    }
    return null;
  }

  async requestQuote(input: QuoteRequestInput): Promise<{ quoteId: string; success: boolean }> {
    const quoteId = crypto.randomUUID();

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
