import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServiceSupabase } from "@/shared/db/supabase";
import { requireAdmin } from "@/shared/security/adminAuth";
import { PrebuiltDeal } from "@/shared/types";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("prebuilt_deals")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("GET /api/admin/deals database error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deals: (data || []) as PrebuiltDeal[] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi truy vấn cấu hình PC ráp sẵn.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const body = await req.json();
    const {
      name_vi,
      name_en,
      code,
      price_vnd,
      original_price_vnd,
      image_url,
      badge,
      cpu,
      vga,
      ram,
      ssd,
      psu,
      mainboard,
      case_name,
      display_order,
      is_featured,
      is_active,
      supplier_id,
    } = body;

    if (!name_vi || typeof name_vi !== "string" || name_vi.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Tên cấu hình PC tiếng Việt là bắt buộc." },
        { status: 400 }
      );
    }

    const parsedPrice = Number(price_vnd);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { success: false, error: "Giá bán PC phải là số không âm." },
        { status: 400 }
      );
    }

    const db = getServiceSupabase();
    const newDealPayload = {
      name_vi: name_vi.trim(),
      name_en: name_en?.trim() || name_vi.trim(),
      code: code?.trim() || `QMD-${Date.now().toString().slice(-6)}`,
      price_vnd: parsedPrice,
      original_price_vnd: original_price_vnd ? Number(original_price_vnd) : null,
      image_url:
        image_url?.trim() ||
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
      badge: badge?.trim() || "DEAL HOT",
      cpu: cpu?.trim() || "Intel Core i5 / AMD Ryzen 5",
      vga: vga?.trim() || "NVIDIA RTX 4060",
      ram: ram?.trim() || "16GB DDR5",
      ssd: ssd?.trim() || "500GB NVMe",
      psu: psu?.trim() || "650W Bronze",
      mainboard: mainboard?.trim() || "B760 / B650",
      case_name: case_name?.trim() || "Gaming RGB Case",
      display_order: typeof display_order === "number" ? display_order : 1,
      is_featured: is_featured ?? true,
      is_active: is_active ?? true,
      supplier_id: supplier_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await db
      .from("prebuilt_deals")
      .insert([newDealPayload])
      .select()
      .single();

    if (error) {
      console.error("POST /api/admin/deals insert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      revalidatePath("/[locale]", "page");
    } catch (revErr) {
      console.warn("Revalidate path notice:", revErr);
    }

    return NextResponse.json({ success: true, deal: data as PrebuiltDeal });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi lưu cấu hình PC ráp sẵn.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Thiếu ID cấu hình PC cần cập nhật." },
        { status: 400 }
      );
    }

    const db = getServiceSupabase();
    const validUpdates: Record<string, unknown> = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (validUpdates.price_vnd !== undefined) {
      validUpdates.price_vnd = Number(validUpdates.price_vnd) || 0;
    }
    if (validUpdates.original_price_vnd !== undefined) {
      validUpdates.original_price_vnd = validUpdates.original_price_vnd
        ? Number(validUpdates.original_price_vnd)
        : null;
    }

    // Try update first
    const { data, error } = await db
      .from("prebuilt_deals")
      .update(validUpdates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("PUT /api/admin/deals update error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // If deal doesn't exist yet in Supabase (e.g. from local ID), upsert it
    let resultDeal = data;
    if (!resultDeal) {
      const upsertPayload = {
        id,
        name_vi: (updates.name_vi as string) || "Cấu hình PC Gaming",
        name_en: (updates.name_en as string) || (updates.name_vi as string) || "Gaming PC Build",
        code: (updates.code as string) || `QMD-${Date.now().toString().slice(-6)}`,
        price_vnd: Number(updates.price_vnd) || 0,
        original_price_vnd: updates.original_price_vnd ? Number(updates.original_price_vnd) : null,
        image_url:
          (updates.image_url as string) ||
          "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
        badge: (updates.badge as string) || "DEAL HOT",
        cpu: (updates.cpu as string) || "Intel Core i5 / AMD Ryzen 5",
        vga: (updates.vga as string) || "NVIDIA RTX 4060",
        ram: (updates.ram as string) || "16GB DDR5",
        ssd: (updates.ssd as string) || "500GB NVMe",
        psu: (updates.psu as string) || "650W Bronze",
        mainboard: (updates.mainboard as string) || "B760 / B650",
        case_name: (updates.case_name as string) || "Gaming RGB Case",
        display_order: Number(updates.display_order) || 1,
        is_featured: updates.is_featured ?? true,
        is_active: updates.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: upsertData, error: upsertErr } = await db
        .from("prebuilt_deals")
        .upsert([upsertPayload])
        .select()
        .single();

      if (upsertErr) {
        console.error("PUT /api/admin/deals upsert error:", upsertErr);
        return NextResponse.json({ success: false, error: upsertErr.message }, { status: 500 });
      }
      resultDeal = upsertData;
    }

    try {
      revalidatePath("/[locale]", "page");
    } catch (revErr) {
      console.warn("Revalidate path notice:", revErr);
    }

    return NextResponse.json({ success: true, deal: resultDeal as PrebuiltDeal });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật cấu hình PC.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID cấu hình PC cần xóa." },
        { status: 400 }
      );
    }

    const db = getServiceSupabase();
    const { error } = await db.from("prebuilt_deals").delete().eq("id", id);

    if (error) {
      console.error("DELETE /api/admin/deals error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      revalidatePath("/[locale]", "page");
    } catch (revErr) {
      console.warn("Revalidate path notice:", revErr);
    }

    return NextResponse.json({ success: true, message: "Đã xóa cấu hình PC thành công." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa cấu hình PC.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
