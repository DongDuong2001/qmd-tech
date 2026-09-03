"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { EventBanner } from "@/shared/types";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

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
      {/* 1. MAIN EVENT POSTER CAROUSEL (Full-Bleed Responsive Poster Presentation) */}
      {/* ========================================================================= */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="lg:col-span-8 relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs group"
      >
        {/* Full-bleed Clickable Event Banner Poster Area */}
        <Link
          href={currentBanner?.target_url || "/danh-muc"}
          className="relative block aspect-[16/9] sm:aspect-[21/9] lg:aspect-auto lg:h-[390px] w-full overflow-hidden bg-[#0F172A] cursor-pointer"
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
            <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 z-10">
              <span className="inline-flex items-center rounded-md sm:rounded-lg bg-[#0063FD] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-white shadow-md">
                {currentBanner.tag}
              </span>
            </div>
          )}

          {/* Slide Progress Dots (Centered at Bottom of Poster) */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-xs px-2.5 py-1">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === idx ? "w-5 bg-[#0063FD]" : "w-1.5 bg-white/70 hover:bg-white"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
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
              className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-[#0F172A] hover:bg-white hover:text-[#0063FD] transition-all shadow-md opacity-80 group-hover:opacity-100"
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
              className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-[#0F172A] hover:bg-white hover:text-[#0063FD] transition-all shadow-md opacity-80 group-hover:opacity-100"
              aria-label="Slide tiếp theo"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. SIDE PROMO CARDS (Responsive Multi-Device Layout with Animation Icons)  */}
      {/* ========================================================================= */}
      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 sm:gap-3">
        {/* Side Card 1: Custom PC Configurator */}
        <Link
          href="/build-pc"
          className="group relative flex items-center justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-3 sm:p-3.5 lg:p-4 transition-all duration-200 hover:border-[#0063FD] hover:bg-[#EFF6FF] shadow-xs"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0 pr-2">
            <span className="inline-flex items-center rounded-md bg-[#0063FD] px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-white tracking-wider">
              Tùy biến PC
            </span>
            <h3 className="text-xs sm:text-sm font-black text-[#0F172A] group-hover:text-[#0063FD] transition-colors truncate">
              Xây Dựng Cấu Hình PC
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#64748B] line-clamp-1">
              Kiểm tra tương thích chân socket & nguồn tự động
            </p>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#0063FD] pt-0.5">
              <span>Bắt đầu lắp ráp</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Animated GIF Icon: PC Building Tool */}
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-13 lg:w-13 shrink-0 overflow-hidden rounded-xl border border-[#BFDBFE] bg-white p-1 shadow-xs">
            <Image
              src="/animation-icon/pc-build.gif"
              alt="Build PC Animation"
              fill
              unoptimized
              sizes="52px"
              className="object-contain"
            />
          </div>
        </Link>

        {/* Side Card 2: 100% Genuine Warranty & Fast Delivery */}
        <Link
          href="/bao-hanh"
          className="group relative flex items-center justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-3 sm:p-3.5 lg:p-4 transition-all duration-200 hover:border-[#0063FD] hover:bg-[#EFF6FF] shadow-xs"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0 pr-2">
            <span className="inline-flex items-center rounded-md bg-[#0F172A] px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-white tracking-wider">
              Cam kết dịch vụ
            </span>
            <h3 className="text-xs sm:text-sm font-black text-[#0F172A] group-hover:text-[#0063FD] transition-colors truncate">
              Chính Hãng & Bảo Hành
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#64748B] line-clamp-1">
              Đổi mới 30 ngày • Bảo hành tận nơi tại 3 miền
            </p>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#0063FD] pt-0.5">
              <span>Chính sách chi tiết</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Animated GIF Icon: Guarantee Seal */}
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-13 lg:w-13 shrink-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-1 shadow-xs">
            <Image
              src="/animation-icon/guarantee.gif"
              alt="Guarantee Seal Animation"
              fill
              unoptimized
              sizes="52px"
              className="object-contain"
            />
          </div>
        </Link>

        {/* Side Card 3: 24/7 Hotline Support */}
        <Link
          href="/lien-he"
          className="group relative flex items-center justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-[#99F6E4] bg-[#F0FDFA] p-3 sm:p-3.5 lg:p-4 transition-all duration-200 hover:border-[#0D9488] hover:bg-[#CCFBF1]/50 shadow-xs"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0 pr-2">
            <span className="inline-flex items-center rounded-md bg-[#0D9488] px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-white tracking-wider">
              Tư vấn trực tiếp
            </span>
            <h3 className="text-xs sm:text-sm font-black text-[#0F766E] group-hover:text-[#0D9488] transition-colors truncate">
              Hotline 1900.8888 (24/7)
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#0F766E]/80 line-clamp-1">
              Kỹ sư phần cứng hỗ trợ cấu hình & kỹ thuật
            </p>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#0D9488] pt-0.5">
              <span>Liên hệ ngay</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Animated GIF Icon: Hotline Support */}
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-13 lg:w-13 shrink-0 overflow-hidden rounded-xl border border-[#99F6E4] bg-white p-1 shadow-xs">
            <Image
              src="/animation-icon/hotline.gif"
              alt="Hotline Support Animation"
              fill
              unoptimized
              sizes="52px"
              className="object-contain"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
