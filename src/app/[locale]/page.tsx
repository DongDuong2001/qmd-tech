import React from "react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { catalogService } from "@/modules/catalog/service";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Cpu,
  CircuitBoard,
  MemoryStick,
  Layers,
  HardDrive,
  Zap,
  Box,
  Fan,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
} from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations();
  const categories = await catalogService.getCategories();
  const featuredProducts = await catalogService.getFeaturedProducts();

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "cpu":
        return Cpu;
      case "motherboard":
        return CircuitBoard;
      case "ram":
        return MemoryStick;
      case "gpu":
        return Layers;
      case "storage":
        return HardDrive;
      case "psu":
        return Zap;
      case "case":
        return Box;
      case "cooling":
        return Fan;
      default:
        return Cpu;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative border-b border-[#2A3040] bg-[#0B0E14] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-3.5 py-1.5 text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                {t("hero.badge")}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F2F4F8] leading-[1.15]">
                {t("hero.title")}
              </h1>

              <p className="text-base sm:text-lg text-[#9AA3B2] max-w-2xl leading-relaxed">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/build-pc">
                  <Button variant="accent" size="lg" className="gap-2 font-bold shadow-lg">
                    <Wrench className="h-5 w-5" />
                    {t("hero.ctaBuilder")}
                  </Button>
                </Link>

                <Link href="/danh-muc">
                  <Button variant="outline" size="lg" className="gap-2 font-bold">
                    {t("hero.ctaCatalog")}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#2A3040]/70 text-xs">
                <div>
                  <div className="font-mono text-base font-bold text-[#F2F4F8]">100%</div>
                  <div className="text-[#9AA3B2]">Chính hãng VAT</div>
                </div>
                <div>
                  <div className="font-mono text-base font-bold text-[#3B82F6]">36 - 60</div>
                  <div className="text-[#9AA3B2]">Tháng bảo hành</div>
                </div>
                <div>
                  <div className="font-mono text-base font-bold text-[#22C55E]">0đ</div>
                  <div className="text-[#9AA3B2]">Công lắp & Test tải</div>
                </div>
              </div>
            </div>

            {/* Right Tech Showcase Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#2A3040] bg-[#131722] p-6 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#2A3040] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full bg-[#EF4444]" />
                    <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                    <div className="h-3 w-3 rounded-full bg-[#22C55E]" />
                    <span className="ml-2 font-mono text-xs text-[#9AA3B2]">
                      qmd-compatibility-engine.v2
                    </span>
                  </div>
                  <span className="rounded bg-[#22C55E]/15 px-2 py-0.5 font-mono text-[11px] font-bold text-[#22C55E]">
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between rounded-lg bg-[#0B0E14] p-3 border border-[#2A3040]">
                    <span className="text-[#9AA3B2]">CPU Socket Check</span>
                    <span className="text-[#22C55E] font-bold">AMD AM5 / LGA1700 OK</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0B0E14] p-3 border border-[#2A3040]">
                    <span className="text-[#9AA3B2]">RAM Architecture</span>
                    <span className="text-[#3B82F6] font-bold">DDR5 EXPO / XMP 3.0</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#0B0E14] p-3 border border-[#2A3040]">
                    <span className="text-[#9AA3B2]">Power Headroom</span>
                    <span className="text-[#FACC15] font-bold">+30% Transient Safe</span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#7C3AED]/40 bg-[#1B2030] p-4 text-center">
                  <div className="text-xs text-[#9AA3B2] mb-1">
                    Cấu hình máy tính cá nhân hóa
                  </div>
                  <div className="text-sm font-bold text-[#F2F4F8]">
                    Tự động loại bỏ rủi ro không tương thích
                  </div>
                  <Link href="/build-pc" className="mt-3 block">
                    <Button variant="accent" size="sm" className="w-full font-bold">
                      Trải nghiệm công cụ Build PC
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#F2F4F8]">
              {t("nav.categories")}
            </h2>
            <p className="text-xs text-[#9AA3B2] mt-1">
              Phần cứng tuyển chọn từ các thương hiệu hàng đầu thế giới
            </p>
          </div>
          <Link
            href="/danh-muc"
            className="text-xs font-semibold text-[#3B82F6] hover:text-[#60A5FA] flex items-center gap-1"
          >
            {t("common.all")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.id}
                href={`/danh-muc/${cat.slug}`}
                className="group flex flex-col items-center rounded-xl border border-[#2A3040] bg-[#131722] p-4 text-center transition-all duration-200 hover:border-[#3B82F6] hover:bg-[#1B2030]"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#0B0E14] text-[#3B82F6] border border-[#2A3040] group-hover:border-[#3B82F6] transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-[#F2F4F8] line-clamp-2">
                  {cat.name_vi}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FACC15] uppercase tracking-wider mb-1">
              <Award className="h-4 w-4" />
              Sản Phẩm Nổi Bật
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#F2F4F8]">
              Linh Kiện Bán Chạy Nhất Tuần
            </h2>
          </div>
          <Link
            href="/danh-muc"
            className="text-xs font-semibold text-[#3B82F6] hover:text-[#60A5FA] flex items-center gap-1"
          >
            {t("common.viewDetails")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Custom PC Builder Banner (Solid Accent, No Gradient) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#7C3AED]/50 bg-[#131722] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="rounded bg-[#7C3AED] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                Dịch vụ độc quyền QMD-Tech
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#F2F4F8]">
                Xây Dựng Cấu Hình PC Hoàn Hảo Cùng Kỹ Sư Phần Cứng
              </h3>
              <p className="text-sm text-[#9AA3B2] max-w-2xl leading-relaxed">
                Chọn linh kiện theo sở thích, kiểm tra điện áp và độ thông thoáng luồng khí tự động. Đội ngũ kỹ thuật viên của QMD-Tech nhận ráp máy, đi dây thẩm mỹ và bàn giao tận nơi.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <Link href="/build-pc">
                <Button variant="accent" size="lg" className="w-full sm:w-auto font-bold gap-2 shadow-xl">
                  <Wrench className="h-5 w-5" />
                  Bắt đầu cấu hình máy ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
