"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
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
  Sparkles,
  Truck,
  Award,
  Tag,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-hide storefront Header on admin dashboard to maintain enterprise backoffice separation
  if (pathname && pathname.includes("/admin")) {
    return null;
  }

  const hotKeywords = [
    "RTX 4070 Ti Super",
    "Ryzen 7 7800X3D",
    "Intel Core i7-14700K",
    "B760 Mainboard",
    "RAM 32GB DDR5",
    "SSD 1TB Gen4",
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
      {/* 1. Top Utility Bar */}
      <div className="border-b border-[#F1F5F9] bg-[#F8FAFC] py-1.5 text-xs text-[#64748B]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>
                3 Showroom: <strong>Hà Nội</strong> • <strong>TP.HCM</strong> • <strong>Đà Nẵng</strong>
              </span>
            </span>
            <span className="hidden sm:inline-block text-[#CBD5E1]">|</span>
            <span className="hidden sm:flex items-center gap-1 text-[#0063FD] font-semibold">
              <Truck className="h-3.5 w-3.5 text-[#0063FD]" />
              Freeship toàn quốc từ 5.000.000₫
            </span>
          </div>

          <div className="flex items-center gap-4">
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
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#0063FD] shadow-xs bg-white">
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
                  QMD<span className="text-[#0063FD]">-TECH</span>
                </span>
                <span className="rounded bg-[#0F172A] px-1.5 py-0.2 text-[9px] font-black text-white uppercase tracking-wider">
                  GAMING
                </span>
              </div>
              <span className="text-[10px] font-extrabold tracking-widest text-[#0063FD] uppercase">
                PC & Hardware Systems
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
                className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 pl-10 pr-24 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0063FD] transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
              <button className="absolute right-1 top-1 bottom-1 rounded-md bg-[#0063FD] px-4 text-xs font-bold text-white hover:bg-[#0052D4] transition-colors">
                Tìm kiếm
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-hidden text-[11px] text-[#64748B]">
              <span className="text-[#0063FD] font-bold flex items-center gap-0.5 shrink-0">
                <Sparkles className="h-3 w-3" /> Xu hướng:
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                {hotKeywords.map((kw) => (
                  <Link
                    key={kw}
                    href={`/danh-muc?q=${encodeURIComponent(kw)}`}
                    className="hover:text-[#0063FD] transition-colors font-medium text-[#475569]"
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
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFF6FF] text-[#0063FD]">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#64748B]">Hotline 24/7</span>
                <span className="font-mono font-black text-[#0063FD]">1900.8888</span>
              </div>
            </div>

            {/* Custom PC Builder CTA in Electric Blue */}
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
              <div className="relative flex h-10 items-center gap-2 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] px-3 text-[#0F172A] hover:border-[#0063FD] hover:text-[#0063FD] transition-all shadow-xs">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#0063FD] text-[10px] font-black text-white">
                    2
                  </span>
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] text-[#64748B]">Giỏ hàng</span>
                  <span className="font-mono text-xs font-bold text-[#0063FD]">14.280.000₫</span>
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
              className="flex items-center gap-2 rounded-lg bg-[#0063FD] p-2.5 text-white"
            >
              <Wrench className="h-4 w-4" />
              Build PC
            </Link>
            <Link
              href="/khuyen-mai"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] p-2.5 text-[#0063FD]"
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
