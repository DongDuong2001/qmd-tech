"use client";

import React, { useMemo } from "react";
import {
  getSpecDefinitionsForCategory,
  normalizeCategorySlug,
} from "@/modules/catalog/specRegistry";
import { ProductSpecDefinition } from "@/shared/types/specs";
import { createHugeIconComponent } from "@/components/ui/HugeIcon";
import {
  Activity01Icon,
  PlusIcon,
  Delete02Icon,
  InfoIcon,
} from "@hugeicons/core-free-icons";

const Activity = createHugeIconComponent(Activity01Icon);
const Plus = createHugeIconComponent(PlusIcon);
const Trash2 = createHugeIconComponent(Delete02Icon);
const Info = createHugeIconComponent(InfoIcon);

export interface CategorySpecsFormProps {
  categorySlug: string;
  specs: Record<string, unknown>;
  onChange: (specs: Record<string, unknown>) => void;
  locale?: "vi" | "en";
}

export function CategorySpecsForm({
  categorySlug,
  specs,
  onChange,
  locale = "vi",
}: CategorySpecsFormProps) {
  const normSlug = useMemo(() => normalizeCategorySlug(categorySlug), [categorySlug]);
  const definitions = useMemo(() => getSpecDefinitionsForCategory(categorySlug), [categorySlug]);

  const handleFieldChange = (key: string, value: unknown) => {
    const next = { ...specs };
    if (value === undefined || value === null || value === "") {
      delete next[key];
    } else {
      next[key] = value;
    }
    onChange(next);
  };

  // Identify custom keys that are not part of the standard schema
  const standardKeySet = useMemo(() => new Set(definitions.map((d) => d.key)), [definitions]);
  const customEntries = useMemo(() => {
    return Object.entries(specs || {}).filter(([k]) => !standardKeySet.has(k));
  }, [specs, standardKeySet]);

  const handleCustomKeyChange = (oldKey: string, newKey: string, value: unknown) => {
    const next = { ...specs };
    if (oldKey !== newKey) {
      delete next[oldKey];
    }
    if (newKey.trim()) {
      next[newKey.trim()] = value;
    }
    onChange(next);
  };

  const handleRemoveCustomKey = (key: string) => {
    const next = { ...specs };
    delete next[key];
    onChange(next);
  };

  const handleAddCustomField = () => {
    let index = 1;
    let newKey = `custom_spec_${index}`;
    while (newKey in (specs || {})) {
      index++;
      newKey = `custom_spec_${index}`;
    }
    onChange({
      ...specs,
      [newKey]: "",
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#0063FD]" />
          <span className="font-bold uppercase tracking-wider text-[#0F172A]">
            Thông số kỹ thuật linh kiện {normSlug ? `(${normSlug.toUpperCase()})` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
          <span className="inline-flex items-center gap-1 rounded bg-[#EFF6FF] px-2 py-0.5 font-mono font-medium text-[#1D4ED8] border border-[#DBEAFE]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
            PC Builder Key
          </span>
          <span className="text-[#94A3B8]">|</span>
          <span>{definitions.length} trường chuẩn</span>
        </div>
      </div>

      {definitions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-white p-4 text-center">
          <Info className="mx-auto h-5 w-5 text-[#94A3B8] mb-1.5" />
          <p className="text-xs text-[#64748B]">
            {normSlug
              ? `Danh mục '${normSlug}' chưa có cấu hình bộ thông số chuẩn.`
              : "Vui lòng chọn danh mục để nạp danh sách thông số kỹ thuật chuẩn."}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1">
            Bạn có thể thêm thông số tùy chỉnh bên dưới nếu cần thiết.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {definitions.map((def: ProductSpecDefinition) => {
            const rawVal = specs?.[def.key];
            const label = locale === "vi" ? def.label_vi : def.label_en;

            return (
              <div
                key={def.key}
                className="rounded-lg border border-[#E2E8F0] bg-white p-2.5 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <label className="block text-[11px] font-bold text-[#1E293B] truncate" title={label}>
                    {label}
                    {def.required && <span className="text-[#EF4444] ml-0.5">*</span>}
                  </label>
                  {def.is_compatibility_key && (
                    <span
                      title="Thông số này được công cụ ráp PC Custom Builder sử dụng để kiểm tra tương thích phần cứng"
                      className="shrink-0 rounded bg-[#EFF6FF] px-1 py-0.5 text-[9px] font-mono font-bold text-[#1D4ED8]"
                    >
                      PC Builder
                    </span>
                  )}
                </div>

                {/* Field Input based on Type */}
                {def.type === "select" ? (
                  <select
                    value={rawVal !== undefined && rawVal !== null ? String(rawVal) : ""}
                    onChange={(e) => handleFieldChange(def.key, e.target.value)}
                    className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                  >
                    <option value="">-- Chọn {label} --</option>
                    {def.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : def.type === "boolean" ? (
                  <div className="flex items-center gap-3 pt-1">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name={`bool_${def.key}`}
                        checked={rawVal === true}
                        onChange={() => handleFieldChange(def.key, true)}
                        className="text-[#0063FD] focus:ring-[#0063FD]"
                      />
                      <span className="text-xs text-[#0F172A]">Có (Yes)</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name={`bool_${def.key}`}
                        checked={rawVal === false}
                        onChange={() => handleFieldChange(def.key, false)}
                        className="text-[#0063FD] focus:ring-[#0063FD]"
                      />
                      <span className="text-xs text-[#64748B]">Không (No)</span>
                    </label>
                    {rawVal !== undefined && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange(def.key, undefined)}
                        className="text-[10px] text-[#94A3B8] hover:text-[#EF4444]"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                ) : def.type === "number" ? (
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="any"
                      placeholder={def.validation?.min !== undefined ? `Min: ${def.validation.min}` : "0"}
                      value={rawVal !== undefined && rawVal !== null ? String(rawVal) : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleFieldChange(def.key, val === "" ? undefined : parseFloat(val));
                      }}
                      className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 pr-10 text-xs font-mono text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                    />
                    {def.unit && (
                      <span className="absolute right-2 text-[10px] font-mono text-[#94A3B8]">
                        {def.unit}
                      </span>
                    )}
                  </div>
                ) : def.type === "array_string" || def.type === "array_number" ? (
                  <input
                    type="text"
                    placeholder="Giá trị phân tách bởi dấu phẩy, VD: 240, 360"
                    value={
                      Array.isArray(rawVal)
                        ? rawVal.join(", ")
                        : rawVal !== undefined && rawVal !== null
                        ? String(rawVal)
                        : ""
                    }
                    onChange={(e) => {
                      const str = e.target.value;
                      if (!str.trim()) {
                        handleFieldChange(def.key, undefined);
                        return;
                      }
                      if (def.type === "array_number") {
                        const nums = str
                          .split(",")
                          .map((s) => parseFloat(s.trim()))
                          .filter((n) => !isNaN(n));
                        handleFieldChange(def.key, nums);
                      } else {
                        const items = str
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        handleFieldChange(def.key, items);
                      }
                    }}
                    className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={`Nhập ${label.toLowerCase()}...`}
                    value={rawVal !== undefined && rawVal !== null ? String(rawVal) : ""}
                    onChange={(e) => handleFieldChange(def.key, e.target.value)}
                    className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Custom & Unmapped Specs Section */}
      <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-bold text-[#475569] text-[11px] flex items-center gap-1.5">
            <span>Thông số bổ sung / Tùy biến ({customEntries.length})</span>
          </div>
          <button
            type="button"
            onClick={handleAddCustomField}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0063FD] hover:text-[#0052D4]"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm thông số tùy chỉnh
          </button>
        </div>

        {customEntries.length > 0 && (
          <div className="space-y-2">
            {customEntries.map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tên thông số (key)"
                  value={key}
                  onChange={(e) => handleCustomKeyChange(key, e.target.value, val)}
                  className="w-1/3 rounded border border-[#CBD5E1] bg-white p-1.5 text-xs font-mono text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Giá trị"
                  value={
                    typeof val === "object" && val !== null
                      ? JSON.stringify(val)
                      : String(val ?? "")
                  }
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="flex-1 rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomKey(key)}
                  className="rounded p-1.5 text-[#94A3B8] hover:bg-[#FEE2E2] hover:text-[#EF4444]"
                  title="Xóa thông số này"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
