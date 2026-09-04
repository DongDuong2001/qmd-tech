import { supabase } from "@/shared/db/supabase";
import {
  Product,
  Category,
  Order,
  Review,
  EventBanner,
  PrebuiltDeal,
  Supplier,
  BlogPost,
  CreateBlogPostInput,
} from "@/shared/types";
import { blogService } from "@/modules/blog/service";

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

export interface CreateBannerInput {
  title_vi: string;
  title_en?: string;
  subtitle_vi?: string;
  subtitle_en?: string;
  tag?: string;
  image_url: string;
  target_url: string;
  display_order?: number;
  is_active?: boolean;
}

export interface CreatePrebuiltDealInput {
  name_vi: string;
  name_en?: string;
  code: string;
  price_vnd: number;
  original_price_vnd?: number | null;
  image_url: string;
  badge?: string;
  cpu: string;
  vga: string;
  ram: string;
  ssd: string;
  psu?: string;
  mainboard?: string;
  case_name?: string;
  display_order?: number;
  is_featured?: boolean;
  is_active?: boolean;
  supplier_id?: string;
}

export interface CreateSupplierInput {
  name: string;
  code: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  brands: string[];
  address?: string;
  status?: "active" | "inactive";
  notes?: string;
}

export class AdminService {
  private localBanners: EventBanner[] = [];
  private localDeals: PrebuiltDeal[] = [];
  private localSuppliers: Supplier[] = [];

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
      .select("*")
      .order("sort_order", { ascending: true });

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
      .update({ status })
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
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("AdminService.getReviews error:", error);
      return [];
    }
    return (data || []) as Review[];
  }

  async deleteReview(id: string): Promise<boolean> {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      throw error;
    }
    return true;
  }

  // ===================== BANNERS & POSTERS =====================
  async getBanners(): Promise<EventBanner[]> {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as EventBanner[];
      }
    } catch {
      // Fallback
    }
    return this.localBanners;
  }

  async createBanner(input: CreateBannerInput): Promise<EventBanner> {
    const newBanner: EventBanner = {
      id: `banner-${Date.now()}`,
      title_vi: input.title_vi,
      title_en: input.title_en || input.title_vi,
      subtitle_vi: input.subtitle_vi || "",
      subtitle_en: input.subtitle_en || "",
      tag: input.tag || "SỰ KIỆN",
      image_url: input.image_url,
      target_url: input.target_url || "/danh-muc",
      display_order: input.display_order ?? (this.localBanners.length + 1),
      is_active: input.is_active ?? true,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("banners")
        .insert([newBanner])
        .select()
        .single();
      if (!error && data) {
        return data as EventBanner;
      }
    } catch {
      // local
    }

    this.localBanners.push(newBanner);
    return newBanner;
  }

  async updateBanner(id: string, updates: Partial<CreateBannerInput>): Promise<EventBanner | null> {
    try {
      const { data, error } = await supabase
        .from("banners")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        return data as EventBanner;
      }
    } catch {
      // local
    }

    const idx = this.localBanners.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.localBanners[idx] = { ...this.localBanners[idx], ...updates };
      return this.localBanners[idx];
    }
    return null;
  }

  async deleteBanner(id: string): Promise<boolean> {
    try {
      await supabase.from("banners").delete().eq("id", id);
    } catch {
      // ignore
    }
    this.localBanners = this.localBanners.filter((b) => b.id !== id);
    return true;
  }

  // ===================== PREBUILT DEALS =====================
  async getPrebuiltDeals(): Promise<PrebuiltDeal[]> {
    try {
      const { data, error } = await supabase
        .from("prebuilt_deals")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as PrebuiltDeal[];
      }
    } catch {
      // Fallback
    }
    return this.localDeals.sort((a, b) => a.display_order - b.display_order);
  }

  async createPrebuiltDeal(input: CreatePrebuiltDealInput): Promise<PrebuiltDeal> {
    const newDeal: PrebuiltDeal = {
      id: `deal-${Date.now()}`,
      name_vi: input.name_vi,
      name_en: input.name_en || input.name_vi,
      code: input.code,
      price_vnd: input.price_vnd,
      original_price_vnd: input.original_price_vnd || null,
      image_url: input.image_url,
      badge: input.badge || "DEAL HOT",
      cpu: input.cpu,
      vga: input.vga,
      ram: input.ram,
      ssd: input.ssd,
      psu: input.psu,
      mainboard: input.mainboard,
      case_name: input.case_name,
      display_order: input.display_order ?? (this.localDeals.length + 1),
      is_featured: input.is_featured ?? true,
      is_active: input.is_active ?? true,
      supplier_id: input.supplier_id,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("prebuilt_deals")
        .insert([newDeal])
        .select()
        .single();
      if (!error && data) {
        return data as PrebuiltDeal;
      }
    } catch {
      // local
    }

    this.localDeals.push(newDeal);
    return newDeal;
  }

  async updatePrebuiltDeal(id: string, updates: Partial<CreatePrebuiltDealInput>): Promise<PrebuiltDeal | null> {
    try {
      const { data, error } = await supabase
        .from("prebuilt_deals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        return data as PrebuiltDeal;
      }
    } catch {
      // local
    }

    const idx = this.localDeals.findIndex((d) => d.id === id);
    if (idx !== -1) {
      this.localDeals[idx] = { ...this.localDeals[idx], ...updates };
      return this.localDeals[idx];
    }
    return null;
  }

  async deletePrebuiltDeal(id: string): Promise<boolean> {
    try {
      await supabase.from("prebuilt_deals").delete().eq("id", id);
    } catch {
      // ignore
    }
    this.localDeals = this.localDeals.filter((d) => d.id !== id);
    return true;
  }

  async reorderPrebuiltDeals(dealIdsInOrder: string[]): Promise<boolean> {
    try {
      for (let i = 0; i < dealIdsInOrder.length; i++) {
        await supabase
          .from("prebuilt_deals")
          .update({ display_order: i + 1 })
          .eq("id", dealIdsInOrder[i]);
      }
    } catch {
      // local
    }

    this.localDeals.forEach((d) => {
      const newOrder = dealIdsInOrder.indexOf(d.id);
      if (newOrder !== -1) {
        d.display_order = newOrder + 1;
      }
    });
    return true;
  }

  // ===================== SUPPLIERS =====================
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Supplier[];
      }
    } catch {
      // Fallback
    }
    return this.localSuppliers;
  }

  async createSupplier(input: CreateSupplierInput): Promise<Supplier> {
    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: input.name,
      code: input.code,
      contact_person: input.contact_person || "",
      phone: input.phone || "",
      email: input.email || "",
      brands: input.brands || [],
      address: input.address || "",
      status: input.status || "active",
      notes: input.notes || "",
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("suppliers")
        .insert([newSupplier])
        .select()
        .single();
      if (!error && data) {
        return data as Supplier;
      }
    } catch {
      // local
    }

    this.localSuppliers.push(newSupplier);
    return newSupplier;
  }

  async updateSupplier(id: string, updates: Partial<CreateSupplierInput>): Promise<Supplier | null> {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        return data as Supplier;
      }
    } catch {
      // local
    }

    const idx = this.localSuppliers.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.localSuppliers[idx] = { ...this.localSuppliers[idx], ...updates };
      return this.localSuppliers[idx];
    }
    return null;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    try {
      await supabase.from("suppliers").delete().eq("id", id);
    } catch {
      // ignore
    }
    this.localSuppliers = this.localSuppliers.filter((s) => s.id !== id);
    return true;
  }

  // ===================== BLOG POSTS & TECH NEWS =====================
  async getBlogPosts(): Promise<BlogPost[]> {
    return blogService.getAllPostsAdmin();
  }

  async createBlogPost(input: CreateBlogPostInput): Promise<BlogPost> {
    return blogService.createPost(input);
  }

  async updateBlogPost(id: string, updates: Partial<CreateBlogPostInput>): Promise<BlogPost | null> {
    return blogService.updatePost(id, updates);
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return blogService.deletePost(id);
  }
}

export const adminService = new AdminService();
