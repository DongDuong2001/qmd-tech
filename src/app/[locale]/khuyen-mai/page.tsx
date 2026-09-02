import React from "react";
import { Link } from "@/i18n/routing";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Khuyến Mãi & Giảm Giá Linh Kiện | QMD-Tech",
};

export default function DealsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-10">
      <div className="border-b border-[#2A3040] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FACC15] uppercase tracking-wider mb-2">
          <Tag className="h-4 w-4" />
          Chương trình ưu đãi tháng
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F2F4F8]">
          Khuyến Mãi & Flash Sale
        </h1>
        <p className="mt-1 text-xs text-[#9AA3B2]">
          Giảm giá lên đến 30% cho các gói build PC và combo linh kiện thế hệ mới
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#3B82F6]/50 bg-[#131722] p-8 space-y-4">
          <span className="rounded bg-[#3B82F6] px-3 py-1 text-xs font-bold text-white uppercase">
            Mã Giảm Giá
          </span>
          <h3 className="text-2xl font-bold text-[#F2F4F8]">
            Giảm Ngay 500.000₫ Cho Đơn Hàng Từ 10 Triệu
          </h3>
          <p className="text-xs text-[#9AA3B2]">
            Nhập mã <strong className="font-mono text-[#FACC15]">QMDTECH500</strong> tại trang thanh toán. Áp dụng cho toàn bộ linh kiện CPU, VGA và Mainboard.
          </p>
          <div className="pt-2">
            <Link href="/danh-muc">
              <Button variant="primary" size="md">
                Mua ngay
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[#7C3AED]/50 bg-[#131722] p-8 space-y-4">
          <span className="rounded bg-[#7C3AED] px-3 py-1 text-xs font-bold text-white uppercase">
            Gói Build PC
          </span>
          <h3 className="text-2xl font-bold text-[#F2F4F8]">
            Tặng Bộ Tản Nhiệt Nước Khi Build PC Trên 35 Triệu
          </h3>
          <p className="text-xs text-[#9AA3B2]">
            Miễn phí 100% chi phí lắp ráp, tra keo tản nhiệt cao cấp Thermal Grizzly và bảo hành tận nơi 12 tháng.
          </p>
          <div className="pt-2">
            <Link href="/build-pc">
              <Button variant="accent" size="md">
                Bắt đầu build PC
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
