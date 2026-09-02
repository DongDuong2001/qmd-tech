import React from "react";
import { BookOpen, Clock } from "lucide-react";

export const metadata = {
  title: "Tin Tức Công Nghệ & Hướng Dẫn Build PC | QMD-Tech",
};

const BLOG_POSTS = [
  {
    slug: "huong-dan-chon-nguon-psu-chuan-atx-3-0",
    title: "Hướng Dẫn Chọn Nguồn PSU Chuẩn ATX 3.0 & Cáp 12VHPWR Cho Card RTX 40 Series",
    excerpt: "Tìm hiểu cách tính công suất thực của card đồ họa, tránh sập nguồn do transient power spike và chọn đúng chuẩn nguồn an toàn.",
    author: "QMD Hardware Lab",
    date: "01/09/2026",
    readTime: "6 phút đọc",
    category: "Kiến Thức Phần Cứng",
  },
  {
    slug: "so-sanh-ryzen-7-7800x3d-vs-intel-i7-14700k",
    title: "So Sánh AMD Ryzen 7 7800X3D vs Intel Core i7-14700K: Chọn CPU Nào Cho Gaming & Render?",
    excerpt: "Đánh giá chi tiết hiệu năng FPS trong các tựa game AAA và thời gian render Premiere Pro giữa 2 bộ vi xử lý hot nhất hiện nay.",
    author: "Nguyễn Tuấn",
    date: "28/08/2026",
    readTime: "8 phút đọc",
    category: "Đánh Giá & Review",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-10">
      <div className="border-b border-[#2A3040] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-2">
          <BookOpen className="h-4 w-4" />
          Hardware Insights & Guides
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F2F4F8]">
          Tin Công Nghệ & Thủ Thuật Build PC
        </h1>
        <p className="mt-1 text-xs text-[#9AA3B2]">
          Cập nhật kiến thức chuyên sâu về phần cứng máy tính từ chuyên gia QMD-Tech
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col justify-between rounded-2xl border border-[#2A3040] bg-[#131722] p-6 hover:border-[#3B82F6] transition-all"
          >
            <div className="space-y-3">
              <span className="rounded bg-[#1B2030] px-2.5 py-1 text-[11px] font-bold text-[#3B82F6] border border-[#2A3040]">
                {post.category}
              </span>
              <h3 className="text-lg font-bold text-[#F2F4F8] hover:text-[#3B82F6] transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-[#9AA3B2] leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#2A3040]/60 pt-4 text-[11px] text-[#9AA3B2]">
              <div className="flex items-center gap-2">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
              </div>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {post.readTime}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
