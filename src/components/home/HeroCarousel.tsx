"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { EventBanner } from "@/shared/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
      {/* ========================================================================= */}
      {/* 1. MAIN EVENT POSTER CAROUSEL (Responsive 16:9 on Mobile, 21:9 on Desktop) */}
      {/* ========================================================================= */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="lg:col-span-8 relative flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs"
      >
        {/* Full-bleed Clickable Event Banner Poster Area */}
        <Link
          href={currentBanner?.target_url || "/danh-muc"}
          className="relative block aspect-[16/9] sm:aspect-[21/9] lg:aspect-auto lg:h-[390px] w-full overflow-hidden bg-[#F8FAFC] group cursor-pointer"
        >
          {currentBanner && (
            <Image
              src={currentBanner.image_url}
              alt={currentBanner.title_vi}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-all duration-700 ease-in-out group-hover:scale-[1.01]"
            />
          )}

          {/* Subtle Tag Badge on Top-Left */}
          {currentBanner?.tag && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
              <span className="inline-flex items-center rounded-md sm:rounded-lg bg-[#0063FD] px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-white shadow-md">
                {currentBanner.tag}
              </span>
            </div>
          )}

          {/* Slide Progress Dots (Bottom-Right of Banner) */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-10 flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1">
              {activeBanners.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1 sm:h-1.5 rounded-full transition-all ${
                    currentIndex === idx ? "w-3.5 sm:w-5 bg-[#0063FD]" : "w-1 sm:w-1.5 bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </Link>

        {/* Left / Right Slide Arrow Controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-[#0F172A] hover:bg-white hover:text-[#0063FD] transition-all shadow-md"
              aria-label="Slide trước"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-[#0F172A] hover:bg-white hover:text-[#0063FD] transition-all shadow-md"
              aria-label="Slide tiếp theo"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </>
        )}

        {/* Event Tabs Navigation: Compact title on Mobile, Full 3 tabs on Tablet & Desktop */}
        {activeBanners.length > 1 && (
          <div className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
            {/* Mobile View: Clean single active event title with slide counter */}
            <div className="flex sm:hidden items-center justify-between px-3 py-2 text-xs">
              <span className="truncate font-bold text-[#0063FD] text-[11px]">
                {currentBanner?.title_vi}
              </span>
              <span className="font-mono text-[10px] text-[#64748B] shrink-0 ml-2">
                {currentIndex + 1}/{activeBanners.length}
              </span>
            </div>

            {/* Tablet & Desktop View: 3-column Interactive Tabs */}
            <div className="hidden sm:grid sm:grid-cols-3">
              {activeBanners.map((banner, index) => (
                <button
                  key={banner.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`px-3 py-2.5 text-left text-xs transition-all border-r last:border-r-0 border-[#E2E8F0] ${
                    currentIndex === index
                      ? "bg-[#FFFFFF] text-[#0063FD] font-bold border-b-2 border-b-[#0063FD]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <div className="truncate text-[11px] font-bold">{banner.title_vi}</div>
                  <div className="text-[10px] text-[#94A3B8] truncate">
                    {banner.subtitle_vi || banner.tag || "Khuyến mãi"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. SIDE PROMO CARDS (Responsive Multi-Device Layout with Animation Icons)  */}
      {/* ========================================================================= */}
      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 sm:gap-3">
        {/* Side Card 1: Custom PC Configurator */}
        <Link
          href="/build-pc"
          className="flex-1 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-3 sm:p-3.5 lg:p-4 shadow-xs hover:border-[#0063FD] hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-0.5 sm:space-y-1 pr-2">
            <span className="inline-block rounded bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black text-[#0063FD] uppercase">
              TỰ RÁP MÁY TÍNH
            </span>
            <h3 className="text-xs sm:text-sm font-black text-[#0F172A] group-hover:text-[#0063FD] transition-colors leading-snug">
              Xây Dựng Cấu Hình PC Theo Yêu Cầu
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#64748B] line-clamp-1 sm:line-clamp-2">
              Tự động kiểm tra tương thích socket, nguồn điện & vỏ case
            </p>
          </div>
          <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 lg:h-13 lg:w-13 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] p-1 group-hover:scale-105 transition-transform shadow-xs">
            <Image
              src="/animation-icon/pc-build.gif"
              alt="Build PC Animation"
              width={48}
              height={48}
              unoptimized
              className="object-contain h-full w-full"
            />
          </div>
        </Link>

        {/* Side Card 2: Genuine Warranty & Support */}
        <Link
          href="/bao-hanh"
          className="flex-1 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-3 sm:p-3.5 lg:p-4 shadow-xs hover:border-[#16A34A] hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-0.5 sm:space-y-1 pr-2">
            <span className="inline-block rounded bg-[#DCFCE7] border border-[#86EFAC] px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black text-[#15803D] uppercase">
              CAM KẾT 100%
            </span>
            <h3 className="text-xs sm:text-sm font-black text-[#0F172A] group-hover:text-[#16A34A] transition-colors leading-snug">
              Chính Sách Bảo Hành & Đổi Mới
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#64748B] line-clamp-1 sm:line-clamp-2">
              Bảo hành chính hãng 12 - 36 tháng, hỗ trợ kỹ thuật trọn đời
            </p>
          </div>
          <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 lg:h-13 lg:w-13 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-[#DCFCE7] border border-[#86EFAC] p-1 group-hover:scale-105 transition-transform shadow-xs">
            <Image
              src="/animation-icon/guarantee.gif"
              alt="Guarantee Animation"
              width={48}
              height={48}
              unoptimized
              className="object-contain h-full w-full"
            />
          </div>
        </Link>

        {/* Side Card 3: Hotline Support */}
        <Link
          href="/lien-he"
          className="flex-1 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-3 sm:p-3.5 lg:p-4 shadow-xs hover:border-[#14B8A6] hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="space-y-0.5 sm:space-y-1 pr-2">
            <span className="inline-block rounded bg-[#CCFBF1] border border-[#99F6E4] px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black text-[#0F766E] uppercase">
              TƯ VẤN TRỰC TIẾP
            </span>
            <h3 className="text-xs sm:text-sm font-black text-[#0F172A] group-hover:text-[#0D9488] transition-colors leading-snug">
              Hotline Tư Vấn: 1900 8888
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#64748B] line-clamp-1 sm:line-clamp-2">
              Hỗ trợ báo giá dự án, giải pháp gaming gear & doanh nghiệp
            </p>
          </div>
          <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 lg:h-13 lg:w-13 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] border border-[#99F6E4] p-1 group-hover:scale-105 transition-transform shadow-xs">
            <Image
              src="/animation-icon/hotline.gif"
              alt="Hotline Animation"
              width={48}
              height={48}
              unoptimized
              className="object-contain h-full w-full"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
