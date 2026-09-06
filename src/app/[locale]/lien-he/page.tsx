import React from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Liên Hệ & Hỗ Trợ Kỹ Thuật Online | QMD-Tech",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-10">
      <div className="border-b border-[#E2E8F0] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0063FD] uppercase tracking-wider mb-2">
          <MapPin className="h-4 w-4" />
          Kênh Tư Vấn & Hỗ Trợ Trực Tuyến
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
          Liên Hệ QMD-Tech
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Đội ngũ kỹ sư phần cứng QMD-Tech sẵn sàng hỗ trợ tư vấn cấu hình, tiếp nhận yêu cầu bảo hành và giải đáp kỹ thuật 24/7
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact info & Online Dispatch */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A]">Trung Tâm Tư Vấn & Điều Phối Online</h3>
            <div className="space-y-3 text-xs text-[#64748B]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0063FD] shrink-0" />
                <span>Trụ sở chính: Số 18 Phố Cầu Giấy, Quận Cầu Giấy, Hà Nội</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#16A34A] shrink-0" />
                <span>Hotline bán hàng: <strong className="text-[#0F172A]">1900.8888</strong> • Hỗ trợ: <strong className="text-[#0F172A]">0988.888.888</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#0063FD] shrink-0" />
                <span>Email tiếp nhận: <strong className="text-[#0F172A]">contact@qmdtech.vn</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0284C7] shrink-0" />
                <span>Thời gian làm việc: 8:30 - 21:00 (Tất cả các ngày trong tuần)</span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-6 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A]">Chính Sách Bán Hàng & Giao Nhận Toàn Quốc</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              QMD-Tech áp dụng mô hình phân phối linh kiện và máy tính ráp sẵn trực tuyến. Mọi đơn hàng đều được đóng gói chống sốc 3 lớp, bảo hiểm 100% giá trị hàng hóa và giao tận tay khách hàng trên 63 tỉnh thành qua đối tác vận chuyển hỏa tốc.
            </p>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-6">
          <div className="rounded-xl border border-[#E4E7EC] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A]">Gửi Tin Nhắn Cho QMD-Tech</h3>
            <p className="text-xs text-[#64748B]">
              Điền thông tin và yêu cầu của bạn, chúng tôi sẽ phản hồi trong vòng 30 phút.
            </p>

            <form className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Họ và tên *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="0988xxxxxx"
                    className="w-full rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Nội dung liên hệ *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tôi cần tư vấn cấu hình PC đồ họa 3D ngân sách 35 triệu..."
                  className="w-full rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <Button type="button" variant="primary" size="md" className="w-full font-bold gap-2 shadow-xs">
                <Send className="h-4 w-4" />
                Gửi tin nhắn liên hệ
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
