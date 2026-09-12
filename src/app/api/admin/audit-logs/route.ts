import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/shared/security/adminAuth";
import { auditService } from "@/shared/services/auditService";

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "audit:read");
    if (!auth.authorized) {
      return auth.response!;
    }

    const { searchParams } = req.nextUrl;
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
    const entityType = searchParams.get("entityType") || undefined;
    const action = searchParams.get("action") || undefined;

    const result = await auditService.getAuditLogs({ limit, offset, entityType, action });

    return NextResponse.json({
      success: true,
      logs: result.logs,
      total: result.total,
      limit,
      offset,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi truy vấn nhật ký kiểm toán.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
