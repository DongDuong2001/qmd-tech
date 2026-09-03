"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { EventBanner } from "@/shared/types";
import {
  ChevronLeft,
  ChevronRight,
  Wrench,
  ShieldCheck,
  Headphones,
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
      {/* 1. MAIN EVENT POSTER CAROUSEL (Full Artwork View - Vietnamese Retailer) */}
      {/* ========================================================================= */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="lg:col-span-8 relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs"
      >
        {/* Full-bleed Clickable Event Banner Poster Area */}
        <Link
          href={currentBanner?.target_url || "/danh-muc"}
          className="relative block h-72 sm:h-84 md:h-96 w-full overflow-hidden bg-[#F8FAFC] group cursor-pointer"
        >
          {currentBanner && (
            <Image
              src={currentBanner.image_url}
              alt={currentBanner.title_vi}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-all duration-700 ease-in-out group-hover:scale-[1.02]"
            />
          )}

          {/* Subtle Tag Badge on Top-Left */}
          {currentBanner?.tag && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center rounded-lg bg-[#0063FD] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md">
                {currentBanner.tag}
              </span>
            </div>
          )}

          {/* Slide Progress Dots (Bottom-Right of Banner) */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-xs px-2.5 py-1">
              {activeBanners.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === idx ? "w-5 bg-[#0063FD]" : "w-1.5 bg-white/70"
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
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0F172A] hover:bg-white hover:text-[#0063FD] transition-all shadow-md"
              aria-label="Slide trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0F172A] hover:bg-white hover:text-[#0063FD] transition-all shadow-md"
              aria-label="Slide tiếp theo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Event Tabs Navigation in Clean Light Theme */}
        {activeBanners.length > 1 && (
          <div className="grid grid-cols-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
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
                <div className="text-[10px] text-[#94A3B8] truncate">{banner.subtitle_vi || banner.tag || "Khuyến mãi"}</div>
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
