import { supabase } from "@/shared/db/supabase";
import { Category, Product } from "@/shared/types";

export interface ProductFilter {
  categorySlug?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
  inStockOnly?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular";
  page?: number;
  limit?: number;
}

import { DEFAULT_HARDWARE_CATEGORIES } from "@/modules/admin/service";

export class CatalogService {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*");

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (err) {
      console.warn("CatalogService.getCategories exception:", err);
    }
    return DEFAULT_HARDWARE_CATEGORIES;
  }

  private normalizeCategorySlug(slug: string): string {
    const s = slug.trim().toLowerCase();
    const map: Record<string, string> = {
      gpu: "vga",
      "card-man-hinh": "vga",
      motherboard: "mainboard",
      "bo-mach-chu": "mainboard",
      storage: "ssd",
      hdd: "ssd",
      "o-cung": "ssd",
      "nguon-may-tinh": "psu",
      "vo-case": "case",
      "tan-nhiet": "cooling",
      "man-hinh": "monitor",
    };
    return map[s] || s;
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const normalized = this.normalizeCategorySlug(slug);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .or(`slug.eq.${slug},slug.eq.${normalized}`)
        .maybeSingle();

      if (!error && data) {
        return data as Category;
      }
    } catch (err) {
      console.warn("CatalogService.getCategoryBySlug exception:", err);
    }
    return (
      DEFAULT_HARDWARE_CATEGORIES.find(
        (c) => c.slug === slug || c.slug === normalized
      ) || null
    );
  }

  async getProducts(filter: ProductFilter = {}): Promise<{ products: Product[]; total: number }> {
    try {
      let query = supabase.from("products").select("*", { count: "exact" });

      if (filter.categorySlug) {
        // Look up category id by slug first if needed
        const cat = await this.getCategoryBySlug(filter.categorySlug);
        if (cat) {
          query = query.eq("category_id", cat.id);
        }
      }

      if (filter.brand) {
        query = query.ilike("brand", `%${filter.brand}%`);
      }

      if (filter.minPrice !== undefined) {
        query = query.gte("price_vnd", filter.minPrice);
      }

      if (filter.maxPrice !== undefined) {
        query = query.lte("price_vnd", filter.maxPrice);
      }

      if (filter.isFeatured !== undefined) {
        query = query.eq("is_featured", filter.isFeatured);
      }

      if (filter.search) {
        query = query.or(`name_vi.ilike.%${filter.search}%,name_en.ilike.%${filter.search}%,sku.ilike.%${filter.search}%,brand.ilike.%${filter.search}%`);
      }

      const page = filter.page || 1;
      const limit = filter.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order("created_at", { ascending: false });

      const { data, count, error } = await query;

      if (error || !data) {
        console.warn("CatalogService.getProducts db notice:", error?.message);
        return { products: [], total: 0 };
      }

      return {
        products: data as Product[],
        total: count || data.length,
      };
    } catch (err) {
      console.warn("CatalogService.getProducts exception:", err);
      return { products: [], total: 0 };
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        return null;
      }
      return data as Product;
    } catch (err) {
      console.warn("CatalogService.getProductBySlug exception:", err);
      return null;
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(8);

      if (error || !data || data.length === 0) {
        // Fallback to top products if no featured flag set
        const { data: fallbackData } = await supabase
          .from("products")
          .select("*")
          .limit(8);

        return (fallbackData || []) as Product[];
      }
      return data as Product[];
    } catch (err) {
      console.warn("CatalogService.getFeaturedProducts exception:", err);
      return [];
    }
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if (!ids || ids.length === 0) return [];
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", ids);

      if (error || !data) {
        return [];
      }
      return data as Product[];
    } catch (err) {
      console.warn("CatalogService.getProductsByIds exception:", err);
      return [];
    }
  }
}

export const catalogService = new CatalogService();
