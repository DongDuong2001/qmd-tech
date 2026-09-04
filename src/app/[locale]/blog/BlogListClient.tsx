"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { BlogPost } from "@/shared/types";
import {
  BookOpen,
  Clock,
  Eye,
  Search,
  ChevronRight,
  Layers,
  ArrowRight,
} from "lucide-react";

interface BlogListClientProps {
  initialPosts: BlogPost[];
}

const CATEGORIES = [
  { id: "all", label: "Tất Cả" },
  { id: "Kiến Thức Phần Cứng", label: "Kiến Thức Phần Cứng" },
  { id: "Đánh Giá & Review", label: "Đánh Giá & Review" },
  { id: "Hướng Dẫn Build PC", label: "Hướng Dẫn Build PC" },
  { id: "Tin Công Nghệ", label: "Tin Công Nghệ" },
  { id: "Setup & Gaming Corner", label: "Setup & Gaming Corner" },
];

export function BlogListClient({ initialPosts }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchCat =
        selectedCategory === "all" || post.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        post.title_vi.toLowerCase().includes(q) ||
        (post.excerpt_vi && post.excerpt_vi.toLowerCase().includes(q)) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(q)));
      return matchCat && matchQuery;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const remainingPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Mới cập nhật";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Mới cập nhật";
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-[#0063FD] text-white shadow-xs"
                  : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A] border border-[#E2E8F0]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài viết, linh kiện..."
            className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-1.5 pl-8 pr-3 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none"
          />
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#64748B]" />
        </div>
      </div>

      {/* 2. Empty State */}
      {filteredPosts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-[#94A3B8]" />
          <h3 className="mt-3 text-base font-bold text-[#0F172A]">
            Không tìm thấy bài viết nào
          </h3>
          <p className="mt-1 text-xs text-[#64748B]">
            Vui lòng thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
          </p>
          {(searchQuery || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0063FD] px-4 py-2 text-xs font-bold text-white hover:bg-[#0052D4] transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* 3. Featured Hero Spotlight Article */}
      {featuredPost && (
        <div className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xs hover:border-[#0063FD] hover:shadow-md transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image Container */}
            <div className="relative h-64 sm:h-80 lg:h-auto lg:col-span-7 bg-[#0F172A] overflow-hidden">
              {featuredPost.cover_image ? (
                <Image
                  src={featuredPost.cover_image}
                  alt={featuredPost.title_vi}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0063FD] to-[#0F172A] text-white">
                  <BookOpen className="h-16 w-16 opacity-30" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="rounded-md bg-[#0063FD] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                  {featuredPost.category}
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 sm:p-8 lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-[#64748B]">
                  <span className="font-bold text-[#0F172A]">
                    {featuredPost.author_name}
                  </span>
                  <span>•</span>
                  <span>{formatDate(featuredPost.created_at)}</span>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="block group-hover:text-[#0063FD] transition-colors"
                >
                  <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] leading-snug">
                    {featuredPost.title_vi}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-3">
                  {featuredPost.excerpt_vi}
                </p>

                {featuredPost.tags && featuredPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {featuredPost.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-medium text-[#475569]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4 text-xs text-[#64748B]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#0063FD]" />
                    {featuredPost.reading_time_mins} phút đọc
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {featuredPost.views_count || 0}
                  </span>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0063FD] hover:underline"
                >
                  Đọc tiếp
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Grid of Subsequent Articles */}
      {remainingPosts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#0063FD]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A]">
              Tất Cả Bài Viết ({remainingPosts.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post) => (
              <article
                key={post.id || post.slug}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xs hover:border-[#0063FD] hover:shadow-md transition-all"
              >
                <div>
                  {/* Article Card Image */}
                  <div className="relative h-48 w-full bg-[#0F172A] overflow-hidden">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title_vi}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0063FD] to-[#0F172A] text-white">
                        <BookOpen className="h-10 w-10 opacity-30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="rounded bg-[#0063FD] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Article Card Body */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                      <span className="font-semibold text-[#0F172A]">
                        {post.author_name}
                      </span>
                      <span>•</span>
                      <span>{formatDate(post.created_at)}</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="block group-hover:text-[#0063FD] transition-colors"
                    >
                      <h4 className="text-base font-bold text-[#0F172A] leading-snug line-clamp-2">
                        {post.title_vi}
                      </h4>
                    </Link>

                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                      {post.excerpt_vi}
                    </p>
                  </div>
                </div>

                {/* Article Card Footer */}
                <div className="flex items-center justify-between border-t border-[#F1F5F9] px-5 py-3 text-[11px] text-[#64748B] bg-[#F8FAFC]/50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#0063FD]" />
                      {post.reading_time_mins} phút
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views_count || 0}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-0.5 text-xs font-bold text-[#0063FD] hover:underline"
                  >
                    Xem chi tiết
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
