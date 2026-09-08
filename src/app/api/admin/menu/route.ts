import { NextRequest, NextResponse } from "next/server";
import { menuService } from "@/modules/menu/service";
import { requireAdmin } from "@/shared/security/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const categories = await menuService.getMenu();
    return NextResponse.json({ success: true, categories });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load admin menu.";
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
    if (!body || !Array.isArray(body.categories)) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu danh mục không hợp lệ." },
        { status: 400 }
      );
    }

    const updated = await menuService.updateMenu(body.categories);
    return NextResponse.json({
      success: true,
      message: "Cập nhật cấu hình Menu Dropdown thành công!",
      categories: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update admin menu.";
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
    if (body?.action === "reset") {
      const resetData = await menuService.resetMenu();
      return NextResponse.json({
        success: true,
        message: "Đã khôi phục Menu Dropdown về 12 danh mục mặc định chuẩn!",
        categories: resetData,
      });
    }

    return NextResponse.json(
      { success: false, error: "Thao tác không hợp lệ." },
      { status: 400 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to reset menu.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
