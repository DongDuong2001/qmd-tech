"use client";

import React, { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Phone } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log unexpected exceptions to monitoring service
    console.error("Global Application Boundary Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] uppercase">
            Hệ Thống Đang Gặp Sự Cố Tạm Thời
          </h1>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Đã xảy ra lỗi không mong muốn trong quá trình tải dữ liệu. Vui lòng bấm thử lại hoặc liên hệ bộ phận kỹ thuật để được hỗ trợ.
          </p>
          {error.digest && (
            <div className="font-mono text-[10px] text-[#94A3B8] pt-1">
              Mã lỗi hệ thống: {error.digest}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="md"
            className="w-full text-xs font-bold gap-1.5 shadow-xs"
          >
            <RefreshCw className="h-4 w-4" />
            Thử Tải Lại Trang
          </Button>
          <Link href="/">
            <Button variant="secondary" size="md" className="w-full text-xs font-bold gap-1.5">
              <Home className="h-4 w-4 text-[#0063FD]" />
              Về Trang Chủ
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-center gap-2 text-xs text-[#0F766E]">
          <Phone className="h-3.5 w-3.5" />
          <span>Hotline hỗ trợ kỹ thuật 24/7: <strong>1900.8888</strong></span>
        </div>
      </div>
    </div>
  );
}
