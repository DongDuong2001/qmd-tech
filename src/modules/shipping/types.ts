export interface ShippingFeeCalculationInput {
  toDistrictId?: number;
  toWardCode?: string;
  toAddress: string;
  weightGrams: number;
  insuranceValueVnd: number;
}

export interface ShippingFeeResult {
  provider: "ghn" | "ghtk";
  serviceName: string;
  feeVnd: number;
  expectedDeliveryDays: number;
}

export interface TrackingInfo {
  trackingCode: string;
  provider: string;
  status: string;
  history: {
    time: string;
    description: string;
    location?: string;
  }[];
}
