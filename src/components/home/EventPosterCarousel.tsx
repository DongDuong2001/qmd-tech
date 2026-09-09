"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { EventBanner } from "@/shared/types";
import { ChevronLeft, ChevronRight, Tag, ArrowRight } from "lucide-react";

interface EventPosterCarouselProps {
  banners: EventBanner[];
}

export function EventPosterCarousel({ banners }: EventPosterCarouselProps) {
  const activeBanners = banners.filter((b) => b.is_active && b.position === "middle_carousel");
  const displayBanners = activeBanners.length > 0 ? activeBanners : banners.filter((b) => b.is_active);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch and drag swipe state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);

  const nextSlide = useCallback(() => {
    if (displayBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
  }, [displayBanners.length]);

  const prevSlide = useCallback(() => {
    if (displayBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
  }, [displayBanners.length]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused || displayBanners.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, displayBanners.length, nextSlide]);

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (displayBanners.length === 0) {
    return null;
  }

  const current = displayBanners[currentIndex] || displayBanners[0];

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-6">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-xs space-y-4">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0063FD] text-white shadow-xs">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black uppercase tracking-wider text-[#0F172A]">
                  SỰ KIỆN & CHƯƠNG TRÌNH KHUYẾN MÃI
                </h2>
                <span className="rounded bg-[#0063FD] px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-white uppercase">
                  QMD HOT DEAL
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#64748B]">
                Cập nhật liên tục các chiến dịch quà tặng, nâng cấp phần cứng và ưu đãi độc quyền
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          {displayBanners.length > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:border-[#0063FD] hover:text-[#0063FD] transition-colors shadow-2xs cursor-pointer"
                aria-label="Poster trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:border-[#0063FD] hover:text-[#0063FD] transition-colors shadow-2xs cursor-pointer"
                aria-label="Poster kế tiếp"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container (Swipeable & Draggable) */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            if (isDragging.current) handleMouseUp();
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative overflow-hidden rounded-xl bg-[#0F172A] select-none cursor-grab active:cursor-grabbing group"
        >
          <Link
            href={current.target_url || "/khuyen-mai"}
            className="relative block aspect-[21/9] sm:aspect-[24/9] md:aspect-[28/9] min-h-[190px] sm:min-h-[240px] md:min-h-[280px] w-full overflow-hidden"
          >
            {/* Background Poster Image */}
            <Image
              src={current.image_url}
              alt={current.title_vi}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />

            {/* Ambient Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-10 flex flex-col justify-center p-5 sm:p-8 md:p-10 max-w-2xl">
              {current.tag && (
                <div className="mb-2">
                  <span className="inline-block rounded-md bg-[#0063FD] px-2.5 py-0.5 text-[10px] sm:text-xs font-black uppercase text-white shadow-xs">
                    {current.tag}
                  </span>
                </div>
              )}

              <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md mb-1.5 sm:mb-2 line-clamp-2">
                {current.title_vi}
              </h3>

              {current.subtitle_vi && (
                <p className="text-xs sm:text-sm text-[#CBD5E1] line-clamp-2 max-w-xl mb-3 sm:mb-4">
                  {current.subtitle_vi}
                </p>
              )}

              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-xs px-3.5 py-1.5 rounded-lg w-fit border border-white/20 transition-all">
                <span>Khám phá ngay</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>

          {/* Slide Indicator Dots */}
          {displayBanners.length > 1 && (
            <div className="absolute bottom-3 right-4 z-20 flex items-center rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5">
              {displayBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className="p-2 flex items-center justify-center cursor-pointer"
                  aria-label={`Chuyển đến poster ${idx + 1}`}
                >
                  <span
                    className={`h-1.5 rounded-full transition-all block ${
                      currentIndex === idx ? "w-6 bg-[#0063FD]" : "w-1.5 bg-white/60 hover:bg-white"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
