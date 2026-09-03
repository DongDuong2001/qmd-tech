import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { catalogService } from "@/modules/catalog/service";
import { adminService } from "@/modules/admin/service";
import { ProductCard } from "@/components/product/ProductCard";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Button } from "@/components/ui/button";
import {
  AsusRogLogo,
  NvidiaGeForceLogo,
  IntelCoreLogo,
  AmdRyzenLogo,
  MsiGamingLogo,
  GigabyteAorusLogo,
  CorsairSailsLogo,
  SamsungMemoryLogo,
  KingstonFuryLogo,
  NzxtOfficialLogo,
  LianLiOfficialLogo,
  WdBlackLogo,
} from "@/components/common/BrandLogos";
import {
  Cpu,
  CircuitBoard,
  MemoryStick,
  Layers,
  HardDrive,
  Zap,
  Box,
  Fan,
  Monitor,
  Gamepad2,
  Keyboard,
  Headphones,
  Flame,
  Sparkles,
  ArrowRight,
  Wrench,
  Award,
  Gift,
  CheckCircle2,
} from "lucide-react";

export default async function HomePage() {
  const categories = await catalogService.getCategories();
  const featuredProducts = await catalogService.getFeaturedProducts();
  const { products: allProducts } = await catalogService.getProducts();
  const banners = await adminService.getBanners();
  const prebuiltDeals = await adminService.getPrebuiltDeals();

  // 12 Horizontal Category Grid Items (Flat Solid Icons)
  const categoryNavItems = [
    { slug: "cpu", name: "CPU - Vi Xử Lý", icon: Cpu, count: "24+ SP" },
    { slug: "gpu", name: "VGA - Card Đồ Họa", icon: Layers, count: "18+ SP", hot: true },
    { slug: "motherboard", name: "Mainboard", icon: CircuitBoard, count: "30+ SP" },
    { slug: "ram", name: "RAM DDR4/DDR5", icon: MemoryStick, count: "45+ SP" },
    { slug: "storage", name: "SSD / HDD", icon: HardDrive, count: "35+ SP" },
    { slug: "psu", name: "Nguồn Máy Tính", icon: Zap, count: "20+ SP" },
    { slug: "case", name: "Vỏ Case Gaming", icon: Box, count: "28+ SP" },
    { slug: "cooling", name: "Tản Nhiệt AIO", icon: Fan, count: "22+ SP" },
    { slug: "monitor", name: "Màn Hình 240Hz", icon: Monitor, count: "15+ SP", hot: true },
    { slug: "prebuilt", name: "PC Ráp Sẵn", icon: Gamepad2, count: "40+ Cấu hình", hot: true },
    { slug: "gear", name: "Bàn Phím & Chuột", icon: Keyboard, count: "50+ SP" },
    { slug: "audio", name: "Tai Nghe & Ghế", icon: Headphones, count: "16+ SP" },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* ========================================================================= */}
      {/* 1. HORIZONTAL ICON-GRID CATEGORY NAV (10-12 Categories - Solid Flat Icons) */}
      {/* ========================================================================= */}
      <section className="border-b border-[#E2E8F0] bg-[#FFFFFF] py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {categoryNavItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.slug}
                  href={`/danh-muc/${item.slug === "prebuilt" || item.slug === "monitor" || item.slug === "gear" || item.slug === "audio" ? "cpu" : item.slug}`}
                  className="group relative flex flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-2.5 text-center transition-all duration-200 hover:border-[#E11D48] hover:bg-[#FFF1F2] shadow-xs"
                >
                  {item.hot && (
                    <span className="absolute -top-1.5 -right-1 rounded bg-[#E11D48] px-1 py-0.2 text-[8px] font-black text-white uppercase">
                      HOT
                    </span>
                  )}
                  <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#EA580C] group-hover:bg-[#E11D48] group-hover:text-white transition-colors border border-[#E2E8F0]">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#E11D48] transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[9px] font-mono text-[#64748B]">
                    {item.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC HERO CAROUSEL & PROMO SHOWCASE (Vietnamese PC Retailer Style) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <HeroCarousel banners={banners} />
      </section>

      {/* ========================================================================= */}
      {/* 3. FLASH SALE & FEATURED COMPONENTS SHOWCASE */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border-2 border-[#E11D48] bg-[#FFFFFF] p-6 shadow-sm space-y-6">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E11D48] text-white shadow-xs">
                <Flame className="h-6 w-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black uppercase tracking-wider text-[#0F172A]">
                    GIỜ VÀNG GIÁ SỐC
                  </h2>
                  <span className="rounded bg-[#E11D48] px-2 py-0.5 text-[10px] font-black text-white">
                    ĐANG DIỄN RA
                  </span>
                </div>
                <p className="text-xs text-[#B45309]">Số lượng có hạn • Tự động kết thúc khi hết hàng</p>
              </div>
            </div>

            <Link href="/khuyen-mai">
              <Button variant="primary" size="sm" className="gap-1 font-black text-xs">
                Xem Tất Cả Flash Sale <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Flash Sale Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                {/* Stock progress meter below each flash card */}
                <div className="mt-2 rounded-lg bg-white p-2 border border-[#E2E8F0]">
                  <div className="flex justify-between text-[10px] font-bold text-[#475569] mb-1">
                    <span className="text-[#E11D48] flex items-center gap-1">
                      <Flame className="h-3 w-3 fill-current" /> Đã bán 18/20
                    </span>
                    <span className="text-[#B45309]">Còn 2 suất</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                    <div className="h-full bg-[#E11D48] w-[90%]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PREBUILT PC DEALS (Managed via Admin Dashboard, Sorted by Priority) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-[#B45309] uppercase tracking-wider mb-1">
                <Award className="h-4 w-4 text-[#EA580C]" />
                Cấu hình tối ưu bởi kỹ sư QMD-Tech
              </div>
              <h2 className="text-2xl font-black uppercase text-[#0F172A]">
                CẤU HÌNH PC RÁP SẴN — ĐA DẠNG PHÂN KHÚC
              </h2>
            </div>
            <Link href="/build-pc">
              <Button variant="primary" size="sm" className="font-black text-xs gap-1.5">
                <Wrench className="h-3.5 w-3.5" />
                Tự Tùy Biến Cấu Hình
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prebuiltDeals.map((deal) => (
              <div
                key={deal.id}
                className="group flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 hover:border-[#E11D48] transition-all duration-200 shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded bg-[#E11D48] text-white px-2 py-0.5 text-[10px] font-black uppercase">
                      {deal.badge || "DEAL HOT"}
                    </span>
                    <span className="rounded bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] px-2 py-0.5 text-[10px] font-bold">
                      Sẵn Hàng
                    </span>
                  </div>

                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] mb-4">
                    <Image
                      src={deal.image_url}
                      alt={deal.name_vi}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-sm font-black text-[#0F172A] group-hover:text-[#E11D48] transition-colors line-clamp-2 leading-snug mb-3">
                    {deal.name_vi}
                  </h3>

                  {/* Spec List */}
                  <div className="space-y-1.5 mb-4 rounded-lg bg-[#F8FAFC] p-3 text-[11px] font-mono text-[#475569] border border-[#E2E8F0]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-[#16A34A] shrink-0" />
                      <span className="truncate">{deal.cpu}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-[#16A34A] shrink-0" />
                      <span className="truncate">{deal.vga}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-[#16A34A] shrink-0" />
                      <span className="truncate">{deal.ram}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-[#16A34A] shrink-0" />
                      <span className="truncate">{deal.ssd}</span>
                    </div>
                    {deal.psu && (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-[#16A34A] shrink-0" />
                        <span className="truncate">{deal.psu}</span>
                      </div>
                    )}
                  </div>

                  {/* Gift Tag */}
                  <div className="rounded bg-[#FFF1F2] border border-[#FECDD3] p-2 text-[11px] text-[#BE123C] flex items-center gap-1.5 mb-4 font-semibold">
                    <Gift className="h-3.5 w-3.5 text-[#E11D48] shrink-0" />
                    <span>Tặng kèm gói vệ sinh định kỳ + Lót chuột Gaming</span>
                  </div>
                </div>

                <div className="border-t border-[#E2E8F0] pt-3">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-xl font-black font-mono text-[#B45309]">
                        {new Intl.NumberFormat("vi-VN").format(deal.price_vnd)}₫
                      </div>
                      {deal.original_price_vnd && (
                        <div className="text-xs font-mono text-[#94A3B8] line-through">
                          {new Intl.NumberFormat("vi-VN").format(deal.original_price_vnd)}₫
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.5 rounded border border-[#86EFAC]">
                      Trả góp 0%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/build-pc" className="w-full">
                      <Button variant="secondary" size="sm" className="w-full text-xs font-bold">
                        Xem chi tiết
                      </Button>
                    </Link>
                    <Link href="/thanh-toan" className="w-full">
                      <Button variant="gold" size="sm" className="w-full text-xs font-black">
                        Mua ngay
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HARDWARE CATALOG BY CATEGORIES (Dense Grid) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#E11D48] uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              Linh kiện thế hệ mới
            </div>
            <h2 className="text-2xl font-black uppercase text-[#0F172A]">
              LINH KIỆN MÁY TÍNH CHÍNH HÃNG
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/danh-muc" className="rounded-lg bg-[#E11D48] px-3 py-1.5 font-bold text-white shadow-xs">
              Tất Cả
            </Link>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/danh-muc/${cat.slug}`}
                className="rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] px-3 py-1.5 font-semibold text-[#475569] hover:border-[#E11D48] hover:text-[#E11D48] transition-colors shadow-xs"
              >
                {cat.name_vi}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. OFFICIAL BRAND PARTNERS WITH AUTHENTIC VECTOR BADGES */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-8 shadow-xs text-center space-y-6">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-[#E11D48] mb-1">
              ĐỐI TÁC THƯƠNG HIỆU PHÂN PHỐI CHÍNH HÃNG
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
              Cam kết linh kiện chính hãng, nguyên seal, đầy đủ hóa đơn VAT và bảo hành theo nhà sản xuất
            </h3>
          </div>

          {/* Real Official Brand Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-2">
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#E11D48] hover:bg-[#FFFFFF] transition-all shadow-xs" title="ASUS Republic of Gamers">
              <AsusRogLogo />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#76B900] hover:bg-[#FFFFFF] transition-all shadow-xs" title="NVIDIA GeForce">
              <NvidiaGeForceLogo />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#0068B5] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Intel Core">
              <IntelCoreLogo />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#ED1C24] hover:bg-[#FFFFFF] transition-all shadow-xs" title="AMD Ryzen">
              <AmdRyzenLogo />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#E11D48] hover:bg-[#FFFFFF] transition-all shadow-xs" title="MSI True Gaming">
              <MsiGamingLogo />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#EA580C] hover:bg-[#FFFFFF] transition-all shadow-xs" title="GIGABYTE AORUS">
              <GigabyteAorusLogo />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#0F172A] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Corsair">
              <CorsairSailsLogo />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#1428A0] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Samsung Memory">
              <SamsungMemoryLogo />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#DC2626] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Kingston FURY">
              <KingstonFuryLogo />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#7C3AED] hover:bg-[#FFFFFF] transition-all shadow-xs" title="NZXT">
              <NzxtOfficialLogo />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#0F172A] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Lian Li">
              <LianLiOfficialLogo />
            </div>
            <div className="flex h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#0F172A] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Western Digital">
              <WdBlackLogo />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
