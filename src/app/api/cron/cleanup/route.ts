import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/shared/db/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary: Record<string, unknown> = {
    executedAt: new Date().toISOString(),
  };

  try {
    const db = getServiceSupabase();

    // 1. Purge audit logs older than 180 days to manage storage
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 180);

    const { error: auditError } = await db
      .from("audit_logs")
      .delete()
      .lt("created_at", cutoffDate.toISOString());

    summary.auditLogPurge = auditError ? `Error: ${auditError.message}` : "success";

    return NextResponse.json({
      success: true,
      message: "Cron cleanup completed successfully.",
      summary,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Cleanup cron failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
