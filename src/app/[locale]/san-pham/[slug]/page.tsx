import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { catalogService } from "@/modules/catalog/service";
import { reviewService } from "@/modules/reviews/service";
import { i18nService } from "@/modules/i18n/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Wrench,
  Star,
} from "lucide-react";

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

  const reviews = await reviewService.getProductReviews(product.id);

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Product Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#E4E7EC] bg-[#FFFFFF] shadow-xs">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={productName}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-[#94A3B8]">
                No Image Available
              </div>
            )}
          </div>
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

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/gio-hang">
                <Button
                  disabled={isOutOfStock}
                  variant="primary"
                  size="lg"
                  className="w-full gap-2 font-bold shadow-xs"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t("common.addToCart")}
                </Button>
              </Link>

              <Link href="/build-pc">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full gap-2 font-bold shadow-xs"
                >
                  <Wrench className="h-5 w-5" />
                  Thêm vào Custom Build
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="rounded-xl border border-[#E4E7EC] bg-[#F8FAFC] p-4 grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
              <span className="text-[#0F172A] font-medium">Chính hãng 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#2563EB]" />
              <span className="text-[#0F172A] font-medium">Freeship từ 5Tr</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-[#D97706]" />
              <span className="text-[#0F172A] font-medium">1 đổi 1 30 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="rounded-2xl border border-[#E4E7EC] bg-[#FFFFFF] p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-[#0F172A] border-b border-[#E4E7EC] pb-4">
          {t("common.specs")} Chi Tiết
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <tbody>
              {Object.entries(product.specs).map(([key, value], idx) => {
                if (value === undefined || value === null) return null;
                const formattedKey = key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());

                const displayValue = Array.isArray(value)
                  ? value.join(", ")
                  : typeof value === "boolean"
                  ? value ? "Có (Yes)" : "Không (No)"
                  : String(value);

                return (
                  <tr
                    key={key}
                    className={`border-b border-[#E4E7EC] ${
                      idx % 2 === 0 ? "bg-[#F8FAFC]" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-[#64748B] w-1/3">
                      {formattedKey}
                    </td>
                    <td className="py-3 px-4 text-[#0F172A] font-bold">
                      {displayValue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
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
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
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
    </div>
  );
}
