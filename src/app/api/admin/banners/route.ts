import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/shared/db/supabase";
import { requireAdmin } from "@/shared/security/adminAuth";
import { EventBanner } from "@/shared/types";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("GET /api/admin/banners error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, banners: (data || []) as EventBanner[] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi truy vấn danh sách banner & poster.";
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
      title_vi,
      title_en,
      subtitle_vi,
      subtitle_en,
      tag,
      image_url,
      target_url,
      display_order,
      is_active,
      position = "hero",
    } = body;

    if (!title_vi || typeof title_vi !== "string" || title_vi.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Tiêu đề tiếng Việt là bắt buộc." }, { status: 400 });
    }

    if (!image_url || typeof image_url !== "string" || image_url.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Đường dẫn hình ảnh poster là bắt buộc." }, { status: 400 });
    }

    const allowedPositions = ["hero", "middle_carousel", "side_left", "side_right"];
    const validPosition = allowedPositions.includes(position) ? position : "hero";

    const db = getServiceSupabase();
    const newBanner = {
      title_vi: title_vi.trim(),
      title_en: title_en?.trim() || title_vi.trim(),
      subtitle_vi: subtitle_vi?.trim() || "",
      subtitle_en: subtitle_en?.trim() || "",
      tag: tag?.trim() || "SỰ KIỆN",
      image_url: image_url.trim(),
      target_url: target_url?.trim() || "/danh-muc",
      display_order: typeof display_order === "number" ? display_order : 0,
      is_active: is_active ?? true,
      position: validPosition,
    };

    const { data, error } = await db
      .from("banners")
      .insert([newBanner])
      .select()
      .single();

    if (error) {
      console.error("POST /api/admin/banners error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, banner: data as EventBanner });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi tạo mới poster sự kiện.";
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
      return NextResponse.json({ success: false, error: "ID poster không hợp lệ." }, { status: 400 });
    }

    const allowedPositions = ["hero", "middle_carousel", "side_left", "side_right"];
    if (updates.position && !allowedPositions.includes(updates.position)) {
      updates.position = "hero";
    }

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("banners")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("PUT /api/admin/banners error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, banner: data as EventBanner });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật poster sự kiện.";
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
      return NextResponse.json({ success: false, error: "Thiếu ID poster cần xóa." }, { status: 400 });
    }

    const db = getServiceSupabase();
    const { error } = await db.from("banners").delete().eq("id", id);

    if (error) {
      console.error("DELETE /api/admin/banners error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Đã xóa poster thành công." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa poster.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
