import { CreatePaymentUrlInput, PaymentUrlResponse } from "../types";

export interface SePayConfig {
  merchantId?: string;
  apiKey: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface SePayPaymentDetails {
  qrUrl: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amountVnd: number;
  orderCode: string;
  description: string;
}

export class SePayAdapter {
  private config: SePayConfig;

  constructor() {
    this.config = {
      merchantId: process.env.SEPAY_MERCHANT_ID || "",
      apiKey: process.env.SEPAY_API_KEY || process.env.SEPAY_SECRET_KEY || "",
      bankName: process.env.SEPAY_BANK_NAME || "MBBank",
      accountNumber: process.env.SEPAY_ACCOUNT_NUMBER || "0988889999",
      accountName: process.env.SEPAY_ACCOUNT_NAME || "QMD TECH CORPORATION",
    };
  }

  /**
   * Normalizes bank name / code for VietQR compatibility
   */
  private normalizeBankName(bank: string): string {
    const clean = bank.trim().toLowerCase().replace(/\s+/g, "");
    const map: Record<string, string> = {
      viettinbank: "VietinBank",
      viettin: "VietinBank",
      vietinbank: "VietinBank",
      vietin: "VietinBank",
      icb: "VietinBank",
      vietcombank: "Vietcombank",
      vietcom: "Vietcombank",
      vcb: "Vietcombank",
      mbbank: "MBBank",
      mb: "MBBank",
      techcombank: "Techcombank",
      tcb: "Techcombank",
      acb: "ACB",
      bidv: "BIDV",
      vpbank: "VPBank",
      vpb: "VPBank",
      tpbank: "TPBank",
      tpb: "TPBank",
      sacombank: "Sacombank",
      stb: "Sacombank",
      hdbank: "HDBank",
      hdb: "HDBank",
      shb: "SHB",
      vib: "VIB",
    };
    return map[clean] || bank.trim();
  }

  /**
   * Generates dynamic VietQR image URL via SePay QR service
   */
  createPaymentUrl(input: CreatePaymentUrlInput): PaymentUrlResponse {
    const { orderCode, amountVnd } = input;
    const { accountNumber, bankName } = this.config;
    const normalizedBank = this.normalizeBankName(bankName);

    // Standard SePay VietQR URL format
    const qrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(
      accountNumber.trim()
    )}&bank=${encodeURIComponent(normalizedBank)}&amount=${amountVnd}&des=${encodeURIComponent(
      orderCode
    )}&template=compact`;

    return {
      paymentUrl: qrUrl,
      transactionRef: orderCode,
    };
  }

  /**
   * Returns complete bank transfer and VietQR details for frontend display
   */
  getPaymentDetails(orderCode: string, amountVnd: number): SePayPaymentDetails {
    const { accountNumber, bankName, accountName } = this.config;
    const normalizedBank = this.normalizeBankName(bankName);
    const qrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(
      accountNumber.trim()
    )}&bank=${encodeURIComponent(normalizedBank)}&amount=${amountVnd}&des=${encodeURIComponent(
      orderCode
    )}&template=compact`;

    return {
      qrUrl,
      bankName: normalizedBank,
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
      amountVnd,
      orderCode,
      description: orderCode,
    };
  }

  /**
   * Validates incoming SePay Webhook Authorization header
   */
  verifyWebhookAuth(authHeader?: string | null): boolean {
    if (!this.config.apiKey) {
      // If no API key configured in development, allow for testing
      return true;
    }

    if (!authHeader) return false;

    // SePay sends: "Apikey <YOUR_SEPAY_API_KEY>"
    const expected = `Apikey ${this.config.apiKey}`;
    const tokenOnly = this.config.apiKey;

    return (
      authHeader === expected ||
      authHeader === tokenOnly ||
      authHeader === `Bearer ${tokenOnly}`
    );
  }
}

export const sepayAdapter = new SePayAdapter();
