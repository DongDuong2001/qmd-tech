"use client";

import React from "react";
import styles from "./TechLoader.module.css";

interface TechLoaderProps {
  label?: string;
  sublabel?: string;
  compact?: boolean;
}

export function TechLoader({
  label = "QMD-TECH",
  sublabel = "Đang tải dữ liệu...",
  compact = false,
}: TechLoaderProps) {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader} />
      {!compact && (
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-black tracking-widest text-[#0F172A] uppercase">
            {label}
          </span>
          {sublabel && (
            <span className="mt-1 text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0063FD] animate-pulse" />
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
