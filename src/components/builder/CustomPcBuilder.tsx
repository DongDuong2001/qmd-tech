"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ComponentSlot, Product, PerformanceTier } from "@/shared/types";
import { compatibilityEngine } from "@/modules/builder/compatibilityEngine";
import { builderService } from "@/modules/builder/service";
import { i18nService } from "@/modules/i18n/service";
import { MOCK_PRODUCTS } from "@/modules/catalog/mockData";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import { ProductCard } from "../product/ProductCard";
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
  Sparkles,
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

export function CustomPcBuilder() {
  const t = useTranslations();
  const locale = useLocale() as "vi" | "en";

  const [selectedSlots, setSelectedSlots] = useState<Record<ComponentSlot, Product | null>>({
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    storage: null,
    psu: null,
    case: null,
    cooling: null,
  });

  const [activeSlotPicker, setActiveSlotPicker] = useState<ComponentSlot | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState("");
  const [shareSuccessMsg, setShareSuccessMsg] = useState("");

  // Live evaluation via Compatibility Engine
  const evaluation = useMemo(() => {
    return compatibilityEngine.evaluate(selectedSlots);
  }, [selectedSlots]);

  const handleSelectProduct = (slot: ComponentSlot, product: Product) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [slot]: product,
    }));
    setActiveSlotPicker(null);
  };

  const handleRemoveProduct = (slot: ComponentSlot) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [slot]: null,
    }));
  };

  const handleClearAll = () => {
    setSelectedSlots({
      cpu: null,
      motherboard: null,
      ram: null,
      gpu: null,
      storage: null,
      psu: null,
      case: null,
      cooling: null,
    });
  };

  const handleShareBuild = async () => {
    const build = builderService.evaluateBuild(selectedSlots);
    const { shareToken } = await builderService.saveBuild(build);
    const shareUrl = `${window.location.origin}/${locale}/build-pc/${shareToken}`;

    navigator.clipboard.writeText(shareUrl);
    setShareSuccessMsg(t("builder.shareSuccess"));
    setTimeout(() => setShareSuccessMsg(""), 4000);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const build = builderService.evaluateBuild(selectedSlots);
    await builderService.requestQuote({
      build,
      customerName: quoteForm.name,
      customerPhone: quoteForm.phone,
      customerEmail: quoteForm.email,
      note: quoteForm.notes,
    });

    setQuoteSuccessMsg(t("builder.quoteSuccess"));
    setTimeout(() => {
      setQuoteSuccessMsg("");
      setIsQuoteModalOpen(false);
      setQuoteForm({ name: "", phone: "", email: "", notes: "" });
    }, 3000);
  };

  const getTierLabel = (tier: PerformanceTier) => {
    switch (tier) {
      case "enthusiast":
        return t("builder.tierEnthusiast");
      case "high_end":
        return t("builder.tierHighEnd");
      case "mid_range":
        return t("builder.tierMidRange");
      default:
        return t("builder.tierBudget");
    }
  };

  // Filter products for the active picker modal
  const availableSlotProducts = useMemo(() => {
    if (!activeSlotPicker) return [];
    const config = SLOTS_CONFIG.find((s) => s.slot === activeSlotPicker);
    if (!config) return [];

    return MOCK_PRODUCTS.filter((p) => {
      // Find matching category
      return p.category_id.includes(config.categorySlug) || p.sku.toLowerCase().includes(config.categorySlug);
    });
  }, [activeSlotPicker]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#2A3040] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 items-center rounded bg-[#7C3AED] px-2.5 text-xs font-bold text-white uppercase tracking-wider">
              {t("nav.builder")}
            </span>
            <span className="text-xs text-[#9AA3B2]">AI Hardware Engine v2.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F2F4F8]">
            {t("builder.title")}
          </h1>
          <p className="mt-1 text-sm text-[#9AA3B2] max-w-2xl">
            {t("builder.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleClearAll}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Làm mới
          </Button>

          <Button
            onClick={handleShareBuild}
            variant="secondary"
            size="sm"
            className="text-xs gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            {t("builder.saveBuild")}
          </Button>
        </div>
      </div>

      {shareSuccessMsg && (
        <div className="mb-6 rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 p-3 text-sm text-[#22C55E] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {shareSuccessMsg}
        </div>
      )}

      {/* Main Builder Grid: Slots on Left, Metrics & Summary on Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Component Slots (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {SLOTS_CONFIG.map(({ slot, icon: SlotIcon }) => {
            const selectedProduct = selectedSlots[slot];
            const slotTitle = t(`builder.slots.${slot}`);

            return (
              <div
                key={slot}
                className={`rounded-xl border transition-all duration-200 p-4 ${
                  selectedProduct
                    ? "border-[#2A3040] bg-[#131722]"
                    : "border-dashed border-[#2A3040] bg-[#0B0E14]/60 hover:border-[#3B82F6]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Slot Icon & Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                        selectedProduct
                          ? "border-[#3B82F6]/50 bg-[#3B82F6]/10 text-[#3B82F6]"
                          : "border-[#2A3040] bg-[#1B2030] text-[#9AA3B2]"
                      }`}
                    >
                      <SlotIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#9AA3B2]">
                        {slotTitle}
                      </span>

                      {selectedProduct ? (
                        <div className="truncate text-sm font-bold text-[#F2F4F8]">
                          {i18nService.getLocalizedProductName(selectedProduct, locale)}
                        </div>
                      ) : (
                        <div className="text-xs text-[#9AA3B2] italic">
                          Chưa chọn linh kiện
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center gap-3 shrink-0">
                    {selectedProduct ? (
                      <>
                        <span className="font-mono text-sm font-bold text-[#FACC15]">
                          {i18nService.formatPrice(selectedProduct.price_vnd, locale, selectedProduct.price_usd)}
                        </span>
                        <Button
                          onClick={() => setActiveSlotPicker(slot)}
                          variant="secondary"
                          size="sm"
                          className="text-xs"
                        >
                          {t("builder.changeComponent")}
                        </Button>
                        <Button
                          onClick={() => handleRemoveProduct(slot)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#EF4444] hover:bg-[#EF4444]/10"
                          title={t("builder.removeComponent")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setActiveSlotPicker(slot)}
                        variant="primary"
                        size="sm"
                        className="gap-1 text-xs font-semibold"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {t("builder.chooseComponent")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Compatibility Summary & Actions (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Box */}
          <div className="rounded-xl border border-[#2A3040] bg-[#131722] p-5 shadow-sm space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F2F4F8] border-b border-[#2A3040] pb-3">
              Trạng Thái Tương Thích & Hiệu Năng
            </h3>

            {/* Compatibility Status Badge */}
            <div>
              {evaluation.status === "compatible" && (
                <div className="flex items-center gap-2.5 rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 p-3 text-xs font-semibold text-[#22C55E]">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>{t("builder.statusCompatible")}</span>
                </div>
              )}

              {evaluation.status === "warning" && (
                <div className="flex items-center gap-2.5 rounded-lg border border-[#F59E0B]/40 bg-[#F59E0B]/10 p-3 text-xs font-semibold text-[#F59E0B]">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>{t("builder.statusWarning")}</span>
                </div>
              )}

              {evaluation.status === "incompatible" && (
                <div className="flex items-center gap-2.5 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 p-3 text-xs font-semibold text-[#EF4444]">
                  <XCircle className="h-5 w-5 shrink-0" />
                  <span>{t("builder.statusIncompatible")}</span>
                </div>
              )}

              {/* Detailed Issue Alerts */}
              {evaluation.issues.length > 0 && (
                <div className="mt-3 space-y-2">
                  {evaluation.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`rounded-md p-2.5 text-xs ${
                        issue.severity === "error"
                          ? "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                          : "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                      }`}
                    >
                      {locale === "en" ? issue.message_en : issue.message_vi}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wattage & Power Estimates */}
            <div className="rounded-lg border border-[#2A3040] bg-[#0B0E14] p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9AA3B2] flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#FACC15]" />
                  {t("builder.estimatedWattage")}:
                </span>
                <span className="font-mono font-bold text-[#F2F4F8]">
                  ~{evaluation.estimatedWattage} W
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9AA3B2]">
                  {t("builder.recommendedPsu")}:
                </span>
                <span className="font-mono font-bold text-[#3B82F6]">
                  {evaluation.recommendedPsuWattage} W+
                </span>
              </div>
            </div>

            {/* Performance Tier */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9AA3B2] mb-1.5">
                {t("builder.performanceTier")}
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#7C3AED]" />
                <span className="text-sm font-bold text-[#F2F4F8]">
                  {getTierLabel(evaluation.performanceTier)}
                </span>
              </div>
            </div>

            {/* Total Price */}
            <div className="border-t border-[#2A3040] pt-4">
              <div className="text-xs text-[#9AA3B2]">{t("builder.totalPrice")}</div>
              <div className="text-2xl font-black font-mono text-[#FACC15] mt-1">
                {i18nService.formatPrice(evaluation.totalPriceVnd, locale)}
              </div>
            </div>

            {/* Primary Action Button: Request Quote & Assembly */}
            <Button
              onClick={() => setIsQuoteModalOpen(true)}
              variant="accent"
              size="lg"
              className="w-full gap-2 font-bold shadow-md"
            >
              <Send className="h-4 w-4" />
              {t("builder.requestQuote")}
            </Button>
          </div>
        </div>
      </div>

      {/* Component Picker Modal */}
      <Modal
        isOpen={activeSlotPicker !== null}
        onClose={() => setActiveSlotPicker(null)}
        title={activeSlotPicker ? t(`builder.slots.${activeSlotPicker}`) : ""}
        description="Chọn linh kiện tương thích từ kho hàng QMD-Tech"
        maxWidth="4xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[65vh] overflow-y-auto pr-1">
          {availableSlotProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isBuilderMode={true}
              onSelectForBuild={(p) => activeSlotPicker && handleSelectProduct(activeSlotPicker, p)}
            />
          ))}
        </div>
      </Modal>

      {/* Request Custom Assembly Quote Modal */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        title={t("builder.quoteModalTitle")}
        description={t("builder.quoteModalSubtitle")}
        maxWidth="lg"
      >
        {quoteSuccessMsg ? (
          <div className="rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 p-4 text-sm text-[#22C55E] flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {quoteSuccessMsg}
          </div>
        ) : (
          <form onSubmit={handleQuoteSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#9AA3B2] mb-1">
                {t("builder.fullName")} *
              </label>
              <input
                required
                type="text"
                value={quoteForm.name}
                onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2.5 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#9AA3B2] mb-1">
                  {t("builder.phone")} *
                </label>
                <input
                  required
                  type="tel"
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2.5 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#9AA3B2] mb-1">
                  {t("builder.email")}
                </label>
                <input
                  type="email"
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                  className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2.5 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#9AA3B2] mb-1">
                {t("builder.notes")}
              </label>
              <textarea
                rows={3}
                value={quoteForm.notes}
                onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                placeholder="VD: Cần lắp thêm 3 fan ARGB, ép xung nhẹ, cài đặt Windows 11..."
                className="w-full rounded-lg border border-[#2A3040] bg-[#0B0E14] px-3.5 py-2.5 text-sm text-[#F2F4F8] focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="accent" size="md" className="w-full font-bold">
                {t("builder.submitQuote")}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
