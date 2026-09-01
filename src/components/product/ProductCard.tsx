"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/shared/types";
import { i18nService } from "@/modules/i18n/service";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ShoppingCart, Check, Shield } from "lucide-react";

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

  const formattedPrice = i18nService.formatPrice(
    product.price_vnd,
    locale,
    product.price_usd
  );

  const formattedOriginalPrice = product.original_price_vnd
    ? i18nService.formatPrice(product.original_price_vnd, locale)
    : null;

  const productName = i18nService.getLocalizedProductName(product, locale);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-[#2A3040] bg-[#131722] p-4 transition-all duration-200 hover:border-[#3B82F6] hover:shadow-lg">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="default" className="text-[11px] font-bold uppercase tracking-wider text-[#3B82F6]">
            {product.brand}
          </Badge>
          {isOutOfStock ? (
            <Badge variant="danger">{t("common.outOfStock")}</Badge>
          ) : (
            <Badge variant="success">{t("common.inStock")}</Badge>
          )}
        </div>

        {/* Product Image */}
        <Link
          href={`/san-pham/${product.slug}`}
          className="relative block h-44 w-full overflow-hidden rounded-lg bg-[#0B0E14] mb-3"
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
            <div className="flex h-full w-full items-center justify-center text-xs text-[#9AA3B2]">
              No Image
            </div>
          )}
        </Link>

        {/* Product Title */}
        <Link
          href={`/san-pham/${product.slug}`}
          className="block text-sm font-semibold text-[#F2F4F8] line-clamp-2 hover:text-[#3B82F6] transition-colors mb-2"
        >
          {productName}
        </Link>

        {/* Key Specs Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.specs.socket && (
            <span className="rounded bg-[#1B2030] px-2 py-0.5 text-[10px] font-mono text-[#9AA3B2] border border-[#2A3040]">
              {product.specs.socket}
            </span>
          )}
          {product.specs.ram_type && (
            <span className="rounded bg-[#1B2030] px-2 py-0.5 text-[10px] font-mono text-[#9AA3B2] border border-[#2A3040]">
              {product.specs.ram_type}
            </span>
          )}
          {product.specs.tdp_watts && (
            <span className="rounded bg-[#1B2030] px-2 py-0.5 text-[10px] font-mono text-[#9AA3B2] border border-[#2A3040]">
              {product.specs.tdp_watts}W TDP
            </span>
          )}
          {product.specs.vram_gb && (
            <span className="rounded bg-[#1B2030] px-2 py-0.5 text-[10px] font-mono text-[#9AA3B2] border border-[#2A3040]">
              {product.specs.vram_gb}GB VRAM
            </span>
          )}
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="mt-2 pt-3 border-t border-[#2A3040]/60">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold font-mono text-[#FACC15]">
            {formattedPrice}
          </span>
          {formattedOriginalPrice && (
            <span className="text-xs font-mono text-[#9AA3B2] line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        {isBuilderMode ? (
          <Button
            onClick={() => onSelectForBuild?.(product)}
            disabled={isOutOfStock}
            variant="accent"
            size="sm"
            className="w-full gap-1.5 font-semibold"
          >
            <Check className="h-4 w-4" />
            {t("builder.chooseComponent")}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onAddToCart?.(product)}
              disabled={isOutOfStock}
              variant="primary"
              size="sm"
              className="flex-1 gap-1.5 font-semibold"
            >
              <ShoppingCart className="h-4 w-4" />
              {t("common.addToCart")}
            </Button>
            <Link href={`/san-pham/${product.slug}`}>
              <Button variant="secondary" size="sm" className="px-2.5">
                {t("common.viewDetails")}
              </Button>
            </Link>
          </div>
        )}

        {/* Warranty hint */}
        {product.warranty_months && (
          <div className="mt-2 flex items-center gap-1 text-[11px] text-[#9AA3B2]">
            <Shield className="h-3 w-3 text-[#3B82F6]" />
            <span>
              {t("common.warranty")}: {product.warranty_months} {t("common.months")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
