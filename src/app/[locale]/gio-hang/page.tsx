"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { cartService } from "@/modules/cart/service";
import { catalogService } from "@/modules/catalog/service";
import { i18nService } from "@/modules/i18n/service";
import { CartItem } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from "lucide-react";

export default function CartPage() {
  const t = useTranslations();
  const locale = useLocale() as "vi" | "en";

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  useEffect(() => {
    async function initCart() {
      setLoading(true);
      try {
        const { products } = await catalogService.getProducts({ limit: 2 });
        if (products.length > 0) {
          setItems([
            {
              product_id: products[0].id,
              product: products[0],
              quantity: 1,
              unit_price_vnd: products[0].price_vnd,
              total_price_vnd: products[0].price_vnd,
            },
          ]);
        }
      } catch (err) {
        console.warn("Failed to initialize cart:", err);
      } finally {
        setLoading(false);
      }
    }
    initCart();
  }, []);

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

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xs text-[#64748B]">
        Đang tải thông tin giỏ hàng từ cơ sở dữ liệu...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
          {t("cart.title")}
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Kiểm tra sản phẩm và tiến hành đặt hàng
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-12 text-center space-y-4 shadow-xs">
          <ShoppingBag className="mx-auto h-12 w-12 text-[#94A3B8]" />
          <h3 className="text-lg font-bold text-[#0F172A]">{t("cart.empty")}</h3>
          <p className="text-xs text-[#64748B]">
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
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-xs"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name_vi}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase text-[#1D4ED8]">
                      {item.product.brand}
                    </span>
                    <h4 className="truncate text-sm font-semibold text-[#0F172A]">
                      {i18nService.getLocalizedProductName(item.product, locale)}
                    </h4>
                    <div className="font-mono text-xs text-[#B45309] font-bold mt-1">
                      {i18nService.formatPrice(item.unit_price_vnd, locale)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 border-[#E2E8F0] pt-3 sm:pt-0">
                  <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                    <button
                      onClick={() => handleUpdateQuantity(item.product_id, -1)}
                      className="p-1.5 text-[#64748B] hover:text-[#0F172A]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono text-xs font-bold text-[#0F172A]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product_id, 1)}
                      className="p-1.5 text-[#64748B] hover:text-[#0F172A]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="font-mono text-sm font-bold text-[#B45309] w-28 text-right">
                    {i18nService.formatPrice(item.total_price_vnd, locale)}
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="rounded p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Free Shipping Alert */}
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex items-center gap-3 text-xs shadow-xs">
              <Truck className="h-5 w-5 text-[#16A34A] shrink-0" />
              {calculation.isEligibleForFreeShipping ? (
                <span className="text-[#15803D] font-medium">
                  Đơn hàng của bạn đã đủ điều kiện nhận <strong>Miễn Phí Giao Hàng Toàn Quốc</strong>!
                </span>
              ) : (
                <span className="text-[#64748B]">
                  Mua thêm{" "}
                  <strong className="text-[#B45309] font-mono">
                    {i18nService.formatPrice(calculation.remainingForFreeShippingVnd, locale)}
                  </strong>{" "}
                  để nhận Miễn Phí Giao Hàng.
                </span>
              )}
            </div>
          </div>

          {/* Cart Summary (Right) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] border-b border-[#E2E8F0] pb-3">
                Tổng Kết Đơn Hàng
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-[#64748B]">
                  <span>{t("cart.subtotal")}</span>
                  <span className="font-mono font-bold text-[#0F172A]">
                    {i18nService.formatPrice(calculation.cart.subtotal_vnd, locale)}
                  </span>
                </div>

                <div className="flex justify-between text-[#64748B]">
                  <span>{t("cart.shipping")}</span>
                  <span className="font-mono font-bold text-[#16A34A]">
                    {calculation.cart.shipping_fee_vnd === 0
                      ? t("cart.freeShipping")
                      : i18nService.formatPrice(calculation.cart.shipping_fee_vnd, locale)}
                  </span>
                </div>

                {calculation.cart.discount_vnd > 0 && (
                  <div className="flex justify-between text-[#16A34A]">
                    <span>{t("cart.discount")}</span>
                    <span className="font-mono font-bold">
                      -{i18nService.formatPrice(calculation.cart.discount_vnd, locale)}
                    </span>
                  </div>
                )}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-[#E2E8F0]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t("cart.couponPlaceholder")}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="text-xs">
                    {t("cart.applyCoupon")}
                  </Button>
                </div>
              </form>

              {/* Grand Total */}
              <div className="border-t border-[#E2E8F0] pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#0F172A]">
                    {t("cart.total")}
                  </span>
                  <span className="text-2xl font-black font-mono text-[#B45309]">
                    {i18nService.formatPrice(calculation.cart.total_vnd, locale)}
                  </span>
                </div>
              </div>

              <Link href="/thanh-toan" className="block pt-2">
                <Button variant="primary" size="lg" className="w-full font-bold gap-2 shadow-xs">
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
