"use client";

import React, { useState } from "react";
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
  const isOutOfStock = product.stock <= 0;

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
    <div className="space-y-4 pt-2">
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
    </div>
  );
}
