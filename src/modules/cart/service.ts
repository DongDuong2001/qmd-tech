import { Cart, CartItem, Product } from "@/shared/types";
import { CartCalculationResult } from "./types";

export class CartService {
  private readonly FREE_SHIPPING_THRESHOLD_VND = 5000000; // Free shipping for orders >= 5,000,000 VND
  private readonly BASE_SHIPPING_FEE_VND = 50000;

  calculateCart(items: CartItem[], couponCode?: string): CartCalculationResult {
    let subtotalVnd = 0;

    const normalizedItems = items.map((item) => {
      const lineTotal = item.unit_price_vnd * item.quantity;
      subtotalVnd += lineTotal;
      return {
        ...item,
        total_price_vnd: lineTotal,
      };
    });

    let discountVnd = 0;
    if (couponCode && couponCode.toUpperCase() === "QMDTECH500") {
      discountVnd = 500000; // 500k VND discount
    }

    const isEligibleForFreeShipping = subtotalVnd >= this.FREE_SHIPPING_THRESHOLD_VND || subtotalVnd === 0;
    const shippingFeeVnd = isEligibleForFreeShipping ? 0 : this.BASE_SHIPPING_FEE_VND;
    const totalVnd = Math.max(0, subtotalVnd - discountVnd + shippingFeeVnd);
    const remainingForFreeShippingVnd = Math.max(0, this.FREE_SHIPPING_THRESHOLD_VND - subtotalVnd);

    const cart: Cart = {
      items: normalizedItems,
      subtotal_vnd: subtotalVnd,
      discount_vnd: discountVnd,
      shipping_fee_vnd: shippingFeeVnd,
      total_vnd: totalVnd,
    };

    return {
      cart,
      isEligibleForFreeShipping,
      freeShippingThresholdVnd: this.FREE_SHIPPING_THRESHOLD_VND,
      remainingForFreeShippingVnd,
    };
  }

  addItem(currentItems: CartItem[], product: Product, quantity = 1): CartItem[] {
    const existingIndex = currentItems.findIndex((item) => item.product_id === product.id);

    if (existingIndex > -1) {
      const updated = [...currentItems];
      const newQty = updated[existingIndex].quantity + quantity;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        total_price_vnd: newQty * product.price_vnd,
      };
      return updated;
    }

    return [
      ...currentItems,
      {
        product_id: product.id,
        product,
        quantity,
        unit_price_vnd: product.price_vnd,
        total_price_vnd: product.price_vnd * quantity,
      },
    ];
  }

  updateQuantity(currentItems: CartItem[], productId: string, quantity: number): CartItem[] {
    if (quantity <= 0) {
      return currentItems.filter((i) => i.product_id !== productId);
    }

    return currentItems.map((item) => {
      if (item.product_id === productId) {
        return {
          ...item,
          quantity,
          total_price_vnd: item.unit_price_vnd * quantity,
        };
      }
      return item;
    });
  }

  removeItem(currentItems: CartItem[], productId: string): CartItem[] {
    return currentItems.filter((i) => i.product_id !== productId);
  }
}

export const cartService = new CartService();
