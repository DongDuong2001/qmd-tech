"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Product, ComponentSlot, CustomBuild } from "@/shared/types";
import { builderService } from "@/modules/builder/service";
import { catalogService } from "@/modules/catalog/service";
import { i18nService } from "@/modules/i18n/service";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Cpu,
  CircuitBoard,
  MemoryStick,
  Layers,
  HardDrive,
  Zap,
  Box,
  Fan,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  Send,
  Plus,
  Trash2,
  RefreshCw,
  Gauge,
  Wrench,
} from "lucide-react";

const SLOTS_CONFIG: { slot: ComponentSlot; icon: React.ElementType; categorySlug: string }[] = [
  { slot: "cpu", icon: Cpu, categorySlug: "cpu" },
  { slot: "motherboard", icon: CircuitBoard, categorySlug: "motherboard" },
  { slot: "ram", icon: MemoryStick, categorySlug: "ram" },
  { slot: "gpu", icon: Layers, categorySlug: "gpu" },
  { slot: "storage", icon: HardDrive, categorySlug: "storage" },
  { slot: "psu", icon: Zap, categorySlug: "psu" },
  { slot: "case", icon: Box, categorySlug: "case" },
  { slot: "cooling", icon: Fan, categorySlug: "cooling" },
];

const INITIAL_SLOTS: Record<ComponentSlot, Product | null> = {
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  storage: null,
  psu: null,
  case: null,
  cooling: null,
};

interface CustomPcBuilderProps {
  initialBuild?: CustomBuild | null;
}

export function CustomPcBuilder({ initialBuild }: CustomPcBuilderProps) {
  const t = useTranslations();
  const locale = useLocale() as "vi" | "en";

  const [selectedSlots, setSelectedSlots] = useState<Record<ComponentSlot, Product | null>>(INITIAL_SLOTS);
  const [activeSlotPicker, setActiveSlotPicker] = useState<ComponentSlot | null>(null);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [shareSuccessMsg, setShareSuccessMsg] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string | null>(null);

  // Load products from Supabase on mount
  useEffect(() => {
    async function loadCatalog() {
      setLoadingProducts(true);
      try {
        const { products } = await catalogService.getProducts({ limit: 100 });
        setDbProducts(products);

        // Pre-fill initial build if editing
        if (initialBuild && initialBuild.items) {
          setSelectedSlots(initialBuild.items);
        }
      } catch (err) {
        console.error("Failed to fetch builder catalog:", err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadCatalog();
  }, [initialBuild]);

  // Handle slot product select
  const handleSelectProduct = (slot: ComponentSlot, product: Product) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [slot]: product,
    }));
    setActiveSlotPicker(null);
  };

  // Handle product remove
  const handleRemoveProduct = (slot: ComponentSlot) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [slot]: null,
    }));
  };

  // Handle clear all
  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn làm mới toàn bộ cấu hình đang chọn?")) {
      setSelectedSlots(INITIAL_SLOTS);
    }
  };

  // Real-time Hardware Compatibility & Power Engine
  const evaluation = useMemo(() => {
    return builderService.evaluateBuild(selectedSlots);
  }, [selectedSlots]);

  // Handle share build
  const handleShareBuild = async () => {
    try {
      const res = await builderService.saveBuild(evaluation);
      const url = `${window.location.origin}/${locale}/build-pc/${res.shareToken || res.id}`;
      await navigator.clipboard.writeText(url);
      setShareSuccessMsg("Đã sao chép liên kết cấu hình vào clipboard thành công!");
      setTimeout(() => setShareSuccessMsg(null), 4000);
    } catch {
      setShareSuccessMsg("Lưu cấu hình thành công!");
      setTimeout(() => setShareSuccessMsg(null), 4000);
    }
  };

  // Submit quote request
  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccessMsg("Yêu cầu báo giá của bạn đã được gửi thành công! Kỹ thuật viên sẽ liên hệ trong ít phút.");
    setTimeout(() => {
      setIsQuoteModalOpen(false);
      setQuoteSuccessMsg(null);
      setQuoteForm({ name: "", phone: "", email: "", notes: "" });
    }, 3000);
  };

  // Filter products for the active modal picker
  const availableSlotProducts = useMemo(() => {
    if (!activeSlotPicker) return [];
    const config = SLOTS_CONFIG.find((c) => c.slot === activeSlotPicker);
    if (!config) return [];

    return dbProducts.filter((p) => {
      return (
        p.category_id?.toLowerCase().includes(config.categorySlug) ||
        p.sku?.toLowerCase().includes(config.categorySlug) ||
        p.name_vi?.toLowerCase().includes(config.categorySlug)
      );
    });
  }, [activeSlotPicker, dbProducts]);

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "extreme":
        return "Extreme Workstation / 4K Gaming";
      case "high_end":
        return "Cao Cấp (High-End 2K 144Hz)";
      case "mid_range":
        return "Tầm Trung (Mid-Range 1080p Ultra)";
      default:
        return "Phổ Thông / Esport Gaming";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1 rounded bg-[#0063FD] px-2.5 py-1 text-[11px] font-black text-white uppercase tracking-wider shadow-xs">
              <Wrench className="h-3.5 w-3.5" />
              CÔNG CỤ BUILD PC CHUYÊN NGHIỆP
            </span>
            <span className="text-xs text-[#0063FD] font-mono font-semibold">Tự động kiểm tra Socket & Công suất</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#0F172A]">
            TỰ XÂY DỰNG CẤU HÌNH PC THEO Ý BẠN
          </h1>
          <p className="mt-1 text-xs text-[#64748B] max-w-2xl">
            Tự động kiểm tra tương thích chân socket CPU / Mainboard, thế hệ RAM và công suất nguồn tiêu chuẩn an toàn.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleClearAll}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 font-bold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Làm mới
          </Button>

          <Button
            onClick={handleShareBuild}
            variant="secondary"
            size="sm"
            className="text-xs gap-1.5 font-bold text-[#0063FD] border-[#CBD5E1]"
          >
            <Share2 className="h-3.5 w-3.5" />
            Chia sẻ cấu hình
          </Button>
        </div>
      </div>

      {shareSuccessMsg && (
        <div className="rounded-lg border border-[#86EFAC] bg-[#DCFCE7] p-3 text-xs text-[#15803D] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {shareSuccessMsg}
        </div>
      )}

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Component Slots */}
        <div className="lg:col-span-8 space-y-3">
          {SLOTS_CONFIG.map(({ slot, icon: SlotIcon }) => {
            const selectedProduct = selectedSlots[slot];
            const slotTitle = t(`builder.slots.${slot}`);

            return (
              <div
                key={slot}
                className={`rounded-xl border transition-all duration-200 p-3.5 sm:p-4 ${
                  selectedProduct
                    ? "border-[#E2E8F0] bg-[#FFFFFF] shadow-xs"
                    : "border-dashed border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#0063FD]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Slot Icon & Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg border ${
                        selectedProduct
                          ? "border-[#BFDBFE] bg-[#EFF6FF] text-[#0063FD]"
                          : "border-[#E2E8F0] bg-[#FFFFFF] text-[#64748B]"
                      }`}
                    >
                      <SlotIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">
                        {slotTitle}
                      </span>

                      {selectedProduct ? (
                        <div className="truncate text-xs sm:text-sm font-bold text-[#0F172A]">
                          {i18nService.getLocalizedProductName(selectedProduct, locale)}
                        </div>
                      ) : (
                        <div className="text-xs text-[#94A3B8] italic">
                          Chưa chọn linh kiện
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                    {selectedProduct ? (
                      <>
                        <span className="font-mono text-sm font-black text-[#0063FD]">
                          {i18nService.formatPrice(selectedProduct.price_vnd, locale, selectedProduct.price_usd)}
                        </span>
                        <Button
                          onClick={() => setActiveSlotPicker(slot)}
                          variant="secondary"
                          size="sm"
                          className="text-[11px] sm:text-xs font-bold"
                        >
                          Đổi linh kiện
                        </Button>
                        <Button
                          onClick={() => handleRemoveProduct(slot)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#DC2626] hover:bg-[#FEE2E2]"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setActiveSlotPicker(slot)}
                        variant="primary"
                        size="sm"
                        className="gap-1 text-[11px] sm:text-xs font-bold"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Chọn linh kiện
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Compatibility Summary & Actions (Sticky on Desktop) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="lg:sticky lg:top-24 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0F172A] border-b border-[#E2E8F0] pb-3">
              Trạng Thái Tương Thích & Đề Xuất
            </h3>

            {/* Compatibility Status Badge */}
            <div>
              {evaluation.compatibility_status === "compatible" && (
                <div className="flex items-center gap-2 rounded-lg border border-[#86EFAC] bg-[#DCFCE7] p-3 text-xs font-bold text-[#15803D]">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Tương Thích Tuyệt Đối 100%</span>
                </div>
              )}

              {evaluation.compatibility_status === "warning" && (
                <div className="flex items-center gap-2 rounded-lg border border-[#BAE6FD] bg-[#E0F2FE] p-3 text-xs font-bold text-[#0284C7]">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>Cảnh Báo Công Suất / Kích Thước</span>
                </div>
              )}

              {evaluation.compatibility_status === "incompatible" && (
                <div className="flex items-center gap-2 rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] p-3 text-xs font-bold text-[#B91C1C]">
                  <XCircle className="h-5 w-5 shrink-0" />
                  <span>Không Tương Thích Socket / Chuẩn RAM</span>
                </div>
              )}

              {/* Detailed Issue Alerts */}
              {evaluation.issues && evaluation.issues.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {evaluation.issues.map((issue, idx: number) => (
                    <div
                      key={idx}
                      className={`rounded p-2 text-xs font-semibold ${
                        issue.severity === "error"
                          ? "bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]"
                          : "bg-[#EFF6FF] text-[#0063FD] border border-[#BFDBFE]"
                      }`}
                    >
                      {locale === "en" ? issue.message_en : issue.message_vi}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wattage & Power Estimates */}
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#0063FD]" />
                  Điện năng tiêu thụ ước tính:
                </span>
                <span className="font-mono font-black text-[#0F172A]">
                  ~{evaluation.estimated_wattage} W
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">
                  Nguồn PSU khuyến nghị:
                </span>
                <span className="font-mono font-black text-[#0063FD]">
                  {evaluation.recommended_psu_wattage} W+ Gold
                </span>
              </div>
            </div>

            {/* Performance Tier */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-[#64748B] mb-1">
                Phân khúc cấu hình
              </div>
              <div className="flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-[#0063FD]" />
                <span className="text-xs font-black text-[#0063FD]">
                  {getTierLabel(evaluation.performance_tier)}
                </span>
              </div>
            </div>

            {/* Total Price */}
            <div className="border-t border-[#E2E8F0] pt-4">
              <div className="text-xs text-[#64748B]">Tổng tiền linh kiện:</div>
              <div className="text-2xl font-black font-mono text-[#0063FD] mt-1">
                {i18nService.formatPrice(evaluation.total_price_vnd, locale)}
              </div>
              <div className="text-[10px] text-[#15803D] mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-[#16A34A] shrink-0" />
                <span>Miễn phí công lắp ráp + Cài đặt phần mềm trọn đời</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <Button
              onClick={() => setIsQuoteModalOpen(true)}
              variant="primary"
              size="lg"
              className="w-full gap-2 text-xs font-black uppercase tracking-wider shadow-xs"
            >
              <Send className="h-4 w-4" />
              Yêu Cầu Báo Giá & Ráp Máy
            </Button>
          </div>
        </div>
      </div>

      {/* Component Picker Modal */}
      <Modal
        isOpen={activeSlotPicker !== null}
        onClose={() => setActiveSlotPicker(null)}
        title={activeSlotPicker ? t(`builder.slots.${activeSlotPicker}`) : ""}
        description="Chọn linh kiện chính hãng từ kho dữ liệu thực tế QMD-Tech"
        maxWidth="4xl"
      >
        {loadingProducts ? (
          <div className="py-12 text-center text-xs text-[#64748B]">
            Đang tải danh sách linh kiện từ Supabase...
          </div>
        ) : availableSlotProducts.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64748B]">
            <p className="font-bold text-[#0F172A]">Chưa có linh kiện nào thuộc danh mục này trong cơ sở dữ liệu.</p>
            <p className="mt-1">Bạn có thể thêm linh kiện mới trong <Link href="/admin" className="text-[#0063FD] underline font-bold">Admin Dashboard</Link>.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[65vh] overflow-y-auto pr-1">
            {availableSlotProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isBuilderMode={true}
                onSelectForBuild={(p) => activeSlotPicker && handleSelectProduct(activeSlotPicker, p)}
              />
            ))}
          </div>
        )}
      </Modal>

      {/* Request Custom Assembly Quote Modal */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        title="YÊU CẦU BÁO GIÁ & LẮP RÁP PC GAMING"
        description="Kỹ sư phần cứng QMD-Tech sẽ liên hệ tư vấn và chốt cấu hình trong 15 phút"
        maxWidth="lg"
      >
        {quoteSuccessMsg ? (
          <div className="rounded-lg border border-[#86EFAC] bg-[#DCFCE7] p-4 text-xs text-[#15803D] flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {quoteSuccessMsg}
          </div>
        ) : (
          <form onSubmit={handleQuoteSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                Họ và tên quý khách *
              </label>
              <input
                required
                type="text"
                value={quoteForm.name}
                onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Số điện thoại *
                </label>
                <input
                  required
                  type="tel"
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                Yêu cầu bổ sung (Gắn thêm fan RGB, tản nhiệt, ép xung...)
              </label>
              <textarea
                rows={3}
                value={quoteForm.notes}
                onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="md" className="w-full font-black uppercase text-xs">
                Gửi Yêu Cầu Báo Giá
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
