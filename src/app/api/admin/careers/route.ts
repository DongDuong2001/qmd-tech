import { NextRequest, NextResponse } from "next/server";
import { careerService } from "@/modules/careers/service";
import { requireAdmin } from "@/shared/security/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const careers = await careerService.getAllCareersAdmin();
    return NextResponse.json({ success: true, careers });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load admin careers.";
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
    if (!body?.title || !body?.salary || !body?.description) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập đầy đủ tiêu đề, mức lương và mô tả công việc." },
        { status: 400 }
      );
    }

    const career = await careerService.createCareer(body);
    return NextResponse.json({
      success: true,
      message: "Thêm vị trí tuyển dụng thành công!",
      career,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create career.";
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
    if (!body?.id) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID vị trí cần cập nhật." },
        { status: 400 }
      );
    }

    const updated = await careerService.updateCareer(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy vị trí tuyển dụng tương ứng." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin tuyển dụng thành công!",
      career: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update career.";
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
        { success: false, error: "Thiếu ID vị trí tuyển dụng cần xóa." },
        { status: 400 }
      );
    }

    await careerService.deleteCareer(id);
    return NextResponse.json({
      success: true,
      message: "Xóa vị trí tuyển dụng thành công!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete career.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
