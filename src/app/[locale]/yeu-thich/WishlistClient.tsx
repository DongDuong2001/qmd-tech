"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Product } from "@/shared/types";
import { i18nService } from "@/modules/i18n/service";
import { useCart } from "@/shared/context/CartContext";
import { useWishlist } from "@/shared/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { HugeIcon } from "@/components/ui/HugeIcon";
import {
  HeartIcon,
  ShoppingCart01Icon,
  ArrowRight01Icon,
  TrashIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

interface WishlistClientProps {
  allProducts: Product[];
}

export function WishlistClient({ allProducts }: WishlistClientProps) {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-12 text-center space-y-4 shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-[#DC2626] animate-pulse">
          <HugeIcon icon={HeartIcon} className="h-6 w-6" />
        </div>
        <p className="text-xs text-[#64748B]">Đang tải danh sách yêu thích...</p>
      </div>
    );
  }

  // Match wishlist items with product data
  const wishlistProducts = wishlist.items
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.product_id);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (wishlistProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-12 text-center space-y-4 shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF2F2] text-[#DC2626]">
          <HugeIcon icon={HeartIcon} className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-[#0F172A]">Danh sách yêu thích trống</h3>
        <p className="text-sm text-[#64748B] max-w-md mx-auto">
          Bạn chưa lưu sản phẩm nào. Hãy khám phá và nhấn biểu tượng tim để thêm vào đây.
        </p>
        <Link href="/danh-muc">
          <Button variant="primary" size="md" className="font-bold text-xs gap-1.5 shadow-xs">
            <HugeIcon icon={Search01Icon} className="h-3.5 w-3.5" />
            Khám phá sản phẩm
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = async (product: Product) => {
    await addToCart(product, 1);
  };

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  const handleClearAll = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ danh sách yêu thích?")) {
      await clearWishlist();
    }
  };

  return (
    <div className="space-y-6">
      {/* Wishlist Header with Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <HugeIcon icon={HeartIcon} className="h-5 w-5 text-[#DC2626]" />
          <span className="text-sm font-bold text-[#0F172A]">
            {wishlistProducts.length} sản phẩm trong danh sách
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={wishlistProducts.length === 0}
            className="gap-1.5 text-[#DC2626] hover:bg-[#FEF2F2] hover:border-[#DC2626] border-[#FECACA]"
          >
            <HugeIcon icon={TrashIcon} className="h-3.5 w-3.5" />
            Xóa tất cả
          </Button>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistProducts.map(({ product, added_at }) => {
          const formattedPrice = i18nService.formatPrice(
            product.price_vnd,
            "vi",
            product.price_usd
          );
          const hasDiscount = Boolean(
            product.original_price_vnd && product.original_price_vnd > product.price_vnd
          );
          const formattedOriginalPrice = hasDiscount
            ? i18nService.formatPrice(product.original_price_vnd!, "vi")
            : null;
          const discountPercent = hasDiscount
            ? Math.round(
                ((product.original_price_vnd! - product.price_vnd) / product.original_price_vnd!) * 100
              )
            : null;
          const productName = i18nService.getLocalizedProductName(product, "vi");
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={product.id}
              className="group relative flex flex-col h-full bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-3.5 transition-all duration-200 hover:-translate-y-1 hover:border-[#0063FD] hover:shadow-md shadow-xs"
            >
              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(product.id);
                }}
                className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 text-[#DC2626] hover:bg-[#FEF2F2] transition-colors shadow-xs"
                aria-label="Xóa khỏi yêu thích"
              >
                <HugeIcon icon={TrashIcon} className="h-4 w-4" />
              </button>

              {/* Added Date Badge */}
              <div className="absolute top-2 left-2 z-10 rounded bg-white/90 px-2 py-0.5 text-[9px] font-mono font-bold text-[#64748B] shadow-xs">
                {new Date(added_at).toLocaleDateString("vi-VN")}
              </div>

              {/* Product Image */}
              <Link
                href={`/san-pham/${product.slug}`}
                className="relative block h-40 w-full overflow-hidden rounded-lg bg-[#F8FAFC] border mb-2.5 transition-colors"
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
              </Link>

              {/* Product Info */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#0063FD]">
                    {product.brand}
                  </span>
                  {discountPercent != null && discountPercent > 0 && (
                    <span className="rounded bg-[#DC2626] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                <Link
                  href={`/san-pham/${product.slug}`}
                  className="block text-xs font-bold text-[#0F172A] line-clamp-2 transition-colors mb-2 leading-snug hover:text-[#0063FD]"
                >
                  {productName}
                </Link>

                {/* Key Specs */}
                <div className="flex flex-wrap gap-1 mb-2.5">
                  {product.specs?.socket && (
                    <span className="rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#1D4ED8] border border-[#BFDBFE]">
                      {String(product.specs.socket)}
                    </span>
                  )}
                  {product.specs?.ram_type && (
                    <span className="rounded bg-[#ECFDF5] px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#047857] border border-[#A7F3D0]">
                      {String(product.specs.ram_type)}
                    </span>
                  )}
                  {product.specs?.tdp_watts && (
                    <span className="rounded bg-[#FFFBEB] px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#B45309] border border-[#FDE68A]">
                      {String(product.specs.tdp_watts)}W
                    </span>
                  )}
                  {product.specs?.vram_gb && (
                    <span className="rounded bg-[#FAF5FF] px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#7E22CE] border border-[#E9D5FF]">
                      {String(product.specs.vram_gb)}GB VRAM
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <div className="text-base font-black font-mono text-[#0063FD] leading-tight">
                      {formattedPrice}
                    </div>
                    {formattedOriginalPrice && (
                      <div className="text-[10px] font-mono text-[#64748B] line-through">
                        {formattedOriginalPrice}
                      </div>
                    )}
                  </div>
                  <span className="rounded bg-[#DCFCE7] px-1.5 py-0.5 text-[8px] font-bold text-[#15803D] border border-[#86EFAC]">
                    Trả góp 0%
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-1.5 mt-auto">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                    variant="outline"
                    size="sm"
                    className="w-full gap-1 text-[11px] font-bold py-1.5 border-[#CBD5E1] transition-all hover:border-[#0063FD] hover:text-[#0063FD] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HugeIcon icon={ShoppingCart01Icon} className="h-3.5 w-3.5" />
                    Thêm giỏ
                  </Button>
                  <Link
                    href={`/san-pham/${product.slug}`}
                    className="w-full"
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full text-[11px] font-black py-1.5 gap-1 shadow-xs"
                    >
                      <HugeIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5" />
                      Mua ngay
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-6 sm:p-8 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#1E3A8A]">
          <HugeIcon icon={HeartIcon} className="h-5 w-5 text-[#DC2626]" />
          <span>Đã sẵn sàng mua sắm?</span>
        </div>
        <p className="text-xs text-[#3B82F6] max-w-md mx-auto">
          Thêm sản phẩm vào giỏ hàng để thanh toán nhanh chóng hoặc tiếp tục khám phá thêm linh kiện khác.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/gio-hang">
            <Button variant="primary" size="md" className="font-bold text-xs gap-1.5 shadow-xs">
              <HugeIcon icon={ShoppingCart01Icon} className="h-3.5 w-3.5" />
              Xem giỏ hàng
            </Button>
          </Link>
          <Link href="/danh-muc">
            <Button variant="outline" size="md" className="font-bold text-xs gap-1.5">
              <HugeIcon icon={Search01Icon} className="h-3.5 w-3.5" />
              Tiếp tục xem
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
