import { describe, it, expect } from "vitest";
import {
  autoCategorizeHardware,
  autoDetectBrand,
  generateAutoSku,
  getSampleCsvTemplate,
  parseCsvManifest,
  parseTaxInvoiceXml,
  parseScannedReceiptText,
} from "../documentImportService";

describe("documentImportService - Heuristic Inference", () => {
  it("correctly infers category from hardware keywords in Vietnamese and English", () => {
    expect(autoCategorizeHardware("Card màn hình ASUS TUF RTX 4070 Ti SUPER")).toBe("vga");
    expect(autoCategorizeHardware("Bộ vi xử lý Intel Core i7-14700K")).toBe("cpu");
    expect(autoCategorizeHardware("Mainboard MSI MAG B760 TOMAHAWK WIFI")).toBe("mainboard");
    expect(autoCategorizeHardware("RAM Kingston FURY Beast 32GB (2x16GB) DDR5")).toBe("ram");
    expect(autoCategorizeHardware("Ổ cứng SSD Samsung 990 PRO 1TB NVMe")).toBe("ssd");
    expect(autoCategorizeHardware("Nguồn máy tính Corsair RM850e 850W 80 Plus Gold")).toBe("psu");
    expect(autoCategorizeHardware("Vỏ case NZXT H5 Flow RGB White")).toBe("case");
    expect(autoCategorizeHardware("Tản nhiệt nước AIO DeepCool LT720 360mm")).toBe("cooling");
    expect(autoCategorizeHardware("Màn hình LG UltraGear 27GR95QE-B 27 inch OLED 240Hz")).toBe("monitor");
    expect(autoCategorizeHardware("Bàn phím cơ không dây AKKO 3098B Plus")).toBe("gear");
  });

  it("extracts leading hardware brand from product titles", () => {
    expect(autoDetectBrand("ASUS ROG Strix GeForce RTX 4080 Super")).toBe("ASUS");
    expect(autoDetectBrand("MSI MAG B760M MORTAR WIFI")).toBe("MSI");
    expect(autoDetectBrand("GIGABYTE RTX 4060 Eagle OC")).toBe("GIGABYTE");
    expect(autoDetectBrand("Intel Core i7-14700K")).toBe("Intel");
    expect(autoDetectBrand("AMD Ryzen 7 7800X3D")).toBe("AMD");
    expect(autoDetectBrand("Corsair Vengeance RGB 32GB DDR5")).toBe("Corsair");
    expect(autoDetectBrand("Samsung 990 PRO 2TB")).toBe("Samsung");
    expect(autoDetectBrand("Generic Custom Cable Comb")).toBe("Chính Hãng");
  });

  it("generates formatted SKU codes with category and brand prefixes", () => {
    const sku = generateAutoSku("Intel Core i7-14700K Box", "cpu", "Intel");
    expect(sku).toMatch(/^CPU-INT-[A-Z0-9]+-\d{4}$/);
  });
});

describe("documentImportService - CSV Template & Manifest Parsing", () => {
  it("generates a valid CSV template containing standard column headers and sample data", () => {
    const template = getSampleCsvTemplate();
    expect(template).toContain("Tên linh kiện,Mã SKU,Thương hiệu,Danh mục,Giá bán (VND),Tồn kho,Bảo hành (tháng),Tên tiếng Anh");
    expect(template).toContain("CPU Intel Core i5-14400F Box Chính Hãng");
    expect(template).toContain("cpu");
    expect(template).toContain("vga");
  });

  it("parses valid CSV text into structured import items", () => {
    const csvContent = `Tên linh kiện,Mã SKU,Thương hiệu,Danh mục,Giá bán (VND),Tồn kho,Bảo hành (tháng),Tên tiếng Anh
Card màn hình Gigabyte RTX 4060 Eagle OC,VGA-GIG-4060-EAGLE,GIGABYTE,vga,8590000,10,36,Gigabyte GeForce RTX 4060 Eagle OC
Bộ nhớ RAM Corsair Vengeance 32GB DDR5,RAM-COR-32G-DDR5,Corsair,ram,2850000,25,36,Corsair Vengeance 32GB DDR5`;

    const result = parseCsvManifest(csvContent);
    expect(result.totalParsed).toBe(2);
    expect(result.validCount).toBe(2);
    expect(result.items).toHaveLength(2);

    expect(result.items[0].name_vi).toBe("Card màn hình Gigabyte RTX 4060 Eagle OC");
    expect(result.items[0].brand).toBe("GIGABYTE");
    expect(result.items[0].category_slug).toBe("vga");
    expect(result.items[0].price_vnd).toBe(8590000);
    expect(result.items[0].stock).toBe(10);
    expect(result.items[0].sku).toBe("VGA-GIG-4060-EAGLE");
    expect(result.items[0].isValid).toBe(true);

    expect(result.items[1].name_vi).toBe("Bộ nhớ RAM Corsair Vengeance 32GB DDR5");
    expect(result.items[1].category_slug).toBe("ram");
    expect(result.items[1].stock).toBe(25);
    expect(result.items[1].isValid).toBe(true);
  });

  it("handles semicolon-separated CSVs and quoted strings", () => {
    const csvContent = `"Tên linh kiện";"Mã SKU";"Thương hiệu";"Danh mục";"Giá bán (VND)";"Tồn kho"
"Màn hình Gaming LG 27GP850-B 27 inch Nano IPS";"MON-LG-27GP850";"LG";"monitor";"7990000";"5"`;

    const result = parseCsvManifest(csvContent);
    expect(result.totalParsed).toBe(1);
    expect(result.items[0].name_vi).toBe("Màn hình Gaming LG 27GP850-B 27 inch Nano IPS");
    expect(result.items[0].price_vnd).toBe(7990000);
    expect(result.items[0].stock).toBe(5);
  });

  it("returns zero items when CSV is empty or only contains header", () => {
    const result = parseCsvManifest("");
    expect(result.totalParsed).toBe(0);
    expect(result.items).toHaveLength(0);
  });
});

describe("documentImportService - Circular 78 Invoice XML Parsing", () => {
  const sampleXml = `<?xml version="1.0" encoding="utf-8"?>
<HDon>
  <DLHDon>
    <TTChung>
      <KHDon>1C24TLL</KHDon>
      <SHDon>0008456</SHDon>
      <NLap>2026-09-20</NLap>
      <DVTTe>VND</DVTTe>
    </TTChung>
    <NDHDon>
      <NBan>
        <Ten>CONG TY TNHH PHAN PHOI CONG NGHE VIET NAM (SYNEX FPT)</Ten>
        <MST>0101234567</MST>
        <DChi>Toa nha FPT Cau Giay, Ha Noi</DChi>
      </NBan>
      <NMua>
        <Ten>CONG TY TNHH QMD-TECH VIET NAM</Ten>
        <MST>0109998888</MST>
      </NMua>
      <DSHHDVu>
        <HHDVu>
          <STT>1</STT>
          <THHVu>VGA ASUS TUF Gaming GeForce RTX 4070 Ti Super 16GB GDDR6X</THHVu>
          <DVTinh>Chiec</DVTinh>
          <SLuong>4</SLuong>
          <DGia>21500000</DGia>
          <Tien>86000000</Tien>
          <TSuat>10%</TSuat>
        </HHDVu>
        <HHDVu>
          <STT>2</STT>
          <THHVu>CPU Intel Core i7-14700K Box Chinh Hang</THHVu>
          <DVTinh>Hop</DVTinh>
          <SLuong>10</SLuong>
          <DGia>9800000</DGia>
          <Tien>98000000</Tien>
          <TSuat>10%</TSuat>
        </HHDVu>
      </DSHHDVu>
    </NDHDon>
  </DLHDon>
</HDon>`;

  it("extracts supplier metadata and line items conforming to Circular 78 schema", () => {
    const result = parseTaxInvoiceXml(sampleXml);
    expect(result.metadata?.supplierName).toContain("SYNEX FPT");
    expect(result.metadata?.supplierTaxId).toBe("0101234567");
    expect(result.metadata?.invoiceNumber).toBe("0008456");
    expect(result.items).toHaveLength(2);

    const vgaItem = result.items[0];
    expect(vgaItem.name_vi).toContain("VGA ASUS TUF Gaming");
    expect(vgaItem.category_slug).toBe("vga");
    expect(vgaItem.brand).toBe("ASUS");
    expect(vgaItem.stock).toBe(4);
    // 21,500,000 * 1.10 (VAT) = 23,650,000
    expect(vgaItem.price_vnd).toBe(23650000);
    expect(vgaItem.isValid).toBe(true);

    const cpuItem = result.items[1];
    expect(cpuItem.name_vi).toContain("CPU Intel Core i7-14700K");
    expect(cpuItem.category_slug).toBe("cpu");
    expect(cpuItem.brand).toBe("Intel");
    expect(cpuItem.stock).toBe(10);
    // 9,800,000 * 1.10 (VAT) = 10,780,000
    expect(cpuItem.price_vnd).toBe(10780000);
    expect(cpuItem.isValid).toBe(true);
  });

  it("handles malformed XML input gracefully without crashing", () => {
    const malformedXml = "Not a valid xml content <><>";
    const result = parseTaxInvoiceXml(malformedXml);
    expect(result.items).toHaveLength(0);
    expect(result.totalParsed).toBe(0);
  });
});

describe("documentImportService - Delivery Slip OCR Text Parsing", () => {
  const ocrRawText = `
CONG TY TNHH PHAN PHOI VIET HOANG
PHIEU GIAO HANG KIEM XUAT KHO
So: PGK-2026/0892
Ngay: 21/09/2026
Khach hang: QMD-Tech Store Cau Giay

1. Mainboard MSI MAG B760M MORTAR WIFI II - SL: 6 - Don gia: 3.850.000d
2. O cung SSD Samsung 990 EVO Plus 1TB PCIe 4.0 - SL: 15 - Gia: 2.150.000 VND
3. Nguon may tinh Corsair RM750e 750W 80 Plus Gold - SL: 8 - Gia: 2.650.000 d

Tong so mat hang: 3
Nguoi giao hang: Nguyen Van A
Nguoi nhan hang: Tran Van B
`;

  it("extracts item names, quantities, and prices from freeform OCR text", () => {
    const result = parseScannedReceiptText(ocrRawText);
    expect(result.items.length).toBeGreaterThanOrEqual(3);

    const msiItem = result.items.find((i) => i.name_vi.includes("B760M MORTAR"));
    expect(msiItem).toBeDefined();
    expect(msiItem?.category_slug).toBe("mainboard");
    expect(msiItem?.brand).toBe("MSI");
    expect(msiItem?.stock).toBe(6);
    expect(msiItem?.price_vnd).toBe(3850000);

    const ssdItem = result.items.find((i) => i.name_vi.includes("990 EVO"));
    expect(ssdItem).toBeDefined();
    expect(ssdItem?.category_slug).toBe("ssd");
    expect(ssdItem?.stock).toBe(15);
    expect(ssdItem?.price_vnd).toBe(2150000);

    const psuItem = result.items.find((i) => i.name_vi.includes("RM750e"));
    expect(psuItem).toBeDefined();
    expect(psuItem?.category_slug).toBe("psu");
    expect(psuItem?.stock).toBe(8);
  });

  it("ignores header metadata lines and signature lines that do not represent products", () => {
    const result = parseScannedReceiptText(ocrRawText);
    const names = result.items.map((i) => i.name_vi);
    expect(names.some((n) => n.includes("PHIEU GIAO HANG"))).toBe(false);
    expect(names.some((n) => n.includes("Nguoi nhan hang"))).toBe(false);
    expect(names.some((n) => n.includes("Tong so mat hang"))).toBe(false);
  });
});
