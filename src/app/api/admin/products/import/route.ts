import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/shared/db/supabase";
import { requireAdmin } from "@/shared/security/adminAuth";
import { hasPermission } from "@/shared/types/rbac";
import { slugifyVietnamese } from "@/shared/lib/sanitize";
import { auditService } from "@/shared/services/auditService";
import { DEFAULT_HARDWARE_CATEGORIES } from "@/modules/admin/service";
import { ImportProductItem } from "@/modules/admin/documentImportService";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const role = auth.role || "super_admin";
    const isAuthorized =
      role === "super_admin" ||
      role === "admin" ||
      role === "warehouse" ||
      hasPermission(role, "products:write") ||
      hasPermission(role, "inventory:write");

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error: "Truy cập bị từ chối. Bạn không có quyền nhập kho hoặc quản lý sản phẩm.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      products,
      sourceDoc = "manual_file",
      supplierName,
      invoiceNumber,
    } = body as {
      products: ImportProductItem[];
      sourceDoc?: string;
      supplierName?: string;
      invoiceNumber?: string;
    };

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, error: "Danh sách sản phẩm nhập kho không được để trống." },
        { status: 400 }
      );
    }

    if (products.length > 500) {
      return NextResponse.json(
        { success: false, error: "Số lượng sản phẩm mỗi đợt nhập tối đa là 500 món." },
        { status: 400 }
      );
    }

    const db = getServiceSupabase();

    // 1. Fetch existing categories from DB to map category IDs
    const { data: dbCategories } = await db
      .from("categories")
      .select("id, slug, name_vi");

    const categoryMap = new Map<string, string>();
    DEFAULT_HARDWARE_CATEGORIES.forEach((c) => categoryMap.set(c.slug, c.id));
    (dbCategories || []).forEach((c) => categoryMap.set(c.slug, c.id));

    // 2. Prepare database insert rows
    const insertRows = [];
    const seenSkus = new Set<string>();

    for (let idx = 0; idx < products.length; idx++) {
      const p = products[idx];
      if (!p.name_vi || p.price_vnd <= 0) continue;

      let sku = (p.sku || "").trim().toUpperCase();
      if (!sku) {
        sku = `SKU-${Date.now().toString(36).toUpperCase()}-${idx}`;
      }

      // Check duplicate within batch
      if (seenSkus.has(sku)) {
        sku = `${sku}-${idx + 1}`;
      }
      seenSkus.add(sku);

      const categorySlug = (p.category_slug || "gear").toLowerCase();
      const categoryId = categoryMap.get(categorySlug) || "cat-gear";
      const cleanSlug = slugifyVietnamese(p.name_vi, "product");

      insertRows.push({
        name_vi: p.name_vi.trim(),
        name_en: (p.name_en || p.name_vi).trim(),
        slug: `${cleanSlug}-${Date.now().toString(36)}-${idx}`,
        sku,
        brand: (p.brand || "Chính Hãng").trim(),
        category_id: categoryId,
        price_vnd: Math.max(0, Math.round(Number(p.price_vnd) || 0)),
        original_price_vnd: p.original_price_vnd ? Math.round(Number(p.original_price_vnd)) : null,
        stock: Math.max(0, Math.round(Number(p.stock) || 1)),
        warranty_months: Math.max(0, Math.round(Number(p.warranty_months) || 36)),
        images: ["/images/products/placeholder-part.png"],
        specs: typeof p.specs === "object" && p.specs !== null ? p.specs : {},
        is_active: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    if (insertRows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Không có sản phẩm nào hợp lệ để thêm vào kho." },
        { status: 400 }
      );
    }

    // 3. Batch insert into products table
    const { data: inserted, error: insertError } = await db
      .from("products")
      .insert(insertRows)
      .select("id, name_vi, sku, stock, price_vnd");

    if (insertError) {
      console.error("POST /api/admin/products/import insert error:", insertError);
      return NextResponse.json(
        { success: false, error: `Lỗi lưu trữ cơ sở dữ liệu: ${insertError.message}` },
        { status: 500 }
      );
    }

    // 4. Immutable Audit Trail Logging
    await auditService.logAuditEvent({
      adminUserEmail: auth.user || "admin",
      adminRole: role,
      action: "inventory_bulk_import",
      entityType: "product",
      entityId: `batch_${Date.now()}`,
      newValues: {
        total_imported: insertRows.length,
        source_doc_type: sourceDoc,
        supplier_name: supplierName || "Không xác định",
        invoice_number: invoiceNumber || "Không có",
        sample_skus: insertRows.slice(0, 5).map((r) => r.sku),
      },
      req,
    });

    return NextResponse.json({
      success: true,
      count: insertRows.length,
      message: `Đã nhập kho thành công ${insertRows.length} linh kiện vào hệ thống.`,
      products: inserted || [],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xử lý tài liệu nhập kho.";
    console.error("POST /api/admin/products/import exception:", err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
