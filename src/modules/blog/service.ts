import { supabase } from "@/shared/db/supabase";
import { BlogPost, CreateBlogPostInput } from "@/shared/types";

export interface BlogFilterParams {
  category?: string;
  search?: string;
  limit?: number;
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
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      // Fire and forget view increment
      this.incrementViewCount(slug).catch(() => {});

      return data as BlogPost;
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
    const postPayload = {
      ...input,
      slug: input.slug.trim().toLowerCase(),
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
    const updatePayload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

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
