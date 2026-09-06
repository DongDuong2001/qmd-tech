"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  Search,
  ShoppingCart,
  Wrench,
  Phone,
  ShieldCheck,
  User,
  Menu,
  X,
  Truck,
  Award,
  Tag,
  BookOpen,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/danh-muc?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Auto-hide storefront Header on admin dashboard to maintain enterprise backoffice separation
  if (pathname && pathname.includes("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-clip border-b border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
      {/* 1. Top Utility Bar */}
      <div className="border-b border-[#F1F5F9] bg-[#F8FAFC] py-1 text-xs text-[#64748B]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <span className="flex items-center gap-1.5 truncate text-[11px] sm:text-xs text-[#334155]">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="truncate">
                <strong className="text-[#0F172A]">Bán Hàng & Ráp PC Online Toàn Quốc</strong> • Giao tận nơi 63 tỉnh thành
              </span>
            </span>
            <span className="hidden md:inline-block text-[#CBD5E1]">|</span>
            <span className="hidden md:flex items-center gap-1 text-[#0063FD] font-semibold">
              <Truck className="h-3.5 w-3.5 text-[#0063FD]" />
              Freeship từ 5.000.000₫
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1 text-[#475569] hover:text-[#0063FD] transition-colors font-medium"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#0063FD]" />
              Blog Công Nghệ
            </Link>
            <span className="hidden sm:inline-block text-[#CBD5E1]">|</span>
            <Link
              href="/bao-hanh"
              className="hidden md:flex items-center gap-1 text-[#475569] hover:text-[#0063FD] transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
              Tra cứu bảo hành
            </Link>
            <Link
              href="/tai-khoan"
              className="hidden sm:flex items-center gap-1 text-[#475569] hover:text-[#0063FD] transition-colors"
            >
              <User className="h-3.5 w-3.5 text-[#0063FD]" />
              Tài khoản
            </Link>
            <span className="hidden sm:inline-block text-[#CBD5E1]">|</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo with Rounded Image */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
            <div className="relative h-9 w-9 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#0063FD] shadow-xs bg-white">
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
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-2xl font-black tracking-wider text-[#0F172A]">
                  QMD<span className="text-[#0063FD]">-TECH</span>
                </span>
                <span className="rounded bg-[#0F172A] px-1 py-0.2 text-[8px] sm:text-[9px] font-black text-white uppercase tracking-wider">
                  GAMING
                </span>
              </div>
              <span className="hidden xs:block text-[9px] sm:text-[10px] font-extrabold tracking-widest text-[#0063FD] uppercase">
                PC & Hardware Systems
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm linh kiện, CPU, RTX 4070 Ti, Mainboard, RAM..."
                className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0063FD] transition-all shadow-2xs"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#64748B]" />
            </form>
          </div>

          {/* Right Action Icons & CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Hotline Pill (Desktop only) */}
            <div className="hidden xl:flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFF6FF] text-[#0063FD]">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#64748B]">Hotline 24/7</span>
                <span className="font-mono font-black text-[#0063FD]">1900.8888</span>
              </div>
            </div>

            {/* Custom PC Builder CTA in Electric Blue (Hidden on phone to prevent overflow, shown on tablet/PC) */}
            <Link href="/build-pc" className="hidden sm:inline-flex">
              <Button
                variant="primary"
                size="sm"
                className="gap-1.5 text-xs font-black uppercase tracking-wider py-2 shadow-xs"
              >
                <Wrench className="h-4 w-4 text-white" />
                <span>Xây Dựng Cấu Hình PC</span>
              </Button>
            </Link>

            {/* Cart Button with Count Badge */}
            <Link
              href="/gio-hang"
              className="relative flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-bold text-[#0F172A] hover:border-[#0063FD] hover:text-[#0063FD] transition-colors shadow-2xs"
            >
              <ShoppingCart className="h-4 w-4 text-[#0063FD]" />
              <span className="hidden md:inline font-bold">Giỏ hàng</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] p-2 text-[#475569] hover:text-[#0F172A]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Inline Search Bar */}
        <div className="mt-2.5 lg:hidden">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm CPU, RTX 4070 Ti, B650, RAM..."
              className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#64748B]" />
          </form>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-[#FFFFFF] p-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <Link
              href="/build-pc"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-[#0063FD] p-2.5 text-white"
            >
              <Wrench className="h-4 w-4" />
              Build PC
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] p-2.5 text-[#0063FD]"
            >
              <BookOpen className="h-4 w-4 text-[#0063FD]" />
              Blog Công Nghệ
            </Link>
            <Link
              href="/khuyen-mai"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] p-2.5 text-[#0F172A]"
            >
              <Tag className="h-4 w-4 text-[#0063FD]" />
              Khuyến Mãi
            </Link>
            <Link
              href="/danh-muc"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] p-2.5 text-[#0F172A]"
            >
              <Award className="h-4 w-4 text-[#0063FD]" />
              Tất cả danh mục
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
