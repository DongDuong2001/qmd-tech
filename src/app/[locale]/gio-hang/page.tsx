"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { cartService } from "@/modules/cart/service";
import { i18nService } from "@/modules/i18n/service";
import { MOCK_PRODUCTS } from "@/modules/catalog/mockData";
import { CartItem } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from "lucide-react";

export default function CartPage() {
  const t = useTranslations();
  const locale = useLocale() as "vi" | "en";

  // Initial cart populated with sample items
  const [items, setItems] = useState<CartItem[]>([
    {
      product_id: MOCK_PRODUCTS[0].id,
      product: MOCK_PRODUCTS[0],
      quantity: 1,
      unit_price_vnd: MOCK_PRODUCTS[0].price_vnd,
      total_price_vnd: MOCK_PRODUCTS[0].price_vnd,
    },
    {
      product_id: MOCK_PRODUCTS[2].id,
      product: MOCK_PRODUCTS[2],
      quantity: 1,
      unit_price_vnd: MOCK_PRODUCTS[2].price_vnd,
      total_price_vnd: MOCK_PRODUCTS[2].price_vnd,
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const calculation = cartService.calculateCart(items, appliedCoupon);

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const current = items.find((i) => i.product_id === productId);
    if (!current) return;
    const newQty = current.quantity + delta;
    setItems(cartService.updateQuantity(items, productId, newQty));
  };

  const handleRemoveItem = (productId: string) => {
    setItems(cartService.removeItem(items, productId));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedCoupon(couponCode);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F2F4F8]">
          {t("cart.title")}
        </h1>
        <p className="mt-1 text-xs text-[#9AA3B2]">
          Kiểm tra sản phẩm và tiến hành đặt hàng
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[#2A3040] bg-[#131722] p-12 text-center space-y-4">
          <ShoppingBag className="mx-auto h-12 w-12 text-[#9AA3B2]" />
          <h3 className="text-lg font-bold text-[#F2F4F8]">{t("cart.empty")}</h3>
          <p className="text-xs text-[#9AA3B2]">
            Hãy khám phá hàng ngàn linh kiện máy tính chính hãng tại QMD-Tech.
          </p>
          <Link href="/danh-muc">
            <Button variant="primary" size="md">
              {t("cart.continueShopping")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#2A3040] bg-[#131722] p-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#0B0E14] border border-[#2A3040]">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name_vi}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase text-[#3B82F6]">
                      {item.product.brand}
                    </span>
                    <h4 className="truncate text-sm font-semibold text-[#F2F4F8]">
                      {i18nService.getLocalizedProductName(item.product, locale)}
                    </h4>
                    <div className="font-mono text-xs text-[#FACC15] font-bold mt-1">
                      {i18nService.formatPrice(item.unit_price_vnd, locale)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 border-[#2A3040]/50 pt-3 sm:pt-0">
                  <div className="flex items-center rounded-lg border border-[#2A3040] bg-[#0B0E14]">
                    <button
                      onClick={() => handleUpdateQuantity(item.product_id, -1)}
                      className="p-1.5 text-[#9AA3B2] hover:text-[#F2F4F8]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono text-xs font-bold text-[#F2F4F8]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product_id, 1)}
                      className="p-1.5 text-[#9AA3B2] hover:text-[#F2F4F8]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="font-mono text-sm font-bold text-[#FACC15] w-28 text-right">
                    {i18nService.formatPrice(item.total_price_vnd, locale)}
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="rounded p-1.5 text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Free Shipping Alert */}
            <div className="rounded-xl border border-[#2A3040] bg-[#0B0E14] p-4 flex items-center gap-3 text-xs">
              <Truck className="h-5 w-5 text-[#22C55E] shrink-0" />
              {calculation.isEligibleForFreeShipping ? (
                <span className="text-[#22C55E] font-medium">
                  Đơn hàng của bạn đã đủ điều kiện nhận <strong>Miễn Phí Giao Hàng Toàn Quốc</strong>!
                </span>
              ) : (
                <span className="text-[#9AA3B2]">
                  Mua thêm{" "}
                  <strong className="text-[#FACC15] font-mono">
                    {i18nService.formatPrice(calculation.remainingForFreeShippingVnd, locale)}
                  </strong>{" "}
                  để nhận Miễn Phí Giao Hàng.
                </span>
              )}
            </div>
          </div>

          {/* Cart Summary (Right) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F2F4F8] border-b border-[#2A3040] pb-3">
                Tổng Kết Đơn Hàng
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-[#9AA3B2]">
                  <span>{t("cart.subtotal")}</span>
                  <span className="font-mono font-bold text-[#F2F4F8]">
                    {i18nService.formatPrice(calculation.cart.subtotal_vnd, locale)}
                  </span>
                </div>

                <div className="flex justify-between text-[#9AA3B2]">
                  <span>{t("cart.shipping")}</span>
                  <span className="font-mono font-bold text-[#22C55E]">
                    {calculation.cart.shipping_fee_vnd === 0
                      ? t("cart.freeShipping")
                      : i18nService.formatPrice(calculation.cart.shipping_fee_vnd, locale)}
                  </span>
                </div>

                {calculation.cart.discount_vnd > 0 && (
                  <div className="flex justify-between text-[#22C55E]">
                    <span>{t("cart.discount")}</span>
                    <span className="font-mono font-bold">
                      -{i18nService.formatPrice(calculation.cart.discount_vnd, locale)}
                    </span>
                  </div>
                )}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-[#2A3040]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t("cart.couponPlaceholder")}
                    className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3 py-2 text-xs text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="text-xs">
                    {t("cart.applyCoupon")}
                  </Button>
                </div>
              </form>

              {/* Grand Total */}
              <div className="border-t border-[#2A3040] pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#F2F4F8]">
                    {t("cart.total")}
                  </span>
                  <span className="text-2xl font-black font-mono text-[#FACC15]">
                    {i18nService.formatPrice(calculation.cart.total_vnd, locale)}
                  </span>
                </div>
              </div>

              <Link href="/thanh-toan" className="block pt-2">
                <Button variant="primary" size="lg" className="w-full font-bold gap-2">
                  {t("cart.checkout")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
