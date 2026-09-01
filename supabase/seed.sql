-- ========================================================================
-- QMD-Tech Seed Data: Categories, Products & Compatibility Rules
-- ========================================================================

-- Categories
INSERT INTO categories (id, slug, name_vi, name_en, icon, sort_order) VALUES
('c0000001-0000-0000-0000-000000000001', 'cpu', 'Bộ vi xử lý (CPU)', 'Processors (CPU)', 'Cpu', 1),
('c0000001-0000-0000-0000-000000000002', 'motherboard', 'Bo mạch chủ (Mainboard)', 'Motherboards', 'CircuitBoard', 2),
('c0000001-0000-0000-0000-000000000003', 'ram', 'Bộ nhớ RAM', 'Memory (RAM)', 'MemoryStick', 3),
('c0000001-0000-0000-0000-000000000004', 'gpu', 'Card đồ họa (VGA / GPU)', 'Graphics Cards (GPU)', 'Layers', 4),
('c0000001-0000-0000-0000-000000000005', 'storage', 'Ổ cứng (SSD / HDD)', 'Storage (SSD / HDD)', 'HardDrive', 5),
('c0000001-0000-0000-0000-000000000006', 'psu', 'Nguồn máy tính (PSU)', 'Power Supplies (PSU)', 'Zap', 6),
('c0000001-0000-0000-0000-000000000007', 'case', 'Vỏ máy tính (Case)', 'PC Cases', 'Box', 7),
('c0000001-0000-0000-0000-000000000008', 'cooling', 'Tản nhiệt (Cooler)', 'Cooling', 'Fan', 8)
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, sku, category_id, slug, name_vi, name_en, desc_vi, desc_en, price_vnd, original_price_vnd, price_usd, stock, brand, specs, images, is_featured) VALUES
-- CPUs
(
    'p0000001-0000-0000-0000-000000000001',
    'CPU-AMD-7800X3D',
    'c0000001-0000-0000-0000-000000000001',
    'amd-ryzen-7-7800x3d',
    'CPU AMD Ryzen 7 7800X3D (8C/16T, 4.2GHz up to 5.0GHz, 104MB Cache, AM5)',
    'AMD Ryzen 7 7800X3D Processor (8C/16T, 4.2GHz up to 5.0GHz, 104MB Cache, AM5)',
    'Bộ vi xử lý chơi game số 1 thế giới với công nghệ 3D V-Cache độc quyền, tiết kiệm điện năng vượt trội.',
    'The ultimate gaming processor featuring 3D V-Cache technology and incredible power efficiency.',
    10990000, 11890000, 449.00, 24, 'AMD',
    '{"socket": "AM5", "cores": 8, "threads": 16, "base_clock_ghz": 4.2, "boost_clock_ghz": 5.0, "tdp_watts": 120, "integrated_graphics": true, "ram_type": "DDR5"}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80'],
    true
),
(
    'p0000001-0000-0000-0000-000000000002',
    'CPU-INTEL-14700K',
    'c0000001-0000-0000-0000-000000000001',
    'intel-core-i7-14700k',
    'CPU Intel Core i7-14700K (20C/28T, up to 5.6GHz, 33MB Cache, LGA1700)',
    'Intel Core i7-14700K Processor (20C/28T, up to 5.6GHz, 33MB Cache, LGA1700)',
    'Sức mạnh đa nhân đột phá cho cả sáng tạo nội dung 4K/3D và trải nghiệm chơi game mượt mà.',
    'Breakthrough multi-core performance tailored for both 4K content creators and hardcore gamers.',
    10490000, 11290000, 429.00, 18, 'Intel',
    '{"socket": "LGA1700", "cores": 20, "threads": 28, "base_clock_ghz": 3.4, "boost_clock_ghz": 5.6, "tdp_watts": 253, "integrated_graphics": true, "ram_type": "DDR5"}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80'],
    true
),

-- Motherboards
(
    'p0000001-0000-0000-0000-000000000003',
    'MB-ASUS-B650-E',
    'c0000001-0000-0000-0000-000000000002',
    'asus-rog-strix-b650-e-gaming-wifi',
    'Mainboard ASUS ROG STRIX B650E-F GAMING WIFI (DDR5, AM5, ATX, PCIe 5.0)',
    'ASUS ROG STRIX B650E-F GAMING WIFI Motherboard (DDR5, AM5, ATX, PCIe 5.0)',
    'Bo mạch chủ gaming cao cấp hỗ trợ PCIe 5.0, hệ thống tản nhiệt VRM dày và Wi-Fi 6E siêu tốc.',
    'Premium gaming motherboard supporting PCIe 5.0, robust VRM thermal design, and high-speed Wi-Fi 6E.',
    7490000, 8190000, 299.00, 15, 'ASUS',
    '{"socket": "AM5", "chipset": "B650E", "form_factor": "ATX", "ram_slots": 4, "ram_type": "DDR5", "max_ram_gb": 192, "pcie_version": "5.0", "m2_slots": 3}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80'],
    true
),
(
    'p0000001-0000-0000-0000-000000000004',
    'MB-MSI-Z790-TOMAHAWK',
    'c0000001-0000-0000-0000-000000000002',
    'msi-mag-z790-tomahawk-wifi-ddr5',
    'Mainboard MSI MAG Z790 TOMAHAWK WIFI DDR5 (LGA1700, ATX)',
    'MSI MAG Z790 TOMAHAWK WIFI DDR5 Motherboard (LGA1700, ATX)',
    'Thiết kế đen tuyền mạnh mẽ, cấp nguồn VRM 16+1+1 Phase ổn định cho các dòng CPU Intel Core Gen 14.',
    'Stealth all-black military design with 16+1+1 phase VRM power deliver for Intel 14th Gen chips.',
    6990000, 7590000, 279.00, 12, 'MSI',
    '{"socket": "LGA1700", "chipset": "Z790", "form_factor": "ATX", "ram_slots": 4, "ram_type": "DDR5", "max_ram_gb": 192, "pcie_version": "5.0", "m2_slots": 4}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80'],
    false
),

-- RAM
(
    'p0000001-0000-0000-0000-000000000005',
    'RAM-CORSAIR-32G-6000',
    'c0000001-0000-0000-0000-000000000003',
    'corsair-vengeance-32gb-2x16gb-ddr5-6000mhz',
    'RAM Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz Black (CL30, Intel XMP/AMD EXPO)',
    'Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz Black (CL30, Intel XMP/AMD EXPO)',
    'Tốc độ cực cao, độ trễ thấp CL30 tối ưu hoàn hảo cho cả nền tảng AMD AM5 và Intel Gen 14.',
    'Ultra-fast DDR5 with low CL30 latency, precision engineered for AMD EXPO and Intel XMP profiles.',
    3290000, 3690000, 129.00, 35, 'Corsair',
    '{"ram_type": "DDR5", "capacity_gb": 32, "kit": "2x16GB", "speed_mhz": 6000, "timing": "CL30-36-36-76", "voltage": 1.35}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80'],
    true
),

-- GPUs
(
    'p0000001-0000-0000-0000-000000000006',
    'GPU-ASUS-4070TIS',
    'c0000001-0000-0000-0000-000000000004',
    'asus-tuf-gaming-geforce-rtx-4070-ti-super-16gb',
    'VGA ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB GDDR6X',
    'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB GDDR6X Graphics Card',
    'Hiệu năng đồ họa đỉnh cao với 16GB VRAM, DLSS 3.5, ray tracing thế hệ mới và khung nhôm chuẩn quân đội.',
    'Supreme 1440p/4K gaming performance with 16GB VRAM, DLSS 3.5, and military-grade TUF durability.',
    23990000, 25490000, 949.00, 10, 'ASUS',
    '{"chipset": "RTX 4070 Ti SUPER", "vram_gb": 16, "vram_type": "GDDR6X", "tdp_watts": 285, "length_mm": 305, "recommended_psu_watts": 750, "slots": 3.25}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80'],
    true
),

-- Storage
(
    'p0000001-0000-0000-0000-000000000007',
    'SSD-SAMSUNG-990PRO-2TB',
    'c0000001-0000-0000-0000-000000000005',
    'samsung-990-pro-2tb-pcie-gen-4-m2-nvme',
    'Ổ cứng SSD Samsung 990 Pro 2TB M.2 PCIe Gen4x4 NVMe (R/W 7450/6900 MB/s)',
    'Samsung 990 Pro 2TB M.2 PCIe Gen4x4 NVMe SSD (R/W 7450/6900 MB/s)',
    'Tốc độ đọc ghi tiệm cận giới hạn PCIe 4.0, độ bền vượt trội cho gaming và render video nặng.',
    'Blazing fast speeds reaching the limits of PCIe 4.0, rock-solid endurance for 4K rendering and gaming.',
    4590000, 4990000, 179.00, 40, 'Samsung',
    '{"form_factor": "M.2 2280", "interface": "PCIe Gen 4.0 x4", "capacity_gb": 2000, "read_speed_mb": 7450, "write_speed_mb": 6900, "tbw": 1200}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80'],
    false
),

-- PSU
(
    'p0000001-0000-0000-0000-000000000008',
    'PSU-CORSAIR-RM850X',
    'c0000001-0000-0000-0000-000000000006',
    'corsair-rm850x-shift-850w-80-plus-gold-atx-3-0',
    'Nguồn máy tính Corsair RM850x SHIFT 850W 80 Plus Gold - PCIe 5.0 (Full Modular)',
    'Corsair RM850x SHIFT 850W 80 Plus Gold Fully Modular Power Supply (ATX 3.0 / PCIe 5.0)',
    'Cổng cắm dây hông độc quyền SHIFT, chứng nhận 80 Plus Gold, chuẩn ATX 3.0 cho card RTX 40 series.',
    'Innovative side modular cable interface, 80 Plus Gold certified, ATX 3.0 ready with native 12VHPWR.',
    3790000, 4190000, 149.00, 20, 'Corsair',
    '{"wattage": 850, "efficiency": "80 Plus Gold", "modular": "Full Modular", "atx_version": "ATX 3.0", "pcie5_ready": true}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80'],
    true
),

-- Case
(
    'p0000001-0000-0000-0000-000000000009',
    'CASE-LIANLI-O11D-EVO',
    'c0000001-0000-0000-0000-000000000007',
    'lian-li-o11-dynamic-evo-rgb-black',
    'Vỏ Case Lian-Li O11 Dynamic EVO RGB Black (Kính cường lực / ATX / E-ATX)',
    'Lian Li O11 Dynamic EVO RGB Black Mid-Tower Case (Tempered Glass / ATX / E-ATX)',
    'Thiết kế 2 buồng kính không cột góc panorama, dải LED RGB sắc sảo và khả năng tối ưu luồng gió đỉnh cao.',
    'Iconic dual-chamber showcase case with seamless glass view, diffused RGB light strips and flexible airflow.',
    3990000, 4390000, 159.00, 16, 'Lian Li',
    '{"supported_motherboards": ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"], "max_gpu_length_mm": 455, "max_cpu_cooler_height_mm": 167, "radiator_support_mm": [360, 280, 240]}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80'],
    true
),

-- Cooler
(
    'p0000001-0000-0000-0000-000000000010',
    'COOLER-NZXT-KRAKEN-360',
    'c0000001-0000-0000-0000-000000000008',
    'nzxt-kraken-elite-360-rgb-black',
    'Tản nhiệt nước AIO NZXT Kraken Elite 360 RGB Black (Màn hình LCD 2.36")',
    'NZXT Kraken Elite 360 RGB Black AIO Liquid Cooler (2.36" LCD Display)',
    'Bơm Asetek Gen 7 siêu êm, màn hình LCD tùy biến ảnh GIF/thông số hệ thống và 3 quạt F120 RGB Core.',
    'Whisper-quiet Asetek Gen 7 pump, customizable 2.36" LCD screen, and 3x high-performance F120 RGB fans.',
    6990000, 7590000, 279.00, 14, 'NZXT',
    '{"radiator_size_mm": 360, "supported_sockets": ["AM5", "AM4", "LGA1700", "LGA1200", "LGA115x"], "tdp_cooling_capacity_watts": 350, "fan_rpm": "500-1800"}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80'],
    true
)
ON CONFLICT (id) DO NOTHING;
