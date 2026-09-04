"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { cartService } from "@/modules/cart/service";
import { i18nService } from "@/modules/i18n/service";
import { CartItem } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, CheckCircle2, Tag } from "lucide-react";

export default function CartPage() {
  const t = useTranslations();
  const locale = useLocale() as "vi" | "en";

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  // Load Cart from Secure HttpOnly Cookie
  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setItems(data.items || []);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch cart from cookie:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculation = cartService.calculateCart(items, appliedCoupon);

  const handleUpdateQuantity = async (productId: string, delta: number) => {
    const current = items.find((i) => i.product_id === productId);
    if (!current) return;
    const newQty = current.quantity + delta;

    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: newQty }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setItems(data.items || []);
        }
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const res = await fetch(`/api/cart?product_id=${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setItems(data.items || []);
        }
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedCoupon(couponCode);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xs text-[#64748B]">
        Đang tải thông tin giỏ hàng an toàn từ hệ thống...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-[#0F172A]">
            GIỎ HÀNG CỦA BẠN
          </h1>
          <p className="mt-0.5 text-xs text-[#64748B]">
            {items.length > 0 ? `Bạn đang có ${items.length} sản phẩm trong giỏ` : "Giỏ hàng hiện đang trống"}
          </p>
        </div>
        <Link href="/danh-muc" className="text-xs font-bold text-[#0063FD] hover:underline self-start sm:self-auto">
          ← Tiếp tục mua sắm linh kiện
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-12 text-center space-y-4 shadow-xs">
          <ShoppingBag className="mx-auto h-12 w-12 text-[#94A3B8]" />
          <h3 className="text-base font-bold text-[#0F172A]">{t("cart.empty")}</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Hãy khám phá hàng ngàn linh kiện máy tính và PC ráp sẵn chính hãng tại QMD-Tech.
          </p>
          <Link href="/danh-muc">
            <Button variant="primary" size="sm" className="font-bold text-xs">
              {t("cart.continueShopping")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cart Items Compact Table List */}
          <div className="lg:col-span-8 space-y-3">
            {/* Free Shipping Meter Banner */}
            <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-3 flex items-center gap-2.5 text-xs shadow-xs">
              <Truck className="h-4 w-4 text-[#0063FD] shrink-0" />
              {calculation.isEligibleForFreeShipping ? (
                <span className="text-[#0063FD] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                  Đơn hàng của bạn đã đủ điều kiện nhận <strong>Miễn Phí Giao Hàng Toàn Quốc</strong>!
                </span>
              ) : (
                <span className="text-[#0F172A]">
                  Mua thêm{" "}
                  <strong className="text-[#0063FD] font-mono font-bold">
                    {i18nService.formatPrice(calculation.remainingForFreeShippingVnd, locale)}
                  </strong>{" "}
                  để nhận <strong>Freeship Toàn Quốc</strong>.
                </span>
              )}
            </div>

            {/* List of Cart Items */}
            <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs divide-y divide-[#E2E8F0] overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 hover:bg-[#F8FAFC]/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
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
                    <div className="min-w-0 pr-2">
                      <span className="inline-block rounded bg-[#EFF6FF] px-1.5 py-0.2 text-[9px] font-black uppercase text-[#0063FD] mb-0.5">
                        {item.product.brand}
                      </span>
                      <h4 className="truncate text-xs sm:text-sm font-bold text-[#0F172A]">
                        {i18nService.getLocalizedProductName(item.product, locale)}
                      </h4>
                      <div className="font-mono text-xs text-[#0063FD] font-bold mt-0.5">
                        {i18nService.formatPrice(item.unit_price_vnd, locale)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls & Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                    <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] h-8">
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, -1)}
                        className="px-2 h-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50 transition-colors rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center font-mono text-xs font-bold text-[#0F172A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, 1)}
                        className="px-2 h-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50 transition-colors rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="font-mono text-xs sm:text-sm font-black text-[#0063FD] w-24 sm:w-28 text-right">
                      {i18nService.formatPrice(item.total_price_vnd, locale)}
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      className="rounded-lg p-1.5 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
                      title="Xóa sản phẩm"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary (Compact Sticky Box on Right) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 sm:p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">
                Tóm Tắt Đơn Hàng
              </h3>

              <div className="space-y-2 text-xs">
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
                      ? "Miễn phí"
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
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Mã giảm giá..."
                      className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] py-1.5 pl-7 pr-2 text-xs text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none uppercase font-mono"
                    />
                    <Tag className="absolute left-2 top-2 h-3.5 w-3.5 text-[#94A3B8]" />
                  </div>
                  <Button type="submit" variant="secondary" size="sm" className="text-xs font-bold px-3">
                    Áp dụng
                  </Button>
                </div>
              </form>

              {/* Grand Total */}
              <div className="border-t border-[#E2E8F0] pt-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-bold uppercase text-[#0F172A]">
                    Tổng thanh toán
                  </span>
                  <span className="text-xl font-black font-mono text-[#0063FD]">
                    {i18nService.formatPrice(calculation.cart.total_vnd, locale)}
                  </span>
                </div>
                <div className="text-[10px] text-[#64748B] text-right">
                  Đã bao gồm thuế VAT (10%)
                </div>
              </div>

              <Link href="/thanh-toan" className="block pt-1">
                <Button variant="primary" size="md" className="w-full font-black uppercase text-xs gap-1.5 shadow-xs py-2.5">
                  Tiến Hành Đặt Hàng
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
