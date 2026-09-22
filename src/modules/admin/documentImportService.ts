/**
 * Document & Bulk Product Import Service
 * Supports:
 * 1. Standard CSV / Excel Manifests
 * 2. Circular 78 General Department of Taxation e-Invoice XML
 * 3. Scanned Delivery Notes / Paper OCR Text
 */

import { slugifyVietnamese } from "@/shared/lib/sanitize";

export interface ImportProductItem {
  id?: string;
  name_vi: string;
  name_en?: string;
  sku: string;
  brand: string;
  category_slug: string;
  price_vnd: number;
  original_price_vnd?: number;
  stock: number;
  warranty_months: number;
  specs?: Record<string, unknown>;
  isValid: boolean;
  validationErrors: string[];
}

export interface TaxInvoiceMetadata {
  supplierName?: string;
  supplierTaxId?: string;
  invoiceNumber?: string;
  invoiceSeries?: string;
  invoiceDate?: string;
  totalBeforeTax?: number;
  totalTax?: number;
  totalAmount?: number;
}

export interface ParsedDocumentResult {
  items: ImportProductItem[];
  metadata?: TaxInvoiceMetadata;
  totalParsed: number;
  validCount: number;
  errorCount: number;
}

// ============================================================================
// HEURISTIC CATEGORY & BRAND RESOLVERS
// ============================================================================

export function autoCategorizeHardware(name: string): string {
  const text = (name || "").toLowerCase();

  if (/(intel|core\s*i[3579]|ultra\s*[579]|ryzen\s*[3579]|threadripper|xeon|vi\s*xử\s*lý|cpu)/i.test(text)) {
    return "cpu";
  }
  if (/(rtx|gtx|rx\s*\d{4}|radeon|geforce|card\s*màn\s*hinh|vga|graphics)/i.test(text)) {
    return "vga";
  }
  if (/(mainboard|motherboard|bo\s*mạch\s*chủ|b650|b760|z790|z890|b860|x870|x670|b550|h610|a620|am5|lga1700)/i.test(text)) {
    return "mainboard";
  }
  if (/(ddr4|ddr5|ram|memory|bus\s*\d{4}|cl\d{2}|bộ\s*nhớ\s*trong)/i.test(text)) {
    return "ram";
  }
  if (/(nvme|m\.2|pcie|ổ\s*cứng|ssd|hdd|sata|barracuda|kingston\s*nv)/i.test(text)) {
    return "ssd";
  }
  if (/(nguồn|psu|power\s*supply|bronze|gold|platinum|watt|\d{3,4}w)/i.test(text)) {
    return "psu";
  }
  if (/(vỏ\s*case|thùng\s*máy|chassis|h5\s*flow|h7\s*flow|h9\s*flow|4000d|5000d|case)/i.test(text)) {
    return "case";
  }
  if (/(tản\s*nhiệt|tản\s*khí|tản\s*nước|cooler|cooling|aio\s*\d{3}|deepcool|thermalright|kraken)/i.test(text)) {
    return "cooling";
  }
  if (/(màn\s*hình|monitor|ips|oled|gaming\s*monitor|\d{2}inch)/i.test(text)) {
    return "monitor";
  }
  return "gear";
}

export function autoDetectBrand(name: string): string {
  const text = (name || "").toLowerCase();
  const brands = [
    { key: "asus", name: "ASUS" },
    { key: "msi", name: "MSI" },
    { key: "gigabyte", name: "GIGABYTE" },
    { key: "intel", name: "Intel" },
    { key: "amd", name: "AMD" },
    { key: "corsair", name: "Corsair" },
    { key: "samsung", name: "Samsung" },
    { key: "kingston", name: "Kingston" },
    { key: "nzxt", name: "NZXT" },
    { key: "western digital", name: "Western Digital" },
    { key: "wd", name: "Western Digital" },
    { key: "seagate", name: "Seagate" },
    { key: "deepcool", name: "DeepCool" },
    { key: "thermalright", name: "Thermalright" },
    { key: "lian li", name: "Lian Li" },
    { key: "viewsonic", name: "ViewSonic" },
    { key: "lg", name: "LG" },
    { key: "dell", name: "Dell" },
    { key: "logitech", name: "Logitech" },
    { key: "razer", name: "Razer" },
  ];

  for (const b of brands) {
    if (text.includes(b.key)) {
      return b.name;
    }
  }
  return "Chính Hãng";
}

export function generateAutoSku(name: string, category: string, brand: string): string {
  const catPrefix = (category || "GEN").toUpperCase().slice(0, 3);
  const brandPrefix = (brand || "OEM").toUpperCase().slice(0, 3);
  const cleanName = slugifyVietnamese(name || "product")
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 8);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${catPrefix}-${brandPrefix}-${cleanName}-${rand}`;
}

// ============================================================================
// 1. CSV MANIFEST PARSER
// ============================================================================

export function getSampleCsvTemplate(): string {
  return [
    "Tên linh kiện,Mã SKU,Thương hiệu,Danh mục,Giá bán (VND),Tồn kho,Bảo hành (tháng),Tên tiếng Anh",
    "CPU Intel Core i5-14400F Box Chính Hãng,CPU-INT-14400F,Intel,cpu,4950000,20,36,Intel Core i5-14400F Processor",
    "Card màn hình ASUS Dual GeForce RTX 4060 8GB,VGA-ASU-4060-DUAL,ASUS,vga,8690000,10,36,ASUS Dual GeForce RTX 4060 8GB",
    "RAM Kingston Fury Beast 16GB DDR5 5600MHz,RAM-KIN-16G-5600,Kingston,ram,1650000,30,36,Kingston Fury Beast 16GB DDR5 5600MHz",
    "Bo mạch chủ MSI B760M Gaming Plus WiFi,MB-MSI-B760M-WIFI,MSI,mainboard,3590000,15,36,MSI B760M Gaming Plus WiFi Motherboard",
  ].join("\n");
}

export function parseCsvManifest(csvText: string): ParsedDocumentResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return { items: [], totalParsed: 0, validCount: 0, errorCount: 0 };
  }

  // Detect delimiter: comma, semicolon, tab
  const headerLine = lines[0];
  let delimiter = ",";
  if (headerLine.includes(";") && !headerLine.includes(",")) delimiter = ";";
  if (headerLine.includes("\t") && !headerLine.includes(",")) delimiter = "\t";

  const rows = lines.slice(1);
  const items: ImportProductItem[] = [];
  const seenSkus = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    const rawLine = rows[i];
    // Split respecting possible simple quotes
    const cols = rawLine.split(delimiter).map((c) => c.replace(/^["']|["']$/g, "").trim());

    const name_vi = cols[0] || "";
    let sku = cols[1] || "";
    let brand = cols[2] || "";
    let category_slug = cols[3] || "";
    const priceRaw = cols[4] || "0";
    const stockRaw = cols[5] || "1";
    const warrantyRaw = cols[6] || "36";
    const name_en = cols[7] || name_vi;

    const validationErrors: string[] = [];

    if (!name_vi) {
      validationErrors.push("Thiếu tên sản phẩm (Cột 1)");
    }

    if (!category_slug) {
      category_slug = autoCategorizeHardware(name_vi);
    }

    if (!brand) {
      brand = autoDetectBrand(name_vi);
    }

    if (!sku) {
      sku = generateAutoSku(name_vi, category_slug, brand);
    } else {
      if (seenSkus.has(sku.toLowerCase())) {
        validationErrors.push(`Trùng mã SKU "${sku}" trong cùng file`);
      }
    }
    seenSkus.add(sku.toLowerCase());

    const price_vnd = parseInt(priceRaw.replace(/\D/g, ""), 10) || 0;
    if (price_vnd <= 0) {
      validationErrors.push("Đơn giá phải lớn hơn 0");
    }

    const stock = parseInt(stockRaw.replace(/\D/g, ""), 10) || 1;
    const warranty_months = parseInt(warrantyRaw.replace(/\D/g, ""), 10) || 36;

    items.push({
      name_vi,
      name_en,
      sku,
      brand,
      category_slug,
      price_vnd,
      stock,
      warranty_months,
      isValid: validationErrors.length === 0,
      validationErrors,
    });
  }

  const validCount = items.filter((i) => i.isValid).length;
  return {
    items,
    totalParsed: items.length,
    validCount,
    errorCount: items.length - validCount,
  };
}

// ============================================================================
// 2. CIRCULAR 78 E-INVOICE XML PARSER (TỔNG CỤC THUẾ VIỆT NAM)
// ============================================================================

export function parseTaxInvoiceXml(xmlString: string): ParsedDocumentResult {
  const metadata: TaxInvoiceMetadata = {};
  const items: ImportProductItem[] = [];

  try {
    // Basic browser / node DOMParser
    let doc: Document;
    if (typeof window !== "undefined" && window.DOMParser) {
      const parser = new DOMParser();
      doc = parser.parseFromString(xmlString, "text/xml");
    } else {
      // Fallback regex extraction for server side
      return parseTaxInvoiceXmlRegexFallback(xmlString);
    }

    // 1. Extract Supplier Metadata
    const sellerTag = doc.querySelector("NBan, Seller");
    if (sellerTag) {
      metadata.supplierName =
        sellerTag.querySelector("Ten, Name")?.textContent?.trim() || "";
      metadata.supplierTaxId =
        sellerTag.querySelector("MST, TaxCode")?.textContent?.trim() || "";
    }

    // 2. Extract Invoice Meta
    const ttChung = doc.querySelector("TTChung, GeneralInvoiceInfo");
    if (ttChung) {
      metadata.invoiceSeries =
        ttChung.querySelector("KHDon, Series")?.textContent?.trim() || "";
      metadata.invoiceNumber =
        ttChung.querySelector("SHDon, InvoiceNumber")?.textContent?.trim() || "";
      metadata.invoiceDate =
        ttChung.querySelector("NLap, IssueDate")?.textContent?.trim() || "";
    }

    // 3. Extract Line Items: <HHDVu>
    const lineItemNodes = doc.querySelectorAll("HHDVu, Item");
    const seenSkus = new Set<string>();

    lineItemNodes.forEach((node) => {
      const name =
        node.querySelector("THHVu, ItemName")?.textContent?.trim() ||
        node.querySelector("Ten, Name")?.textContent?.trim() ||
        "";

      if (!name) return;

      const qtyRaw =
        node.querySelector("SLuong, Quantity")?.textContent?.trim() || "1";
      const unitPriceRaw =
        node.querySelector("DGia, UnitPrice")?.textContent?.trim() || "0";
      const vatRaw =
        node.querySelector("TSuat, VatRate")?.textContent?.trim() || "10";

      const qty = Math.max(1, Math.round(parseFloat(qtyRaw) || 1));
      const unitPricePreTax = parseFloat(unitPriceRaw) || 0;

      // Handle VAT multiplier (usually 8% or 10%)
      const vatRateNum = parseFloat(vatRaw.replace("%", "")) || 10;
      const finalUnitPrice = Math.round(unitPricePreTax * (1 + vatRateNum / 100));

      const category_slug = autoCategorizeHardware(name);
      const brand = autoDetectBrand(name);
      let sku = generateAutoSku(name, category_slug, brand);

      if (seenSkus.has(sku)) {
        sku = `${sku}-${Math.floor(10 + Math.random() * 90)}`;
      }
      seenSkus.add(sku);

      const validationErrors: string[] = [];
      if (finalUnitPrice <= 0) {
        validationErrors.push("Đơn giá trong hóa đơn bằng 0");
      }

      items.push({
        name_vi: name,
        name_en: name,
        sku,
        brand,
        category_slug,
        price_vnd: finalUnitPrice,
        stock: qty,
        warranty_months: 36,
        isValid: validationErrors.length === 0,
        validationErrors,
      });
    });
  } catch (err) {
    console.warn("DOMParser failed, falling back to regex parser:", err);
    return parseTaxInvoiceXmlRegexFallback(xmlString);
  }

  const validCount = items.filter((i) => i.isValid).length;
  return {
    items,
    metadata,
    totalParsed: items.length,
    validCount,
    errorCount: items.length - validCount,
  };
}

function parseTaxInvoiceXmlRegexFallback(xml: string): ParsedDocumentResult {
  const metadata: TaxInvoiceMetadata = {};
  const items: ImportProductItem[] = [];

  // Extract seller
  const sellerMatch = xml.match(/<NBan[^>]*>([\s\S]*?)<\/NBan>/i);
  if (sellerMatch) {
    const tenMatch = sellerMatch[1].match(/<Ten[^>]*>([^<]+)<\/Ten>/i);
    const mstMatch = sellerMatch[1].match(/<MST[^>]*>([^<]+)<\/MST>/i);
    if (tenMatch) metadata.supplierName = tenMatch[1].trim();
    if (mstMatch) metadata.supplierTaxId = mstMatch[1].trim();
  }

  // Extract invoice num
  const shMatch = xml.match(/<SHDon[^>]*>([^<]+)<\/SHDon>/i);
  if (shMatch) metadata.invoiceNumber = shMatch[1].trim();

  // Extract each HHDVu item
  const itemRegex = /<HHDVu[^>]*>([\s\S]*?)<\/HHDVu>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const nameMatch = block.match(/<THHVu[^>]*>([^<]+)<\/THHVu>/i);
    if (!nameMatch) continue;

    const name = nameMatch[1].trim();
    const qtyMatch = block.match(/<SLuong[^>]*>([^<]+)<\/SLuong>/i);
    const priceMatch = block.match(/<DGia[^>]*>([^<]+)<\/DGia>/i);

    const qty = Math.max(1, Math.round(parseFloat(qtyMatch ? qtyMatch[1] : "1") || 1));
    const price = Math.round((parseFloat(priceMatch ? priceMatch[1] : "0") || 0) * 1.1);

    const category_slug = autoCategorizeHardware(name);
    const brand = autoDetectBrand(name);
    const sku = generateAutoSku(name, category_slug, brand);

    items.push({
      name_vi: name,
      name_en: name,
      sku,
      brand,
      category_slug,
      price_vnd: price,
      stock: qty,
      warranty_months: 36,
      isValid: price > 0,
      validationErrors: price <= 0 ? ["Đơn giá không hợp lệ"] : [],
    });
  }

  const validCount = items.filter((i) => i.isValid).length;
  return {
    items,
    metadata,
    totalParsed: items.length,
    validCount,
    errorCount: items.length - validCount,
  };
}

// ============================================================================
// 3. PAPER DELIVERY NOTE / OCR TEXT PARSER
// ============================================================================

export function parseScannedReceiptText(rawText: string): ParsedDocumentResult {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const items: ImportProductItem[] = [];
  const seenSkus = new Set<string>();

  for (const line of lines) {
    // Ignore pure summary or noise lines (e.g. "Tổng cộng", "Người nhận", "Ngày...")
    if (/(tổng\s*cộng|người\s*giao|người\s*nhận|ký\s*tên|hóa\s*đơn\s*bán\s*lẻ|phiếu\s*xuất)/i.test(line)) {
      continue;
    }

    // Pattern 1: [STT]. [Name] - [Qty] - [Price]
    // Example: "1. Card màn hình ASUS RTX 4060 8GB | SL: 5 | 8.650.000"
    // Example: "Intel Core i7-14700K Box - 2 - 10.900.000₫"
    const parsed = extractItemFromLine(line);
    if (!parsed) continue;

    const category_slug = autoCategorizeHardware(parsed.name);
    const brand = autoDetectBrand(parsed.name);
    let sku = generateAutoSku(parsed.name, category_slug, brand);

    if (seenSkus.has(sku)) {
      sku = `${sku}-${Math.floor(10 + Math.random() * 90)}`;
    }
    seenSkus.add(sku);

    const validationErrors: string[] = [];
    if (!parsed.name || parsed.name.length < 3) {
      validationErrors.push("Tên sản phẩm quá ngắn");
    }
    if (parsed.price <= 0) {
      validationErrors.push("Chưa nhận diện được giá tiền");
    }

    items.push({
      name_vi: parsed.name,
      name_en: parsed.name,
      sku,
      brand,
      category_slug,
      price_vnd: parsed.price,
      stock: parsed.quantity,
      warranty_months: 36,
      isValid: validationErrors.length === 0,
      validationErrors,
    });
  }

  const validCount = items.filter((i) => i.isValid).length;
  return {
    items,
    totalParsed: items.length,
    validCount,
    errorCount: items.length - validCount,
  };
}

function extractItemFromLine(line: string): { name: string; quantity: number; price: number } | null {
  // Strip leading numbering (e.g. "1.", "1/", "1 -")
  const cleaned = line.replace(/^\s*\d+[\.\)\/\-]\s*/, "");

  // Extract prices formatted like "8.650.000", "8,650,000", "8650000"
  const priceMatches = cleaned.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{3})?)\s*(?:đ|vnd|đồng)?/gi);
  let price = 0;
  if (priceMatches && priceMatches.length > 0) {
    const lastPrice = priceMatches[priceMatches.length - 1];
    price = parseInt(lastPrice.replace(/\D/g, ""), 10) || 0;
  }

  // Extract quantity (e.g. "SL: 5", "x5", "5 cái", "5 chiếc", "| 5 |")
  let quantity = 1;
  const qtyMatch = cleaned.match(/(?:sl[:\s]*|x|\b)(\d+)\s*(?:cái|chiếc|bộ|thanh|thùng)?(?:\s*\||\s*-|$)/i);
  if (qtyMatch) {
    const parsedQty = parseInt(qtyMatch[1], 10);
    if (parsedQty > 0 && parsedQty < 1000) {
      quantity = parsedQty;
    }
  }

  // Clean name by removing extracted quantity and price parts
  let name = cleaned;
  if (price > 0) {
    name = name.replace(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{3})?)\s*(?:đ|vnd|đồng)?/gi, "");
  }
  name = name.replace(/(?:sl[:\s]*|\bx\s*)\d+\s*(?:cái|chiếc|bộ|thanh)?/gi, "");
  name = name.replace(/[|\-–:]\s*$/g, "").trim();

  if (name.length < 3) return null;

  return { name, quantity, price };
}
