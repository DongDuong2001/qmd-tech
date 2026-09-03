import React from "react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { catalogService } from "@/modules/catalog/service";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Cpu, CircuitBoard, MemoryStick, Layers, HardDrive, Zap, Box, Fan, Boxes } from "lucide-react";

export const metadata = {
  title: "Danh Mục Linh Kiện Máy Tính | QMD-Tech",
  description: "Kho linh kiện PC chính hãng: CPU, VGA, Bo mạch chủ, RAM, SSD, Nguồn máy tính, Vỏ Case và Tản nhiệt.",
};

export default async function CategoriesPage() {
  const t = await getTranslations();
  const categories = await catalogService.getCategories();
  const { products } = await catalogService.getProducts({ limit: 40 });

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "cpu": return Cpu;
      case "motherboard": return CircuitBoard;
      case "ram": return MemoryStick;
      case "gpu": return Layers;
      case "storage": return HardDrive;
      case "psu": return Zap;
      case "case": return Box;
      case "cooling": return Fan;
      default: return Cpu;
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
          const Icon = getCategoryIcon(cat.slug);
          return (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:border-[#0063FD] hover:bg-[#EFF6FF] transition-colors shadow-xs"
            >
              <Icon className="h-3.5 w-3.5 text-[#0063FD]" />
              {cat.name_vi}
            </Link>
          );
        })}
      </div>

      {/* Products Grid / Empty State */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-12 text-center space-y-4 shadow-xs">
          <Boxes className="mx-auto h-12 w-12 text-[#CBD5E1]" />
          <h3 className="text-lg font-bold text-[#0F172A]">Chưa có sản phẩm nào trong danh mục</h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            Dữ liệu sản phẩm đang được kết nối trực tiếp từ Supabase Database. Bạn có thể thêm sản phẩm từ Admin Dashboard.
          </p>
          <Link href="/admin">
            <Button variant="primary" size="sm" className="font-bold text-xs">
              Mở Admin Dashboard
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
