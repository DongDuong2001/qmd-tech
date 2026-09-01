import React from "react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { catalogService } from "@/modules/catalog/service";
import { ProductCard } from "@/components/product/ProductCard";
import { Cpu, CircuitBoard, MemoryStick, Layers, HardDrive, Zap, Box, Fan } from "lucide-react";

export const metadata = {
  title: "Danh Mục Linh Kiện Máy Tính | QMD-Tech",
  description: "Kho linh kiện PC chính hãng: CPU, VGA, Bo mạch chủ, RAM, SSD, Nguồn máy tính, Vỏ Case và Tản nhiệt.",
};

export default async function CategoriesPage() {
  const t = await getTranslations();
  const categories = await catalogService.getCategories();
  const { products } = await catalogService.getProducts();

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
        <h1 className="text-2xl sm:text-3xl font-black text-[#F2F4F8]">
          {t("nav.categories")}
        </h1>
        <p className="mt-1 text-sm text-[#9AA3B2]">
          Linh kiện PC chính hãng từ ASUS, MSI, AMD, Intel, Corsair, Samsung, Lian Li, NZXT
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2.5">
        <Link
          href="/danh-muc"
          className="rounded-lg bg-[#3B82F6] px-4 py-2 text-xs font-bold text-white shadow-sm"
        >
          {t("common.all")}
        </Link>
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.slug);
          return (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              className="flex items-center gap-1.5 rounded-lg border border-[#2A3040] bg-[#131722] px-4 py-2 text-xs font-semibold text-[#F2F4F8] hover:border-[#3B82F6] hover:bg-[#1B2030] transition-colors"
            >
              <Icon className="h-3.5 w-3.5 text-[#3B82F6]" />
              {cat.name_vi}
            </Link>
          );
        })}
      </div>

      {/* All Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
