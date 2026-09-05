"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { i18nService } from "@/modules/i18n/service";
import { orderService } from "@/modules/orders/service";
import { CartItem } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { SePayVietQRModal } from "@/components/checkout/SePayVietQRModal";
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  QrCode,
} from "lucide-react";

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

  const [paymentMethod, setPaymentMethod] = useState<"sepay" | "cod" | "vnpay" | "momo">("sepay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCartItems() {
      setLoading(true);
      try {
        const res = await fetch("/api/cart");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.items && data.items.length > 0) {
            setItems(data.items);
          }
        }
      } catch (err) {
        console.warn("Failed to load checkout items:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCartItems();
  }, []);

  const subtotalVnd = items.reduce((acc, i) => acc + i.total_price_vnd, 0);
  const shippingFeeVnd = subtotalVnd >= 5000000 || subtotalVnd === 0 ? 0 : 50000;
  const totalVnd = subtotalVnd + shippingFeeVnd;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Giỏ hàng của bạn đang trống.");
      return;
    }

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
        items,
        notes: form.notes,
      });

      // Clear the secure HttpOnly cart cookie upon successful checkout
      await fetch("/api/cart", { method: "DELETE" }).catch(() => {});

      setCreatedOrderCode(order.order_code);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert("Lỗi đặt hàng: " + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SePay VietQR Screen if SePay chosen
  if (createdOrderCode && paymentMethod === "sepay") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SePayVietQRModal
          orderCode={createdOrderCode}
          totalVnd={totalVnd}
          bankName={process.env.NEXT_PUBLIC_SEPAY_BANK_NAME || "MBBank"}
          accountNumber={process.env.NEXT_PUBLIC_SEPAY_ACCOUNT_NUMBER || "0988889999"}
          accountName={process.env.NEXT_PUBLIC_SEPAY_ACCOUNT_NAME || "QMD TECH CORPORATION"}
        />
      </div>
    );
  }

  // Standard COD / Other confirmation screen
  if (createdOrderCode) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
          {t("checkout.orderSuccessTitle")}
        </h1>
        <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 space-y-3 font-mono text-sm shadow-xs">
          <div className="text-[#64748B]">{t("checkout.orderCode")}</div>
          <div className="text-xl font-bold text-[#0063FD]">{createdOrderCode}</div>
          <div className="text-xs text-[#64748B] pt-2 border-t border-[#E2E8F0]">
            Tổng thanh toán: <strong className="text-[#0F172A]">{i18nService.formatPrice(totalVnd, locale)}</strong> (Phương thức: {paymentMethod.toUpperCase()})
          </div>
        </div>
        <p className="text-xs text-[#64748B] max-w-md mx-auto">
          {t("checkout.thankYou")}
        </p>
        <Link href="/">
          <Button variant="primary" size="md" className="shadow-xs">
            Quay lại trang chủ
          </Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xs text-[#64748B]">
        Đang tải thông tin đơn hàng...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
          {t("checkout.title")}
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Vui lòng điền thông tin người nhận và lựa chọn phương thức thanh toán
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Shipping & Payment Method Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Details */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              {t("checkout.shippingInfo")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  {t("checkout.fullName")} *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  {t("checkout.phone")} *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">
                {t("checkout.email")} *
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  {t("checkout.city")} *
                </label>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  {t("checkout.district")}
                </label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">
                {t("checkout.address")} *
              </label>
              <input
                required
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">
                {t("checkout.notes")}
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Methods Selection */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Phương Thức Thanh Toán
            </h3>

            <div className="space-y-3">
              {/* Option 1: SePay VietQR (Recommended) */}
              <label
                className={`flex items-start justify-between rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  paymentMethod === "sepay"
                    ? "border-[#0063FD] bg-[#EFF6FF]"
                    : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#0063FD]/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "sepay"}
                    onChange={() => setPaymentMethod("sepay")}
                    className="mt-1 text-[#0063FD]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-[#0063FD]" />
                      <span className="text-xs font-black text-[#0F172A]">
                        Chuyển Khoản Ngân Hàng Qua SePay VietQR
                      </span>
                      <span className="rounded bg-[#0063FD] px-1.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider">
                        KHUYÊN DÙNG
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Quét mã QR tự động điền số tiền và nội dung qua MBBank, Vietcombank, Techcombank, MoMo... Khớp lệnh tự động 24/7 trong 30 giây.
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded bg-[#FFFFFF] px-2 py-0.5 text-[10px] font-bold text-[#0063FD] border border-[#BFDBFE]">
                  VietQR 24/7
                </span>
              </label>

              {/* Option 2: COD */}
              <label
                className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-[#16A34A] bg-[#F0FDF4]"
                    : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#16A34A]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="text-[#16A34A]"
                  />
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-[#16A34A]" />
                    <span className="text-xs font-semibold text-[#0F172A]">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-[#64748B]">Kiểm tra trước khi trả</span>
              </label>

              {/* Option 3: VNPAY */}
              <label
                className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  paymentMethod === "vnpay"
                    ? "border-[#2563EB] bg-[#EFF6FF]"
                    : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "vnpay"}
                    onChange={() => setPaymentMethod("vnpay")}
                    className="text-[#2563EB]"
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[#2563EB]" />
                    <span className="text-xs font-semibold text-[#0F172A]">
                      Cổng VNPAY / Thẻ Quốc Tế (Visa / Master)
                    </span>
                  </div>
                </div>
                <span className="rounded bg-[#FFFFFF] px-2 py-0.5 text-[10px] font-bold text-[#0F172A] border border-[#E2E8F0]">
                  VNPAY-QR
                </span>
              </label>

              {/* Option 4: MoMo */}
              <label
                className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  paymentMethod === "momo"
                    ? "border-[#DB2777] bg-[#FDF2F8]"
                    : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#DB2777]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "momo"}
                    onChange={() => setPaymentMethod("momo")}
                    className="text-[#DB2777]"
                  />
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-[#DB2777]" />
                    <span className="text-xs font-semibold text-[#0F172A]">
                      Ví Điện Tử MoMo
                    </span>
                  </div>
                </div>
                <span className="rounded bg-[#FFFFFF] px-2 py-0.5 text-[10px] font-bold text-[#DB2777] border border-[#FBCFE8]">
                  MoMo Wallet
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Tóm Tắt Đơn Hàng ({items.length} sản phẩm)
            </h3>

            {items.length === 0 ? (
              <div className="text-xs text-[#64748B] py-4 text-center">
                Chưa có sản phẩm nào trong đơn hàng.
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between items-center text-xs">
                    <div className="truncate max-w-[200px] text-[#0F172A]">
                      {item.quantity}x {item.product.name_vi}
                    </div>
                    <div className="font-mono font-bold text-[#B45309]">
                      {i18nService.formatPrice(item.total_price_vnd, locale)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-[#E2E8F0] pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Tạm tính</span>
                <span className="font-mono font-bold text-[#0F172A]">
                  {i18nService.formatPrice(subtotalVnd, locale)}
                </span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Phí giao hàng</span>
                <span className="font-mono font-bold text-[#16A34A]">
                  {shippingFeeVnd === 0 ? "MIỄN PHÍ" : i18nService.formatPrice(shippingFeeVnd, locale)}
                </span>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#0F172A]">Tổng thanh toán</span>
                <span className="text-2xl font-black font-mono text-[#B45309]">
                  {i18nService.formatPrice(totalVnd, locale)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-xs py-3"
            >
              {isSubmitting ? "Đang xử lý đơn hàng..." : paymentMethod === "sepay" ? "Tiến Hành Quét Mã VietQR" : t("checkout.placeOrder")}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#64748B] pt-1">
              <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
              <span>Giao dịch và tài khoản được bảo mật an toàn 100%</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
