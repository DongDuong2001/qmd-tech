import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { catalogService } from "@/modules/catalog/service";
import { i18nService } from "@/modules/i18n/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Wrench,
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
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#2A3040] bg-[#131722]">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={productName}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-[#9AA3B2]">
                No Image Available
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="text-xs font-bold text-[#3B82F6] uppercase">
                {product.brand}
              </Badge>
              <span className="font-mono text-xs text-[#9AA3B2]">
                SKU: {product.sku}
              </span>
              {isOutOfStock ? (
                <Badge variant="danger">{t("common.outOfStock")}</Badge>
              ) : (
                <Badge variant="success">{t("common.inStock")}</Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F2F4F8] leading-snug">
              {productName}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black font-mono text-[#FACC15]">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-sm font-mono text-[#9AA3B2] line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-[#9AA3B2]">
              Đã bao gồm thuế VAT 10% • Bảo hành chính hãng {product.warranty_months} tháng
            </div>
          </div>

          {/* Description Snippet */}
          <p className="text-sm text-[#9AA3B2] leading-relaxed">
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
                  className="w-full gap-2 font-bold"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t("common.addToCart")}
                </Button>
              </Link>

              <Link href="/build-pc">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full gap-2 font-bold"
                >
                  <Wrench className="h-5 w-5" />
                  Thêm vào Custom Build
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="rounded-xl border border-[#2A3040] bg-[#0B0E14] p-4 grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#22C55E]" />
              <span className="text-[#F2F4F8]">Chính hãng 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#3B82F6]" />
              <span className="text-[#F2F4F8]">Freeship từ 5Tr</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-[#FACC15]" />
              <span className="text-[#F2F4F8]">1 đổi 1 trong 30 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="rounded-2xl border border-[#2A3040] bg-[#131722] p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-[#F2F4F8] border-b border-[#2A3040] pb-4">
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
                    className={`border-b border-[#2A3040]/50 ${
                      idx % 2 === 0 ? "bg-[#0B0E14]/40" : "bg-transparent"
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-[#9AA3B2] w-1/3">
                      {formattedKey}
                    </td>
                    <td className="py-3 px-4 text-[#F2F4F8] font-bold">
                      {displayValue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
