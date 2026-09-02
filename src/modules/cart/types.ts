import { Cart, Product } from "@/shared/types";

export interface AddToCartInput {
  product: Product;
  quantity?: number;
}

export interface CartCalculationResult {
  cart: Cart;
  isEligibleForFreeShipping: boolean;
  freeShippingThresholdVnd: number;
  remainingForFreeShippingVnd: number;
}
