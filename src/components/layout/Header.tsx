"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import {
  Search,
  ShoppingCart,
  Wrench,
  Menu,
  X,
  Flame,
  Phone,
  ShieldCheck,
  Truck,
  User,
  Sparkles,
  Award,
} from "lucide-react";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { Button } from "../ui/button";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (pathname.includes("/admin")) {
    return null;
  }

  const hotKeywords = [
    "RTX 4070 Ti Super",
    "Ryzen 7 7800X3D",
    "i7-14700K",
    "B650E",
    "DDR5 32GB",
    "Nguồn ATX 3.0",
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
      {/* 1. Top Utility Bar (Showrooms, Warranty, Hotline, Login) */}
      <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-1.5 text-xs text-[#475569]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#0F172A] font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-[#16A34A]" />
              <span>
                3 Showroom: <strong>Hà Nội</strong> • <strong>TP.HCM</strong> • <strong>Đà Nẵng</strong>
              </span>
            </span>
            <span className="hidden sm:inline-block text-[#CBD5E1]">|</span>
            <span className="hidden sm:flex items-center gap-1 text-[#B45309] font-semibold">
              <Truck className="h-3.5 w-3.5 text-[#EA580C]" />
              Freeship toàn quốc từ 5.000.000₫
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/bao-hanh"
              className="hidden md:flex items-center gap-1 text-[#475569] hover:text-[#E11D48] transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
              Tra cứu bảo hành
            </Link>
            <Link
              href="/tai-khoan"
              className="hidden sm:flex items-center gap-1 text-[#475569] hover:text-[#E11D48] transition-colors"
            >
              <User className="h-3.5 w-3.5 text-[#2563EB]" />
              Đăng nhập / Đăng ký
            </Link>
            <span className="text-[#CBD5E1]">|</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo with Rounded Image */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#E11D48] shadow-xs bg-white">
              <Image
                src="/qmdtech_logo.png"
                alt="QMD-Tech Logo"
                fill
                sizes="44px"
                priority
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-wider text-[#0F172A]">
                  QMD<span className="text-[#E11D48]">-TECH</span>
                </span>
                <span className="rounded bg-[#0F172A] px-1.5 py-0.2 text-[9px] font-black text-white uppercase tracking-wider">
                  GAMING
                </span>
              </div>
              <span className="text-[10px] font-extrabold tracking-widest text-[#EA580C] uppercase">
                PC & Hardware Superstore
              </span>
            </div>
          </Link>

          {/* Search Bar with Quick Hot Keywords */}
          <div className="hidden lg:flex flex-1 max-w-2xl flex-col gap-1 mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên CPU, Card RTX 4070 Ti, Mainboard B650, RAM DDR5..."
                className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 pl-10 pr-24 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#E11D48] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E11D48] transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
              <button className="absolute right-1 top-1 bottom-1 rounded-md bg-[#E11D48] px-4 text-xs font-bold text-white hover:bg-[#BE123C] transition-colors">
                Tìm kiếm
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-hidden text-[11px] text-[#64748B]">
              <span className="text-[#B45309] font-bold flex items-center gap-0.5 shrink-0">
                <Sparkles className="h-3 w-3" /> Xu hướng:
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                {hotKeywords.map((kw) => (
                  <Link
                    key={kw}
                    href={`/danh-muc?q=${encodeURIComponent(kw)}`}
                    className="hover:text-[#E11D48] transition-colors font-medium text-[#475569]"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Icons & CTAs */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Hotline Pill */}
            <div className="hidden xl:flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E11D48]/10 text-[#E11D48]">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#64748B]">Hotline 24/7</span>
                <span className="font-mono font-black text-[#E11D48]">1900.8888</span>
              </div>
            </div>

            {/* Custom PC Builder CTA in Solid Red */}
            <Link href="/build-pc">
              <Button
                variant="primary"
                size="sm"
                className="gap-1.5 text-xs font-black uppercase tracking-wider py-2 shadow-xs"
              >
                <Wrench className="h-4 w-4 text-white" />
                <span className="hidden sm:inline">Xây Dựng</span> Cấu Hình PC
              </Button>
            </Link>

            {/* Cart Button with Count Badge */}
            <Link href="/gio-hang">
              <div className="relative flex h-10 items-center gap-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] px-3 text-[#0F172A] hover:border-[#E11D48] hover:text-[#E11D48] transition-all shadow-xs">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E11D48] text-[10px] font-black text-white">
                    2
                  </span>
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] text-[#64748B]">Giỏ hàng</span>
                  <span className="font-mono text-xs font-bold text-[#B45309]">14.280.000₫</span>
                </div>
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] p-2 text-[#475569] hover:text-[#0F172A]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-[#FFFFFF] p-4 space-y-3">
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Tìm kiếm linh kiện..."
              className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 pl-9 pr-4 text-xs text-[#0F172A]"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#64748B]" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <Link
              href="/build-pc"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-[#E11D48] p-2.5 text-white"
            >
              <Wrench className="h-4 w-4" />
              Build PC
            </Link>
            <Link
              href="/khuyen-mai"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-[#FFF7ED] border border-[#FDBA74] p-2.5 text-[#EA580C]"
            >
              <Flame className="h-4 w-4 text-[#E11D48]" />
              Flash Sale
            </Link>
            <Link
              href="/danh-muc"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] p-2.5 text-[#0F172A]"
            >
              <Award className="h-4 w-4 text-[#2563EB]" />
              Tất cả danh mục
            </Link>
            <Link
              href="/bao-hanh"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] p-2.5 text-[#0F172A]"
            >
              <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
              Bảo hành
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
