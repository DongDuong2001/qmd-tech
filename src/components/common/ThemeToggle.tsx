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
      localStorage.setItem("qmd_theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("qmd_theme", "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A3040] bg-[#131722] text-[#F2F4F8] hover:bg-[#1B2030] hover:text-[#3B82F6] hover:border-[#3B82F6] transition-colors"
      title={isLight ? "Chuyển sang Dark Mode" : "Switch to Light Mode"}
      aria-label="Toggle theme"
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
