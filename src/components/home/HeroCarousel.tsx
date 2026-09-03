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
      {/* 1. MAIN CAROUSEL SLIDER (High-Contrast & Crystal-Clear Readability) */}
      {/* ========================================================================= */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="lg:col-span-8 relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#0F172A] shadow-xs"
      >
        {/* Main Banner Image & Content Area */}
        <div className="relative h-72 sm:h-84 md:h-96 w-full overflow-hidden">
          {currentBanner && (
            <Image
              src={currentBanner.image_url}
              alt={currentBanner.title_vi}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover opacity-80 transition-all duration-700 ease-in-out"
            />
          )}

          {/* Strong Gradient Scrim to ensure 100% text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/85 via-[#0F172A]/40 to-transparent" />

          {/* High-Contrast Frosted Text Box */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <div className="max-w-xl space-y-2.5 rounded-xl bg-[#0F172A]/80 backdrop-blur-md p-4 sm:p-5 border border-white/15 shadow-xl text-white">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0063FD] px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{currentBanner?.tag || "SỰ KIỆN NỔI BẬT"}</span>
              </div>

              <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase text-white tracking-tight leading-tight drop-shadow-md">
                {currentBanner?.title_vi}
              </h2>

              {currentBanner?.subtitle_vi && (
                <p className="text-xs sm:text-sm text-[#E2E8F0] line-clamp-2 leading-relaxed">
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
          </div>

          {/* Left / Right Slide Arrow Controls */}
          {activeBanners.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0F172A] hover:bg-white hover:text-[#0063FD] transition-all shadow-lg z-10"
                aria-label="Slide trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0F172A] hover:bg-white hover:text-[#0063FD] transition-all shadow-lg z-10"
                aria-label="Slide tiếp theo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Carousel Preview Tabs (Bottom Navigation in Electric Blue Theme) */}
        {activeBanners.length > 1 && (
          <div className="grid grid-cols-3 border-t border-[#1E293B] bg-[#0F172A]">
            {activeBanners.map((banner, index) => (
              <button
                key={banner.id}
                onClick={() => setCurrentIndex(index)}
                className={`px-3 py-2.5 text-left text-xs transition-all border-r last:border-r-0 border-[#1E293B] ${
                  currentIndex === index
                    ? "bg-[#1E293B] text-[#38BDF8] font-bold border-b-2 border-b-[#0063FD]"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60"
                }`}
              >
                <div className="truncate text-[11px] font-bold">{banner.title_vi}</div>
                <div className="text-[10px] text-[#64748B] truncate">{banner.tag || "Khuyến mãi"}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. SIDE PROMO CARDS (Light Theme with Logo Electric Blue & Cyan Palette) */}
      {/* ========================================================================= */}
      <div className="lg:col-span-4 flex flex-col justify-between gap-3">
        {/* Side Card 1: Custom PC Configurator */}
        <Link
          href="/build-pc"
          className="flex-1 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-xs hover:border-[#0063FD] transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[10px] font-black text-[#0063FD] uppercase">
              TỰ RÁP MÁY TÍNH
            </span>
            <h3 className="text-sm font-black text-[#0F172A] group-hover:text-[#0063FD] transition-colors">
              Xây Dựng Cấu Hình PC Theo Yêu Cầu
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Tự động kiểm tra độ tương thích socket, nguồn điện & vỏ case
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#0063FD] group-hover:bg-[#0063FD] group-hover:text-white transition-all ml-3">
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
          className="flex-1 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-xs hover:border-[#0284C7] transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="rounded bg-[#E0F2FE] border border-[#BAE6FD] px-2 py-0.5 text-[10px] font-black text-[#0284C7] uppercase">
              TƯ VẤN TRỰC TIẾP
            </span>
            <h3 className="text-sm font-black text-[#0F172A] group-hover:text-[#0284C7] transition-colors">
              Hotline Tư Vấn: 1900 8888
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Hỗ trợ báo giá dự án, giải pháp gaming gear & doanh nghiệp
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white transition-all ml-3">
            <Headphones className="h-5 w-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
