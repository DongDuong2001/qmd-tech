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
    <div className="flex items-center rounded-lg border border-[#232A3B] bg-[#141824] p-0.5 text-xs font-bold">
      <Globe className="ml-1.5 h-3.5 w-3.5 text-[#94A3B8]" />
      <button
        onClick={() => switchLanguage("vi")}
        className={`ml-1 rounded px-1.5 py-0.5 transition-colors ${
          locale === "vi"
            ? "bg-gradient-to-r from-[#EF4444] to-[#F97316] text-white"
            : "text-[#94A3B8] hover:text-white"
        }`}
      >
        VI
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className={`rounded px-1.5 py-0.5 transition-colors ${
          locale === "en"
            ? "bg-gradient-to-r from-[#EF4444] to-[#F97316] text-white"
            : "text-[#94A3B8] hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
