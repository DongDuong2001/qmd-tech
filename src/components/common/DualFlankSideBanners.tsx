"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { EventBanner } from "@/shared/types";
import { X, ExternalLink } from "lucide-react";

interface DualFlankSideBannersProps {
  banners: EventBanner[];
}

export function DualFlankSideBanners({ banners }: DualFlankSideBannersProps) {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  const leftBanner = banners.find(
    (b) => b.is_active && b.position === "side_left"
  );
  const rightBanner = banners.find(
    (b) => b.is_active && b.position === "side_right"
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. LEFT FLANK VERTICAL BANNER                                              */}
      {/* ========================================================================= */}
      {showLeft && leftBanner && (
        <aside
          aria-label="Banner quảng cáo cạnh trái"
          className="hidden xl:block fixed top-36 left-2 2xl:left-6 z-30 w-[125px] 2xl:w-[145px] transition-all duration-300 group"
        >
          <div className="relative rounded-xl border border-[#CBD5E1] bg-white p-1 shadow-lg hover:border-[#0063FD] hover:shadow-xl transition-all">
            {/* Dismiss Button */}
            <button
              onClick={() => setShowLeft(false)}
              className="absolute -top-2.5 -right-2.5 z-40 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F172A] text-white hover:bg-[#EF4444] transition-colors shadow-md cursor-pointer"
              title="Đóng banner này"
              aria-label="Đóng banner trái"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Clickable Banner Image & Link */}
            <Link
              href={leftBanner.target_url || "/build-pc"}
              className="relative block aspect-[1/3] w-full overflow-hidden rounded-lg bg-[#0F172A]"
            >
              <Image
                src={leftBanner.image_url}
                alt={leftBanner.title_vi}
                fill
                sizes="150px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Gradient & Title overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2.5 text-center">
                {leftBanner.tag && (
                  <span className="inline-block self-center rounded bg-[#0063FD] px-1.5 py-0.5 text-[9px] font-black uppercase text-white mb-1 shadow-xs">
                    {leftBanner.tag}
                  </span>
                )}
                <span className="text-[11px] font-black text-white leading-tight line-clamp-2">
                  {leftBanner.title_vi}
                </span>
                {leftBanner.subtitle_vi && (
                  <span className="text-[9px] text-[#94A3B8] line-clamp-1 mt-0.5">
                    {leftBanner.subtitle_vi}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* 2. RIGHT FLANK VERTICAL BANNER                                             */}
      {/* ========================================================================= */}
      {showRight && rightBanner && (
        <aside
          aria-label="Banner quảng cáo cạnh phải"
          className="hidden xl:block fixed top-36 right-2 2xl:right-6 z-30 w-[125px] 2xl:w-[145px] transition-all duration-300 group"
        >
          <div className="relative rounded-xl border border-[#CBD5E1] bg-white p-1 shadow-lg hover:border-[#0063FD] hover:shadow-xl transition-all">
            {/* Dismiss Button */}
            <button
              onClick={() => setShowRight(false)}
              className="absolute -top-2.5 -left-2.5 z-40 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F172A] text-white hover:bg-[#EF4444] transition-colors shadow-md cursor-pointer"
              title="Đóng banner này"
              aria-label="Đóng banner phải"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Clickable Banner Image & Link */}
            <Link
              href={rightBanner.target_url || "/lien-he"}
              className="relative block aspect-[1/3] w-full overflow-hidden rounded-lg bg-[#0F172A]"
            >
              <Image
                src={rightBanner.image_url}
                alt={rightBanner.title_vi}
                fill
                sizes="150px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Gradient & Title overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2.5 text-center">
                {rightBanner.tag && (
                  <span className="inline-block self-center rounded bg-[#16A34A] px-1.5 py-0.5 text-[9px] font-black uppercase text-white mb-1 shadow-xs">
                    {rightBanner.tag}
                  </span>
                )}
                <span className="text-[11px] font-black text-white leading-tight line-clamp-2">
                  {rightBanner.title_vi}
                </span>
                {rightBanner.subtitle_vi && (
                  <span className="text-[9px] text-[#94A3B8] line-clamp-1 mt-0.5">
                    {rightBanner.subtitle_vi}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </aside>
      )}
    </>
  );
}
