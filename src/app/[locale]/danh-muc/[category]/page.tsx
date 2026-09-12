import React from "react";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { catalogService } from "@/modules/catalog/service";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/HugeIcon";

interface CategoryPageProps {
  params: Promise<{ category: string; locale: string }>;
  searchParams?: Promise<{ q?: string; brand?: string; sort?: string }>;
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

  const { products } = await catalogService.getProducts({
    categorySlug: category,
    search: queryParams.q,
    brand: queryParams.brand,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
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
            <span>{products.length} sản phẩm chính hãng</span>
            {queryParams.q && (
              <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-bold text-[#0063FD]">
                Bộ lọc: &quot;{queryParams.q}&quot;
              </span>
            )}
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-[#E4E7EC] bg-[#FFFFFF] p-12 text-center text-sm text-[#64748B] shadow-xs">
          Chưa có sản phẩm nào trong danh mục này.
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
