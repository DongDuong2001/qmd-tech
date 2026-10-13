import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { catalogService } from "@/modules/catalog/service";
import { Button } from "@/components/ui/button";
import { HugeIcon } from "@/components/ui/HugeIcon";
import { HeartIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { WishlistClient } from "./WishlistClient";

export const metadata = {
  title: "Danh Sách Yêu Thích | QMD-Tech",
  description: "Quản lý danh sách sản phẩm yêu thích của bạn tại QMD-Tech. Dễ dàng thêm vào giỏ hàng hoặc so sánh sản phẩm.",
};

interface WishlistPageProps {
  searchParams?: Promise<{ clear?: string }>;
}

export default async function WishlistPage({ searchParams }: WishlistPageProps) {
  await getTranslations();
  if (searchParams) await searchParams;

  const { products: allProducts } = await catalogService.getProducts({ limit: 200 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] flex items-center gap-2">
            <HugeIcon icon={HeartIcon} className="h-7 w-7 text-[#DC2626]" />
            Danh Sách Yêu Thích
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Các sản phẩm bạn đã lưu để xem lại sau
          </p>
        </div>
        <Link href="/danh-muc">
          <Button variant="outline" size="sm" className="gap-1.5">
            <HugeIcon icon={Search01Icon} className="h-3.5 w-3.5" />
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>

      <WishlistClient allProducts={allProducts} />
    </div>
  );
}