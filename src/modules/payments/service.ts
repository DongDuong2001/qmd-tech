import { CreatePaymentUrlInput, PaymentProvider, PaymentUrlResponse } from "./types";
import { vnpayAdapter } from "./adapters/vnpay";
import { momoAdapter } from "./adapters/momo";

export class PaymentService {
  async createPayment(provider: PaymentProvider, input: CreatePaymentUrlInput): Promise<PaymentUrlResponse> {
    switch (provider) {
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
}

export const paymentService = new PaymentService();
