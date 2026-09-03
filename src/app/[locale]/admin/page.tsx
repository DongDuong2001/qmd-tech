"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  adminService,
  CreateProductInput,
  CreateBannerInput,
  CreatePrebuiltDealInput,
  CreateSupplierInput,
} from "@/modules/admin/service";
import {
  Product,
  Category,
  Order,
  Review,
  EventBanner,
  PrebuiltDeal,
  Supplier,
} from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Star,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  DollarSign,
  Boxes,
  RefreshCw,
  ShieldCheck,
  Server,
  Activity,
  UserCheck,
  TrendingUp,
  Clock,
  ChevronRight,
  Image as ImageIcon,
  Monitor,
  ArrowUp,
  ArrowDown,
  Building,
  Phone,
  Mail,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "categories" | "banners" | "deals" | "suppliers" | "orders" | "reviews" | "security"
  >("overview");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [banners, setBanners] = useState<EventBanner[]>([]);
  const [deals, setDeals] = useState<PrebuiltDeal[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState<CreateProductInput>({
    name_vi: "",
    name_en: "",
    slug: "",
    sku: "",
    brand: "ASUS",
    category_id: "",
    price_vnd: 0,
    original_price_vnd: 0,
    stock: 10,
    images: ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80"],
    specs: {},
    warranty_months: 36,
    is_featured: false,
  });

  const [socketInput, setSocketInput] = useState("");
  const [ramTypeInput, setRamTypeInput] = useState("");
  const [tdpInput, setTdpInput] = useState("");
  const [vramInput, setVramInput] = useState("");

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    slug: "",
    name_vi: "",
    name_en: "",
    icon: "Cpu",
  });

  // Banner Form State
  const [bannerForm, setBannerForm] = useState<CreateBannerInput>({
    title_vi: "",
    title_en: "",
    subtitle_vi: "",
    subtitle_en: "",
    tag: "SỰ KIỆN",
    image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80",
    target_url: "/danh-muc",
    display_order: 1,
    is_active: true,
  });

  // Prebuilt Deal Form State
  const [dealForm, setDealForm] = useState<CreatePrebuiltDealInput>({
    name_vi: "",
    name_en: "",
    code: "",
    price_vnd: 0,
    original_price_vnd: 0,
    image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    badge: "DEAL HOT",
    cpu: "",
    vga: "",
    ram: "",
    ssd: "",
    psu: "650W Bronze",
    mainboard: "B760 / B650",
    case_name: "Gaming RGB Case",
    display_order: 1,
    is_featured: true,
    is_active: true,
  });

  // Supplier Form State
  const [supplierForm, setSupplierForm] = useState<CreateSupplierInput>({
    name: "",
    code: "",
    contact_person: "",
    phone: "",
    email: "",
    brands: ["ASUS", "MSI"],
    address: "",
    status: "active",
    notes: "",
  });
  const [brandInputString, setBrandInputString] = useState("ASUS, MSI, Intel");

  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      const [p, c, o, r, b, d, s] = await Promise.all([
        adminService.getProducts(),
        adminService.getCategories(),
        adminService.getOrders(),
        adminService.getReviews(),
        adminService.getBanners(),
        adminService.getPrebuiltDeals(),
        adminService.getSuppliers(),
      ]);
      setProducts(p);
      setCategories(c);
      setOrders(o);
      setReviews(r);
      setBanners(b);
      setDeals(d);
      setSuppliers(s);

      if (c.length > 0 && !productForm.category_id) {
        setProductForm((prev) => ({ ...prev, category_id: c[0].id }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFeedbackMsg({ type: "error", text: "Lỗi tải dữ liệu: " + msg });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotification = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Products
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const specs: Record<string, unknown> = {};
      if (socketInput) specs.socket = socketInput;
      if (ramTypeInput) specs.ram_type = ramTypeInput;
      if (tdpInput) specs.tdp_watts = parseInt(tdpInput, 10);
      if (vramInput) specs.vram_gb = parseInt(vramInput, 10);

      const generatedSlug =
        productForm.slug ||
        productForm.name_vi.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      await adminService.createProduct({
        ...productForm,
        slug: generatedSlug,
        specs,
      });

      showNotification("success", "Đã lưu sản phẩm mới thành công!");
      setIsAddProductOpen(false);
      setProductForm({
        name_vi: "",
        name_en: "",
        slug: "",
        sku: "",
        brand: "ASUS",
        category_id: categories[0]?.id || "",
        price_vnd: 0,
        original_price_vnd: 0,
        stock: 10,
        images: ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80"],
        specs: {},
        warranty_months: 36,
        is_featured: false,
      });
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi tạo sản phẩm: " + msg);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi kho hàng?")) return;
    try {
      await adminService.deleteProduct(id);
      showNotification("success", "Đã xóa sản phẩm thành công!");
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi xóa sản phẩm: " + msg);
    }
  };

  // Categories
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createCategory(categoryForm);
      showNotification("success", "Đã thêm danh mục mới thành công!");
      setIsAddCategoryOpen(false);
      setCategoryForm({ slug: "", name_vi: "", name_en: "", icon: "Cpu" });
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi tạo danh mục: " + msg);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await adminService.deleteCategory(id);
      showNotification("success", "Đã xóa danh mục thành công!");
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi xóa danh mục: " + msg);
    }
  };

  // Banners & Event Posters
  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createBanner(bannerForm);
      showNotification("success", "Đã đăng poster sự kiện mới thành công!");
      setIsAddBannerOpen(false);
      setBannerForm({
        title_vi: "",
        title_en: "",
        subtitle_vi: "",
        subtitle_en: "",
        tag: "SỰ KIỆN",
        image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80",
        target_url: "/danh-muc",
        display_order: banners.length + 1,
        is_active: true,
      });
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi tạo banner: " + msg);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa poster này?")) return;
    try {
      await adminService.deleteBanner(id);
      showNotification("success", "Đã xóa poster sự kiện!");
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi xóa banner: " + msg);
    }
  };

  // Prebuilt Deals
  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createPrebuiltDeal(dealForm);
      showNotification("success", "Đã thêm cấu hình PC ráp sẵn mới!");
      setIsAddDealOpen(false);
      setDealForm({
        name_vi: "",
        name_en: "",
        code: "",
        price_vnd: 0,
        original_price_vnd: 0,
        image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
        badge: "DEAL HOT",
        cpu: "",
        vga: "",
        ram: "",
        ssd: "",
        psu: "650W Bronze",
        mainboard: "B760 / B650",
        case_name: "Gaming RGB Case",
        display_order: deals.length + 1,
        is_featured: true,
        is_active: true,
      });
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi tạo cấu hình PC: " + msg);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa cấu hình PC này?")) return;
    try {
      await adminService.deletePrebuiltDeal(id);
      showNotification("success", "Đã xóa cấu hình PC thành công!");
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi xóa deal: " + msg);
    }
  };

  const handleMoveDeal = async (index: number, direction: "up" | "down") => {
    const newDeals = [...deals];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newDeals.length) return;

    const temp = newDeals[index];
    newDeals[index] = newDeals[targetIndex];
    newDeals[targetIndex] = temp;

    setDeals(newDeals);
    const reorderedIds = newDeals.map((d) => d.id);
    await adminService.reorderPrebuiltDeals(reorderedIds);
    showNotification("success", "Đã cập nhật thứ tự hiển thị trang chủ!");
  };

  // Suppliers
  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const brandsArray = brandInputString
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean);

      await adminService.createSupplier({
        ...supplierForm,
        brands: brandsArray,
      });

      showNotification("success", "Đã thêm nhà phân phối / nguồn hàng mới!");
      setIsAddSupplierOpen(false);
      setSupplierForm({
        name: "",
        code: "",
        contact_person: "",
        phone: "",
        email: "",
        brands: [],
        address: "",
        status: "active",
        notes: "",
      });
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi tạo nhà phân phối: " + msg);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa nhà phân phối này?")) return;
    try {
      await adminService.deleteSupplier(id);
      showNotification("success", "Đã xóa nhà phân phối!");
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi xóa nhà phân phối: " + msg);
    }
  };

  // Orders
  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      showNotification("success", `Đã cập nhật trạng thái đơn hàng: ${status.toUpperCase()}`);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi cập nhật đơn hàng: " + msg);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name_vi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBrand = brandFilter === "all" || p.brand.toLowerCase() === brandFilter.toLowerCase();
      const matchCat = categoryFilter === "all" || p.category_id === categoryFilter;
      return matchSearch && matchBrand && matchCat;
    });
  }, [products, searchQuery, brandFilter, categoryFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === "all") return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  // Financial & Inventory Statistics
  const totalRevenue = orders
    .filter((o) => o.status === "completed" || o.status === "processing" || o.status === "shipping")
    .reduce((sum, o) => sum + (o.total_vnd || 0), 0);

  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] text-[#0F172A] font-sans antialiased">
      {/* ========================================================================= */}
      {/* 1. DISTINCT ENTERPRISE BACKOFFICE SIDEBAR */}
      {/* ========================================================================= */}
      <aside className="w-64 shrink-0 bg-[#0F172A] text-[#94A3B8] flex flex-col justify-between border-r border-[#1E293B] shadow-lg">
        <div>
          {/* Admin Header & Logo */}
          <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#E11D48] shadow-sm bg-white">
                <Image
                  src="/qmdtech_logo.png"
                  alt="QMD-Tech Admin"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-wider text-white">
                  QMD<span className="text-[#E11D48]">-TECH</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B45309] mt-0.5">
                  ADMIN CONSOLE
                </span>
              </div>
            </div>
            <span className="rounded bg-[#1E293B] px-1.5 py-0.5 text-[9px] font-mono text-[#38BDF8] border border-[#334155]">
              v2.5
            </span>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-3 space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "overview"
                  ? "bg-[#E11D48] text-white shadow-xs font-black"
                  : "hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4" />
                <span>Tổng quan</span>
              </div>
              {activeTab === "overview" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "products"
                  ? "bg-[#E11D48] text-white shadow-xs font-black"
                  : "hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4" />
                <span>Kho sản phẩm</span>
              </div>
              <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-[10px] font-mono text-slate-300">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "categories"
                  ? "bg-[#E11D48] text-white shadow-xs font-black"
                  : "hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="h-4 w-4" />
                <span>Danh mục linh kiện</span>
              </div>
              <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-[10px] font-mono text-slate-300">
                {categories.length}
              </span>
            </button>

            {/* BANNERS TAB */}
            <button
              onClick={() => setActiveTab("banners")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "banners"
                  ? "bg-[#E11D48] text-white shadow-xs font-black"
                  : "hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="h-4 w-4" />
                <span>Banner & Sự kiện</span>
              </div>
              <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-[10px] font-mono text-slate-300">
                {banners.length}
              </span>
            </button>

            {/* PREBUILT DEALS TAB */}
            <button
              onClick={() => setActiveTab("deals")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "deals"
                  ? "bg-[#E11D48] text-white shadow-xs font-black"
                  : "hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Monitor className="h-4 w-4" />
                <span>PC Ráp Sẵn (Deals)</span>
              </div>
              <span className="rounded-full bg-[#EA580C] px-2 py-0.5 text-[10px] font-mono text-white font-black">
                {deals.length}
              </span>
            </button>

            {/* SUPPLIERS TAB */}
            <button
              onClick={() => setActiveTab("suppliers")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "suppliers"
                  ? "bg-[#E11D48] text-white shadow-xs font-black"
                  : "hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building className="h-4 w-4" />
                <span>Nguồn hàng & NCC</span>
              </div>
              <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-[10px] font-mono text-slate-300">
                {suppliers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "orders"
                  ? "bg-[#E11D48] text-white shadow-xs font-black"
                  : "hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4" />
                <span>Quản lý đơn hàng</span>
              </div>
              {orders.length > 0 && (
                <span className="rounded-full bg-[#16A34A] px-2 py-0.5 text-[10px] font-mono text-white font-black">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "reviews"
                  ? "bg-[#E11D48] text-white shadow-xs font-black"
                  : "hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="h-4 w-4" />
                <span>Đánh giá khách hàng</span>
              </div>
              <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-[10px] font-mono text-slate-300">
                {reviews.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "security"
                  ? "bg-[#E11D48] text-white shadow-xs font-black"
                  : "hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Bảo mật & Hệ thống</span>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-[#10B981]" />
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="p-4 border-t border-[#1E293B] space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#334155] text-white font-bold text-xs">
              <UserCheck className="h-4 w-4 text-[#38BDF8]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Admin Operator</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">admin@qmdtech.vn</div>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full rounded-lg border border-[#334155] bg-[#1E293B] py-2 text-xs font-bold text-slate-200 hover:bg-[#334155] transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#38BDF8]" />
            Xem trang bán hàng
          </Link>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. ADMIN MAIN WORKSPACE */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Admin Console
            </span>
            <span className="text-[#CBD5E1]">/</span>
            <span className="text-sm font-black text-[#0F172A] uppercase">
              {activeTab === "overview" && "Bảng Điều Khiển Tổng Quan"}
              {activeTab === "products" && "Quản Lý Danh Mục Sản Phẩm"}
              {activeTab === "categories" && "Phân Loại Linh Kiện Phần Cứng"}
              {activeTab === "banners" && "Quản Lý Banner & Poster Sự Kiện"}
              {activeTab === "deals" && "Cấu Hình PC Ráp Sẵn & Bố Trí Trang Chủ"}
              {activeTab === "suppliers" && "Danh Sách Nguồn Hàng & Nhà Phân Phối"}
              {activeTab === "orders" && "Trung Tâm Xử Lý Đơn Hàng"}
              {activeTab === "reviews" && "Kiểm Duyệt Đánh Giá Khách Hàng"}
              {activeTab === "security" && "Trạng Thái Bảo Mật & Hệ Thống"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Database Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#86EFAC] bg-[#DCFCE7] px-3 py-1 text-[11px] font-bold text-[#15803D]">
              <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Supabase DB: Kết nối trực tiếp</span>
            </div>

            {/* Refresh Button */}
            <Button
              onClick={loadAllData}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 text-[#475569]"
              title="Làm mới dữ liệu từ Supabase"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#E11D48]" : ""}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>

            {/* Context Action Button */}
            {activeTab === "products" && (
              <Button
                onClick={() => setIsAddProductOpen(true)}
                variant="primary"
                size="sm"
                className="gap-1 text-xs font-black shadow-xs uppercase"
              >
                <Plus className="h-4 w-4" />
                Thêm Linh Kiện
              </Button>
            )}
            {activeTab === "banners" && (
              <Button
                onClick={() => setIsAddBannerOpen(true)}
                variant="primary"
                size="sm"
                className="gap-1 text-xs font-black shadow-xs uppercase"
              >
                <Plus className="h-4 w-4" />
                Đăng Poster Mới
              </Button>
            )}
            {activeTab === "deals" && (
              <Button
                onClick={() => setIsAddDealOpen(true)}
                variant="primary"
                size="sm"
                className="gap-1 text-xs font-black shadow-xs uppercase"
              >
                <Plus className="h-4 w-4" />
                Thêm Cấu Hình PC
              </Button>
            )}
            {activeTab === "suppliers" && (
              <Button
                onClick={() => setIsAddSupplierOpen(true)}
                variant="primary"
                size="sm"
                className="gap-1 text-xs font-black shadow-xs uppercase"
              >
                <Plus className="h-4 w-4" />
                Thêm Nhà Cung Cấp
              </Button>
            )}
          </div>
        </header>

        {/* Content Body Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Feedback Toast */}
          {feedbackMsg && (
            <div
              className={`rounded-xl p-3.5 text-xs font-bold flex items-center justify-between shadow-xs ${
                feedbackMsg.type === "success"
                  ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
                  : "bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedbackMsg.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                )}
                <span>{feedbackMsg.text}</span>
              </div>
              <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {/* ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#64748B] mb-2">
                    <span className="text-xs font-bold uppercase">Doanh Thu Ghi Nhận</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DCFCE7] text-[#15803D]">
                      <DollarSign className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black font-mono text-[#15803D]">
                    {new Intl.NumberFormat("vi-VN").format(totalRevenue)}₫
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#16A34A] mt-2 font-semibold">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Từ các đơn hàng hợp lệ</span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#64748B] mb-2">
                    <span className="text-xs font-bold uppercase">Tổng Đơn Hàng</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black font-mono text-[#0F172A]">
                    {orders.length}
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-2">
                    {orders.filter((o) => o.status === "completed").length} đơn đã hoàn tất
                  </div>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#64748B] mb-2">
                    <span className="text-xs font-bold uppercase">Linh Kiện Trong Kho</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF1F2] text-[#E11D48]">
                      <Package className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black font-mono text-[#0F172A]">
                    {products.length}{" "}
                    <span className="text-xs font-normal text-[#64748B]">({totalStockUnits} chiếc)</span>
                  </div>
                  <div className="text-[11px] text-[#B91C1C] mt-2 font-semibold">
                    {lowStockCount > 0 ? `Cảnh báo: ${lowStockCount} sản phẩm sắp hết hàng` : "Tồn kho an toàn"}
                  </div>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#64748B] mb-2">
                    <span className="text-xs font-bold uppercase">Cấu Hình PC & Banner</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#B45309]">
                      <Monitor className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black font-mono text-[#0F172A]">
                    {deals.length}{" "}
                    <span className="text-xs font-normal text-[#64748B]">({banners.length} banner)</span>
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-2">
                    {suppliers.length} nhà cung cấp đang hợp tác
                  </div>
                </div>
              </div>

              {/* Recent Orders & Fast Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <h3 className="text-sm font-black uppercase text-[#0F172A] flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#E11D48]" />
                      Đơn hàng gần đây
                    </h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-bold text-[#E11D48] hover:underline"
                    >
                      Xem tất cả ({orders.length}) →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#64748B]">
                      Chưa có đơn hàng nào được ghi nhận.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E2E8F0] text-xs">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="py-3 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#0F172A]">{order.order_code}</span>
                              <span className="rounded bg-[#DCFCE7] text-[#15803D] px-2 py-0.2 text-[10px] font-bold uppercase">
                                {order.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#64748B] mt-0.5">
                              {order.customer_name} • {order.customer_phone}
                            </div>
                          </div>
                          <div className="text-right font-mono font-bold text-[#B45309]">
                            {new Intl.NumberFormat("vi-VN").format(order.total_vnd)}₫
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-black uppercase text-[#0F172A] border-b border-[#E2E8F0] pb-3">
                    Thao tác nhanh
                  </h3>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => setIsAddBannerOpen(true)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#E11D48] hover:bg-white transition-all text-xs font-bold text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <ImageIcon className="h-4 w-4 text-[#E11D48]" />
                        <span>Đăng poster sự kiện mới</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setIsAddDealOpen(true)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#EA580C] hover:bg-white transition-all text-xs font-bold text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Monitor className="h-4 w-4 text-[#EA580C]" />
                        <span>Tạo cấu hình PC ráp sẵn</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setIsAddSupplierOpen(true)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#16A34A] hover:bg-white transition-all text-xs font-bold text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Building className="h-4 w-4 text-[#16A34A]" />
                        <span>Thêm nguồn hàng / Nhà phân phối</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PRODUCT MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-1 items-center gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo tên linh kiện, mã SKU..."
                      className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#E11D48] focus:bg-white focus:outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                  </div>

                  <select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 px-3 text-xs text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
                  >
                    <option value="all">Tất cả thương hiệu</option>
                    {uniqueBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 px-3 text-xs text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
                  >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_vi}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-[#64748B] font-bold">
                  Hiển thị {filteredProducts.length} / {products.length} sản phẩm
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-black uppercase text-[#475569]">
                    <tr>
                      <th className="p-3.5">Linh kiện</th>
                      <th className="p-3.5">Mã SKU</th>
                      <th className="p-3.5">Hãng</th>
                      <th className="p-3.5">Giá bán</th>
                      <th className="p-3.5">Tồn kho</th>
                      <th className="p-3.5">Thông số PC Builder</th>
                      <th className="p-3.5 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-[#64748B]">
                          Đang đồng bộ dữ liệu...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-[#64748B]">
                          <Boxes className="mx-auto h-10 w-10 text-[#CBD5E1] mb-2" />
                          <p className="font-bold text-sm text-[#0F172A]">Không tìm thấy linh kiện nào.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-[#0F172A] max-w-xs">{p.name_vi}</div>
                            <div className="text-[10px] text-[#64748B] truncate max-w-xs">{p.name_en}</div>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-[#475569]">{p.sku}</td>
                          <td className="p-3.5">
                            <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[10px] font-black text-[#1D4ED8]">
                              {p.brand}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono font-black text-[#B45309]">
                            {new Intl.NumberFormat("vi-VN").format(p.price_vnd)}₫
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                                p.stock > 5
                                  ? "bg-[#DCFCE7] text-[#15803D]"
                                  : p.stock > 0
                                  ? "bg-[#FEF3C7] text-[#B45309]"
                                  : "bg-[#FEE2E2] text-[#B91C1C]"
                              }`}
                            >
                              {p.stock} chiếc
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-[10px] text-[#475569]">
                            {p.specs?.socket && <span className="mr-1.5 font-bold text-[#2563EB]">{String(p.specs.socket)}</span>}
                            {p.specs?.ram_type && <span className="mr-1.5 font-bold text-[#16A34A]">{String(p.specs.ram_type)}</span>}
                            {p.specs?.tdp_watts && <span className="mr-1.5">{String(p.specs.tdp_watts)}W</span>}
                            {p.specs?.vram_gb && <span>{String(p.specs.vram_gb)}GB</span>}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="rounded p-1.5 text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                              title="Xóa linh kiện"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CATEGORIES */}
          {/* ========================================================================= */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#64748B]">
                  Danh sách phân loại ({categories.length} danh mục)
                </h3>
                <Button
                  onClick={() => setIsAddCategoryOpen(true)}
                  variant="primary"
                  size="sm"
                  className="gap-1 text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm Danh Mục
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat) => {
                  const productCount = products.filter((p) => p.category_id === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs flex items-center justify-between hover:border-[#E11D48] transition-all"
                    >
                      <div>
                        <div className="text-sm font-black text-[#0F172A]">{cat.name_vi}</div>
                        <div className="text-xs font-mono text-[#64748B] mt-0.5">/{cat.slug}</div>
                        <div className="text-[11px] text-[#2563EB] font-bold mt-2">
                          {productCount} linh kiện
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="rounded p-1.5 text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                        title="Xóa danh mục"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: EVENT BANNERS & POSTERS */}
          {/* ========================================================================= */}
          {activeTab === "banners" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#64748B]">
                  Danh sách Banner & Poster sự kiện trang chủ ({banners.length} poster)
                </h3>
                <Button
                  onClick={() => setIsAddBannerOpen(true)}
                  variant="primary"
                  size="sm"
                  className="gap-1 text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Đăng Poster Mới
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full bg-[#0F172A]">
                      <Image
                        src={b.image_url}
                        alt={b.title_vi}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 rounded bg-[#E11D48] px-2 py-0.5 text-[10px] font-black text-white uppercase">
                        {b.tag || "SỰ KIỆN"}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[#64748B]">
                          Thứ tự: #{b.display_order}
                        </span>
                        <span className="rounded bg-[#DCFCE7] text-[#15803D] px-2 py-0.2 text-[10px] font-bold">
                          Đang hiển thị
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-[#0F172A] line-clamp-1">{b.title_vi}</h4>
                      {b.subtitle_vi && (
                        <p className="text-xs text-[#64748B] line-clamp-2">{b.subtitle_vi}</p>
                      )}
                      <div className="text-[10px] font-mono text-[#2563EB] truncate">
                        Link: {b.target_url}
                      </div>
                    </div>

                    <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
                      <button
                        onClick={() => handleDeleteBanner(b.id)}
                        className="text-xs text-[#B91C1C] hover:underline font-bold flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Xóa poster</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: PREBUILT PC DEALS (Bố Trí & Sắp Xếp Deal Máy Ráp Sẵn) */}
          {/* ========================================================================= */}
          {activeTab === "deals" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#64748B]">
                    Cấu Hình PC Ráp Sẵn ({deals.length} cấu hình)
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Sử dụng nút Lên/Xuống để sắp xếp thứ tự hiển thị của các deal máy trên trang chủ.
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddDealOpen(true)}
                  variant="primary"
                  size="sm"
                  className="gap-1 text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm Cấu Hình Mới
                </Button>
              </div>

              <div className="space-y-3">
                {deals.map((d, index) => (
                  <div
                    key={d.id}
                    className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Priority Sort Controls */}
                      <div className="flex flex-col gap-1 items-center bg-[#F8FAFC] p-1.5 rounded-lg border border-[#E2E8F0]">
                        <button
                          onClick={() => handleMoveDeal(index, "up")}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-[#E2E8F0] disabled:opacity-30"
                          title="Đẩy lên vị trí ưu tiên hơn"
                        >
                          <ArrowUp className="h-3.5 w-3.5 text-[#0F172A]" />
                        </button>
                        <span className="font-mono font-bold text-xs text-[#E11D48]">
                          #{index + 1}
                        </span>
                        <button
                          onClick={() => handleMoveDeal(index, "down")}
                          disabled={index === deals.length - 1}
                          className="p-1 rounded hover:bg-[#E2E8F0] disabled:opacity-30"
                          title="Hạ xuống vị trí sau"
                        >
                          <ArrowDown className="h-3.5 w-3.5 text-[#0F172A]" />
                        </button>
                      </div>

                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <Image
                          src={d.image_url}
                          alt={d.name_vi}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-[#E11D48] text-white px-2 py-0.2 text-[10px] font-black uppercase">
                            {d.badge || "DEAL HOT"}
                          </span>
                          <span className="font-bold text-sm text-[#0F172A]">{d.name_vi}</span>
                        </div>
                        <div className="text-xs text-[#64748B] mt-1 space-x-2">
                          <span className="font-mono font-bold text-[#2563EB]">{d.code}</span>
                          <span>•</span>
                          <span>{d.cpu}</span>
                          <span>•</span>
                          <span>{d.vga}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <div className="text-right">
                        <div className="font-mono font-black text-sm text-[#B45309]">
                          {new Intl.NumberFormat("vi-VN").format(d.price_vnd)}₫
                        </div>
                        {d.original_price_vnd && (
                          <div className="text-[10px] font-mono text-[#94A3B8] line-through">
                            {new Intl.NumberFormat("vi-VN").format(d.original_price_vnd)}₫
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteDeal(d.id)}
                        className="rounded p-2 text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                        title="Xóa cấu hình"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: HARDWARE SUPPLIERS & VENDORS */}
          {/* ========================================================================= */}
          {activeTab === "suppliers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#64748B]">
                  Quản lý nguồn hàng & Nhà phân phối ({suppliers.length} đối tác)
                </h3>
                <Button
                  onClick={() => setIsAddSupplierOpen(true)}
                  variant="primary"
                  size="sm"
                  className="gap-1 text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm Nhà Cung Cấp
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suppliers.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-black text-sm text-[#0F172A]">{s.name}</div>
                          <span className="font-mono text-xs font-bold text-[#2563EB]">{s.code}</span>
                        </div>
                        <span className="rounded bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 text-[10px] font-bold uppercase">
                          {s.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-[#475569] mt-3">
                        <p className="flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-[#64748B]" />
                          <span>Người liên hệ: <strong>{s.contact_person || "Chưa cập nhật"}</strong></span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-[#16A34A]" />
                          <span className="font-mono">{s.phone}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-[#2563EB]" />
                          <span>{s.email}</span>
                        </p>
                      </div>

                      {/* Brand pills */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {s.brands.map((brand, i) => (
                          <span
                            key={i}
                            className="rounded bg-[#F1F5F9] border border-[#CBD5E1] px-2 py-0.5 text-[10px] font-bold text-[#334155]"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#64748B] truncate max-w-xs">{s.address}</span>
                      <button
                        onClick={() => handleDeleteSupplier(s.id)}
                        className="text-[#B91C1C] hover:underline font-bold text-xs"
                      >
                        Xóa nhà phân phối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: ORDERS FULFILLMENT */}
          {/* ========================================================================= */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-bold">
                {["all", "pending", "processing", "shipping", "completed", "cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg transition-colors uppercase ${
                      orderStatusFilter === st
                        ? "bg-[#0F172A] text-white"
                        : "bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    {st === "all" ? "Tất cả đơn" : st}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-black uppercase text-[#475569]">
                    <tr>
                      <th className="p-3.5">Mã đơn</th>
                      <th className="p-3.5">Khách hàng</th>
                      <th className="p-3.5">Liên hệ</th>
                      <th className="p-3.5">Địa chỉ nhận</th>
                      <th className="p-3.5">Tổng thanh toán</th>
                      <th className="p-3.5">Trạng thái</th>
                      <th className="p-3.5 text-right">Chuyển trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-[#64748B]">
                          Chưa có đơn hàng nào phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="p-3.5 font-mono font-bold text-[#0F172A]">{order.order_code}</td>
                          <td className="p-3.5 font-bold text-[#0F172A]">{order.customer_name}</td>
                          <td className="p-3.5 font-mono text-[#475569]">{order.customer_phone}</td>
                          <td className="p-3.5 text-[#64748B] max-w-xs truncate">{order.shipping_address}</td>
                          <td className="p-3.5 font-mono font-black text-[#B45309]">
                            {new Intl.NumberFormat("vi-VN").format(order.total_vnd)}₫
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                                order.status === "completed"
                                  ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
                                  : order.status === "shipping"
                                  ? "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]"
                                  : "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "processing")}
                              className="rounded bg-[#FEF3C7] border border-[#FDE68A] px-2 py-1 text-[10px] font-bold text-[#B45309] hover:bg-[#FDE68A]"
                            >
                              Xử lý
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "shipping")}
                              className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-1 text-[10px] font-bold text-[#1D4ED8] hover:bg-[#BFDBFE]"
                            >
                              Giao hàng
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                              className="rounded bg-[#16A34A] px-2 py-1 text-[10px] font-bold text-white hover:bg-[#15803D]"
                            >
                              Hoàn thành
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: REVIEWS */}
          {/* ========================================================================= */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#64748B]">
                Kiểm duyệt đánh giá ({reviews.length} đánh giá)
              </h3>

              {reviews.length === 0 ? (
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center text-xs text-[#64748B]">
                  Chưa có đánh giá nào từ khách hàng.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-[#0F172A]">{rev.author_name}</div>
                          <div className="flex text-[#F59E0B]">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-[#475569] mt-2 leading-relaxed">{rev.comment}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3 text-[11px] text-[#64748B]">
                        <span>{rev.created_at ? new Date(rev.created_at).toLocaleDateString("vi-VN") : "Gần đây"}</span>
                        <button
                          onClick={async () => {
                            await adminService.deleteReview(rev.id);
                            loadAllData();
                          }}
                          className="text-[#B91C1C] hover:underline font-bold"
                        >
                          Xóa đánh giá
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: SECURITY & SYSTEM */}
          {/* ========================================================================= */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#15803D]">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="font-black uppercase text-xs">HttpOnly Cookies</span>
                  </div>
                  <div className="text-sm font-bold text-[#0F172A]">Bật hoàn toàn (Enforced)</div>
                  <p className="text-xs text-[#64748B]">
                    Phiên xác thực bảo vệ chống lại các cuộc tấn công đánh cắp phiên qua XSS.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#2563EB]">
                    <Activity className="h-5 w-5" />
                    <span className="font-black uppercase text-xs">Rate Limiter</span>
                  </div>
                  <div className="text-sm font-bold text-[#0F172A]">Chống Brute-Force (Active)</div>
                  <p className="text-xs text-[#64748B]">
                    Tối đa 5 lần đăng nhập/phút và 3 lần tạo tài khoản/10 phút theo địa chỉ IP.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#EA580C]">
                    <Server className="h-5 w-5" />
                    <span className="font-black uppercase text-xs">Cơ Sở Dữ Liệu</span>
                  </div>
                  <div className="text-sm font-bold text-[#0F172A]">Supabase PostgreSQL</div>
                  <p className="text-xs text-[#64748B]">
                    Kết nối an toàn qua REST API với RLS (Row Level Security).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* ADD PRODUCT MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title="THÊM SẢN PHẨM MỚI VÀO KHO HÀNG QMD-TECH"
        description="Điền thông số kỹ thuật thực tế để phục vụ công cụ kiểm tra tương thích Custom PC Builder"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Tên tiếng Việt *</label>
              <input
                required
                type="text"
                placeholder="VD: Card màn hình ASUS ROG Strix RTX 4070 Ti Super 16GB"
                value={productForm.name_vi}
                onChange={(e) => setProductForm({ ...productForm, name_vi: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Tên tiếng Anh</label>
              <input
                type="text"
                placeholder="VD: ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB"
                value={productForm.name_en}
                onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Mã SKU *</label>
              <input
                required
                type="text"
                placeholder="VD: GPU-ASUS-4070TIS"
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Thương hiệu *</label>
              <select
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              >
                <option value="ASUS">ASUS</option>
                <option value="MSI">MSI</option>
                <option value="Intel">Intel</option>
                <option value="AMD">AMD</option>
                <option value="GIGABYTE">GIGABYTE</option>
                <option value="Corsair">Corsair</option>
                <option value="Samsung">Samsung</option>
                <option value="Kingston">Kingston</option>
                <option value="NZXT">NZXT</option>
                <option value="Lian Li">Lian Li</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Danh mục *</label>
              <select
                value={productForm.category_id}
                onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_vi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Giá bán (VND) *</label>
              <input
                required
                type="number"
                value={productForm.price_vnd}
                onChange={(e) => setProductForm({ ...productForm, price_vnd: parseInt(e.target.value || "0", 10) })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Giá niêm yết cũ (VND)</label>
              <input
                type="number"
                value={productForm.original_price_vnd}
                onChange={(e) => setProductForm({ ...productForm, original_price_vnd: parseInt(e.target.value || "0", 10) })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Số lượng tồn kho *</label>
              <input
                required
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value || "0", 10) })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* PC Builder Compatibility Specs */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 space-y-2">
            <div className="font-black text-[#0F172A] uppercase text-[11px] flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#E11D48]" />
              Thông số tương thích công cụ Custom PC Builder
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[10px] text-[#64748B]">Socket (VD: LGA1700, AM5)</label>
                <input
                  type="text"
                  placeholder="LGA1700"
                  value={socketInput}
                  onChange={(e) => setSocketInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#64748B]">RAM Type (VD: DDR5, DDR4)</label>
                <input
                  type="text"
                  placeholder="DDR5"
                  value={ramTypeInput}
                  onChange={(e) => setRamTypeInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#64748B]">Công suất TDP (W)</label>
                <input
                  type="number"
                  placeholder="250"
                  value={tdpInput}
                  onChange={(e) => setTdpInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#64748B]">VRAM (GB)</label>
                <input
                  type="number"
                  placeholder="16"
                  value={vramInput}
                  onChange={(e) => setVramInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#475569] mb-1">Ảnh sản phẩm URL</label>
            <input
              type="url"
              value={productForm.images[0] || ""}
              onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
              className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#E2E8F0]">
            <Button type="submit" variant="primary" size="md" className="w-full font-black uppercase text-xs">
              Lưu Sản Phẩm Vào Kho
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD CATEGORY MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        title="THÊM DANH MỤC PHẦN CỨNG MỚI"
        description="Tạo danh mục mới để phân loại linh kiện trong cửa hàng"
        maxWidth="md"
      >
        <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#475569] mb-1">Tên danh mục (Tiếng Việt) *</label>
            <input
              required
              type="text"
              placeholder="VD: Card Màn Hình (VGA)"
              value={categoryForm.name_vi}
              onChange={(e) => setCategoryForm({ ...categoryForm, name_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#475569] mb-1">Slug URL (VD: gpu, cpu, ram) *</label>
            <input
              required
              type="text"
              placeholder="VD: gpu"
              value={categoryForm.slug}
              onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value.toLowerCase().trim() })}
              className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full font-black uppercase text-xs">
              Tạo Danh Mục Mới
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD BANNER MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddBannerOpen}
        onClose={() => setIsAddBannerOpen(false)}
        title="ĐĂNG BANNER / POSTER SỰ KIỆN TRANG CHỦ"
        description="Hình ảnh hiển thị trên Carousel trang chủ cho khách hàng"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateBanner} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#475569] mb-1">Tiêu đề Poster (Tiếng Việt) *</label>
            <input
              required
              type="text"
              placeholder="VD: Mở Bán GeForce RTX 40 Super Series"
              value={bannerForm.title_vi}
              onChange={(e) => setBannerForm({ ...bannerForm, title_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#475569] mb-1">Mô tả phụ / Thông điệp ngắn</label>
            <input
              type="text"
              placeholder="VD: Tặng kèm gói quà tặng gaming cao cấp khi đặt mua"
              value={bannerForm.subtitle_vi}
              onChange={(e) => setBannerForm({ ...bannerForm, subtitle_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Nhãn Tag (VD: SỰ KIỆN MỚI, FLASH SALE)</label>
              <input
                type="text"
                value={bannerForm.tag}
                onChange={(e) => setBannerForm({ ...bannerForm, tag: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] mb-1">Đường dẫn liên kết (Target URL)</label>
              <input
                type="text"
                value={bannerForm.target_url}
                onChange={(e) => setBannerForm({ ...bannerForm, target_url: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#475569] mb-1">Ảnh Banner URL (Khuyên dùng tỷ lệ 16:9 hoặc 21:9) *</label>
            <input
              required
              type="url"
              value={bannerForm.image_url}
              onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full font-black uppercase text-xs">
              Lưu & Xuất Bản Poster Lên Trang Chủ
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD PREBUILT DEAL MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        title="THÊM CẤU HÌNH PC RÁP SẴN MỚI"
        description="Đăng cấu hình máy bộ để khách hàng có thể mua ngay trên trang chủ"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Tên cấu hình PC *</label>
              <input
                required
                type="text"
                placeholder="VD: PC QMD-G01 Core i5-13400F | RTX 4060"
                value={dealForm.name_vi}
                onChange={(e) => setDealForm({ ...dealForm, name_vi: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] mb-1">Mã cấu hình (Code SKU) *</label>
              <input
                required
                type="text"
                placeholder="VD: PC-QMD-G01"
                value={dealForm.code}
                onChange={(e) => setDealForm({ ...dealForm, code: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Giá bán (VND) *</label>
              <input
                required
                type="number"
                value={dealForm.price_vnd}
                onChange={(e) => setDealForm({ ...dealForm, price_vnd: parseInt(e.target.value || "0", 10) })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] mb-1">Giá niêm yết cũ (VND)</label>
              <input
                type="number"
                value={dealForm.original_price_vnd ?? 0}
                onChange={(e) => setDealForm({ ...dealForm, original_price_vnd: parseInt(e.target.value || "0", 10) })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] mb-1">Nhãn Tag (Badge)</label>
              <input
                type="text"
                value={dealForm.badge}
                onChange={(e) => setDealForm({ ...dealForm, badge: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Vi xử lý CPU *</label>
              <input
                required
                type="text"
                placeholder="VD: Intel Core i5-13400F"
                value={dealForm.cpu}
                onChange={(e) => setDealForm({ ...dealForm, cpu: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] mb-1">Card màn hình VGA *</label>
              <input
                required
                type="text"
                placeholder="VD: ASUS Dual RTX 4060 8GB"
                value={dealForm.vga}
                onChange={(e) => setDealForm({ ...dealForm, vga: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Bộ nhớ RAM *</label>
              <input
                required
                type="text"
                placeholder="VD: 16GB (2x8GB) DDR4 3200MHz"
                value={dealForm.ram}
                onChange={(e) => setDealForm({ ...dealForm, ram: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] mb-1">Ổ cứng SSD *</label>
              <input
                required
                type="text"
                placeholder="VD: 500GB NVMe M.2 Gen4"
                value={dealForm.ssd}
                onChange={(e) => setDealForm({ ...dealForm, ssd: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#475569] mb-1">Ảnh đại diện cấu hình URL</label>
            <input
              type="url"
              value={dealForm.image_url}
              onChange={(e) => setDealForm({ ...dealForm, image_url: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full font-black uppercase text-xs">
              Lưu Cấu Hình PC Ráp Sẵn
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD SUPPLIER MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
        title="THÊM NHÀ PHÂN PHỐI / NGUỒN HÀNG MỚI"
        description="Quản lý thông tin đối tác cung cấp linh kiện cho hệ thống QMD-Tech"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Tên công ty / Nhà phân phối *</label>
              <input
                required
                type="text"
                placeholder="VD: Synnex FPT Distribution"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] mb-1">Mã nhà cung cấp (Code) *</label>
              <input
                required
                type="text"
                placeholder="VD: SUP-FPT"
                value={supplierForm.code}
                onChange={(e) => setSupplierForm({ ...supplierForm, code: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Người liên hệ phụ trách</label>
              <input
                type="text"
                placeholder="VD: Nguyễn Hoàng Long"
                value={supplierForm.contact_person}
                onChange={(e) => setSupplierForm({ ...supplierForm, contact_person: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] mb-1">Số điện thoại hotline</label>
              <input
                type="text"
                placeholder="VD: 024.7300.7300"
                value={supplierForm.phone}
                onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#475569] mb-1">Thương hiệu phân phối (cách nhau bằng dấu phẩy)</label>
            <input
              type="text"
              placeholder="VD: ASUS, Intel, Kingston, Western Digital"
              value={brandInputString}
              onChange={(e) => setBrandInputString(e.target.value)}
              className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#475569] mb-1">Địa chỉ kho / Trụ sở chính</label>
            <input
              type="text"
              placeholder="VD: Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội"
              value={supplierForm.address}
              onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] p-2 text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full font-black uppercase text-xs">
              Lưu Thông Tin Nhà Cung Cấp
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
