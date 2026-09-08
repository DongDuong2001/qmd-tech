import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/shared/db/supabase";
import { requireAdmin } from "@/shared/security/adminAuth";
import { Product } from "@/shared/types";
import { slugifyVietnamese } from "@/shared/lib/sanitize";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/admin/products database error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, products: (data || []) as Product[] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi truy vấn danh sách sản phẩm.";
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
      slug,
      sku,
      brand,
      category_id,
      price_vnd,
      original_price_vnd,
      price_usd,
      stock,
      images,
      specs,
      warranty_months,
      is_featured,
    } = body;

    // Strict validation
    if (!name_vi || typeof name_vi !== "string" || name_vi.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Tên tiếng Việt của sản phẩm là bắt buộc." }, { status: 400 });
    }

    if (!sku || typeof sku !== "string" || sku.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Mã SKU sản phẩm là bắt buộc." }, { status: 400 });
    }

    const parsedPrice = Number(price_vnd);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ success: false, error: "Giá sản phẩm phải là số không âm." }, { status: 400 });
    }

    const parsedStock = Number(stock);
    if (isNaN(parsedStock) || parsedStock < 0 || !Number.isInteger(parsedStock)) {
      return NextResponse.json({ success: false, error: "Số lượng tồn kho phải là số nguyên không âm." }, { status: 400 });
    }

    const cleanSlug = slugifyVietnamese(slug || name_vi, "product");

    const newProductPayload = {
      name_vi: name_vi.trim(),
      name_en: name_en?.trim() || name_vi.trim(),
      slug: cleanSlug,
      sku: sku.trim().toUpperCase(),
      brand: brand?.trim() || "Chính Hãng",
      category_id: category_id || "cat-cpu",
      price_vnd: parsedPrice,
      original_price_vnd: original_price_vnd ? Number(original_price_vnd) : null,
      price_usd: price_usd ? Number(price_usd) : Math.round(parsedPrice / 25400),
      stock: parsedStock,
      images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea"],
      specs: typeof specs === "object" && specs !== null ? specs : {},
      warranty_months: Number(warranty_months) || 36,
      is_featured: Boolean(is_featured),
    };

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("products")
      .insert([newProductPayload])
      .select()
      .single();

    if (error) {
      console.error("POST /api/admin/products insert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data as Product });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi lưu sản phẩm vào cơ sở dữ liệu.";
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
      return NextResponse.json({ success: false, error: "Thiếu ID sản phẩm cần cập nhật." }, { status: 400 });
    }

    if (updates.slug) {
      updates.slug = slugifyVietnamese(updates.slug, "product");
    }

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("products")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("PUT /api/admin/products update error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data as Product });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật sản phẩm.";
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
      return NextResponse.json({ success: false, error: "Thiếu ID sản phẩm cần xóa." }, { status: 400 });
    }

    const db = getServiceSupabase();
    const { error } = await db.from("products").delete().eq("id", id);

    if (error) {
      console.error("DELETE /api/admin/products delete error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Đã xóa sản phẩm khỏi cơ sở dữ liệu thành công." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa sản phẩm.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
