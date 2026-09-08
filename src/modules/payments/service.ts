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

    // 2b. Verify destination account number if configured
    const configuredAccount = (process.env.SEPAY_ACCOUNT_NUMBER || "").trim();
    if (configuredAccount && payload.accountNumber) {
      if (payload.accountNumber.trim() !== configuredAccount) {
        return {
          success: false,
          message: `Số tài khoản nhận (${payload.accountNumber}) không khớp với tài khoản hệ thống.`,
        };
      }
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

    // 5. Check idempotency and state machine
    if (order.payment_status === "paid") {
      return {
        success: true,
        message: `Đơn hàng ${orderCode} đã được xác nhận thanh toán trước đó.`,
      };
    }

    if (order.status === "cancelled") {
      return {
        success: false,
        message: `Đơn hàng ${orderCode} đã bị hủy, không thể tiếp nhận thanh toán tự động.`,
      };
    }

    // 5b. Prevent cross-order transaction replay attacks
    try {
      const existingTx = await orderService.getOrderByTransactionId(String(payload.id));
      if (existingTx) {
        if (existingTx.id === order.id) {
          return {
            success: true,
            message: `Giao dịch ${payload.id} đã được xử lý cho đơn hàng ${orderCode} trước đó.`,
          };
        }
        return {
          success: false,
          message: `Mã giao dịch ${payload.id} đã được sử dụng cho đơn hàng khác (${existingTx.order_code}). Từ chối xử lý lặp lại.`,
        };
      }
    } catch {
      // If check fails, markOrderPaid will enforce idempotency
    }

    // 6. Mark order as paid
    const updated = await orderService.markOrderPaid(order.id, String(payload.id), "sepay");
    if (!updated) {
      const refreshed = await orderService.getOrderByCode(orderCode);
      if (refreshed?.payment_status === "paid") {
        return {
          success: true,
          message: `Đơn hàng ${orderCode} đã được xác nhận thanh toán trước đó.`,
        };
      }
      throw new Error(`Cập nhật trạng thái thanh toán cho đơn hàng ${orderCode} thất bại.`);
    }

    return {
      success: true,
      message: `Đơn hàng ${orderCode} đã được xác nhận thanh toán tự động qua SePay!`,
    };
  }
}

export const paymentService = new PaymentService();
