import { Category, Product } from "@/shared/types";
import { CatalogFilterParams, CatalogListResult } from "./types";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "./mockData";
import { supabase } from "@/shared/db/supabase";

export class CatalogService {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch {
      // Fallback to mock data for local/offline execution
    }
    return MOCK_CATEGORIES;
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = await this.getCategories();
    return categories.find((c) => c.slug === slug) || null;
  }

  async getProducts(params: CatalogFilterParams = {}): Promise<CatalogListResult> {
    const categories = await this.getCategories();
    let products: Product[] = [...MOCK_PRODUCTS];

    try {
      let query = supabase.from("products").select("*, category:categories(*)");

      if (params.categoryId) {
        query = query.eq("category_id", params.categoryId);
      }
      if (params.brand) {
        query = query.eq("brand", params.brand);
      }
      if (params.inStockOnly) {
        query = query.gt("stock", 0);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        products = data as Product[];
      }
    } catch {
      // Fallback to local memory filtering
    }

    // Apply local filters
    if (params.categorySlug) {
      const cat = categories.find((c) => c.slug === params.categorySlug);
      if (cat) {
        products = products.filter((p) => p.category_id === cat.id);
      }
    }

    if (params.brand) {
      products = products.filter((p) => p.brand.toLowerCase() === params.brand?.toLowerCase());
    }

    if (params.search) {
      const term = params.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name_vi.toLowerCase().includes(term) ||
          p.name_en.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term)
      );
    }

    if (params.minPrice !== undefined) {
      products = products.filter((p) => p.price_vnd >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      products = products.filter((p) => p.price_vnd <= params.maxPrice!);
    }

    if (params.inStockOnly) {
      products = products.filter((p) => p.stock > 0);
    }

    // Sorting
    if (params.sortBy === "price_asc") {
      products.sort((a, b) => a.price_vnd - b.price_vnd);
    } else if (params.sortBy === "price_desc") {
      products.sort((a, b) => b.price_vnd - a.price_vnd);
    }

    const page = params.page || 1;
    const limit = params.limit || 20;
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedProducts = products.slice((page - 1) * limit, page * limit);

    return {
      products: paginatedProducts,
      total,
      page,
      totalPages,
      categories,
    };
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch {
      // Fallback
    }

    const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (found) {
      const categories = await this.getCategories();
      return {
        ...found,
        category: categories.find((c) => c.id === found.category_id),
      };
    }
    return null;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const { products } = await this.getProducts();
    return products.filter((p) => p.is_featured);
  }
}

export const catalogService = new CatalogService();
