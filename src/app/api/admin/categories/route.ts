import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/shared/db/supabase";
import { requireAdmin } from "@/shared/security/adminAuth";
import { Category } from "@/shared/types";
import { DEFAULT_HARDWARE_CATEGORIES } from "@/modules/admin/service";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const db = getServiceSupabase();
    const { data, error } = await db.from("categories").select("*").order("sort_order", { ascending: true });

    if (error) {
      console.error("GET /api/admin/categories database error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      categories: (data && data.length > 0 ? data : DEFAULT_HARDWARE_CATEGORIES) as Category[],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi truy vấn danh mục.";
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

    // Support Seed Action
    if (body.action === "seed") {
      const db = getServiceSupabase();
      for (const cat of DEFAULT_HARDWARE_CATEGORIES) {
        await db.from("categories").upsert([
          {
            slug: cat.slug,
            name_vi: cat.name_vi,
            name_en: cat.name_en,
            icon: cat.icon,
          },
        ], { onConflict: "slug" });
      }

      const { data: refreshed } = await db.from("categories").select("*").order("sort_order", { ascending: true });
      return NextResponse.json({
        success: true,
        categories: refreshed || DEFAULT_HARDWARE_CATEGORIES,
        message: "Đã đồng bộ danh mục chuẩn.",
      });
    }

    const { slug, name_vi, name_en, icon } = body;
    if (!name_vi || typeof name_vi !== "string" || name_vi.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Vui lòng nhập tên danh mục." }, { status: 400 });
    }

    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Vui lòng nhập mã slug danh mục." }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-");
    const newCategoryPayload = {
      slug: cleanSlug,
      name_vi: name_vi.trim(),
      name_en: name_en?.trim() || name_vi.trim(),
      icon: icon?.trim() || "Cpu",
    };

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("categories")
      .insert([newCategoryPayload])
      .select()
      .single();

    if (error) {
      console.error("POST /api/admin/categories database error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: data as Category });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xử lý danh mục.";
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
    const { id, slug, name_vi, name_en, icon } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Thiếu ID danh mục cần cập nhật." }, { status: 400 });
    }

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("categories")
      .update({
        slug: slug?.toLowerCase().trim(),
        name_vi: name_vi?.trim(),
        name_en: name_en?.trim(),
        icon: icon?.trim(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("PUT /api/admin/categories database error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: data as Category });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật danh mục.";
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
      return NextResponse.json({ success: false, error: "Thiếu ID danh mục cần xóa." }, { status: 400 });
    }

    const db = getServiceSupabase();
    const { error } = await db.from("categories").delete().eq("id", id);

    if (error) {
      console.error("DELETE /api/admin/categories database error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Đã xóa danh mục khỏi cơ sở dữ liệu thành công." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa danh mục.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
