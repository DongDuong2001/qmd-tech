"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/routing";
import {
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  MEGA_MENU_CATEGORIES,
  MegaCategoryItem,
  resolveMegaCategoryIcon,
} from "./megaMenuData";

interface CategoryMegaMenuProps {
  className?: string;
  buttonVariant?: "header" | "compact";
}

export function CategoryMegaMenu({
  className = "",
  buttonVariant = "header",
}: CategoryMegaMenuProps) {
  const [categories, setCategories] = useState<MegaCategoryItem[]>(MEGA_MENU_CATEGORIES);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    MEGA_MENU_CATEGORIES[0]?.id || "vga"
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadMenu = () => {
      fetch("/api/menu")
        .then((r) => r.json())
        .then((data) => {
          if (isMounted && data.success && Array.isArray(data.categories) && data.categories.length > 0) {
            setCategories(data.categories);
            if (!data.categories.some((c: MegaCategoryItem) => c.id === activeCategoryId)) {
              setActiveCategoryId(data.categories[0].id);
            }
          }
        })
        .catch(() => {
          // Fallback to default
        });
    };

    loadMenu();

    const handleUpdate = () => loadMenu();
    window.addEventListener("qmd:menu_updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("qmd:menu_updated", handleUpdate);
    };
  }, [activeCategoryId]);

  const activeCategory: MegaCategoryItem =
    categories.find((c) => c.id === activeCategoryId) ||
    categories[0] ||
    MEGA_MENU_CATEGORIES[0];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`group flex items-center gap-2 rounded-xl transition-all select-none shadow-2xs font-black tracking-wide ${
          buttonVariant === "header"
            ? "bg-[#0F172A] hover:bg-[#0063FD] text-white px-3.5 py-2.5 text-xs sm:text-sm border border-[#1E293B]"
            : "bg-white hover:border-[#0063FD] text-[#0F172A] hover:text-[#0063FD] px-3 py-2 text-xs border border-[#CBD5E1]"
        } ${isOpen ? "bg-[#0063FD] text-white ring-2 ring-[#0063FD]/30" : ""}`}
      >
        <LayoutGrid className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
        <span className="truncate">Danh mục</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Mega Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-2 w-[920px] lg:w-[980px] xl:w-[1040px] max-w-[95vw] rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          style={{ maxHeight: "580px" }}
        >
          <div className="flex h-[560px]">
            {/* Left Column: Category List */}
            <div className="w-[260px] xl:w-[280px] shrink-0 border-r border-[#E2E8F0] bg-[#F8FAFC] py-2 overflow-y-auto no-scrollbar flex flex-col justify-between">
              <div className="space-y-0.5 px-2">
                {categories.map((cat) => {
                  const Icon = resolveMegaCategoryIcon(cat.iconName || cat.icon);
                  const isActive = cat.id === activeCategoryId;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onMouseEnter={() => setActiveCategoryId(cat.id)}
                      onClick={() => setActiveCategoryId(cat.id)}
                      onFocus={() => setActiveCategoryId(cat.id)}
                      className={`w-full group flex items-center justify-between rounded-xl px-3 py-2.2 text-xs font-semibold cursor-pointer transition-all text-left ${
                        isActive
                          ? "bg-white text-[#0063FD] font-bold shadow-xs border-l-3 border-[#0063FD]"
                          : "text-[#334155] hover:bg-white hover:text-[#0063FD]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-1">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isActive
                              ? "bg-[#EFF6FF] text-[#0063FD]"
                              : "bg-white text-[#64748B] group-hover:bg-[#EFF6FF] group-hover:text-[#0063FD] border border-[#E2E8F0]"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </div>

                      <div className="flex items-center shrink-0">
                        <ChevronRight
                          className={`h-3 w-3 transition-transform ${
                            isActive
                              ? "text-[#0063FD] translate-x-0.5"
                              : "text-[#94A3B8] group-hover:text-[#0063FD]"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Quick Link to All Categories */}
              <div className="px-3 pt-2 mt-1 border-t border-[#E2E8F0]">
                <Link
                  href="/danh-muc"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-white border border-[#CBD5E1] py-2 text-[11px] font-bold text-[#0F172A] hover:bg-[#EFF6FF] hover:border-[#0063FD] hover:text-[#0063FD] transition-colors shadow-2xs"
                >
                  <span>Xem tất cả danh mục</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Right Column: Detailed Sub-series Grid */}
            <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col justify-between">
              <div className="space-y-5">
                {/* Active Category Header Bar */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#0063FD]">
                      {React.createElement(
                        resolveMegaCategoryIcon(activeCategory.iconName || activeCategory.icon),
                        {
                          className: "h-4 w-4",
                        }
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-[#0F172A] uppercase tracking-wide">
                        {activeCategory.name}
                      </h3>
                      <p className="text-[10px] text-[#64748B]">
                        Linh kiện chính hãng • Bảo hành 1 đổi 1 • Giá tốt nhất
                      </p>
                    </div>
                  </div>

                  <Link
                    href={activeCategory.allUrl}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-black text-[#0063FD] hover:text-[#0052D4] hover:underline"
                  >
                    <span>Xem tất cả</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Subgroups Grid (3 to 4 Columns) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {activeCategory.subGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2.5">
                      <div className="flex items-center gap-1.5 border-b border-[#F1F5F9] pb-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0063FD]" />
                        <h4 className="text-[11px] font-black uppercase text-[#0F172A] tracking-wider truncate">
                          {group.title}
                        </h4>
                      </div>

                      <ul className="space-y-1.5">
                        {group.items.map((item, iIdx) => (
                          <li key={iIdx}>
                            <Link
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={`group inline-flex items-center gap-1.5 text-xs transition-colors ${
                                item.isHighlight
                                  ? "font-bold text-[#0063FD] hover:text-[#0052D4]"
                                  : "text-[#475569] hover:text-[#0063FD] font-medium"
                              }`}
                            >
                              <span className="group-hover:translate-x-0.5 transition-transform truncate">
                                {item.name}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Trust Banner in Sub-Panel */}
              <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#0F172A]">
                    QMD-Tech Cam Kết:
                  </span>
                  <span className="text-[#16A34A] font-medium">
                    100% Linh kiện nguyên seal
                  </span>
                  <span>•</span>
                  <span className="text-[#0063FD] font-medium">
                    Hỗ trợ kỹ thuật 24/7
                  </span>
                  <span>•</span>
                  <span className="text-[#D97706] font-medium">
                    Miễn phí lắp ráp & cài Win
                  </span>
                </div>
                <Link
                  href="/build-pc"
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-[#0063FD] hover:underline"
                >
                  Tự ráp cấu hình PC ngay &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Mobile-friendly accordion for categories inside the Mobile Menu Drawer
 */
export function MobileCategoryAccordion({
  onSelect,
}: {
  onSelect?: () => void;
}) {
  const [categories, setCategories] = useState<MegaCategoryItem[]>(MEGA_MENU_CATEGORIES);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadMenu = () => {
      fetch("/api/menu")
        .then((r) => r.json())
        .then((data) => {
          if (isMounted && data.success && Array.isArray(data.categories) && data.categories.length > 0) {
            setCategories(data.categories);
          }
        })
        .catch(() => {
          // Fallback to default
        });
    };

    loadMenu();

    const handleUpdate = () => loadMenu();
    window.addEventListener("qmd:menu_updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("qmd:menu_updated", handleUpdate);
    };
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-1.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-2.5">
      <div className="flex items-center justify-between pb-1 px-1 border-b border-[#E2E8F0]">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#0F172A]">
          Danh Mục Sản Phẩm
        </span>
        <Link
          href="/danh-muc"
          onClick={onSelect}
          className="text-[10px] font-bold text-[#0063FD]"
        >
          Tất cả &rarr;
        </Link>
      </div>

      <div className="space-y-1 max-h-[340px] overflow-y-auto no-scrollbar">
        {categories.map((cat) => {
          const Icon = resolveMegaCategoryIcon(cat.iconName || cat.icon);
          const isExpanded = expandedId === cat.id;

          return (
            <div
              key={cat.id}
              className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between p-2 text-xs font-bold text-[#0F172A] hover:bg-[#EFF6FF] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#EFF6FF] text-[#0063FD]">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span>{cat.name}</span>
                </div>
                <div className="flex items-center">
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-[#64748B] transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[#F1F5F9] bg-[#F8FAFC] p-2.5 space-y-2.5">
                  <Link
                    href={cat.allUrl}
                    onClick={onSelect}
                    className="block text-[11px] font-bold text-[#0063FD] pb-1 border-b border-[#E2E8F0]"
                  >
                    Xem toàn bộ {cat.name} &rarr;
                  </Link>
                  {cat.subGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-[#64748B]">
                        {group.title}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.slice(0, 6).map((item, iIdx) => (
                          <Link
                            key={iIdx}
                            href={item.href}
                            onClick={onSelect}
                            className="rounded bg-white border border-[#CBD5E1] px-2 py-1 text-[10px] font-medium text-[#334155] hover:border-[#0063FD] hover:text-[#0063FD]"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
