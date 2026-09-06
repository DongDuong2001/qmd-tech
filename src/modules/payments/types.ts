export type PaymentProvider =
  | "sepay"
  | "vnpay"
  | "momo"
  | "zalopay"
  | "stripe"
  | "cod"
  | "bank_transfer";

export interface CreatePaymentUrlInput {
  orderId: string;
  orderCode: string;
  amountVnd: number;
  orderInfo: string;
  returnUrl: string;
  ipAddress?: string;
  locale?: "vn" | "en";
}

export interface PaymentUrlResponse {
  paymentUrl: string;
  transactionRef: string;
}

export interface PaymentWebhookPayload {
  provider: PaymentProvider;
  transactionId: string;
  orderCode: string;
  amount: number;
  status: "success" | "failed";
  rawQuery?: Record<string, string>;
}

export interface SePayWebhookPayload {
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: string | null;
  content: string;
  transferType: "in" | "out";
  transferAmount: number;
  accumulated: number;
  referenceCode: string;
  description: string;
}
