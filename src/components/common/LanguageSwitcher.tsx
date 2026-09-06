"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: "vi" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-white p-0.5 text-xs font-semibold shadow-2xs">
      <Globe className="ml-1.5 h-3.5 w-3.5 text-[#64748B]" />
      <button
        onClick={() => switchLanguage("vi")}
        className={`ml-1 rounded px-1.5 py-0.5 transition-colors ${
          locale === "vi"
            ? "bg-[#0063FD] text-white"
            : "text-[#64748B] hover:text-[#0F172A]"
        }`}
      >
        VI
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className={`rounded px-1.5 py-0.5 transition-colors ${
          locale === "en"
            ? "bg-[#0063FD] text-white"
            : "text-[#64748B] hover:text-[#0F172A]"
        }`}
      >
        EN
      </button>
    </div>
  );
}
