"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Flame, ArrowRight, Clock } from "lucide-react";

interface FlashSaleCountdownProps {
  title?: string;
  subtitle?: string;
  endTime?: string;
  isEnabled?: boolean;
}

export function FlashSaleCountdown({
  title = "GIỜ VÀNG GIÁ TỐT",
  subtitle = "Linh kiện chính hãng • Bảo hành 1 đổi 1 trong 30 ngày • Số lượng ưu đãi có hạn",
  endTime,
  isEnabled = true,
}: FlashSaleCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      let targetMs: number;
      if (endTime) {
        const parsed = new Date(endTime).getTime();
        targetMs = isNaN(parsed) ? Date.now() + 24 * 3600 * 1000 : parsed;
      } else {
        const now = new Date();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        targetMs = endOfDay.getTime();
      }

      const diff = targetMs - Date.now();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return { days, hours, minutes, seconds, isExpired: false };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const pad = (num: number) => String(num).padStart(2, "0");

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-3 sm:pb-4">
      {/* Title & Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white shadow-md shadow-red-500/20">
          <Flame className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-wider text-[#0F172A]">
              {title}
            </h2>
            <span className="inline-flex items-center gap-1 rounded bg-[#EF4444] px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-white shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              {timeLeft.isExpired ? "GIA HẠN ĐỢT MỚI" : "ĐANG DIỄN RA"}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Countdown Timer Block & CTA */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto sm:ml-0">
        {/* Countdown digits */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 shadow-2xs">
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#64748B] mr-1 hidden xs:flex">
            <Clock className="h-3.5 w-3.5 text-[#EF4444]" />
            <span>Kết thúc sau:</span>
          </div>

          {mounted ? (
            <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-black">
              {timeLeft.days > 0 && (
                <>
                  <div className="flex flex-col items-center">
                    <span className="rounded bg-[#0F172A] px-1.5 sm:px-2 py-0.5 text-white shadow-xs">
                      {pad(timeLeft.days)}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-sans font-bold text-[#64748B] mt-0.5">Ngày</span>
                  </div>
                  <span className="text-[#0F172A] font-bold pb-3">:</span>
                </>
              )}

              <div className="flex flex-col items-center">
                <span className="rounded bg-[#0F172A] px-1.5 sm:px-2 py-0.5 text-white shadow-xs">
                  {pad(timeLeft.hours)}
                </span>
                <span className="text-[8px] sm:text-[9px] font-sans font-bold text-[#64748B] mt-0.5">Giờ</span>
              </div>

              <span className="text-[#0F172A] font-bold pb-3">:</span>

              <div className="flex flex-col items-center">
                <span className="rounded bg-[#0F172A] px-1.5 sm:px-2 py-0.5 text-white shadow-xs">
                  {pad(timeLeft.minutes)}
                </span>
                <span className="text-[8px] sm:text-[9px] font-sans font-bold text-[#64748B] mt-0.5">Phút</span>
              </div>

              <span className="text-[#0F172A] font-bold pb-3">:</span>

              <div className="flex flex-col items-center">
                <span className="rounded bg-[#EF4444] px-1.5 sm:px-2 py-0.5 text-white shadow-xs">
                  {pad(timeLeft.seconds)}
                </span>
                <span className="text-[8px] sm:text-[9px] font-sans font-bold text-[#EF4444] mt-0.5">Giây</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-black text-[#94A3B8]">
              <span className="rounded bg-[#E2E8F0] px-2 py-0.5 text-transparent">00</span>:
              <span className="rounded bg-[#E2E8F0] px-2 py-0.5 text-transparent">00</span>:
              <span className="rounded bg-[#E2E8F0] px-2 py-0.5 text-transparent">00</span>
            </div>
          )}
        </div>

        {/* View All Button */}
        <Link href="/khuyen-mai">
          <Button variant="primary" size="sm" className="gap-1 font-black text-[11px] sm:text-xs">
            <span>Xem Tất Cả</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}