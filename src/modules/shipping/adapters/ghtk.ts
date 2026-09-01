import { ShippingFeeCalculationInput, ShippingFeeResult } from "../types";

export class GHTKAdapter {
  private apiToken: string;

  constructor() {
    this.apiToken = process.env.GHTK_API_TOKEN || "mock_ghtk_token";
  }

  async calculateFee(input: ShippingFeeCalculationInput): Promise<ShippingFeeResult> {
    const baseFee = 40000;
    const weightFee = Math.max(0, Math.floor((input.weightGrams - 1000) / 500) * 8000);

    return {
      provider: "ghtk",
      serviceName: "Giao Hàng Tiết Kiệm - Tiêu Chuẩn",
      feeVnd: baseFee + weightFee,
      expectedDeliveryDays: 3,
    };
  }
}

export const ghtkAdapter = new GHTKAdapter();
