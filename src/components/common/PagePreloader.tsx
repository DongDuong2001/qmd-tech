"use client";

import React, { useState, useEffect } from "react";
import { TechLoader } from "./TechLoader";

export function PagePreloader() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Smooth transition timing: 700ms display, then 300ms fadeout
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 650);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 950);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#F8FAFC]/95 backdrop-blur-xs transition-opacity duration-300 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-live="polite"
      aria-busy={!isFadingOut}
    >
      <TechLoader
        label="QMD-TECH"
        sublabel="Hệ thống linh kiện máy tính chuyên nghiệp"
      />
    </div>
  );
}
