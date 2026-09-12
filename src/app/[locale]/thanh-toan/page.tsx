"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { i18nService } from "@/modules/i18n/service";
import { orderService } from "@/modules/orders/service";
import { useCart } from "@/shared/context/CartContext";
import { Button } from "@/components/ui/button";
import { SePayVietQRModal } from "@/components/checkout/SePayVietQRModal";
import { Province34, WardItem } from "@/modules/location/service";
import { createHugeIconComponent } from "@/components/ui/HugeIcon";
import {
  CheckmarkCircle02Icon,
  ShieldCheckIcon,
  BanknoteIcon,
  QrCode01Icon,
  ChevronDownIcon,
  MapPinIcon,
  TruckIcon,
} from "@hugeicons/core-free-icons";

const CheckCircle2 = createHugeIconComponent(CheckmarkCircle02Icon);
const ShieldCheck = createHugeIconComponent(ShieldCheckIcon);
const Banknote = createHugeIconComponent(BanknoteIcon);
const QrCode = createHugeIconComponent(QrCode01Icon);
const ChevronDown = createHugeIconComponent(ChevronDownIcon);
const MapPin = createHugeIconComponent(MapPinIcon);
const Truck = createHugeIconComponent(TruckIcon);

export default function CheckoutPage() {
  const t = useTranslations();
  const locale = useLocale() as "vi" | "en";
  const { items, loading, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "Dương Quốc Đông",
    phone: "0988889999",
    email: "dongduong@example.com",
    address: "Số 18, Đường Cầu Giấy",
    city: "Thành phố Hà Nội",
    district: "Phường Dịch Vọng Hậu",
    notes: "",
  });

  const [provinces, setProvinces] = useState<Province34[]>([]);
  const [wards, setWards] = useState<WardItem[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(1);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);

  const loadWardsForProvince = async (provinceCode: number) => {
    setLoadingWards(true);
    try {
      const res = await fetch(`/api/location/wards?province_code=${provinceCode}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.wards) && data.wards.length > 0) {
        setWards(data.wards);
        // Default select first ward or keep match
        setForm((prev) => {
          const matched = data.wards.find(
            (w: WardItem) =>
              w.name.toLowerCase().includes(prev.district.toLowerCase()) ||
              prev.district.toLowerCase().includes(w.name.toLowerCase())
          );
          return {
            ...prev,
            district: matched ? matched.name : data.wards[0].name,
          };
        });
      } else {
        setWards([]);
      }
    } catch (err) {
      console.warn("Error loading wards:", err);
      setWards([]);
    } finally {
      setLoadingWards(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function initLocations() {
      try {
        const res = await fetch("/api/location/provinces");
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.provinces)) {
          setProvinces(data.provinces);
          const initial = data.provinces.find((p: Province34) => p.code === 1) || data.provinces[0];
          if (initial) {
            setSelectedProvinceCode(initial.code);
            setForm((prev) => ({ ...prev, city: initial.name }));
            loadWardsForProvince(initial.code);
          }
        }
      } catch (err) {
        console.warn("Error loading provinces:", err);
      } finally {
        if (isMounted) setLoadingProvinces(false);
      }
    }

    initLocations();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleProvinceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = Number(e.target.value);
    setSelectedProvinceCode(code);
    const selected = provinces.find((p) => p.code === code);
    if (selected) {
      setForm((prev) => ({ ...prev, city: selected.name, district: "" }));
      loadWardsForProvince(code);
    }
  };

  const handleWardSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, district: e.target.value }));
  };

  const [paymentMethod, setPaymentMethod] = useState<"sepay" | "cod">("sepay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);

  const subtotalVnd = items.reduce((acc, i) => acc + i.total_price_vnd, 0);
  const shippingFeeVnd = subtotalVnd >= 5000000 || subtotalVnd === 0 ? 0 : 50000;
  const totalVnd = subtotalVnd + shippingFeeVnd;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || loading) return;
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

      // Clear the cart upon successful checkout
      await clearCart();

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
                  Tỉnh / Thành phố (34 Tỉnh Thành) *
                </label>
                <div className="relative">
                  <select
                    required
                    value={selectedProvinceCode ?? ""}
                    onChange={handleProvinceSelect}
                    className="w-full appearance-none rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2.5 pr-8 text-sm text-[#0F172A] font-medium focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
                  >
                    {loadingProvinces ? (
                      <option value="">Đang tải 34 tỉnh thành...</option>
                    ) : (
                      provinces.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#64748B] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1 flex items-center justify-between">
                  <span>Phường / Xã *</span>
                  <span className="text-[10px] text-[#0063FD] font-normal">Mô hình 2 cấp</span>
                </label>
                <div className="relative">
                  {wards.length > 0 ? (
                    <>
                      <select
                        required
                        value={form.district}
                        onChange={handleWardSelect}
                        disabled={loadingWards}
                        className="w-full appearance-none rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2.5 pr-8 text-sm text-[#0F172A] font-medium focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs disabled:opacity-60"
                      >
                        {loadingWards ? (
                          <option value="">Đang tải phường/xã...</option>
                        ) : (
                          wards.map((w) => (
                            <option key={w.code} value={w.name}>
                              {w.name}
                            </option>
                          ))
                        )}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[#64748B] pointer-events-none" />
                    </>
                  ) : (
                    <input
                      required
                      type="text"
                      placeholder="Nhập tên Phường / Xã"
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                    />
                  )}
                </div>
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

            {/* Dynamic Delivery Time Policy Notice */}
            <div
              className={`rounded-xl border p-3.5 text-xs flex items-start gap-3 transition-colors ${
                selectedProvinceCode === 1 ||
                form.city.toLowerCase().includes("hà nội") ||
                form.city.toLowerCase().includes("ha noi")
                  ? "border-[#86EFAC] bg-[#F0FDF4] text-[#166534]"
                  : "border-[#BFDBFE] bg-[#EFF6FF] text-[#1E40AF]"
              }`}
            >
              <Truck className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold uppercase text-[11px] tracking-wider">
                  {selectedProvinceCode === 1 ||
                  form.city.toLowerCase().includes("hà nội") ||
                  form.city.toLowerCase().includes("ha noi")
                    ? "Giao Hỏa Tốc Hà Nội (Nhanh Nhất Có Thể)"
                    : "Giao Hàng Toàn Quốc (Từ 1 - 3 Ngày Làm Việc)"}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {selectedProvinceCode === 1 ||
                  form.city.toLowerCase().includes("hà nội") ||
                  form.city.toLowerCase().includes("ha noi")
                    ? "Đơn hàng nội thành Hà Nội được điều phối xuất kho và bàn giao shipper giao ngay nhanh nhất có thể."
                    : "Đơn hàng tại các tỉnh thành khác được đóng gói chống sốc 3 lớp, bảo hiểm 100% và giao tận nơi trong vòng 1 - 3 ngày."}
                </p>
              </div>
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
                      Quét mã QR tự động điền số tiền và nội dung qua MBBank, Vietcombank, Techcombank, ACB... Khớp lệnh tự động 24/7 trong 30 giây.
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
