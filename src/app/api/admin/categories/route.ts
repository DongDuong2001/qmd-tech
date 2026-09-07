import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/shared/db/supabase";
import { verifyAdminToken, verifyJWT } from "@/shared/security/jwt";
import { ADMIN_COOKIE_NAME, AUTH_COOKIE_NAME } from "@/shared/security/cookies";
import { Category } from "@/shared/types";
import { DEFAULT_HARDWARE_CATEGORIES } from "@/modules/admin/service";

let cachedCategories: Category[] = [...DEFAULT_HARDWARE_CATEGORIES];

async function checkAdminAuth(req: NextRequest): Promise<boolean> {
  const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value || req.cookies.get("qmd_admin_session")?.value;
  if (adminToken) {
    const check = await verifyAdminToken(adminToken);
    if (check.valid) return true;
  }

  const userToken = req.cookies.get(AUTH_COOKIE_NAME)?.value || req.cookies.get("qmd_access_token")?.value;
  if (userToken) {
    const res = await verifyJWT(userToken);
    if (res.valid && res.payload && (res.payload.role === "admin" || res.payload.email === (process.env.QMD_ADMIN_USER || "admin@qmd.tech"))) {
      return true;
    }
  }

  return false;
}

export async function GET() {
  try {
    const db = getServiceSupabase();
    const { data, error } = await db.from("categories").select("*");

    if (!error && data && data.length > 0) {
      cachedCategories = data as Category[];
      return NextResponse.json({ success: true, categories: data });
    }
  } catch (err) {
    console.warn("GET /api/admin/categories error:", err);
  }

  return NextResponse.json({ success: true, categories: cachedCategories });
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Support Seed Action
    if (body.action === "seed") {
      try {
        const db = getServiceSupabase();
        for (const cat of DEFAULT_HARDWARE_CATEGORIES) {
          await db.from("categories").upsert([{
            slug: cat.slug,
            name_vi: cat.name_vi,
            name_en: cat.name_en,
            icon: cat.icon,
          }], { onConflict: "slug" });
        }
      } catch {
        // Fallback
      }
      cachedCategories = [...DEFAULT_HARDWARE_CATEGORIES];
      return NextResponse.json({ success: true, categories: cachedCategories, message: "Đã đồng bộ danh mục chuẩn." });
    }

    const { slug, name_vi, name_en, icon } = body;
    if (!name_vi || !slug) {
      return NextResponse.json({ success: false, error: "Vui lòng nhập tên và slug danh mục." }, { status: 400 });
    }

    const newCat: Category = {
      id: `cat_${Date.now()}`,
      slug: slug.toLowerCase().trim(),
      name_vi: name_vi.trim(),
      name_en: name_en?.trim() || name_vi.trim(),
      icon: icon || "Cpu",
      sort_order: cachedCategories.length + 1,
      created_at: new Date().toISOString(),
    };

    try {
      const db = getServiceSupabase();
      const { data, error } = await db
        .from("categories")
        .insert([{
          slug: newCat.slug,
          name_vi: newCat.name_vi,
          name_en: newCat.name_en,
          icon: newCat.icon,
        }])
        .select()
        .single();

      if (!error && data) {
        cachedCategories.push(data as Category);
        return NextResponse.json({ success: true, category: data });
      }
    } catch {
      // Fallback
    }

    cachedCategories.push(newCat);
    return NextResponse.json({ success: true, category: newCat });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xử lý danh mục.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, slug, name_vi, name_en, icon } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing category ID" }, { status: 400 });
    }

    try {
      const db = getServiceSupabase();
      await db.from("categories").update({ slug, name_vi, name_en, icon }).eq("id", id);
    } catch {
      // Fallback
    }

    const idx = cachedCategories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      cachedCategories[idx] = { ...cachedCategories[idx], slug, name_vi, name_en, icon };
    }

    return NextResponse.json({ success: true, category: cachedCategories[idx] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật danh mục.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing category ID" }, { status: 400 });
    }

    try {
      const db = getServiceSupabase();
      await db.from("categories").delete().eq("id", id);
    } catch {
      // Fallback
    }

    cachedCategories = cachedCategories.filter((c) => c.id !== id);
    return NextResponse.json({ success: true, message: "Đã xóa danh mục." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa danh mục.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
