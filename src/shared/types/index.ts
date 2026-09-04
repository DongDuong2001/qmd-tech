// ========================================================================
// QMD-Tech Shared Types & Domain Models
// ========================================================================

export type Locale = "vi" | "en";

export interface Category {
  id: string;
  slug: string;
  name_vi: string;
  name_en: string;
  icon?: string;
  sort_order?: number;
  parent_id?: string | null;
  created_at?: string;
}

export type ComponentSlot =
  | "cpu"
  | "motherboard"
  | "ram"
  | "gpu"
  | "storage"
  | "psu"
  | "case"
  | "cooling";

export interface ProductSpecs {
  socket?: string;
  cores?: number;
  threads?: number;
  base_clock_ghz?: number;
  boost_clock_ghz?: number;
  tdp_watts?: number;
  ram_type?: "DDR4" | "DDR5" | string;
  ram_slots?: number;
  max_ram_gb?: number;
  capacity_gb?: number;
  speed_mhz?: number;
  chipset?: string;
  form_factor?: "E-ATX" | "ATX" | "Micro-ATX" | "Mini-ITX" | "M.2 2280" | string;
  vram_gb?: number;
  vram_type?: string;
  length_mm?: number;
  recommended_psu_watts?: number;
  wattage?: number;
  efficiency?: string;
  supported_motherboards?: string[];
  max_gpu_length_mm?: number;
  max_cpu_cooler_height_mm?: number;
  radiator_support_mm?: number[];
  radiator_size_mm?: number;
  supported_sockets?: string[];
  read_speed_mb?: number;
  write_speed_mb?: number;
  [key: string]: unknown;
}

export interface Product {
  id: string;
  sku: string;
  category_id: string;
  slug: string;
  name_vi: string;
  name_en: string;
  desc_vi?: string;
  desc_en?: string;
  price_vnd: number;
  original_price_vnd?: number;
  price_usd?: number;
  stock: number;
  brand: string;
  specs: ProductSpecs;
  images: string[];
  is_featured?: boolean;
  is_active?: boolean;
  warranty_months?: number;
  category?: Category;
  created_at?: string;
  updated_at?: string;
}

export type PerformanceTier = "budget" | "mid_range" | "high_end" | "enthusiast";
export type CompatibilityStatus = "compatible" | "warning" | "incompatible";

export interface CompatibilityIssue {
  type: "socket" | "ram_type" | "power_draw" | "form_factor" | "gpu_clearance" | "missing_component";
  severity: "error" | "warning" | "info";
  message_vi: string;
  message_en: string;
}

export interface CustomBuild {
  id: string;
  user_id?: string | null;
  name: string;
  share_token?: string;
  status: "draft" | "saved" | "ordered" | "quoted";
  items: Record<ComponentSlot, Product | null>;
  total_price_vnd: number;
  estimated_wattage: number;
  recommended_psu_wattage: number;
  performance_tier: PerformanceTier;
  compatibility_status: CompatibilityStatus;
  issues: CompatibilityIssue[];
  notes?: string;
  created_at?: string;
}

export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
  unit_price_vnd: number;
  total_price_vnd: number;
}

export interface Cart {
  items: CartItem[];
  subtotal_vnd: number;
  discount_vnd: number;
  shipping_fee_vnd: number;
  total_vnd: number;
}

export interface Order {
  id: string;
  order_code: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district?: string;
  status: "pending" | "processing" | "shipping" | "completed" | "cancelled";
  subtotal_vnd: number;
  shipping_fee_vnd: number;
  discount_vnd: number;
  total_vnd: number;
  payment_method: "vnpay" | "momo" | "zalopay" | "stripe" | "cod" | "bank_transfer";
  payment_status: "unpaid" | "paid" | "failed" | "refunded";
  payment_transaction_id?: string;
  shipping_provider?: "ghn" | "ghtk" | "express";
  tracking_code?: string;
  custom_build_id?: string;
  notes?: string;
  created_at?: string;
  items?: CartItem[];
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string | null;
  author_name: string;
  author_email?: string;
  rating: number;
  title?: string;
  comment: string;
  is_verified_purchase?: boolean;
  created_at?: string;
}

export interface EventBanner {
  id: string;
  title_vi: string;
  title_en?: string;
  subtitle_vi?: string;
  subtitle_en?: string;
  tag?: string;
  image_url: string;
  target_url: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface PrebuiltDeal {
  id: string;
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
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  supplier_id?: string;
  created_at?: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  brands: string[];
  address?: string;
  status: "active" | "inactive";
  notes?: string;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title_vi: string;
  title_en?: string;
  excerpt_vi: string;
  excerpt_en?: string;
  content_html_vi: string;
  content_html_en?: string;
  cover_image: string;
  author_name: string;
  category: string;
  tags: string[];
  is_published: boolean;
  reading_time_mins: number;
  views_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBlogPostInput {
  slug: string;
  title_vi: string;
  title_en?: string;
  excerpt_vi: string;
  excerpt_en?: string;
  content_html_vi: string;
  content_html_en?: string;
  cover_image: string;
  author_name: string;
  category: string;
  tags: string[];
  is_published: boolean;
  reading_time_mins: number;
}


