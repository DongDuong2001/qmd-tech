import React from "react";
import { Product } from "@/shared/types";
import {
  getSpecDefinitionsForCategory,
  formatSpecValue,
} from "@/modules/catalog/specRegistry";
import { DEFAULT_HARDWARE_CATEGORIES } from "@/modules/admin/service";
import {
  Wrench01Icon,
  ShieldCheckIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/HugeIcon";

interface DynamicProductSpecsProps {
  product: Product;
  locale: "vi" | "en";
}

export function DynamicProductSpecs({ product, locale }: DynamicProductSpecsProps) {
  let categorySlug = product.category?.slug || "";
  if (!categorySlug && product.category_id) {
    const match = DEFAULT_HARDWARE_CATEGORIES.find((c) => c.id === product.category_id);
    if (match) categorySlug = match.slug;
  }

  const defs = getSpecDefinitionsForCategory(categorySlug);
  const specs = (product.specs || {}) as Record<string, unknown>;

  // Defined specs present on this product
  const mappedSpecs = defs
    .filter((def) => specs[def.key] !== undefined && specs[def.key] !== null && specs[def.key] !== "")
    .sort((a, b) => a.sort_order - b.sort_order);

  // Unmapped/Custom specs
  const mappedKeys = new Set(defs.map((d) => d.key));
  const unmappedSpecs = Object.entries(specs).filter(
    ([k, v]) => !mappedKeys.has(k) && v !== undefined && v !== null && v !== ""
  );

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight font-heading">
            {locale === "vi" ? "Thông Số Kỹ Thuật Chi Tiết" : "Detailed Technical Specifications"}
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            {locale === "vi"
              ? "Dữ liệu thông số được xác thực và chuẩn hóa theo tiêu chuẩn phần cứng."
              : "Hardware parameters verified and normalized against manufacturer specifications."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 text-[11px] font-bold text-[#0063FD]">
            <HugeIcon icon={ShieldCheckIcon} className="h-3.5 w-3.5 text-[#0063FD]" />
            <span>Chính Hãng {product.brand}</span>
          </span>
        </div>
      </div>

      {mappedSpecs.length === 0 && unmappedSpecs.length === 0 ? (
        <div className="p-8 text-center text-xs text-[#64748B]">
          {locale === "vi"
            ? "Thông số kỹ thuật đang được cập nhật từ nhà sản xuất."
            : "Specifications are currently being updated from manufacturer."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                <th className="py-2.5 px-4 w-2/5 sm:w-1/3">
                  {locale === "vi" ? "Đặc Tính Kỹ Thuật" : "Specification Parameter"}
                </th>
                <th className="py-2.5 px-4 w-3/5 sm:w-2/3">
                  {locale === "vi" ? "Giá Trị Định Danh" : "Standard Value"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {mappedSpecs.map((def, idx) => {
                const val = specs[def.key];
                const displayVal = formatSpecValue(def, val, locale);
                const label = locale === "vi" ? def.label_vi : def.label_en;

                return (
                  <tr
                    key={def.key}
                    className={`transition-colors hover:bg-[#F1F5F9]/50 ${
                      idx % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#F8FAFC]"
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[#334155] align-top">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{label}</span>
                        {def.is_compatibility_key && (
                          <span
                            title="Thông số quyết định khả năng tương thích trong Custom PC Builder"
                            className="inline-flex items-center gap-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.5 text-[9px] font-black text-[#0063FD] uppercase cursor-help"
                          >
                            <HugeIcon icon={Wrench01Icon} className="h-2.5 w-2.5" />
                            <span>PC Builder</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#0F172A] align-top">
                      {Array.isArray(val) ? (
                        <div className="flex flex-wrap gap-1">
                          {val.map((item, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded bg-white border border-[#CBD5E1] px-2 py-0.5 text-[11px] shadow-2xs"
                            >
                              <HugeIcon icon={CheckmarkCircle02Icon} className="h-3 w-3 text-[#16A34A]" />
                              <span>{String(item)}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span>{displayVal}</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Unmapped Custom Specs if any */}
              {unmappedSpecs.length > 0 && (
                <>
                  <tr className="bg-[#F1F5F9] text-[11px] font-bold text-[#475569]">
                    <td colSpan={2} className="py-2 px-4 uppercase tracking-wider">
                      {locale === "vi" ? "Thông Số Bổ Sung" : "Additional Specs"}
                    </td>
                  </tr>
                  {unmappedSpecs.map(([k, v], idx) => {
                    const formattedKey = k
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase());
                    const displayVal = Array.isArray(v)
                      ? v.join(", ")
                      : typeof v === "boolean"
                      ? v ? (locale === "vi" ? "Có" : "Yes") : (locale === "vi" ? "Không" : "No")
                      : String(v);

                    return (
                      <tr
                        key={k}
                        className={`transition-colors hover:bg-[#F1F5F9]/50 ${
                          idx % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#F8FAFC]"
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold text-[#475569]">
                          {formattedKey}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#0F172A]">
                          {displayVal}
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
