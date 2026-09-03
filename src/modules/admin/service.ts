import { supabase } from "@/shared/db/supabase";
import { Product, Category, Order, Review, EventBanner, PrebuiltDeal, Supplier } from "@/shared/types";

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

// In-Memory fallback stores for environments before migration execution
const DEFAULT_BANNERS: EventBanner[] = [
  {
    id: "banner-1",
    title_vi: "Mở Bán GeForce RTX 40 Super Series",
    title_en: "GeForce RTX 40 Super Series Launch",
    subtitle_vi: "Tặng kèm gói quà tặng gaming cao cấp khi đặt mua trong tuần lễ mở bán",
    subtitle_en: "Complimentary gaming accessory package with launch purchases",
    tag: "SỰ KIỆN MỚI",
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80",
    target_url: "/danh-muc/gpu",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "banner-2",
    title_vi: "Build PC Gaming Đón Mùa Mới",
    title_en: "Custom Gaming PC Configurator Specials",
    subtitle_vi: "Hỗ trợ trả góp 0% lãi suất cùng quà tặng nâng cấp RAM và ổ cứng SSD",
    subtitle_en: "0% installment support with RAM and SSD upgrade gifts",
    tag: "CHƯƠNG TRÌNH HOT",
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    target_url: "/build-pc",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "banner-3",
    title_vi: "Intel Core Gen 14th & AMD Ryzen 7000 Series",
    title_en: "Next-Gen Processors Performance Showcase",
    subtitle_vi: "Tối ưu hóa sức mạnh xử lý đa nhiệm, đồ họa 3D và các tựa game AAA",
    subtitle_en: "Optimized multi-tasking power for 3D workflows and AAA titles",
    tag: "CÔNG NGHỆ MỚI",
    image_url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80",
    target_url: "/danh-muc/cpu",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_PREBUILT_DEALS: PrebuiltDeal[] = [
  {
    id: "deal-1",
    name_vi: "PC QMD-G01 Core i5-13400F | RTX 4060 8GB",
    name_en: "PC QMD-G01 Core i5-13400F | RTX 4060 8GB",
    code: "PC-QMD-G01",
    price_vnd: 18900000,
    original_price_vnd: 21500000,
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    badge: "GAMING FULL HD",
    cpu: "Intel Core i5-13400F (10 Nhân, 16 Luồng)",
    vga: "ASUS Dual GeForce RTX 4060 8GB GDDR6",
    ram: "16GB (2x8GB) DDR4 3200MHz Kingston Fury",
    ssd: "500GB Kingston NV2 PCIe 4.0 NVMe",
    psu: "Deepcool PK650D 650W 80 Plus Bronze",
    mainboard: "ASUS PRIME B760M-A WiFi DDR4",
    case_name: "Xigmatek Gaming RGB Case",
    display_order: 1,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "deal-2",
    name_vi: "PC QMD-G02 Ryzen 5 7600 | RTX 4060 Ti 8GB",
    name_en: "PC QMD-G02 Ryzen 5 7600 | RTX 4060 Ti 8GB",
    code: "PC-QMD-G02",
    price_vnd: 25900000,
    original_price_vnd: 28900000,
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80",
    badge: "GAMING 2K",
    cpu: "AMD Ryzen 5 7600 (6 Nhân, 12 Luồng, 5.1GHz)",
    vga: "MSI GeForce RTX 4060 Ti Gaming X 8GB",
    ram: "32GB (2x16GB) DDR5 5600MHz Corsair Vengeance",
    ssd: "1TB Kingston NV2 PCIe 4.0 M.2",
    psu: "Corsair CV750 750W 80 Plus Bronze",
    mainboard: "GIGABYTE B650M Gaming WiFi AM5",
    case_name: "NZXT H5 Flow Matte Black",
    display_order: 2,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "deal-3",
    name_vi: "PC QMD-G03 Core i7-14700K | RTX 4070 Ti Super 16GB",
    name_en: "PC QMD-G03 Core i7-14700K | RTX 4070 Ti Super 16GB",
    code: "PC-QMD-G03",
    price_vnd: 46500000,
    original_price_vnd: 51000000,
    image_url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80",
    badge: "ĐỒ HỌA & 4K",
    cpu: "Intel Core i7-14700K (20 Nhân, 28 Luồng, 5.6GHz)",
    vga: "ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB",
    ram: "32GB (2x16GB) DDR5 6000MHz RGB",
    ssd: "1TB Samsung 990 PRO Gen4x4 NVMe",
    psu: "Corsair RM850e 850W ATX 3.0 80 Plus Gold",
    mainboard: "ASUS ROG STRIX B760-F Gaming WiFi DDR5",
    case_name: "Lian Li O11 Dynamic EVO",
    display_order: 3,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    name: "Synnex FPT Distribution",
    code: "SUP-FPT",
    contact_person: "Nguyễn Hoàng Long",
    phone: "024.7300.7300",
    email: "longnh@fpt.com.vn",
    brands: ["ASUS", "Intel", "Kingston", "Western Digital"],
    address: "Tòa nhà FPT, Phố Duy Tân, Q. Cầu Giấy, Hà Nội",
    status: "active",
    notes: "Nhà phân phối chính hãng linh kiện máy tính và thiết bị viễn thông",
    created_at: new Date().toISOString(),
  },
  {
    id: "sup-2",
    name: "Mai Hoàng Informatics",
    code: "SUP-MH",
    contact_person: "Trần Quốc Bảo",
    phone: "024.3537.7109",
    email: "baotq@maihoang.com.vn",
    brands: ["MSI", "Corsair", "GIGABYTE"],
    address: "241 Phố Vọng, P. Đồng Tâm, Q. Hai Bà Trưng, Hà Nội",
    status: "active",
    notes: "Đối tác cung cấp phần cứng gaming gear và bo mạch chủ",
    created_at: new Date().toISOString(),
  },
  {
    id: "sup-3",
    name: "Viễn Sơn Technology Corp",
    code: "SUP-VS",
    contact_person: "Lê Thanh Bình",
    phone: "028.3832.6085",
    email: "binhlt@vienson.com.vn",
    brands: ["ASUS", "Samsung", "GIGABYTE"],
    address: "175 Nguyễn Thị Minh Khai, Phường Phạm Ngũ Lão, Q.1, TP.HCM",
    status: "active",
    notes: "Trung tâm phân phối linh kiện và màn hình khu vực phía Nam",
    created_at: new Date().toISOString(),
  },
  {
    id: "sup-4",
    name: "Thủy Linh TLC Distribution",
    code: "SUP-TLC",
    contact_person: "Vũ Minh Đức",
    phone: "024.3537.1525",
    email: "ducvm@thuylinh.vn",
    brands: ["GIGABYTE", "Intel", "NZXT"],
    address: "33 Phố Thái Hà, P. Trung Liệt, Q. Đống Đa, Hà Nội",
    status: "active",
    notes: "Nhà phân phối chính hãng VGA, Mainboard và tản nhiệt case NZXT",
    created_at: new Date().toISOString(),
  },
];

export class AdminService {
  private localBanners: EventBanner[] = [...DEFAULT_BANNERS];
  private localDeals: PrebuiltDeal[] = [...DEFAULT_PREBUILT_DEALS];
  private localSuppliers: Supplier[] = [...DEFAULT_SUPPLIERS];

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
      // Fallback gracefully
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
      // Fallback to local
    }

    this.localBanners.push(newBanner);
    return newBanner;
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
      psu: input.psu || "",
      mainboard: input.mainboard || "",
      case_name: input.case_name || "",
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
      // local fallback
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

  async reorderPrebuiltDeals(reorderedIds: string[]): Promise<boolean> {
    for (let i = 0; i < reorderedIds.length; i++) {
      const id = reorderedIds[i];
      const deal = this.localDeals.find((d) => d.id === id);
      if (deal) {
        deal.display_order = i + 1;
      }
      try {
        await supabase
          .from("prebuilt_deals")
          .update({ display_order: i + 1 })
          .eq("id", id);
      } catch {
        // ignore
      }
    }
    return true;
  }

  // ===================== SUPPLIERS =====================
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });

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
}

export const adminService = new AdminService();
