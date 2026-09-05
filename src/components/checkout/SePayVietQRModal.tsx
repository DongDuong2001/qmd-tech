"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  QrCode,
  Copy,
  Check,
  RefreshCw,
  CheckCircle2,
  Building,
  CreditCard,
  User,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react";

interface SePayVietQRModalProps {
  orderCode: string;
  totalVnd: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  onPaymentSuccess?: () => void;
}

export function SePayVietQRModal({
  orderCode,
  totalVnd,
  bankName = "MBBank",
  accountNumber = "0988889999",
  accountName = "QMD TECH CORPORATION",
  onPaymentSuccess,
}: SePayVietQRModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Dynamic VietQR image URL from SePay QR service
  const qrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(
    accountNumber
  )}&bank=${encodeURIComponent(bankName)}&amount=${totalVnd}&des=${encodeURIComponent(
    orderCode
  )}&template=compact`;

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
    }
  };

  // Poll payment status every 3 seconds
  useEffect(() => {
    if (isPaid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/check-status?orderCode=${encodeURIComponent(orderCode)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.isPaid) {
            setIsPaid(true);
            if (onPaymentSuccess) onPaymentSuccess();
          }
        }
      } catch {
        // Ignore polling errors
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderCode, isPaid, onPaymentSuccess]);

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      const res = await fetch(`/api/payments/check-status?orderCode=${encodeURIComponent(orderCode)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.isPaid) {
          setIsPaid(true);
          if (onPaymentSuccess) onPaymentSuccess();
        } else {
          alert("Hệ thống chưa nhận được khoản chuyển. Nếu bạn vừa chuyển, vui lòng chờ 10-30 giây.");
        }
      }
    } catch {
      alert("Lỗi kiểm tra trạng thái thanh toán. Vui lòng thử lại.");
    } finally {
      setIsChecking(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (isPaid) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[#86EFAC] bg-[#F0FDF4] p-8 text-center space-y-5 shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A] border-2 border-[#16A34A]">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#0F172A]">Thanh Toán Thành Công!</h2>
          <p className="text-xs text-[#15803D]">
            Hệ thống SePay đã tự động ghi nhận chuyển khoản cho đơn hàng <strong>{orderCode}</strong>.
          </p>
        </div>

        <div className="rounded-xl bg-white border border-[#BBF7D0] p-4 text-xs font-mono space-y-2">
          <div className="flex justify-between text-[#64748B]">
            <span>Mã đơn hàng:</span>
            <strong className="text-[#0F172A]">{orderCode}</strong>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>Số tiền đã thanh toán:</span>
            <strong className="text-[#16A34A] font-bold">{formatPrice(totalVnd)}</strong>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>Cổng thanh toán:</span>
            <span className="font-bold text-[#0063FD]">SePay VietQR 24/7</span>
          </div>
        </div>

        <Link href="/">
          <button className="w-full rounded-xl bg-[#0063FD] py-3 text-xs font-bold text-white uppercase tracking-wider hover:bg-[#0052D4] transition-colors shadow-xs">
            Quay Lại Trang Chủ
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-lg space-y-6">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#0063FD] border border-[#BFDBFE]">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A] uppercase">
              Thanh Toán Tự Động Qua SePay VietQR
            </h2>
            <p className="text-xs text-[#64748B]">
              Mở app ngân hàng bất kỳ (MB, VCB, Techcombank, MoMo...) và quét mã bên dưới
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 text-[11px] font-bold text-[#0063FD]">
          <Clock className="h-3 w-3 animate-spin" />
          Chờ Thanh Toán
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Dynamic VietQR Image from SePay */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]">
          <div className="relative h-60 w-60 sm:h-64 sm:w-64 rounded-lg overflow-hidden border border-[#E2E8F0] bg-white shadow-xs">
            <Image
              src={qrUrl}
              alt="Mã QR Chuyển Khoản SePay"
              fill
              priority
              sizes="256px"
              className="object-contain"
            />
          </div>
          <div className="mt-3 text-center space-y-0.5">
            <span className="text-[11px] font-bold text-[#0F172A] block">
              Quét mã để tự động điền số tiền & nội dung
            </span>
            <span className="text-[10px] text-[#64748B] block">
              Xử lý và kích hoạt đơn tự động trong 10 - 30 giây
            </span>
          </div>
        </div>

        {/* Right: Detailed Bank Transfer Info with Copy Buttons */}
        <div className="md:col-span-7 space-y-3.5 text-xs">
          {/* Bank Name */}
          <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-[#64748B]" />
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Ngân hàng thụ hưởng</span>
                <span className="font-bold text-[#0F172A]">{bankName}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(bankName, "bank")}
              className="rounded-md border border-[#CBD5E1] bg-white px-2 py-1 text-[10px] font-bold text-[#475569] hover:border-[#0063FD] hover:text-[#0063FD] flex items-center gap-1"
            >
              {copiedField === "bank" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
              {copiedField === "bank" ? "Đã chép" : "Sao chép"}
            </button>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#0063FD]" />
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Số tài khoản</span>
                <span className="font-mono font-black text-sm text-[#0063FD]">{accountNumber}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(accountNumber, "acc")}
              className="rounded-md border border-[#CBD5E1] bg-white px-2 py-1 text-[10px] font-bold text-[#475569] hover:border-[#0063FD] hover:text-[#0063FD] flex items-center gap-1"
            >
              {copiedField === "acc" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
              {copiedField === "acc" ? "Đã chép" : "Sao chép"}
            </button>
          </div>

          {/* Account Name */}
          <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#64748B]" />
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Chủ tài khoản</span>
                <span className="font-bold text-[#0F172A] uppercase">{accountName}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(accountName, "name")}
              className="rounded-md border border-[#CBD5E1] bg-white px-2 py-1 text-[10px] font-bold text-[#475569] hover:border-[#0063FD] hover:text-[#0063FD] flex items-center gap-1"
            >
              {copiedField === "name" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
              {copiedField === "name" ? "Đã chép" : "Sao chép"}
            </button>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#B45309]" />
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Số tiền chính xác</span>
                <span className="font-mono font-black text-sm text-[#B45309]">
                  {formatPrice(totalVnd)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(String(totalVnd), "amount")}
              className="rounded-md border border-[#CBD5E1] bg-white px-2 py-1 text-[10px] font-bold text-[#475569] hover:border-[#0063FD] hover:text-[#0063FD] flex items-center gap-1"
            >
              {copiedField === "amount" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
              {copiedField === "amount" ? "Đã chép" : "Sao chép"}
            </button>
          </div>

          {/* Transfer Description (CRITICAL) */}
          <div className="flex items-center justify-between rounded-lg border-2 border-[#0063FD] bg-[#EFF6FF] p-2.5">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0063FD]" />
              <div>
                <span className="text-[10px] font-bold text-[#0063FD] block">
                  Nội dung chuyển khoản (Bắt buộc giữ nguyên)
                </span>
                <span className="font-mono font-black text-sm text-[#0F172A]">{orderCode}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(orderCode, "code")}
              className="rounded-md bg-[#0063FD] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[#0052D4] flex items-center gap-1 shadow-xs"
            >
              {copiedField === "code" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedField === "code" ? "Đã chép" : "Sao chép"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Controls & Live Polling Status */}
      <div className="border-t border-[#E2E8F0] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#64748B]">
          <RefreshCw className="h-4 w-4 animate-spin text-[#0063FD]" />
          <span>Hệ thống SePay đang tự động lắng nghe giao dịch chuyển khoản...</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            disabled={isChecking}
            onClick={handleManualCheck}
            className="flex-1 sm:flex-none rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-2 font-bold text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          >
            {isChecking ? "Đang kiểm tra..." : "Kiểm Tra Ngay"}
          </button>
          <Link href="/" className="flex-1 sm:flex-none">
            <button
              type="button"
              className="w-full rounded-xl bg-[#0063FD] px-4 py-2 font-bold text-white hover:bg-[#0052D4] transition-colors"
            >
              Về Trang Chủ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
