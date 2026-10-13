"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Product, Wishlist, WishlistItem } from "@/shared/types";

interface WishlistContextType {
  wishlist: Wishlist;
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "qmd_wishlist";

function getStoredWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

function setStoredWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Wishlist>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const refreshWishlist = useCallback(() => {
    const items = getStoredWishlist();
    setWishlist({ items, total: items.length });
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.items.some((item) => item.product_id === productId);
  }, [wishlist.items]);

  const addToWishlist = async (product: Product): Promise<void> => {
    if (isInWishlist(product.id)) return;

    const newItem: WishlistItem = {
      product_id: product.id,
      product,
      added_at: new Date().toISOString(),
    };

    const updatedItems = [...wishlist.items, newItem];
    setWishlist({ items: updatedItems, total: updatedItems.length });
    setStoredWishlist(updatedItems);
  };

  const removeFromWishlist = async (productId: string): Promise<void> => {
    const updatedItems = wishlist.items.filter((item) => item.product_id !== productId);
    setWishlist({ items: updatedItems, total: updatedItems.length });
    setStoredWishlist(updatedItems);
  };

  const clearWishlist = async (): Promise<void> => {
    setWishlist({ items: [], total: 0 });
    setStoredWishlist([]);
  };

  const toggleWishlist = async (product: Product): Promise<void> => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}