"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const isLightMode = document.documentElement.classList.contains("light");
    setIsLight(isLightMode);
  }, []);

  const toggleTheme = () => {
    const nextIsLight = !isLight;
    setIsLight(nextIsLight);
    if (nextIsLight) {
      document.documentElement.classList.add("light");
      document.cookie = "qmd_theme=light; path=/; max-age=31536000; SameSite=Lax";
    } else {
      document.documentElement.classList.remove("light");
      document.cookie = "qmd_theme=dark; path=/; max-age=31536000; SameSite=Lax";
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A3040] bg-[#131722] text-[#F2F4F8] hover:bg-[#1B2030] hover:text-[#3B82F6] hover:border-[#3B82F6] transition-colors"
      title={isLight ? "Chuyen sang Dark Mode" : "Switch to Light Mode"}
      aria-label="Toggle theme"
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
