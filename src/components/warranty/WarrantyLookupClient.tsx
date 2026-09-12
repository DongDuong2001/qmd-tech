"use client";

import React, { useState } from "react";
import { createHugeIconComponent } from "@/components/ui/HugeIcon";
import {
  Search01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Clock01Icon,
  Wrench01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { WarrantyLookupResult } from "@/modules/warranty/types";

const Search = createHugeIconComponent(Search01Icon);
const CheckCircle2 = createHugeIconComponent(CheckmarkCircle02Icon);
const AlertCircle = createHugeIconComponent(AlertCircleIcon);
const Clock = createHugeIconComponent(Clock01Icon);
const Wrench = createHugeIconComponent(Wrench01Icon);
const Loader2 = createHugeIconComponent(Loading03Icon);

export function WarrantyLookupClient() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WarrantyLookupResult | null>(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/warranty/lookup?q=${encodeURIComponent(query.trim())}`);
      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
      } else {
        setResult({
          serial: null,
          tickets: [],
          isValid: false,
          daysRemaining: 0,
          message: json.error || "Không tìm thấy thông tin bảo hành.",
        });
      }
    } catch {
      setResult({
        serial: null,
        tickets: [],
        isValid: false,
        daysRemaining: 0,
        message: "Lỗi kết nối máy chủ khi tra cứu bảo hành.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return <span className="rounded bg-blue-100 text-blue-800 px-2 py-0.5 text-[11px] font-bold">Đã tiếp nhận</span>;
      case "testing":
        return <span className="rounded bg-yellow-100 text-yellow-800 px-2 py-0.5 text-[11px] font-bold">Đang kiểm tra</span>;
      case "sent_to_vendor":
        return <span className="rounded bg-purple-100 text-purple-800 px-2 py-0.5 text-[11px] font-bold">Đã gửi hãng</span>;
      case "vendor_returned":
        return <span className="rounded bg-indigo-100 text-indigo-800 px-2 py-0.5 text-[11px] font-bold">Hãng đã trả về</span>;
      case "completed":
        return <span className="rounded bg-green-100 text-green-800 px-2 py-0.5 text-[11px] font-bold">Đã xử lý xong</span>;
      case "rejected":
        return <span className="rounded bg-red-100 text-red-800 px-2 py-0.5 text-[11px] font-bold">Từ chối bảo hành</span>;
      default:
        return <span className="rounded bg-gray-100 text-gray-800 px-2 py-0.5 text-[11px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
          <Search className="h-5 w-5 text-[#2563EB]" />
          Tra Cứu Bảo Hành & Tiến Độ RMA Trực Tuyến
        </h2>
        <p className="text-xs text-[#64748B]">
          Nhập Số Serial (S/N) in trên tem sản phẩm hoặc Số điện thoại đặt hàng để kiểm tra thời hạn và lịch sử sửa chữa.
        </p>
      </div>

      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập Serial Number hoặc Số điện thoại (Ví dụ: RTX4090, 0988...)"
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>
        <Button type="submit" disabled={loading || !query.trim()} variant="primary" size="md" className="gap-2 shrink-0 text-xs font-bold">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Tra Cứu Ngay
        </Button>
      </form>

      {searched && result && (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-4 text-xs">
          {result.serial ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">Sản phẩm</div>
                  <div className="text-sm font-black text-[#0F172A]">
                    {result.serial.product?.name || "Linh kiện phần cứng QMD-Tech"}
                  </div>
                  <div className="font-mono text-[11px] text-[#2563EB]">S/N: {result.serial.serial_number}</div>
                </div>
                <div>
                  {result.isValid ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Còn bảo hành ({result.daysRemaining} ngày)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                      <AlertCircle className="h-3.5 w-3.5" /> Hết hạn bảo hành
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#64748B]">
                <div>
                  <span className="text-[#94A3B8]">Thời hạn bảo hành:</span>{" "}
                  <strong className="text-[#0F172A]">{result.serial.warranty_months} tháng</strong>
                </div>
                <div>
                  <span className="text-[#94A3B8]">Ngày xuất bán:</span>{" "}
                  <strong className="text-[#0F172A]">
                    {result.serial.sold_at ? new Date(result.serial.sold_at).toLocaleDateString("vi-VN") : "Chưa kích hoạt"}
                  </strong>
                </div>
                <div>
                  <span className="text-[#94A3B8]">Hạn bảo hành đến:</span>{" "}
                  <strong className="text-[#0F172A]">
                    {result.serial.warranty_expires_at
                      ? new Date(result.serial.warranty_expires_at).toLocaleDateString("vi-VN")
                      : "Theo ngày hóa đơn"}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#D97706]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{result.message || "Không tìm thấy linh kiện theo số Serial này."}</span>
            </div>
          )}

          {/* Associated RMA Tickets */}
          {result.tickets.length > 0 && (
            <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
              <h4 className="font-bold text-[#0F172A] flex items-center gap-2">
                <Wrench className="h-4 w-4 text-[#7C3AED]" />
                Lịch Sử Tiếp Nhận & Sửa Chữa ({result.tickets.length} phiếu)
              </h4>
              <div className="space-y-2.5">
                {result.tickets.map((t) => (
                  <div key={t.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-[#2563EB]">{t.ticket_code}</span>
                      {getStatusBadge(t.status)}
                    </div>
                    <div className="text-[#64748B]">
                      <strong>Mô tả lỗi:</strong> {t.issue_description}
                    </div>
                    {t.technician_notes && (
                      <div className="text-xs text-[#0F172A] bg-white p-2 rounded border border-[#E2E8F0]">
                        <strong className="text-[#2563EB]">Ghi chú kỹ thuật:</strong> {t.technician_notes}
                      </div>
                    )}
                    <div className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Ngày tiếp nhận: {new Date(t.created_at).toLocaleDateString("vi-VN")}
                      {t.vendor_rma_code && <span> • Mã RMA Hãng: {t.vendor_rma_code}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
