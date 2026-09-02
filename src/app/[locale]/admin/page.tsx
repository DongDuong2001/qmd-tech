"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { adminService, CreateProductInput } from "@/modules/admin/service";
import { Product, Category, Order, Review } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Package,
  Layers,
  ShoppingBag,
  Star,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  Boxes,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "orders" | "reviews">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // New Product Form State
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

  // Specs helper string
  const [socketInput, setSocketInput] = useState("");
  const [ramTypeInput, setRamTypeInput] = useState("");
  const [tdpInput, setTdpInput] = useState("");
  const [vramInput, setVramInput] = useState("");

  // New Category Form State
  const [categoryForm, setCategoryForm] = useState({
    slug: "",
    name_vi: "",
    name_en: "",
    icon: "Cpu",
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [p, c, o, r] = await Promise.all([
        adminService.getProducts(),
        adminService.getCategories(),
        adminService.getOrders(),
        adminService.getReviews(),
      ]);
      setProducts(p);
      setCategories(c);
      setOrders(o);
      setReviews(r);
      if (c.length > 0 && !productForm.category_id) {
        setProductForm((prev) => ({ ...prev, category_id: c[0].id }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Failed to load admin data:", msg);
      setFeedbackMsg({ type: "error", text: "Lỗi tải dữ liệu: " + msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotification = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const specs: Record<string, unknown> = {};
      if (socketInput) specs.socket = socketInput;
      if (ramTypeInput) specs.ram_type = ramTypeInput;
      if (tdpInput) specs.tdp_watts = parseInt(tdpInput, 10);
      if (vramInput) specs.vram_gb = parseInt(vramInput, 10);

      const generatedSlug = productForm.slug || productForm.name_vi.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      await adminService.createProduct({
        ...productForm,
        slug: generatedSlug,
        specs,
      });

      showNotification("success", "Đã thêm sản phẩm mới vào cơ sở dữ liệu Supabase thành công!");
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
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi cơ sở dữ liệu?")) return;
    try {
      await adminService.deleteProduct(id);
      showNotification("success", "Đã xóa sản phẩm thành công!");
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi xóa sản phẩm: " + msg);
    }
  };

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

  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      showNotification("success", `Đã cập nhật trạng thái đơn hàng thành: ${status}`);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification("error", "Lỗi cập nhật đơn hàng: " + msg);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name_vi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders
    .filter((o) => o.status === "completed" || o.status === "processing" || o.status === "shipping")
    .reduce((sum, o) => sum + (o.total_vnd || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="inline-flex items-center text-xs font-semibold text-[#64748B] hover:text-[#E11D48] gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Quay lại cửa hàng
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#0F172A]">
            HỆ THỐNG QUẢN TRỊ ADMIN QMD-TECH
          </h1>
          <p className="text-xs text-[#64748B]">
            Quản lý trực tiếp dữ liệu sản phẩm, danh mục, đơn hàng & đánh giá kết nối Supabase Live Database
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddProductOpen(true)}
            variant="primary"
            size="sm"
            className="gap-1.5 font-bold text-xs shadow-xs"
          >
            <Plus className="h-4 w-4" /> Thêm Sản Phẩm Mới
          </Button>
          <Button
            onClick={() => setIsAddCategoryOpen(true)}
            variant="secondary"
            size="sm"
            className="gap-1.5 font-bold text-xs"
          >
            <Plus className="h-4 w-4" /> Thêm Danh Mục
          </Button>
        </div>
      </div>

      {/* Live Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`rounded-lg p-3 text-xs font-bold flex items-center gap-2 ${
            feedbackMsg.type === "success"
              ? "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
              : "bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]"
          }`}
        >
          {feedbackMsg.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {feedbackMsg.text}
        </div>
      )}

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-bold uppercase">Tổng Sản Phẩm</span>
            <Package className="h-5 w-5 text-[#E11D48]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#0F172A]">{products.length}</div>
          <div className="text-[10px] text-[#64748B] mt-1">Linh kiện đang quản lý</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-bold uppercase">Danh Mục</span>
            <Layers className="h-5 w-5 text-[#EA580C]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#0F172A]">{categories.length}</div>
          <div className="text-[10px] text-[#64748B] mt-1">Phân loại phần cứng</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-bold uppercase">Đơn Hàng</span>
            <ShoppingBag className="h-5 w-5 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#0F172A]">{orders.length}</div>
          <div className="text-[10px] text-[#64748B] mt-1">Đơn đặt từ khách hàng</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-bold uppercase">Doanh Thu Ước Tính</span>
            <DollarSign className="h-5 w-5 text-[#16A34A]" />
          </div>
          <div className="text-xl font-black font-mono text-[#16A34A]">
            {new Intl.NumberFormat("vi-VN").format(totalRevenue)}₫
          </div>
          <div className="text-[10px] text-[#64748B] mt-1">Từ đơn hàng hợp lệ</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-[#E2E8F0] flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "products"
              ? "border-[#E11D48] text-[#E11D48]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          📦 Sản phẩm ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "categories"
              ? "border-[#E11D48] text-[#E11D48]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          🏷️ Danh mục ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "orders"
              ? "border-[#E11D48] text-[#E11D48]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          📋 Đơn hàng ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "reviews"
              ? "border-[#E11D48] text-[#E11D48]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          ⭐ Đánh giá ({reviews.length})
        </button>
      </div>

      {/* Tab 1: Products */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên sản phẩm, mã SKU, hãng sản xuất..."
                className="w-full rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] py-2 pl-9 pr-4 text-xs text-[#0F172A] focus:border-[#E11D48] focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
            </div>
            <div className="text-xs text-[#64748B] font-semibold">
              Hiển thị {filteredProducts.length} / {products.length} sản phẩm
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-black uppercase text-[#475569]">
                <tr>
                  <th className="p-3">Sản phẩm</th>
                  <th className="p-3">Mã SKU</th>
                  <th className="p-3">Thương hiệu</th>
                  <th className="p-3">Giá bán</th>
                  <th className="p-3">Tồn kho</th>
                  <th className="p-3">Thông số</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#64748B]">
                      Đang tải dữ liệu từ Supabase...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-[#64748B]">
                      <Boxes className="mx-auto h-10 w-10 text-[#CBD5E1] mb-2" />
                      <p className="font-bold text-sm text-[#0F172A]">Chưa có sản phẩm nào trong cơ sở dữ liệu.</p>
                      <p className="text-xs text-[#64748B] mt-1">Bấm &ldquo;Thêm Sản Phẩm Mới&rdquo; để nhập linh kiện vào kho.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[#0F172A]">{product.name_vi}</div>
                        <div className="text-[10px] text-[#64748B]">{product.name_en}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#475569]">{product.sku}</td>
                      <td className="p-3">
                        <span className="rounded bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[10px] font-black text-[#1D4ED8]">
                          {product.brand}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-black text-[#B45309]">
                        {new Intl.NumberFormat("vi-VN").format(product.price_vnd)}₫
                      </td>
                      <td className="p-3">
                        <span className={`font-mono font-bold ${product.stock > 0 ? "text-[#15803D]" : "text-[#B91C1C]"}`}>
                          {product.stock} chiếc
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-[#475569]">
                        {product.specs?.socket && <span className="mr-1.5">{String(product.specs.socket)}</span>}
                        {product.specs?.ram_type && <span className="mr-1.5">{String(product.specs.ram_type)}</span>}
                        {product.specs?.tdp_watts && <span>{String(product.specs.tdp_watts)}W</span>}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="rounded p-1.5 text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                          title="Xóa sản phẩm"
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

      {/* Tab 2: Categories */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-xs"
              >
                <div>
                  <div className="text-sm font-black text-[#0F172A]">{cat.name_vi}</div>
                  <div className="text-[11px] font-mono text-[#64748B]">/{cat.slug}</div>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="rounded p-1 text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                  title="Xóa danh mục"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Orders */}
      {activeTab === "orders" && (
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-black uppercase text-[#475569]">
              <tr>
                <th className="p-3">Mã đơn</th>
                <th className="p-3">Khách hàng</th>
                <th className="p-3">Số điện thoại</th>
                <th className="p-3">Địa chỉ giao</th>
                <th className="p-3">Tổng tiền</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 text-right">Cập nhật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#64748B]">
                    Chưa có đơn hàng nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-3 font-mono font-bold text-[#0F172A]">{order.order_code}</td>
                    <td className="p-3 font-bold text-[#0F172A]">{order.customer_name}</td>
                    <td className="p-3 font-mono text-[#475569]">{order.customer_phone}</td>
                    <td className="p-3 text-[#64748B] max-w-xs truncate">{order.shipping_address}</td>
                    <td className="p-3 font-mono font-black text-[#B45309]">
                      {new Intl.NumberFormat("vi-VN").format(order.total_vnd)}₫
                    </td>
                    <td className="p-3">
                      <span className="rounded bg-[#FEF3C7] border border-[#FDE68A] px-2 py-0.5 text-[10px] font-bold text-[#B45309] uppercase">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "processing")}
                        className="rounded bg-[#DCFCE7] px-2 py-1 text-[10px] font-bold text-[#15803D] hover:bg-[#86EFAC]"
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "shipping")}
                        className="rounded bg-[#EFF6FF] px-2 py-1 text-[10px] font-bold text-[#1D4ED8] hover:bg-[#BFDBFE]"
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
      )}

      {/* Tab 4: Reviews */}
      {activeTab === "reviews" && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-8 text-center text-xs text-[#64748B]">
              Chưa có đánh giá nào từ người dùng.
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0F172A]">{rev.author_name}</span>
                    <span className="flex text-[#F59E0B]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] mt-1">{rev.comment}</p>
                </div>
                <button
                  onClick={async () => {
                    await adminService.deleteReview(rev.id);
                    loadAllData();
                  }}
                  className="rounded p-1 text-[#B91C1C] hover:bg-[#FEE2E2]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title="THÊM SẢN PHẨM MỚI VÀO CƠ SỞ DỮ LIỆU"
        description="Nhập thông tin sản phẩm và thông số kỹ thuật thực tế để bán trên website"
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

          {/* Technical Specs Inputs */}
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 space-y-2">
            <div className="font-black text-[#0F172A] uppercase text-[11px]">Thông số kỹ thuật tương thích PC Builder</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] text-[#64748B]">Socket (VD: LGA1700, AM5)</label>
                <input
                  type="text"
                  placeholder="LGA1700"
                  value={socketInput}
                  onChange={(e) => setSocketInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] p-1.5 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#64748B]">RAM Type (VD: DDR5, DDR4)</label>
                <input
                  type="text"
                  placeholder="DDR5"
                  value={ramTypeInput}
                  onChange={(e) => setRamTypeInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] p-1.5 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#64748B]">Công suất TDP (W)</label>
                <input
                  type="number"
                  placeholder="250"
                  value={tdpInput}
                  onChange={(e) => setTdpInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] p-1.5 text-xs text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#64748B]">VRAM (GB)</label>
                <input
                  type="number"
                  placeholder="16"
                  value={vramInput}
                  onChange={(e) => setVramInput(e.target.value)}
                  className="w-full rounded border border-[#CBD5E1] p-1.5 text-xs text-[#0F172A]"
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

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={productForm.is_featured}
                onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                className="h-4 w-4 rounded text-[#E11D48]"
              />
              <span className="font-bold text-[#0F172A]">Ghim sản phẩm nổi bật (Featured)</span>
            </label>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0]">
            <Button type="submit" variant="primary" size="md" className="w-full font-black uppercase">
              Lưu Sản Phẩm Vào Database Supabase
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Category Modal */}
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
            <label className="block font-bold text-[#475569] mb-1">Tên danh mục (Tiếng Anh)</label>
            <input
              type="text"
              placeholder="VD: Graphics Cards (VGA)"
              value={categoryForm.name_en}
              onChange={(e) => setCategoryForm({ ...categoryForm, name_en: e.target.value })}
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
            <Button type="submit" variant="primary" size="md" className="w-full font-black uppercase">
              Tạo Danh Mục
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
