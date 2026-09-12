import React from "react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { catalogService } from "@/modules/catalog/service";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import {
  CpuIcon,
  CircuitBoardIcon,
  MemoryStickIcon,
  Layers01Icon,
  HardDriveIcon,
  ZapIcon,
  BoxIcon,
  Fan01Icon,
  BoxesIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/HugeIcon";

export const metadata = {
  title: "Danh Mục Linh Kiện Máy Tính | QMD-Tech",
  description: "Kho linh kiện PC chính hãng: CPU, VGA, Bo mạch chủ, RAM, SSD, Nguồn máy tính, Vỏ Case và Tản nhiệt.",
};

interface CategoriesPageProps {
  searchParams?: Promise<{ q?: string; brand?: string; sort?: string }>;
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const queryParams = searchParams ? await searchParams : {};
  const query = queryParams.q?.trim() || "";
  const brand = queryParams.brand?.trim() || "";

  const t = await getTranslations();
  const categories = await catalogService.getCategories();
  const { products } = await catalogService.getProducts({
    search: query || undefined,
    brand: brand || undefined,
    limit: 60,
  });

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "cpu": return CpuIcon;
      case "motherboard": return CircuitBoardIcon;
      case "ram": return MemoryStickIcon;
      case "gpu": return Layers01Icon;
      case "storage": return HardDriveIcon;
      case "psu": return ZapIcon;
      case "case": return BoxIcon;
      case "cooling": return Fan01Icon;
      default: return CpuIcon;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
          {t("nav.categories")}
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Linh kiện PC chính hãng từ ASUS, MSI, AMD, Intel, Corsair, Samsung, Lian Li, NZXT
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2.5">
        <Link
          href="/danh-muc"
          className="rounded-lg bg-[#0063FD] px-4 py-2 text-xs font-bold text-white shadow-xs"
        >
          {t("common.all")}
        </Link>
        {categories.map((cat) => {
          const iconData = getCategoryIcon(cat.slug);
          return (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:border-[#0063FD] hover:bg-[#EFF6FF] transition-colors shadow-xs"
            >
              <HugeIcon icon={iconData} className="h-3.5 w-3.5 text-[#0063FD]" />
              {cat.name_vi}
            </Link>
          );
        })}
      </div>

      {/* Search Result Banner */}
      {(query || brand) && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-[#1E3A8A]">
              Kết quả tìm kiếm cho:
            </span>
            <span className="rounded-md bg-white border border-[#93C5FD] px-2.5 py-1 text-xs font-black text-[#0063FD]">
              &quot;{query || brand}&quot;
            </span>
            <span className="text-[#3B82F6] font-semibold">
              (Tìm thấy {products.length} sản phẩm phù hợp)
            </span>
          </div>
          <Link
            href="/danh-muc"
            className="rounded-lg bg-white border border-[#CBD5E1] px-3 py-1 text-xs font-bold text-[#DC2626] hover:bg-[#FEE2E2] hover:border-[#F87171] transition-colors"
          >
            Xóa bộ lọc tìm kiếm
          </Link>
        </div>
      )}

      {/* Products Grid / Empty State */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-12 text-center space-y-4 shadow-xs">
          <HugeIcon icon={BoxesIcon} className="mx-auto h-12 w-12 text-[#CBD5E1]" />
          <h3 className="text-lg font-bold text-[#0F172A]">
            {query || brand
              ? `Không tìm thấy linh kiện nào phù hợp với "${query || brand}"`
              : "Chưa có sản phẩm nào trong danh mục"}
          </h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            {query || brand
              ? "Quý khách vui lòng thử tìm kiếm với từ khóa khác hoặc bấm bên dưới để xem toàn bộ linh kiện hiện có."
              : "Hiện tại các sản phẩm đang được cập nhật thêm. Quý khách vui lòng quay lại sau hoặc liên hệ Hotline để được tư vấn."}
          </p>
          <Link href="/danh-muc">
            <Button variant="primary" size="sm" className="font-bold text-xs">
              Xem Tất Cả Linh Kiện
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
