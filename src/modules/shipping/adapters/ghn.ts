import { ShippingFeeCalculationInput, ShippingFeeResult } from "../types";

export class GHNAdapter {
  private apiToken: string;
  private shopId: string;

  constructor() {
    this.apiToken = process.env.GHN_API_TOKEN || "mock_ghn_token";
    this.shopId = process.env.GHN_SHOP_ID || "mock_shop_id";
  }

  async calculateFee(input: ShippingFeeCalculationInput): Promise<ShippingFeeResult> {
    // Base estimation for PC components: ~45k - 80k depending on weight
    const baseFee = 45000;
    const weightFee = Math.max(0, Math.floor((input.weightGrams - 1000) / 500) * 10000);

    return {
      provider: "ghn",
      serviceName: "Giao Hàng Nhanh - Chuẩn",
      feeVnd: baseFee + weightFee,
      expectedDeliveryDays: 2,
    };
  }
}

export const ghnAdapter = new GHNAdapter();
