"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { CareerJob } from "@/modules/careers/types";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  CheckCircle2,
  Mail,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  Users,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CareerStorefrontPage() {
  const [careers, setCareers] = useState<CareerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Quick Apply Modal State
  const [applyModalJob, setApplyModalJob] = useState<CareerJob | null>(null);
  const [applyForm, setApplyForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    experience: "",
    cvLink: "",
    introduction: "",
  });
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/careers")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.careers)) {
          setCareers(data.careers);
          if (data.careers.length > 0) {
            setExpandedJobId(data.careers[0].id);
          }
        }
      })
      .catch((err) => console.warn("Load careers notice:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const departments = useMemo(() => {
    const list = Array.from(new Set(careers.map((c) => c.department).filter(Boolean)));
    return ["all", ...list];
  }, [careers]);

  const filteredCareers = useMemo(() => {
    return careers.filter((job) => {
      const matchDept =
        selectedDepartment === "all" || job.department === selectedDepartment;
      const matchSearch =
        !searchQuery.trim() ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [careers, selectedDepartment, searchQuery]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.fullName || !applyForm.phone || !applyForm.email) {
      alert("Vui lòng điền đầy đủ họ tên, số điện thoại và email liên hệ.");
      return;
    }
    setApplySuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Cổng Thông Tin Tuyển Dụng
          </div>

          <h1
            style={{ color: "#ffffff" }}
            className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white"
          >
            Cơ Hội Việc Làm &{" "}
            <span className="text-[#38BDF8]">Gia Nhập Đội Ngũ</span> QMD-Tech
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            QMD-Tech cung cấp môi trường làm việc minh bạch, chuyên nghiệp dành cho các nhân sự am hiểu phần cứng máy tính và giải pháp công nghệ.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-slate-200">
              <MapPin className="h-3.5 w-3.5 text-blue-400" /> Trụ sở làm việc: Cầu Giấy, Hà Nội
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-slate-200">
              <Users className="h-3.5 w-3.5 text-emerald-400" /> Môi trường làm việc chuyên nghiệp
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-slate-200">
              <Award className="h-3.5 w-3.5 text-amber-400" /> Chế độ đãi ngộ & phúc lợi rõ ràng
            </span>
          </div>
        </div>
      </section>

      {/* 2. Main Job Listings & Filters */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Search & Filter Controls */}
        <div className="mb-8 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm vị trí tuyển dụng (Kỹ thuật, Bán hàng, QC, Marketing...)"
                className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#64748B]" />
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="rounded-lg border border-[#CBD5E1] px-3 py-2 text-xs text-[#64748B] hover:text-[#0F172A]"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>

          {/* Department Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-xs font-bold text-[#64748B] shrink-0 mr-1">
              Phòng ban:
            </span>
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDepartment(dept)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedDepartment === dept
                    ? "bg-[#0063FD] text-white shadow-xs"
                    : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
                }`}
              >
                {dept === "all" ? "Tất cả vị trí" : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Job Openings Count Banner */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[#0063FD]" />
            <h2 className="text-lg font-black text-[#0F172A]">
              Vị Trí Đang Mở Tuyển ({filteredCareers.length})
            </h2>
          </div>
          <span className="text-xs text-[#64748B]">
            Cập nhật liên tục từ phòng Nhân sự QMD-Tech
          </span>
        </div>

        {/* Job Cards */}
        {loading ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center text-xs text-[#64748B]">
            Đang tải danh sách vị trí tuyển dụng...
          </div>
        ) : filteredCareers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-12 text-center space-y-3">
            <Briefcase className="mx-auto h-8 w-8 text-[#94A3B8]" />
            <p className="text-sm font-bold text-[#0F172A]">
              Không tìm thấy vị trí phù hợp với từ khóa hoặc bộ lọc đã chọn.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDepartment("all");
              }}
              className="text-xs font-bold text-[#0063FD] hover:underline"
            >
              Xem lại tất cả vị trí đang mở
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCareers.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <div
                  key={job.id}
                  className={`rounded-2xl border transition-all bg-white overflow-hidden shadow-xs ${
                    isExpanded
                      ? "border-[#0063FD] ring-2 ring-[#0063FD]/10"
                      : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                >
                  {/* Job Header Bar */}
                  <div
                    onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-[#EFF6FF] px-2.5 py-0.5 text-[10px] font-bold text-[#0063FD] border border-[#BFDBFE] uppercase">
                          {job.department}
                        </span>
                        <span className="rounded-md bg-[#F1F5F9] px-2.5 py-0.5 text-[10px] font-semibold text-[#475569]">
                          {job.employment_type}
                        </span>
                        <span className="rounded-md bg-[#F8FAFC] px-2.5 py-0.5 text-[10px] font-semibold text-[#64748B] border border-[#E2E8F0] flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#0063FD]" />
                          {job.location}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-[#0F172A] hover:text-[#0063FD] transition-colors">
                        {job.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-left sm:text-right">
                        <div className="text-[10px] uppercase font-bold text-[#64748B]">
                          Mức Lương
                        </div>
                        <div className="text-sm sm:text-base font-black text-[#16A34A]">
                          {job.salary}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-[#0063FD]" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Job Details */}
                  {isExpanded && (
                    <div className="border-t border-[#F1F5F9] bg-[#FAFAFA] p-5 sm:p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1: Job Description */}
                        <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E2E8F0]">
                          <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-[#0063FD]" />
                            Mô Tả Chi Tiết Công Việc
                          </h4>
                          <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line">
                            {job.description}
                          </p>
                        </div>

                        {/* Column 2: Requirements */}
                        <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E2E8F0]">
                          <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                            Yêu Cầu Ứng Viên
                          </h4>
                          <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line">
                            {job.requirements}
                          </p>
                          <div className="pt-1 text-[11px] text-[#64748B]">
                            <strong>Kinh nghiệm yêu cầu:</strong> {job.experience}
                          </div>
                        </div>
                      </div>

                      {/* Benefits & Perks */}
                      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                          <Award className="h-3.5 w-3.5 text-[#F59E0B]" />
                          Quyền Lợi & Chế Độ Đãi Ngộ
                        </h4>
                        <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line">
                          {job.benefits}
                        </p>
                      </div>

                      {/* CTA Action Row */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <div className="text-xs text-[#64748B] flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-[#0063FD]" />
                          Hoặc gửi CV trực tiếp qua email:{" "}
                          <a
                            href={`mailto:${job.contact_email}?subject=Ứng tuyển ${encodeURIComponent(job.title)}`}
                            className="font-bold text-[#0063FD] hover:underline"
                          >
                            {job.contact_email}
                          </a>
                        </div>

                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => {
                            setApplyModalJob(job);
                            setApplySuccess(false);
                          }}
                          className="w-full sm:w-auto shadow-xs font-black uppercase text-xs tracking-wider"
                        >
                          <Send className="h-3.5 w-3.5 mr-1.5" />
                          Ứng Tuyển Vị Trí Này
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 3. Company Culture & Core Values */}
        <section className="mt-14 rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] uppercase">
              Môi Trường Làm Việc Tại QMD-Tech
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B]">
              QMD-Tech định hướng xây dựng môi trường làm việc hợp tác, trách nhiệm và tôn trọng năng lực cá nhân.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#0063FD] font-black">
                01
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Minh Bạch & Công Bằng</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Chính sách đãi ngộ, đánh giá năng lực và quy chế làm việc được công khai rõ ràng đối với từng vị trí.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0FDF4] text-[#16A34A] font-black">
                02
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Tiếp Cận Thiết Bị Mới</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Là đại lý phân phối, nhân sự có điều kiện trực tiếp tiếp cận, kiểm thử và làm việc cùng các dòng sản phẩm phần cứng đa dạng.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706] font-black">
                03
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Lộ Trình Đào Tạo Rõ Ràng</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Được đào tạo định kỳ về chuyên môn kỹ thuật, kỹ năng tư vấn và lộ trình phát triển theo năng lực công việc.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Quick Apply Modal */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#CBD5E1] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#0063FD] uppercase">
                  Nộp hồ sơ ứng tuyển
                </span>
                <h3 className="text-base font-black text-[#0F172A]">
                  {applyModalJob.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalJob(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F1F5F9] text-[#64748B]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-[#0F172A]">
                  Gửi Hồ Sơ Thành Công!
                </h4>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Cảm ơn bạn đã quan tâm đến vị trí tại QMD-Tech. Bộ phận Tuyển dụng sẽ liên hệ lại qua số điện thoại hoặc email của bạn trong vòng 24 - 48 giờ làm việc.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setApplyModalJob(null)}
                >
                  Đóng cửa sổ
                </Button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Họ và Tên *
                  </label>
                  <input
                    required
                    type="text"
                    value={applyForm.fullName}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, fullName: e.target.value })
                    }
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1">
                      Số Điện Thoại *
                    </label>
                    <input
                      required
                      type="tel"
                      value={applyForm.phone}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, phone: e.target.value })
                      }
                      placeholder="0988..."
                      className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1">
                      Email Liên Hệ *
                    </label>
                    <input
                      required
                      type="email"
                      value={applyForm.email}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, email: e.target.value })
                      }
                      placeholder="email@example.com"
                      className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Liên kết CV / Hồ sơ năng lực (Google Drive, TopCV, LinkedIn...)
                  </label>
                  <input
                    type="url"
                    value={applyForm.cvLink}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, cvLink: e.target.value })
                    }
                    placeholder="https://drive.google.com/..."
                    className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">
                    Đôi nét giới thiệu bản thân hoặc kinh nghiệm liên quan
                  </label>
                  <textarea
                    rows={3}
                    value={applyForm.introduction}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, introduction: e.target.value })
                    }
                    placeholder="Kinh nghiệm ráp máy, phần cứng hoặc những dự án công nghệ bạn từng tham gia..."
                    className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setApplyModalJob(null)}
                  >
                    Hủy bỏ
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Gửi Hồ Sơ Ứng Tuyển
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
