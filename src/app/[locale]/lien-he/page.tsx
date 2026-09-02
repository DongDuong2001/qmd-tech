import React from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Liên Hệ & Hệ Thống Showroom | QMD-Tech",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-10">
      <div className="border-b border-[#E4E7EC] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-2">
          <MapPin className="h-4 w-4" />
          Hệ Thống Trải Nghiệm Phần Cứng
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
          Liên Hệ & Showroom QMD-Tech
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Ghé thăm showroom trực tiếp để trải nghiệm dàn máy Custom PC và nhận tư vấn cấu hình
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact info & Showrooms */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-[#E4E7EC] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A]">Showroom Hà Nội</h3>
            <div className="space-y-2 text-xs text-[#64748B]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#2563EB] shrink-0" />
                Số 18, Phố Cầu Giấy, Quận Cầu Giấy, Hà Nội
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#16A34A] shrink-0" />
                Hotline: 024.8888.9999 (8:30 - 21:00)
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#B45309] shrink-0" />
                Mở cửa: 8:30 - 21:00 (Tất cả các ngày trong tuần)
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#E4E7EC] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A]">Showroom TP. Hồ Chí Minh</h3>
            <div className="space-y-2 text-xs text-[#64748B]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#2563EB] shrink-0" />
                Số 250, Đường Cách Mạng Tháng 8, Quận 3, TP. Hồ Chí Minh
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#16A34A] shrink-0" />
                Hotline: 028.8888.7777 (8:30 - 21:00)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#7C3AED] shrink-0" />
                Email hỗ trợ: support@qmdtech.vn
              </p>
            </div>
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
