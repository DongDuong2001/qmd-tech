import { ShippingFeeCalculationInput, ShippingFeeResult, TrackingInfo } from "./types";
import { ghnAdapter } from "./adapters/ghn";
import { ghtkAdapter } from "./adapters/ghtk";

export class ShippingService {
  async getQuotes(input: ShippingFeeCalculationInput): Promise<ShippingFeeResult[]> {
    const [ghn, ghtk] = await Promise.all([
      ghnAdapter.calculateFee(input),
      ghtkAdapter.calculateFee(input),
    ]);

    return [ghn, ghtk];
  }

  async trackShipment(trackingCode: string, provider: "ghn" | "ghtk"): Promise<TrackingInfo> {
    return {
      trackingCode,
      provider: provider.toUpperCase(),
      status: "In Transit",
      history: [
        {
          time: new Date().toISOString(),
          description: "Bưu kiện đã nhập kho trung chuyển",
          location: "Hub Hà Nội / TP.HCM",
        },
      ],
    };
  }
}

export const shippingService = new ShippingService();
