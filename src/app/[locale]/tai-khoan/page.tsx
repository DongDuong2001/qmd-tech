import React from "react";
import { User, Package, Wrench, Shield, MapPin } from "lucide-react";

export const metadata = {
  title: "Tài Khoản & Quản Lý Đơn Hàng | QMD-Tech",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      <div className="flex items-center gap-4 border-b border-[#2A3040] pb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
          <User className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#F2F4F8]">Dương Quốc Đông</h1>
          <p className="text-xs text-[#9AA3B2]">dongduong@example.com • Thành viên VIP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-4 space-y-2 text-xs font-semibold">
          <button className="w-full flex items-center gap-2.5 rounded-lg bg-[#3B82F6] px-3.5 py-2.5 text-white text-left">
            <Package className="h-4 w-4" />
            Lịch sử đơn hàng
          </button>
          <button className="w-full flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[#9AA3B2] hover:bg-[#1B2030] hover:text-[#F2F4F8] text-left">
            <Wrench className="h-4 w-4" />
            Cấu hình PC đã lưu
          </button>
          <button className="w-full flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[#9AA3B2] hover:bg-[#1B2030] hover:text-[#F2F4F8] text-left">
            <Shield className="h-4 w-4" />
            Tra cứu bảo hành
          </button>
          <button className="w-full flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[#9AA3B2] hover:bg-[#1B2030] hover:text-[#F2F4F8] text-left">
            <MapPin className="h-4 w-4" />
            Sổ địa chỉ nhận hàng
          </button>
        </div>

        {/* Orders Content */}
        <div className="md:col-span-3 space-y-4">
          <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A3040] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#FACC15]">#QMD-2026-9812</span>
                <div className="text-[11px] text-[#9AA3B2]">Đặt ngày 01/09/2026</div>
              </div>
              <span className="rounded bg-[#22C55E]/15 px-2.5 py-1 text-xs font-bold text-[#22C55E]">
                Đang giao hàng (GHN)
              </span>
            </div>

            <div className="text-xs space-y-2 text-[#9AA3B2]">
              <div className="flex justify-between">
                <span className="text-[#F2F4F8] font-medium">1x CPU AMD Ryzen 7 7800X3D + 1x Mainboard ASUS B650E</span>
                <span className="font-mono font-bold text-[#F2F4F8]">18.480.000₫</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#2A3040]/50 text-xs">
              <span className="text-[#9AA3B2]">Vận chuyển: GHN Express (Mã: GHN982103)</span>
              <span className="font-mono font-bold text-[#FACC15]">Tổng: 18.480.000₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
