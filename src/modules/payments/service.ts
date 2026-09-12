import {
  CreatePaymentUrlInput,
  PaymentProvider,
  PaymentTransaction,
  PaymentUrlResponse,
  SePayWebhookPayload,
} from "./types";
import { vnpayAdapter } from "./adapters/vnpay";
import { momoAdapter } from "./adapters/momo";
import { sepayAdapter, SePayPaymentDetails } from "./adapters/sepay";
import { orderService } from "../orders/service";
import { getServiceSupabase } from "@/shared/db/supabase";

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

  async recordTransaction(data: {
    order_id?: string | null;
    order_code: string;
    provider: PaymentProvider;
    transaction_id: string;
    amount_vnd: number;
    transfer_type: "in" | "out";
    account_number?: string | null;
    content?: string | null;
    raw_payload?: Record<string, unknown> | null;
    status: "success" | "duplicate" | "amount_mismatch" | "failed";
  }): Promise<void> {
    try {
      const db = getServiceSupabase();
      await db.from("payment_transactions").upsert(
        {
          order_id: data.order_id,
          order_code: data.order_code,
          provider: data.provider,
          transaction_id: data.transaction_id,
          amount_vnd: data.amount_vnd,
          transfer_type: data.transfer_type,
          account_number: data.account_number,
          content: data.content,
          raw_payload: data.raw_payload,
          status: data.status,
        },
        { onConflict: "transaction_id" }
      );
    } catch (err) {
      console.warn("Could not persist payment transaction log:", err);
    }
  }

  async getTransactionByTxId(transactionId: string): Promise<PaymentTransaction | null> {
    try {
      const db = getServiceSupabase();
      const { data, error } = await db
        .from("payment_transactions")
        .select("*")
        .eq("transaction_id", transactionId)
        .maybeSingle();
      if (error || !data) return null;
      return data as PaymentTransaction;
    } catch {
      return null;
    }
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

    const txId = String(payload.id || payload.referenceCode || "");

    // 2b. Check Idempotency via payment_transactions table
    if (txId) {
      const existingRecord = await this.getTransactionByTxId(txId);
      if (existingRecord && existingRecord.status === "success") {
        return {
          success: true,
          message: `Giao dịch ${txId} đã được ghi nhận và xử lý thành công trước đó (Idempotent).`,
        };
      }
    }

    // 2c. Verify destination account number if configured
    const configuredAccount = (process.env.SEPAY_ACCOUNT_NUMBER || "").trim();
    if (configuredAccount && payload.accountNumber) {
      if (payload.accountNumber.trim() !== configuredAccount) {
        if (txId) {
          await this.recordTransaction({
            order_code: "UNKNOWN",
            provider: "sepay",
            transaction_id: txId,
            amount_vnd: payload.transferAmount,
            transfer_type: payload.transferType,
            account_number: payload.accountNumber,
            content: payload.content,
            raw_payload: payload as unknown as Record<string, unknown>,
            status: "failed",
          });
        }
        return {
          success: false,
          message: `Số tài khoản nhận (${payload.accountNumber}) không khớp với tài khoản hệ thống.`,
        };
      }
    }

    // 3. Extract order code from content / description
    const textToSearch = `${payload.content || ""} ${payload.description || ""}`.toUpperCase();
    const match = textToSearch.match(/QMD-[A-Z0-9]+-[0-9]+/i);

    if (!match) {
      if (txId) {
        await this.recordTransaction({
          order_code: "UNKNOWN",
          provider: "sepay",
          transaction_id: txId,
          amount_vnd: payload.transferAmount,
          transfer_type: payload.transferType,
          account_number: payload.accountNumber,
          content: payload.content,
          raw_payload: payload as unknown as Record<string, unknown>,
          status: "failed",
        });
      }
      return {
        success: false,
        message: "Không tìm thấy mã đơn hàng QMD trong nội dung chuyển khoản.",
      };
    }

    const orderCode = match[0].toUpperCase();
    const order = await orderService.getOrderByCode(orderCode);

    if (!order) {
      if (txId) {
        await this.recordTransaction({
          order_code: orderCode,
          provider: "sepay",
          transaction_id: txId,
          amount_vnd: payload.transferAmount,
          transfer_type: payload.transferType,
          account_number: payload.accountNumber,
          content: payload.content,
          raw_payload: payload as unknown as Record<string, unknown>,
          status: "failed",
        });
      }
      return {
        success: false,
        message: `Không tìm thấy đơn hàng với mã: ${orderCode}`,
      };
    }

    // 4. Verify amount
    if (payload.transferAmount < order.total_vnd) {
      if (txId) {
        await this.recordTransaction({
          order_id: order.id,
          order_code: orderCode,
          provider: "sepay",
          transaction_id: txId,
          amount_vnd: payload.transferAmount,
          transfer_type: payload.transferType,
          account_number: payload.accountNumber,
          content: payload.content,
          raw_payload: payload as unknown as Record<string, unknown>,
          status: "amount_mismatch",
        });
      }
      return {
        success: false,
        message: `Số tiền chuyển khoản (${payload.transferAmount}đ) nhỏ hơn tổng đơn hàng (${order.total_vnd}đ).`,
      };
    }

    // 5. Check idempotency and state machine
    if (order.payment_status === "paid") {
      if (txId) {
        await this.recordTransaction({
          order_id: order.id,
          order_code: orderCode,
          provider: "sepay",
          transaction_id: txId,
          amount_vnd: payload.transferAmount,
          transfer_type: payload.transferType,
          account_number: payload.accountNumber,
          content: payload.content,
          raw_payload: payload as unknown as Record<string, unknown>,
          status: "duplicate",
        });
      }
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

    // 6. Mark order as paid
    const updated = await orderService.markOrderPaid(order.id, txId, "sepay");
    if (!updated) {
      const refreshed = await orderService.getOrderByCode(orderCode);
      if (refreshed?.payment_status === "paid") {
        if (txId) {
          await this.recordTransaction({
            order_id: order.id,
            order_code: orderCode,
            provider: "sepay",
            transaction_id: txId,
            amount_vnd: payload.transferAmount,
            transfer_type: payload.transferType,
            account_number: payload.accountNumber,
            content: payload.content,
            raw_payload: payload as unknown as Record<string, unknown>,
            status: "success",
          });
        }
        return {
          success: true,
          message: `Đơn hàng ${orderCode} đã được xác nhận thanh toán trước đó.`,
        };
      }
      throw new Error(`Cập nhật trạng thái thanh toán cho đơn hàng ${orderCode} thất bại.`);
    }

    // Record success in payment_transactions
    if (txId) {
      await this.recordTransaction({
        order_id: order.id,
        order_code: orderCode,
        provider: "sepay",
        transaction_id: txId,
        amount_vnd: payload.transferAmount,
        transfer_type: payload.transferType,
        account_number: payload.accountNumber,
        content: payload.content,
        raw_payload: payload as unknown as Record<string, unknown>,
        status: "success",
      });
    }

    return {
      success: true,
      message: `Đơn hàng ${orderCode} đã được xác nhận thanh toán tự động qua SePay!`,
    };
  }
}

export const paymentService = new PaymentService();
