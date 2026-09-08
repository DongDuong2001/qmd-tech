import { supabase } from "@/shared/db/supabase";
import { BlogPost, CreateBlogPostInput } from "@/shared/types";

export interface BlogFilterParams {
  category?: string;
  search?: string;
  limit?: number;
}

export function sanitizeSlug(rawSlug?: string, fallbackTitle?: string): string {
  let text = (rawSlug || "").trim();

  // If empty, use fallback title
  if (!text && fallbackTitle) {
    text = fallbackTitle.trim();
  }

  // If text is a full URL (e.g. https://domain.com/path/to/slug?query=1)
  if (text.startsWith("http://") || text.startsWith("https://") || text.includes("://")) {
    try {
      const url = new URL(text);
      const segments = url.pathname.split("/").filter(Boolean);
      text = segments.pop() || fallbackTitle || "bai-viet";
    } catch {
      // If URL parsing fails, strip protocol and domain
      text = text.replace(/^https?:\/\/[^/]+/i, "").replace(/^\//, "");
      text = text.split("?")[0].split("#")[0];
    }
  } else if (text.includes("?")) {
    text = text.split("?")[0];
  }

  // Vietnamese diacritic transliteration
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `post-${Date.now()}`;
}

export class BlogService {
  // 1. Get published blog posts for storefront
  async getPublishedPosts(params: BlogFilterParams = {}): Promise<BlogPost[]> {
    try {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (params.category && params.category !== "all") {
        query = query.eq("category", params.category);
      }

      if (params.search) {
        query = query.ilike("title_vi", `%${params.search}%`);
      }

      if (params.limit) {
        query = query.limit(params.limit);
      }

      const { data, error } = await query;
      if (error || !data) {
        return [];
      }
      return data as BlogPost[];
    } catch (err) {
      console.warn("BlogService.getPublishedPosts notice:", err);
      return [];
    }
  }

  // 2. Get single post by slug for reading page
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const trimmedSlug = (slug || "").trim();
      if (!trimmedSlug) return null;

      // Try 1: Exact match
      const { data: exactMatch } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", trimmedSlug)
        .maybeSingle();

      if (exactMatch) {
        this.incrementViewCount(exactMatch.slug).catch(() => {});
        return exactMatch as BlogPost;
      }

      // Try 2: URL-decoded match
      const decodedSlug = decodeURIComponent(trimmedSlug);
      if (decodedSlug !== trimmedSlug) {
        const { data: decodedMatch } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", decodedSlug)
          .maybeSingle();

        if (decodedMatch) {
          this.incrementViewCount(decodedMatch.slug).catch(() => {});
          return decodedMatch as BlogPost;
        }
      }

      // Try 3: Sanitized slug match
      const cleanSlug = sanitizeSlug(trimmedSlug);
      if (cleanSlug && cleanSlug !== trimmedSlug) {
        const { data: cleanMatch } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", cleanSlug)
          .maybeSingle();

        if (cleanMatch) {
          this.incrementViewCount(cleanMatch.slug).catch(() => {});
          return cleanMatch as BlogPost;
        }
      }

      // Try 4: UUID id lookup fallback
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmedSlug);
      if (isUuid) {
        const { data: idMatch } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", trimmedSlug)
          .maybeSingle();

        if (idMatch) {
          this.incrementViewCount(idMatch.slug).catch(() => {});
          return idMatch as BlogPost;
        }
      }

      return null;
    } catch (err) {
      console.warn("BlogService.getPostBySlug notice:", err);
      return null;
    }
  }

  // 3. Admin: Get all posts (published and draft)
  async getAllPostsAdmin(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) {
        return [];
      }
      return data as BlogPost[];
    } catch (err) {
      console.warn("BlogService.getAllPostsAdmin notice:", err);
      return [];
    }
  }

  // 4. Admin: Create new blog post
  async createPost(input: CreateBlogPostInput): Promise<BlogPost> {
    const cleanSlug = sanitizeSlug(input.slug, input.title_vi);
    const postPayload = {
      ...input,
      slug: cleanSlug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views_count: 0,
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([postPayload])
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Không thể tạo bài viết mới.");
    }
    return data as BlogPost;
  }

  // 5. Admin: Update post
  async updatePost(id: string, updates: Partial<CreateBlogPostInput>): Promise<BlogPost> {
    const updatePayload: Record<string, unknown> = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (updates.slug !== undefined) {
      updatePayload.slug = sanitizeSlug(updates.slug, updates.title_vi);
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Không thể cập nhật bài viết.");
    }
    return data as BlogPost;
  }

  // 6. Admin: Delete post
  async deletePost(id: string): Promise<boolean> {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }

  // 7. Increment view count
  async incrementViewCount(slug: string): Promise<void> {
    try {
      const { error } = await supabase.rpc("increment_blog_view", { post_slug: slug });
      if (error) {
        // Fallback update if RPC not defined
        const { data } = await supabase
          .from("blog_posts")
          .select("views_count")
          .eq("slug", slug)
          .maybeSingle();
        if (data) {
          await supabase
            .from("blog_posts")
            .update({ views_count: (data.views_count || 0) + 1 })
            .eq("slug", slug);
        }
      }
    } catch {
      // Ignore view increment errors
    }
  }
}

export const blogService = new BlogService();
