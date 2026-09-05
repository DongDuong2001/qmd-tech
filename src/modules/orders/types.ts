import { CartItem, Order } from "@/shared/types";

export interface CreateOrderInput {
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict?: string;
  paymentMethod: "sepay" | "vnpay" | "momo" | "zalopay" | "stripe" | "cod" | "bank_transfer";
  shippingProvider?: "ghn" | "ghtk" | "express";
  items: CartItem[];
  customBuildId?: string;
  notes?: string;
}

export interface OrderActionResult {
  success: boolean;
  order?: Order;
  paymentUrl?: string;
  error?: string;
}
