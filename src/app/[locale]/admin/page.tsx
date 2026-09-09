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
  CartItem,
  Review,
  EventBanner,
  PrebuiltDeal,
  Supplier,
  BlogPost,
  CreateBlogPostInput,
  SiteSettings,
  ShowroomLocation,
} from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { CloudinaryImageUpload } from "@/components/common/CloudinaryImageUpload";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Star,
  MessageSquareText,
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
  Pencil,
  Eye,
  EyeOff,
  LogOut,
  X,
  BookOpen,
  FileText,
  Sliders,
  Globe,
  Store,
  LayoutGrid,
  Save,
  RotateCcw,
  Briefcase,
  Download,
  Info,
  Flame,
} from "lucide-react";
import {
  MegaCategoryItem,
  MegaSubItem,
  AVAILABLE_ICON_NAMES,
  resolveMegaCategoryIcon,
  DEFAULT_MEGA_MENU_CATEGORIES,
} from "@/components/navigation/megaMenuData";
import { sanitizeSlug } from "@/modules/blog/service";
import {
  CareerJob,
  CreateCareerInput,
  UpdateCareerInput,
  CareerApplication,
  ApplicationStatus,
} from "@/modules/careers/types";
import { sanitizeCareerSlug } from "@/modules/careers/service";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "categories" | "menu" | "banners" | "deals" | "suppliers" | "blogs" | "careers" | "orders" | "reviews" | "settings" | "security"
  >("overview");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [banners, setBanners] = useState<EventBanner[]>([]);
  const [deals, setDeals] = useState<PrebuiltDeal[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [careers, setCareers] = useState<CareerJob[]>([]);
  const [isAddCareerOpen, setIsAddCareerOpen] = useState(false);
  const [isEditCareerOpen, setIsEditCareerOpen] = useState(false);
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null);
  const [careerSearchQuery, setCareerSearchQuery] = useState("");
  const [careerDeptFilter, setCareerDeptFilter] = useState("all");

  // Career Sub-tabs & Applications State
  const [careerSubTab, setCareerSubTab] = useState<"jobs" | "applications">("jobs");
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [applicationSearch, setApplicationSearch] = useState("");
  const [applicationStatusFilter, setApplicationStatusFilter] = useState<string>("all");
  const [applicationJobFilter, setApplicationJobFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);
  const [isAppDetailOpen, setIsAppDetailOpen] = useState(false);
  const [editingAppNotes, setEditingAppNotes] = useState("");
  const [editingAppStatus, setEditingAppStatus] = useState<ApplicationStatus>("pending");
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);

  // Order Details Modal & Search State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  const [careerForm, setCareerForm] = useState<CreateCareerInput>({
    title: "",
    slug: "",
    department: "Kỹ Thuật & Phần Cứng",
    location: "Hà Nội",
    employment_type: "Toàn thời gian",
    salary: "12.000.000₫ - 18.000.000₫",
    experience: "1 năm kinh nghiệm hoặc đam mê PC",
    description: "",
    requirements: "",
    benefits: "Chế độ BHXH đầy đủ, thưởng hiệu suất, phụ cấp ăn trưa, ưu đãi mua linh kiện PC giá gốc.",
    contact_email: "tuyendung@qmdtech.vn",
    is_active: true,
  });

  const [editCareerForm, setEditCareerForm] = useState<CreateCareerInput>({
    title: "",
    slug: "",
    department: "Kỹ Thuật & Phần Cứng",
    location: "Hà Nội",
    employment_type: "Toàn thời gian",
    salary: "",
    experience: "",
    description: "",
    requirements: "",
    benefits: "",
    contact_email: "tuyendung@qmdtech.vn",
    is_active: true,
  });

  // Mega Menu Customization State
  const [megaMenuCategories, setMegaMenuCategories] = useState<MegaCategoryItem[]>([]);
  const [activeMenuCatId, setActiveMenuCatId] = useState<string>("vga");
  const [isSavingMenu, setIsSavingMenu] = useState(false);
  const [isAddMenuCategoryOpen, setIsAddMenuCategoryOpen] = useState(false);
  const [newMenuCatForm, setNewMenuCatForm] = useState({
    name: "",
    slug: "",
    iconName: "Layers",
    allUrl: "/danh-muc",
  });
  const [newSubgroupTitle, setNewSubgroupTitle] = useState("");
  const [addingToSubgroupIdx, setAddingToSubgroupIdx] = useState<number | null>(null);
  const [newItemForm, setNewItemForm] = useState<MegaSubItem>({
    name: "",
    href: "/danh-muc",
    isHighlight: false,
  });

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    store_name: "QMD-Tech",
    slogan: "Gaming PC & Linh Kiện Máy Tính Chuyên Nghiệp",
    hotline: "1900.8888",
    hotline_support: "0988.888.888",
    support_email: "contact@qmdtech.vn",
    business_model: "online",
    business_model_text: "Bán hàng & Lắp ráp PC Online Toàn Quốc",
    headquarters_address: "Số 18 Phố Cầu Giấy, Quận Cầu Giấy, Hà Nội",
    has_showrooms: false,
    showrooms: [],
    bo_cong_thuong_registered: false,
    bo_cong_thuong_badge_url: "",
    bo_cong_thuong_link: "",
    bo_cong_thuong_license_no: "Đang làm thủ tục thông báo website thương mại điện tử với Bộ Công Thương",
    working_hours: "8:30 - 21:00 (Tất cả các ngày trong tuần)",
    facebook_url: "https://facebook.com/qmdtech",
    zalo_url: "https://zalo.me/0988888888",
    youtube_url: "https://youtube.com/@qmdtech",
    free_shipping_threshold_vnd: 5000000,
    flash_sale_enabled: true,
    flash_sale_title: "GIỜ VÀNG GIÁ TỐT",
    flash_sale_subtitle: "Linh kiện chính hãng • Bảo hành 1 đổi 1 trong 30 ngày • Số lượng ưu đãi có hạn",
    flash_sale_end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const formatForDatetimeLocal = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "";
      const pad = (n: number) => String(n).padStart(2, "0");
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  const handleQuickUpdateFlashSale = async (endTimeIso: string, isEnabled?: boolean) => {
    setIsSavingSettings(true);
    const updatedSettings: SiteSettings = {
      ...siteSettings,
      flash_sale_end_time: endTimeIso,
      ...(isEnabled !== undefined ? { flash_sale_enabled: isEnabled } : {}),
    };
    setSiteSettings(updatedSettings);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Lỗi lưu cấu hình Giờ Vàng");
      }
      showNotification("success", "Đã cập nhật thời gian đếm ngược Giờ Vàng Giá Tốt thành công!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi lưu cấu hình Giờ Vàng";
      showNotification("error", msg);
    } finally {
      setIsSavingSettings(false);
    }
  };
  const [newShowroom, setNewShowroom] = useState<ShowroomLocation>({
    id: "",
    city: "Hà Nội",
    name: "Showroom Hà Nội",
    address: "Số 18 Phố Cầu Giấy, Q. Cầu Giấy, Hà Nội",
    phone: "1900.8888",
    hours: "8:30 - 21:00",
    is_active: true,
  });

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [blogCategoryFilter, setBlogCategoryFilter] = useState("all");

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddBlogOpen, setIsAddBlogOpen] = useState(false);
  const [isEditBlogOpen, setIsEditBlogOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Blog Form State
  const [blogForm, setBlogForm] = useState<CreateBlogPostInput>({
    title_vi: "",
    title_en: "",
    slug: "",
    excerpt_vi: "",
    excerpt_en: "",
    content_html_vi: "<h2>1. Tổng quan về công nghệ</h2>\n<p>Nội dung giới thiệu chi tiết về linh kiện và giải pháp phần cứng...</p>",
    content_html_en: "",
    cover_image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80",
    author_name: "QMD Hardware Team",
    category: "Kiến Thức Phần Cứng",
    tags: ["PC Gaming", "Hardware"],
    is_published: true,
    reading_time_mins: 5,
  });

  const [editBlogForm, setEditBlogForm] = useState<CreateBlogPostInput>({
    title_vi: "",
    title_en: "",
    slug: "",
    excerpt_vi: "",
    excerpt_en: "",
    content_html_vi: "",
    content_html_en: "",
    cover_image: "",
    author_name: "QMD Hardware Team",
    category: "Kiến Thức Phần Cứng",
    tags: [],
    is_published: true,
    reading_time_mins: 5,
  });

  // Banner Position Filter & Forms
  const [bannerPositionFilter, setBannerPositionFilter] = useState<string>("all");

  const bannerPositionCounts = useMemo(() => {
    return {
      all: banners.length,
      hero: banners.filter((b) => (b.position || "hero") === "hero").length,
      middle_carousel: banners.filter((b) => b.position === "middle_carousel").length,
      side_left: banners.filter((b) => b.position === "side_left").length,
      side_right: banners.filter((b) => b.position === "side_right").length,
    };
  }, [banners]);

  const filteredBanners = useMemo(() => {
    if (bannerPositionFilter === "all") return banners;
    return banners.filter((b) => (b.position || "hero") === bannerPositionFilter);
  }, [banners, bannerPositionFilter]);

  // Edit Banner Form State
  const [editBannerForm, setEditBannerForm] = useState<CreateBannerInput>({
    title_vi: "",
    title_en: "",
    subtitle_vi: "",
    subtitle_en: "",
    tag: "SỰ KIỆN",
    image_url: "",
    target_url: "/danh-muc",
    display_order: 1,
    is_active: true,
    position: "hero",
  });

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

  // Edit Product Form State
  const [editProductForm, setEditProductForm] = useState<CreateProductInput>({
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

  const [editSocketInput, setEditSocketInput] = useState("");
  const [editRamTypeInput, setEditRamTypeInput] = useState("");
  const [editTdpInput, setEditTdpInput] = useState("");
  const [editVramInput, setEditVramInput] = useState("");

  const formatVndNumber = (num?: number | null) => {
    return new Intl.NumberFormat("en-US").format(num || 0);
  };

  const parseVndNumber = (val: string) => {
    const digits = val.replace(/[^0-9]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  };

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    slug: "",
    name_vi: "",
    name_en: "",
    icon: "Cpu",
  });

  const [editCategoryForm, setEditCategoryForm] = useState({
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
    position: "hero",
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
      const [p, c, o, r, b, d, s, bl, m, cr, apps] = await Promise.all([
        adminService.getProducts(),
        adminService.getCategories(),
        adminService.getOrders(),
        adminService.getReviews(),
        adminService.getBanners(),
        adminService.getPrebuiltDeals(),
        adminService.getSuppliers(),
        adminService.getBlogPosts(),
        adminService.getMegaMenu(),
        adminService.getCareers(),
        adminService.getCareerApplications(),
      ]);
      setProducts(p);
      setCategories(c);
      setOrders(o);
      setReviews(r);
      setBanners(b);
      setDeals(d);
      setSuppliers(s);
      setBlogs(bl);
      setMegaMenuCategories(m);
      setCareers(cr);
      setApplications(apps || []);
      if (m.length > 0) {
        setActiveMenuCatId((prev) => (m.some((cat) => cat.id === prev) ? prev : m[0].id));
      }

      // Fetch dynamic site settings
      try {
        const setRes = await fetch("/api/settings");
        const setJson = await setRes.json();
        if (setJson.success && setJson.settings) {
          setSiteSettings(setJson.settings);
        }
      } catch {
        // Fallback to initial state
      }

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

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Lỗi lưu cấu hình");
      }
      showNotification("success", "Đã lưu và áp dụng cấu hình website thành công!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi lưu cấu hình";
      showNotification("error", msg);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddShowroom = () => {
    if (!newShowroom.name || !newShowroom.address) {
      showNotification("error", "Vui lòng nhập đầy đủ tên và địa chỉ showroom");
      return;
    }
    const item: ShowroomLocation = {
      ...newShowroom,
      id: "sr_" + Date.now(),
    };
    setSiteSettings((prev) => ({
      ...prev,
      showrooms: [...(prev.showrooms || []), item],
    }));
    setNewShowroom({
      id: "",
      city: "Hà Nội",
      name: "",
      address: "",
      phone: "1900.8888",
      hours: "8:30 - 21:00",
      is_active: true,
    });
    showNotification("success", "Đã thêm showroom vào danh sách cấu hình!");
  };

  const handleRemoveShowroom = (id: string) => {
    setSiteSettings((prev) => ({
      ...prev,
      showrooms: (prev.showrooms || []).filter((s) => s.id !== id),
    }));
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

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setEditProductForm({
      name_vi: p.name_vi || "",
      name_en: p.name_en || "",
      slug: p.slug || "",
      sku: p.sku || "",
      brand: p.brand || "ASUS",
      category_id: p.category_id || categories[0]?.id || "",
      price_vnd: p.price_vnd || 0,
      original_price_vnd: p.original_price_vnd || 0,
      stock: p.stock || 0,
      images: p.images || [],
      specs: p.specs || {},
      warranty_months: p.warranty_months || 36,
      is_featured: !!p.is_featured,
    });
    setEditSocketInput(p.specs?.socket ? String(p.specs.socket) : "");
    setEditRamTypeInput(p.specs?.ram_type ? String(p.specs.ram_type) : "");
    setEditTdpInput(p.specs?.tdp_watts ? String(p.specs.tdp_watts) : "");
    setEditVramInput(p.specs?.vram_gb ? String(p.specs.vram_gb) : "");
    setIsEditProductOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;
    try {
      const specs: Record<string, unknown> = { ...(editProductForm.specs || {}) };
      if (editSocketInput.trim()) specs.socket = editSocketInput.trim();
      if (editRamTypeInput.trim()) specs.ram_type = editRamTypeInput.trim();
      if (editTdpInput.trim()) specs.tdp_watts = parseInt(editTdpInput.trim(), 10);
      if (editVramInput.trim()) specs.vram_gb = parseInt(editVramInput.trim(), 10);

      const generatedSlug =
        editProductForm.slug ||
        editProductForm.name_vi.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      await adminService.updateProduct(editingProductId, {
        ...editProductForm,
        slug: generatedSlug,
        specs,
      });

      showNotification("success", "Đã cập nhật linh kiện thành công!");
      setIsEditProductOpen(false);
      setEditingProductId(null);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi cập nhật sản phẩm: " + msg);
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

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setEditCategoryForm({
      slug: cat.slug,
      name_vi: cat.name_vi,
      name_en: cat.name_en || "",
      icon: cat.icon || "Cpu",
    });
    setIsEditCategoryOpen(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategoryId) return;
    try {
      await adminService.updateCategory(editingCategoryId, editCategoryForm);
      showNotification("success", "Đã cập nhật thông tin danh mục thành công!");
      setIsEditCategoryOpen(false);
      setEditingCategoryId(null);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi cập nhật danh mục: " + msg);
    }
  };

  const handleSeedCategories = async () => {
    try {
      const seeded = await adminService.seedDefaultCategories();
      setCategories(seeded);
      showNotification("success", "Đã đồng bộ và khởi tạo 10 danh mục linh kiện chuẩn!");
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi đồng bộ danh mục: " + msg);
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

  // =========================================================================
  // MEGA MENU HANDLERS
  // =========================================================================
  const activeMenuCategory =
    megaMenuCategories.find((c) => c.id === activeMenuCatId) || megaMenuCategories[0];

  const handleMoveMenuCategory = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= megaMenuCategories.length) return;
    const copy = [...megaMenuCategories];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setMegaMenuCategories(copy);
  };

  const handleDeleteMenuCategory = (catId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này khỏi Menu Dropdown?")) return;
    const filtered = megaMenuCategories.filter((c) => c.id !== catId);
    setMegaMenuCategories(filtered);
    if (activeMenuCatId === catId && filtered.length > 0) {
      setActiveMenuCatId(filtered[0].id);
    }
  };

  const handleCreateMenuCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuCatForm.name.trim()) {
      showNotification("error", "Vui lòng nhập tên danh mục hiển thị.");
      return;
    }
    const cleanSlug = (newMenuCatForm.slug || newMenuCatForm.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");

    const newCat: MegaCategoryItem = {
      id: cleanSlug || `cat-${Date.now()}`,
      slug: cleanSlug || "danh-muc",
      name: newMenuCatForm.name.trim(),
      iconName: newMenuCatForm.iconName || "Layers",
      allUrl: newMenuCatForm.allUrl.trim() || `/danh-muc/${cleanSlug}`,
      subGroups: [],
    };

    const updated = [...megaMenuCategories, newCat];
    setMegaMenuCategories(updated);
    setActiveMenuCatId(newCat.id);
    setIsAddMenuCategoryOpen(false);
    setNewMenuCatForm({
      name: "",
      slug: "",
      iconName: "Layers",
      allUrl: "/danh-muc",
    });
    showNotification("success", `Đã thêm danh mục "${newCat.name}" vào Menu Dropdown!`);
  };

  const handleUpdateActiveCategoryField = (
    field: "name" | "slug" | "iconName" | "allUrl",
    value: string
  ) => {
    if (!activeMenuCategory) return;
    const updated = megaMenuCategories.map((cat) => {
      if (cat.id === activeMenuCategory.id) {
        return { ...cat, [field]: value };
      }
      return cat;
    });
    setMegaMenuCategories(updated);
  };

  const handleAddSubgroup = (title: string) => {
    if (!activeMenuCategory || !title.trim()) return;
    const updated = megaMenuCategories.map((cat) => {
      if (cat.id === activeMenuCategory.id) {
        return {
          ...cat,
          subGroups: [...(cat.subGroups || []), { title: title.trim(), items: [] }],
        };
      }
      return cat;
    });
    setMegaMenuCategories(updated);
    showNotification("success", `Đã thêm nhóm "${title.trim()}"!`);
  };

  const handleDeleteSubgroup = (subgroupIdx: number) => {
    if (!activeMenuCategory) return;
    const updated = megaMenuCategories.map((cat) => {
      if (cat.id === activeMenuCategory.id) {
        const subGroups = [...cat.subGroups];
        subGroups.splice(subgroupIdx, 1);
        return { ...cat, subGroups };
      }
      return cat;
    });
    setMegaMenuCategories(updated);
  };

  const handleMoveSubgroup = (subgroupIdx: number, direction: "up" | "down") => {
    if (!activeMenuCategory) return;
    const targetIdx = direction === "up" ? subgroupIdx - 1 : subgroupIdx + 1;
    if (targetIdx < 0 || targetIdx >= activeMenuCategory.subGroups.length) return;
    const updated = megaMenuCategories.map((cat) => {
      if (cat.id === activeMenuCategory.id) {
        const subGroups = [...cat.subGroups];
        const temp = subGroups[subgroupIdx];
        subGroups[subgroupIdx] = subGroups[targetIdx];
        subGroups[targetIdx] = temp;
        return { ...cat, subGroups };
      }
      return cat;
    });
    setMegaMenuCategories(updated);
  };

  const handleUpdateSubgroupTitle = (subgroupIdx: number, title: string) => {
    if (!activeMenuCategory) return;
    const updated = megaMenuCategories.map((cat) => {
      if (cat.id === activeMenuCategory.id) {
        const subGroups = [...cat.subGroups];
        subGroups[subgroupIdx] = { ...subGroups[subgroupIdx], title };
        return { ...cat, subGroups };
      }
      return cat;
    });
    setMegaMenuCategories(updated);
  };

  const handleCommitAddItem = (subgroupIdx: number) => {
    if (!activeMenuCategory || !newItemForm.name.trim()) return;
    const item: MegaSubItem = {
      name: newItemForm.name.trim(),
      href: newItemForm.href.trim() || activeMenuCategory.allUrl || "/danh-muc",
      isHighlight: Boolean(newItemForm.isHighlight),
    };
    const updated = megaMenuCategories.map((cat) => {
      if (cat.id === activeMenuCategory.id) {
        const subGroups = [...cat.subGroups];
        const targetGroup = { ...subGroups[subgroupIdx] };
        targetGroup.items = [...targetGroup.items, item];
        subGroups[subgroupIdx] = targetGroup;
        return { ...cat, subGroups };
      }
      return cat;
    });
    setMegaMenuCategories(updated);
    setAddingToSubgroupIdx(null);
    setNewItemForm({
      name: "",
      href: activeMenuCategory.allUrl || "/danh-muc",
      isHighlight: false,
    });
    showNotification("success", `Đã thêm liên kết "${item.name}"!`);
  };

  const handleUpdateItemField = (
    subgroupIdx: number,
    itemIdx: number,
    field: "name" | "href" | "isHighlight",
    value: unknown
  ) => {
    if (!activeMenuCategory) return;
    const updated = megaMenuCategories.map((cat) => {
      if (cat.id === activeMenuCategory.id) {
        const subGroups = [...cat.subGroups];
        const group = { ...subGroups[subgroupIdx] };
        const items = [...group.items];
        items[itemIdx] = { ...items[itemIdx], [field]: value };
        group.items = items;
        subGroups[subgroupIdx] = group;
        return { ...cat, subGroups };
      }
      return cat;
    });
    setMegaMenuCategories(updated);
  };

  const handleDeleteItem = (subgroupIdx: number, itemIdx: number) => {
    if (!activeMenuCategory) return;
    const updated = megaMenuCategories.map((cat) => {
      if (cat.id === activeMenuCategory.id) {
        const subGroups = [...cat.subGroups];
        const group = { ...subGroups[subgroupIdx] };
        const items = [...group.items];
        items.splice(itemIdx, 1);
        group.items = items;
        subGroups[subgroupIdx] = group;
        return { ...cat, subGroups };
      }
      return cat;
    });
    setMegaMenuCategories(updated);
  };

  const handleSaveMenu = async () => {
    setIsSavingMenu(true);
    try {
      await adminService.updateMegaMenu(megaMenuCategories);
      showNotification("success", "Đã lưu và áp dụng cấu hình Menu Dropdown thành công!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi lưu menu: " + msg);
    } finally {
      setIsSavingMenu(false);
    }
  };

  const handleResetMenu = async () => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn khôi phục Menu Dropdown về 12 danh mục mặc định chuẩn của QMD-Tech?"
      )
    )
      return;
    setIsSavingMenu(true);
    try {
      const resetData = await adminService.resetMegaMenu();
      setMegaMenuCategories(resetData);
      if (resetData.length > 0) {
        setActiveMenuCatId(resetData[0].id);
      }
      showNotification("success", "Đã khôi phục Menu Dropdown về 12 danh mục mặc định chuẩn!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi khôi phục menu: " + msg);
    } finally {
      setIsSavingMenu(false);
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
        position: "hero",
      });
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi tạo banner: " + msg);
    }
  };

  const handleStartEditBanner = (banner: EventBanner) => {
    setEditingBannerId(banner.id);
    setEditBannerForm({
      title_vi: banner.title_vi,
      title_en: banner.title_en,
      subtitle_vi: banner.subtitle_vi || "",
      subtitle_en: banner.subtitle_en || "",
      tag: banner.tag || "SỰ KIỆN",
      image_url: banner.image_url,
      target_url: banner.target_url,
      display_order: banner.display_order,
      is_active: banner.is_active,
      position: banner.position || "hero",
    });
    setIsEditBannerOpen(true);
  };

  const handleUpdateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBannerId) return;
    try {
      await adminService.updateBanner(editingBannerId, editBannerForm);
      showNotification("success", "Đã cập nhật thông tin poster sự kiện thành công!");
      setIsEditBannerOpen(false);
      setEditingBannerId(null);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi cập nhật banner: " + msg);
    }
  };

  const handleToggleBannerActive = async (banner: EventBanner) => {
    try {
      await adminService.updateBanner(banner.id, { is_active: !banner.is_active });
      showNotification("success", banner.is_active ? "Đã tạm ẩn poster khỏi trang chủ" : "Đã kích hoạt hiển thị poster lên trang chủ!");
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi cập nhật trạng thái: " + msg);
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

  // Blog Posts Handlers
  const handleCreateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanSlug = sanitizeSlug(blogForm.slug, blogForm.title_vi);
      await adminService.createBlogPost({ ...blogForm, slug: cleanSlug });
      showNotification("success", "Đã xuất bản bài viết công nghệ mới!");
      setIsAddBlogOpen(false);
      setBlogForm({
        title_vi: "",
        title_en: "",
        slug: "",
        excerpt_vi: "",
        excerpt_en: "",
        content_html_vi: "<h2>1. Tổng quan về công nghệ</h2>\n<p>Nội dung giới thiệu chi tiết...</p>",
        content_html_en: "",
        cover_image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80",
        author_name: "QMD Hardware Team",
        category: "Kiến Thức Phần Cứng",
        tags: ["PC Gaming", "Hardware"],
        is_published: true,
        reading_time_mins: 5,
      });
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi tạo bài viết: " + msg);
    }
  };

  const handleUpdateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlogId) return;
    try {
      const cleanSlug = sanitizeSlug(editBlogForm.slug, editBlogForm.title_vi);
      await adminService.updateBlogPost(editingBlogId, { ...editBlogForm, slug: cleanSlug });
      showNotification("success", "Đã lưu thay đổi bài viết thành công!");
      setIsEditBlogOpen(false);
      setEditingBlogId(null);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi cập nhật bài viết: " + msg);
    }
  };

  const handleTogglePublishBlog = async (blog: BlogPost) => {
    try {
      await adminService.updateBlogPost(blog.id, { is_published: !blog.is_published });
      showNotification("success", `Đã ${blog.is_published ? "tạm ẩn bài viết về bản nháp" : "công khai bài viết lên trang web"}!`);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi thay đổi trạng thái: " + msg);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết công nghệ này?")) return;
    try {
      await adminService.deleteBlogPost(id);
      showNotification("success", "Đã xóa bài viết thành công!");
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi xóa bài viết: " + msg);
    }
  };

  // Career / Recruitment Handlers
  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanSlug = sanitizeCareerSlug(careerForm.slug, careerForm.title);
      await adminService.createCareer({ ...careerForm, slug: cleanSlug });
      showNotification("success", "Đã thêm vị trí tuyển dụng mới thành công!");
      setIsAddCareerOpen(false);
      setCareerForm({
        title: "",
        slug: "",
        department: "Kỹ Thuật & Phần Cứng",
        location: "Hà Nội",
        employment_type: "Toàn thời gian",
        salary: "12.000.000₫ - 18.000.000₫",
        experience: "1 năm kinh nghiệm hoặc đam mê PC",
        description: "",
        requirements: "",
        benefits: "Chế độ BHXH đầy đủ, thưởng hiệu suất, phụ cấp ăn trưa, ưu đãi mua linh kiện PC giá gốc.",
        contact_email: "tuyendung@qmdtech.vn",
        is_active: true,
      });
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi thêm vị trí: " + msg);
    }
  };

  const handleUpdateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCareerId) return;
    try {
      const cleanSlug = sanitizeCareerSlug(editCareerForm.slug, editCareerForm.title);
      await adminService.updateCareer(editingCareerId, { ...editCareerForm, slug: cleanSlug });
      showNotification("success", "Cập nhật vị trí tuyển dụng thành công!");
      setIsEditCareerOpen(false);
      setEditingCareerId(null);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi cập nhật vị trí: " + msg);
    }
  };

  const handleToggleActiveCareer = async (job: CareerJob) => {
    try {
      await adminService.updateCareer(job.id, { is_active: !job.is_active });
      showNotification(
        "success",
        job.is_active
          ? "Đã tạm đóng nhận hồ sơ cho vị trí này."
          : "Đã kích hoạt hiển thị tuyển dụng cho vị trí này!"
      );
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi chuyển trạng thái: " + msg);
    }
  };

  const handleDeleteCareer = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa vị trí tuyển dụng này?")) return;
    try {
      await adminService.deleteCareer(id);
      showNotification("success", "Đã xóa vị trí tuyển dụng!");
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi xóa vị trí: " + msg);
    }
  };

  // Career Applications Handlers
  const handleUpdateApplicationStatus = async (
    id: string,
    status: ApplicationStatus,
    notes?: string
  ) => {
    setIsUpdatingApp(true);
    try {
      const updated = await adminService.updateApplicationStatus(id, {
        status,
        notes: notes !== undefined ? notes : undefined,
      });
      if (updated) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? updated : app))
        );
        if (selectedApplication?.id === id) {
          setSelectedApplication(updated);
        }
        showNotification("success", "Cập nhật trạng thái hồ sơ ứng viên thành công!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi cập nhật hồ sơ: " + msg);
    } finally {
      setIsUpdatingApp(false);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa hồ sơ ứng tuyển này không?")) return;
    try {
      await adminService.deleteCareerApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (selectedApplication?.id === id) {
        setIsAppDetailOpen(false);
        setSelectedApplication(null);
      }
      showNotification("success", "Đã xóa hồ sơ ứng viên!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi xóa hồ sơ: " + msg);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchStatus =
        applicationStatusFilter === "all" || app.status === applicationStatusFilter;
      const matchJob =
        applicationJobFilter === "all" ||
        app.career_id === applicationJobFilter ||
        app.job_title === applicationJobFilter;
      const q = applicationSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        app.full_name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone.toLowerCase().includes(q) ||
        app.job_title.toLowerCase().includes(q) ||
        (app.notes && app.notes.toLowerCase().includes(q));
      return matchStatus && matchJob && matchSearch;
    });
  }, [applications, applicationStatusFilter, applicationJobFilter, applicationSearch]);

  const getAppStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return { label: "Chờ duyệt", bg: "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]" };
      case "reviewed":
        return { label: "Đã xem qua", bg: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]" };
      case "contacted":
        return { label: "Đã liên hệ", bg: "bg-[#ECFEFF] text-[#0E7490] border-[#A5F3FC]" };
      case "interview":
        return { label: "Phỏng vấn", bg: "bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF]" };
      case "accepted":
        return { label: "Tuyển dụng", bg: "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]" };
      case "rejected":
        return { label: "Từ chối", bg: "bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]" };
      default:
        return { label: status, bg: "bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]" };
    }
  };

  const formatAppFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleAdminLogout = async () => {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống Quản trị?")) return;
    try {
      await fetch("/api/auth/admin-login", { method: "DELETE" });
      window.location.href = "/vi/admin/login";
    } catch {
      window.location.href = "/vi/admin/login";
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
    return orders.filter((o) => {
      const matchStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
      const q = orderSearchQuery.toLowerCase().trim();
      if (!q) return matchStatus;
      const matchSearch =
        o.order_code?.toLowerCase().includes(q) ||
        o.customer_name?.toLowerCase().includes(q) ||
        o.customer_phone?.toLowerCase().includes(q) ||
        o.customer_email?.toLowerCase().includes(q) ||
        o.shipping_city?.toLowerCase().includes(q) ||
        o.shipping_address?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Filtered Blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat = blogCategoryFilter === "all" || b.category === blogCategoryFilter;
      const matchSearch =
        searchQuery === "" ||
        b.title_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [blogs, blogCategoryFilter, searchQuery]);

  // Filtered Careers
  const filteredCareers = useMemo(() => {
    return careers.filter((job) => {
      const matchDept =
        careerDeptFilter === "all" || job.department === careerDeptFilter;
      const matchSearch =
        !careerSearchQuery.trim() ||
        job.title.toLowerCase().includes(careerSearchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(careerSearchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(careerSearchQuery.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [careers, careerDeptFilter, careerSearchQuery]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const q = categorySearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        c.name_vi?.toLowerCase().includes(q) ||
        c.name_en?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q)
      );
    });
  }, [categories, categorySearchQuery]);

  // Financial & Inventory Statistics
  const totalRevenue = orders
    .filter((o) => o.status === "completed" || o.status === "processing" || o.status === "shipping")
    .reduce((sum, o) => sum + (o.total_vnd || 0), 0);

  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* ========================================================================= */}
      {/* 1. DISTINCT ENTERPRISE BACKOFFICE SIDEBAR (STRICTLY FIXED) */}
      {/* ========================================================================= */}
      <aside className="w-64 shrink-0 bg-white text-[#475569] flex flex-col justify-between border-r border-[#E2E8F0] shadow-xs h-full overflow-y-auto z-20">
        <div>
          {/* Admin Header & Logo */}
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#0063FD] shadow-xs bg-white">
                <Image
                  src="/qmdtech_logo.png"
                  alt="QMD-Tech Admin"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-wider text-[#0F172A]">
                  QMD<span className="text-[#0063FD]">-TECH</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0063FD] mt-0.5">
                  ADMIN CONSOLE
                </span>
              </div>
            </div>
            <span className="rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#0063FD] border border-[#BFDBFE]">
              v2.5
            </span>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-3 space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "overview"
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
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
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4" />
                <span>Kho sản phẩm</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                activeTab === "products"
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]"
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "categories"
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="h-4 w-4" />
                <span>Danh mục linh kiện</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                activeTab === "categories"
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]"
              }`}>
                {categories.length}
              </span>
            </button>

            {/* MEGA MENU DROPDOWN TAB */}
            <button
              onClick={() => setActiveTab("menu")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "menu"
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="h-4 w-4" />
                <span>Menu Dropdown</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                activeTab === "menu"
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#EFF6FF] text-[#0063FD] font-black border border-[#BFDBFE]"
              }`}>
                {megaMenuCategories.length}
              </span>
            </button>

            {/* BANNERS TAB */}
            <button
              onClick={() => setActiveTab("banners")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "banners"
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="h-4 w-4" />
                <span>Banner & Poster Sự Kiện</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                activeTab === "banners"
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]"
              }`}>
                {banners.length}
              </span>
            </button>

            {/* PREBUILT DEALS TAB */}
            <button
              onClick={() => setActiveTab("deals")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "deals"
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Monitor className="h-4 w-4" />
                <span>PC Ráp Sẵn (Deals)</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                activeTab === "deals"
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#EFF6FF] text-[#0063FD] font-black border border-[#BFDBFE]"
              }`}>
                {deals.length}
              </span>
            </button>

            {/* SUPPLIERS TAB */}
            <button
              onClick={() => setActiveTab("suppliers")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "suppliers"
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building className="h-4 w-4" />
                <span>Nguồn hàng & NCC</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                activeTab === "suppliers"
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]"
              }`}>
                {suppliers.length}
              </span>
            </button>

            {/* BLOGS & TECH NEWS TAB */}
            <button
              onClick={() => setActiveTab("blogs")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "blogs"
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4" />
                <span>Bài viết & Tin tức</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                activeTab === "blogs"
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#EFF6FF] text-[#0063FD] font-black border border-[#BFDBFE]"
              }`}>
                {blogs.length}
              </span>
            </button>

            {/* CAREERS / RECRUITMENT TAB */}
            <button
              onClick={() => setActiveTab("careers")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "careers"
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="h-4 w-4" />
                <span>Tuyển dụng & Career</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                  activeTab === "careers"
                    ? "bg-white/20 text-white font-bold"
                    : "bg-[#EFF6FF] text-[#0063FD] font-black border border-[#BFDBFE]"
                }`}>
                  {careers.length} VT
                </span>
                {applications.length > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                    activeTab === "careers"
                      ? "bg-white/30 text-white"
                      : "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                  }`}>
                    {applications.length} HS
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "orders"
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
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
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquareText className="h-4 w-4" />
                <span>Đánh giá khách hàng</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                activeTab === "reviews"
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]"
              }`}>
                {reviews.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "settings"
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="h-4 w-4" />
                <span>Cấu hình Website</span>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-[#0063FD]" />
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                activeTab === "security"
                  ? "bg-[#0063FD] text-white shadow-xs font-black"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
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
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#0063FD] font-bold text-xs">
              <UserCheck className="h-4 w-4 text-[#0063FD]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#0F172A] truncate">Admin Operator</div>
              <div className="text-[10px] text-[#64748B] font-mono truncate">admin@qmdtech.vn</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1 w-full rounded-lg border border-[#CBD5E1] bg-white py-2 text-[11px] font-bold text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#0063FD]" />
              Web Shop
            </Link>
            <button
              onClick={handleAdminLogout}
              className="flex items-center justify-center gap-1 w-full rounded-lg border border-[#FECACA] bg-[#FEF2F2] py-2 text-[11px] font-bold text-[#DC2626] hover:bg-[#FEE2E2] hover:text-[#B91C1C] transition-colors"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="h-3.5 w-3.5" />
              Đăng xuất
            </button>
          </div>
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
              {activeTab === "menu" && "Tùy Chỉnh Menu Dropdown Khách Hàng"}
              {activeTab === "banners" && "Quản Lý Banner & Poster Sự Kiện"}
              {activeTab === "deals" && "Cấu Hình PC Ráp Sẵn & Bố Trí Trang Chủ"}
              {activeTab === "suppliers" && "Danh Sách Nguồn Hàng & Nhà Phân Phối"}
              {activeTab === "blogs" && "Quản Lý Bài Viết & Tin Công Nghệ"}
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
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#0063FD]" : ""}`} />
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
            {activeTab === "categories" && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSeedCategories}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs font-bold text-[#0063FD] border-[#BFDBFE] hover:bg-[#EFF6FF]"
                  title="Khởi tạo hoặc đồng bộ lại 10 danh mục linh kiện PC chuẩn"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-[#0063FD]" />
                  Đồng Bộ 10 Danh Mục Chuẩn
                </Button>
                <Button
                  onClick={() => setIsAddCategoryOpen(true)}
                  variant="primary"
                  size="sm"
                  className="gap-1 text-xs font-black shadow-xs uppercase"
                >
                  <Plus className="h-4 w-4" />
                  Thêm Danh Mục
                </Button>
              </div>
            )}
            {activeTab === "menu" && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleResetMenu}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs font-bold text-[#64748B] border-[#CBD5E1] hover:bg-[#F1F5F9]"
                  title="Khôi phục về 12 danh mục mặc định chuẩn"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Khôi Phục Gốc</span>
                </Button>
                <Button
                  onClick={() => setIsAddMenuCategoryOpen(true)}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs font-bold text-[#0063FD] border-[#BFDBFE] hover:bg-[#EFF6FF]"
                >
                  <Plus className="h-3.5 w-3.5 text-[#0063FD]" />
                  <span className="hidden sm:inline">Thêm Danh Mục</span>
                </Button>
                <Button
                  onClick={handleSaveMenu}
                  disabled={isSavingMenu}
                  variant="primary"
                  size="sm"
                  className="gap-1.5 text-xs font-black shadow-xs uppercase"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSavingMenu ? "Đang lưu..." : "LƯU MENU"}</span>
                </Button>
              </div>
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
            {activeTab === "blogs" && (
              <Button
                onClick={() => setIsAddBlogOpen(true)}
                variant="primary"
                size="sm"
                className="gap-1 text-xs font-black shadow-xs uppercase"
              >
                <Plus className="h-4 w-4" />
                Viết Bài Mới
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
              <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                <X className="h-3.5 w-3.5" />
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF1F2] text-[#0063FD]">
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
                      <Clock className="h-4 w-4 text-[#0063FD]" />
                      Đơn hàng gần đây
                    </h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-bold text-[#0063FD] hover:underline"
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
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#0063FD] hover:bg-white transition-all text-xs font-bold text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <ImageIcon className="h-4 w-4 text-[#0063FD]" />
                        <span>Đăng poster sự kiện mới</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setIsAddDealOpen(true)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#0063FD] hover:bg-white transition-all text-xs font-bold text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Monitor className="h-4 w-4 text-[#0063FD]" />
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
          {/* ========================================================================= */}
          {/* TAB 2: PRODUCT MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === "products" && (
            <div className="space-y-4">
              {/* Product Stat Cards for Quick Insights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
                  <div className="text-[11px] font-bold text-[#64748B] uppercase">Tổng Linh Kiện</div>
                  <div className="text-2xl font-black text-[#0F172A] mt-1">{products.length}</div>
                  <div className="text-[10px] text-[#94A3B8] mt-0.5">{uniqueBrands.length} thương hiệu</div>
                </div>
                <div className="rounded-xl border border-[#86EFAC] bg-[#F0FDF4] p-4 shadow-xs">
                  <div className="text-[11px] font-bold text-[#15803D] uppercase">Tồn Kho Tốt (&gt; 5)</div>
                  <div className="text-2xl font-black text-[#15803D] mt-1">
                    {products.filter((p) => p.stock > 5).length}
                  </div>
                  <div className="text-[10px] text-[#16A34A] mt-0.5">Sẵn sàng bán lẻ & ráp máy</div>
                </div>
                <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 shadow-xs">
                  <div className="text-[11px] font-bold text-[#B45309] uppercase">Cảnh Báo Sắp Hết (1-5)</div>
                  <div className="text-2xl font-black text-[#B45309] mt-1">
                    {products.filter((p) => p.stock > 0 && p.stock <= 5).length}
                  </div>
                  <div className="text-[10px] text-[#D97706] mt-0.5">Cần liên hệ nhà phân phối</div>
                </div>
                <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 shadow-xs">
                  <div className="text-[11px] font-bold text-[#B91C1C] uppercase">Hết Hàng (0)</div>
                  <div className="text-2xl font-black text-[#B91C1C] mt-1">
                    {products.filter((p) => p.stock <= 0).length}
                  </div>
                  <div className="text-[10px] text-[#EF4444] mt-0.5">Tạm ngưng đặt hàng</div>
                </div>
              </div>

              {/* Filters and Search Bar */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[240px] max-w-sm">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo tên linh kiện, mã SKU, hãng..."
                      className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                  </div>

                  <select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 px-3 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none font-medium"
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
                    className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 px-3 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none font-medium"
                  >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_vi}
                      </option>
                    ))}
                  </select>

                  {(searchQuery || brandFilter !== "all" || categoryFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setBrandFilter("all");
                        setCategoryFilter("all");
                      }}
                      className="rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                    >
                      Xóa lọc
                    </button>
                  )}
                </div>

                <div className="text-xs text-[#64748B] font-bold">
                  Hiển thị <span className="text-[#0063FD] font-black">{filteredProducts.length}</span> / {products.length} sản phẩm
                </div>
              </div>

              {/* Enhanced Products Table */}
              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-black uppercase text-[#475569]">
                    <tr>
                      <th className="p-4">Linh kiện / Tên gọi</th>
                      <th className="p-4">Mã SKU</th>
                      <th className="p-4">Thương hiệu</th>
                      <th className="p-4">Giá bán niêm yết</th>
                      <th className="p-4">Tình trạng kho</th>
                      <th className="p-4">Thông số tương thích</th>
                      <th className="p-4 text-right">Hành động</th>
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
                          <p className="font-bold text-sm text-[#0F172A]">Không tìm thấy linh kiện nào phù hợp.</p>
                          <p className="text-xs text-[#94A3B8] mt-1">Hãy thử xóa bớt điều kiện lọc hoặc từ khóa tìm kiếm.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-[#0F172A] text-xs max-w-sm leading-snug">{p.name_vi}</div>
                            <div className="text-[10px] text-[#64748B] mt-0.5 truncate max-w-xs">{p.name_en}</div>
                          </td>
                          <td className="p-4 font-mono font-bold text-[#475569]">
                            <span className="rounded bg-[#F1F5F9] px-2 py-0.5 border border-[#E2E8F0]">
                              {p.sku}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-0.5 text-[10px] font-black text-[#1D4ED8]">
                              {p.brand}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-black text-sm text-[#B45309]">
                            {new Intl.NumberFormat("vi-VN").format(p.price_vnd)}₫
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                p.stock > 5
                                  ? "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]"
                                  : p.stock > 0
                                  ? "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]"
                                  : "bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]"
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                                p.stock > 5 ? "bg-[#16A34A]" : p.stock > 0 ? "bg-[#D97706]" : "bg-[#DC2626]"
                              }`} />
                              {p.stock > 5
                                ? `Còn ${p.stock} chiếc`
                                : p.stock > 0
                                ? `Sắp hết (${p.stock} chiếc)`
                                : "Hết hàng"}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[10px] text-[#475569]">
                            {p.specs?.socket && <span className="mr-1.5 rounded bg-blue-50 px-1.5 py-0.5 font-bold text-[#2563EB] border border-blue-200">{String(p.specs.socket)}</span>}
                            {p.specs?.ram_type && <span className="mr-1.5 rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-[#16A34A] border border-emerald-200">{String(p.specs.ram_type)}</span>}
                            {p.specs?.tdp_watts && <span className="mr-1.5 rounded bg-slate-100 px-1.5 py-0.5 font-medium">{String(p.specs.tdp_watts)}W</span>}
                            {p.specs?.vram_gb && <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-bold text-indigo-700 border border-indigo-200">{String(p.specs.vram_gb)}GB</span>}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-[#0063FD] bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE] transition-colors"
                                title="Chỉnh sửa thông tin linh kiện"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                <span>Sửa</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FEE2E2] transition-colors"
                                title="Xóa linh kiện"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Xóa</span>
                              </button>
                            </div>
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
          {/* TAB 3: CATEGORIES & COMPONENT TYPES */}
          {/* ========================================================================= */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              {/* Sub-tab Switcher */}
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("categories")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black bg-[#0063FD] text-white shadow-xs"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Kho Danh Mục Sản Phẩm ({categories.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("menu")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
                >
                  <LayoutGrid className="h-3.5 w-3.5 text-[#0063FD]" />
                  <span>Tùy Chỉnh Menu Dropdown ({megaMenuCategories.length})</span>
                </button>
              </div>

              {/* Top Controls Bar */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    placeholder="Tìm theo tên danh mục, slug URL..."
                    className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSeedCategories}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs font-bold text-[#0063FD] border-[#BFDBFE] hover:bg-[#EFF6FF]"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-[#0063FD]" />
                    <span>Đồng bộ 10 danh mục chuẩn</span>
                  </Button>
                  <Button
                    onClick={() => setIsAddCategoryOpen(true)}
                    variant="primary"
                    size="sm"
                    className="gap-1 text-xs font-bold shadow-xs uppercase"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Thêm danh mục</span>
                  </Button>
                </div>
              </div>

              {/* Categories Grid or Empty State */}
              {filteredCategories.length === 0 ? (
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center space-y-3 shadow-xs">
                  <Layers className="mx-auto h-12 w-12 text-[#94A3B8]" />
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    {categorySearchQuery ? "Không tìm thấy danh mục phù hợp" : "Chưa có danh mục linh kiện nào"}
                  </h4>
                  <p className="text-xs text-[#64748B] max-w-md mx-auto">
                    {categorySearchQuery
                      ? "Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc xóa bộ lọc."
                      : "Bạn có thể tự tạo danh mục mới hoặc bấm nút đồng bộ 10 danh mục linh kiện PC chuẩn (CPU, Main, RAM, VGA, SSD, PSU, Case, Cooling...)."}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Button
                      onClick={handleSeedCategories}
                      variant="primary"
                      size="sm"
                      className="font-bold text-xs"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Khởi tạo 10 danh mục chuẩn
                    </Button>
                    <Button
                      onClick={() => setIsAddCategoryOpen(true)}
                      variant="outline"
                      size="sm"
                      className="font-bold text-xs"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Tự tạo danh mục mới
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredCategories.map((cat) => {
                    const productCount = products.filter((p) => p.category_id === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs flex flex-col justify-between hover:border-[#0063FD] hover:shadow-sm transition-all group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#0063FD]">
                              <Layers className="h-4 w-4" />
                            </div>
                            <Link
                              href={`/danh-muc/${cat.slug}`}
                              target="_blank"
                              className="text-[11px] font-bold text-[#0063FD] hover:underline flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Xem trang danh mục trên Web Shop"
                            >
                              <span>Web Shop</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>

                          <div>
                            <div className="text-sm font-black text-[#0F172A] line-clamp-1">{cat.name_vi}</div>
                            <div className="text-xs text-[#64748B] line-clamp-1">{cat.name_en}</div>
                            <div className="text-[11px] font-mono text-[#0063FD] mt-0.5 font-bold">/{cat.slug}</div>
                          </div>
                        </div>

                        <div className="border-t border-[#F1F5F9] pt-3 mt-4 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setActiveTab("products");
                              setCategoryFilter(cat.id);
                            }}
                            className="text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-2 py-1 rounded-md transition-colors"
                            title="Lọc các sản phẩm thuộc danh mục này trong kho"
                          >
                            {productCount} sản phẩm →
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEditCategory(cat)}
                              className="p-1.5 rounded-md text-[#0063FD] hover:bg-[#EFF6FF] transition-colors"
                              title="Chỉnh sửa danh mục"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 rounded-md text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
                              title="Xóa danh mục"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: STOREFRONT MEGA MENU CUSTOMIZATION */}
          {/* ========================================================================= */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              {/* Sub-tab Switcher */}
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("categories")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Kho Danh Mục Sản Phẩm ({categories.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("menu")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black bg-[#0063FD] text-white shadow-xs"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Tùy Chỉnh Menu Dropdown ({megaMenuCategories.length})</span>
                </button>
              </div>

              {/* Info & Action Banner */}
              <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase text-[#1D4ED8] tracking-wider flex items-center gap-1.5">
                    <LayoutGrid className="h-4 w-4 text-[#0063FD]" />
                    QUẢN LÝ DỮ LIỆU MENU DROPDOWN (MEGA MENU)
                  </h3>
                  <p className="text-xs text-[#1E40AF]">
                    Tùy chỉnh các danh mục hiển thị trên dropdown header của Web Shop. Bạn có thể sắp xếp thứ tự, đổi biểu tượng, quản lý nhóm con và các đường dẫn linh kiện. Bấm <strong>LƯU MENU</strong> để áp dụng.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={handleResetMenu}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold text-[#64748B] border-[#CBD5E1] bg-white hover:bg-[#F8FAFC]"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Khôi Phục Gốc
                  </Button>
                  <Button
                    onClick={handleSaveMenu}
                    disabled={isSavingMenu}
                    variant="primary"
                    size="sm"
                    className="text-xs font-black shadow-xs uppercase"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isSavingMenu ? "Đang lưu..." : "LƯU MENU"}
                  </Button>
                </div>
              </div>

              {/* 2-Column Split Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: Danh mục cấp 1 (4 cols) */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#64748B]">
                      Danh mục Menu ({megaMenuCategories.length})
                    </span>
                    <Button
                      onClick={() => setIsAddMenuCategoryOpen(true)}
                      variant="outline"
                      size="sm"
                      className="text-[11px] font-bold text-[#0063FD] border-[#BFDBFE] h-7 px-2"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Thêm Mới
                    </Button>
                  </div>

                  <div className="rounded-xl border border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9] shadow-xs overflow-hidden max-h-[660px] overflow-y-auto no-scrollbar">
                    {megaMenuCategories.map((cat, idx) => {
                      const CatIcon = resolveMegaCategoryIcon(cat.iconName || cat.icon);
                      const isSelected = cat.id === activeMenuCatId;
                      return (
                        <div
                          key={cat.id || idx}
                          onClick={() => setActiveMenuCatId(cat.id)}
                          className={`p-3 flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#EFF6FF] border-l-4 border-[#0063FD]"
                              : "hover:bg-[#F8FAFC]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                isSelected
                                  ? "bg-[#0063FD] text-white"
                                  : "bg-[#F1F5F9] text-[#64748B]"
                              }`}
                            >
                              <CatIcon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-black text-[#0F172A] truncate">
                                {cat.name}
                              </div>
                              <div className="text-[10px] text-[#64748B] truncate font-mono">
                                /{cat.slug} • {cat.subGroups?.length || 0} nhóm con
                              </div>
                            </div>
                          </div>

                          <div
                            className="flex items-center gap-1 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleMoveMenuCategory(idx, "up")}
                              disabled={idx === 0}
                              className="p-1 rounded hover:bg-[#E2E8F0] disabled:opacity-20 text-[#64748B]"
                              title="Di chuyển lên"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleMoveMenuCategory(idx, "down")}
                              disabled={idx === megaMenuCategories.length - 1}
                              className="p-1 rounded hover:bg-[#E2E8F0] disabled:opacity-20 text-[#64748B]"
                              title="Di chuyển xuống"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuCategory(cat.id)}
                              className="p-1 rounded text-[#DC2626] hover:bg-[#FEE2E2]"
                              title="Xóa danh mục này"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT COLUMN: Active Category Editor (8 cols) */}
                <div className="lg:col-span-8 space-y-5">
                  {activeMenuCategory ? (
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-5">
                      {/* Active Header & Top Fields */}
                      <div className="border-b border-[#E2E8F0] pb-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#0063FD]">
                              {React.createElement(
                                resolveMegaCategoryIcon(activeMenuCategory.iconName || activeMenuCategory.icon),
                                { className: "h-5 w-5" }
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-[#0F172A] uppercase">
                                Chi Tiết: {activeMenuCategory.name}
                              </h4>
                              <span className="text-[11px] font-mono text-[#64748B]">
                                ID: {activeMenuCategory.id}
                              </span>
                            </div>
                          </div>

                          <Link
                            href={activeMenuCategory.allUrl || "/danh-muc"}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0063FD] hover:underline bg-[#EFF6FF] px-2.5 py-1 rounded-lg"
                          >
                            <span>Xem trang danh mục</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>

                        {/* Editable properties of active category */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-[#475569] uppercase block mb-1">
                              Tên hiển thị *
                            </label>
                            <input
                              type="text"
                              value={activeMenuCategory.name}
                              onChange={(e) => handleUpdateActiveCategoryField("name", e.target.value)}
                              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#CBD5E1] focus:border-[#0063FD] focus:ring-1 focus:ring-[#0063FD] outline-none"
                              placeholder="VD: VGA - Card Màn Hình"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-[#475569] uppercase block mb-1">
                              Biểu tượng (Icon)
                            </label>
                            <select
                              value={activeMenuCategory.iconName || "Layers"}
                              onChange={(e) => handleUpdateActiveCategoryField("iconName", e.target.value)}
                              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#CBD5E1] focus:border-[#0063FD] focus:ring-1 focus:ring-[#0063FD] outline-none bg-white"
                            >
                              {AVAILABLE_ICON_NAMES.map((name) => (
                                <option key={name} value={name}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-[#475569] uppercase block mb-1">
                              Link "Xem tất cả"
                            </label>
                            <input
                              type="text"
                              value={activeMenuCategory.allUrl}
                              onChange={(e) => handleUpdateActiveCategoryField("allUrl", e.target.value)}
                              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#CBD5E1] focus:border-[#0063FD] focus:ring-1 focus:ring-[#0063FD] outline-none"
                              placeholder="VD: /danh-muc/vga"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sub-groups Manager */}
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h5 className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                              Nhóm Con (Sub-Groups) & Danh Sách Liên Kết
                            </h5>
                            <p className="text-[11px] text-[#64748B]">
                              Các nhóm con hiển thị theo dạng cột trong bảng dropdown bên phải.
                            </p>
                          </div>

                          {/* Add Subgroup input / button */}
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={newSubgroupTitle}
                              onChange={(e) => setNewSubgroupTitle(e.target.value)}
                              placeholder="Tiêu đề nhóm mới..."
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] outline-none focus:border-[#0063FD] w-40"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && newSubgroupTitle.trim()) {
                                  handleAddSubgroup(newSubgroupTitle.trim());
                                  setNewSubgroupTitle("");
                                }
                              }}
                            />
                            <Button
                              onClick={() => {
                                if (newSubgroupTitle.trim()) {
                                  handleAddSubgroup(newSubgroupTitle.trim());
                                  setNewSubgroupTitle("");
                                }
                              }}
                              variant="outline"
                              size="sm"
                              className="text-xs font-bold text-[#0063FD] border-[#BFDBFE] hover:bg-[#EFF6FF] h-8"
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Thêm Nhóm
                            </Button>
                          </div>
                        </div>

                        {/* Sub-groups list */}
                        {activeMenuCategory.subGroups.length === 0 ? (
                          <div className="p-8 border border-dashed border-[#CBD5E1] rounded-xl text-center text-xs text-[#64748B] space-y-2">
                            <p>Chưa có nhóm con nào trong danh mục này.</p>
                            <p className="text-[11px]">
                              Nhập tiêu đề ở trên và bấm "Thêm Nhóm" để tạo nhóm đầu tiên.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {activeMenuCategory.subGroups.map((group, gIdx) => (
                              <div
                                key={gIdx}
                                className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3 shadow-2xs"
                              >
                                {/* Subgroup Header */}
                                <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className="h-2 w-2 rounded-full bg-[#0063FD] shrink-0" />
                                    <input
                                      type="text"
                                      value={group.title}
                                      onChange={(e) => handleUpdateSubgroupTitle(gIdx, e.target.value)}
                                      className="text-xs font-black uppercase text-[#0F172A] bg-transparent border-b border-transparent hover:border-[#CBD5E1] focus:border-[#0063FD] focus:bg-white px-1.5 py-0.5 rounded outline-none flex-1 min-w-0"
                                    />
                                    <span className="text-[10px] text-[#64748B] font-mono">
                                      ({group.items.length} link)
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => handleMoveSubgroup(gIdx, "up")}
                                      disabled={gIdx === 0}
                                      className="p-1 rounded hover:bg-[#E2E8F0] disabled:opacity-20 text-[#64748B]"
                                      title="Di chuyển nhóm lên"
                                    >
                                      <ArrowUp className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleMoveSubgroup(gIdx, "down")}
                                      disabled={gIdx === activeMenuCategory.subGroups.length - 1}
                                      className="p-1 rounded hover:bg-[#E2E8F0] disabled:opacity-20 text-[#64748B]"
                                      title="Di chuyển nhóm xuống"
                                    >
                                      <ArrowDown className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSubgroup(gIdx)}
                                      className="p-1 rounded text-[#DC2626] hover:bg-[#FEE2E2]"
                                      title="Xóa nhóm này"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Items in this Subgroup */}
                                <div className="space-y-1.5">
                                  {group.items.map((item, iIdx) => (
                                    <div
                                      key={iIdx}
                                      className="flex items-center justify-between gap-2 bg-white p-2 rounded-lg border border-[#E2E8F0] text-xs shadow-2xs"
                                    >
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <input
                                          type="text"
                                          value={item.name}
                                          onChange={(e) => handleUpdateItemField(gIdx, iIdx, "name", e.target.value)}
                                          className="font-semibold text-[#0F172A] border-b border-transparent hover:border-[#CBD5E1] focus:border-[#0063FD] px-1 py-0.5 rounded outline-none w-1/3 min-w-[110px]"
                                          placeholder="Tên liên kết"
                                        />
                                        <input
                                          type="text"
                                          value={item.href}
                                          onChange={(e) => handleUpdateItemField(gIdx, iIdx, "href", e.target.value)}
                                          className="font-mono text-[11px] text-[#475569] border-b border-transparent hover:border-[#CBD5E1] focus:border-[#0063FD] px-1 py-0.5 rounded outline-none flex-1 min-w-[140px]"
                                          placeholder="/danh-muc/..."
                                        />
                                        <label className="flex items-center gap-1 text-[11px] font-bold text-[#0063FD] cursor-pointer shrink-0 ml-1 select-none">
                                          <input
                                            type="checkbox"
                                            checked={Boolean(item.isHighlight)}
                                            onChange={(e) => handleUpdateItemField(gIdx, iIdx, "isHighlight", e.target.checked)}
                                            className="rounded text-[#0063FD]"
                                          />
                                          <span>Nổi bật</span>
                                        </label>
                                      </div>

                                      <button
                                        onClick={() => handleDeleteItem(gIdx, iIdx)}
                                        className="p-1 rounded text-[#DC2626] hover:bg-[#FEE2E2] shrink-0"
                                        title="Xóa liên kết này"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>

                                {/* Add Item input form */}
                                {addingToSubgroupIdx === gIdx ? (
                                  <div className="p-2.5 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] space-y-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      <input
                                        type="text"
                                        value={newItemForm.name}
                                        onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                                        placeholder="Tên mục (VD: RTX 5090)"
                                        className="text-xs px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-[#0063FD]"
                                      />
                                      <input
                                        type="text"
                                        value={newItemForm.href}
                                        onChange={(e) => setNewItemForm({ ...newItemForm, href: e.target.value })}
                                        placeholder="URL (VD: /danh-muc/vga?q=5090)"
                                        className="text-xs px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-[#0063FD]"
                                      />
                                      <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-1 text-xs font-bold text-[#0063FD] cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={Boolean(newItemForm.isHighlight)}
                                            onChange={(e) => setNewItemForm({ ...newItemForm, isHighlight: e.target.checked })}
                                          />
                                          <span>Nổi bật</span>
                                        </label>
                                        <div className="flex items-center gap-1">
                                          <Button
                                            onClick={() => setAddingToSubgroupIdx(null)}
                                            variant="outline"
                                            size="sm"
                                            className="text-[11px] h-7 px-2"
                                          >
                                            Hủy
                                          </Button>
                                          <Button
                                            onClick={() => handleCommitAddItem(gIdx)}
                                            variant="primary"
                                            size="sm"
                                            className="text-[11px] h-7 px-2"
                                          >
                                            Thêm
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setAddingToSubgroupIdx(gIdx);
                                      setNewItemForm({
                                        name: "",
                                        href: activeMenuCategory.allUrl || "/danh-muc",
                                        isHighlight: false,
                                      });
                                    }}
                                    className="w-full py-1.5 rounded-lg border border-dashed border-[#CBD5E1] text-[11px] font-bold text-[#0063FD] hover:bg-white hover:border-[#0063FD] transition-all flex items-center justify-center gap-1"
                                  >
                                    <Plus className="h-3 w-3" />
                                    Thêm liên kết vào nhóm "{group.title}"
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center text-xs text-[#64748B]">
                      Chọn một danh mục ở cột bên trái để chỉnh sửa thông tin và liên kết.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: EVENT BANNERS & POSTERS */}
          {/* ========================================================================= */}
          {activeTab === "banners" && (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                    <span>Quản Lý Banner & Poster Sự Kiện Trang Chủ</span>
                    <span className="rounded-full bg-[#E0EDFF] px-2.5 py-0.5 text-xs font-mono font-bold text-[#0063FD]">
                      {banners.length} poster
                    </span>
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Điều phối banner Hero đầu trang, Poster sự kiện vuốt ngang giữa trang và Banner dọc hai bên sườn màn hình desktop.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    if (bannerPositionFilter !== "all") {
                      setBannerForm((prev) => ({ ...prev, position: bannerPositionFilter as any }));
                    }
                    setIsAddBannerOpen(true);
                  }}
                  variant="primary"
                  size="sm"
                  className="gap-1 text-xs font-bold shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Đăng Poster Mới
                </Button>
              </div>

              {/* Explanatory Guide Box */}
              <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-4 text-xs text-[#1E3A8A]">
                <div className="flex items-center gap-2 font-bold text-sm mb-2 text-[#1D4ED8]">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>Hướng Dẫn Phân Bổ Vị Trí Banner & Poster Trên Trang Chủ</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="rounded-lg bg-white/80 p-3 border border-[#DBEAFE]">
                    <div className="flex items-center gap-1.5 font-bold text-[#1E40AF] mb-1">
                      <span className="h-2 w-2 rounded-full bg-[#0063FD]" />
                      <span>1. Hero đầu trang (hero)</span>
                    </div>
                    <p className="text-[11px] text-[#475569] leading-relaxed">
                      Xuất hiện ở Carousel đầu trang chủ. Chuyển slide tự động, tỷ lệ khuyến nghị 16:9 hoặc 21:9 ngang lớn. Phục vụ các chiến dịch chủ đạo, siêu sale linh kiện và ra mắt sản phẩm.
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/80 p-3 border border-[#DBEAFE]">
                    <div className="flex items-center gap-1.5 font-bold text-[#6B21A8] mb-1">
                      <span className="h-2 w-2 rounded-full bg-[#9333EA]" />
                      <span>2. Poster giữa trang (middle_carousel)</span>
                    </div>
                    <p className="text-[11px] text-[#475569] leading-relaxed">
                      Đặt ở khu vực giữa trang chủ (ngay sau danh mục và máy ráp sẵn). Hỗ trợ vuốt chạm cảm ứng trên mobile và kéo chuột trên desktop để xem nhiều poster sự kiện liên tiếp.
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/80 p-3 border border-[#DBEAFE]">
                    <div className="flex items-center gap-1.5 font-bold text-[#065F46] mb-1">
                      <span className="h-2 w-2 rounded-full bg-[#059669]" />
                      <span>3. Banner sườn desktop (side_left / side_right)</span>
                    </div>
                    <p className="text-[11px] text-[#475569] leading-relaxed">
                      Cố định hai bên rìa mép màn hình desktop (rộng từ 1280px trở lên). Tỷ lệ dọc 1:3 hoặc 1:4. Khách hàng có thể bấm nút X để đóng nhanh, rất tốt cho deal giờ vàng.
                    </p>
                  </div>
                </div>
              </div>

              {/* 5 Position Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3">
                {[
                  { key: "all", label: "Tất Cả", count: bannerPositionCounts.all },
                  { key: "hero", label: "Banner Hero Đầu Trang", count: bannerPositionCounts.hero },
                  { key: "middle_carousel", label: "Poster Giữa Trang (Carousel)", count: bannerPositionCounts.middle_carousel },
                  { key: "side_left", label: "Sườn Trái Desktop", count: bannerPositionCounts.side_left },
                  { key: "side_right", label: "Sườn Phải Desktop", count: bannerPositionCounts.side_right },
                ].map((tab) => {
                  const isActive = bannerPositionFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setBannerPositionFilter(tab.key)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-[#0063FD] text-white shadow-xs"
                          : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                          isActive ? "bg-white/20 text-white" : "bg-white text-[#64748B] border border-[#CBD5E1]"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Banner Cards Grid */}
              {filteredBanners.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E2E8F0] text-[#64748B] mb-3">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                    Chưa có banner nào ở khu vực này
                  </h4>
                  <p className="text-xs text-[#64748B] max-w-md mx-auto mb-4">
                    Hãy thêm poster sự kiện để làm phong phú giao diện trang chủ và thu hút khách hàng.
                  </p>
                  <Button
                    onClick={() => {
                      if (bannerPositionFilter !== "all") {
                        setBannerForm((prev) => ({ ...prev, position: bannerPositionFilter as any }));
                      }
                      setIsAddBannerOpen(true);
                    }}
                    variant="primary"
                    size="sm"
                    className="gap-1 text-xs font-bold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Thêm Poster Cho Vị Trí Này
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBanners.map((b) => {
                    const pos = b.position || "hero";
                    const posInfo =
                      pos === "middle_carousel"
                        ? { label: "Poster giữa trang (Carousel)", badge: "bg-purple-50 text-purple-700 border-purple-200" }
                        : pos === "side_left"
                        ? { label: "Sườn trái desktop", badge: "bg-amber-50 text-amber-700 border-amber-200" }
                        : pos === "side_right"
                        ? { label: "Sườn phải desktop", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" }
                        : { label: "Hero đầu trang", badge: "bg-blue-50 text-blue-700 border-blue-200" };

                    return (
                      <div
                        key={b.id}
                        className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#0063FD] transition-all"
                      >
                        <div className="relative h-44 w-full bg-[#F1F5F9]">
                          <Image
                            src={b.image_url}
                            alt={b.title_vi}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2 rounded bg-[#0063FD] px-2 py-0.5 text-[10px] font-black text-white uppercase shadow-sm">
                            {b.tag || "SỰ KIỆN"}
                          </div>
                          <div className="absolute top-2 right-2">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold shadow-sm ${
                                b.is_active
                                  ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
                                  : "bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]"
                              }`}
                            >
                              {b.is_active ? "Đang hiển thị" : "Tạm ẩn"}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-2 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${posInfo.badge}`}>
                              {posInfo.label}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#64748B]">
                              Thứ tự: #{b.display_order}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-[#0F172A] line-clamp-1">{b.title_vi}</h4>
                          {b.subtitle_vi && (
                            <p className="text-xs text-[#64748B] line-clamp-2">{b.subtitle_vi}</p>
                          )}
                          <div className="text-[10px] font-mono text-[#0063FD] truncate pt-1">
                            Link: {b.target_url}
                          </div>
                        </div>

                        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleToggleBannerActive(b)}
                            className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                              b.is_active
                                ? "border-[#CBD5E1] bg-white text-[#64748B] hover:text-[#0F172A]"
                                : "border-[#86EFAC] bg-[#DCFCE7] text-[#15803D]"
                            }`}
                            title={b.is_active ? "Ẩn khỏi trang chủ" : "Bật hiển thị"}
                          >
                            {b.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            <span>{b.is_active ? "Ẩn" : "Hiện"}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <Button
                              onClick={() => handleStartEditBanner(b)}
                              variant="secondary"
                              size="sm"
                              className="gap-1 text-xs font-bold"
                            >
                              <Pencil className="h-3.5 w-3.5 text-[#0063FD]" />
                              Sửa
                            </Button>

                            <button
                              onClick={() => handleDeleteBanner(b.id)}
                              className="rounded p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
                              title="Xóa poster"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: PREBUILT PC DEALS (Bố Trí & Sắp Xếp Deal Máy Ráp Sẵn) */}
          {/* ========================================================================= */}
          {activeTab === "deals" && (
            <div className="space-y-6">
              {/* FLASH SALE & COUNTDOWN TIMER MANAGER */}
              <div className="rounded-xl border border-[#FECDD3] bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6] p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FECDD3] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EF4444] text-white shadow-xs">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black uppercase tracking-wider text-[#9F1239]">
                          Điều Phối Giờ Vàng Giá Tốt (Flash Sale)
                        </h4>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            siteSettings.flash_sale_enabled
                              ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
                              : "bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]"
                          }`}
                        >
                          {siteSettings.flash_sale_enabled ? "Đang Hoạt Động" : "Tạm Tắt"}
                        </span>
                      </div>
                      <p className="text-xs text-[#BE123C]">
                        Tùy chỉnh thời gian kết thúc đếm ngược hiển thị trên trang chủ cho khách hàng.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#9F1239] self-start sm:self-auto bg-white/80 px-3 py-1.5 rounded-lg border border-[#FECDD3]">
                    <input
                      type="checkbox"
                      checked={siteSettings.flash_sale_enabled ?? true}
                      onChange={(e) => {
                        const enabled = e.target.checked;
                        setSiteSettings((prev) => ({ ...prev, flash_sale_enabled: enabled }));
                        handleQuickUpdateFlashSale(siteSettings.flash_sale_end_time || new Date().toISOString(), enabled);
                      }}
                      className="rounded border-[#CBD5E1] text-[#EF4444] focus:ring-[#EF4444] h-4 w-4"
                    />
                    <span>Kích hoạt Giờ Vàng trên trang chủ</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/90 p-4 rounded-xl border border-[#FECDD3]">
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">
                      Thời gian kết thúc đếm ngược (End Time) *
                    </label>
                    <input
                      type="datetime-local"
                      value={formatForDatetimeLocal(siteSettings.flash_sale_end_time)}
                      onChange={(e) => {
                        if (e.target.value) {
                          const iso = new Date(e.target.value).toISOString();
                          setSiteSettings((prev) => ({ ...prev, flash_sale_end_time: iso }));
                        }
                      }}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] font-mono focus:border-[#EF4444] focus:outline-none shadow-2xs font-bold"
                    />
                    <p className="text-[11px] text-[#64748B] mt-1">
                      Đồng hồ đếm ngược trên trang chủ sẽ tự động đếm lùi về mốc thời gian này.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">
                      Chọn nhanh mốc thời gian kết thúc:
                    </label>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleQuickUpdateFlashSale(new Date(Date.now() + 2 * 3600 * 1000).toISOString())}
                        className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-bold text-[#0F172A] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                      >
                        +2 Giờ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickUpdateFlashSale(new Date(Date.now() + 6 * 3600 * 1000).toISOString())}
                        className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-bold text-[#0F172A] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                      >
                        +6 Giờ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickUpdateFlashSale(new Date(Date.now() + 12 * 3600 * 1000).toISOString())}
                        className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-bold text-[#0F172A] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                      >
                        +12 Giờ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickUpdateFlashSale(new Date(Date.now() + 24 * 3600 * 1000).toISOString())}
                        className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-bold text-[#0F172A] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                      >
                        +24 Giờ
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                          handleQuickUpdateFlashSale(endOfDay.toISOString());
                        }}
                        className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-bold text-[#0F172A] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                      >
                        Hôm nay 23:59
                      </button>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        onClick={() => handleQuickUpdateFlashSale(siteSettings.flash_sale_end_time || new Date().toISOString(), siteSettings.flash_sale_enabled)}
                        disabled={isSavingSettings}
                        variant="primary"
                        size="sm"
                        className="bg-[#EF4444] hover:bg-[#DC2626] font-bold text-xs"
                      >
                        {isSavingSettings ? "Đang lưu..." : "Cập Nhật Ngay Lên Trang Khách"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white/70 p-2.5 border border-[#FECDD3] text-[11px] text-[#9F1239] flex items-center gap-2">
                  <Info className="h-4 w-4 shrink-0 text-[#EF4444]" />
                  <span>
                    Chính sách hiển thị: Toàn bộ số lượng tồn kho thực tế của sản phẩm deal trong Giờ Vàng đều được hệ thống ẩn hoàn toàn đối với khách hàng (chỉ hiển thị nhãn "Deal Giới Hạn").
                  </span>
                </div>
              </div>

              {/* Header */}
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
                        <span className="font-mono font-bold text-xs text-[#0063FD]">
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
                          <span className="rounded bg-[#0063FD] text-white px-2 py-0.2 text-[10px] font-black uppercase">
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
          {/* TAB: BLOG POSTS & HARDWARE INSIGHTS (Rich Text Publishing)               */}
          {/* ========================================================================= */}
          {activeTab === "blogs" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                  {[
                    { id: "all", label: "Tất cả bài viết" },
                    { id: "Kiến Thức Phần Cứng", label: "Kiến thức phần cứng" },
                    { id: "Đánh Giá & Review", label: "Đánh giá & Review" },
                    { id: "Hướng Dẫn Build PC", label: "Hướng dẫn Build PC" },
                    { id: "Tin Công Nghệ", label: "Tin công nghệ" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setBlogCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-bold ${
                        blogCategoryFilter === cat.id
                          ? "bg-[#0063FD] text-white shadow-xs"
                          : "bg-white border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() => setIsAddBlogOpen(true)}
                  variant="primary"
                  size="sm"
                  className="gap-1.5 text-xs font-black uppercase shadow-xs self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  Soạn Bài Viết Mới
                </Button>
              </div>

              {filteredBlogs.length === 0 ? (
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center space-y-3 shadow-xs">
                  <BookOpen className="mx-auto h-12 w-12 text-[#94A3B8]" />
                  <h4 className="text-sm font-bold text-[#0F172A]">Chưa có bài viết công nghệ nào</h4>
                  <p className="text-xs text-[#64748B] max-w-md mx-auto">
                    Hãy sử dụng Trình Soạn Thảo Rich Text Editor để tạo các bài viết review linh kiện, hướng dẫn lắp ráp và tin tức phần cứng.
                  </p>
                  <Button
                    onClick={() => setIsAddBlogOpen(true)}
                    variant="primary"
                    size="sm"
                    className="font-bold text-xs"
                  >
                    Viết Bài Đầu Tiên
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBlogs.map((blog) => (
                    <article
                      key={blog.id}
                      className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs hover:border-[#0063FD] hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Cover Image */}
                        <div className="relative aspect-[16/9] w-full bg-[#F1F5F9] overflow-hidden">
                          {blog.cover_image && (
                            <Image
                              src={blog.cover_image}
                              alt={blog.title_vi}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          )}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="rounded bg-[#0063FD] px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-xs">
                              {blog.category}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span
                              className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase shadow-xs ${
                                blog.is_published
                                  ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
                                  : "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                              }`}
                            >
                              {blog.is_published ? "Đã Xuất Bản" : "Bản Nháp"}
                            </span>
                          </div>
                        </div>

                        {/* Content Header */}
                        <div className="p-4 space-y-2">
                          <h4 className="font-bold text-sm text-[#0F172A] line-clamp-2 leading-snug">
                            {blog.title_vi}
                          </h4>
                          <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                            {blog.excerpt_vi}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
                            <span className="font-bold text-[#0F172A]">{blog.author_name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-[#0063FD]" />
                              {blog.reading_time_mins} phút đọc
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3 text-[#64748B]" />
                              {blog.views_count || 0} lượt xem
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-3 flex items-center justify-between gap-2">
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="text-[11px] font-bold text-[#0063FD] hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Xem bài
                        </Link>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleTogglePublishBlog(blog)}
                            className={`p-1.5 rounded text-xs font-bold transition-colors ${
                              blog.is_published
                                ? "text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]"
                                : "text-[#16A34A] hover:bg-[#DCFCE7]"
                            }`}
                            title={blog.is_published ? "Tạm ẩn về bản nháp" : "Công khai bài viết"}
                          >
                            {blog.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>

                          <button
                            onClick={() => {
                              setEditingBlogId(blog.id);
                              setEditBlogForm({
                                title_vi: blog.title_vi,
                                title_en: blog.title_en || "",
                                slug: blog.slug,
                                excerpt_vi: blog.excerpt_vi,
                                excerpt_en: blog.excerpt_en || "",
                                content_html_vi: blog.content_html_vi,
                                content_html_en: blog.content_html_en || "",
                                cover_image: blog.cover_image,
                                author_name: blog.author_name,
                                category: blog.category,
                                tags: blog.tags || [],
                                is_published: blog.is_published,
                                reading_time_mins: blog.reading_time_mins || 5,
                              });
                              setIsEditBlogOpen(true);
                            }}
                            className="p-1.5 rounded text-[#0063FD] hover:bg-[#EFF6FF] transition-colors"
                            title="Chỉnh sửa bài viết"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteBlogPost(blog.id)}
                            className="p-1.5 rounded text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Xóa bài viết"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: CAREERS & RECRUITMENT MANAGEMENT                                     */}
          {/* ========================================================================= */}
          {activeTab === "careers" && (
            <div className="space-y-6">
              {/* Sub-tab Navigation Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCareerSubTab("jobs")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      careerSubTab === "jobs"
                        ? "bg-[#0063FD] text-white shadow-xs font-black"
                        : "bg-white border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Vị Trí Tuyển Dụng</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                        careerSubTab === "jobs"
                          ? "bg-white/20 text-white"
                          : "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]"
                      }`}
                    >
                      {careers.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setCareerSubTab("applications")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      careerSubTab === "applications"
                        ? "bg-[#0063FD] text-white shadow-xs font-black"
                        : "bg-white border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Hồ Sơ Ứng Viên</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                        careerSubTab === "applications"
                          ? "bg-white/20 text-white"
                          : "bg-[#EFF6FF] text-[#0063FD] border border-[#BFDBFE]"
                      }`}
                    >
                      {applications.length}
                    </span>
                    {applications.filter((a) => a.status === "pending").length > 0 && (
                      <span className="rounded-full bg-amber-500 text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider animate-pulse">
                        {applications.filter((a) => a.status === "pending").length} Mới
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/tuyen-dung"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs font-bold text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0063FD] transition-all shadow-2xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Xem Trang Tuyển Dụng</span>
                  </Link>

                  {careerSubTab === "jobs" && (
                    <Button
                      onClick={() => setIsAddCareerOpen(true)}
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-1.5 shadow-xs font-black uppercase text-xs tracking-wider"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Thêm Vị Trí Tuyển Dụng</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Sub-tab 1: Jobs Postings List */}
              {careerSubTab === "jobs" && (
                <div className="space-y-4">
                  {/* Top Controls Bar for Jobs */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
                    <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
                      <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#64748B]" />
                        <input
                          type="text"
                          placeholder="Tìm theo vị trí, phòng ban, địa điểm..."
                          value={careerSearchQuery}
                          onChange={(e) => setCareerSearchQuery(e.target.value)}
                          className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 pl-10 pr-4 text-xs text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <select
                        value={careerDeptFilter}
                        onChange={(e) => setCareerDeptFilter(e.target.value)}
                        className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                      >
                        <option value="all">Tất cả phòng ban</option>
                        <option value="Kỹ Thuật & Phần Cứng">Kỹ Thuật & Phần Cứng</option>
                        <option value="Kinh Doanh & Chăm Sóc Khách Hàng">Kinh Doanh & Chăm Sóc Khách Hàng</option>
                        <option value="Bảo Hành & Kiểm Soát Chất Lượng">Bảo Hành & Kiểm Soát Chất Lượng</option>
                        <option value="Marketing & Truyền Thông">Marketing & Truyền Thông</option>
                        <option value="Kho Vận & Logistics">Kho Vận & Logistics</option>
                      </select>
                    </div>
                  </div>

                  {/* Careers Table */}
                  <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-black uppercase text-[#475569]">
                        <tr>
                          <th className="p-3.5">Vị trí & Đường dẫn</th>
                          <th className="p-3.5">Phòng ban</th>
                          <th className="p-3.5">Mức lương</th>
                          <th className="p-3.5">Địa điểm</th>
                          <th className="p-3.5">Hình thức</th>
                          <th className="p-3.5">Trạng thái</th>
                          <th className="p-3.5 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {filteredCareers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-12 text-center text-[#64748B]">
                              Chưa có vị trí tuyển dụng nào phù hợp với bộ lọc.
                            </td>
                          </tr>
                        ) : (
                          filteredCareers.map((job) => (
                            <tr key={job.id} className="hover:bg-[#F8FAFC] transition-colors">
                              <td className="p-3.5">
                                <div className="font-bold text-[#0F172A]">{job.title}</div>
                                <div className="text-[10px] font-mono text-[#64748B] truncate max-w-xs">
                                  /tuyen-dung/{job.slug}
                                </div>
                              </td>
                              <td className="p-3.5">
                                <span className="rounded-md bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[10px] font-bold text-[#0063FD]">
                                  {job.department}
                                </span>
                              </td>
                              <td className="p-3.5 font-bold text-[#16A34A]">{job.salary}</td>
                              <td className="p-3.5 text-[#475569]">{job.location}</td>
                              <td className="p-3.5 text-[#64748B]">{job.employment_type}</td>
                              <td className="p-3.5">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                                    job.is_active
                                      ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
                                      : "bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]"
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      job.is_active ? "bg-[#16A34A]" : "bg-[#94A3B8]"
                                    }`}
                                  />
                                  {job.is_active ? "Đang Tuyển" : "Đã Đóng"}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleToggleActiveCareer(job)}
                                    className={`p-1.5 rounded text-xs font-bold transition-colors ${
                                      job.is_active
                                        ? "text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]"
                                        : "text-[#16A34A] hover:bg-[#DCFCE7]"
                                    }`}
                                    title={job.is_active ? "Tạm đóng nhận hồ sơ" : "Mở lại tuyển dụng"}
                                  >
                                    {job.is_active ? (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                      <Eye className="h-3.5 w-3.5" />
                                    )}
                                  </button>

                                  <button
                                    onClick={() => {
                                      setEditingCareerId(job.id);
                                      setEditCareerForm({
                                        title: job.title,
                                        slug: job.slug,
                                        department: job.department,
                                        location: job.location,
                                        employment_type: job.employment_type,
                                        salary: job.salary,
                                        experience: job.experience,
                                        description: job.description,
                                        requirements: job.requirements,
                                        benefits: job.benefits,
                                        contact_email: job.contact_email,
                                        is_active: job.is_active,
                                      });
                                      setIsEditCareerOpen(true);
                                    }}
                                    className="p-1.5 rounded text-[#0063FD] hover:bg-[#EFF6FF] transition-colors"
                                    title="Chỉnh sửa vị trí"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteCareer(job.id)}
                                    className="p-1.5 rounded text-rose-600 hover:bg-rose-50 transition-colors"
                                    title="Xóa vị trí này"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Applications Review List */}
              {careerSubTab === "applications" && (
                <div className="space-y-4">
                  {/* Top Controls Bar for Applications */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
                    <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
                      <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#64748B]" />
                        <input
                          type="text"
                          placeholder="Tìm theo tên ứng viên, email, số điện thoại, vị trí..."
                          value={applicationSearch}
                          onChange={(e) => setApplicationSearch(e.target.value)}
                          className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 pl-10 pr-4 text-xs text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <select
                        value={applicationStatusFilter}
                        onChange={(e) => setApplicationStatusFilter(e.target.value)}
                        className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-[#0F172A] focus:border-[#0063FD] focus:outline-none"
                      >
                        <option value="all">Tất cả trạng thái hồ sơ</option>
                        <option value="pending">Chờ duyệt (Mới nộp)</option>
                        <option value="reviewed">Đã xem qua CV</option>
                        <option value="contacted">Đã liên hệ ứng viên</option>
                        <option value="interview">Hẹn phỏng vấn</option>
                        <option value="accepted">Trúng tuyển / Tiếp nhận</option>
                        <option value="rejected">Chưa phù hợp / Từ chối</option>
                      </select>

                      <select
                        value={applicationJobFilter}
                        onChange={(e) => setApplicationJobFilter(e.target.value)}
                        className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-[#0F172A] focus:border-[#0063FD] focus:outline-none max-w-xs truncate"
                      >
                        <option value="all">Tất cả vị trí ứng tuyển</option>
                        {careers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        onClick={() => loadAllData()}
                        variant="outline"
                        size="sm"
                        disabled={isRefreshing}
                        className="flex items-center gap-1.5 shadow-2xs text-xs font-bold"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                        <span>Làm mới danh sách</span>
                      </Button>
                    </div>
                  </div>

                  {/* Applications Table */}
                  <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-black uppercase text-[#475569]">
                        <tr>
                          <th className="p-3.5">Ứng viên & Ngày nộp</th>
                          <th className="p-3.5">Vị trí ứng tuyển</th>
                          <th className="p-3.5">Thông tin liên hệ</th>
                          <th className="p-3.5">Hồ sơ CV đính kèm (PDF)</th>
                          <th className="p-3.5">Trạng thái duyệt</th>
                          <th className="p-3.5 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {filteredApplications.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-12 text-center text-[#64748B]">
                              Chưa có hồ sơ ứng tuyển nào phù hợp với bộ lọc hiện tại.
                            </td>
                          </tr>
                        ) : (
                          filteredApplications.map((app) => {
                            const badge = getAppStatusBadge(app.status);
                            return (
                              <tr key={app.id} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="p-3.5">
                                  <div className="font-bold text-[#0F172A] text-sm">
                                    {app.full_name}
                                  </div>
                                  <div className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {new Date(app.created_at).toLocaleString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </td>

                                <td className="p-3.5">
                                  <div className="font-bold text-[#0063FD]">
                                    {app.job_title}
                                  </div>
                                  {app.experience && (
                                    <div className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                                      KN: {app.experience}
                                    </div>
                                  )}
                                </td>

                                <td className="p-3.5">
                                  <div className="flex flex-col gap-0.5">
                                    <a
                                      href={`tel:${app.phone}`}
                                      className="font-mono font-bold text-[#0F172A] hover:text-[#0063FD] flex items-center gap-1"
                                    >
                                      <Phone className="h-3 w-3 text-[#64748B]" />
                                      <span>{app.phone}</span>
                                    </a>
                                    <a
                                      href={`mailto:${app.email}`}
                                      className="text-[#64748B] hover:text-[#0063FD] flex items-center gap-1 truncate max-w-[180px]"
                                      title={app.email}
                                    >
                                      <Mail className="h-3 w-3 text-[#94A3B8]" />
                                      <span className="truncate">{app.email}</span>
                                    </a>
                                  </div>
                                </td>

                                <td className="p-3.5">
                                  <div className="flex items-center gap-2">
                                    <a
                                      href={app.resume_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] text-[#0063FD] font-bold hover:bg-[#DBEAFE] transition-colors shadow-2xs"
                                      title="Bấm để mở và xem trực tiếp file PDF"
                                    >
                                      <FileText className="h-3.5 w-3.5" />
                                      <span>Xem PDF</span>
                                    </a>

                                    <a
                                      href={app.resume_url}
                                      download={app.resume_filename || "CV_UngVien.pdf"}
                                      className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors shadow-2xs"
                                      title={`Tải xuống: ${app.resume_filename} (${formatAppFileSize(app.resume_file_size)})`}
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                    </a>

                                    <div className="text-[10px] text-[#94A3B8] font-mono hidden md:block">
                                      {formatAppFileSize(app.resume_file_size)}
                                    </div>
                                  </div>
                                </td>

                                <td className="p-3.5">
                                  <select
                                    value={app.status}
                                    onChange={(e) =>
                                      handleUpdateApplicationStatus(
                                        app.id,
                                        e.target.value as ApplicationStatus,
                                        app.notes || undefined
                                      )
                                    }
                                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold focus:outline-none transition-colors cursor-pointer ${badge.bg}`}
                                  >
                                    <option value="pending">Chờ duyệt</option>
                                    <option value="reviewed">Đã xem qua</option>
                                    <option value="contacted">Đã liên hệ</option>
                                    <option value="interview">Phỏng vấn</option>
                                    <option value="accepted">Tuyển dụng</option>
                                    <option value="rejected">Từ chối</option>
                                  </select>
                                </td>

                                <td className="p-3.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedApplication(app);
                                        setEditingAppStatus(app.status);
                                        setEditingAppNotes(app.notes || "");
                                        setIsAppDetailOpen(true);
                                      }}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[#0063FD] hover:bg-[#EFF6FF] font-bold transition-colors text-xs"
                                      title="Xem chi tiết hồ sơ và cập nhật ghi chú"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                      <span>Chi tiết</span>
                                    </button>

                                    <button
                                      onClick={() => handleDeleteApplication(app.id)}
                                      className="p-1.5 rounded text-rose-600 hover:bg-rose-50 transition-colors"
                                      title="Xóa hồ sơ ứng viên này"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: ORDERS FULFILLMENT */}
          {/* ========================================================================= */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {/* Order Status Tabs in Friendly Vietnamese with Live Badges */}
              <div className="flex flex-wrap gap-2 border-b border-[#E2E8F0] pb-3 text-xs font-bold">
                {[
                  { key: "all", label: "Tất cả đơn", count: orders.length },
                  { key: "pending", label: "Chờ thanh toán", count: orders.filter((o) => o.status === "pending").length },
                  { key: "processing", label: "Đang xử lý", count: orders.filter((o) => o.status === "processing").length },
                  { key: "shipping", label: "Đang giao hàng", count: orders.filter((o) => o.status === "shipping").length },
                  { key: "completed", label: "Hoàn thành", count: orders.filter((o) => o.status === "completed").length },
                  { key: "cancelled", label: "Đã hủy", count: orders.filter((o) => o.status === "cancelled").length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setOrderStatusFilter(tab.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                      orderStatusFilter === tab.key
                        ? "bg-[#0063FD] text-white shadow-xs font-black"
                        : "bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                        orderStatusFilter === tab.key
                          ? "bg-white/20 text-white font-bold"
                          : "bg-[#F1F5F9] text-[#475569]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Order Search Bar */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Tìm theo mã đơn (QMD-...), tên khách, SĐT, địa chỉ..."
                    className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                </div>

                <div className="flex items-center gap-3 text-xs text-[#64748B] font-bold">
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery("")}
                      className="rounded-lg border border-[#E2E8F0] px-2.5 py-1 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                    >
                      Xóa tìm kiếm
                    </button>
                  )}
                  <span>
                    Hiển thị <span className="text-[#0063FD] font-black">{filteredOrders.length}</span> / {orders.length} đơn
                  </span>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-black uppercase text-[#475569]">
                    <tr>
                      <th className="p-4">Mã đơn hàng</th>
                      <th className="p-4">Khách hàng / Liên hệ</th>
                      <th className="p-4">Địa chỉ giao</th>
                      <th className="p-4">Tổng thanh toán</th>
                      <th className="p-4">Trạng thái đơn</th>
                      <th className="p-4 text-right">Thao tác xử lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-[#64748B]">
                          <ShoppingBag className="mx-auto h-10 w-10 text-[#CBD5E1] mb-2" />
                          <p className="font-bold text-sm text-[#0F172A]">Chưa có đơn hàng nào phù hợp với bộ lọc.</p>
                          <p className="text-xs text-[#94A3B8] mt-1">Hãy thử chọn tab trạng thái khác hoặc xóa từ khóa tìm kiếm.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
                          pending: { label: "Chờ thanh toán", bg: "bg-[#FEF3C7]", text: "text-[#B45309]", border: "border-[#FDE68A]" },
                          processing: { label: "Đang xử lý", bg: "bg-[#EFF6FF]", text: "text-[#1D4ED8]", border: "border-[#BFDBFE]" },
                          shipping: { label: "Đang giao hàng", bg: "bg-[#FAF5FF]", text: "text-[#7E22CE]", border: "border-[#E9D5FF]" },
                          completed: { label: "Đã hoàn thành", bg: "bg-[#DCFCE7]", text: "text-[#15803D]", border: "border-[#86EFAC]" },
                          cancelled: { label: "Đã hủy đơn", bg: "bg-[#F1F5F9]", text: "text-[#64748B]", border: "border-[#CBD5E1]" },
                        };
                        const sc = statusConfig[order.status] || {
                          label: order.status,
                          bg: "bg-slate-100",
                          text: "text-slate-700",
                          border: "border-slate-200",
                        };

                        return (
                          <tr key={order.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="p-4">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsOrderDetailOpen(true);
                                }}
                                className="font-mono font-bold text-xs text-[#0063FD] hover:underline flex items-center gap-1"
                                title="Bấm để xem toàn bộ chi tiết đơn hàng"
                              >
                                <span>{order.order_code}</span>
                                <ExternalLink className="h-3 w-3" />
                              </button>
                              <div className="text-[10px] text-[#94A3B8] mt-0.5">
                                {order.created_at ? new Date(order.created_at).toLocaleString("vi-VN") : "Hôm nay"}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-[#0F172A] text-xs">{order.customer_name}</div>
                              <div className="text-[11px] font-mono text-[#475569] mt-0.5 flex items-center gap-1">
                                <Phone className="h-3 w-3 text-[#94A3B8]" />
                                <span>{order.customer_phone}</span>
                              </div>
                              {order.customer_email && (
                                <div className="text-[10px] text-[#64748B] truncate max-w-xs">{order.customer_email}</div>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="text-xs text-[#334155] max-w-xs leading-snug">{order.shipping_address}</div>
                              <div className="text-[10px] font-bold text-[#64748B] mt-0.5">{order.shipping_city}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-mono font-black text-sm text-[#B45309]">
                                {new Intl.NumberFormat("vi-VN").format(order.total_vnd)}₫
                              </div>
                              <div className="text-[10px] text-[#94A3B8] mt-0.5">
                                {order.payment_method === "sepay" ? "Chuyển khoản SePay" : order.payment_method}
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}
                              >
                                {sc.label}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsOrderDetailOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-[#0063FD] bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE] transition-colors"
                                  title="Xem toàn bộ sản phẩm và thông tin đơn"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>Xem chi tiết</span>
                                </button>
                                {order.status === "pending" && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, "processing")}
                                    className="rounded-lg bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-1 text-[11px] font-bold text-[#B45309] hover:bg-[#FDE68A] transition-colors"
                                  >
                                    Xử lý
                                  </button>
                                )}
                                {order.status === "processing" && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, "shipping")}
                                    className="rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 text-[11px] font-bold text-[#1D4ED8] hover:bg-[#BFDBFE] transition-colors"
                                  >
                                    Giao hàng
                                  </button>
                                )}
                                {order.status === "shipping" && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                                    className="rounded-lg bg-[#16A34A] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#15803D] transition-colors"
                                  >
                                    Hoàn thành
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
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
          {/* TAB 10: SITE & BUSINESS SETTINGS                                          */}
          {/* ========================================================================= */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Header with Save Button */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase text-[#0F172A] tracking-wide">
                    Cấu Hình Thông Tin Website & Doanh Nghiệp
                  </h2>
                  <p className="mt-0.5 text-xs text-[#64748B]">
                    Tùy chỉnh thông tin liên hệ, hotline, mô hình kinh doanh online/showroom và pháp lý Bộ Công Thương.
                  </p>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSavingSettings}
                  className="font-bold text-xs uppercase shadow-xs px-6"
                >
                  {isSavingSettings ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  )}
                  <span>Lưu Cấu Hình Doanh Nghiệp</span>
                </Button>
              </div>

              {/* Grid 1: Brand & Contact Info */}
              <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#0063FD] font-black uppercase text-xs border-b border-[#E2E8F0] pb-3">
                  <Globe className="h-4 w-4" />
                  <span>1. Thông tin Thương hiệu & Liên hệ Khách hàng</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Tên Thương hiệu / Cửa hàng *</label>
                    <input
                      required
                      type="text"
                      value={siteSettings.store_name}
                      onChange={(e) => setSiteSettings({ ...siteSettings, store_name: e.target.value })}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Khẩu hiệu / Slogan *</label>
                    <input
                      required
                      type="text"
                      value={siteSettings.slogan}
                      onChange={(e) => setSiteSettings({ ...siteSettings, slogan: e.target.value })}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Hotline Bán Hàng 24/7 *</label>
                    <input
                      required
                      type="text"
                      value={siteSettings.hotline}
                      onChange={(e) => setSiteSettings({ ...siteSettings, hotline: e.target.value })}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] font-mono focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Hotline Kỹ Thuật / Zalo</label>
                    <input
                      type="text"
                      value={siteSettings.hotline_support}
                      onChange={(e) => setSiteSettings({ ...siteSettings, hotline_support: e.target.value })}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] font-mono focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Email Tiếp Nhận *</label>
                    <input
                      required
                      type="email"
                      value={siteSettings.support_email}
                      onChange={(e) => setSiteSettings({ ...siteSettings, support_email: e.target.value })}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Thời gian làm việc hỗ trợ</label>
                    <input
                      type="text"
                      value={siteSettings.working_hours}
                      onChange={(e) => setSiteSettings({ ...siteSettings, working_hours: e.target.value })}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Hạn mức Miễn phí vận chuyển (VND)</label>
                    <input
                      type="number"
                      value={siteSettings.free_shipping_threshold_vnd}
                      onChange={(e) => setSiteSettings({ ...siteSettings, free_shipping_threshold_vnd: parseInt(e.target.value || "0", 10) })}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] font-mono focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 2: Business Model & Showroom Settings */}
              <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#0063FD] font-black uppercase text-xs border-b border-[#E2E8F0] pb-3">
                  <Store className="h-4 w-4" />
                  <span>2. Mô Hình Kinh Doanh & Quản Lý Showroom</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Mô Hình Vận Hành *</label>
                    <select
                      value={siteSettings.business_model}
                      onChange={(e) => {
                        const val = e.target.value as "online" | "showroom" | "hybrid";
                        setSiteSettings({
                          ...siteSettings,
                          business_model: val,
                          has_showrooms: val !== "online",
                        });
                      }}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] font-bold focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    >
                      <option value="online">Bán Hàng & Ráp PC Online Toàn Quốc (Chưa có Showroom)</option>
                      <option value="showroom">Hệ Thống Showroom Trực Tiếp</option>
                      <option value="hybrid">Mô Hình Hybrid (Online & Showroom Trực Tiếp)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Dòng chữ hiển thị trên thanh tiện ích Header *</label>
                    <input
                      required
                      type="text"
                      value={siteSettings.business_model_text}
                      onChange={(e) => setSiteSettings({ ...siteSettings, business_model_text: e.target.value })}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1">Địa Chỉ Trụ Sở Chính & Kho Hàng Trung Tâm *</label>
                  <input
                    required
                    type="text"
                    value={siteSettings.headquarters_address}
                    onChange={(e) => setSiteSettings({ ...siteSettings, headquarters_address: e.target.value })}
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                  />
                </div>

                {/* Showroom Toggle & Manager */}
                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block">
                        Bật hiển thị danh sách Showroom trên Website
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        (Bật tùy chọn này sau khi bạn thuê mặt bằng và khai trương showroom vật lý)
                      </span>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={siteSettings.has_showrooms}
                        onChange={(e) => setSiteSettings({ ...siteSettings, has_showrooms: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-[#CBD5E1] after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#0063FD] peer-checked:after:translate-x-full" />
                    </label>
                  </div>

                  {siteSettings.has_showrooms && (
                    <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
                      <span className="text-xs font-bold text-[#0F172A] block">
                        Danh sách Showroom Đang Hoạt Động ({siteSettings.showrooms?.length || 0})
                      </span>

                      {siteSettings.showrooms && siteSettings.showrooms.length > 0 && (
                        <div className="space-y-2">
                          {siteSettings.showrooms.map((sr) => (
                            <div
                              key={sr.id}
                              className="flex items-center justify-between rounded-lg border border-[#CBD5E1] bg-white p-3 text-xs"
                            >
                              <div>
                                <div className="font-bold text-[#0F172A]">{sr.name} ({sr.city})</div>
                                <div className="text-[11px] text-[#64748B]">{sr.address} • Hotline: {sr.phone}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveShowroom(sr.id)}
                                className="text-rose-500 hover:text-rose-700 font-bold text-xs p-1"
                              >
                                Xóa
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Showroom Sub-form */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Thành phố (VD: Hà Nội)"
                          value={newShowroom.city}
                          onChange={(e) => setNewShowroom({ ...newShowroom, city: e.target.value })}
                          className="rounded border border-[#CBD5E1] bg-white p-2 text-xs text-[#0F172A]"
                        />
                        <input
                          type="text"
                          placeholder="Tên Showroom (VD: Showroom Cầu Giấy)"
                          value={newShowroom.name}
                          onChange={(e) => setNewShowroom({ ...newShowroom, name: e.target.value })}
                          className="rounded border border-[#CBD5E1] bg-white p-2 text-xs text-[#0F172A]"
                        />
                        <input
                          type="text"
                          placeholder="Địa chỉ chi tiết..."
                          value={newShowroom.address}
                          onChange={(e) => setNewShowroom({ ...newShowroom, address: e.target.value })}
                          className="rounded border border-[#CBD5E1] bg-white p-2 text-xs text-[#0F172A]"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleAddShowroom}
                          className="text-xs font-bold"
                        >
                          + Thêm Showroom
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid 3: Flash Sale / Golden Hour Settings */}
              <div className="rounded-xl border border-[#FECDD3] bg-[#FFF1F2] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#FECDD3] pb-3">
                  <div className="flex items-center gap-2 text-[#9F1239] font-black uppercase text-xs">
                    <Flame className="h-4 w-4 text-[#EF4444]" />
                    <span>3. Cấu Hình Giờ Vàng Giá Tốt (Flash Sale & Countdown Timer)</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#9F1239]">
                    <input
                      type="checkbox"
                      checked={siteSettings.flash_sale_enabled ?? true}
                      onChange={(e) => setSiteSettings({ ...siteSettings, flash_sale_enabled: e.target.checked })}
                      className="rounded border-[#CBD5E1] text-[#EF4444] focus:ring-[#EF4444] h-4 w-4"
                    />
                    <span>Kích hoạt hiển thị trên trang chủ</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Tiêu Đề Chương Trình *</label>
                    <input
                      required
                      type="text"
                      value={siteSettings.flash_sale_title || "GIỜ VÀNG GIÁ TỐT"}
                      onChange={(e) => setSiteSettings({ ...siteSettings, flash_sale_title: e.target.value })}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#EF4444] focus:outline-none shadow-2xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Thời Gian Kết Thúc Đếm Ngược (End Time) *</label>
                    <input
                      type="datetime-local"
                      value={formatForDatetimeLocal(siteSettings.flash_sale_end_time)}
                      onChange={(e) => {
                        if (e.target.value) {
                          setSiteSettings({ ...siteSettings, flash_sale_end_time: new Date(e.target.value).toISOString() });
                        }
                      }}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] font-mono focus:border-[#EF4444] focus:outline-none shadow-2xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1">Thông Điệp Phụ / Thể Lệ Chương Trình</label>
                  <input
                    type="text"
                    value={siteSettings.flash_sale_subtitle || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, flash_sale_subtitle: e.target.value })}
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#EF4444] focus:outline-none shadow-2xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold text-[#9F1239]">Chọn nhanh mốc thời gian:</span>
                  <button
                    type="button"
                    onClick={() => setSiteSettings({ ...siteSettings, flash_sale_end_time: new Date(Date.now() + 2 * 3600 * 1000).toISOString() })}
                    className="rounded-lg border border-[#FECDD3] bg-white px-2.5 py-1 text-xs font-bold text-[#0F172A] hover:text-[#EF4444] shadow-2xs"
                  >
                    +2 Giờ
                  </button>
                  <button
                    type="button"
                    onClick={() => setSiteSettings({ ...siteSettings, flash_sale_end_time: new Date(Date.now() + 6 * 3600 * 1000).toISOString() })}
                    className="rounded-lg border border-[#FECDD3] bg-white px-2.5 py-1 text-xs font-bold text-[#0F172A] hover:text-[#EF4444] shadow-2xs"
                  >
                    +6 Giờ
                  </button>
                  <button
                    type="button"
                    onClick={() => setSiteSettings({ ...siteSettings, flash_sale_end_time: new Date(Date.now() + 12 * 3600 * 1000).toISOString() })}
                    className="rounded-lg border border-[#FECDD3] bg-white px-2.5 py-1 text-xs font-bold text-[#0F172A] hover:text-[#EF4444] shadow-2xs"
                  >
                    +12 Giờ
                  </button>
                  <button
                    type="button"
                    onClick={() => setSiteSettings({ ...siteSettings, flash_sale_end_time: new Date(Date.now() + 24 * 3600 * 1000).toISOString() })}
                    className="rounded-lg border border-[#FECDD3] bg-white px-2.5 py-1 text-xs font-bold text-[#0F172A] hover:text-[#EF4444] shadow-2xs"
                  >
                    +24 Giờ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                      setSiteSettings({ ...siteSettings, flash_sale_end_time: endOfDay.toISOString() });
                    }}
                    className="rounded-lg border border-[#FECDD3] bg-white px-2.5 py-1 text-xs font-bold text-[#0F172A] hover:text-[#EF4444] shadow-2xs"
                  >
                    Hôm nay 23:59
                  </button>
                </div>
              </div>

              {/* Grid 4: Bo Cong Thuong Legal Registration */}
              <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#0063FD] font-black uppercase text-xs border-b border-[#E2E8F0] pb-3">
                  <ShieldCheck className="h-4 w-4" />
                  <span>4. Pháp Lý Website & Đăng Ký Bộ Công Thương</span>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block">
                        Trạng thái Đã Đăng Ký / Thông Báo với Bộ Công Thương
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        (Bật tùy chọn này sau khi website được Bộ Công Thương phê duyệt và cấp logo xác thực)
                      </span>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={siteSettings.bo_cong_thuong_registered}
                        onChange={(e) => setSiteSettings({ ...siteSettings, bo_cong_thuong_registered: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-[#CBD5E1] after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#16A34A] peer-checked:after:translate-x-full" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] mb-1">
                        Thông điệp pháp lý / Số thông báo ĐKKD
                      </label>
                      <input
                        type="text"
                        value={siteSettings.bo_cong_thuong_license_no || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, bo_cong_thuong_license_no: e.target.value })}
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] mb-1">
                        Đường link xác thực của Bộ Công Thương (Khi đã đăng ký)
                      </label>
                      <input
                        type="url"
                        placeholder="http://online.gov.vn/Home/WebDetails/..."
                        value={siteSettings.bo_cong_thuong_link || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, bo_cong_thuong_link: e.target.value })}
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] font-mono focus:border-[#0063FD] focus:outline-none shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 4: Social Links */}
              <div className="rounded-xl border border-[#CBD5E1] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-[#0063FD] font-black uppercase text-xs border-b border-[#E2E8F0] pb-3">
                  <Activity className="h-4 w-4" />
                  <span>4. Mạng Xã Hội & Kênh Truyền Thông Trực Tuyến</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Facebook Fanpage URL</label>
                    <input
                      type="url"
                      value={siteSettings.facebook_url || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, facebook_url: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">Zalo OA / Chat URL</label>
                    <input
                      type="url"
                      value={siteSettings.zalo_url || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, zalo_url: e.target.value })}
                      placeholder="https://zalo.me/..."
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={siteSettings.youtube_url || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, youtube_url: e.target.value })}
                      placeholder="https://youtube.com/@..."
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSavingSettings}
                  className="font-bold text-xs uppercase shadow-md px-8 py-3"
                >
                  {isSavingSettings ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  )}
                  <span>Lưu Toàn Bộ Cấu Hình Website</span>
                </Button>
              </div>
            </form>
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
                  <div className="flex items-center gap-2 text-[#0063FD]">
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
              <label className="block font-bold text-[#1E293B] mb-1">Tên tiếng Việt *</label>
              <input
                required
                type="text"
                placeholder="VD: Card màn hình ASUS ROG Strix RTX 4070 Ti Super 16GB"
                value={productForm.name_vi}
                onChange={(e) => setProductForm({ ...productForm, name_vi: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Tên tiếng Anh</label>
              <input
                type="text"
                placeholder="VD: ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB"
                value={productForm.name_en}
                onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Mã SKU *</label>
              <input
                required
                type="text"
                placeholder="VD: GPU-ASUS-4070TIS"
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Thương hiệu *</label>
              <select
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs font-bold"
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
              <label className="block font-bold text-[#1E293B] mb-1">Danh mục *</label>
              <select
                value={productForm.category_id}
                onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs font-bold"
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
              <label className="block font-bold text-[#1E293B] mb-1">Giá bán (VND) *</label>
              <input
                required
                type="text"
                placeholder="VD: 15,000,000"
                value={productForm.price_vnd ? formatVndNumber(productForm.price_vnd) : ""}
                onChange={(e) => setProductForm({ ...productForm, price_vnd: parseVndNumber(e.target.value) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs font-bold"
              />
              <span className="text-[10px] font-mono font-bold text-[#0063FD] mt-1 block">
                = {formatVndNumber(productForm.price_vnd)} VNĐ
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Giá niêm yết cũ (VND)</label>
              <input
                type="text"
                placeholder="VD: 18,000,000"
                value={productForm.original_price_vnd ? formatVndNumber(productForm.original_price_vnd) : ""}
                onChange={(e) => setProductForm({ ...productForm, original_price_vnd: parseVndNumber(e.target.value) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
              {productForm.original_price_vnd ? (
                <span className="text-[10px] font-mono text-[#64748B] mt-1 block">
                  = {formatVndNumber(productForm.original_price_vnd)} VNĐ
                </span>
              ) : null}
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Số lượng tồn kho *</label>
              <input
                required
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value || "0", 10) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs font-bold"
              />
            </div>
          </div>

          {/* PC Builder Compatibility Specs */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 space-y-2">
            <div className="font-black text-[#0F172A] uppercase text-[11px] flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#0063FD]" />
              Thông số tương thích công cụ Custom PC Builder
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-[#475569]">Socket (VD: LGA1700, AM5)</label>
                <input
                  type="text"
                  placeholder="LGA1700"
                  value={socketInput}
                  onChange={(e) => setSocketInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#475569]">RAM Type (VD: DDR5, DDR4)</label>
                <input
                  type="text"
                  placeholder="DDR5"
                  value={ramTypeInput}
                  onChange={(e) => setRamTypeInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#475569]">Công suất TDP (W)</label>
                <input
                  type="number"
                  placeholder="250"
                  value={tdpInput}
                  onChange={(e) => setTdpInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#475569]">VRAM (GB)</label>
                <input
                  type="number"
                  placeholder="16"
                  value={vramInput}
                  onChange={(e) => setVramInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <CloudinaryImageUpload
              value={productForm.images[0] || ""}
              onChange={(url) => setProductForm({ ...productForm, images: url ? [url] : [] })}
              folder="qmdtech/products"
              label="Ảnh sản phẩm chính"
              description="Tự động nén WebP và tải lên Cloudinary để tối ưu hóa hiệu năng và quota."
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
      {/* EDIT PRODUCT MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isEditProductOpen}
        onClose={() => {
          setIsEditProductOpen(false);
          setEditingProductId(null);
        }}
        title="CHỈNH SỬA THÔNG TIN LINH KIỆN"
        description="Cập nhật thông số kỹ thuật, giá bán VNĐ và tồn kho linh kiện trong hệ thống"
        maxWidth="2xl"
      >
        <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Tên tiếng Việt *</label>
              <input
                required
                type="text"
                placeholder="VD: Card màn hình ASUS ROG Strix RTX 4070 Ti Super 16GB"
                value={editProductForm.name_vi}
                onChange={(e) => setEditProductForm({ ...editProductForm, name_vi: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Tên tiếng Anh</label>
              <input
                type="text"
                placeholder="VD: ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB"
                value={editProductForm.name_en}
                onChange={(e) => setEditProductForm({ ...editProductForm, name_en: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Mã SKU *</label>
              <input
                required
                type="text"
                placeholder="VD: GPU-ASUS-4070TIS"
                value={editProductForm.sku}
                onChange={(e) => setEditProductForm({ ...editProductForm, sku: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Thương hiệu *</label>
              <select
                value={editProductForm.brand}
                onChange={(e) => setEditProductForm({ ...editProductForm, brand: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs font-bold"
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
              <label className="block font-bold text-[#1E293B] mb-1">Danh mục *</label>
              <select
                value={editProductForm.category_id}
                onChange={(e) => setEditProductForm({ ...editProductForm, category_id: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs font-bold"
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
              <label className="block font-bold text-[#1E293B] mb-1">Giá bán (VND) *</label>
              <input
                required
                type="text"
                placeholder="VD: 15,000,000"
                value={editProductForm.price_vnd ? formatVndNumber(editProductForm.price_vnd) : ""}
                onChange={(e) => setEditProductForm({ ...editProductForm, price_vnd: parseVndNumber(e.target.value) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs font-bold"
              />
              <span className="text-[10px] font-mono font-bold text-[#0063FD] mt-1 block">
                = {formatVndNumber(editProductForm.price_vnd)} VNĐ
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Giá niêm yết cũ (VND)</label>
              <input
                type="text"
                placeholder="VD: 18,000,000"
                value={editProductForm.original_price_vnd ? formatVndNumber(editProductForm.original_price_vnd) : ""}
                onChange={(e) => setEditProductForm({ ...editProductForm, original_price_vnd: parseVndNumber(e.target.value) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
              {editProductForm.original_price_vnd ? (
                <span className="text-[10px] font-mono text-[#64748B] mt-1 block">
                  = {formatVndNumber(editProductForm.original_price_vnd)} VNĐ
                </span>
              ) : null}
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Số lượng tồn kho *</label>
              <input
                required
                type="number"
                value={editProductForm.stock}
                onChange={(e) => setEditProductForm({ ...editProductForm, stock: parseInt(e.target.value || "0", 10) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs font-bold"
              />
            </div>
          </div>

          {/* PC Builder Compatibility Specs */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 space-y-2">
            <div className="font-black text-[#0F172A] uppercase text-[11px] flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#0063FD]" />
              Thông số tương thích công cụ Custom PC Builder
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-[#475569]">Socket (VD: LGA1700, AM5)</label>
                <input
                  type="text"
                  placeholder="LGA1700"
                  value={editSocketInput}
                  onChange={(e) => setEditSocketInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#475569]">RAM Type (VD: DDR5, DDR4)</label>
                <input
                  type="text"
                  placeholder="DDR5"
                  value={editRamTypeInput}
                  onChange={(e) => setEditRamTypeInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#475569]">Công suất TDP (W)</label>
                <input
                  type="number"
                  placeholder="250"
                  value={editTdpInput}
                  onChange={(e) => setEditTdpInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#475569]">VRAM (GB)</label>
                <input
                  type="number"
                  placeholder="16"
                  value={editVramInput}
                  onChange={(e) => setEditVramInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] bg-white p-1.5 text-xs text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <CloudinaryImageUpload
              value={editProductForm.images[0] || ""}
              onChange={(url) => setEditProductForm({ ...editProductForm, images: url ? [url] : [] })}
              folder="qmdtech/products"
              label="Ảnh sản phẩm chính"
              description="Tự động nén WebP và tải lên Cloudinary để tối ưu hóa hiệu năng và quota."
            />
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditProductOpen(false);
                setEditingProductId(null);
              }}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="sm" className="font-black uppercase text-xs">
              Cập Nhật Sản Phẩm
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
            <label className="block font-bold text-[#1E293B] mb-1">Tên danh mục (Tiếng Việt) *</label>
            <input
              required
              type="text"
              placeholder="VD: Card Màn Hình (VGA)"
              value={categoryForm.name_vi}
              onChange={(e) => setCategoryForm({ ...categoryForm, name_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Tên danh mục (Tiếng Anh)</label>
            <input
              type="text"
              placeholder="VD: Graphics Cards (GPU)"
              value={categoryForm.name_en}
              onChange={(e) => setCategoryForm({ ...categoryForm, name_en: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Slug URL (VD: gpu, cpu, ram) *</label>
            <input
              required
              type="text"
              placeholder="VD: gpu"
              value={categoryForm.slug}
              onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value.toLowerCase().trim() })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
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
      {/* EDIT CATEGORY MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isEditCategoryOpen}
        onClose={() => {
          setIsEditCategoryOpen(false);
          setEditingCategoryId(null);
        }}
        title="CHỈNH SỬA THÔNG TIN DANH MỤC"
        description="Cập nhật tên danh mục hiển thị trên Web Shop và đường dẫn Slug"
        maxWidth="md"
      >
        <form onSubmit={handleUpdateCategory} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Tên danh mục (Tiếng Việt) *</label>
            <input
              required
              type="text"
              placeholder="VD: Card Màn Hình (VGA)"
              value={editCategoryForm.name_vi}
              onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Tên danh mục (Tiếng Anh)</label>
            <input
              type="text"
              placeholder="VD: Graphics Cards (GPU)"
              value={editCategoryForm.name_en}
              onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name_en: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Slug URL (VD: gpu, cpu, ram) *</label>
            <input
              required
              type="text"
              placeholder="VD: gpu"
              value={editCategoryForm.slug}
              onChange={(e) => setEditCategoryForm({ ...editCategoryForm, slug: e.target.value.toLowerCase().trim() })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full font-black uppercase text-xs">
              Lưu Thay Đổi Danh Mục
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD MEGA MENU CATEGORY MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddMenuCategoryOpen}
        onClose={() => setIsAddMenuCategoryOpen(false)}
        title="THÊM MỤC MỚI VÀO MENU DROPDOWN"
        description="Thêm danh mục cha cấp 1 vào Menu Mega Dropdown của cửa hàng"
        maxWidth="md"
      >
        <form onSubmit={handleCreateMenuCategory} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Tên danh mục hiển thị *</label>
            <input
              required
              type="text"
              placeholder="VD: Gaming Gear, Màn Hình Máy Tính"
              value={newMenuCatForm.name}
              onChange={(e) => {
                const name = e.target.value;
                const autoSlug = name
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9-]+/g, "-")
                  .replace(/^-|-$/g, "");
                setNewMenuCatForm((prev) => ({
                  ...prev,
                  name,
                  slug: prev.slug || autoSlug,
                  allUrl: prev.allUrl === "/danh-muc" || !prev.allUrl ? `/danh-muc/${autoSlug}` : prev.allUrl,
                }));
              }}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Mã định danh (Slug ID)</label>
              <input
                type="text"
                placeholder="VD: gear, monitor"
                value={newMenuCatForm.slug}
                onChange={(e) => setNewMenuCatForm({ ...newMenuCatForm, slug: e.target.value.toLowerCase().trim() })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Icon hiển thị</label>
              <select
                value={newMenuCatForm.iconName}
                onChange={(e) => setNewMenuCatForm({ ...newMenuCatForm, iconName: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              >
                {AVAILABLE_ICON_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Đường dẫn xem tất cả (All URL)</label>
            <input
              type="text"
              placeholder="VD: /danh-muc/monitor"
              value={newMenuCatForm.allUrl}
              onChange={(e) => setNewMenuCatForm({ ...newMenuCatForm, allUrl: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddMenuCategoryOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="sm" className="font-black uppercase text-xs">
              Thêm Vào Menu
            </Button>
          </div>
        </form>
      </Modal>
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
            <label className="block font-bold text-[#1E293B] mb-1">Vị trí hiển thị trên website *</label>
            <select
              value={bannerForm.position || "hero"}
              onChange={(e) => setBannerForm({ ...bannerForm, position: e.target.value as any })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs font-semibold text-xs"
            >
              <option value="hero">Banner Hero đầu trang (Carousel lớn trên cùng)</option>
              <option value="middle_carousel">Poster sự kiện giữa trang (Carousel vuốt ngang tương tác)</option>
              <option value="side_left">Banner dọc sườn trái (Cố định góc trái desktop)</option>
              <option value="side_right">Banner dọc sườn phải (Cố định góc phải desktop)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Tiêu đề Poster (Tiếng Việt) *</label>
            <input
              required
              type="text"
              placeholder="VD: Mở Bán GeForce RTX 40 Super Series"
              value={bannerForm.title_vi}
              onChange={(e) => setBannerForm({ ...bannerForm, title_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Mô tả phụ / Thông điệp ngắn</label>
            <input
              type="text"
              placeholder="VD: Tặng kèm gói quà tặng gaming cao cấp khi đặt mua"
              value={bannerForm.subtitle_vi}
              onChange={(e) => setBannerForm({ ...bannerForm, subtitle_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Nhãn Tag (VD: SỰ KIỆN MỚI, FLASH SALE)</label>
              <input
                type="text"
                value={bannerForm.tag}
                onChange={(e) => setBannerForm({ ...bannerForm, tag: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Đường dẫn liên kết (Target URL)</label>
              <input
                type="text"
                value={bannerForm.target_url}
                onChange={(e) => setBannerForm({ ...bannerForm, target_url: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
            </div>
          </div>

          <div>
            <CloudinaryImageUpload
              value={bannerForm.image_url}
              onChange={(url) => setBannerForm({ ...bannerForm, image_url: url })}
              folder="qmdtech/banners"
              label="Ảnh Banner Sự Kiện (Tỷ lệ 16:9 hoặc 21:9) *"
              description="Tự động tối ưu định dạng và kích thước phân phối qua CDN."
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
      {/* EDIT BANNER MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isEditBannerOpen}
        onClose={() => setIsEditBannerOpen(false)}
        title="CHỈNH SỬA BANNER / POSTER SỰ KIỆN"
        description="Cập nhật hình ảnh, tiêu đề, liên kết và trạng thái hiển thị của poster"
        maxWidth="lg"
      >
        <form onSubmit={handleUpdateBanner} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Vị trí hiển thị trên website *</label>
            <select
              value={editBannerForm.position || "hero"}
              onChange={(e) => setEditBannerForm({ ...editBannerForm, position: e.target.value as any })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs font-semibold text-xs"
            >
              <option value="hero">Banner Hero đầu trang (Carousel lớn trên cùng)</option>
              <option value="middle_carousel">Poster sự kiện giữa trang (Carousel vuốt ngang tương tác)</option>
              <option value="side_left">Banner dọc sườn trái (Cố định góc trái desktop)</option>
              <option value="side_right">Banner dọc sườn phải (Cố định góc phải desktop)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Tiêu đề Poster (Tiếng Việt) *</label>
            <input
              required
              type="text"
              value={editBannerForm.title_vi}
              onChange={(e) => setEditBannerForm({ ...editBannerForm, title_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Mô tả phụ / Thông điệp ngắn</label>
            <input
              type="text"
              value={editBannerForm.subtitle_vi}
              onChange={(e) => setEditBannerForm({ ...editBannerForm, subtitle_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Nhãn Tag (VD: SỰ KIỆN MỚI, FLASH SALE)</label>
              <input
                type="text"
                value={editBannerForm.tag}
                onChange={(e) => setEditBannerForm({ ...editBannerForm, tag: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Đường dẫn liên kết (Target URL)</label>
              <input
                type="text"
                value={editBannerForm.target_url}
                onChange={(e) => setEditBannerForm({ ...editBannerForm, target_url: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Thứ tự hiển thị (Display Order)</label>
              <input
                type="number"
                value={editBannerForm.display_order}
                onChange={(e) => setEditBannerForm({ ...editBannerForm, display_order: parseInt(e.target.value || "1", 10) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
            </div>
            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={editBannerForm.is_active}
                  onChange={(e) => setEditBannerForm({ ...editBannerForm, is_active: e.target.checked })}
                  className="rounded border-[#CBD5E1] text-[#0063FD] focus:ring-[#0063FD] h-4 w-4"
                />
                <span>Kích hoạt hiển thị lên trang chủ</span>
              </label>
            </div>
          </div>

          <div>
            <CloudinaryImageUpload
              value={editBannerForm.image_url}
              onChange={(url) => setEditBannerForm({ ...editBannerForm, image_url: url })}
              folder="qmdtech/banners"
              label="Ảnh Banner Sự Kiện (Tỷ lệ 16:9 hoặc 21:9) *"
              description="Tự động tối ưu định dạng và kích thước phân phối qua CDN."
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full font-black uppercase text-xs">
              Lưu Thay Đổi Poster
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
              <label className="block font-bold text-[#1E293B] mb-1">Tên cấu hình PC *</label>
              <input
                required
                type="text"
                placeholder="VD: PC QMD-G01 Core i5-13400F | RTX 4060"
                value={dealForm.name_vi}
                onChange={(e) => setDealForm({ ...dealForm, name_vi: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Mã cấu hình (Code SKU) *</label>
              <input
                required
                type="text"
                placeholder="VD: PC-QMD-G01"
                value={dealForm.code}
                onChange={(e) => setDealForm({ ...dealForm, code: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Giá bán (VND) *</label>
              <input
                required
                type="text"
                placeholder="VD: 25,000,000"
                value={dealForm.price_vnd ? formatVndNumber(dealForm.price_vnd) : ""}
                onChange={(e) => setDealForm({ ...dealForm, price_vnd: parseVndNumber(e.target.value) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs font-bold"
              />
              <span className="text-[10px] font-mono font-bold text-[#0063FD] mt-1 block">
                = {formatVndNumber(dealForm.price_vnd)} VNĐ
              </span>
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Giá niêm yết cũ (VND)</label>
              <input
                type="text"
                placeholder="VD: 28,000,000"
                value={dealForm.original_price_vnd ? formatVndNumber(dealForm.original_price_vnd) : ""}
                onChange={(e) => setDealForm({ ...dealForm, original_price_vnd: parseVndNumber(e.target.value) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
              {dealForm.original_price_vnd ? (
                <span className="text-[10px] font-mono text-[#64748B] mt-1 block">
                  = {formatVndNumber(dealForm.original_price_vnd)} VNĐ
                </span>
              ) : null}
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Nhãn Tag (Badge)</label>
              <input
                type="text"
                value={dealForm.badge}
                onChange={(e) => setDealForm({ ...dealForm, badge: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Vi xử lý CPU *</label>
              <input
                required
                type="text"
                placeholder="VD: Intel Core i5-13400F"
                value={dealForm.cpu}
                onChange={(e) => setDealForm({ ...dealForm, cpu: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Card màn hình VGA *</label>
              <input
                required
                type="text"
                placeholder="VD: ASUS Dual RTX 4060 8GB"
                value={dealForm.vga}
                onChange={(e) => setDealForm({ ...dealForm, vga: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Bộ nhớ RAM *</label>
              <input
                required
                type="text"
                placeholder="VD: 16GB (2x8GB) DDR4 3200MHz"
                value={dealForm.ram}
                onChange={(e) => setDealForm({ ...dealForm, ram: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Ổ cứng SSD *</label>
              <input
                required
                type="text"
                placeholder="VD: 500GB NVMe M.2 Gen4"
                value={dealForm.ssd}
                onChange={(e) => setDealForm({ ...dealForm, ssd: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div>
            <CloudinaryImageUpload
              value={dealForm.image_url}
              onChange={(url) => setDealForm({ ...dealForm, image_url: url })}
              folder="qmdtech/deals"
              label="Ảnh đại diện cấu hình PC"
              description="Tự động nén WebP và lưu trữ trên Cloudinary."
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
              <label className="block font-bold text-[#1E293B] mb-1">Tên công ty / Nhà phân phối *</label>
              <input
                required
                type="text"
                placeholder="VD: Synnex FPT Distribution"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Mã nhà cung cấp (Code) *</label>
              <input
                required
                type="text"
                placeholder="VD: SUP-FPT"
                value={supplierForm.code}
                onChange={(e) => setSupplierForm({ ...supplierForm, code: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Người liên hệ phụ trách</label>
              <input
                type="text"
                placeholder="VD: Nguyễn Hoàng Long"
                value={supplierForm.contact_person}
                onChange={(e) => setSupplierForm({ ...supplierForm, contact_person: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Số điện thoại hotline</label>
              <input
                type="text"
                placeholder="VD: 024.7300.7300"
                value={supplierForm.phone}
                onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Thương hiệu phân phối (cách nhau bằng dấu phẩy)</label>
            <input
              type="text"
              placeholder="VD: ASUS, Intel, Kingston, Western Digital"
              value={brandInputString}
              onChange={(e) => setBrandInputString(e.target.value)}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Địa chỉ kho / Trụ sở chính</label>
            <input
              type="text"
              placeholder="VD: Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội"
              value={supplierForm.address}
              onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full font-black uppercase text-xs">
              Lưu Thông Tin Nhà Cung Cấp
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD BLOG POST MODAL (Rich Text Editor)                                    */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddBlogOpen}
        onClose={() => setIsAddBlogOpen(false)}
        title="SOẠN BÀI VIẾT CÔNG NGHỆ MỚI (RICH TEXT)"
        description="Đăng bài review linh kiện, hướng dẫn tự lắp ráp máy tính và tin tức phần cứng"
        maxWidth="4xl"
      >
        <form onSubmit={handleCreateBlogPost} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Tiêu đề bài viết (Tiếng Việt) *</label>
            <input
              required
              type="text"
              placeholder="VD: Hướng Dẫn Chọn Nguồn PSU Chuẩn ATX 3.0 & Cáp 12VHPWR Cho RTX 40 Series"
              value={blogForm.title_vi}
              onChange={(e) => {
                const title = e.target.value;
                const autoSlug = sanitizeSlug(title);
                setBlogForm({ ...blogForm, title_vi: title, slug: blogForm.slug || autoSlug });
              }}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none text-sm font-bold shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Slug URL (Đường dẫn tĩnh) *</label>
              <input
                required
                type="text"
                placeholder="huong-dan-chon-nguon-psu"
                value={blogForm.slug}
                onChange={(e) => setBlogForm({ ...blogForm, slug: sanitizeSlug(e.target.value) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
              <span className="text-[10px] text-[#64748B] mt-1 block">
                Tự động chuẩn hóa khi dán link ngoài hoặc nhập văn bản.
              </span>
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Chuyên mục bài viết *</label>
              <select
                value={blogForm.category}
                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-bold shadow-2xs"
              >
                <option value="Kiến Thức Phần Cứng">Kiến Thức Phần Cứng</option>
                <option value="Đánh Giá & Review">Đánh Giá & Review</option>
                <option value="Hướng Dẫn Build PC">Hướng Dẫn Build PC</option>
                <option value="Tin Công Nghệ">Tin Công Nghệ</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Tác giả biên tập</label>
              <input
                type="text"
                value={blogForm.author_name}
                onChange={(e) => setBlogForm({ ...blogForm, author_name: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div>
            <CloudinaryImageUpload
              value={blogForm.cover_image}
              onChange={(url) => setBlogForm({ ...blogForm, cover_image: url })}
              folder="qmdtech/blogs"
              label="Ảnh đại diện bài viết (Cover Image) *"
              description="Tự động nén WebP và tải lên Cloudinary để tiết kiệm hạn mức."
            />
          </div>

          <div className="w-48">
            <label className="block font-bold text-[#1E293B] mb-1">Thời gian đọc ước tính</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={blogForm.reading_time_mins}
                onChange={(e) => setBlogForm({ ...blogForm, reading_time_mins: parseInt(e.target.value || "5", 10) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono text-center shadow-2xs"
              />
              <span className="text-xs text-[#64748B] shrink-0 font-bold">phút</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Đoạn tóm tắt mở đầu (Excerpt) *</label>
            <textarea
              required
              rows={2}
              placeholder="Tóm tắt ngắn gọn nội dung bài viết hiển thị ở thẻ ngoài danh mục..."
              value={blogForm.excerpt_vi}
              onChange={(e) => setBlogForm({ ...blogForm, excerpt_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none leading-relaxed shadow-2xs"
            />
          </div>

          {/* Rich Text Editor Content */}
          <div>
            <label className="block font-bold text-[#1E293B] mb-1.5">
              Nội dung bài viết chi tiết (Trình Soạn Thảo Rich Text) *
            </label>
            <RichTextEditor
              value={blogForm.content_html_vi}
              onChange={(html) => setBlogForm({ ...blogForm, content_html_vi: html })}
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0F172A]">
              <input
                type="checkbox"
                checked={blogForm.is_published}
                onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })}
                className="rounded border-[#CBD5E1] text-[#0063FD] focus:ring-[#0063FD] h-4 w-4"
              />
              <span>Xuất bản công khai lên trang web ngay</span>
            </label>

            <Button type="submit" variant="primary" size="md" className="font-black uppercase text-xs shadow-md">
              Xuất Bản Bài Viết
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* EDIT BLOG POST MODAL                                                      */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isEditBlogOpen}
        onClose={() => setIsEditBlogOpen(false)}
        title="CHỈNH SỬA BÀI VIẾT CÔNG NGHỆ"
        description="Cập nhật nội dung bài viết, hình ảnh minh họa và trạng thái xuất bản"
        maxWidth="4xl"
      >
        <form onSubmit={handleUpdateBlogPost} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Tiêu đề bài viết (Tiếng Việt) *</label>
            <input
              required
              type="text"
              value={editBlogForm.title_vi}
              onChange={(e) => setEditBlogForm({ ...editBlogForm, title_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none text-sm font-bold shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Slug URL (Đường dẫn tĩnh) *</label>
              <input
                required
                type="text"
                value={editBlogForm.slug}
                onChange={(e) => setEditBlogForm({ ...editBlogForm, slug: sanitizeSlug(e.target.value) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
              <span className="text-[10px] text-[#64748B] mt-1 block">
                Tự động chuẩn hóa khi dán link ngoài hoặc nhập văn bản.
              </span>
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Chuyên mục bài viết *</label>
              <select
                value={editBlogForm.category}
                onChange={(e) => setEditBlogForm({ ...editBlogForm, category: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-bold shadow-2xs"
              >
                <option value="Kiến Thức Phần Cứng">Kiến Thức Phần Cứng</option>
                <option value="Đánh Giá & Review">Đánh Giá & Review</option>
                <option value="Hướng Dẫn Build PC">Hướng Dẫn Build PC</option>
                <option value="Tin Công Nghệ">Tin Công Nghệ</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Tác giả biên tập</label>
              <input
                type="text"
                value={editBlogForm.author_name}
                onChange={(e) => setEditBlogForm({ ...editBlogForm, author_name: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div>
            <CloudinaryImageUpload
              value={editBlogForm.cover_image}
              onChange={(url) => setEditBlogForm({ ...editBlogForm, cover_image: url })}
              folder="qmdtech/blogs"
              label="Ảnh đại diện bài viết (Cover Image) *"
              description="Tự động nén WebP và tải lên Cloudinary để tiết kiệm hạn mức."
            />
          </div>

          <div className="w-48">
            <label className="block font-bold text-[#1E293B] mb-1">Thời gian đọc ước tính</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={editBlogForm.reading_time_mins}
                onChange={(e) => setEditBlogForm({ ...editBlogForm, reading_time_mins: parseInt(e.target.value || "5", 10) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono text-center shadow-2xs"
              />
              <span className="text-xs text-[#64748B] shrink-0 font-bold">phút</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Đoạn tóm tắt mở đầu (Excerpt) *</label>
            <textarea
              required
              rows={2}
              value={editBlogForm.excerpt_vi}
              onChange={(e) => setEditBlogForm({ ...editBlogForm, excerpt_vi: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none leading-relaxed shadow-2xs"
            />
          </div>

          {/* Rich Text Editor Content */}
          <div>
            <label className="block font-bold text-[#1E293B] mb-1.5">
              Nội dung bài viết chi tiết (Trình Soạn Thảo Rich Text) *
            </label>
            <RichTextEditor
              value={editBlogForm.content_html_vi}
              onChange={(html) => setEditBlogForm({ ...editBlogForm, content_html_vi: html })}
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0F172A]">
              <input
                type="checkbox"
                checked={editBlogForm.is_published}
                onChange={(e) => setEditBlogForm({ ...editBlogForm, is_published: e.target.checked })}
                className="rounded border-[#CBD5E1] text-[#0063FD] focus:ring-[#0063FD] h-4 w-4"
              />
              <span>Xuất bản công khai lên trang web</span>
            </label>

            <Button type="submit" variant="primary" size="md" className="font-black uppercase text-xs shadow-md">
              Lưu Thay Đổi Bài Viết
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD CAREER JOB MODAL                                                      */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddCareerOpen}
        onClose={() => setIsAddCareerOpen(false)}
        title="THÊM VỊ TRÍ TUYỂN DỤNG MỚI"
        description="Đăng tin tuyển dụng nhân sự mới cho hệ thống QMD-Tech"
        maxWidth="4xl"
      >
        <form onSubmit={handleCreateCareer} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1E293B] mb-1">
              Tên vị trí tuyển dụng *
            </label>
            <input
              required
              type="text"
              placeholder="VD: Kỹ Thuật Viên Lắp Ráp & Cài Đặt PC"
              value={careerForm.title}
              onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:outline-none text-sm font-bold shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">
                Slug URL (Để trống để tự động tạo)
              </label>
              <input
                type="text"
                placeholder="VD: ky-thuat-vien-lap-rap-pc"
                value={careerForm.slug}
                onChange={(e) => setCareerForm({ ...careerForm, slug: sanitizeCareerSlug(e.target.value) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:outline-none font-mono shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Phòng ban *</label>
              <select
                value={careerForm.department}
                onChange={(e) => setCareerForm({ ...careerForm, department: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:outline-none font-bold shadow-2xs"
              >
                <option value="Kỹ Thuật & Phần Cứng">Kỹ Thuật & Phần Cứng</option>
                <option value="Kinh Doanh & Chăm Sóc Khách Hàng">Kinh Doanh & Chăm Sóc Khách Hàng</option>
                <option value="Bảo Hành & Kiểm Soát Chất Lượng">Bảo Hành & Kiểm Soát Chất Lượng</option>
                <option value="Marketing & Truyền Thông">Marketing & Truyền Thông</option>
                <option value="Kho Vận & Logistics">Kho Vận & Logistics</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Mức lương *</label>
              <input
                required
                type="text"
                placeholder="VD: 12.000.000₫ - 18.000.000₫"
                value={careerForm.salary}
                onChange={(e) => setCareerForm({ ...careerForm, salary: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#16A34A] font-bold focus:border-[#0063FD] focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Địa điểm làm việc</label>
              <input
                type="text"
                placeholder="Hà Nội"
                value={careerForm.location}
                onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Hình thức làm việc</label>
              <select
                value={careerForm.employment_type}
                onChange={(e) => setCareerForm({ ...careerForm, employment_type: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
              >
                <option value="Toàn thời gian">Toàn thời gian</option>
                <option value="Bán thời gian">Bán thời gian</option>
                <option value="Thực tập sinh">Thực tập sinh</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Yêu cầu kinh nghiệm</label>
              <input
                type="text"
                placeholder="1 năm kinh nghiệm hoặc đam mê PC"
                value={careerForm.experience}
                onChange={(e) => setCareerForm({ ...careerForm, experience: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Mô tả công việc *</label>
            <textarea
              required
              rows={3}
              placeholder="Chi tiết công việc hằng ngày của vị trí..."
              value={careerForm.description}
              onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:outline-none leading-relaxed shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Yêu cầu ứng viên *</label>
            <textarea
              required
              rows={3}
              placeholder="Kỹ năng, thái độ hoặc phẩm chất cần có..."
              value={careerForm.requirements}
              onChange={(e) => setCareerForm({ ...careerForm, requirements: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:outline-none leading-relaxed shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Quyền lợi & Chế độ đãi ngộ</label>
            <textarea
              rows={2}
              placeholder="BHXH, thưởng KPI, phụ cấp ăn trưa, ưu đãi linh kiện..."
              value={careerForm.benefits}
              onChange={(e) => setCareerForm({ ...careerForm, benefits: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:outline-none leading-relaxed shadow-2xs"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0F172A]">
              <input
                type="checkbox"
                checked={careerForm.is_active}
                onChange={(e) => setCareerForm({ ...careerForm, is_active: e.target.checked })}
                className="rounded border-[#CBD5E1] text-[#0063FD] focus:ring-[#0063FD] h-4 w-4"
              />
              <span>Mở tuyển dụng công khai ngay</span>
            </label>

            <Button type="submit" variant="primary" size="md" className="font-black uppercase text-xs shadow-md">
              Đăng Tuyển Vị Trí
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* EDIT CAREER JOB MODAL                                                     */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isEditCareerOpen}
        onClose={() => setIsEditCareerOpen(false)}
        title="CHỈNH SỬA VỊ TRÍ TUYỂN DỤNG"
        description="Cập nhật thông tin mô tả, mức lương hoặc trạng thái tuyển dụng"
        maxWidth="4xl"
      >
        <form onSubmit={handleUpdateCareer} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1E293B] mb-1">
              Tên vị trí tuyển dụng *
            </label>
            <input
              required
              type="text"
              value={editCareerForm.title}
              onChange={(e) => setEditCareerForm({ ...editCareerForm, title: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none text-sm font-bold shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Slug URL</label>
              <input
                type="text"
                value={editCareerForm.slug}
                onChange={(e) => setEditCareerForm({ ...editCareerForm, slug: sanitizeCareerSlug(e.target.value) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Phòng ban *</label>
              <select
                value={editCareerForm.department}
                onChange={(e) => setEditCareerForm({ ...editCareerForm, department: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-bold shadow-2xs"
              >
                <option value="Kỹ Thuật & Phần Cứng">Kỹ Thuật & Phần Cứng</option>
                <option value="Kinh Doanh & Chăm Sóc Khách Hàng">Kinh Doanh & Chăm Sóc Khách Hàng</option>
                <option value="Bảo Hành & Kiểm Soát Chất Lượng">Bảo Hành & Kiểm Soát Chất Lượng</option>
                <option value="Marketing & Truyền Thông">Marketing & Truyền Thông</option>
                <option value="Kho Vận & Logistics">Kho Vận & Logistics</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Mức lương *</label>
              <input
                required
                type="text"
                value={editCareerForm.salary}
                onChange={(e) => setEditCareerForm({ ...editCareerForm, salary: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#16A34A] font-bold focus:border-[#0063FD] focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Địa điểm làm việc</label>
              <input
                type="text"
                value={editCareerForm.location}
                onChange={(e) => setEditCareerForm({ ...editCareerForm, location: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Hình thức làm việc</label>
              <select
                value={editCareerForm.employment_type}
                onChange={(e) => setEditCareerForm({ ...editCareerForm, employment_type: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
              >
                <option value="Toàn thời gian">Toàn thời gian</option>
                <option value="Bán thời gian">Bán thời gian</option>
                <option value="Thực tập sinh">Thực tập sinh</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1E293B] mb-1">Yêu cầu kinh nghiệm</label>
              <input
                type="text"
                value={editCareerForm.experience}
                onChange={(e) => setEditCareerForm({ ...editCareerForm, experience: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2 text-[#0F172A] focus:border-[#0063FD] focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Mô tả công việc *</label>
            <textarea
              required
              rows={3}
              value={editCareerForm.description}
              onChange={(e) => setEditCareerForm({ ...editCareerForm, description: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:outline-none leading-relaxed shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Yêu cầu ứng viên *</label>
            <textarea
              required
              rows={3}
              value={editCareerForm.requirements}
              onChange={(e) => setEditCareerForm({ ...editCareerForm, requirements: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:outline-none leading-relaxed shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E293B] mb-1">Quyền lợi & Chế độ đãi ngộ</label>
            <textarea
              rows={2}
              value={editCareerForm.benefits}
              onChange={(e) => setEditCareerForm({ ...editCareerForm, benefits: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:outline-none leading-relaxed shadow-2xs"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0F172A]">
              <input
                type="checkbox"
                checked={editCareerForm.is_active}
                onChange={(e) => setEditCareerForm({ ...editCareerForm, is_active: e.target.checked })}
                className="rounded border-[#CBD5E1] text-[#0063FD] focus:ring-[#0063FD] h-4 w-4"
              />
              <span>Mở nhận hồ sơ ứng tuyển</span>
            </label>

            <Button type="submit" variant="primary" size="md" className="font-black uppercase text-xs shadow-md">
              Lưu Thay Đổi
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* CANDIDATE APPLICATION REVIEW MODAL                                        */}
      {/* ========================================================================= */}
      {selectedApplication && (
        <Modal
          isOpen={isAppDetailOpen}
          onClose={() => {
            setIsAppDetailOpen(false);
            setSelectedApplication(null);
          }}
          title="CHI TIẾT HỒ SƠ ỨNG VIÊN"
          description={`Hồ sơ ứng tuyển vị trí ${selectedApplication.job_title}`}
          maxWidth="4xl"
        >
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Candidate Information & CV */}
              <div className="space-y-4">
                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-[#0F172A] tracking-wider border-b border-[#E2E8F0] pb-2 flex items-center justify-between">
                    <span>Thông Tin Ứng Viên</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getAppStatusBadge(selectedApplication.status).bg}`}>
                      {getAppStatusBadge(selectedApplication.status).label}
                    </span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <div className="text-[10px] font-bold text-[#64748B] uppercase">Họ và tên</div>
                      <div className="font-bold text-[#0F172A] text-sm">{selectedApplication.full_name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#64748B] uppercase">Vị trí ứng tuyển</div>
                      <div className="font-bold text-[#0063FD]">{selectedApplication.job_title}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#64748B] uppercase">Số điện thoại</div>
                      <a href={`tel:${selectedApplication.phone}`} className="font-mono font-bold text-[#0F172A] hover:underline flex items-center gap-1">
                        <Phone className="h-3 w-3 text-[#64748B]" />
                        {selectedApplication.phone}
                      </a>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#64748B] uppercase">Email liên hệ</div>
                      <a href={`mailto:${selectedApplication.email}`} className="font-mono text-[#0F172A] hover:underline flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 text-[#64748B]" />
                        {selectedApplication.email}
                      </a>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#64748B] uppercase">Ngày nộp hồ sơ</div>
                      <div className="text-[#475569]">
                        {new Date(selectedApplication.created_at).toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#64748B] uppercase">Kinh nghiệm khai báo</div>
                      <div className="text-[#0F172A] font-semibold">{selectedApplication.experience || "Chưa có thông tin"}</div>
                    </div>
                  </div>

                  {selectedApplication.introduction && (
                    <div className="pt-2 border-t border-[#E2E8F0]">
                      <div className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Giới thiệu bản thân & nguyện vọng</div>
                      <p className="text-xs text-[#334155] leading-relaxed bg-white p-2.5 rounded-lg border border-[#CBD5E1] whitespace-pre-line">
                        {selectedApplication.introduction}
                      </p>
                    </div>
                  )}
                </div>

                {/* PDF Resume Attachment Viewer Box */}
                <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF]/60 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0063FD] text-white shadow-xs">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-[#0F172A] text-xs truncate">
                          {selectedApplication.resume_filename || "CV_UngVien.pdf"}
                        </div>
                        <div className="text-[10px] text-[#64748B] font-mono">
                          {formatAppFileSize(selectedApplication.resume_file_size)} • File đính kèm PDF
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={selectedApplication.resume_url}
                        download={selectedApplication.resume_filename || "CV_UngVien.pdf"}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-bold text-[#334155] hover:bg-[#F8FAFC] shadow-2xs transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Tải CV</span>
                      </a>

                      <a
                        href={selectedApplication.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-[#0063FD] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-600 shadow-xs transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Xem PDF</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Admin Review & Status Notes */}
              <div className="space-y-4 flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-[#0F172A] tracking-wider border-b border-[#E2E8F0] pb-2">
                    Đánh Giá & Trạng Thái Tuyển Dụng
                  </h4>

                  <div>
                    <label className="block font-bold text-[#1E293B] mb-1.5">
                      Trạng thái xử lý hồ sơ:
                    </label>
                    <select
                      value={editingAppStatus}
                      onChange={(e) => setEditingAppStatus(e.target.value as ApplicationStatus)}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-2.5 text-xs font-bold text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none"
                    >
                      <option value="pending">Chờ duyệt (Mới nộp)</option>
                      <option value="reviewed">Đã xem qua CV</option>
                      <option value="contacted">Đã liên hệ ứng viên</option>
                      <option value="interview">Hẹn phỏng vấn trực tiếp / online</option>
                      <option value="accepted">Trúng tuyển / Tiếp nhận thử việc</option>
                      <option value="rejected">Chưa phù hợp / Từ chối</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1E293B] mb-1.5">
                      Ghi chú nội bộ tuyển dụng:
                    </label>
                    <textarea
                      rows={5}
                      value={editingAppNotes}
                      onChange={(e) => setEditingAppNotes(e.target.value)}
                      placeholder="Ghi nhận đánh giá sau khi xem CV, kết quả liên hệ, lịch phỏng vấn hoặc lý do từ chối..."
                      className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:bg-white focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDeleteApplication(selectedApplication.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Xóa hồ sơ</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAppDetailOpen(false);
                        setSelectedApplication(null);
                      }}
                    >
                      Đóng
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      disabled={isUpdatingApp}
                      onClick={() =>
                        handleUpdateApplicationStatus(
                          selectedApplication.id,
                          editingAppStatus,
                          editingAppNotes
                        )
                      }
                      className="font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{isUpdatingApp ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* ORDER DETAILS & STATUS MODAL */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <Modal
          isOpen={isOrderDetailOpen}
          onClose={() => {
            setIsOrderDetailOpen(false);
            setSelectedOrder(null);
          }}
          title={`Chi Tiết Đơn Hàng: ${selectedOrder.order_code}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs text-[#334155]">
            {/* Header info bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#64748B] block">Mã đơn hàng</span>
                <span className="font-mono font-black text-sm text-[#0063FD]">{selectedOrder.order_code}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#64748B] block">Thời gian tạo</span>
                <span className="font-medium text-[#0F172A]">
                  {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString("vi-VN") : "Hôm nay"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#64748B] block">Phương thức thanh toán</span>
                <span className="font-semibold text-[#0F172A]">
                  {selectedOrder.payment_method === "sepay" ? "Chuyển khoản SePay" : selectedOrder.payment_method}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#64748B] block">Trạng thái thanh toán</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    selectedOrder.payment_status === "paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedOrder.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
            </div>

            {/* Customer & Shipping info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl border border-[#E2E8F0] bg-white">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-[#64748B] block">Thông tin người nhận</span>
                <div className="font-bold text-sm text-[#0F172A]">{selectedOrder.customer_name}</div>
                <div className="flex items-center gap-1.5 text-xs text-[#475569]">
                  <Phone className="h-3.5 w-3.5 text-[#0063FD]" />
                  <span className="font-mono font-bold">{selectedOrder.customer_phone}</span>
                </div>
                {selectedOrder.customer_email && (
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <Mail className="h-3.5 w-3.5 text-[#94A3B8]" />
                    <span>{selectedOrder.customer_email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-[#64748B] block">Địa chỉ giao hàng</span>
                <div className="text-xs text-[#0F172A] leading-relaxed">{selectedOrder.shipping_address}</div>
                <div className="text-xs text-[#64748B]">
                  {selectedOrder.shipping_district ? `${selectedOrder.shipping_district}, ` : ""}
                  {selectedOrder.shipping_city}
                </div>
                {selectedOrder.notes && (
                  <div className="text-[11px] text-[#B45309] bg-[#FEF3C7]/60 p-2 rounded border border-[#FDE68A] mt-2">
                    <span className="font-bold">Ghi chú:</span> {selectedOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Purchased Items Table */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-[#64748B] block">Danh sách linh kiện trong đơn</span>
              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[10px] font-black uppercase text-[#64748B] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="p-3">Sản phẩm</th>
                      <th className="p-3 text-center">Số lượng</th>
                      <th className="p-3 text-right">Đơn giá</th>
                      <th className="p-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {Array.isArray(selectedOrder.items || selectedOrder.order_items) &&
                    (selectedOrder.items || selectedOrder.order_items)!.length > 0 ? (
                      (selectedOrder.items || selectedOrder.order_items)!.map((it: CartItem, idx: number) => (
                        <tr key={idx} className="hover:bg-[#F8FAFC]">
                          <td className="p-3">
                            <div className="font-bold text-[#0F172A]">
                              {it.product?.name_vi || it.product?.name_en || `Sản phẩm #${it.product_id}`}
                            </div>
                            {it.product?.sku && (
                              <div className="text-[10px] font-mono text-[#94A3B8]">{it.product.sku}</div>
                            )}
                          </td>
                          <td className="p-3 text-center font-bold font-mono">{it.quantity}</td>
                          <td className="p-3 text-right font-mono text-[#475569]">
                            {new Intl.NumberFormat("vi-VN").format(it.unit_price_vnd)}₫
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-[#0F172A]">
                            {new Intl.NumberFormat("vi-VN").format(
                              it.total_price_vnd || it.unit_price_vnd * it.quantity
                            )}
                            ₫
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-[#94A3B8]">
                          Không có thông tin chi tiết các mục linh kiện.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-[#F8FAFC] border-t border-[#E2E8F0] font-medium">
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right text-[#64748B]">
                        Tạm tính:
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-[#0F172A]">
                        {new Intl.NumberFormat("vi-VN").format(selectedOrder.subtotal_vnd || selectedOrder.total_vnd)}₫
                      </td>
                    </tr>
                    {selectedOrder.shipping_fee_vnd ? (
                      <tr>
                        <td colSpan={3} className="p-2.5 text-right text-[#64748B]">
                          Phí vận chuyển:
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#0F172A]">
                          +{new Intl.NumberFormat("vi-VN").format(selectedOrder.shipping_fee_vnd)}₫
                        </td>
                      </tr>
                    ) : null}
                    {selectedOrder.discount_vnd ? (
                      <tr>
                        <td colSpan={3} className="p-2.5 text-right text-[#64748B]">
                          Giảm giá voucher:
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#15803D]">
                          -{new Intl.NumberFormat("vi-VN").format(selectedOrder.discount_vnd)}₫
                        </td>
                      </tr>
                    ) : null}
                    <tr className="border-t border-[#CBD5E1] bg-amber-50/50">
                      <td colSpan={3} className="p-3 text-right font-bold text-[#0F172A] uppercase text-xs">
                        Tổng thanh toán:
                      </td>
                      <td className="p-3 text-right font-mono font-black text-base text-[#B45309]">
                        {new Intl.NumberFormat("vi-VN").format(selectedOrder.total_vnd)}₫
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Quick Status Updater */}
            <div className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#64748B] block">
                  Trạng thái đơn hàng hiện tại
                </span>
                <span className="text-xs font-black text-[#0F172A] uppercase">{selectedOrder.status}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => {
                    handleUpdateOrderStatus(selectedOrder.id, "processing");
                    setSelectedOrder({ ...selectedOrder, status: "processing" });
                  }}
                  className="rounded-lg bg-[#FEF3C7] border border-[#FDE68A] px-3 py-1.5 text-xs font-bold text-[#B45309] hover:bg-[#FDE68A] transition-colors"
                >
                  Xử lý đơn
                </button>
                <button
                  onClick={() => {
                    handleUpdateOrderStatus(selectedOrder.id, "shipping");
                    setSelectedOrder({ ...selectedOrder, status: "shipping" });
                  }}
                  className="rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1.5 text-xs font-bold text-[#1D4ED8] hover:bg-[#BFDBFE] transition-colors"
                >
                  Giao hàng
                </button>
                <button
                  onClick={() => {
                    handleUpdateOrderStatus(selectedOrder.id, "completed");
                    setSelectedOrder({ ...selectedOrder, status: "completed" });
                  }}
                  className="rounded-lg bg-[#16A34A] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#15803D] transition-colors"
                >
                  Hoàn thành
                </button>
                <button
                  onClick={() => {
                    handleUpdateOrderStatus(selectedOrder.id, "cancelled");
                    setSelectedOrder({ ...selectedOrder, status: "cancelled" });
                  }}
                  className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  Hủy đơn
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOrderDetailOpen(false);
                  setSelectedOrder(null);
                }}
              >
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
