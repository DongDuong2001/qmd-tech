"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Search, ShoppingCart, Wrench, Menu, X, Cpu, Phone } from "lucide-react";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { ThemeToggle } from "../common/ThemeToggle";
import { Button } from "../ui/button";

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/danh-muc", label: t("nav.categories") },
    { href: "/build-pc", label: t("nav.builder"), highlight: true },
    { href: "/khuyen-mai", label: t("nav.deals") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/bao-hanh", label: t("nav.warranty") },
    { href: "/lien-he", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2A3040] bg-[#0B0E14]/95 backdrop-blur-md">
      {/* Top Banner */}
      <div className="border-b border-[#2A3040] bg-[#131722] px-4 py-1.5 text-xs text-[#9AA3B2]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#22C55E]" />
            <span className="text-[#F2F4F8] font-medium">{t("common.freeShippingBadge")}</span>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-[#3B82F6]" />
              Hotline: <strong className="text-[#F2F4F8]">1900 8888</strong>
            </span>
            <span>Showroom: Hà Nội & TP.HCM</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3B82F6] text-white shadow-sm">
            <Cpu className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-[#F2F4F8]">
              QMD<span className="text-[#3B82F6]">-TECH</span>
            </span>
            <span className="text-[10px] font-medium tracking-widest text-[#9AA3B2] uppercase">
              PC & Hardware Rig
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="w-full rounded-lg border border-[#2A3040] bg-[#131722] py-2 pl-10 pr-4 text-sm text-[#F2F4F8] placeholder-[#9AA3B2] focus:border-[#3B82F6] focus:outline-none transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9AA3B2]" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Custom PC Builder CTA */}
          <Link href="/build-pc" className="hidden lg:inline-flex">
            <Button variant="accent" size="sm" className="gap-1.5 font-semibold">
              <Wrench className="h-4 w-4" />
              {t("nav.builder")}
            </Button>
          </Link>

          <LanguageSwitcher />
          <ThemeToggle />

          {/* Cart */}
          <Link href="/gio-hang">
            <Button
              variant="secondary"
              size="icon"
              className="relative h-9 w-9"
              aria-label={t("common.cart")}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#3B82F6] text-[10px] font-bold text-white">
                0
              </span>
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-[#9AA3B2] hover:bg-[#1B2030] hover:text-[#F2F4F8]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <nav className="hidden md:block border-t border-[#2A3040]/60 bg-[#131722]/50 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto py-2.5 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap transition-colors ${
                link.highlight
                  ? "text-[#7C3AED] hover:text-[#A78BFA] font-semibold flex items-center gap-1"
                  : "text-[#9AA3B2] hover:text-[#F2F4F8]"
              }`}
            >
              {link.highlight && <Wrench className="h-3.5 w-3.5" />}
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2A3040] bg-[#131722] px-4 py-4 space-y-3">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder={t("common.searchPlaceholder")}
              className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] py-2 pl-10 pr-4 text-sm text-[#F2F4F8]"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9AA3B2]" />
          </div>
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  link.highlight
                    ? "bg-[#7C3AED]/20 text-[#A78BFA]"
                    : "text-[#F2F4F8] hover:bg-[#1B2030]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
