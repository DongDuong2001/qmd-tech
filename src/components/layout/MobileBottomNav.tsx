"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useCart } from "@/shared/context/CartContext";
import { HugeIcon } from "@/components/ui/HugeIcon";
import {
  Home01Icon,
  DashboardSquare01Icon,
  Wrench01Icon,
  ShoppingCart01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

export function MobileBottomNav() {
  const pathname = usePathname() || "";
  const { cartCount } = useCart();

  // Hide on admin backoffice routes
  if (pathname.includes("/admin")) {
    return null;
  }

  const isHome = pathname === "/" || pathname === "/vi" || pathname === "/en";
  const isCatalog = pathname.includes("/danh-muc");
  const isBuilder = pathname.includes("/build-pc");
  const isCart = pathname.includes("/gio-hang");
  const isAccount = pathname.includes("/tai-khoan");

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-[#E2E8F0] bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="grid grid-cols-5 items-center h-14 px-1">
        {/* 1. Trang chu */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${
            isHome ? "text-[#0063FD] font-bold" : "text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          <HugeIcon
            icon={Home01Icon}
            className={`h-5 w-5 ${isHome ? "text-[#0063FD]" : "text-[#64748B]"}`}
          />
          <span className="text-[10px] tracking-tight">Trang chủ</span>
        </Link>

        {/* 2. Danh muc */}
        <Link
          href="/danh-muc"
          className={`flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${
            isCatalog ? "text-[#0063FD] font-bold" : "text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          <HugeIcon
            icon={DashboardSquare01Icon}
            className={`h-5 w-5 ${isCatalog ? "text-[#0063FD]" : "text-[#64748B]"}`}
          />
          <span className="text-[10px] tracking-tight">Danh mục</span>
        </Link>

        {/* 3. Build PC (Prominent Hero CTA) */}
        <Link
          href="/build-pc"
          className="flex flex-col items-center justify-center gap-0.5 h-full relative -top-1"
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-transform active:scale-95 ${
              isBuilder
                ? "bg-[#0052D4] ring-2 ring-[#0063FD]/30"
                : "bg-[#0063FD] hover:bg-[#0052D4]"
            }`}
          >
            <HugeIcon icon={Wrench01Icon} className="h-5 w-5 text-white" />
          </div>
          <span
            className={`text-[10px] tracking-tight font-bold ${
              isBuilder ? "text-[#0063FD]" : "text-[#0F172A]"
            }`}
          >
            Build PC
          </span>
        </Link>

        {/* 4. Gio hang with Badge */}
        <Link
          href="/gio-hang"
          className={`flex flex-col items-center justify-center gap-0.5 h-full relative transition-colors ${
            isCart ? "text-[#0063FD] font-bold" : "text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          <div className="relative">
            <HugeIcon
              icon={ShoppingCart01Icon}
              className={`h-5 w-5 ${isCart ? "text-[#0063FD]" : "text-[#64748B]"}`}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[9px] font-black text-white shadow-xs animate-in zoom-in-50">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Giỏ hàng</span>
        </Link>

        {/* 5. Tai khoan */}
        <Link
          href="/tai-khoan"
          className={`flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${
            isAccount ? "text-[#0063FD] font-bold" : "text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          <HugeIcon
            icon={UserIcon}
            className={`h-5 w-5 ${isAccount ? "text-[#0063FD]" : "text-[#64748B]"}`}
          />
          <span className="text-[10px] tracking-tight">Tài khoản</span>
        </Link>
      </div>
    </nav>
  );
}
