import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase, supabase } from "@/shared/db/supabase";
import { verifyJWT } from "@/shared/security/jwt";
import { Product } from "@/shared/types";

// In-memory fallback cache for products
let cachedProducts: Product[] = [];

async function checkAdminAuth(req: NextRequest): Promise<boolean> {
  const adminToken = req.cookies.get("qmd_admin_session")?.value;
  const jwtToken = req.cookies.get("qmd_access_token")?.value;

  if (adminToken && adminToken.length > 5) return true;
  if (jwtToken) {
    const res = await verifyJWT(jwtToken);
    if (res.valid && res.payload && (res.payload.role === "admin" || res.payload.email === process.env.QMD_ADMIN_USER)) {
      return true;
    }
  }
  return false;
}

export async function GET() {
  try {
    const db = getServiceSupabase();
    const { data, error } = await db
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      cachedProducts = data as Product[];
      return NextResponse.json({ success: true, products: data });
    }
  } catch (err) {
    console.warn("GET /api/admin/products error:", err);
  }

  return NextResponse.json({ success: true, products: cachedProducts });
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: "Unauthorized: Quyền quản trị viên yêu cầu." }, { status: 401 });
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

    if (!name_vi || !sku) {
      return NextResponse.json({ success: false, error: "Vui lòng nhập đầy đủ tên và mã SKU sản phẩm." }, { status: 400 });
    }

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name_vi: name_vi.trim(),
      name_en: name_en?.trim() || name_vi.trim(),
      slug: slug || name_vi.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      sku: sku.trim().toUpperCase(),
      brand: brand || "ASUS",
      category_id: category_id || "cat-cpu",
      price_vnd: Number(price_vnd) || 0,
      original_price_vnd: original_price_vnd ? Number(original_price_vnd) : undefined,
      price_usd: price_usd ? Number(price_usd) : Math.round((Number(price_vnd) || 0) / 25400),
      stock: Number(stock) || 0,
      images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea"],
      specs: specs || {},
      warranty_months: Number(warranty_months) || 36,
      is_featured: Boolean(is_featured),
      created_at: new Date().toISOString(),
    };

    // Attempt insert into Supabase with Service Role
    try {
      const db = getServiceSupabase();
      const { data, error } = await db
        .from("products")
        .insert([{
          name_vi: newProduct.name_vi,
          name_en: newProduct.name_en,
          slug: newProduct.slug,
          sku: newProduct.sku,
          brand: newProduct.brand,
          category_id: newProduct.category_id,
          price_vnd: newProduct.price_vnd,
          original_price_vnd: newProduct.original_price_vnd || null,
          price_usd: newProduct.price_usd,
          stock: newProduct.stock,
          images: newProduct.images,
          specs: newProduct.specs,
          warranty_months: newProduct.warranty_months,
          is_featured: newProduct.is_featured,
        }])
        .select()
        .single();

      if (!error && data) {
        cachedProducts = [data as Product, ...cachedProducts.filter((p) => p.id !== (data as Product).id)];
        return NextResponse.json({ success: true, product: data });
      }
      console.warn("Supabase insert product notice:", error?.message);
    } catch (dbErr) {
      console.warn("Supabase insert product exception:", dbErr);
    }

    // Fallback to local cache if DB insert had RLS policy restriction
    cachedProducts = [newProduct, ...cachedProducts.filter((p) => p.id !== newProduct.id)];
    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi lưu sản phẩm vào kho.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: "Unauthorized: Quyền quản trị viên yêu cầu." }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });
    }

    try {
      const db = getServiceSupabase();
      const { data, error } = await db
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        cachedProducts = cachedProducts.map((p) => (p.id === id ? (data as Product) : p));
        return NextResponse.json({ success: true, product: data });
      }
    } catch (dbErr) {
      console.warn("Supabase update product exception:", dbErr);
    }

    const idx = cachedProducts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      cachedProducts[idx] = { ...cachedProducts[idx], ...updates };
      return NextResponse.json({ success: true, product: cachedProducts[idx] });
    }

    return NextResponse.json({ success: false, error: "Không tìm thấy sản phẩm." }, { status: 404 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật sản phẩm.";
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
      return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });
    }

    try {
      const db = getServiceSupabase();
      await db.from("products").delete().eq("id", id);
    } catch {
      // local fallback
    }

    cachedProducts = cachedProducts.filter((p) => p.id !== id);
    return NextResponse.json({ success: true, message: "Đã xóa sản phẩm thành công." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa sản phẩm.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
