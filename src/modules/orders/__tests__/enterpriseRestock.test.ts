import { describe, it, expect, vi, beforeEach } from "vitest";
import { orderService } from "../service";
import * as supabaseModule from "@/shared/db/supabase";

describe("Enterprise Inventory Restocking on Cancellation and Deletion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("restocks products when cancelling an active order via application fallback", async () => {
    const mockOrder = {
      id: "ord-test-1",
      status: "pending",
      order_items: [
        { product_id: "prod-1", quantity: 2 },
        { product_id: "prod-2", quantity: 1 },
      ],
    };

    let prod1Stock = 5;
    let prod2Stock = 10;
    let orderStatus = "pending";

    const mockSupabase = {
      rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "RPC not found" } }),
      from: vi.fn((table: string) => {
        if (table === "orders") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
              })),
            })),
            update: vi.fn((payload: Record<string, unknown>) => {
              if (payload.status) orderStatus = payload.status as string;
              return {
                eq: vi.fn().mockResolvedValue({ data: [{ ...mockOrder, status: orderStatus }], error: null }),
              };
            }),
          };
        }
        if (table === "products") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn((_, id: string) => ({
                single: vi.fn().mockResolvedValue({
                  data: { stock: id === "prod-1" ? prod1Stock : prod2Stock },
                  error: null,
                }),
              })),
            })),
            update: vi.fn((payload: Record<string, unknown>) => ({
              eq: vi.fn((_, id: string) => {
                if (id === "prod-1") prod1Stock = payload.stock as number;
                if (id === "prod-2") prod2Stock = payload.stock as number;
                return Promise.resolve({ data: null, error: null });
              }),
            })),
          };
        }
        return {};
      }),
    };

    vi.spyOn(supabaseModule, "getServiceSupabase").mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseModule.getServiceSupabase>);

    const result = await orderService.cancelOrderWithRestock("ord-test-1", "Khach doi y", "admin@qmd.tech");

    expect(result.success).toBe(true);
    expect(result.restocked_items).toBe(3);
    expect(prod1Stock).toBe(7); // 5 + 2
    expect(prod2Stock).toBe(11); // 10 + 1
    expect(orderStatus).toBe("cancelled");
  });

  it("does not restock if order is already cancelled", async () => {
    const mockOrder = {
      id: "ord-test-2",
      status: "cancelled",
      order_items: [{ product_id: "prod-1", quantity: 2 }],
    };

    const mockSupabase = {
      rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "RPC not found" } }),
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
          })),
        })),
      })),
    };

    vi.spyOn(supabaseModule, "getServiceSupabase").mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseModule.getServiceSupabase>);

    const result = await orderService.cancelOrderWithRestock("ord-test-2");

    expect(result.success).toBe(true);
    expect(result.restocked_items).toBe(0);
  });

  it("restocks uncancelled items prior to order deletion", async () => {
    const mockOrder = {
      id: "ord-delete-1",
      status: "processing",
      order_items: [{ product_id: "prod-cpu-1", quantity: 4 }],
    };

    let cpuStock = 8;

    const mockSupabase = {
      rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "RPC not found" } }),
      from: vi.fn((table: string) => {
        if (table === "orders") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
              })),
            })),
          };
        }
        if (table === "products") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { stock: cpuStock }, error: null }),
              })),
            })),
            update: vi.fn((payload: Record<string, unknown>) => ({
              eq: vi.fn(() => {
                cpuStock = payload.stock as number;
                return Promise.resolve({ data: null, error: null });
              }),
            })),
          };
        }
        return {};
      }),
    };

    vi.spyOn(supabaseModule, "getServiceSupabase").mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseModule.getServiceSupabase>);

    const count = await orderService.restockOrderItems("ord-delete-1");

    expect(count).toBe(4);
    expect(cpuStock).toBe(12); // 8 + 4
  });
});
