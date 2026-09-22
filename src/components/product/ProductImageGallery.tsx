"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const activeImage = images[selectedIndex] || images[0];

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#E4E7EC] bg-[#FFFFFF] shadow-xs flex items-center justify-center text-sm text-[#94A3B8]">
        Chưa có hình ảnh sản phẩm
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image Preview */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-[#E4E7EC] bg-[#FFFFFF] shadow-xs">
        <Image
          src={activeImage}
          alt={`${productName} - Ảnh ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={selectedIndex === 0}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-mono font-medium text-white backdrop-blur-xs">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row (Only if multiple images) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-all ${
                  isActive
                    ? "border-[#0063FD] ring-2 ring-[#0063FD]/30 shadow-xs"
                    : "border-[#E2E8F0] opacity-70 hover:opacity-100 hover:border-[#94A3B8]"
                }`}
                aria-label={`Xem ảnh ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
