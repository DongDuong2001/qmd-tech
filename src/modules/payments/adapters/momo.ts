import { CreatePaymentUrlInput, PaymentUrlResponse } from "../types";

export class MoMoAdapter {
  private partnerCode: string;
  private endpoint: string;

  constructor() {
    this.partnerCode = process.env.MOMO_PARTNER_CODE || "";
    this.endpoint = process.env.MOMO_API_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";
  }

  async createPaymentUrl(input: CreatePaymentUrlInput): Promise<PaymentUrlResponse> {
    if (!this.partnerCode) {
      throw new Error("MoMo credentials (MOMO_PARTNER_CODE) are not configured.");
    }
    const requestId = `momo-${Date.now()}`;
    // Simulating MoMo redirect gateway URL
    const paymentUrl = `${this.endpoint}?partnerCode=${this.partnerCode}&orderId=${input.orderCode}&requestId=${requestId}&amount=${input.amountVnd}&redirectUrl=${encodeURIComponent(input.returnUrl)}`;

    return {
      paymentUrl,
      transactionRef: input.orderCode,
    };
  }
}

export const momoAdapter = new MoMoAdapter();
