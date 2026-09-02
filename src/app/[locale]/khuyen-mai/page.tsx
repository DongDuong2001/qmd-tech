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
      <div className="border-b border-[#E4E7EC] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] uppercase tracking-wider mb-2">
          <Tag className="h-4 w-4" />
          Chương trình ưu đãi tháng
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
          Khuyến Mãi & Flash Sale
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Giảm giá lên đến 30% cho các gói build PC và combo linh kiện thế hệ mới
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#BFDBFE] bg-[#FFFFFF] p-8 space-y-4 shadow-xs">
          <span className="rounded bg-[#2563EB] px-3 py-1 text-xs font-bold text-white uppercase">
            Mã Giảm Giá
          </span>
          <h3 className="text-2xl font-bold text-[#0F172A]">
            Giảm Ngay 500.000₫ Cho Đơn Hàng Từ 10 Triệu
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Nhập mã <strong className="font-mono text-[#B45309]">QMDTECH500</strong> tại trang thanh toán. Áp dụng cho toàn bộ linh kiện CPU, VGA và Mainboard.
          </p>
          <div className="pt-2">
            <Link href="/danh-muc">
              <Button variant="primary" size="md" className="shadow-xs">
                Mua ngay
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[#DDD6FE] bg-[#FFFFFF] p-8 space-y-4 shadow-xs">
          <span className="rounded bg-[#7C3AED] px-3 py-1 text-xs font-bold text-white uppercase">
            Gói Build PC
          </span>
          <h3 className="text-2xl font-bold text-[#0F172A]">
            Tặng Bộ Tản Nhiệt Nước Khi Build PC Trên 35 Triệu
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Miễn phí 100% chi phí lắp ráp, tra keo tản nhiệt cao cấp Thermal Grizzly và bảo hành tận nơi 12 tháng.
          </p>
          <div className="pt-2">
            <Link href="/build-pc">
              <Button variant="accent" size="md" className="shadow-xs">
                Bắt đầu build PC
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
