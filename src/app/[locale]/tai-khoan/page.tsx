"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { authService, AuthUser } from "@/modules/auth/service";
import { supabase } from "@/shared/db/supabase";
import { Order, CustomBuild } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { createHugeIconComponent } from "@/components/ui/HugeIcon";
import {
  UserIcon as HugeUserIcon,
  ShoppingBag01Icon,
  Wrench01Icon,
  LogOutIcon,
  CheckmarkCircle02Icon,
  Alert02Icon,
  Mail01Icon,
  LockIcon,
  PhoneIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

const UserIcon = createHugeIconComponent(HugeUserIcon);
const ShoppingBag = createHugeIconComponent(ShoppingBag01Icon);
const Wrench = createHugeIconComponent(Wrench01Icon);
const LogOut = createHugeIconComponent(LogOutIcon);
const CheckCircle2 = createHugeIconComponent(CheckmarkCircle02Icon);
const AlertTriangle = createHugeIconComponent(Alert02Icon);
const Mail = createHugeIconComponent(Mail01Icon);
const Lock = createHugeIconComponent(LockIcon);
const Phone = createHugeIconComponent(PhoneIcon);
const Eye = createHugeIconComponent(EyeIcon);
const EyeOff = createHugeIconComponent(EyeOffIcon);
const ArrowLeft = createHugeIconComponent(ArrowLeft01Icon);

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xs text-[#64748B]">
          Đang tải trang tài khoản...
        </div>
      }
    >
      <AccountPageContent />
    </Suspense>
  );
}

function AccountPageContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode");

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">(
    initialMode === "register" ? "register" : initialMode === "forgot" ? "forgot" : "login"
  );
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states & Password Visibility Toggles
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRememberMe, setLoginRememberMe] = useState(true);

  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRememberMe, setRegRememberMe] = useState(true);

  const [forgotEmail, setForgotEmail] = useState("");

  // Update mode if URL param changes
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") setAuthMode("register");
    else if (mode === "login") setAuthMode("login");
    else if (mode === "forgot") setAuthMode("forgot");
  }, [searchParams]);

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
        rememberMe: loginRememberMe,
      });

      if (data.user) {
        setUser(data.user);
        setFeedback({ type: "success", text: "Đăng nhập thành công!" });
        if (data.user.email) {
          loadUserData(data.user.email);
        }
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
        rememberMe: regRememberMe,
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await authService.forgotPassword(forgotEmail);
      setFeedback({
        type: "success",
        text: "Liên kết khôi phục mật khẩu đã được gửi đến email của bạn! Vui lòng kiểm tra hộp thư đến hoặc thư rác.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gửi yêu cầu thất bại. Vui lòng kiểm tra lại email.";
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
      setUserBuilds([]);
      setFeedback({ type: "success", text: "Đã đăng xuất thành công." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFeedback({ type: "error", text: "Lỗi đăng xuất: " + msg });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xs text-[#64748B]">
        Đang tải thông tin tài khoản...
      </div>
    );
  }

  // 1. Authenticated User View
  if (user) {
    const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Khách Hàng";
    const phone = user.user_metadata?.phone || "Chưa cập nhật";

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              <UserIcon className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#0F172A]">{fullName}</h1>
                <span className="rounded bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-bold text-[#15803D] border border-[#86EFAC]">
                  Thành Viên
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-[#0063FD]" /> {user.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-[#16A34A]" /> {phone}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-bold border-[#CBD5E1] text-[#DC2626] hover:bg-[#FEE2E2] hover:border-[#DC2626]"
          >
            <LogOut className="h-4 w-4" />
            Đăng Xuất
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#0063FD]" />
                Lịch Sử Đơn Hàng ({userOrders.length})
              </h2>
            </div>

            {userOrders.length === 0 ? (
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center text-xs text-[#64748B] space-y-3">
                <p>Bạn chưa có đơn hàng nào tại QMD-Tech.</p>
                <Link href="/danh-muc">
                  <Button variant="primary" size="sm" className="font-bold text-xs">
                    Khám Phá Linh Kiện Máy Tính
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-3 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] pb-2 text-xs">
                      <div className="font-mono font-bold text-[#0063FD]">{order.order_code}</div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#0063FD]">
                          {order.payment_method?.toUpperCase()}
                        </span>
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          order.payment_status === "paid" ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEF3C7] text-[#D97706]"
                        }`}>
                          {order.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#64748B]">Tổng tiền đơn hàng:</span>
                      <span className="font-mono font-black text-[#0F172A] text-sm">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.total_vnd)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                <Wrench className="h-4 w-4 text-[#0063FD]" />
                Cấu Hình Đã Lưu ({userBuilds.length})
              </h2>
            </div>

            {userBuilds.length === 0 ? (
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 text-center text-xs text-[#64748B] space-y-3">
                <p>Chưa có cấu hình PC nào được lưu.</p>
                <Link href="/build-pc">
                  <Button variant="accent" size="sm" className="font-bold text-xs">
                    Tạo Cấu Hình Mới
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userBuilds.map((build) => (
                  <div key={build.id} className="rounded-xl border border-[#E2E8F0] bg-white p-3 space-y-2 text-xs">
                    <div className="font-bold text-[#0F172A]">{build.name || "Cấu hình PC Custom"}</div>
                    <div className="font-mono text-[#0063FD] font-black">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(build.total_price_vnd)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login / Register / Forgot Password View
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-black uppercase text-[#0F172A]">
            {authMode === "login"
              ? "ĐĂNG NHẬP TÀI KHOẢN"
              : authMode === "register"
              ? "ĐĂNG KÝ THÀNH VIÊN"
              : "KHÔI PHỤC MẬT KHẨU"}
          </h1>
          <p className="text-xs text-[#64748B]">
            {authMode === "forgot"
              ? "Nhập email của bạn để nhận liên kết khôi phục mật khẩu"
              : "Chào mừng bạn đến với hệ thống linh kiện máy tính QMD-Tech"}
          </p>
        </div>

        {authMode !== "forgot" ? (
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1">
            <button
              onClick={() => {
                setAuthMode("login");
                setFeedback(null);
              }}
              className={`rounded-md py-1.5 text-xs font-extrabold uppercase transition-colors ${
                authMode === "login"
                  ? "bg-[#FFFFFF] text-[#0063FD] shadow-xs"
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
                  ? "bg-[#FFFFFF] text-[#0063FD] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Đăng ký mới
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setAuthMode("login");
              setFeedback(null);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0063FD] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại đăng nhập</span>
          </button>
        )}

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

        {authMode === "login" && (
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
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-[#475569]">Mật khẩu *</label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("forgot");
                    setForgotEmail(loginEmail);
                    setFeedback(null);
                  }}
                  className="text-[11px] font-bold text-[#0063FD] hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <input
                  required
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-10 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#0F172A]"
                  aria-label={showLoginPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={loginRememberMe}
                  onChange={(e) => setLoginRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded text-[#0063FD] border-[#CBD5E1] focus:ring-[#0063FD]"
                />
                <span className="font-bold text-[#0F172A] text-xs">Ghi nhớ đăng nhập (30 ngày)</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="md"
              className="w-full font-black uppercase text-xs shadow-xs py-2.5 bg-[#0063FD] hover:bg-[#0052D4]"
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng Nhập"}
            </Button>
          </form>
        )}

        {authMode === "register" && (
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
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
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
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
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
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Mật khẩu (Tối thiểu 8 ký tự) *</label>
              <div className="relative">
                <input
                  required
                  minLength={8}
                  type={showRegPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-10 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#0F172A]"
                  aria-label={showRegPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[#64748B] mt-1">Khuyên dùng chữ hoa, chữ thường và chữ số</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={regRememberMe}
                  onChange={(e) => setRegRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded text-[#0063FD] border-[#CBD5E1] focus:ring-[#0063FD]"
                />
                <span className="font-bold text-[#0F172A] text-xs">Ghi nhớ phiên đăng nhập (30 ngày)</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="md"
              className="w-full font-black uppercase text-xs shadow-xs py-2.5 bg-[#0063FD] hover:bg-[#0052D4]"
            >
              {isSubmitting ? "Đang tạo tài khoản..." : "Đăng Ký Tài Khoản"}
            </Button>
          </form>
        )}

        {authMode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Địa chỉ Email đã đăng ký *</label>
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              </div>
              <p className="text-[10px] text-[#64748B] mt-1">
                Hệ thống sẽ gửi email hướng dẫn đặt lại mật khẩu mới cho bạn.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="md"
              className="w-full font-black uppercase text-xs shadow-xs py-2.5 bg-[#0063FD] hover:bg-[#0052D4]"
            >
              {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi Yêu Cầu Khôi Phục"}
            </Button>
          </form>
        )}</div>
    </div>
  );
}
