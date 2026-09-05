import {
  CreatePaymentUrlInput,
  PaymentProvider,
  PaymentUrlResponse,
  SePayWebhookPayload,
} from "./types";
import { vnpayAdapter } from "./adapters/vnpay";
import { momoAdapter } from "./adapters/momo";
import { sepayAdapter, SePayPaymentDetails } from "./adapters/sepay";
import { orderService } from "../orders/service";

export class PaymentService {
  async createPayment(
    provider: PaymentProvider,
    input: CreatePaymentUrlInput
  ): Promise<PaymentUrlResponse> {
    switch (provider) {
      case "sepay":
        return sepayAdapter.createPaymentUrl(input);
      case "vnpay":
        return vnpayAdapter.createPaymentUrl(input);
      case "momo":
        return momoAdapter.createPaymentUrl(input);
      case "cod":
      case "bank_transfer":
        return {
          paymentUrl: `${input.returnUrl}?status=pending&orderCode=${input.orderCode}`,
          transactionRef: input.orderCode,
        };
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }

  getSePayPaymentDetails(orderCode: string, amountVnd: number): SePayPaymentDetails {
    return sepayAdapter.getPaymentDetails(orderCode, amountVnd);
  }

  async processSePayWebhook(
    payload: SePayWebhookPayload,
    authHeader?: string | null
  ): Promise<{ success: boolean; message: string }> {
    // 1. Authenticate webhook request
    if (!sepayAdapter.verifyWebhookAuth(authHeader)) {
      throw new Error("Xác thực Webhook SePay thất bại: API Key không hợp lệ.");
    }

    // 2. Only process incoming money transfers
    if (payload.transferType !== "in") {
      return { success: true, message: "Bỏ qua giao dịch không phải tiền vào (transferType !== 'in')." };
    }

    // 3. Extract order code from content / description
    // Example content: "QMD-M1X8K-5820" or "THANH TOAN DON HANG QMD-M1X8K-5820"
    const textToSearch = `${payload.content || ""} ${payload.description || ""}`.toUpperCase();
    const match = textToSearch.match(/QMD-[A-Z0-9]+-[0-9]+/i);

    if (!match) {
      return {
        success: false,
        message: "Không tìm thấy mã đơn hàng QMD trong nội dung chuyển khoản.",
      };
    }

    const orderCode = match[0].toUpperCase();
    const order = await orderService.getOrderByCode(orderCode);

    if (!order) {
      return {
        success: false,
        message: `Không tìm thấy đơn hàng với mã: ${orderCode}`,
      };
    }

    // 4. Verify amount
    if (payload.transferAmount < order.total_vnd) {
      return {
        success: false,
        message: `Số tiền chuyển khoản (${payload.transferAmount}đ) nhỏ hơn tổng đơn hàng (${order.total_vnd}đ).`,
      };
    }

    // 5. Mark order as paid
    await orderService.markOrderPaid(order.id, String(payload.id), "sepay");

    return {
      success: true,
      message: `Đơn hàng ${orderCode} đã được xác nhận thanh toán tự động qua SePay!`,
    };
  }
}

export const paymentService = new PaymentService();
