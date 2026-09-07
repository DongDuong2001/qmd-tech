"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { CartItem, Product } from "@/shared/types";
import { cartService } from "@/modules/cart/service";
import { CheckCircle2, X } from "lucide-react";

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  loading: boolean;
  toastMessage: string | null;
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items);
        }
      }
    } catch (err) {
      console.warn("CartProvider.refreshCart error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = async (product: Product, quantity = 1): Promise<boolean> => {
    // Optimistic local update
    setItems((prev) => cartService.addItem(prev, product, quantity));
    showToast(`Đã thêm "${product.name_vi}" vào giỏ hàng!`);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items);
          return true;
        }
      }
    } catch (err) {
      console.warn("CartProvider.addToCart API notice:", err);
    }
    return true;
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    setItems((prev) => cartService.updateQuantity(prev, productId, quantity));

    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items);
        }
      }
    } catch (err) {
      console.warn("CartProvider.updateQuantity API notice:", err);
    }
  };

  const removeFromCart = async (productId: string): Promise<void> => {
    setItems((prev) => cartService.removeItem(prev, productId));

    try {
      const res = await fetch(`/api/cart?product_id=${encodeURIComponent(productId)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items);
        }
      }
    } catch (err) {
      console.warn("CartProvider.removeFromCart API notice:", err);
    }
  };

  const clearCart = async (): Promise<void> => {
    setItems([]);
    try {
      await fetch("/api/cart", { method: "DELETE" });
    } catch (err) {
      console.warn("CartProvider.clearCart API notice:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        loading,
        toastMessage,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-[#86EFAC] bg-[#DCFCE7] px-4 py-3 text-xs font-bold text-[#15803D] shadow-xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#16A34A]" />
          <span className="max-w-xs truncate">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-1 rounded p-1 text-[#15803D] hover:bg-[#BBF7D0]"
            aria-label="Đóng thông báo"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
