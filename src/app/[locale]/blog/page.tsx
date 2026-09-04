import React from "react";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { blogService } from "@/modules/blog/service";
import { BlogListClient } from "./BlogListClient";
import { ChevronRight, Home, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Tin Tức Công Nghệ & Hướng Dẫn Build PC | QMD-Tech",
  description:
    "Cập nhật tin tức công nghệ mới nhất, đánh giá linh kiện máy tính, so sánh CPU, GPU và cẩm nang hướng dẫn build PC chuyên sâu từ chuyên gia QMD-Tech.",
  keywords: [
    "blog cong nghe",
    "danh gia cpu gpu",
    "huong dan build pc",
    "tin tuc linh kien",
    "setup gaming",
    "qmd-tech",
  ],
  openGraph: {
    title: "Tin Tức Công Nghệ & Hướng Dẫn Build PC | QMD-Tech",
    description:
      "Cập nhật tin tức công nghệ mới nhất, đánh giá linh kiện máy tính và hướng dẫn build PC gaming từ chuyên gia QMD-Tech.",
    url: "https://qmdtech.vercel.app/blog",
    siteName: "QMD-Tech Gaming & Workstation Systems",
    type: "website",
  },
};

export const revalidate = 60; // ISR revalidate every 60 seconds

export default async function BlogPage() {
  const posts = await blogService.getPublishedPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <Link href="/" className="hover:text-[#0063FD] flex items-center gap-1 transition-colors">
          <Home className="h-3.5 w-3.5" />
          Trang Chủ
        </Link>
        <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
        <span className="font-bold text-[#0F172A]">Blog Công Nghệ</span>
      </nav>

      {/* Hero Header Banner */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 text-[11px] font-bold text-[#0063FD]">
            <Flame className="h-3.5 w-3.5 text-[#0063FD]" />
            QMD Hardware Lab & Insights
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Tin Tức Công Nghệ & Cẩm Nang Build PC
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Khám phá các bài phân tích phần cứng chuyên sâu, so sánh benchmark thực tế, hướng dẫn tối ưu hiệu năng máy tính và thủ thuật từ đội ngũ kỹ thuật QMD-Tech.
          </p>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#0063FD]/5 blur-3xl pointer-events-none" />
      </div>

      {/* Interactive Blog Listing */}
      <BlogListClient initialPosts={posts} />
    </div>
  );
}
