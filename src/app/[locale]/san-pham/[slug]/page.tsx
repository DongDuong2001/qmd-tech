import React from "react";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { catalogService } from "@/modules/catalog/service";
import { reviewService } from "@/modules/reviews/service";
import { i18nService } from "@/modules/i18n/service";
import { Product } from "@/shared/types";
import { Badge } from "@/components/ui/badge";
import { ProductDetailActions } from "./ProductDetailActions";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { DynamicProductSpecs } from "@/components/product/DynamicProductSpecs";
import { escapeJsonLd } from "@/shared/lib/sanitize";
import {
  ShieldCheckIcon,
  TruckIcon,
  RotateCcwIcon,
  StarIcon,
  Home01Icon,
  ChevronRightIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/HugeIcon";

interface ProductDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await catalogService.getProductBySlug(slug);
  if (!product) return { title: "Sản Phẩm | QMD-Tech" };

  return {
    title: `${product.name_vi} | QMD-Tech`,
    description: product.desc_vi || product.desc_en,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug, locale } = await params;
  const product = await catalogService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const t = await getTranslations();
  const loc = locale as "vi" | "en";

  const categorySlug = product.category?.slug;
  const [category, relatedResult, reviews] = await Promise.all([
    categorySlug ? catalogService.getCategoryBySlug(categorySlug) : Promise.resolve(product.category || null),
    categorySlug ? catalogService.getProducts({ categorySlug, limit: 5 }) : Promise.resolve({ products: [] }),
    reviewService.getProductReviews(product.id),
  ]);

  const relatedProducts: Product[] = (relatedResult?.products || [])
    .filter((p: Product) => p.id !== product.id)
    .slice(0, 4);

  const formattedPrice = i18nService.formatPrice(
    product.price_vnd,
    loc,
    product.price_usd
  );
  const formattedOriginalPrice = product.original_price_vnd
    ? i18nService.formatPrice(product.original_price_vnd, loc)
    : null;

  const productName = i18nService.getLocalizedProductName(product, loc);
  const productDesc = i18nService.getLocalizedProductDesc(product, loc);
  const isOutOfStock = product.stock <= 0;

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    image: product.images,
    description: productDesc,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: product.price_vnd,
      availability: isOutOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "QMD-Tech",
      },
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-8 sm:space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(jsonLd)) }}
      />

      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B] flex-wrap">
        <Link href="/" className="flex items-center gap-1 hover:text-[#0063FD] transition-colors">
          <HugeIcon icon={Home01Icon} className="h-3.5 w-3.5" />
          <span>Trang chủ</span>
        </Link>
        <HugeIcon icon={ChevronRightIcon} className="h-3 w-3 text-[#CBD5E1]" />
        <Link href="/danh-muc" className="hover:text-[#0063FD] transition-colors">
          Danh mục
        </Link>
        {category && (
          <>
            <HugeIcon icon={ChevronRightIcon} className="h-3 w-3 text-[#CBD5E1]" />
            <Link href={`/danh-muc/${category.slug}`} className="hover:text-[#0063FD] transition-colors">
              {category.name_vi}
            </Link>
          </>
        )}
        <HugeIcon icon={ChevronRightIcon} className="h-3 w-3 text-[#CBD5E1]" />
        <span className="font-semibold text-[#0F172A] truncate max-w-xs">{productName}</span>
      </nav>

      {/* Product Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images with Multi-Angle Gallery */}
        <div className="lg:col-span-6">
          <ProductImageGallery images={product.images} productName={productName} />
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE] uppercase">
                {product.brand}
              </Badge>
              <span className="font-mono text-xs text-[#64748B]">
                SKU: {product.sku}
              </span>
              {isOutOfStock ? (
                <Badge variant="danger">{t("common.outOfStock")}</Badge>
              ) : (
                <Badge variant="success">{t("common.inStock")}</Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-snug">
              {productName}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="rounded-xl border border-[#E4E7EC] bg-[#FFFFFF] p-5 shadow-xs">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black font-mono text-[#B45309]">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-sm font-mono text-[#94A3B8] line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-[#64748B]">
              Đã bao gồm thuế VAT 10% • Bảo hành chính hãng {product.warranty_months} tháng
            </div>
          </div>

          {/* Description Snippet */}
          <p className="text-sm text-[#64748B] leading-relaxed">
            {productDesc}
          </p>

          {/* Action Buttons with Live Add to Cart & Buy Now */}
          <ProductDetailActions
            product={product}
            addToCartText={t("common.addToCart")}
          />

          {/* Trust Guarantees */}
          <div className="rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-4 grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <HugeIcon icon={ShieldCheckIcon} className="h-4 w-4 text-[#16A34A]" />
              <span className="text-[#0F172A] font-medium">Chính hãng 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeIcon icon={TruckIcon} className="h-4 w-4 text-[#2563EB]" />
              <span className="text-[#0F172A] font-medium">Freeship từ 5Tr</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeIcon icon={RotateCcwIcon} className="h-4 w-4 text-[#D97706]" />
              <span className="text-[#0F172A] font-medium">1 đổi 1 30 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Specifications Table */}
      <DynamicProductSpecs product={product} locale={locale as "vi" | "en"} />

      {/* Customer Reviews Section */}
      <div className="rounded-2xl border border-[#E4E7EC] bg-[#FFFFFF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              Đánh Giá Từ Khách Hàng
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Phản hồi thực tế từ những người đã mua sản phẩm tại QMD-Tech
            </p>
          </div>
          <span className="flex items-center gap-1 text-sm font-bold text-[#B45309]">
            <HugeIcon icon={StarIcon} className="h-4 w-4 fill-amber-400 text-amber-400" />
            5.0 / 5.0
          </span>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0F172A]">
                    {rev.author_name}
                  </span>
                  {rev.is_verified_purchase && (
                    <span className="rounded bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 text-[10px] font-semibold border border-[#86EFAC]">
                      Đã mua hàng
                    </span>
                  )}
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <HugeIcon key={i} icon={StarIcon} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              {rev.title && (
                <p className="text-xs font-bold text-[#0F172A]">{rev.title}</p>
              )}
              <p className="text-xs text-[#64748B] leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#E4E7EC]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Sản Phẩm Cùng Phân Khúc</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Khám phá thêm các linh kiện {category?.name_vi || "tương tự"} chính hãng
              </p>
            </div>
            {category && (
              <Link
                href={`/danh-muc/${category.slug}`}
                className="text-xs font-bold text-[#0063FD] hover:underline"
              >
                Xem tất cả →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
