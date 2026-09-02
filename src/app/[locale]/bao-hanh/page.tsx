import React from "react";
import { ShieldCheck, RotateCcw, Wrench } from "lucide-react";

export const metadata = {
  title: "Chính Sách Bảo Hành & Đổi Trả | QMD-Tech",
};

export default function WarrantyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-10">
      <div className="border-b border-[#2A3040] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#22C55E] uppercase tracking-wider mb-2">
          <ShieldCheck className="h-4 w-4" />
          Cam Kết Chất Lượng QMD-Tech
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F2F4F8]">
          Chính Sách Bảo Hành & Hỗ Trợ Kỹ Thuật
        </h1>
        <p className="mt-1 text-xs text-[#9AA3B2]">
          Cam kết bảo hành chính hãng 100%, 1 đổi 1 nhanh chóng và hỗ trợ kỹ thuật trọn đời máy
        </p>
      </div>

      <div className="space-y-6 text-sm text-[#9AA3B2] leading-relaxed">
        <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-3">
          <h3 className="text-base font-bold text-[#F2F4F8] flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-[#3B82F6]" />
            1. Chính Sách Đổi Mới 1 Đổi 1 Trong 30 Ngày
          </h3>
          <p className="text-xs">
            Tất cả linh kiện phần cứng (CPU, Mainboard, VGA, RAM, SSD, Nguồn) nếu phát sinh lỗi do nhà sản xuất trong vòng 30 ngày đầu tiên kể từ ngày nhận hàng sẽ được đổi ngay sản phẩm mới 100% nguyên seal.
          </p>
        </div>

        <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-3">
          <h3 className="text-base font-bold text-[#F2F4F8] flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#22C55E]" />
            2. Thời Hạn Bảo Hành Theo Hãng
          </h3>
          <ul className="list-disc pl-5 text-xs space-y-1">
            <li>CPU Intel / AMD: Bảo hành 36 tháng.</li>
            <li>Mainboard ASUS / MSI / Gigabyte: Bảo hành 36 tháng.</li>
            <li>Card màn hình VGA: Bảo hành 36 tháng.</li>
            <li>RAM DDR4 / DDR5: Bảo hành 36 tháng (1 đổi 1).</li>
            <li>Ổ cứng SSD Samsung: Bảo hành 60 tháng.</li>
            <li>Nguồn máy tính Corsair: Bảo hành lên đến 120 tháng (10 năm).</li>
          </ul>
        </div>

        <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-3">
          <h3 className="text-base font-bold text-[#F2F4F8] flex items-center gap-2">
            <Wrench className="h-5 w-5 text-[#7C3AED]" />
            3. Dịch Vụ Bảo Hành Tận Nơi Cho Dàn PC Custom
          </h3>
          <p className="text-xs">
            Khách hàng đặt mua trọn bộ Custom PC tại QMD-Tech được hưởng gói bảo hành kỹ thuật tận nơi miễn phí 12 tháng tại khu vực nội thành Hà Nội và TP. Hồ Chí Minh.
          </p>
        </div>
      </div>
    </div>
  );
}
