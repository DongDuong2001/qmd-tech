"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { authService } from "@/modules/auth/service";
import { supabase } from "@/shared/db/supabase";
import { Order, CustomBuild } from "@/shared/types";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  ShoppingBag,
  Wrench,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Lock,
  Phone,
  Settings,
} from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // User Profile Data
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userBuilds, setUserBuilds] = useState<CustomBuild[]>([]);

  useEffect(() => {
    async function checkUser() {
      setLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        if (currentUser?.email) {
          loadUserData(currentUser.email);
        }
      } catch (err) {
        console.warn("Auth check notice:", err);
      } finally {
        setLoading(false);
      }
    }

    checkUser();

    const { data: authListener } = authService.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user?.email) {
        loadUserData(session.user.email);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (email: string) => {
    try {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("customer_email", email)
        .order("created_at", { ascending: false });

      setUserOrders((ordersData || []) as Order[]);

      const { data: buildsData } = await supabase
        .from("builds")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setUserBuilds((buildsData || []) as CustomBuild[]);
    } catch (err) {
      console.warn("Failed to load user records:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const data = await authService.signIn({
        email: loginEmail,
        password: loginPassword,
      });

      if (data.user) {
        setUser(data.user);
        setFeedback({ type: "success", text: "Đăng nhập thành công! Đang chuyển hướng..." });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.";
      setFeedback({
        type: "error",
        text: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const data = await authService.signUp({
        email: regEmail,
        password: regPassword,
        fullName: regFullName,
        phone: regPhone,
      });

      if (data.user) {
        setFeedback({
          type: "success",
          text: "Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.",
        });
        setAuthMode("login");
        setLoginEmail(regEmail);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đăng ký thất bại. Vui lòng thử lại với email khác.";
      setFeedback({
        type: "error",
        text: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setUserOrders([]);
      setFeedback({ type: "success", text: "Đã đăng xuất tài khoản thành công." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFeedback({ type: "error", text: "Lỗi đăng xuất: " + msg });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xs text-[#64748B]">
        Đang kiểm tra trạng thái xác thực người dùng...
      </div>
    );
  }

  // 1. Authenticated User View
  if (user) {
    const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Khách Hàng";
    const phone = user.user_metadata?.phone || "Chưa cập nhật";

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {/* User Greeting & Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              <UserIcon className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#0F172A]">{fullName}</h1>
                <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[10px] font-black text-[#1D4ED8] uppercase">
                  Thành viên QMD
                </span>
              </div>
              <p className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
                <span>{user.email}</span> • <span>SĐT: {phone}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin">
              <Button variant="secondary" size="sm" className="gap-1.5 font-bold text-xs">
                <Settings className="h-4 w-4 text-[#EA580C]" /> Admin Dashboard
              </Button>
            </Link>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="gap-1.5 font-bold text-xs text-[#B91C1C] hover:bg-[#FEE2E2]"
            >
              <LogOut className="h-4 w-4" /> Đăng xuất
            </Button>
          </div>
        </div>

        {/* User Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Order History */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-4">
                <h2 className="text-base font-black uppercase text-[#0F172A] flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-[#E11D48]" /> Lịch Sử Đơn Hàng Của Bạn
                </h2>
                <span className="text-xs font-bold text-[#64748B]">{userOrders.length} đơn hàng</span>
              </div>

              {userOrders.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#64748B]">
                  <ShoppingBag className="mx-auto h-8 w-8 text-[#CBD5E1] mb-2" />
                  <p className="font-bold text-[#0F172A]">Bạn chưa có đơn hàng nào.</p>
                  <p className="mt-1">Hãy khám phá linh kiện và đặt hàng ngay hôm nay!</p>
                  <Link href="/danh-muc" className="mt-3 inline-block">
                    <Button variant="primary" size="sm" className="text-xs font-bold">
                      Mua sắm ngay
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0F172A] text-xs">
                            {order.order_code}
                          </span>
                          <span className="rounded bg-[#DCFCE7] border border-[#86EFAC] px-2 py-0.2 text-[10px] font-bold text-[#15803D] uppercase">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-1">
                          Ngày đặt: {order.created_at ? new Date(order.created_at).toLocaleDateString("vi-VN") : "Hôm nay"} • {order.payment_method.toUpperCase()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-sm font-black text-[#B45309]">
                          {new Intl.NumberFormat("vi-VN").format(order.total_vnd)}₫
                        </div>
                        <span className="text-[10px] text-[#16A34A] font-semibold">Đã ghi nhận</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Account Info & Saved Builds */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0F172A] border-b border-[#E2E8F0] pb-3">
                Thông Tin Bảo Mật
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Email:</span>
                  <span className="font-bold text-[#0F172A]">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Xác thực:</span>
                  <span className="font-bold text-[#16A34A]">Supabase Auth Live</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Ngày tham gia:</span>
                  <span className="font-mono text-[#0F172A]">
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-[#EA580C]" /> Cấu Hình PC Đã Lưu
                </h3>
              </div>

              {userBuilds.length === 0 ? (
                <div className="text-xs text-[#64748B] text-center py-4">
                  Chưa có cấu hình PC nào được lưu.
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {userBuilds.map((b) => (
                    <Link
                      key={b.id}
                      href={`/build-pc/${b.share_token || b.id}`}
                      className="block p-2.5 rounded-lg border border-[#E2E8F0] hover:border-[#E11D48] transition-colors"
                    >
                      <div className="font-bold text-[#0F172A] flex justify-between">
                        <span>Cấu hình #{(b.share_token || b.id).slice(0, 8)}</span>
                        <span className="font-mono text-[#B45309]">
                          {new Intl.NumberFormat("vi-VN").format(b.total_price_vnd)}₫
                        </span>
                      </div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">
                        Công suất: ~{b.estimated_wattage}W
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <Link href="/build-pc" className="block pt-2">
                <Button variant="primary" size="sm" className="w-full text-xs font-bold">
                  Tạo Cấu Hình PC Mới
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login / Register View
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-8 shadow-sm space-y-6">
        {/* Header Tabs */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black uppercase text-[#0F172A]">
            {authMode === "login" ? "ĐĂNG NHẬP TÀI KHOẢN" : "ĐĂNG KÝ THÀNH VIÊN"}
          </h1>
          <p className="text-xs text-[#64748B]">
            Hệ thống quản lý khách hàng & đơn hàng bảo mật qua Supabase
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1">
          <button
            onClick={() => {
              setAuthMode("login");
              setFeedback(null);
            }}
            className={`rounded-md py-1.5 text-xs font-extrabold uppercase transition-colors ${
              authMode === "login"
                ? "bg-[#FFFFFF] text-[#E11D48] shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => {
              setAuthMode("register");
              setFeedback(null);
            }}
            className={`rounded-md py-1.5 text-xs font-extrabold uppercase transition-colors ${
              authMode === "register"
                ? "bg-[#FFFFFF] text-[#E11D48] shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Đăng ký mới
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`rounded-lg p-3 text-xs font-bold flex items-center gap-2 ${
              feedback.type === "success"
                ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
                : "bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Form: Login */}
        {authMode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Địa chỉ Email *</label>
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Mật khẩu *</label>
              <div className="relative">
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="md"
              className="w-full font-black uppercase text-xs shadow-xs"
            >
              {isSubmitting ? "Đang xác thực..." : "Đăng Nhập"}
            </Button>
          </form>
        ) : (
          /* Form: Register */
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Họ và tên *</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
                />
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Số điện thoại *</label>
              <div className="relative">
                <input
                  required
                  type="tel"
                  placeholder="0901234567"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
                />
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Địa chỉ Email *</label>
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Mật khẩu (Tối thiểu 6 ký tự) *</label>
              <div className="relative">
                <input
                  required
                  minLength={6}
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="md"
              className="w-full font-black uppercase text-xs shadow-xs"
            >
              {isSubmitting ? "Đang tạo tài khoản..." : "Đăng Ký Tài Khoản"}
            </Button>
          </form>
        )}

        {/* Footer info */}
        <div className="border-t border-[#E2E8F0] pt-4 text-center text-[10px] text-[#64748B]">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
            Bảo mật thông tin khách hàng tuyệt đối
          </p>
        </div>
      </div>
    </div>
  );
}
