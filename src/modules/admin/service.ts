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
import {
  MegaCategoryItem,
  DEFAULT_MEGA_MENU_CATEGORIES,
} from "@/components/navigation/megaMenuData";

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

export const DEFAULT_HARDWARE_CATEGORIES: Category[] = [
  { id: "cat-cpu", slug: "cpu", name_vi: "Vi Xử Lý (CPU)", name_en: "Processors (CPU)", icon: "Cpu", sort_order: 1 },
  { id: "cat-mainboard", slug: "mainboard", name_vi: "Bo Mạch Chủ (Mainboard)", name_en: "Motherboards", icon: "Layers", sort_order: 2 },
  { id: "cat-ram", slug: "ram", name_vi: "Bộ Nhớ Trong (RAM)", name_en: "Memory (RAM)", icon: "Boxes", sort_order: 3 },
  { id: "cat-vga", slug: "vga", name_vi: "Card Màn Hình (VGA)", name_en: "Graphics Cards (GPU)", icon: "Monitor", sort_order: 4 },
  { id: "cat-ssd", slug: "ssd", name_vi: "Ổ Cứng SSD / HDD", name_en: "Storage (SSD/HDD)", icon: "Server", sort_order: 5 },
  { id: "cat-psu", slug: "psu", name_vi: "Nguồn Máy Tính (PSU)", name_en: "Power Supply (PSU)", icon: "Activity", sort_order: 6 },
  { id: "cat-case", slug: "case", name_vi: "Vỏ Case Máy Tính", name_en: "PC Cases", icon: "Package", sort_order: 7 },
  { id: "cat-cooling", slug: "cooling", name_vi: "Tản Nhiệt CPU / Nước", name_en: "Cooling & Fans", icon: "RefreshCw", sort_order: 8 },
  { id: "cat-monitor", slug: "monitor", name_vi: "Màn Hình Máy Tính", name_en: "Monitors", icon: "Monitor", sort_order: 9 },
  { id: "cat-gear", slug: "gear", name_vi: "Gaming Gear & Phụ Kiện", name_en: "Gaming Gear", icon: "ShoppingBag", sort_order: 10 },
];

export class AdminService {
  private localBanners: EventBanner[] = [];
  private localDeals: PrebuiltDeal[] = [];
  private localSuppliers: Supplier[] = [];

  // ===================== PRODUCTS =====================
  async getProducts(): Promise<Product[]> {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.products)) {
            return json.products as Product[];
          }
        }
      } catch (err) {
        console.warn("AdminService.getProducts fetch notice:", err);
      }
    }

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
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const json = await res.json();
        if (json.success && json.product) {
          return json.product as Product;
        }
        if (!json.success && json.error) {
          throw new Error(json.error);
        }
      } catch (fetchErr: unknown) {
        if (fetchErr instanceof Error && fetchErr.message && !fetchErr.message.includes("fetch")) {
          throw fetchErr;
        }
        console.warn("AdminService.createProduct API fallback:", fetchErr);
      }
    }

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
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...updates }),
        });
        const json = await res.json();
        if (json.success && json.product) {
          return json.product as Product;
        }
      } catch (fetchErr) {
        console.warn("AdminService.updateProduct API notice:", fetchErr);
      }
    }

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
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (json.success) {
          return true;
        }
      } catch (fetchErr) {
        console.warn("AdminService.deleteProduct API notice:", fetchErr);
      }
    }

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      throw error;
    }
    return true;
  }

  // ===================== CATEGORIES =====================
  private localCategories: Category[] = [...DEFAULT_HARDWARE_CATEGORIES];

  async getCategories(): Promise<Category[]> {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.categories) && json.categories.length > 0) {
            this.localCategories = json.categories as Category[];
            return (json.categories as Category[]).sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));
          }
        }
      } catch (err) {
        console.warn("AdminService.getCategories fetch notice:", err);
      }
    }

    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*");

      if (!error && data && data.length > 0) {
        return (data as Category[]).sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));
      }
    } catch (err) {
      console.warn("AdminService.getCategories notice:", err);
    }
    return this.localCategories;
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const json = await res.json();
        if (json.success && json.category) {
          this.localCategories.push(json.category as Category);
          return json.category as Category;
        }
      } catch (fetchErr) {
        console.warn("AdminService.createCategory API notice:", fetchErr);
      }
    }

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      slug: input.slug.toLowerCase().trim(),
      name_vi: input.name_vi.trim(),
      name_en: input.name_en?.trim() || input.name_vi.trim(),
      icon: input.icon || "Cpu",
      sort_order: this.localCategories.length + 1,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{
          slug: newCat.slug,
          name_vi: newCat.name_vi,
          name_en: newCat.name_en,
          icon: newCat.icon,
        }])
        .select()
        .single();

      if (!error && data) {
        this.localCategories.push(data as Category);
        return data as Category;
      }
    } catch {
      // Local fallback
    }

    this.localCategories.push(newCat);
    return newCat;
  }

  async updateCategory(id: string, updates: Partial<CreateCategoryInput>): Promise<Category | null> {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...updates }),
        });
        const json = await res.json();
        if (json.success && json.category) {
          const idx = this.localCategories.findIndex((c) => c.id === id);
          if (idx !== -1) this.localCategories[idx] = json.category as Category;
          return json.category as Category;
        }
      } catch (fetchErr) {
        console.warn("AdminService.updateCategory API notice:", fetchErr);
      }
    }

    try {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const idx = this.localCategories.findIndex((c) => c.id === id);
        if (idx !== -1) this.localCategories[idx] = data as Category;
        return data as Category;
      }
    } catch {
      // Local fallback
    }

    const idx = this.localCategories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.localCategories[idx] = { ...this.localCategories[idx], ...updates };
      return this.localCategories[idx];
    }
    return null;
  }

  async deleteCategory(id: string): Promise<boolean> {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (json.success) {
          this.localCategories = this.localCategories.filter((c) => c.id !== id);
          return true;
        }
      } catch (fetchErr) {
        console.warn("AdminService.deleteCategory API notice:", fetchErr);
      }
    }

    try {
      await supabase.from("categories").delete().eq("id", id);
    } catch {
      // Local fallback
    }
    this.localCategories = this.localCategories.filter((c) => c.id !== id);
    return true;
  }

  async seedDefaultCategories(): Promise<Category[]> {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "seed" }),
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.categories)) {
          this.localCategories = json.categories as Category[];
          return this.localCategories;
        }
      } catch (fetchErr) {
        console.warn("AdminService.seedDefaultCategories API notice:", fetchErr);
      }
    }

    try {
      for (const cat of DEFAULT_HARDWARE_CATEGORIES) {
        await supabase
          .from("categories")
          .upsert([{
            slug: cat.slug,
            name_vi: cat.name_vi,
            name_en: cat.name_en,
            icon: cat.icon,
          }], { onConflict: "slug" });
      }
    } catch {
      // Local fallback
    }
    this.localCategories = [...DEFAULT_HARDWARE_CATEGORIES];
    return this.getCategories();
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

  // ===================== MEGA MENU CUSTOMIZATION =====================
  async getMegaMenu(): Promise<MegaCategoryItem[]> {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/menu");
        const json = await res.json();
        if (json.success && Array.isArray(json.categories) && json.categories.length > 0) {
          return json.categories;
        }
      } catch (err) {
        console.warn("AdminService.getMegaMenu notice:", err);
      }
    }
    return DEFAULT_MEGA_MENU_CATEGORIES;
  }

  async updateMegaMenu(categories: MegaCategoryItem[]): Promise<MegaCategoryItem[]> {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/admin/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Lỗi cập nhật menu.");
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("qmd:menu_updated"));
      }
      return json.categories || categories;
    }
    return categories;
  }

  async resetMegaMenu(): Promise<MegaCategoryItem[]> {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Lỗi khôi phục menu mặc định.");
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("qmd:menu_updated"));
      }
      return json.categories || DEFAULT_MEGA_MENU_CATEGORIES;
    }
    return DEFAULT_MEGA_MENU_CATEGORIES;
  }
}

export const adminService = new AdminService();
