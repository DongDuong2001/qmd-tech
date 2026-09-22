"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Product } from "@/shared/types";
import { useCart } from "@/shared/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart01Icon,
  ZapIcon,
  Wrench01Icon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/HugeIcon";

interface ProductDetailActionsProps {
  product: Product;
  addToCartText: string;
}

export function ProductDetailActions({
  product,
  addToCartText,
}: ProductDetailActionsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainActionsRef = useRef<HTMLDivElement>(null);
  const isOutOfStock = product.stock <= 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when main buy button scrolls out of view above
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0.1 }
    );

    if (mainActionsRef.current) {
      observer.observe(mainActionsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    await addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    await addToCart(product, quantity);
    router.push("/thanh-toan");
  };

  return (
    <div className="space-y-4 pt-2" ref={mainActionsRef}>
      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#475569] uppercase">Số lượng:</span>
          <div className="flex items-center rounded-lg border border-[#CBD5E1] bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 text-[#64748B] hover:text-[#0F172A] disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="Giảm số lượng"
            >
              <HugeIcon icon={MinusIcon} className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center text-xs font-mono font-bold text-[#0F172A]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="p-2 text-[#64748B] hover:text-[#0F172A] disabled:opacity-40"
              disabled={quantity >= product.stock}
              aria-label="Tăng số lượng"
            >
              <HugeIcon icon={PlusIcon} className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-[11px] text-[#64748B]">
            (Còn {product.stock} sản phẩm)
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          variant="outline"
          size="lg"
          className={`gap-2 font-bold shadow-xs border-[#CBD5E1] transition-all ${
            isAdded ? "border-[#16A34A] text-[#16A34A] bg-[#DCFCE7]" : "hover:border-[#0063FD] hover:text-[#0063FD]"
          }`}
        >
          {isAdded ? (
            <>
              <HugeIcon icon={CheckIcon} className="h-5 w-5 text-[#16A34A]" />
              Đã thêm giỏ hàng
            </>
          ) : (
            <>
              <HugeIcon icon={ShoppingCart01Icon} className="h-5 w-5" />
              {addToCartText}
            </>
          )}
        </Button>

        <Button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          variant="primary"
          size="lg"
          className="gap-2 font-black shadow-xs bg-[#0063FD] hover:bg-[#0052D4]"
        >
          <HugeIcon icon={ZapIcon} className="h-5 w-5 fill-current" />
          Mua ngay
        </Button>

        <Link href="/build-pc" className="w-full">
          <Button
            variant="accent"
            size="lg"
            className="w-full gap-2 font-bold shadow-xs"
          >
            <HugeIcon icon={Wrench01Icon} className="h-5 w-5" />
            Custom PC Build
          </Button>
        </Link>
      </div>

      {/* Floating Sticky Purchase Bar on Scroll */}
      {showStickyBar && (
        <div className="fixed bottom-14 sm:bottom-4 left-0 right-0 z-30 px-3 sm:px-6 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-[#CBD5E1] p-2.5 sm:p-3 shadow-xl pointer-events-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              {product.images[0] && (
                <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                  <Image
                    src={product.images[0]}
                    alt={product.name_vi}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                  {product.name_vi}
                </div>
                <div className="text-sm sm:text-base font-black font-mono text-[#0063FD]">
                  {new Intl.NumberFormat("vi-VN").format(product.price_vnd)} ₫
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                variant="outline"
                size="sm"
                className="gap-1.5 font-bold border-[#CBD5E1]"
              >
                <HugeIcon icon={isAdded ? CheckIcon : ShoppingCart01Icon} className="h-4 w-4 text-[#0063FD]" />
                <span className="hidden xs:inline">{isAdded ? "Đã thêm" : "Thêm giỏ"}</span>
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                variant="primary"
                size="sm"
                className="gap-1.5 font-black bg-[#0063FD] hover:bg-[#0052D4]"
              >
                <HugeIcon icon={ZapIcon} className="h-4 w-4 fill-current" />
                <span>Mua ngay</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
