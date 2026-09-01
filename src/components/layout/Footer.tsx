import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Cpu, ShieldCheck, Truck, Headphones, Wrench } from "lucide-react";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-[#2A3040] bg-[#0B0E14] text-[#9AA3B2]">
      {/* Value Proposition Bar */}
      <div className="border-b border-[#2A3040] bg-[#131722] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1B2030] text-[#3B82F6] border border-[#2A3040]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F2F4F8]">100% Chính Hãng</h4>
              <p className="text-xs text-[#9AA3B2]">Bảo hành chính hãng 12 - 60 tháng</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1B2030] text-[#22C55E] border border-[#2A3040]">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F2F4F8]">Giao Hàng Toàn Quốc</h4>
              <p className="text-xs text-[#9AA3B2]">Miễn phí ship đơn từ 5.000.000₫</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1B2030] text-[#7C3AED] border border-[#2A3040]">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F2F4F8]">Build PC Theo Yêu Cầu</h4>
              <p className="text-xs text-[#9AA3B2]">Lắp ráp, test stress test miễn phí</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1B2030] text-[#FACC15] border border-[#2A3040]">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F2F4F8]">Hỗ Trợ 24/7</h4>
              <p className="text-xs text-[#9AA3B2]">Đội ngũ kỹ sư phần cứng giàu kinh nghiệm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B82F6] text-white">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="text-lg font-extrabold tracking-wider text-[#F2F4F8]">
                QMD<span className="text-[#3B82F6]">-TECH</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#9AA3B2]">{t("footer.about")}</p>
            <div className="text-xs text-[#9AA3B2] space-y-1">
              <p>{t("footer.hotline")}</p>
              <p>{t("footer.address")}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F2F4F8]">
              {t("nav.categories")}
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/danh-muc/cpu" className="hover:text-[#3B82F6] transition-colors">
                  Bộ vi xử lý (CPU)
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/gpu" className="hover:text-[#3B82F6] transition-colors">
                  Card đồ họa (VGA)
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/motherboard" className="hover:text-[#3B82F6] transition-colors">
                  Bo mạch chủ (Mainboard)
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/ram" className="hover:text-[#3B82F6] transition-colors">
                  Bộ nhớ RAM DDR4 / DDR5
                </Link>
              </li>
              <li>
                <Link href="/danh-muc/storage" className="hover:text-[#3B82F6] transition-colors">
                  Ổ cứng SSD NVMe PCIe 4.0/5.0
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F2F4F8]">
              {t("footer.customerSupport")}
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/bao-hanh" className="hover:text-[#3B82F6] transition-colors">
                  {t("footer.warrantyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-[#3B82F6] transition-colors">
                  {t("footer.buyingGuide")}
                </Link>
              </li>
              <li>
                <Link href="/bao-hanh" className="hover:text-[#3B82F6] transition-colors">
                  {t("footer.shippingPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/build-pc" className="text-[#7C3AED] hover:text-[#A78BFA] font-medium transition-colors">
                  Tùy biến PC Builder
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F2F4F8]">
              Phương Thức Thanh Toán
            </h4>
            <p className="mt-4 text-xs text-[#9AA3B2] leading-relaxed">
              Hỗ trợ thanh toán linh hoạt qua cổng VNPay, ví MoMo, ZaloPay, chuyển khoản ngân hàng và COD toàn quốc.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded bg-[#1B2030] px-2.5 py-1 text-[11px] font-bold text-[#F2F4F8] border border-[#2A3040]">
                VNPAY
              </span>
              <span className="rounded bg-[#1B2030] px-2.5 py-1 text-[11px] font-bold text-[#EC4899] border border-[#2A3040]">
                MoMo
              </span>
              <span className="rounded bg-[#1B2030] px-2.5 py-1 text-[11px] font-bold text-[#3B82F6] border border-[#2A3040]">
                ZaloPay
              </span>
              <span className="rounded bg-[#1B2030] px-2.5 py-1 text-[11px] font-bold text-[#22C55E] border border-[#2A3040]">
                COD
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#2A3040] pt-6 text-center text-xs text-[#9AA3B2]">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
