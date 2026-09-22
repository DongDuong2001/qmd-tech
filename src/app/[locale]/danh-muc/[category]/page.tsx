import React from "react";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { catalogService } from "@/modules/catalog/service";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryFilterSortBar } from "@/components/catalog/CategoryFilterSortBar";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/HugeIcon";

interface CategoryPageProps {
  params: Promise<{ category: string; locale: string }>;
  searchParams?: Promise<{ q?: string; brand?: string; sort?: string; in_stock?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = await catalogService.getCategoryBySlug(category);
  if (!cat) return { title: "Danh Mục | QMD-Tech" };

  return {
    title: `${cat.name_vi} | QMD-Tech`,
    description: `Danh sách linh kiện ${cat.name_vi} chính hãng tại QMD-Tech.`,
  };
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const queryParams = searchParams ? await searchParams : {};
  const cat = await catalogService.getCategoryBySlug(category);

  if (!cat) {
    notFound();
  }

  // 1. Fetch all category products to compute available brands
  const { products: rawProducts } = await catalogService.getProducts({
    categorySlug: category,
    search: queryParams.q,
  });

  const availableBrands = Array.from(
    new Set(rawProducts.map((p) => p.brand).filter(Boolean))
  ).sort();

  // 2. Filter by brand
  let filtered = rawProducts;
  if (queryParams.brand) {
    filtered = filtered.filter(
      (p) => p.brand.toLowerCase() === queryParams.brand?.toLowerCase()
    );
  }

  // 3. Filter by in_stock
  if (queryParams.in_stock === "true") {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  // 4. Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (queryParams.sort) {
      case "price_asc":
        return a.price_vnd - b.price_vnd;
      case "price_desc":
        return b.price_vnd - a.price_vnd;
      case "name_asc":
        return a.name_vi.localeCompare(b.name_vi);
      default:
        return 0;
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-6">
        <div>
          <Link
            href="/danh-muc"
            className="mb-2 inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#2563EB] transition-colors"
          >
            <HugeIcon icon={ArrowLeft01Icon} className="h-3.5 w-3.5" />
            Tất cả danh mục
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            {cat.name_vi}
          </h1>
          <div className="mt-1 flex items-center gap-3 text-xs text-[#64748B] font-mono">
            <span>Linh kiện {cat.name_vi} chính hãng</span>
            {queryParams.q && (
              <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-bold text-[#0063FD]">
                Tìm kiếm: &quot;{queryParams.q}&quot;
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Filter and Sort Toolbar */}
      <CategoryFilterSortBar
        brands={availableBrands}
        totalCount={sorted.length}
      />

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-[#E4E7EC] bg-[#FFFFFF] p-12 text-center text-sm text-[#64748B] shadow-xs">
          Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
