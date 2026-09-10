import { supabase } from "@/shared/db/supabase";
import { Category, Product } from "@/shared/types";
import { DEFAULT_HARDWARE_CATEGORIES } from "@/modules/admin/service";
import {
  validateAndNormalizeSpecs,
  normalizeCategorySlug,
} from "./specRegistry";

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

export class CatalogService {
  private normalizeProduct(p: Product, categorySlug?: string): Product {
    if (!p) return p;
    let catSlug = categorySlug || p.category?.slug || "";
    if (!catSlug && p.category_id) {
      const match = DEFAULT_HARDWARE_CATEGORIES.find((c) => c.id === p.category_id);
      if (match) catSlug = match.slug;
    }
    const { normalizedSpecs } = validateAndNormalizeSpecs(catSlug, p.specs || {});
    return {
      ...p,
      specs: normalizedSpecs as Product["specs"],
    };
  }

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
    return normalizeCategorySlug(slug);
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
        // Strip PostgREST special syntax characters to avoid query injection and 400 Bad Request
        const cleanSearch = filter.search
          .trim()
          .replace(/[%_(),."':;\\/]/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        if (cleanSearch.length > 0) {
          query = query.or(
            `name_vi.ilike.%${cleanSearch}%,name_en.ilike.%${cleanSearch}%,sku.ilike.%${cleanSearch}%,brand.ilike.%${cleanSearch}%,slug.ilike.%${cleanSearch}%`
          );
        }
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
        products: (data as Product[]).map((p) => this.normalizeProduct(p, filter.categorySlug)),
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
      return this.normalizeProduct(data as Product);
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

        return ((fallbackData || []) as Product[]).map((p) => this.normalizeProduct(p));
      }
      return (data as Product[]).map((p) => this.normalizeProduct(p));
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
      return (data as Product[]).map((p) => this.normalizeProduct(p));
    } catch (err) {
      console.warn("CatalogService.getProductsByIds exception:", err);
      return [];
    }
  }
}

export const catalogService = new CatalogService();
