"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, User, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || `/${locale}/admin`;

  const [username, setUsername] = useState("admin@qmd.tech");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, passcode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Xác thực thất bại.");
      }

      setSuccessMsg("Xác thực thành công! Đang chuyển hướng vào hệ thống...");
      setTimeout(() => {
        router.push(redirectPath);
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi xác thực hệ thống.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 selection:bg-[#0063FD] selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full border-2 border-[#0063FD] bg-white shadow-md overflow-hidden relative mb-2">
            <Image
              src="/qmdtech_logo.png"
              alt="QMD-Tech Logo"
              fill
              sizes="64px"
              priority
              className="object-cover"
            />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-2xl font-black tracking-wider text-[#0F172A]">
              QMD<span className="text-[#0063FD]">-TECH</span>
            </span>
            <span className="rounded bg-[#0063FD] px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
              ADMIN
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            Hệ thống Quản trị & Điều hành Dữ liệu Phần cứng QMD-Tech
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
            <ShieldCheck className="h-5 w-5 text-[#0063FD]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0F172A]">
              Xác Thực Quyền Quản Trị Viên
            </h2>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-3.5 text-xs text-[#B91C1C] flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="rounded-xl border border-[#86EFAC] bg-[#DCFCE7] p-3.5 text-xs text-[#15803D] flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1.5">
                Tài khoản Quản trị
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@qmd.tech"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2.5 pl-9 pr-3 text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:border-[#0063FD] focus:outline-none"
                />
                <User className="absolute left-3 top-3 h-4 w-4 text-[#64748B]" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1.5">
                Mật mã bảo mật (Admin Passcode)
              </label>
              <div className="relative">
                <input
                  required
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Nhập mật mã quản trị..."
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2.5 pl-9 pr-3 text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:border-[#0063FD] focus:outline-none font-mono"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#64748B]" />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                size="lg"
                className="w-full font-black uppercase text-xs tracking-wider gap-2 shadow-md py-3"
              >
                {loading ? "Đang xác thực..." : "Đăng Nhập Vào Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="text-center text-[10px] text-[#64748B] pt-2 border-t border-[#E2E8F0]">
            Phiên đăng nhập được mã hóa và bảo vệ bằng HTTPOnly Cookie an toàn.
          </div>
        </div>
      </div>
    </div>
  );
}
