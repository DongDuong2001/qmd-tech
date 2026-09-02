"use client";

import React from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { ShieldCheck, Truck, Headphones, Wrench, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  if (pathname.includes("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF] text-[#475569]">
      {/* 4 Core Value Propositions in Solid Light Boxes */}
      <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#E11D48] border border-[#E2E8F0] shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#0F172A] uppercase">100% Chính Hãng</h4>
              <p className="text-xs text-[#64748B]">Bảo hành theo hãng 12 - 60 tháng</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#16A34A] border border-[#E2E8F0] shadow-xs">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#0F172A] uppercase">Giao Hàng Siêu Tốc</h4>
              <p className="text-xs text-[#64748B]">Giao 2h nội thành HN & TP.HCM</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#EA580C] border border-[#E2E8F0] shadow-xs">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#0F172A] uppercase">Build PC Miễn Phí</h4>
              <p className="text-xs text-[#64748B]">Lắp ráp, stress test & cài đặt free</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#B45309] border border-[#E2E8F0] shadow-xs">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#0F172A] uppercase">Hỗ Trợ Kỹ Thuật 24/7</h4>
              <p className="text-xs text-[#64748B]">Hotline kỹ thuật: 1900.8888</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Showrooms */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Brand & Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#E2E8F0] shadow-xs bg-white">
                <Image
                  src="/qmdtech_logo.png"
                  alt="QMD-Tech Logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-black tracking-wider text-[#0F172A]">
                QMD<span className="text-[#E11D48]">-TECH</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#64748B]">
              Hệ thống bán lẻ linh kiện máy tính, PC Gaming & Workstation chuyên nghiệp hàng đầu Việt Nam.
            </p>
            <div className="text-xs space-y-1 text-[#475569]">
              <p className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#E11D48]" /> Hotline: <strong className="text-[#0F172A]">1900 8888</strong>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#2563EB]" /> Email: contact@qmdtech.vn
              </p>
            </div>
          </div>

          {/* Col 2: Showroom Locations */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A] mb-4 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#E11D48]" /> Hệ Thống Showroom
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-[#0F172A]">Showroom Hà Nội:</strong>
                <p className="text-[#64748B]">Số 18 Phố Cầu Giấy, Q. Cầu Giấy, Hà Nội</p>
              </div>
              <div>
                <strong className="text-[#0F172A]">Showroom TP.HCM:</strong>
                <p className="text-[#64748B]">Số 280 Nguyễn Thị Minh Khai, Q.3, TP.HCM</p>
              </div>
              <div>
                <strong className="text-[#0F172A]">Trung Tâm Bảo Hành:</strong>
                <p className="text-[#64748B]">Số 45 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội</p>
              </div>
            </div>
          </div>

          {/* Col 3: Customer Policies */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A] mb-4">
              Chính Sách & Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/bao-hanh" className="hover:text-[#E11D48] transition-colors">
                  Tra cứu bảo hành & đổi trả 30 ngày
                </Link>
              </li>
              <li>
                <Link href="/build-pc" className="hover:text-[#E11D48] transition-colors">
                  Hướng dẫn tự cấu hình PC Gaming
                </Link>
              </li>
              <li>
                <Link href="/khuyen-mai" className="hover:text-[#E11D48] transition-colors">
                  Chương trình khuyến mãi & quà tặng
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-[#E11D48] transition-colors">
                  Liên hệ hợp tác & dự án Cyber Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Payment Methods & Badges */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A] mb-4">
              Phương Thức Thanh Toán
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <span className="flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] py-2 font-bold text-[#0F172A]">
                VNPAY-QR
              </span>
              <span className="flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] py-2 font-bold text-[#DB2777]">
                MOMO
              </span>
              <span className="flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] py-2 font-bold text-[#2563EB]">
                VISA / MASTER
              </span>
              <span className="flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] py-2 font-bold text-[#16A34A]">
                COD TẬN NƠI
              </span>
            </div>

            <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[11px] text-[#64748B]">
              🛡️ Giấy phép ĐKKD số 010888888 do Sở KH&ĐT TP. Hà Nội cấp.
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 border-t border-[#E2E8F0] pt-6 text-center text-xs text-[#94A3B8]">
          © {new Date().getFullYear()} QMD-Tech Corporation. Nền tảng thương mại linh kiện PC Gaming cao cấp hàng đầu Việt Nam.
        </div>
      </div>
    </footer>
  );
}
