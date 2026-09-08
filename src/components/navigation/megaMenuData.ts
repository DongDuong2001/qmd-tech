import {
  Cpu,
  Layers,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Zap,
  Box,
  Fan,
  Monitor,
  Gamepad2,
  Keyboard,
  Headphones,
  Mouse,
  Tv,
  Speaker,
  Package,
  Server,
  Activity,
  type LucideIcon,
} from "lucide-react";

export interface MegaSubItem {
  name: string;
  href: string;
  badge?: string;
  isHighlight?: boolean;
}

export interface MegaSubGroup {
  title: string;
  items: MegaSubItem[];
}

export interface MegaCategoryItem {
  id: string;
  slug: string;
  name: string;
  icon?: LucideIcon;
  iconName?: string;
  badge?: string;
  badgeColor?: "red" | "blue" | "green";
  allUrl: string;
  subGroups: MegaSubGroup[];
}

export const MEGA_MENU_ICONS: Record<string, LucideIcon> = {
  Layers,
  Cpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Zap,
  Box,
  Fan,
  Monitor,
  Gamepad2,
  Keyboard,
  Headphones,
  Mouse,
  Tv,
  Speaker,
  Package,
  Server,
  Activity,
};

export const AVAILABLE_ICON_NAMES = Object.keys(MEGA_MENU_ICONS);

export function resolveMegaCategoryIcon(iconNameOrIcon?: string | LucideIcon): LucideIcon {
  if (typeof iconNameOrIcon === "function") return iconNameOrIcon;
  if (typeof iconNameOrIcon === "string" && MEGA_MENU_ICONS[iconNameOrIcon]) {
    return MEGA_MENU_ICONS[iconNameOrIcon];
  }
  return Layers;
}

export const MEGA_MENU_CATEGORIES: MegaCategoryItem[] = [
  {
    id: "vga",
    slug: "vga",
    name: "VGA - Card Màn Hình",
    icon: Layers,
    iconName: "Layers",
    badge: "HOT",
    badgeColor: "red",
    allUrl: "/danh-muc/vga",
    subGroups: [
      {
        title: "NVIDIA GeForce RTX",
        items: [
          { name: "GeForce RTX 5090", href: "/danh-muc/vga?q=RTX+5090", badge: "NEW", isHighlight: true },
          { name: "GeForce RTX 5080", href: "/danh-muc/vga?q=RTX+5080", badge: "NEW", isHighlight: true },
          { name: "GeForce RTX 4090 24GB", href: "/danh-muc/vga?q=RTX+4090" },
          { name: "GeForce RTX 4080 Super", href: "/danh-muc/vga?q=RTX+4080+Super" },
          { name: "GeForce RTX 4070 Ti Super", href: "/danh-muc/vga?q=RTX+4070+Ti+Super" },
          { name: "GeForce RTX 4070 Super", href: "/danh-muc/vga?q=RTX+4070+Super" },
          { name: "GeForce RTX 4060 Ti", href: "/danh-muc/vga?q=RTX+4060+Ti" },
          { name: "GeForce RTX 4060 8GB", href: "/danh-muc/vga?q=RTX+4060" },
          { name: "GeForce RTX 3060 12GB", href: "/danh-muc/vga?q=RTX+3060" },
        ],
      },
      {
        title: "AMD Radeon RX",
        items: [
          { name: "Radeon RX 7900 XTX 24GB", href: "/danh-muc/vga?q=RX+7900+XTX", isHighlight: true },
          { name: "Radeon RX 7900 XT 20GB", href: "/danh-muc/vga?q=RX+7900+XT" },
          { name: "Radeon RX 7800 XT 16GB", href: "/danh-muc/vga?q=RX+7800+XT" },
          { name: "Radeon RX 7700 XT 12GB", href: "/danh-muc/vga?q=RX+7700+XT" },
          { name: "Radeon RX 7600 XT 16GB", href: "/danh-muc/vga?q=RX+7600+XT" },
          { name: "Radeon RX 6600 8GB", href: "/danh-muc/vga?q=RX+6600" },
        ],
      },
      {
        title: "Hãng Sản Xuất",
        items: [
          { name: "ASUS ROG / TUF Gaming", href: "/danh-muc/vga?brand=ASUS" },
          { name: "MSI Gaming X / Ventus", href: "/danh-muc/vga?brand=MSI" },
          { name: "GIGABYTE AORUS / Gaming", href: "/danh-muc/vga?brand=GIGABYTE" },
          { name: "Colorful iGame / Ultra W", href: "/danh-muc/vga?brand=Colorful" },
          { name: "GALAX / Zotac Gaming", href: "/danh-muc/vga?brand=GALAX" },
        ],
      },
      {
        title: "Phân Khúc Giá & VRAM",
        items: [
          { name: "Dưới 10 triệu (eSport FHD)", href: "/danh-muc/vga?maxPrice=10000000" },
          { name: "Từ 10 - 20 triệu (Gaming 2K)", href: "/danh-muc/vga?minPrice=10000000&maxPrice=20000000" },
          { name: "Từ 20 - 40 triệu (Gaming High-End)", href: "/danh-muc/vga?minPrice=20000000&maxPrice=40000000" },
          { name: "Trên 40 triệu (Ultra 4K & AI)", href: "/danh-muc/vga?minPrice=40000000" },
          { name: "VRAM 16GB - 24GB+", href: "/danh-muc/vga?q=16GB" },
        ],
      },
    ],
  },
  {
    id: "cpu",
    slug: "cpu",
    name: "CPU - Vi Xử Lý",
    icon: Cpu,
    iconName: "Cpu",
    badge: "HOT",
    badgeColor: "blue",
    allUrl: "/danh-muc/cpu",
    subGroups: [
      {
        title: "Intel Core Processors",
        items: [
          { name: "Core Ultra 9 / Ultra 7", href: "/danh-muc/cpu?q=Core+Ultra", badge: "NEW", isHighlight: true },
          { name: "Core i9-14900K / 14900KF", href: "/danh-muc/cpu?q=14900K" },
          { name: "Core i7-14700K / 14700KF", href: "/danh-muc/cpu?q=14700K" },
          { name: "Core i5-14600K / 14600KF", href: "/danh-muc/cpu?q=14600K" },
          { name: "Core i5-13400F / 12400F", href: "/danh-muc/cpu?q=12400F" },
          { name: "Core i3 Thế hệ 12/13/14", href: "/danh-muc/cpu?q=Core+i3" },
        ],
      },
      {
        title: "AMD Ryzen Processors",
        items: [
          { name: "Ryzen 7 9850X3D (V-Cache)", href: "/danh-muc/cpu?q=9850X3D", badge: "HOT", isHighlight: true },
          { name: "Ryzen 9 9950X / 9900X", href: "/danh-muc/cpu?q=9950X" },
          { name: "Ryzen 7 7800X3D Gaming", href: "/danh-muc/cpu?q=7800X3D", isHighlight: true },
          { name: "Ryzen 5 7600X / 7500F", href: "/danh-muc/cpu?q=7600" },
          { name: "Ryzen 7 5700X3D / 5700X", href: "/danh-muc/cpu?q=5700X" },
          { name: "Ryzen 5 5600 / 5600G", href: "/danh-muc/cpu?q=5600" },
        ],
      },
      {
        title: "Socket / Thế Hệ",
        items: [
          { name: "Socket LGA 1851 (Arrow Lake)", href: "/danh-muc/cpu?q=1851" },
          { name: "Socket LGA 1700 (Intel Gen 12-14)", href: "/danh-muc/cpu?q=LGA1700" },
          { name: "Socket AM5 (Ryzen 7000/9000)", href: "/danh-muc/cpu?q=AM5" },
          { name: "Socket AM4 (Ryzen 3000/5000)", href: "/danh-muc/cpu?q=AM4" },
        ],
      },
      {
        title: "Mức Giá CPU",
        items: [
          { name: "Dưới 3 triệu (Văn phòng & eSport)", href: "/danh-muc/cpu?maxPrice=3000000" },
          { name: "Từ 3 - 7 triệu (Gaming tầm trung)", href: "/danh-muc/cpu?minPrice=3000000&maxPrice=7000000" },
          { name: "Từ 7 - 12 triệu (Gaming High-End)", href: "/danh-muc/cpu?minPrice=7000000&maxPrice=12000000" },
          { name: "Trên 12 triệu (Đồ họa & Render 3D)", href: "/danh-muc/cpu?minPrice=12000000" },
        ],
      },
    ],
  },
  {
    id: "mainboard",
    slug: "mainboard",
    name: "Bo Mạch Chủ (Mainboard)",
    icon: CircuitBoard,
    iconName: "CircuitBoard",
    allUrl: "/danh-muc/mainboard",
    subGroups: [
      {
        title: "Chipset Bo Mạch Intel",
        items: [
          { name: "Intel Z890 (LGA 1851)", href: "/danh-muc/mainboard?q=Z890", badge: "NEW" },
          { name: "Intel Z790 Cao Cấp", href: "/danh-muc/mainboard?q=Z790" },
          { name: "Intel B760 Phổ Thông", href: "/danh-muc/mainboard?q=B760" },
          { name: "Intel H610 Tiết Kiệm", href: "/danh-muc/mainboard?q=H610" },
        ],
      },
      {
        title: "Chipset Bo Mạch AMD",
        items: [
          { name: "AMD X870E / X870", href: "/danh-muc/mainboard?q=X870", badge: "NEW" },
          { name: "AMD X670E / X670", href: "/danh-muc/mainboard?q=X670" },
          { name: "AMD B650 / B650M", href: "/danh-muc/mainboard?q=B650", isHighlight: true },
          { name: "AMD A620 Giá Tốt", href: "/danh-muc/mainboard?q=A620" },
        ],
      },
      {
        title: "Hãng Sản Xuất",
        items: [
          { name: "ASUS ROG / TUF / Prime", href: "/danh-muc/mainboard?brand=ASUS" },
          { name: "MSI MAG Tomahawk / Mortar", href: "/danh-muc/mainboard?brand=MSI" },
          { name: "GIGABYTE AORUS / Gaming X", href: "/danh-muc/mainboard?brand=GIGABYTE" },
          { name: "ASRock Taichi / Steel Legend", href: "/danh-muc/mainboard?brand=ASRock" },
        ],
      },
      {
        title: "Kích Thước Form Factor",
        items: [
          { name: "Chuẩn ATX (Full Size)", href: "/danh-muc/mainboard?q=ATX" },
          { name: "Chuẩn Micro-ATX (M-ATX)", href: "/danh-muc/mainboard?q=MATX" },
          { name: "Chuẩn Mini-ITX (Nhỏ gọn)", href: "/danh-muc/mainboard?q=ITX" },
        ],
      },
    ],
  },
  {
    id: "ram",
    slug: "ram",
    name: "RAM - Bộ Nhớ Trong",
    icon: MemoryStick,
    iconName: "MemoryStick",
    allUrl: "/danh-muc/ram",
    subGroups: [
      {
        title: "Chuẩn & Thế Hệ RAM",
        items: [
          { name: "RAM DDR5 Mới Nhất", href: "/danh-muc/ram?q=DDR5", badge: "HOT", isHighlight: true },
          { name: "RAM DDR4 Thông Dụng", href: "/danh-muc/ram?q=DDR4" },
          { name: "RAM Laptop (SO-DIMM)", href: "/danh-muc/ram?q=SO-DIMM" },
        ],
      },
      {
        title: "Dung Lượng Bộ Nhớ",
        items: [
          { name: "Kit 16GB (2x8GB) Cơ bản", href: "/danh-muc/ram?q=16GB" },
          { name: "Kit 32GB (2x16GB) Gaming", href: "/danh-muc/ram?q=32GB", isHighlight: true },
          { name: "Kit 64GB (2x32GB) Đồ họa", href: "/danh-muc/ram?q=64GB" },
          { name: "Kit 128GB (4x32GB) Workstation", href: "/danh-muc/ram?q=128GB" },
        ],
      },
      {
        title: "Bus & Tốc Độ",
        items: [
          { name: "DDR5 6000MHz - 7200MHz", href: "/danh-muc/ram?q=6000MHz" },
          { name: "DDR5 5200MHz - 5600MHz", href: "/danh-muc/ram?q=5600MHz" },
          { name: "DDR4 3200MHz - 3600MHz", href: "/danh-muc/ram?q=3200MHz" },
        ],
      },
      {
        title: "Thương Hiệu Nổi Bật",
        items: [
          { name: "Corsair Vengeance / Dominator", href: "/danh-muc/ram?brand=Corsair" },
          { name: "Kingston Fury Beast / Renegade", href: "/danh-muc/ram?brand=Kingston" },
          { name: "G.Skill Trident Z5 RGB", href: "/danh-muc/ram?brand=G.Skill" },
          { name: "ADATA XPG Lancer", href: "/danh-muc/ram?brand=ADATA" },
        ],
      },
    ],
  },
  {
    id: "ssd",
    slug: "ssd",
    name: "Ổ Cứng SSD / HDD",
    icon: HardDrive,
    iconName: "HardDrive",
    allUrl: "/danh-muc/ssd",
    subGroups: [
      {
        title: "Chuẩn Kết Nối SSD",
        items: [
          { name: "SSD M.2 NVMe PCIe Gen 5", href: "/danh-muc/ssd?q=Gen5", badge: "NEW" },
          { name: "SSD M.2 NVMe PCIe Gen 4", href: "/danh-muc/ssd?q=Gen4", isHighlight: true },
          { name: "SSD M.2 NVMe PCIe Gen 3", href: "/danh-muc/ssd?q=Gen3" },
          { name: "SSD 2.5 inch SATA III", href: "/danh-muc/ssd?q=SATA" },
          { name: "Ổ Cứng HDD PC 3.5 inch", href: "/danh-muc/ssd?q=HDD" },
        ],
      },
      {
        title: "Dung Lượng Lưu Trữ",
        items: [
          { name: "SSD 500GB / 512GB", href: "/danh-muc/ssd?q=500GB" },
          { name: "SSD 1TB (1000GB)", href: "/danh-muc/ssd?q=1TB", isHighlight: true },
          { name: "SSD 2TB (2000GB)", href: "/danh-muc/ssd?q=2TB" },
          { name: "SSD 4TB Khủng", href: "/danh-muc/ssd?q=4TB" },
        ],
      },
      {
        title: "Thương Hiệu Ổ Cứng",
        items: [
          { name: "Samsung (990 Pro, 980 Pro)", href: "/danh-muc/ssd?brand=Samsung", isHighlight: true },
          { name: "Western Digital WD Black", href: "/danh-muc/ssd?brand=WD" },
          { name: "Kingston (KC3000, NV2)", href: "/danh-muc/ssd?brand=Kingston" },
          { name: "Crucial (T700, P3 Plus)", href: "/danh-muc/ssd?brand=Crucial" },
        ],
      },
      {
        title: "Mức Giá SSD",
        items: [
          { name: "Dưới 1 triệu (Cơ bản)", href: "/danh-muc/ssd?maxPrice=1000000" },
          { name: "Từ 1 - 2.5 triệu (Tốc độ cao)", href: "/danh-muc/ssd?minPrice=1000000&maxPrice=2500000" },
          { name: "Trên 2.5 triệu (Chuyên nghiệp)", href: "/danh-muc/ssd?minPrice=2500000" },
        ],
      },
    ],
  },
  {
    id: "psu",
    slug: "psu",
    name: "Nguồn Máy Tính (PSU)",
    icon: Zap,
    iconName: "Zap",
    allUrl: "/danh-muc/psu",
    subGroups: [
      {
        title: "Công Suất Nguồn",
        items: [
          { name: "550W - 650W (Cấu hình tầm trung)", href: "/danh-muc/psu?q=650W" },
          { name: "750W - 850W (RTX 4070 / 4080)", href: "/danh-muc/psu?q=850W", isHighlight: true },
          { name: "1000W - 1200W+ (RTX 4090 / 5090)", href: "/danh-muc/psu?q=1000W" },
        ],
      },
      {
        title: "Chuẩn Hiệu Suất",
        items: [
          { name: "80 Plus Bronze", href: "/danh-muc/psu?q=Bronze" },
          { name: "80 Plus Gold", href: "/danh-muc/psu?q=Gold", isHighlight: true },
          { name: "80 Plus Platinum / Titanium", href: "/danh-muc/psu?q=Platinum" },
        ],
      },
      {
        title: "Chuẩn Kết Nối & Cáp",
        items: [
          { name: "Chuẩn ATX 3.0 / PCIe 5.0 (Cáp 12VHPWR)", href: "/danh-muc/psu?q=ATX+3.0", badge: "HOT" },
          { name: "Full Modular (Tháo rời toàn bộ)", href: "/danh-muc/psu?q=Full+Modular" },
          { name: "Semi Modular / Non-Modular", href: "/danh-muc/psu?q=Modular" },
        ],
      },
      {
        title: "Thương Hiệu Nguồn",
        items: [
          { name: "Corsair (RMx, RMe, HX)", href: "/danh-muc/psu?brand=Corsair" },
          { name: "Seasonic (Focus, Prime)", href: "/danh-muc/psu?brand=Seasonic" },
          { name: "MSI (MAG, MPG)", href: "/danh-muc/psu?brand=MSI" },
          { name: "Deepcool / Cooler Master", href: "/danh-muc/psu?brand=Deepcool" },
        ],
      },
    ],
  },
  {
    id: "case",
    slug: "case",
    name: "Vỏ Case Máy Tính",
    icon: Box,
    iconName: "Box",
    allUrl: "/danh-muc/case",
    subGroups: [
      {
        title: "Kiểu Dáng Case",
        items: [
          { name: "Case Bể Cá Kính Vô Cực (270 độ)", href: "/danh-muc/case?q=Bể+cá", badge: "HOT", isHighlight: true },
          { name: "Case Mid-Tower Phổ Biến", href: "/danh-muc/case?q=Mid+Tower" },
          { name: "Case Mini-ITX Nhỏ Gọn", href: "/danh-muc/case?q=ITX" },
          { name: "Case Full-Tower Rộng Rãi", href: "/danh-muc/case?q=Full+Tower" },
        ],
      },
      {
        title: "Thương Hiệu Case",
        items: [
          { name: "Lian Li (O11 Dynamic, Vision)", href: "/danh-muc/case?brand=Lian+Li", isHighlight: true },
          { name: "NZXT (H9 Flow, H6 Flow, H5)", href: "/danh-muc/case?brand=NZXT" },
          { name: "Montech (King 95, Sky Two)", href: "/danh-muc/case?brand=Montech" },
          { name: "Xigmatek / Mik Giá Tốt", href: "/danh-muc/case?brand=Xigmatek" },
        ],
      },
      {
        title: "Màu Sắc & Kính",
        items: [
          { name: "Màu Trắng (Snow White)", href: "/danh-muc/case?q=White" },
          { name: "Màu Đen (Stealth Black)", href: "/danh-muc/case?q=Black" },
          { name: "Kính Cường Lực Nam Châm", href: "/danh-muc/case?q=Kính" },
        ],
      },
      {
        title: "Mức Giá Case",
        items: [
          { name: "Dưới 1 triệu (Tiết kiệm)", href: "/danh-muc/case?maxPrice=1000000" },
          { name: "Từ 1 - 2.5 triệu (Tầm trung)", href: "/danh-muc/case?minPrice=1000000&maxPrice=2500000" },
          { name: "Trên 2.5 triệu (Showcase cao cấp)", href: "/danh-muc/case?minPrice=2500000" },
        ],
      },
    ],
  },
  {
    id: "cooling",
    slug: "cooling",
    name: "Tản Nhiệt CPU & Fan",
    icon: Fan,
    iconName: "Fan",
    allUrl: "/danh-muc/cooling",
    subGroups: [
      {
        title: "Loại Tản Nhiệt",
        items: [
          { name: "Tản Nước AIO 360mm", href: "/danh-muc/cooling?q=360", badge: "HOT", isHighlight: true },
          { name: "Tản Nước AIO 240mm", href: "/danh-muc/cooling?q=240" },
          { name: "Tản Khí Tháp Đôi Dual-Tower", href: "/danh-muc/cooling?q=Dual" },
          { name: "Fan Case LED ARGB", href: "/danh-muc/cooling?q=Fan" },
        ],
      },
      {
        title: "Tính Năng Đặc Biệt",
        items: [
          { name: "AIO Có Màn Hình LCD Nhiệt Độ", href: "/danh-muc/cooling?q=LCD", badge: "NEW" },
          { name: "Fan Nam Châm Không Dây (Daisy-chain)", href: "/danh-muc/cooling?q=Link" },
          { name: "Đồng Bộ LED ARGB Aura Sync / Mystic", href: "/danh-muc/cooling?q=ARGB" },
        ],
      },
      {
        title: "Hãng Tản Nhiệt",
        items: [
          { name: "Thermalright (Hiệu năng / Giá cực tốt)", href: "/danh-muc/cooling?brand=Thermalright", isHighlight: true },
          { name: "Deepcool (LT720, AK620)", href: "/danh-muc/cooling?brand=Deepcool" },
          { name: "NZXT Kraken Elite", href: "/danh-muc/cooling?brand=NZXT" },
          { name: "Corsair iCUE LINK", href: "/danh-muc/cooling?brand=Corsair" },
        ],
      },
      {
        title: "Phân Khúc Giá",
        items: [
          { name: "Dưới 800k (Tản khí ngon bổ rẻ)", href: "/danh-muc/cooling?maxPrice=800000" },
          { name: "Từ 800k - 2 triệu (AIO 240 / Khí xịn)", href: "/danh-muc/cooling?minPrice=800000&maxPrice=2000000" },
          { name: "Trên 2 triệu (AIO 360 cao cấp)", href: "/danh-muc/cooling?minPrice=2000000" },
        ],
      },
    ],
  },
  {
    id: "prebuilt",
    slug: "vga",
    name: "PC QMD Ráp Sẵn",
    icon: Gamepad2,
    iconName: "Gamepad2",
    badge: "HOT",
    badgeColor: "red",
    allUrl: "/build-pc",
    subGroups: [
      {
        title: "Mục Đích Sử Dụng",
        items: [
          { name: "PC Gaming eSport (LOL, CS2, Valorant)", href: "/danh-muc?q=Gaming+Esport" },
          { name: "PC Gaming AAA 4K (Wukong, Cyberpunk)", href: "/danh-muc?q=Gaming+AAA", isHighlight: true },
          { name: "PC Thiết Kế Đồ Họa & Edit 4K", href: "/danh-muc?q=Design+PC" },
          { name: "PC AI & Deep Learning Workstation", href: "/danh-muc?q=Workstation" },
        ],
      },
      {
        title: "Phân Khúc Giá PC",
        items: [
          { name: "Dưới 15 triệu (Khởi điểm Gaming)", href: "/danh-muc?maxPrice=15000000" },
          { name: "Từ 15 - 25 triệu (Chiến mượt Full HD)", href: "/danh-muc?minPrice=15000000&maxPrice=25000000" },
          { name: "Từ 25 - 40 triệu (Gaming 2K cao cấp)", href: "/danh-muc?minPrice=25000000&maxPrice=40000000", isHighlight: true },
          { name: "Trên 40 triệu (High-End & Flagship)", href: "/danh-muc?minPrice=40000000" },
        ],
      },
      {
        title: "Cấu Hình Theo VGA",
        items: [
          { name: "PC RTX 4060 / 4060 Ti", href: "/danh-muc?q=PC+RTX+4060" },
          { name: "PC RTX 4070 / 4070 Ti Super", href: "/danh-muc?q=PC+RTX+4070" },
          { name: "PC RTX 4080 / 4090", href: "/danh-muc?q=PC+RTX+4080" },
          { name: "Tự Chọn Linh Kiện Lắp Ráp", href: "/build-pc", badge: "HOT" },
        ],
      },
      {
        title: "Dịch Vụ Đi Kèm",
        items: [
          { name: "Lắp ráp & đi dây thẩm mỹ miễn phí", href: "/build-pc" },
          { name: "Cài đặt Windows & Test Full Load 24h", href: "/bao-hanh" },
          { name: "Giao hàng tận nơi hỏa tốc toàn quốc", href: "/lien-he" },
        ],
      },
    ],
  },
  {
    id: "monitor",
    slug: "monitor",
    name: "Màn Hình Gaming",
    icon: Monitor,
    iconName: "Monitor",
    allUrl: "/danh-muc/monitor",
    subGroups: [
      {
        title: "Tần Số Quét",
        items: [
          { name: "144Hz - 180Hz (Gaming Tiêu Chuẩn)", href: "/danh-muc/monitor?q=180Hz" },
          { name: "240Hz (Gaming eSport Đỉnh Cao)", href: "/danh-muc/monitor?q=240Hz", isHighlight: true },
          { name: "360Hz - 540Hz (Thi Đấu Chuyên Nghiệp)", href: "/danh-muc/monitor?q=360Hz", badge: "NEW" },
        ],
      },
      {
        title: "Độ Phân Giải & Tấm Nền",
        items: [
          { name: "Full HD (1920x1080) Tốc độ cao", href: "/danh-muc/monitor?q=FHD" },
          { name: "2K QHD (2560x1440) Cực nét", href: "/danh-muc/monitor?q=2K", isHighlight: true },
          { name: "4K UHD (3840x2160) Đồ họa", href: "/danh-muc/monitor?q=4K" },
          { name: "OLED / QD-OLED Màu sắc đỉnh cao", href: "/danh-muc/monitor?q=OLED" },
        ],
      },
      {
        title: "Kích Thước Màn Hình",
        items: [
          { name: "24 - 25 inch (eSport FPS)", href: "/danh-muc/monitor?q=24" },
          { name: "27 inch (Kích thước vàng)", href: "/danh-muc/monitor?q=27", isHighlight: true },
          { name: "32 - 34 inch (Cong UltraWide 21:9)", href: "/danh-muc/monitor?q=34" },
        ],
      },
      {
        title: "Thương Hiệu Màn Hình",
        items: [
          { name: "ASUS ROG / TUF Gaming", href: "/danh-muc/monitor?brand=ASUS" },
          { name: "Samsung Odyssey Gaming", href: "/danh-muc/monitor?brand=Samsung" },
          { name: "LG UltraGear Chính Hãng", href: "/danh-muc/monitor?brand=LG" },
          { name: "ViewSonic / AOC Gaming", href: "/danh-muc/monitor?brand=ViewSonic" },
        ],
      },
    ],
  },
  {
    id: "gear",
    slug: "gear",
    name: "Bàn Phím & Chuột Gear",
    icon: Keyboard,
    iconName: "Keyboard",
    allUrl: "/danh-muc/gear",
    subGroups: [
      {
        title: "Bàn Phím Cơ",
        items: [
          { name: "Bàn Phím Cơ Custom Cao Cấp", href: "/danh-muc/gear?q=Custom", badge: "HOT" },
          { name: "Bàn Phím Không Dây Wireless 3-Mode", href: "/danh-muc/gear?q=Wireless" },
          { name: "Switch Linear (Êm ái, mượt mà)", href: "/danh-muc/gear?q=Linear" },
          { name: "Switch Tactile (Gõ sướng tay)", href: "/danh-muc/gear?q=Tactile" },
        ],
      },
      {
        title: "Chuột Gaming",
        items: [
          { name: "Chuột Siêu Nhẹ (Dưới 50g)", href: "/danh-muc/gear?q=Superlight", isHighlight: true },
          { name: "Chuột Không Dây PAW3395", href: "/danh-muc/gear?q=PAW3395" },
          { name: "Polling Rate 4K / 8K Hz", href: "/danh-muc/gear?q=4K" },
          { name: "Lót Chuột Gaming Khổ Lớn", href: "/danh-muc/gear?q=Pad" },
        ],
      },
      {
        title: "Thương Hiệu Gear",
        items: [
          { name: "Logitech G (G Pro, G502)", href: "/danh-muc/gear?brand=Logitech" },
          { name: "Razer Gaming (Viper, DeathAdder)", href: "/danh-muc/gear?brand=Razer" },
          { name: "Aula / Akko Bàn Phím Cơ", href: "/danh-muc/gear?brand=Akko" },
          { name: "Corsair Gaming Gear", href: "/danh-muc/gear?brand=Corsair" },
        ],
      },
      {
        title: "Mức Giá Gear",
        items: [
          { name: "Dưới 500k (Sinh viên)", href: "/danh-muc/gear?maxPrice=500000" },
          { name: "Từ 500k - 1.5 triệu (Tầm trung)", href: "/danh-muc/gear?minPrice=500000&maxPrice=1500000" },
          { name: "Trên 1.5 triệu (Pro Player)", href: "/danh-muc/gear?minPrice=1500000" },
        ],
      },
    ],
  },
  {
    id: "audio",
    slug: "gear",
    name: "Tai Nghe & Ghế Gaming",
    icon: Headphones,
    iconName: "Headphones",
    allUrl: "/danh-muc/gear",
    subGroups: [
      {
        title: "Tai Nghe Gaming",
        items: [
          { name: "Tai Nghe Gaming Giả Lập 7.1", href: "/danh-muc/gear?q=7.1", isHighlight: true },
          { name: "Tai Nghe Không Dây Wireless 2.4GHz", href: "/danh-muc/gear?q=Tai+nghe+Wireless" },
          { name: "Tai Nghe In-Ear Chơi Game", href: "/danh-muc/gear?q=In-Ear" },
          { name: "Micro Thu Âm & Livestream", href: "/danh-muc/gear?q=Micro" },
        ],
      },
      {
        title: "Ghế Công Thái Học & Gaming",
        items: [
          { name: "Ghế Công Thái Học (Ergonomic)", href: "/danh-muc/gear?q=Ergonomic", badge: "HOT", isHighlight: true },
          { name: "Ghế Gaming Da PU Cao Cấp", href: "/danh-muc/gear?q=Ghế+Gaming" },
          { name: "Bàn Nâng Hạ Công Thái Học", href: "/danh-muc/gear?q=Bàn+nâng+hạ" },
        ],
      },
      {
        title: "Hãng Âm Thanh & Bàn Ghế",
        items: [
          { name: "HyperX (Cloud II, Cloud III)", href: "/danh-muc/gear?brand=HyperX" },
          { name: "Razer Gaming Audio", href: "/danh-muc/gear?brand=Razer" },
          { name: "Sihoo / Warrior Ghế", href: "/danh-muc/gear?brand=Sihoo" },
        ],
      },
      {
        title: "Tư Vấn Setup",
        items: [
          { name: "Combo Bàn Ghế & Gear Livestream", href: "/lien-he" },
          { name: "Trải nghiệm trực tiếp tại Showroom", href: "/lien-he" },
        ],
      },
    ],
  },
];

export const DEFAULT_MEGA_MENU_CATEGORIES = [...MEGA_MENU_CATEGORIES];
