import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServiceSupabase } from "@/shared/db/supabase";
import { requireAdmin } from "@/shared/security/adminAuth";
import { Product } from "@/shared/types";
import { slugifyVietnamese } from "@/shared/lib/sanitize";
import { validateAndNormalizeSpecs } from "@/modules/catalog/specRegistry";
import { DEFAULT_HARDWARE_CATEGORIES } from "@/modules/admin/service";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveValidCategoryUuid(
  db: ReturnType<typeof getServiceSupabase>,
  categoryIdOrSlug?: string
): Promise<string> {
  if (categoryIdOrSlug && UUID_REGEX.test(categoryIdOrSlug)) {
    return categoryIdOrSlug;
  }

  let slug = (categoryIdOrSlug || "cpu").toLowerCase().replace(/^cat-/, "");
  if (slug === "mainboard") slug = "motherboard";
  if (slug === "vga") slug = "gpu";
  if (slug === "ssd") slug = "storage";

  const { data } = await db
    .from("categories")
    .select("id")
    .or(`slug.eq.${slug},slug.eq.${categoryIdOrSlug}`)
    .limit(1)
    .maybeSingle();

  if (data?.id) return data.id;

  const { data: firstCat } = await db.from("categories").select("id").limit(1).maybeSingle();
  return firstCat?.id || "c0000001-0000-0000-0000-000000000001";
}

function revalidateProductPaths(slug?: string) {
  try {
    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/danh-muc", "page");
    revalidatePath("/[locale]/danh-muc/[category]", "page");
    revalidatePath("/[locale]/build-pc", "page");
    if (slug) {
      revalidatePath(`/[locale]/san-pham/${slug}`, "page");
    }
  } catch (err) {
    console.warn("revalidateProductPaths notice:", err);
  }
}

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
      category_slug,
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
    const db = getServiceSupabase();

    // Determine category slug for spec validation
    let resolvedCategorySlug = category_slug || "";
    if (!resolvedCategorySlug && category_id) {
      const match = DEFAULT_HARDWARE_CATEGORIES.find((c) => c.id === category_id);
      if (match) {
        resolvedCategorySlug = match.slug;
      } else {
        const { data: catData } = await db
          .from("categories")
          .select("slug")
          .eq("id", category_id)
          .maybeSingle();
        if (catData?.slug) resolvedCategorySlug = catData.slug;
      }
    }

    let finalSpecs = typeof specs === "object" && specs !== null ? specs : {};
    if (resolvedCategorySlug) {
      const specValidation = validateAndNormalizeSpecs(resolvedCategorySlug, finalSpecs);
      if (!specValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            error: `Thông số kỹ thuật không hợp lệ: ${specValidation.errors.join("; ")}`,
          },
          { status: 400 }
        );
      }
      finalSpecs = specValidation.normalizedSpecs;
    }

    // Resolve category_id to valid Supabase category UUID
    const finalCategoryUuid = await resolveValidCategoryUuid(db, category_id);

    const newProductPayload = {
      name_vi: name_vi.trim(),
      name_en: name_en?.trim() || name_vi.trim(),
      slug: cleanSlug,
      sku: sku.trim().toUpperCase(),
      brand: brand?.trim() || "Chính Hãng",
      category_id: finalCategoryUuid,
      price_vnd: parsedPrice,
      original_price_vnd: original_price_vnd ? Number(original_price_vnd) : null,
      price_usd: price_usd ? Number(price_usd) : Math.round(parsedPrice / 25400),
      stock: parsedStock,
      images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea"],
      specs: finalSpecs,
      warranty_months: Number(warranty_months) || 36,
      is_featured: Boolean(is_featured),
    };

    const { data, error } = await db
      .from("products")
      .insert([newProductPayload])
      .select()
      .single();

    if (error) {
      console.error("POST /api/admin/products insert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidateProductPaths(cleanSlug);

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

    if (updates.specs && typeof updates.specs === "object") {
      let resolvedCategorySlug = updates.category_slug || "";
      if (!resolvedCategorySlug) {
        const effectiveCatId = updates.category_id;
        if (effectiveCatId) {
          const match = DEFAULT_HARDWARE_CATEGORIES.find((c) => c.id === effectiveCatId);
          if (match) resolvedCategorySlug = match.slug;
        }
        if (!resolvedCategorySlug) {
          const { data: prodData } = await db
            .from("products")
            .select("category_id")
            .eq("id", id)
            .maybeSingle();
          if (prodData?.category_id) {
            const match = DEFAULT_HARDWARE_CATEGORIES.find((c) => c.id === prodData.category_id);
            if (match) {
              resolvedCategorySlug = match.slug;
            } else {
              const { data: catData } = await db
                .from("categories")
                .select("slug")
                .eq("id", prodData.category_id)
                .maybeSingle();
              if (catData?.slug) resolvedCategorySlug = catData.slug;
            }
          }
        }
      }

      if (resolvedCategorySlug) {
        const specValidation = validateAndNormalizeSpecs(resolvedCategorySlug, updates.specs);
        if (!specValidation.isValid) {
          return NextResponse.json(
            {
              success: false,
              error: `Thông số kỹ thuật không hợp lệ: ${specValidation.errors.join("; ")}`,
            },
            { status: 400 }
          );
        }
        updates.specs = specValidation.normalizedSpecs;
      }
    }

    if (updates.category_id) {
      updates.category_id = await resolveValidCategoryUuid(db, updates.category_id);
    }

    delete updates.category_slug;

    const { data, error } = await db
      .from("products")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("PUT /api/admin/products update error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy sản phẩm với ID cung cấp." },
        { status: 404 }
      );
    }

    revalidateProductPaths(data.slug);

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
    const { data: existingProd } = await db.from("products").select("slug").eq("id", id).maybeSingle();

    const { error } = await db.from("products").delete().eq("id", id);

    if (error) {
      console.error("DELETE /api/admin/products delete error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidateProductPaths(existingProd?.slug);

    return NextResponse.json({ success: true, message: "Đã xóa sản phẩm khỏi cơ sở dữ liệu thành công." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa sản phẩm.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
