"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { i18nService } from "@/modules/i18n/service";
import { orderService } from "@/modules/orders/service";
import { paymentService } from "@/modules/payments/service";
import { MOCK_PRODUCTS } from "@/modules/catalog/mockData";
import { CartItem } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, CreditCard, Banknote, Smartphone } from "lucide-react";

export default function CheckoutPage() {
  const t = useTranslations();
  const locale = useLocale() as "vi" | "en";

  const [form, setForm] = useState({
    name: "Dương Quốc Đông",
    phone: "0988889999",
    email: "dongduong@example.com",
    address: "Số 18, Đường Cầu Giấy",
    city: "Hà Nội",
    district: "Cầu Giấy",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"vnpay" | "momo" | "cod" | "bank_transfer">("vnpay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);

  const sampleItems: CartItem[] = [
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
  ];

  const subtotalVnd = sampleItems.reduce((acc, i) => acc + i.total_price_vnd, 0);
  const shippingFeeVnd = subtotalVnd >= 5000000 ? 0 : 50000;
  const totalVnd = subtotalVnd + shippingFeeVnd;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const order = await orderService.createOrder({
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        shippingAddress: form.address,
        shippingCity: form.city,
        shippingDistrict: form.district,
        paymentMethod,
        items: sampleItems,
        notes: form.notes,
      });

      setCreatedOrderCode(order.order_code);
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdOrderCode) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F2F4F8]">
          {t("checkout.orderSuccessTitle")}
        </h1>
        <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-3 font-mono text-sm">
          <div className="text-[#9AA3B2]">{t("checkout.orderCode")}</div>
          <div className="text-xl font-bold text-[#FACC15]">{createdOrderCode}</div>
          <div className="text-xs text-[#9AA3B2] pt-2 border-t border-[#2A3040]">
            Tổng thanh toán: <strong>{i18nService.formatPrice(totalVnd, locale)}</strong> (Phương thức: {paymentMethod.toUpperCase()})
          </div>
        </div>
        <p className="text-xs text-[#9AA3B2] max-w-md mx-auto">
          {t("checkout.thankYou")}
        </p>
        <Link href="/">
          <Button variant="primary" size="md">
            Quay lại trang chủ
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F2F4F8]">
          {t("checkout.title")}
        </h1>
        <p className="mt-1 text-xs text-[#9AA3B2]">
          Vui lòng điền thông tin người nhận và lựa chọn cổng thanh toán
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Shipping & Payment Method Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Details */}
          <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F2F4F8] border-b border-[#2A3040] pb-3">
              {t("checkout.shippingInfo")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#9AA3B2] mb-1">
                  {t("checkout.fullName")} *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9AA3B2] mb-1">
                  {t("checkout.phone")} *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9AA3B2] mb-1">
                {t("checkout.email")} *
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#9AA3B2] mb-1">
                  {t("checkout.city")} *
                </label>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9AA3B2] mb-1">
                  {t("checkout.district")}
                </label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9AA3B2] mb-1">
                {t("checkout.address")} *
              </label>
              <input
                required
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9AA3B2] mb-1">
                {t("checkout.notes")}
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Methods Selection */}
          <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F2F4F8] border-b border-[#2A3040] pb-3">
              {t("checkout.paymentMethod")}
            </h3>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
                  paymentMethod === "vnpay"
                    ? "border-[#3B82F6] bg-[#3B82F6]/10"
                    : "border-[#2A3040] bg-[#0B0E14] hover:border-[#3B82F6]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "vnpay"}
                    onChange={() => setPaymentMethod("vnpay")}
                    className="text-[#3B82F6]"
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[#3B82F6]" />
                    <span className="text-xs font-semibold text-[#F2F4F8]">
                      {t("checkout.vnpay")}
                    </span>
                  </div>
                </div>
                <span className="rounded bg-[#1B2030] px-2 py-0.5 text-[10px] font-bold text-[#F2F4F8] border border-[#2A3040]">
                  VNPAY-QR
                </span>
              </label>

              <label
                className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
                  paymentMethod === "momo"
                    ? "border-[#EC4899] bg-[#EC4899]/10"
                    : "border-[#2A3040] bg-[#0B0E14] hover:border-[#EC4899]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "momo"}
                    onChange={() => setPaymentMethod("momo")}
                    className="text-[#EC4899]"
                  />
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-[#EC4899]" />
                    <span className="text-xs font-semibold text-[#F2F4F8]">
                      {t("checkout.momo")}
                    </span>
                  </div>
                </div>
                <span className="rounded bg-[#1B2030] px-2 py-0.5 text-[10px] font-bold text-[#EC4899] border border-[#2A3040]">
                  MoMo Wallet
                </span>
              </label>

              <label
                className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-[#22C55E] bg-[#22C55E]/10"
                    : "border-[#2A3040] bg-[#0B0E14] hover:border-[#22C55E]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="text-[#22C55E]"
                  />
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-[#22C55E]" />
                    <span className="text-xs font-semibold text-[#F2F4F8]">
                      {t("checkout.cod")}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-[#9AA3B2]">Kiểm tra trước khi trả</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F2F4F8] border-b border-[#2A3040] pb-3">
              Tóm Tắt Đơn Hàng ({sampleItems.length} linh kiện)
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {sampleItems.map((item) => (
                <div key={item.product_id} className="flex justify-between items-center text-xs">
                  <div className="truncate max-w-[200px] text-[#F2F4F8]">
                    {item.quantity}x {item.product.name_vi}
                  </div>
                  <div className="font-mono font-bold text-[#FACC15]">
                    {i18nService.formatPrice(item.total_price_vnd, locale)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#2A3040] pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-[#9AA3B2]">
                <span>Tạm tính</span>
                <span className="font-mono font-bold text-[#F2F4F8]">
                  {i18nService.formatPrice(subtotalVnd, locale)}
                </span>
              </div>
              <div className="flex justify-between text-[#9AA3B2]">
                <span>Phí giao hàng</span>
                <span className="font-mono font-bold text-[#22C55E]">
                  {shippingFeeVnd === 0 ? "MIỄN PHÍ" : i18nService.formatPrice(shippingFeeVnd, locale)}
                </span>
              </div>
            </div>

            <div className="border-t border-[#2A3040] pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#F2F4F8]">Tổng thanh toán</span>
                <span className="text-2xl font-black font-mono text-[#FACC15]">
                  {i18nService.formatPrice(totalVnd, locale)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-lg"
            >
              {isSubmitting ? "Đang xử lý..." : t("checkout.placeOrder")}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9AA3B2] pt-1">
              <ShieldCheck className="h-4 w-4 text-[#22C55E]" />
              <span>Giao dịch được bảo mật an toàn 100%</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
