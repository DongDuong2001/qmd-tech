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
    <div className="flex items-center rounded-lg border border-[#2A3040] bg-[#131722] p-0.5 text-xs font-semibold">
      <Globe className="ml-2 h-3.5 w-3.5 text-[#9AA3B2]" />
      <button
        onClick={() => switchLanguage("vi")}
        className={`ml-1.5 rounded-md px-2 py-1 transition-colors ${
          locale === "vi"
            ? "bg-[#3B82F6] text-white"
            : "text-[#9AA3B2] hover:text-[#F2F4F8]"
        }`}
      >
        VI
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className={`rounded-md px-2 py-1 transition-colors ${
          locale === "en"
            ? "bg-[#3B82F6] text-white"
            : "text-[#9AA3B2] hover:text-[#F2F4F8]"
        }`}
      >
        EN
      </button>
    </div>
  );
}
