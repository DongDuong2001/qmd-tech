import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { DELETE } from "@/app/api/admin/orders/route";
import { adminService } from "../service";
import { createAdminToken } from "@/shared/security/jwt";
import { ADMIN_COOKIE_NAME } from "@/shared/security/cookies";

// Mock Supabase service client
const mockOrderItemsDelete = vi.fn().mockReturnThis();
const mockOrderItemsEq = vi.fn().mockResolvedValue({ error: null });
const mockOrdersDelete = vi.fn().mockReturnThis();
const mockOrdersEq = vi.fn().mockResolvedValue({ error: null });

vi.mock("@/shared/db/supabase", () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === "order_items") {
        return {
          delete: mockOrderItemsDelete,
          eq: mockOrderItemsEq,
        };
      }
      if (table === "orders") {
        return {
          delete: mockOrdersDelete,
          eq: mockOrdersEq,
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    }),
  },
  getServiceSupabase: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === "order_items") {
        return {
          delete: () => ({
            eq: mockOrderItemsEq,
          }),
        };
      }
      if (table === "orders") {
        return {
          delete: () => ({
            eq: mockOrdersEq,
          }),
          select: () => ({
            eq: () => ({
              single: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
      };
    }),
  })),
}));

describe("Admin Order Deletion Feature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DELETE /api/admin/orders endpoint", () => {
    it("rejects unauthorized anonymous requests with 401", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/orders?id=test-order-id", {
        method: "DELETE",
      });

      const res = await DELETE(req);
      expect(res.status).toBe(401);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Unauthorized");
    });

    it("rejects requests with missing or empty order id with 400", async () => {
      const validAdminToken = await createAdminToken("admin@qmd.tech");
      const req = new NextRequest("http://localhost:3000/api/admin/orders", {
        method: "DELETE",
        headers: {
          cookie: `${ADMIN_COOKIE_NAME}=${validAdminToken}`,
        },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("ID don hang khong hop le");
    });

    it("successfully deletes order and cascades dependent items for authenticated admin", async () => {
      const validAdminToken = await createAdminToken("admin@qmd.tech");
      const orderId = "order-uuid-12345";
      const req = new NextRequest(`http://localhost:3000/api/admin/orders?id=${orderId}`, {
        method: "DELETE",
        headers: {
          cookie: `${ADMIN_COOKIE_NAME}=${validAdminToken}`,
        },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.message).toContain("Da xoa don hang thanh cong");

      // Verify order_items and orders were queried for deletion
      expect(mockOrderItemsEq).toHaveBeenCalledWith("order_id", orderId);
      expect(mockOrdersEq).toHaveBeenCalledWith("id", orderId);
    });
  });

  describe("AdminService.deleteOrder client method", () => {
    it("handles order deletion in fallback/server environment", async () => {
      const orderId = "order-uuid-67890";
      const result = await adminService.deleteOrder(orderId);
      expect(result).toBe(true);
    });
  });
});
