"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/shared/types";
import { i18nService } from "@/modules/i18n/service";
import { useCart } from "@/shared/context/CartContext";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  ShoppingCart,
  Check,
  ShieldCheck,
  Gift,
  Zap,
  Eye,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onSelectForBuild?: (product: Product) => void;
  isBuilderMode?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onSelectForBuild,
  isBuilderMode,
}: ProductCardProps) {
  const locale = useLocale() as "vi" | "en";
  const t = useTranslations();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleCartClick = async () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      await addToCart(product, 1);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const formattedPrice = i18nService.formatPrice(
    product.price_vnd,
    locale,
    product.price_usd
  );

  const formattedOriginalPrice = product.original_price_vnd
    ? i18nService.formatPrice(product.original_price_vnd, locale)
    : null;

  const discountPercent = product.original_price_vnd
    ? Math.round(
        ((product.original_price_vnd - product.price_vnd) /
          product.original_price_vnd) *
          100
      )
    : null;

  const productName = i18nService.getLocalizedProductName(product, locale);
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="group relative flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-3.5 shadow-xs transition-all duration-300 hover:border-[#0063FD] hover:shadow-md"
    >
      <div>
        {/* Top Badges: Brand & Stock/Discount Tag */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#0063FD]">
            {product.brand}
          </span>

          <div className="flex items-center gap-1">
            {discountPercent && discountPercent > 0 && (
              <Badge variant="discount" className="text-[10px] bg-[#0063FD] text-white">
                -{discountPercent}%
              </Badge>
            )}
            {isOutOfStock ? (
              <Badge variant="danger" className="text-[10px]">Hết hàng</Badge>
            ) : (
              <Badge variant="success" className="text-[10px]">Sẵn hàng</Badge>
            )}
          </div>
        </div>

        {/* Product Image */}
        <Link
          href={`/san-pham/${product.slug}`}
          className="relative block h-40 w-full overflow-hidden rounded-lg bg-[#F8FAFC] border border-[#F1F5F9] mb-2.5 group-hover:border-[#0063FD]/30 transition-colors"
        >
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={productName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-[#94A3B8]">
              Chưa có hình ảnh
            </div>
          )}

          {/* Genuine Guarantee Badge (No Emoji) */}
          <div className="absolute bottom-1.5 left-1.5 rounded bg-white/95 px-2 py-0.5 text-[9px] font-mono font-bold text-[#0F172A] border border-[#E2E8F0] shadow-xs flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-[#16A34A]" />
            <span>Chính Hãng 100%</span>
          </div>

          {/* Quick Preview Hint on Hover */}
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-1 text-white">
            <Eye className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Product Title */}
        <Link
          href={`/san-pham/${product.slug}`}
          className="block text-xs sm:text-sm font-bold text-[#0F172A] line-clamp-2 hover:text-[#0063FD] transition-colors mb-2 leading-snug"
        >
          {productName}
        </Link>

        {/* Key Specs Tags */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          {product.specs?.socket && (
            <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#334155] border border-[#E2E8F0]">
              {String(product.specs.socket)}
            </span>
          )}
          {product.specs?.ram_type && (
            <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#334155] border border-[#E2E8F0]">
              {String(product.specs.ram_type)}
            </span>
          )}
          {product.specs?.tdp_watts && (
            <span className="rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#0063FD] border border-[#BFDBFE]">
              {String(product.specs.tdp_watts)}W
            </span>
          )}
          {product.specs?.vram_gb && (
            <span className="rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#0063FD] border border-[#BFDBFE]">
              {String(product.specs.vram_gb)}GB VRAM
            </span>
          )}
        </div>

        {/* Promotional Gift Tag (Factual Phrasing) */}
        <div className="rounded border border-[#BFDBFE] bg-[#EFF6FF] p-1.5 mb-2.5 text-[10px] text-[#0063FD] flex items-center gap-1.5 font-semibold">
          <Gift className="h-3 w-3 shrink-0 text-[#0063FD]" />
          <span className="truncate">Tặng gói vệ sinh máy + Lót chuột khi mua kèm</span>
        </div>
      </div>

      {/* Pricing & CTA Section */}
      <div className="pt-2 border-t border-[#E2E8F0] relative z-10">
        {/* Slashed and Current Price */}
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <div className="text-base sm:text-lg font-black font-mono text-[#0063FD] leading-tight">
              {formattedPrice}
            </div>
            {formattedOriginalPrice && (
              <div className="text-[11px] font-mono text-[#94A3B8] line-through">
                {formattedOriginalPrice}
              </div>
            )}
          </div>

          <div className="text-right">
            <span className="rounded bg-[#DCFCE7] px-1.5 py-0.5 text-[9px] font-bold text-[#15803D] border border-[#86EFAC]">
              Trả góp 0%
            </span>
          </div>
        </div>

        {isBuilderMode ? (
          <Button
            onClick={() => onSelectForBuild?.(product)}
            disabled={isOutOfStock}
            variant="accent"
            size="sm"
            className="w-full gap-1.5 text-xs font-black shadow-xs py-2 bg-[#0063FD] text-white hover:bg-[#0052D4]"
          >
            <Check className="h-3.5 w-3.5" />
            {t("builder.chooseComponent")}
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              onClick={handleCartClick}
              disabled={isOutOfStock}
              variant="outline"
              size="sm"
              className={`w-full gap-1 text-[11px] font-bold py-1.5 border-[#CBD5E1] transition-all ${
                isAdded ? "border-[#16A34A] text-[#16A34A] bg-[#DCFCE7]" : "hover:border-[#0063FD] hover:text-[#0063FD]"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="h-3 w-3 text-[#16A34A]" />
                  Đã thêm
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3 w-3" />
                  Thêm giỏ
                </>
              )}
            </Button>
            <Link href={`/san-pham/${product.slug}`} className="w-full">
              <Button
                variant="primary"
                size="sm"
                className="w-full text-[11px] font-black py-1.5"
              >
                <Zap className="h-3 w-3 fill-current" />
                Mua ngay
              </Button>
            </Link>
          </div>
        )}

        {/* Warranty hint */}
        <div className="mt-2 flex items-center justify-between text-[10px] text-[#64748B]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-[#16A34A]" />
            Bảo hành {product.warranty_months} tháng
          </span>
          <span className="text-[#0F172A] font-semibold">Giao 2h HN/HCM</span>
        </div>
      </div>
    </div>
  );
}
