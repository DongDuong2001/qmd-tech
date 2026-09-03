"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/shared/types";
import { i18nService } from "@/modules/i18n/service";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  ShoppingCart,
  Check,
  ShieldCheck,
  Gift,
  Zap,
  Cpu,
  Layers,
  HardDrive,
  Activity,
  ChevronRight,
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
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-3.5 shadow-xs transition-all duration-300 hover:border-[#E11D48] hover:shadow-md"
    >
      <div>
        {/* Top Badges: Brand & Stock/Discount Tag */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#1D4ED8]">
            {product.brand}
          </span>

          <div className="flex items-center gap-1">
            {discountPercent && discountPercent > 0 && (
              <Badge variant="discount" className="text-[10px]">
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
          className="relative block h-40 w-full overflow-hidden rounded-lg bg-[#F8FAFC] border border-[#F1F5F9] mb-2.5 group-hover:border-[#E11D48]/30 transition-colors"
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
          className="block text-xs sm:text-sm font-bold text-[#0F172A] line-clamp-2 hover:text-[#E11D48] transition-colors mb-2 leading-snug"
        >
          {productName}
        </Link>

        {/* Key Specs Tags */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          {product.specs.socket && (
            <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#334155] border border-[#E2E8F0]">
              {product.specs.socket}
            </span>
          )}
          {product.specs.ram_type && (
            <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#334155] border border-[#E2E8F0]">
              {product.specs.ram_type}
            </span>
          )}
          {product.specs.tdp_watts && (
            <span className="rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#B45309] border border-[#FDE68A]">
              {product.specs.tdp_watts}W
            </span>
          )}
          {product.specs.vram_gb && (
            <span className="rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#1D4ED8] border border-[#BFDBFE]">
              {product.specs.vram_gb}GB VRAM
            </span>
          )}
        </div>

        {/* Promotional Gift Tag (Factual Phrasing) */}
        <div className="rounded border border-[#FED7AA] bg-[#FFF7ED] p-1.5 mb-2.5 text-[10px] text-[#C2410C] flex items-center gap-1.5">
          <Gift className="h-3 w-3 shrink-0 text-[#EA580C]" />
          <span className="truncate font-semibold">Tặng gói vệ sinh máy + Lót chuột khi mua kèm</span>
        </div>
      </div>

      {/* Pricing & CTA Section */}
      <div className="pt-2 border-t border-[#E2E8F0]">
        {/* Slashed and Current Price */}
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <div className="text-base sm:text-lg font-black font-mono text-[#B45309] leading-tight">
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
            className="w-full gap-1.5 text-xs font-bold"
          >
            <Check className="h-3.5 w-3.5" />
            {t("builder.chooseComponent")}
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              onClick={() => onAddToCart?.(product)}
              disabled={isOutOfStock}
              variant="primary"
              size="sm"
              className="w-full gap-1 text-[11px] font-bold py-1.5"
            >
              <ShoppingCart className="h-3 w-3" />
              Thêm giỏ
            </Button>
            <Link href={`/san-pham/${product.slug}`} className="w-full">
              <Button
                variant="gold"
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

      {/* ========================================================================= */}
      {/* HOVER QUICK TECHNICAL SPECS POPOVER (Interactive Hardware Info) */}
      {/* ========================================================================= */}
      <div
        className={`absolute inset-x-0 bottom-full mb-2 z-30 transition-all duration-200 pointer-events-none ${
          isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-95"
        }`}
      >
        <div className="rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] p-3.5 shadow-xl text-xs space-y-2.5 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <div className="font-black text-[#0F172A] flex items-center gap-1.5 uppercase text-[11px]">
              <Activity className="h-3.5 w-3.5 text-[#E11D48]" />
              <span>Thông Số Kỹ Thuật</span>
            </div>
            <span className="font-mono text-[10px] text-[#64748B]">SKU: {product.sku}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
            {product.specs.socket && (
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-[#2563EB]" /> Socket:
                </span>
                <span className="font-mono font-bold text-[#0F172A]">{String(product.specs.socket)}</span>
              </div>
            )}
            {product.specs.ram_type && (
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] flex items-center gap-1">
                  <Layers className="h-3 w-3 text-[#16A34A]" /> Chuẩn RAM:
                </span>
                <span className="font-mono font-bold text-[#0F172A]">{String(product.specs.ram_type)}</span>
              </div>
            )}
            {product.specs.vram_gb && (
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">VRAM:</span>
                <span className="font-mono font-bold text-[#1D4ED8]">{String(product.specs.vram_gb)} GB</span>
              </div>
            )}
            {product.specs.tdp_watts && (
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Công suất TDP:</span>
                <span className="font-mono font-bold text-[#B45309]">{String(product.specs.tdp_watts)} W</span>
              </div>
            )}
            {product.specs.form_factor && (
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Kích thước:</span>
                <span className="font-mono font-bold text-[#0F172A]">{String(product.specs.form_factor)}</span>
              </div>
            )}
            {product.specs.capacity_gb && (
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] flex items-center gap-1">
                  <HardDrive className="h-3 w-3 text-[#EA580C]" /> Dung lượng:
                </span>
                <span className="font-mono font-bold text-[#0F172A]">{String(product.specs.capacity_gb)} GB</span>
              </div>
            )}
            <div className="flex items-center justify-between col-span-2 pt-1 border-t border-[#F1F5F9]">
              <span className="text-[#64748B]">Tình trạng kho:</span>
              <span className={`font-bold ${product.stock > 0 ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm sẵn sàng giao` : "Tạm hết hàng"}
              </span>
            </div>
          </div>

          <Link
            href={`/san-pham/${product.slug}`}
            className="flex items-center justify-center gap-1 w-full rounded-lg bg-[#F8FAFC] py-1.5 text-[11px] font-bold text-[#0F172A] hover:bg-[#E11D48] hover:text-white transition-colors border border-[#E2E8F0]"
          >
            <span>Xem thông số chi tiết đầy đủ</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
