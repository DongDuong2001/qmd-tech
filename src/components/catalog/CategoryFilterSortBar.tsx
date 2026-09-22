"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createHugeIconComponent } from "@/components/ui/HugeIcon";
import {
  Sorting01Icon,
  FilterHorizontalIcon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

const Sorting = createHugeIconComponent(Sorting01Icon);
const FilterHorizontal = createHugeIconComponent(FilterHorizontalIcon);
const XCircle = createHugeIconComponent(CancelCircleIcon);
const CheckCircle2 = createHugeIconComponent(CheckmarkCircle02Icon);

interface CategoryFilterSortBarProps {
  brands: string[];
  totalCount: number;
}

export function CategoryFilterSortBar({
  brands,
  totalCount,
}: CategoryFilterSortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "default";
  const currentBrand = searchParams.get("brand") || "";
  const currentInStock = searchParams.get("in_stock") === "true";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "default" && value !== "false") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(currentBrand || currentInStock || currentSort !== "default");

  return (
    <div className="space-y-3 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-3.5 sm:p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Results Counter & In-Stock Switch */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-mono font-bold text-[#0F172A]">
            {totalCount} sản phẩm
          </span>

          <span className="hidden sm:inline-block text-[#CBD5E1]">|</span>

          {/* In-Stock Filter Toggle */}
          <button
            type="button"
            onClick={() => updateParam("in_stock", currentInStock ? null : "true")}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
              currentInStock
                ? "border-[#16A34A] bg-[#DCFCE7] text-[#15803D]"
                : "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]"
            }`}
          >
            <CheckCircle2
              className={`h-3.5 w-3.5 ${currentInStock ? "text-[#16A34A]" : "text-[#94A3B8]"}`}
            />
            <span>Chỉ hiện còn hàng</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#DC2626] hover:underline"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        {/* Sort Select Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] shrink-0">
            <Sorting className="h-3.5 w-3.5 text-[#0063FD]" />
            <span className="font-semibold">Sắp xếp:</span>
          </div>
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
          >
            <option value="default">Phổ biến nhất</option>
            <option value="price_asc">Giá: Thấp đến cao</option>
            <option value="price_desc">Giá: Cao đến thấp</option>
            <option value="name_asc">Tên: A đến Z</option>
          </select>
        </div>
      </div>

      {/* Brand Chips Strip (If multiple brands exist) */}
      {brands.length > 0 && (
        <div className="pt-2 border-t border-[#F1F5F9] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-bold text-[#64748B] uppercase shrink-0 flex items-center gap-1">
            <FilterHorizontal className="h-3 w-3 text-[#0063FD]" />
            Hãng:
          </span>

          <button
            type="button"
            onClick={() => updateParam("brand", null)}
            className={`shrink-0 rounded-lg px-2.5 py-0.5 text-xs font-semibold transition-all ${
              !currentBrand
                ? "bg-[#0063FD] text-white shadow-2xs"
                : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
            }`}
          >
            Tất cả
          </button>

          {brands.map((b) => {
            const isSelected = currentBrand.toLowerCase() === b.toLowerCase();
            return (
              <button
                key={b}
                type="button"
                onClick={() => updateParam("brand", isSelected ? null : b)}
                className={`shrink-0 rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "border-[#0063FD] bg-[#EFF6FF] text-[#0063FD] shadow-2xs"
                    : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1] hover:text-[#0F172A]"
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
