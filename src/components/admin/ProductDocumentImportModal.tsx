"use client";

import React, { useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { createHugeIconComponent } from "@/components/ui/HugeIcon";
import {
  Upload01Icon,
  Invoice01Icon,
  Camera01Icon,
  Download01Icon,
  CheckmarkCircle02Icon,
  Alert02Icon,
  Delete02Icon,
  File01Icon,
  RefreshCwIcon,
} from "@hugeicons/core-free-icons";
import {
  ImportProductItem,
  TaxInvoiceMetadata,
  parseCsvManifest,
  parseTaxInvoiceXml,
  parseScannedReceiptText,
  getSampleCsvTemplate,
} from "@/modules/admin/documentImportService";
import { DEFAULT_HARDWARE_CATEGORIES } from "@/modules/admin/service";

const UploadIcon = createHugeIconComponent(Upload01Icon);
const InvoiceIcon = createHugeIconComponent(Invoice01Icon);
const CameraIcon = createHugeIconComponent(Camera01Icon);
const DownloadIcon = createHugeIconComponent(Download01Icon);
const CheckCircle2 = createHugeIconComponent(CheckmarkCircle02Icon);
const AlertTriangle = createHugeIconComponent(Alert02Icon);
const Trash2 = createHugeIconComponent(Delete02Icon);
const FileIcon = createHugeIconComponent(File01Icon);
const RefreshCw = createHugeIconComponent(RefreshCwIcon);

interface ProductDocumentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductDocumentImportModal({
  isOpen,
  onClose,
  onSuccess,
}: ProductDocumentImportModalProps) {
  const [activeTab, setActiveTab] = useState<"csv" | "xml" | "ocr">("csv");
  const [items, setItems] = useState<ImportProductItem[]>([]);
  const [invoiceMeta, setInvoiceMeta] = useState<TaxInvoiceMetadata | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [ocrRawText, setOcrRawText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Download CSV Sample Template
  const handleDownloadTemplate = () => {
    const templateContent = getSampleCsvTemplate();
    const blob = new Blob(["\uFEFF" + templateContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "qmd_mau_nhap_kho_linh_kien.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Handle File Upload (CSV or XML)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      if (activeTab === "csv" || file.name.endsWith(".csv") || file.name.endsWith(".tsv") || file.name.endsWith(".txt")) {
        const result = parseCsvManifest(content);
        setItems(result.items);
        setInvoiceMeta(null);
        setStatusMessage({
          type: "success",
          text: `Đã phân tích ${result.totalParsed} dòng từ bảng kê. ${result.validCount} hợp lệ, ${result.errorCount} cần kiểm tra.`,
        });
      } else if (activeTab === "xml" || file.name.endsWith(".xml")) {
        const result = parseTaxInvoiceXml(content);
        setItems(result.items);
        setInvoiceMeta(result.metadata || null);
        setStatusMessage({
          type: "success",
          text: `Đã đọc hóa đơn điện tử (${result.metadata?.supplierName || "Nhà phân phối"}). Trích xuất được ${result.totalParsed} mặt hàng.`,
        });
      }
    };

    reader.readAsText(file);
  };

  // 3. Handle OCR / Text Input Parsing
  const handleParseOcrText = () => {
    if (!ocrRawText.trim()) {
      setStatusMessage({ type: "error", text: "Vui lòng nhập hoặc dán nội dung văn bản từ phiếu giao hàng." });
      return;
    }
    const result = parseScannedReceiptText(ocrRawText);
    setItems(result.items);
    setInvoiceMeta(null);
    setStatusMessage({
      type: "success",
      text: `Nhận diện được ${result.totalParsed} mặt hàng từ văn bản chứng từ.`,
    });
  };

  // 4. Fill Demo OCR Sample
  const handleFillDemoOcr = () => {
    const sample = [
      "PHIẾU XUẤT KHO KIÊM BÀN GIAO HÀNG HÓA",
      "Đơn vị giao: CÔNG TY TNHH PHÂN PHỐI CÔNG NGHỆ SPC",
      "1. CPU Intel Core i7-14700K Box Chính Hãng | SL: 10 | Đơn giá: 10.490.000₫",
      "2. Card màn hình ASUS TUF Gaming RTX 4070 Super 12GB | SL: 5 | Đơn giá: 17.890.000₫",
      "3. Bo mạch chủ GIGABYTE B760M AORUS ELITE AX | SL: 8 | Đơn giá: 3.850.000₫",
      "4. RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz | SL: 12 | Đơn giá: 2.990.000₫",
      "5. Ổ cứng SSD Samsung 990 Pro 1TB NVMe Gen 4 | SL: 15 | Đơn giá: 2.650.000₫",
      "Tổng cộng tiền hàng: 278.450.000₫",
    ].join("\n");

    setOcrRawText(sample);
  };

  // 5. Update Row Field Inline
  const handleUpdateItem = (index: number, field: keyof ImportProductItem, value: unknown) => {
    setItems((prev) => {
      const next = [...prev];
      const target = { ...next[index], [field]: value };

      // Re-validate row
      const errors: string[] = [];
      if (!target.name_vi.trim()) errors.push("Thiếu tên sản phẩm");
      if (Number(target.price_vnd) <= 0) errors.push("Giá phải lớn hơn 0");
      if (Number(target.stock) < 0) errors.push("Tồn kho không hợp lệ");

      target.validationErrors = errors;
      target.isValid = errors.length === 0;
      next[index] = target;
      return next;
    });
  };

  // 6. Delete Row
  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 7. Submit Batch Import
  const handleConfirmImport = async () => {
    const validItems = items.filter((i) => i.isValid);
    if (validItems.length === 0) {
      setStatusMessage({ type: "error", text: "Không có linh kiện nào hợp lệ để nhập vào kho." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: validItems,
          sourceDoc: activeTab,
          supplierName: invoiceMeta?.supplierName,
          invoiceNumber: invoiceMeta?.invoiceNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Lỗi khi lưu trữ sản phẩm vào hệ thống.");
      }

      setStatusMessage({
        type: "success",
        text: `Nhập kho thành công ${data.count} linh kiện! Đang cập nhật lại kho hàng...`,
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validCount = items.filter((i) => i.isValid).length;
  const errorCount = items.length - validCount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="NHẬP KHO THEO CHỨNG TỪ & HÓA ĐƠN HÀNG LOẠT"
      description="Tự động bóc tách danh mục linh kiện từ File Excel, Hóa Đơn Điện Tử XML hoặc Ảnh Phiếu Nhập"
      maxWidth="4xl"
    >
      <div className="space-y-4 text-xs">
        {/* Method Selector Tabs */}
        <div className="flex rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1 gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("csv");
              setItems([]);
              setStatusMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "csv"
                ? "bg-[#0063FD] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-white"
            }`}
          >
            <UploadIcon className="h-4 w-4" />
            <span>1. File Excel / Bảng Kê CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("xml");
              setItems([]);
              setStatusMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "xml"
                ? "bg-[#0063FD] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-white"
            }`}
          >
            <InvoiceIcon className="h-4 w-4" />
            <span>2. Hóa Đơn Điện Tử XML</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("ocr");
              setItems([]);
              setStatusMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "ocr"
                ? "bg-[#0063FD] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-white"
            }`}
          >
            <CameraIcon className="h-4 w-4" />
            <span>3. Scan / Ảnh Phiếu Giấy (OCR)</span>
          </button>
        </div>

        {/* Tab 1: CSV / Excel Upload */}
        {activeTab === "csv" && (
          <div className="space-y-3 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
              <div>
                <h4 className="font-bold text-[#0F172A]">Tải Lên Bảng Kê Linh Kiện (.CSV / .TXT)</h4>
                <p className="text-[11px] text-[#64748B]">
                  Hỗ trợ định dạng chuẩn ngăn cách bởi dấu phẩy, dấu chấm phẩy hoặc tab.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#0063FD] bg-[#EFF6FF] px-3 py-1.5 text-xs font-bold text-[#0063FD] hover:bg-[#DBEAFE] transition-colors self-start sm:self-auto"
              >
                <DownloadIcon className="h-3.5 w-3.5" />
                Tải File Mẫu Chuẩn (.CSV)
              </button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#CBD5E1] hover:border-[#0063FD] rounded-xl p-6 text-center cursor-pointer bg-[#F8FAFC] transition-colors"
            >
              <FileIcon className="mx-auto h-8 w-8 text-[#0063FD] mb-2" />
              <p className="font-bold text-[#0F172A]">
                {fileName ? `Đã chọn file: ${fileName}` : "Bấm vào đây để chọn file bảng kê hoặc kéo thả file vào"}
              </p>
              <p className="text-[11px] text-[#94A3B8] mt-1">Hỗ trợ các định dạng .csv, .tsv, .txt dung lượng tối đa 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.tsv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Tab 2: XML e-Invoice */}
        {activeTab === "xml" && (
          <div className="space-y-3 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4">
            <div>
              <h4 className="font-bold text-[#0F172A]">Đọc File Hóa Đơn Điện Tử XML (Thông Tư 78 Tổng Cục Thuế)</h4>
              <p className="text-[11px] text-[#64748B]">
                Bóc tách tự động mã hóa đơn, thông tin nhà phân phối, danh mục hàng hóa và đơn giá đã kèm thuế VAT.
              </p>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#BFDBFE] hover:border-[#0063FD] rounded-xl p-6 text-center cursor-pointer bg-[#EFF6FF]/40 transition-colors"
            >
              <InvoiceIcon className="mx-auto h-8 w-8 text-[#0063FD] mb-2" />
              <p className="font-bold text-[#0F172A]">
                {fileName ? `Hóa đơn: ${fileName}` : "Bấm để chọn file .XML hóa đơn điện tử gốc của nhà phân phối"}
              </p>
              <p className="text-[11px] text-[#64748B] mt-1">Chuẩn XML Tổng cục Thuế (Viễn Sơn, Vĩnh Xuân, Thủy Linh, Synnex FPT...)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {invoiceMeta?.supplierName && (
              <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Nhà phân phối:</span>
                  <strong className="text-xs text-[#0F172A]">{invoiceMeta.supplierName}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Mã số thuế:</span>
                  <span className="font-mono font-bold text-xs text-[#0F172A]">{invoiceMeta.supplierTaxId || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Số hóa đơn / Ngày:</span>
                  <span className="font-mono text-xs text-[#0063FD] font-bold">
                    {invoiceMeta.invoiceNumber || "Chưa rõ"} ({invoiceMeta.invoiceDate || "Hôm nay"})
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: OCR / Paper Receipt Text */}
        {activeTab === "ocr" && (
          <div className="space-y-3 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#0F172A]">Quét Hoặc Dán Văn Bản Từ Phiếu Giao Hàng Giấy</h4>
                <p className="text-[11px] text-[#64748B]">
                  Hệ thống sử dụng biểu thức chính quy thông minh để tách tên linh kiện, số lượng và giá tiền.
                </p>
              </div>
              <button
                type="button"
                onClick={handleFillDemoOcr}
                className="text-[11px] font-bold text-[#0063FD] hover:underline"
              >
                Dán Mẫu Phiếu Thử Nghiệm
              </button>
            </div>

            <textarea
              rows={4}
              value={ocrRawText}
              onChange={(e) => setOcrRawText(e.target.value)}
              placeholder="Dán nội dung từ máy quét OCR hoặc văn bản danh sách linh kiện vào đây (mỗi linh kiện 1 dòng)..."
              className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 text-xs text-[#0F172A] focus:border-[#0063FD] focus:bg-white focus:outline-none font-mono"
            />

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleParseOcrText}
                variant="outline"
                size="sm"
                className="gap-1 text-xs font-bold border-[#CBD5E1]"
              >
                <RefreshCw className="h-3.5 w-3.5 text-[#0063FD]" />
                Phân Tích Dữ Liệu
              </Button>
            </div>
          </div>
        )}

        {/* Status Feedback Notification */}
        {statusMessage && (
          <div
            className={`rounded-xl border p-3 flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "border-[#86EFAC] bg-[#DCFCE7] text-[#15803D]"
                : "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            <span className="font-semibold">{statusMessage.text}</span>
          </div>
        )}

        {/* Unified Verification & Review Table */}
        {items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <span>Xem trước danh mục linh kiện:</span>
                <span className="rounded-full bg-[#EFF6FF] text-[#0063FD] px-2 py-0.5 font-mono text-[10px]">
                  Tổng {items.length} món
                </span>
                <span className="rounded-full bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 font-mono text-[10px]">
                  {validCount} hợp lệ
                </span>
                {errorCount > 0 && (
                  <span className="rounded-full bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 font-mono text-[10px]">
                    {errorCount} có lỗi
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#64748B]">Có thể chỉnh sửa trực tiếp các ô trước khi lưu</span>
            </div>

            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold z-10">
                  <tr>
                    <th className="py-2 px-2.5 w-16 text-center">Trạng Thái</th>
                    <th className="py-2 px-2.5 min-w-[220px]">Tên Linh Kiện</th>
                    <th className="py-2 px-2 w-28">Danh Mục</th>
                    <th className="py-2 px-2 w-24">Hãng</th>
                    <th className="py-2 px-2 w-28">Mã SKU</th>
                    <th className="py-2 px-2 w-28">Giá Bán (VNĐ)</th>
                    <th className="py-2 px-2 w-16 text-center">Tồn Kho</th>
                    <th className="py-2 px-2 w-16 text-center">BH (T)</th>
                    <th className="py-2 px-2 w-10 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {items.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-[#F8FAFC]/60 transition-colors ${
                        !item.isValid ? "bg-[#FEF2F2]/40" : ""
                      }`}
                    >
                      {/* Status */}
                      <td className="py-1.5 px-2 text-center">
                        {item.isValid ? (
                          <span className="inline-block rounded-full bg-[#DCFCE7] text-[#15803D] p-1" title="Hợp lệ">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span
                            className="inline-block rounded-full bg-[#FEE2E2] text-[#DC2626] p-1 cursor-help"
                            title={item.validationErrors.join(", ")}
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </td>

                      {/* Name */}
                      <td className="py-1.5 px-2">
                        <input
                          type="text"
                          value={item.name_vi}
                          onChange={(e) => handleUpdateItem(idx, "name_vi", e.target.value)}
                          className="w-full rounded border border-transparent hover:border-[#CBD5E1] focus:border-[#0063FD] px-1.5 py-1 text-xs text-[#0F172A] font-medium"
                        />
                      </td>

                      {/* Category */}
                      <td className="py-1.5 px-2">
                        <select
                          value={item.category_slug}
                          onChange={(e) => handleUpdateItem(idx, "category_slug", e.target.value)}
                          className="w-full rounded border border-[#E2E8F0] bg-white px-1.5 py-1 text-[11px] font-bold text-[#0063FD]"
                        >
                          {DEFAULT_HARDWARE_CATEGORIES.map((c) => (
                            <option key={c.slug} value={c.slug}>
                              {c.name_vi}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Brand */}
                      <td className="py-1.5 px-2">
                        <input
                          type="text"
                          value={item.brand}
                          onChange={(e) => handleUpdateItem(idx, "brand", e.target.value)}
                          className="w-full rounded border border-transparent hover:border-[#CBD5E1] focus:border-[#0063FD] px-1.5 py-1 text-xs text-[#0F172A]"
                        />
                      </td>

                      {/* SKU */}
                      <td className="py-1.5 px-2">
                        <input
                          type="text"
                          value={item.sku}
                          onChange={(e) => handleUpdateItem(idx, "sku", e.target.value.toUpperCase())}
                          className="w-full rounded border border-transparent hover:border-[#CBD5E1] focus:border-[#0063FD] px-1.5 py-1 text-xs font-mono text-[#0F172A]"
                        />
                      </td>

                      {/* Price */}
                      <td className="py-1.5 px-2">
                        <input
                          type="number"
                          value={item.price_vnd}
                          onChange={(e) => handleUpdateItem(idx, "price_vnd", Number(e.target.value))}
                          className="w-full rounded border border-transparent hover:border-[#CBD5E1] focus:border-[#0063FD] px-1.5 py-1 text-xs font-mono font-bold text-[#0063FD]"
                        />
                      </td>

                      {/* Stock */}
                      <td className="py-1.5 px-2 text-center">
                        <input
                          type="number"
                          value={item.stock}
                          onChange={(e) => handleUpdateItem(idx, "stock", Number(e.target.value))}
                          className="w-14 rounded border border-transparent hover:border-[#CBD5E1] focus:border-[#0063FD] px-1 py-1 text-xs font-mono text-center"
                        />
                      </td>

                      {/* Warranty */}
                      <td className="py-1.5 px-2 text-center">
                        <input
                          type="number"
                          value={item.warranty_months}
                          onChange={(e) => handleUpdateItem(idx, "warranty_months", Number(e.target.value))}
                          className="w-12 rounded border border-transparent hover:border-[#CBD5E1] focus:border-[#0063FD] px-1 py-1 text-xs font-mono text-center"
                        />
                      </td>

                      {/* Delete */}
                      <td className="py-1.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="rounded p-1 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEE2E2]"
                          title="Xóa dòng này"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
          <Button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            variant="outline"
            size="sm"
            className="text-xs font-bold"
          >
            Đóng
          </Button>

          <Button
            type="button"
            onClick={handleConfirmImport}
            disabled={validCount === 0 || isSubmitting}
            variant="primary"
            size="sm"
            className="gap-2 text-xs font-bold bg-[#0063FD] hover:bg-[#0052D4]"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Đang Lưu Vào Kho...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Xác Nhận Nhập {validCount} Linh Kiện Vào Kho</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
