import { supabase } from "@/shared/db/supabase";
import { Product, Category, Order, Review } from "@/shared/types";

export interface CreateProductInput {
  name_vi: string;
  name_en: string;
  slug: string;
  sku: string;
  brand: string;
  category_id: string;
  price_vnd: number;
  original_price_vnd?: number;
  price_usd?: number;
  stock: number;
  images: string[];
  specs: Record<string, unknown>;
  warranty_months: number;
  is_featured?: boolean;
}

export interface CreateCategoryInput {
  slug: string;
  name_vi: string;
  name_en: string;
  icon: string;
}

export class AdminService {
  // ===================== PRODUCTS =====================
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("AdminService.getProducts error:", error);
      return [];
    }
    return (data || []) as Product[];
  }

  async createProduct(input: CreateProductInput): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name_vi: input.name_vi,
          name_en: input.name_en,
          slug: input.slug,
          sku: input.sku,
          brand: input.brand,
          category_id: input.category_id,
          price_vnd: input.price_vnd,
          original_price_vnd: input.original_price_vnd || null,
          price_usd: input.price_usd || Math.round(input.price_vnd / 25400),
          stock: input.stock,
          images: input.images,
          specs: input.specs || {},
          warranty_months: input.warranty_months || 36,
          is_featured: !!input.is_featured,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data as Product;
  }

  async updateProduct(id: string, updates: Partial<CreateProductInput>): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data as Product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      throw error;
    }
    return true;
  }

  // ===================== CATEGORIES =====================
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*");

    if (error) {
      console.error("AdminService.getCategories error:", error);
      return [];
    }
    return (data || []) as Category[];
  }

  async createCategory(input: CreateCategoryInput): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .insert([input])
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data as Category;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      throw error;
    }
    return true;
  }

  // ===================== ORDERS =====================
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("AdminService.getOrders error:", error);
      return [];
    }
    return (data || []) as Order[];
  }

  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<boolean> {
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      throw error;
    }
    return true;
  }

  // ===================== REVIEWS =====================
  async getReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, products(name_vi)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("AdminService.getReviews error:", error);
      return [];
    }
    return (data || []) as Review[];
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) {
      throw error;
    }
    return true;
  }
}

export const adminService = new AdminService();
