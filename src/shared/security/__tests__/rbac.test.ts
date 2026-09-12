import { describe, it, expect, vi, beforeEach } from "vitest";
import { hasPermission, getRolePermissions, AdminRole } from "../../types/rbac";
import { requirePermission, requireRole } from "../adminAuth";
import { auditService } from "../../services/auditService";
import { NextRequest } from "next/server";
import * as jwtModule from "../jwt";
import * as supabaseModule from "@/shared/db/supabase";

describe("Enterprise RBAC & Permissions Engine", () => {
  it("grants all permissions to super_admin and admin", () => {
    expect(hasPermission("super_admin", "orders:delete")).toBe(true);
    expect(hasPermission("super_admin", "audit:read")).toBe(true);
    expect(hasPermission("super_admin", "users:manage")).toBe(true);
    expect(hasPermission("admin", "orders:delete")).toBe(true);
  });

  it("restricts warehouse role to inventory and order status", () => {
    expect(hasPermission("warehouse", "inventory:read")).toBe(true);
    expect(hasPermission("warehouse", "inventory:write")).toBe(true);
    expect(hasPermission("warehouse", "orders:status")).toBe(true);
    expect(hasPermission("warehouse", "orders:delete")).toBe(false);
    expect(hasPermission("warehouse", "audit:read")).toBe(false);
    expect(hasPermission("warehouse", "users:manage")).toBe(false);
  });

  it("restricts technician role to warranty and inventory inspection", () => {
    expect(hasPermission("technician", "warranty:read")).toBe(true);
    expect(hasPermission("technician", "warranty:write")).toBe(true);
    expect(hasPermission("technician", "orders:read")).toBe(true);
    expect(hasPermission("technician", "orders:delete")).toBe(false);
    expect(hasPermission("technician", "payments:reconcile")).toBe(false);
  });

  it("restricts accountant role to payments and audit logs", () => {
    expect(hasPermission("accountant", "payments:read")).toBe(true);
    expect(hasPermission("accountant", "payments:reconcile")).toBe(true);
    expect(hasPermission("accountant", "audit:read")).toBe(true);
    expect(hasPermission("accountant", "products:write")).toBe(false);
  });

  it("enforces requirePermission guard with role verification", async () => {
    vi.spyOn(jwtModule, "verifyAdminToken").mockResolvedValue({
      valid: true,
      user: "tech@qmd.tech",
      role: "technician",
    });

    const req = new NextRequest("http://localhost:3000/api/admin/warranty", {
      headers: {
        cookie: "qmd_admin_token=mock-tech-token",
      },
    });

    // Allowed permission for technician
    const allowed = await requirePermission(req, "warranty:write");
    expect(allowed.authorized).toBe(true);

    // Forbidden permission for technician
    const forbidden = await requirePermission(req, "orders:delete");
    expect(forbidden.authorized).toBe(false);
    expect(forbidden.response?.status).toBe(403);
  });

  it("enforces requireRole guard", async () => {
    vi.spyOn(jwtModule, "verifyAdminToken").mockResolvedValue({
      valid: true,
      user: "support@qmd.tech",
      role: "support",
    });

    const req = new NextRequest("http://localhost:3000/api/admin/audit-logs", {
      headers: {
        cookie: "qmd_admin_token=mock-support-token",
      },
    });

    const check = await requireRole(req, ["super_admin", "accountant"]);
    expect(check.authorized).toBe(false);
    expect(check.response?.status).toBe(403);
  });
});

describe("Audit Logging Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("records structured audit logs and retrieves them", async () => {
    const insertedEntries: Record<string, unknown>[] = [];

    const mockSupabase = {
      from: vi.fn(() => ({
        insert: vi.fn((data: Record<string, unknown>) => {
          insertedEntries.push(data);
          return Promise.resolve({ data: null, error: null });
        }),
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            range: vi.fn().mockResolvedValue({
              data: [
                {
                  id: "audit-1",
                  action: "UPDATE",
                  entity_type: "order",
                  entity_id: "ord-1",
                  created_at: new Date().toISOString(),
                },
              ],
              count: 1,
              error: null,
            }),
          })),
        })),
      })),
    };

    vi.spyOn(supabaseModule, "getServiceSupabase").mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseModule.getServiceSupabase>);

    await auditService.logAuditEvent({
      adminUserId: "usr-admin-1",
      adminUserEmail: "admin@qmd.tech",
      adminRole: "super_admin",
      action: "UPDATE_STATUS",
      entityType: "order",
      entityId: "ord-1001",
      oldValues: { status: "pending" },
      newValues: { status: "processing" },
    });

    expect(insertedEntries.length).toBe(1);
    expect(insertedEntries[0].action).toBe("UPDATE_STATUS");
    expect(insertedEntries[0].entity_type).toBe("order");

    const result = await auditService.getAuditLogs({ limit: 10, offset: 0 });
    expect(result.logs.length).toBe(1);
    expect(result.total).toBe(1);
  });
});
