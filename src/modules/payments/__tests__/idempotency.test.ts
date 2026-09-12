import { describe, it, expect, vi, beforeEach } from "vitest";
import { paymentService } from "../service";
import { orderService } from "../../orders/service";
import { sepayAdapter } from "../adapters/sepay";
import * as supabaseModule from "@/shared/db/supabase";

describe("Payment Webhook Idempotency & Reconciliation Log", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    id: 998877,
    gateway: "Vietcombank",
    transactionDate: "2026-09-12 14:00:00",
    accountNumber: "0123456789",
    code: null,
    content: "THANH TOAN DON HANG QMD-DEMO1-1001",
    transferType: "in" as const,
    transferAmount: 5000000,
    accumulated: 10000000,
    referenceCode: "VCB998877",
    description: "Thanh toan linh kien",
  };

  it("handles duplicate webhook idempotently when already recorded as success", async () => {
    vi.spyOn(sepayAdapter, "verifyWebhookAuth").mockReturnValue(true);

    const mockRecordedTx = {
      id: "tx-uuid-1",
      order_code: "QMD-DEMO1-1001",
      transaction_id: "998877",
      amount_vnd: 5000000,
      status: "success",
    };

    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockRecordedTx, error: null }),
          })),
        })),
        upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    };

    vi.spyOn(supabaseModule, "getServiceSupabase").mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseModule.getServiceSupabase>);

    const result = await paymentService.processSePayWebhook(validPayload, "Bearer test-key");

    expect(result.success).toBe(true);
    expect(result.message).toContain("Idempotent");
  });

  it("records amount mismatch and rejects underpayment", async () => {
    vi.spyOn(sepayAdapter, "verifyWebhookAuth").mockReturnValue(true);

    const underpaidPayload = {
      ...validPayload,
      id: 998878,
      transferAmount: 2000000, // Less than order total 5,000,000
    };

    const mockOrder = {
      id: "ord-demo-1",
      order_code: "QMD-DEMO1-1001",
      total_vnd: 5000000,
      payment_status: "pending",
      status: "pending",
    };

    vi.spyOn(orderService, "getOrderByCode").mockResolvedValue(mockOrder as unknown as Awaited<ReturnType<typeof orderService.getOrderByCode>>);

    const recordedTxs: Record<string, unknown>[] = [];
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
        upsert: vi.fn((data: Record<string, unknown>) => {
          recordedTxs.push(data);
          return Promise.resolve({ data: null, error: null });
        }),
      })),
    };

    vi.spyOn(supabaseModule, "getServiceSupabase").mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseModule.getServiceSupabase>);

    const result = await paymentService.processSePayWebhook(underpaidPayload, "Bearer test-key");

    expect(result.success).toBe(false);
    expect(result.message).toContain("nhỏ hơn tổng đơn hàng");
    expect(recordedTxs.length).toBe(1);
    expect(recordedTxs[0].status).toBe("amount_mismatch");
  });

  it("successfully marks order as paid and records transaction log", async () => {
    vi.spyOn(sepayAdapter, "verifyWebhookAuth").mockReturnValue(true);

    const exactPayload = {
      ...validPayload,
      id: 998879,
    };

    const mockOrder = {
      id: "ord-demo-2",
      order_code: "QMD-DEMO1-1001",
      total_vnd: 5000000,
      payment_status: "pending",
      status: "pending",
    };

    vi.spyOn(orderService, "getOrderByCode").mockResolvedValue(mockOrder as unknown as Awaited<ReturnType<typeof orderService.getOrderByCode>>);
    vi.spyOn(orderService, "markOrderPaid").mockResolvedValue(true);

    const recordedTxs: Record<string, unknown>[] = [];
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
        upsert: vi.fn((data: Record<string, unknown>) => {
          recordedTxs.push(data);
          return Promise.resolve({ data: null, error: null });
        }),
      })),
    };

    vi.spyOn(supabaseModule, "getServiceSupabase").mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseModule.getServiceSupabase>);

    const result = await paymentService.processSePayWebhook(exactPayload, "Bearer test-key");

    expect(result.success).toBe(true);
    expect(result.message).toContain("xác nhận thanh toán tự động");
    expect(recordedTxs.length).toBe(1);
    expect(recordedTxs[0].status).toBe("success");
    expect(recordedTxs[0].transaction_id).toBe("998879");
  });
});
