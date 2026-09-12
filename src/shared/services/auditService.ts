import { NextRequest } from "next/server";
import { getServiceSupabase } from "@/shared/db/supabase";
import { AuditLogEntry } from "@/shared/types/rbac";

export interface LogAuditInput {
  adminUserId?: string | null;
  adminUserEmail?: string | null;
  adminRole?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  req?: NextRequest | null;
}

export class AuditService {
  async logAuditEvent(input: LogAuditInput): Promise<void> {
    try {
      const db = getServiceSupabase();

      let ipAddress = "127.0.0.1";
      let userAgent = "internal";

      if (input.req) {
        ipAddress =
          input.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          input.req.headers.get("x-real-ip") ||
          "127.0.0.1";
        userAgent = input.req.headers.get("user-agent") || "unknown";
      }

      await db.from("audit_logs").insert({
        admin_user_id: input.adminUserId,
        admin_user_email: input.adminUserEmail,
        admin_role: input.adminRole || "admin",
        action: input.action,
        entity_type: input.entityType,
        entity_id: input.entityId,
        old_values: input.oldValues || null,
        new_values: input.newValues || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("AuditService.logAuditEvent notice (non-blocking):", err);
    }
  }

  async getAuditLogs(params?: {
    limit?: number;
    offset?: number;
    entityType?: string;
    action?: string;
  }): Promise<{ logs: AuditLogEntry[]; total: number }> {
    try {
      const db = getServiceSupabase();
      const limit = params?.limit || 50;
      const offset = params?.offset || 0;

      let query = db
        .from("audit_logs")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (params?.entityType) {
        query = query.eq("entity_type", params.entityType);
      }

      if (params?.action) {
        query = query.eq("action", params.action);
      }

      const { data, count, error } = await query;

      if (error || !data) {
        return { logs: [], total: 0 };
      }

      return { logs: data as AuditLogEntry[], total: count || data.length };
    } catch (err) {
      console.error("AuditService.getAuditLogs error:", err);
      return { logs: [], total: 0 };
    }
  }
}

export const auditService = new AuditService();
