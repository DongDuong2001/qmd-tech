import React from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Liên Hệ & Hệ Thống Showroom | QMD-Tech",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-10">
      <div className="border-b border-[#2A3040] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-2">
          <MapPin className="h-4 w-4" />
          Hệ Thống Trải Nghiệm Phần Cứng
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F2F4F8]">
          Liên Hệ & Showroom QMD-Tech
        </h1>
        <p className="mt-1 text-xs text-[#9AA3B2]">
          Ghé thăm showroom trực tiếp để trải nghiệm dàn máy Custom PC và nhận tư vấn cấu hình
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact info & Showrooms */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F2F4F8]">Showroom Hà Nội</h3>
            <div className="space-y-2 text-xs text-[#9AA3B2]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#3B82F6] shrink-0" />
                Số 18, Phố Cầu Giấy, Quận Cầu Giấy, Hà Nội
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#22C55E] shrink-0" />
                Hotline: 024.8888.9999 (8:30 - 21:00)
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#FACC15] shrink-0" />
                Mở cửa: 8:30 - 21:00 (Tất cả các ngày trong tuần)
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F2F4F8]">Showroom TP. Hồ Chí Minh</h3>
            <div className="space-y-2 text-xs text-[#9AA3B2]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#3B82F6] shrink-0" />
                Số 250, Đường Cách Mạng Tháng 8, Quận 3, TP. Hồ Chí Minh
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#22C55E] shrink-0" />
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
          <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F2F4F8]">Gửi Tin Nhắn Cho QMD-Tech</h3>
            <p className="text-xs text-[#9AA3B2]">
              Điền thông tin và yêu cầu của bạn, chúng tôi sẽ phản hồi trong vòng 30 phút.
            </p>

            <form className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#9AA3B2] mb-1">
                  Họ và tên *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9AA3B2] mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="0988xxxxxx"
                    className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#9AA3B2] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9AA3B2] mb-1">
                  Nội dung liên hệ *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tôi cần tư vấn cấu hình PC đồ họa 3D ngân sách 35 triệu..."
                  className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <Button type="button" variant="primary" size="md" className="w-full font-bold gap-2">
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
