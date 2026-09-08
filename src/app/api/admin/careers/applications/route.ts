import { NextRequest, NextResponse } from "next/server";
import { careerService } from "@/modules/careers/service";
import { requireAdmin } from "@/shared/security/adminAuth";
import { ApplicationStatus } from "@/modules/careers/types";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as ApplicationStatus | null;
    const career_id = searchParams.get("career_id") || undefined;
    const search = searchParams.get("search") || undefined;

    const applications = await careerService.getApplicationsAdmin({
      status: status || undefined,
      career_id,
      search,
    });

    return NextResponse.json({ success: true, applications });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load career applications.";
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
        { success: false, error: "Thiếu ID hồ sơ ứng tuyển cần cập nhật." },
        { status: 400 }
      );
    }
    if (!body?.status) {
      return NextResponse.json(
        { success: false, error: "Thiếu trạng thái hồ sơ ứng tuyển." },
        { status: 400 }
      );
    }

    const updated = await careerService.updateApplicationStatus(body.id, {
      status: body.status,
      notes: body.notes,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy hồ sơ ứng tuyển tương ứng." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật trạng thái hồ sơ thành công!",
      application: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update career application.";
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
        { success: false, error: "Thiếu ID hồ sơ cần xóa." },
        { status: 400 }
      );
    }

    await careerService.deleteApplication(id);
    return NextResponse.json({
      success: true,
      message: "Xóa hồ sơ ứng viên thành công!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete career application.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
