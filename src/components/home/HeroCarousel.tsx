"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { EventBanner } from "@/shared/types";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wrench,
  ShieldCheck,
  Headphones,
  ArrowRight,
} from "lucide-react";

interface HeroCarouselProps {
  banners: EventBanner[];
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeBanners = banners.filter((b) => b.is_active);
  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const nextSlide = useCallback(() => {
    if (activeBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prevSlide = useCallback(() => {
    if (activeBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  useEffect(() => {
    if (isPaused || activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, activeBanners.length, nextSlide]);

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* ========================================================================= */}
      {/* 1. MAIN CAROUSEL SLIDER (Vietnam PC Retailer Style) */}
      {/* ========================================================================= */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="lg:col-span-8 relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs"
      >
        {/* Main Banner Image & Content Area */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-[#0F172A]">
          {currentBanner && (
            <Image
              src={currentBanner.image_url}
              alt={currentBanner.title_vi}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover opacity-90 transition-all duration-700 ease-in-out"
            />
          )}

          {/* Dark scrim overlay for high-contrast readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent" />

          {/* Banner Text Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 space-y-2.5 text-white">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E11D48] px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{currentBanner?.tag || "SỰ KIỆN NỔI BẬT"}</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white tracking-tight leading-tight max-w-2xl drop-shadow-sm">
              {currentBanner?.title_vi}
            </h2>

            {currentBanner?.subtitle_vi && (
              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-xl">
                {currentBanner.subtitle_vi}
              </p>
            )}

            <div className="pt-1">
              <Link href={currentBanner?.target_url || "/danh-muc"}>
                <Button
                  variant="primary"
                  size="sm"
                  className="font-black uppercase text-xs gap-1.5 px-5 shadow-sm"
                >
                  <span>Khám Phá Ngay</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Left / Right Slide Arrow Controls */}
          {activeBanners.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#0F172A] hover:bg-white hover:text-[#E11D48] transition-all shadow-md"
                aria-label="Slide trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#0F172A] hover:bg-white hover:text-[#E11D48] transition-all shadow-md"
                aria-label="Slide tiếp theo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Carousel Preview Tabs (Bottom Navigation) */}
        {activeBanners.length > 1 && (
          <div className="grid grid-cols-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            {activeBanners.map((banner, index) => (
              <button
                key={banner.id}
                onClick={() => setCurrentIndex(index)}
                className={`px-3 py-2.5 text-left text-xs transition-all border-r last:border-r-0 border-[#E2E8F0] ${
                  currentIndex === index
                    ? "bg-[#FFFFFF] text-[#E11D48] font-bold border-b-2 border-b-[#E11D48]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                }`}
              >
                <div className="truncate text-[11px] font-bold">{banner.title_vi}</div>
                <div className="text-[10px] text-[#94A3B8] truncate">{banner.tag || "Khuyến mãi"}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. SIDE PROMO CARDS (Vietnamese E-commerce Support & Service Showcase) */}
      {/* ========================================================================= */}
      <div className="lg:col-span-4 flex flex-col justify-between gap-3">
        {/* Side Card 1: Custom PC Configurator */}
        <Link
          href="/build-pc"
          className="flex-1 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-xs hover:border-[#E11D48] transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[10px] font-black text-[#1D4ED8] uppercase">
              TỰ RÁP MÁY TÍNH
            </span>
            <h3 className="text-sm font-black text-[#0F172A] group-hover:text-[#E11D48] transition-colors">
              Xây Dựng Cấu Hình PC Theo Yêu Cầu
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Tự động kiểm tra độ tương thích socket, nguồn điện & vỏ case
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1D4ED8] group-hover:bg-[#E11D48] group-hover:text-white transition-all ml-3">
            <Wrench className="h-5 w-5" />
          </div>
        </Link>

        {/* Side Card 2: Genuine Warranty & Support */}
        <Link
          href="/bao-hanh"
          className="flex-1 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-xs hover:border-[#16A34A] transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="rounded bg-[#DCFCE7] border border-[#86EFAC] px-2 py-0.5 text-[10px] font-black text-[#15803D] uppercase">
              CAM KẾT 100%
            </span>
            <h3 className="text-sm font-black text-[#0F172A] group-hover:text-[#16A34A] transition-colors">
              Chính Sách Bảo Hành & Đổi Mới
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Bảo hành theo hãng 12 - 36 tháng, hỗ trợ kỹ thuật trọn đời
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#15803D] group-hover:bg-[#16A34A] group-hover:text-white transition-all ml-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </Link>

        {/* Side Card 3: Hotline Support */}
        <Link
          href="/lien-he"
          className="flex-1 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-xs hover:border-[#EA580C] transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="rounded bg-[#FFF7ED] border border-[#FED7AA] px-2 py-0.5 text-[10px] font-black text-[#EA580C] uppercase">
              TƯ VẤN TRỰC TIẾP
            </span>
            <h3 className="text-sm font-black text-[#0F172A] group-hover:text-[#EA580C] transition-colors">
              Hotline Tư Vấn: 1900 8888
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Hỗ trợ báo giá dự án, giải pháp gaming gear & doanh nghiệp
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#EA580C] group-hover:bg-[#EA580C] group-hover:text-white transition-all ml-3">
            <Headphones className="h-5 w-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
