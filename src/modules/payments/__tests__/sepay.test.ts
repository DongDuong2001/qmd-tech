import { describe, it, expect, vi } from "vitest";
import { sepayAdapter } from "../adapters/sepay";
import { paymentService } from "../service";
import { orderService } from "../../orders/service";
import { Order } from "@/shared/types";

describe("SePay Payment Gateway Suite", () => {
  it("should generate a valid SePay VietQR payment URL", () => {
    const input = {
      orderId: "ord-123",
      orderCode: "QMD-M1X8K-5820",
      amountVnd: 15490000,
      orderInfo: "Thanh toan don hang QMD",
      returnUrl: "https://qmdtech.vercel.app/thanh-toan",
    };

    const res = sepayAdapter.createPaymentUrl(input);

    expect(res.paymentUrl).toContain("https://qr.sepay.vn/img");
    expect(res.paymentUrl).toContain("amount=15490000");
    expect(res.paymentUrl).toContain("des=QMD-M1X8K-5820");
    expect(res.transactionRef).toBe("QMD-M1X8K-5820");
  });

  it("should return detailed payment info with bank credentials", () => {
    const details = sepayAdapter.getPaymentDetails("QMD-ABC-1234", 5000000);

    expect(details.orderCode).toBe("QMD-ABC-1234");
    expect(details.amountVnd).toBe(5000000);
    expect(details.qrUrl).toContain("amount=5000000");
    expect(details.accountNumber).toBeDefined();
    expect(details.bankName).toBeDefined();
  });

  it("should verify SePay webhook authorization header", () => {
    // With empty or matching key
    expect(sepayAdapter.verifyWebhookAuth(null)).toBe(true);
  });

  it("should process incoming webhook and reconcile order when valid", async () => {
    const fakeOrder = {
      id: "ord-test-99",
      order_code: "QMD-PAY-7788",
      total_vnd: 2000000,
      payment_status: "unpaid",
      status: "pending",
    };

    vi.spyOn(orderService, "getOrderByCode").mockResolvedValue(fakeOrder as unknown as Order);
    const markPaidSpy = vi.spyOn(orderService, "markOrderPaid").mockResolvedValue(true);

    const webhookPayload = {
      id: 998877,
      gateway: "MBBank",
      transactionDate: "2026-09-05 11:30:00",
      accountNumber: "0988889999",
      code: null,
      content: "Chuyen tien don hang QMD-PAY-7788",
      transferType: "in" as const,
      transferAmount: 2000000,
      accumulated: 50000000,
      referenceCode: "FT262489999999",
      description: "QMD-PAY-7788",
    };

    const result = await paymentService.processSePayWebhook(webhookPayload, null);

    expect(result.success).toBe(true);
    expect(result.message).toContain("QMD-PAY-7788");
    expect(markPaidSpy).toHaveBeenCalledWith("ord-test-99", "998877", "sepay");
  });
});
