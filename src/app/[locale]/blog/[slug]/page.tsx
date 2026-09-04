import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { blogService } from "@/modules/blog/service";
import { ShareButtons } from "./ShareButtons";
import {
  BookOpen,
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  Home,
  User,
  Wrench,
  ArrowLeft,
  CheckCircle2,
  Phone,
  MessageSquare,
} from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export const revalidate = 60; // ISR revalidate every 60s

export async function generateStaticParams() {
  try {
    const posts = await blogService.getPublishedPosts({ limit: 50 });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogService.getPostBySlug(slug);

  if (!post || !post.is_published) {
    return {
      title: "Không Tìm Thấy Bài Viết | QMD-Tech",
    };
  }

  const title = `${post.title_vi} | QMD-Tech Hardware Insights`;
  const description =
    post.excerpt_vi ||
    "Bài viết phân tích chuyên sâu về công nghệ và phần cứng máy tính từ QMD-Tech.";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qmdtech.vercel.app";
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: [
      post.category,
      ...(post.tags || []),
      "qmd tech",
      "linh kien may tinh",
      "build pc",
    ],
    authors: [{ name: post.author_name }],
    openGraph: {
      title,
      description,
      url: postUrl,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      images: post.cover_image
        ? [
            {
              url: post.cover_image,
              width: 1200,
              height: 630,
              alt: post.title_vi,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: BlogPostPageProps) {
  const { slug, locale } = await params;
  const post = await blogService.getPostBySlug(slug);

  if (!post || !post.is_published) {
    notFound();
  }

  // Fetch related articles
  const relatedPosts = await blogService.getPublishedPosts({
    category: post.category,
    limit: 4,
  });
  const filteredRelated = relatedPosts.filter((p) => p.id !== post.id).slice(0, 3);

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Mới cập nhật";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qmdtech.vercel.app";
  const currentPostUrl = `${siteUrl}/${locale}/blog/${post.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-8">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B] flex-wrap">
        <Link href="/" className="hover:text-[#0063FD] flex items-center gap-1 transition-colors">
          <Home className="h-3.5 w-3.5" />
          Trang Chủ
        </Link>
        <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
        <Link href="/blog" className="hover:text-[#0063FD] transition-colors">
          Blog Công Nghệ
        </Link>
        <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
        <span className="text-[#64748B]">{post.category}</span>
        <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
        <span className="font-bold text-[#0F172A] truncate max-w-xs sm:max-w-md">
          {post.title_vi}
        </span>
      </nav>

      {/* 2. Article Header */}
      <header className="space-y-4 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-[#0063FD] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-xs">
            {post.category}
          </span>
          {post.tags && post.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-md bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-0.5 text-[11px] font-bold text-[#0063FD]"
            >
              #{t}
            </span>
          ))}
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] leading-tight tracking-tight">
          {post.title_vi}
        </h1>

        {post.excerpt_vi && (
          <p className="text-sm sm:text-base text-[#475569] font-medium leading-relaxed">
            {post.excerpt_vi}
          </p>
        )}

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#E2E8F0] py-3 text-xs text-[#64748B]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFF6FF] text-[#0063FD] font-bold">
                <User className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Tác giả</span>
                <span className="font-bold text-[#0F172A]">{post.author_name}</span>
              </div>
            </div>

            <span className="hidden sm:inline-block text-[#CBD5E1]">|</span>

            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#64748B]" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#0063FD]" />
              <span>{post.reading_time_mins} phút đọc</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              <span>{post.views_count || 0} lượt đọc</span>
            </div>
          </div>

          <ShareButtons title={post.title_vi} url={currentPostUrl} />
        </div>
      </header>

      {/* 3. Cover Image */}
      {post.cover_image && (
        <div className="relative w-full h-72 sm:h-96 lg:h-[480px] rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#0F172A] shadow-xs">
          <Image
            src={post.cover_image}
            alt={post.title_vi}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      )}

      {/* 4. Article Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Article Content (8 cols) */}
        <article className="lg:col-span-8 space-y-8">
          {/* Rich Content HTML Renderer with Prose Classes */}
          <div
            className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed
              prose-headings:font-black prose-headings:text-[#0F172A]
              prose-h2:text-2xl prose-h2:border-b prose-h2:border-[#E2E8F0] prose-h2:pb-2.5 prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-[#334155] prose-p:leading-relaxed prose-p:my-3
              prose-a:text-[#0063FD] prose-a:font-bold hover:prose-a:underline
              prose-strong:text-[#0F172A] prose-strong:font-bold
              prose-img:rounded-xl prose-img:border prose-img:border-[#E2E8F0] prose-img:shadow-sm prose-img:my-6
              prose-blockquote:border-l-4 prose-blockquote:border-[#0063FD] prose-blockquote:bg-[#EFF6FF]/60 prose-blockquote:py-2.5 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:my-4 prose-blockquote:italic
              prose-pre:bg-[#0F172A] prose-pre:text-[#38BDF8] prose-pre:rounded-xl prose-pre:p-4
              prose-ul:list-disc prose-ul:pl-5 prose-ul:my-3
              prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-3"
            dangerouslySetInnerHTML={{ __html: post.content_html_vi }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="border-t border-[#E2E8F0] pt-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#64748B]">Chủ đề liên quan:</span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog`}
                    className="rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] px-3 py-1 text-xs font-medium text-[#475569] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Share Bar */}
          <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0063FD] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách bài viết
            </Link>
            <ShareButtons title={post.title_vi} url={currentPostUrl} />
          </div>

          {/* Author Box */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0063FD] text-white font-black text-xl shadow-xs">
              QMD
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-[#0F172A]">{post.author_name}</h4>
                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                <span className="rounded bg-[#DCFCE7] px-1.5 py-0.5 text-[9px] font-bold text-[#16A34A]">
                  Verified Expert
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Đội ngũ chuyên gia kỹ thuật và chuyên viên benchmark phần cứng tại QMD-Tech Lab, mang đến các đánh giá chuẩn xác, minh bạch và tư vấn cấu hình tối ưu.
              </p>
            </div>
          </div>
        </article>

        {/* Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Custom PC Builder CTA Card */}
          <div className="rounded-2xl border border-[#BFDBFE] bg-gradient-to-br from-[#EFF6FF] to-white p-6 shadow-xs space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0063FD] text-white shadow-xs">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0F172A]">
                Tự Cấu Hình Dàn PC Theo Ý Muốn
              </h3>
              <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                Chọn linh kiện tương thích 100%, kiểm tra công suất nguồn tự động và nhận ngay báo giá ưu đãi độc quyền.
              </p>
            </div>
            <Link
              href="/build-pc"
              className="block w-full text-center rounded-xl bg-[#0063FD] py-2.5 text-xs font-black text-white uppercase tracking-wider hover:bg-[#0052D4] shadow-xs transition-colors"
            >
              Mở Trình Build PC
            </Link>
          </div>

          {/* Quick Technical Consultation Hotline */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
              Tư Vấn Phần Cứng Trực Tiếp
            </h4>
            <p className="text-xs text-[#64748B]">
              Cần hỗ trợ kỹ thuật hoặc chọn linh kiện phù hợp với ngân sách?
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="tel:19008888"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 text-xs font-bold text-[#0F172A] hover:border-[#0063FD] hover:text-[#0063FD] transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-[#0063FD]" />
                1900.8888
              </a>
              <Link
                href="/lien-he"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#0063FD] py-2 text-xs font-bold text-white hover:bg-[#0052D4] transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Chat Tư Vấn
              </Link>
            </div>
          </div>

          {/* Related Articles in same category */}
          {filteredRelated.length > 0 && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <BookOpen className="h-4 w-4 text-[#0063FD]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                  Bài Viết Cùng Chủ Đề
                </h4>
              </div>

              <div className="space-y-3">
                {filteredRelated.map((rel) => (
                  <Link
                    key={rel.id || rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group block space-y-1 rounded-xl p-2 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <span className="text-[10px] font-bold text-[#0063FD] uppercase">
                      {rel.category}
                    </span>
                    <h5 className="text-xs font-bold text-[#0F172A] group-hover:text-[#0063FD] transition-colors line-clamp-2">
                      {rel.title_vi}
                    </h5>
                    <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {rel.reading_time_mins} phút đọc
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
