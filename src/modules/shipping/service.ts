import { ShippingFeeCalculationInput, ShippingFeeResult, TrackingInfo } from "./types";

export class ShippingService {
  async getQuotes(input: ShippingFeeCalculationInput): Promise<ShippingFeeResult[]> {
    const isHanoi =
      input.toAddress?.toLowerCase().includes("hà nội") ||
      input.toAddress?.toLowerCase().includes("ha noi");

    const quotes: ShippingFeeResult[] = [];

    if (isHanoi) {
      quotes.push({
        provider: "qmd_express",
        serviceName: "QMD Express — Hỏa Tốc Nội Thành Hà Nội",
        feeVnd: 0,
        expectedDeliveryDays: 0,
      });
    }

    quotes.push({
      provider: "standard",
      serviceName: "Chuyển Phát Toàn Quốc 34 Tỉnh Thành (QMD Điều Phối)",
      feeVnd: isHanoi ? 30000 : 40000,
      expectedDeliveryDays: isHanoi ? 1 : 2,
    });

    return quotes;
  }

  async trackShipment(
    trackingCode: string,
    provider: "qmd_express" | "standard" | "ghn" | "ghtk"
  ): Promise<TrackingInfo> {
    return {
      trackingCode,
      provider: provider.toUpperCase(),
      status: "In Transit",
      history: [
        {
          time: new Date().toISOString(),
          description: "Đơn hàng đã được QMD-Tech đóng gói và bàn giao bộ phận điều phối vận chuyển.",
          location: "Kho QMD-Tech Hà Nội",
        },
      ],
    };
  }
}

export const shippingService = new ShippingService();
