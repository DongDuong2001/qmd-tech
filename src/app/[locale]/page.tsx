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
  ArrowRight,
  Wrench,
  Award,
  Gift,
  CheckCircle2,
  Tag,
} from "lucide-react";

export default async function HomePage() {
  const categories = await catalogService.getCategories();
  const featuredProducts = await catalogService.getFeaturedProducts();
  const { products: allProducts } = await catalogService.getProducts();
  const banners = await adminService.getBanners();
  const prebuiltDeals = await adminService.getPrebuiltDeals();

  // Dynamic real count calculator per category
  const getCategoryProductCount = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return 0;
    return allProducts.filter((p) => p.category_id === cat.id).length;
  };

  // 12 Category Nav Items (Swipeable on Mobile, Grid on Tablet/Desktop)
  const categoryNavItems = [
    { slug: "cpu", name: "CPU - Vi Xử Lý", icon: Cpu },
    { slug: "gpu", name: "VGA - Card Đồ Họa", icon: Layers, hot: true },
    { slug: "motherboard", name: "Mainboard", icon: CircuitBoard },
    { slug: "ram", name: "RAM DDR4/DDR5", icon: MemoryStick },
    { slug: "storage", name: "SSD / HDD", icon: HardDrive },
    { slug: "psu", name: "Nguồn Máy Tính", icon: Zap },
    { slug: "case", name: "Vỏ Case Gaming", icon: Box },
    { slug: "cooling", name: "Tản Nhiệt AIO", icon: Fan },
    { slug: "monitor", name: "Màn Hình 240Hz", icon: Monitor, hot: true },
    { slug: "prebuilt", name: "PC Ráp Sẵn", icon: Gamepad2, hot: true },
    { slug: "gear", name: "Bàn Phím & Chuột", icon: Keyboard },
    { slug: "audio", name: "Tai Nghe & Ghế", icon: Headphones },
  ];

  return (
    <div className="space-y-6 sm:space-y-10 pb-16">
      {/* ========================================================================= */}
      {/* 1. HORIZONTAL CATEGORY NAV (Swipeable on Mobile, 12-Grid on Desktop)       */}
      {/* ========================================================================= */}
      <section className="border-b border-[#E2E8F0] bg-[#FFFFFF] py-3 sm:py-4">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
            {categoryNavItems.map((item) => {
              const IconComponent = item.icon;
              const count = getCategoryProductCount(item.slug);
              return (
                <Link
                  key={item.slug}
                  href={`/danh-muc/${item.slug === "prebuilt" || item.slug === "monitor" || item.slug === "gear" || item.slug === "audio" ? "cpu" : item.slug}`}
                  className="group relative shrink-0 w-23 sm:w-auto flex flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-2 sm:p-2.5 text-center transition-all duration-200 hover:border-[#0063FD] hover:bg-[#EFF6FF] shadow-xs"
                >
                  {item.hot && (
                    <span className="absolute -top-1.5 -right-1 rounded bg-[#0063FD] px-1 py-0.2 text-[7.5px] sm:text-[8px] font-black text-white uppercase">
                      HOT
                    </span>
                  )}
                  <div className="mb-1 sm:mb-1.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0063FD] group-hover:bg-[#0063FD] group-hover:text-white transition-colors border border-[#E2E8F0]">
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#0063FD] transition-colors">
                    {item.name}
                  </span>
                  {count > 0 && (
                    <span className="text-[8.5px] sm:text-[9px] font-mono text-[#0063FD] font-semibold">
                      {count} SP
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC HERO CAROUSEL & PROMO SHOWCASE (Vietnamese Retailer Layout) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <HeroCarousel banners={banners} />
      </section>

      {/* ========================================================================= */}
      {/* 3. FLASH SALE & FEATURED COMPONENTS SHOWCASE (Responsive 2-Col on Mobile)  */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="rounded-xl sm:rounded-2xl border-2 border-[#0063FD] bg-[#FFFFFF] p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3 sm:pb-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#0063FD] text-white shadow-xs">
                <Tag className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-2xl font-black uppercase tracking-wider text-[#0F172A]">
                    GIỜ VÀNG GIÁ TỐT
                  </h2>
                  <span className="rounded bg-[#0063FD] px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-white">
                    ĐANG DIỄN RA
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#64748B]">Linh kiện chính hãng • Bảo hành 1 đổi 1 trong 30 ngày</p>
              </div>
            </div>

            <Link href="/khuyen-mai">
              <Button variant="primary" size="sm" className="gap-1 font-black text-[11px] sm:text-xs">
                Xem Tất Cả <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Flash Sale Product Cards Grid (2 cols on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="relative flex flex-col justify-between">
                <ProductCard product={product} />
                {/* Real Inventory Stock Badge */}
                <div className="mt-1.5 sm:mt-2 rounded-lg bg-white p-1.5 sm:p-2 border border-[#E2E8F0]">
                  <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-[#475569]">
                    <span className="text-[#0063FD] flex items-center gap-1 font-mono">
                      Tồn kho thực tế
                    </span>
                    <span className="text-[#0F172A] font-semibold">
                      {product.stock > 0 ? `${product.stock} sản phẩm` : "Tạm hết"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PREBUILT PC DEALS (Managed via Admin Dashboard, Electric Blue Accents) */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 sm:p-6 lg:p-8 shadow-xs space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3 sm:pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-[#0063FD] uppercase tracking-wider mb-0.5 sm:mb-1">
                <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Cấu hình tối ưu bởi kỹ sư QMD-Tech
              </div>
              <h2 className="text-lg sm:text-2xl font-black uppercase text-[#0F172A]">
                CẤU HÌNH PC RÁP SẴN — ĐA DẠNG PHÂN KHÚC
              </h2>
            </div>
            <Link href="/build-pc">
              <Button variant="primary" size="sm" className="font-black text-[11px] sm:text-xs gap-1.5">
                <Wrench className="h-3.5 w-3.5" />
                Tự Tùy Biến Cấu Hình
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {prebuiltDeals.map((deal) => (
              <div
                key={deal.id}
                className="group flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 sm:p-5 hover:border-[#0063FD] transition-all duration-200 shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <span className="rounded bg-[#0063FD] text-white px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase">
                      {deal.badge || "DEAL HOT"}
                    </span>
                    <span className="rounded bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] px-2 py-0.5 text-[9px] sm:text-[10px] font-bold">
                      Sẵn Hàng
                    </span>
                  </div>

                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] mb-3 sm:mb-4">
                    <Image
                      src={deal.image_url}
                      alt={deal.name_vi}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-xs sm:text-sm font-black text-[#0F172A] group-hover:text-[#0063FD] transition-colors line-clamp-2 leading-snug mb-2.5 sm:mb-3">
                    {deal.name_vi}
                  </h3>

                  {/* Spec List */}
                  <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 rounded-lg bg-[#F8FAFC] p-2.5 sm:p-3 text-[10px] sm:text-[11px] font-mono text-[#475569] border border-[#E2E8F0]">
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
                  <div className="rounded bg-[#EFF6FF] border border-[#BFDBFE] p-1.5 sm:p-2 text-[10px] sm:text-[11px] text-[#0063FD] flex items-center gap-1.5 mb-3 sm:mb-4 font-semibold">
                    <Gift className="h-3.5 w-3.5 text-[#0063FD] shrink-0" />
                    <span className="truncate">Tặng kèm gói vệ sinh + Lót chuột Gaming</span>
                  </div>
                </div>

                <div className="border-t border-[#E2E8F0] pt-2.5 sm:pt-3">
                  <div className="flex items-baseline justify-between mb-2.5 sm:mb-3">
                    <div>
                      <div className="text-lg sm:text-xl font-black font-mono text-[#0063FD]">
                        {new Intl.NumberFormat("vi-VN").format(deal.price_vnd)}₫
                      </div>
                      {deal.original_price_vnd && (
                        <div className="text-[10px] sm:text-xs font-mono text-[#94A3B8] line-through">
                          {new Intl.NumberFormat("vi-VN").format(deal.original_price_vnd)}₫
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.5 rounded border border-[#86EFAC]">
                      Trả góp 0%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/build-pc" className="w-full">
                      <Button variant="secondary" size="sm" className="w-full text-[11px] sm:text-xs font-bold">
                        Chi tiết
                      </Button>
                    </Link>
                    <Link href="/thanh-toan" className="w-full">
                      <Button variant="primary" size="sm" className="w-full text-[11px] sm:text-xs font-black">
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
      {/* 5. HARDWARE CATALOG BY CATEGORIES (Responsive 2-Col on Mobile, 4 on PC)   */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6 space-y-4 sm:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3 sm:pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-[#0063FD] uppercase tracking-wider mb-0.5 sm:mb-1">
              <CircuitBoard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Linh kiện thế hệ mới
            </div>
            <h2 className="text-lg sm:text-2xl font-black uppercase text-[#0F172A]">
              LINH KIỆN MÁY TÍNH CHÍNH HÃNG
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
            <Link href="/danh-muc" className="rounded-lg bg-[#0063FD] px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-white shadow-xs">
              Tất Cả
            </Link>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/danh-muc/${cat.slug}`}
                className="rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-[#475569] hover:border-[#0063FD] hover:text-[#0063FD] transition-colors shadow-xs"
              >
                {cat.name_vi}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. OFFICIAL BRAND PARTNERS WITH AUTHENTIC VECTOR BADGES */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-8 shadow-xs text-center space-y-4 sm:space-y-6">
          <div>
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#0063FD] mb-1">
              ĐỐI TÁC THƯƠNG HIỆU PHÂN PHỐI CHÍNH HÃNG
            </div>
            <h3 className="text-xs sm:text-base font-bold text-[#0F172A]">
              Cam kết linh kiện chính hãng, nguyên seal, đầy đủ hóa đơn VAT và bảo hành theo nhà sản xuất
            </h3>
          </div>

          {/* Real Official Brand Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4 pt-1">
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#0063FD] hover:bg-[#FFFFFF] transition-all shadow-xs" title="ASUS Republic of Gamers">
              <AsusRogLogo />
            </div>
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#76B900] hover:bg-[#FFFFFF] transition-all shadow-xs" title="NVIDIA GeForce">
              <NvidiaGeForceLogo />
            </div>
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#0068B5] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Intel Core">
              <IntelCoreLogo />
            </div>
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#ED1C24] hover:bg-[#FFFFFF] transition-all shadow-xs" title="AMD Ryzen">
              <AmdRyzenLogo />
            </div>
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#0063FD] hover:bg-[#FFFFFF] transition-all shadow-xs" title="MSI True Gaming">
              <MsiGamingLogo />
            </div>
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#0063FD] hover:bg-[#FFFFFF] transition-all shadow-xs" title="GIGABYTE AORUS">
              <GigabyteAorusLogo />
            </div>
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#0F172A] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Corsair">
              <CorsairSailsLogo />
            </div>
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#1428A0] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Samsung Memory">
              <SamsungMemoryLogo />
            </div>
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#0063FD] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Kingston FURY">
              <KingstonFuryLogo />
            </div>
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#7C3AED] hover:bg-[#FFFFFF] transition-all shadow-xs" title="NZXT">
              <NzxtOfficialLogo />
            </div>
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#0F172A] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Lian Li">
              <LianLiOfficialLogo />
            </div>
            <div className="flex h-13 sm:h-16 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4 hover:border-[#0F172A] hover:bg-[#FFFFFF] transition-all shadow-xs" title="Western Digital">
              <WdBlackLogo />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
