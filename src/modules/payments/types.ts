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

export interface PaymentTransaction {
  id: string;
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
  created_at?: string;
}
