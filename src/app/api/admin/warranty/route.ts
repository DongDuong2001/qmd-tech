import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/shared/security/adminAuth";
import { warrantyService } from "@/modules/warranty/service";
import { auditService } from "@/shared/services/auditService";

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "warranty:read");
    if (!auth.authorized) {
      return auth.response!;
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const tickets = await warrantyService.listRMATickets({ status, search });

    return NextResponse.json({ success: true, tickets });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi tải danh sách phiếu bảo hành.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "warranty:write");
    if (!auth.authorized) {
      return auth.response!;
    }

    const body = await req.json();
    const {
      customer_name,
      customer_phone,
      customer_email,
      serial_number,
      product_name,
      issue_description,
      technician_notes,
      vendor_rma_code,
    } = body;

    if (!customer_name || !customer_phone || !serial_number || !product_name || !issue_description) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập đầy đủ các trường bắt buộc." },
        { status: 400 }
      );
    }

    const ticket = await warrantyService.createRMATicket({
      customer_name,
      customer_phone,
      customer_email,
      serial_number,
      product_name,
      issue_description,
      technician_notes,
      vendor_rma_code,
    });

    await auditService.logAuditEvent({
      adminUserEmail: auth.user,
      adminRole: auth.role,
      action: "CREATE_RMA_TICKET",
      entityType: "warranty",
      entityId: ticket.id,
      newValues: ticket as unknown as Record<string, unknown>,
      req,
    });

    return NextResponse.json({ success: true, ticket });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi tạo phiếu bảo hành.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "warranty:write");
    if (!auth.authorized) {
      return auth.response!;
    }

    const body = await req.json();
    const { id, status, technician_notes, vendor_rma_code } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Thiếu ID phiếu bảo hành." }, { status: 400 });
    }

    const updated = await warrantyService.updateRMATicket(id, {
      status,
      technician_notes,
      vendor_rma_code,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: "Không tìm thấy phiếu bảo hành để cập nhật." }, { status: 404 });
    }

    await auditService.logAuditEvent({
      adminUserEmail: auth.user,
      adminRole: auth.role,
      action: "UPDATE_RMA_STATUS",
      entityType: "warranty",
      entityId: id,
      newValues: { status, technician_notes, vendor_rma_code },
      req,
    });

    return NextResponse.json({ success: true, ticket: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật phiếu bảo hành.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
