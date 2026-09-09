"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/shared/types";
import { i18nService } from "@/modules/i18n/service";
import { useCart } from "@/shared/context/CartContext";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Check,
  ShieldCheck,
  Gift,
  Eye,
  Flame,
} from "lucide-react";
import {
  CartIcon,
  type CartIconHandle,
  FlameIcon,
  type FlameIconHandle,
  ArrowRightIcon,
  type ArrowRightIconHandle,
} from "@/components/icons";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onSelectForBuild?: (product: Product) => void;
  isBuilderMode?: boolean;
  hideStock?: boolean;
  isFlashSale?: boolean;
  flameEffect?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onSelectForBuild,
  isBuilderMode,
  hideStock = false,
  isFlashSale = false,
  flameEffect = false,
}: ProductCardProps) {
  const locale = useLocale() as "vi" | "en";
  const t = useTranslations();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const hasFlame = isFlashSale || flameEffect;

  const cartIconRef = useRef<CartIconHandle>(null);
  const flameIconRef = useRef<FlameIconHandle>(null);
  const arrowIconRef = useRef<ArrowRightIconHandle>(null);

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

  const hasDiscount = Boolean(
    product.original_price_vnd && product.original_price_vnd > product.price_vnd
  );

  const formattedOriginalPrice = hasDiscount
    ? i18nService.formatPrice(product.original_price_vnd!, locale)
    : null;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.original_price_vnd! - product.price_vnd) /
          product.original_price_vnd!) *
          100
      )
    : null;

  const productName = i18nService.getLocalizedProductName(product, locale);
  const isOutOfStock = product.stock <= 0;

  const cardContent = (
    <div
      className={`group relative flex flex-col justify-between h-full bg-[#FFFFFF] p-3.5 transition-all duration-300 ${
        hasFlame
          ? "rounded-[calc(0.875rem-2px)] shadow-none"
          : "rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#0063FD] hover:shadow-md"
      }`}
    >
      <div>
        {/* Top Badges: Brand & Stock/Discount Tag */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#0063FD]">
              {product.brand}
            </span>
            {hasFlame && (
              <span className="rounded bg-gradient-to-r from-[#DC2626] to-[#EA580C] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs flex items-center gap-1">
                <Flame className="h-2.5 w-2.5 fill-current text-white animate-pulse" />
                Giờ Vàng
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {discountPercent != null && discountPercent > 0 && (
              <Badge
                variant="discount"
                className={`text-[10px] ${
                  hasFlame ? "bg-[#DC2626] text-white font-black" : "bg-[#0063FD] text-white"
                }`}
              >
                -{discountPercent}%
              </Badge>
            )}
            {hideStock ? (
              <span className="rounded bg-[#FEF2F2] border border-[#FECACA] px-1.5 py-0.5 text-[9px] font-black text-[#DC2626] uppercase">
                Deal Giới Hạn
              </span>
            ) : isOutOfStock ? (
              <Badge variant="danger" className="text-[10px]">Hết hàng</Badge>
            ) : (
              <Badge variant="success" className="text-[10px]">Sẵn hàng</Badge>
            )}
          </div>
        </div>

        {/* Product Image */}
        <Link
          href={`/san-pham/${product.slug}`}
          className={`relative block h-40 w-full overflow-hidden rounded-lg bg-[#F8FAFC] border mb-2.5 transition-colors ${
            hasFlame
              ? "border-[#FEE2E2] group-hover:border-[#EF4444]/40"
              : "border-[#F1F5F9] group-hover:border-[#0063FD]/30"
          }`}
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
            <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[#64748B]">
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
          className={`block text-xs sm:text-sm font-bold text-[#0F172A] line-clamp-2 transition-colors mb-2 leading-snug ${
            hasFlame ? "hover:text-[#DC2626]" : "hover:text-[#0063FD]"
          }`}
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
        <div className={`rounded border p-1.5 mb-2.5 text-[10px] flex items-center gap-1.5 font-semibold ${
          hasFlame
            ? "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]"
            : "border-[#BFDBFE] bg-[#EFF6FF] text-[#0063FD]"
        }`}>
          <Gift className={`h-3 w-3 shrink-0 ${hasFlame ? "text-[#DC2626]" : "text-[#0063FD]"}`} />
          <span className="truncate">Tặng gói vệ sinh máy + Lót chuột khi mua kèm</span>
        </div>
      </div>

      {/* Pricing & CTA Section */}
      <div className="pt-2 border-t border-[#E2E8F0] relative z-10">
        {/* Slashed and Current Price */}
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <div className={`text-base sm:text-lg font-black font-mono leading-tight ${
              hasFlame ? "text-[#DC2626]" : "text-[#0063FD]"
            }`}>
              {formattedPrice}
            </div>
            {formattedOriginalPrice && (
              <div className="text-[11px] font-mono text-[#64748B] line-through">
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
              onMouseEnter={() => cartIconRef.current?.startAnimation()}
              onMouseLeave={() => cartIconRef.current?.stopAnimation()}
              className={`w-full gap-1 text-[11px] font-bold py-1.5 border-[#CBD5E1] transition-all ${
                isAdded
                  ? "border-[#16A34A] text-[#16A34A] bg-[#DCFCE7]"
                  : hasFlame
                  ? "hover:border-[#DC2626] hover:text-[#DC2626]"
                  : "hover:border-[#0063FD] hover:text-[#0063FD]"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="h-3 w-3 text-[#16A34A]" />
                  Đã thêm
                </>
              ) : (
                <>
                  <CartIcon ref={cartIconRef} size={13} className="inline-flex" />
                  Thêm giỏ
                </>
              )}
            </Button>
            <Link
              href={`/san-pham/${product.slug}`}
              className="w-full"
              onMouseEnter={() => {
                flameIconRef.current?.startAnimation();
                arrowIconRef.current?.startAnimation();
              }}
              onMouseLeave={() => {
                flameIconRef.current?.stopAnimation();
                arrowIconRef.current?.stopAnimation();
              }}
            >
              <Button
                variant="primary"
                size="sm"
                className={`w-full text-[11px] font-black py-1.5 gap-1 ${
                  hasFlame
                    ? "bg-gradient-to-r from-[#DC2626] to-[#EA580C] hover:from-[#B91C1C] hover:to-[#C2410C] text-white border-0 shadow-xs"
                    : ""
                }`}
              >
                {hasFlame ? (
                  <>
                    <FlameIcon ref={flameIconRef} size={13} className="inline-flex" />
                    Săn ngay
                  </>
                ) : (
                  <>
                    <ArrowRightIcon ref={arrowIconRef} size={13} className="inline-flex" />
                    Mua ngay
                  </>
                )}
              </Button>
            </Link>
          </div>
        )}

        {/* Integrated Deal Giới Hạn Bar for Flash Sale */}
        {hasFlame && (
          <div className="mt-2 rounded bg-[#FEF2F2] px-2 py-1 border border-[#FECACA] flex items-center justify-between text-[9px] font-bold text-[#DC2626]">
            <span className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-[#EF4444] shrink-0" />
              <span className="truncate">Số lượng có hạn</span>
            </span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[8.5px] font-black text-[#DC2626] border border-[#FCA5A5] shrink-0">
              Deal Giới Hạn
            </span>
          </div>
        )}

        {/* Warranty hint */}
        <div className="mt-2 flex items-center justify-between text-[10px] text-[#475569]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-[#16A34A]" />
            Bảo hành {product.warranty_months} tháng
          </span>
          <span className="text-[#0F172A] font-semibold">Hỏa tốc tại HN</span>
        </div>
      </div>
    </div>
  );

  if (hasFlame) {
    return <div className="flame-card-wrapper h-full flex flex-col">{cardContent}</div>;
  }

  return cardContent;
}
