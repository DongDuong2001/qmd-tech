import { CreatePaymentUrlInput, PaymentUrlResponse } from "../types";

export class VNPayAdapter {
  private tmnCode: string;
  private hashSecret: string;
  private vnpUrl: string;

  constructor() {
    this.tmnCode = process.env.VNPAY_TMN_CODE || "SANDBOX_TMN";
    this.hashSecret = process.env.VNPAY_HASH_SECRET || "SANDBOX_SECRET";
    this.vnpUrl = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  }

  createPaymentUrl(input: CreatePaymentUrlInput): PaymentUrlResponse {
    const createDate = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const params: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: input.locale === "en" ? "en" : "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: input.orderCode,
      vnp_OrderInfo: input.orderInfo || `Thanh toan don hang ${input.orderCode}`,
      vnp_OrderType: "other",
      vnp_Amount: (input.amountVnd * 100).toString(),
      vnp_ReturnUrl: input.returnUrl,
      vnp_IpAddr: input.ipAddress || "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    // Sort parameters alphabetically
    const sortedKeys = Object.keys(params).sort();
    const query = sortedKeys
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join("&");

    // In a live integration, HMAC-SHA512 is computed with hashSecret
    const mockSecureHash = "mock_vnpay_hash_" + Buffer.from(query).toString("base64").slice(0, 32);
    const paymentUrl = `${this.vnpUrl}?${query}&vnp_SecureHash=${mockSecureHash}`;

    return {
      paymentUrl,
      transactionRef: input.orderCode,
    };
  }

  verifyReturnUrl(params: Record<string, string>): { isValid: boolean; orderCode: string; isSuccess: boolean } {
    const responseCode = params["vnp_ResponseCode"];
    const orderCode = params["vnp_TxnRef"] || "";

    return {
      isValid: true,
      orderCode,
      isSuccess: responseCode === "00",
    };
  }
}

export const vnpayAdapter = new VNPayAdapter();
