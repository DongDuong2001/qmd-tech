-- ========================================================================
-- QMD-Tech: Category-Specific Product Specs Definitions Registry
-- Migration: 20260914_product_spec_definitions.sql
-- ========================================================================

CREATE TABLE IF NOT EXISTS product_spec_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_slug VARCHAR(50) NOT NULL,
    key VARCHAR(50) NOT NULL,
    label_vi VARCHAR(100) NOT NULL,
    label_en VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'select', 'array_string', 'array_number')),
    unit VARCHAR(20),
    options JSONB DEFAULT '[]'::jsonb,
    required BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    is_filterable BOOLEAN NOT NULL DEFAULT false,
    is_compatibility_key BOOLEAN NOT NULL DEFAULT false,
    validation JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_category_spec_key UNIQUE (category_slug, key)
);

CREATE INDEX IF NOT EXISTS idx_spec_defs_cat_order ON product_spec_definitions (category_slug, sort_order);
CREATE INDEX IF NOT EXISTS idx_spec_defs_filterable ON product_spec_definitions (category_slug, is_filterable);

-- Enable RLS
ALTER TABLE product_spec_definitions ENABLE ROW LEVEL SECURITY;

-- Policies: public read, authenticated admin manage
CREATE POLICY "Allow public read access on product_spec_definitions"
    ON product_spec_definitions FOR SELECT
    USING (true);

CREATE POLICY "Allow admin write access on product_spec_definitions"
    ON product_spec_definitions FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Seed Definitions for PC Hardware Categories
INSERT INTO product_spec_definitions (category_slug, key, label_vi, label_en, type, unit, options, required, sort_order, is_filterable, is_compatibility_key) VALUES
-- CPU
('cpu', 'socket', 'Socket CPU', 'CPU Socket', 'select', NULL, '["AM5", "AM4", "LGA1700", "LGA1851", "LGA1200"]'::jsonb, true, 1, true, true),
('cpu', 'cores', 'Số nhân xử lý', 'Cores', 'number', 'Nhân', '[]'::jsonb, true, 2, true, false),
('cpu', 'threads', 'Số luồng xử lý', 'Threads', 'number', 'Luồng', '[]'::jsonb, true, 3, true, false),
('cpu', 'base_clock_ghz', 'Xung nhịp cơ bản', 'Base Clock', 'number', 'GHz', '[]'::jsonb, true, 4, false, false),
('cpu', 'boost_clock_ghz', 'Xung nhịp tối đa', 'Boost Clock', 'number', 'GHz', '[]'::jsonb, true, 5, true, false),
('cpu', 'cache_mb', 'Bộ nhớ đệm Cache', 'Cache', 'number', 'MB', '[]'::jsonb, false, 6, false, false),
('cpu', 'tdp_watts', 'Công suất tiêu thụ (TDP)', 'TDP', 'number', 'W', '[]'::jsonb, true, 7, true, true),
('cpu', 'integrated_graphics', 'Đồ họa tích hợp (iGPU)', 'Integrated Graphics', 'boolean', NULL, '[]'::jsonb, false, 8, true, false),
('cpu', 'ram_type', 'Chuẩn RAM hỗ trợ', 'Supported Memory', 'select', NULL, '["DDR5", "DDR4", "DDR5/DDR4"]'::jsonb, true, 9, true, true),

-- VGA / GPU
('vga', 'chipset', 'Chipset đồ họa', 'GPU Chipset', 'string', NULL, '[]'::jsonb, true, 1, true, false),
('vga', 'vram_gb', 'Dung lượng VRAM', 'VRAM Capacity', 'number', 'GB', '[]'::jsonb, true, 2, true, false),
('vga', 'vram_type', 'Chuẩn bộ nhớ VRAM', 'VRAM Type', 'select', NULL, '["GDDR6X", "GDDR6", "GDDR7", "HBM3"]'::jsonb, false, 3, false, false),
('vga', 'bus_width_bit', 'Băng thông bộ nhớ', 'Memory Bus', 'number', 'bit', '[]'::jsonb, false, 4, false, false),
('vga', 'length_mm', 'Chiều dài card đồ họa', 'Card Length', 'number', 'mm', '[]'::jsonb, true, 5, false, true),
('vga', 'slots', 'Độ dày khe cắm PCIe', 'Slot Width', 'number', 'Slots', '[]'::jsonb, false, 6, false, false),
('vga', 'tdp_watts', 'Công suất tiêu thụ (TGP)', 'TGP', 'number', 'W', '[]'::jsonb, true, 7, true, true),
('vga', 'recommended_psu_watts', 'Công suất nguồn đề xuất', 'Recommended PSU', 'number', 'W', '[]'::jsonb, true, 8, true, false),
('vga', 'power_connectors', 'Cổng cấp nguồn phụ', 'Power Connectors', 'string', NULL, '[]'::jsonb, false, 9, false, false),

-- MAINBOARD
('mainboard', 'socket', 'Socket CPU hỗ trợ', 'Supported Socket', 'select', NULL, '["AM5", "AM4", "LGA1700", "LGA1851", "LGA1200"]'::jsonb, true, 1, true, true),
('mainboard', 'chipset', 'Chipset bo mạch chủ', 'Chipset', 'string', NULL, '[]'::jsonb, true, 2, true, false),
('mainboard', 'form_factor', 'Kích thước bo mạch (Form Factor)', 'Form Factor', 'select', NULL, '["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"]'::jsonb, true, 3, true, true),
('mainboard', 'ram_type', 'Chuẩn RAM tương thích', 'RAM Type', 'select', NULL, '["DDR5", "DDR4"]'::jsonb, true, 4, true, true),
('mainboard', 'ram_slots', 'Số khe cắm RAM', 'Memory Slots', 'number', 'Khe', '[]'::jsonb, true, 5, false, false),
('mainboard', 'max_ram_gb', 'Dung lượng RAM tối đa', 'Max Memory Capacity', 'number', 'GB', '[]'::jsonb, false, 6, false, false),
('mainboard', 'pcie_version', 'Phiên bản khe cắm PCIe', 'PCIe Version', 'select', NULL, '["5.0", "4.0", "3.0"]'::jsonb, false, 7, false, false),
('mainboard', 'm2_slots', 'Số khe cắm SSD M.2 NVMe', 'M.2 Slots', 'number', 'Khe', '[]'::jsonb, false, 8, false, false),

-- RAM
('ram', 'ram_type', 'Chuẩn thế hệ RAM', 'Memory Type', 'select', NULL, '["DDR5", "DDR4"]'::jsonb, true, 1, true, true),
('ram', 'capacity_gb', 'Dung lượng bộ nhớ', 'Total Capacity', 'number', 'GB', '[]'::jsonb, true, 2, true, false),
('ram', 'kit', 'Quy cách đóng gói', 'Kit Configuration', 'string', NULL, '[]'::jsonb, false, 3, false, false),
('ram', 'speed_mhz', 'Tốc độ Bus RAM', 'Memory Speed', 'number', 'MHz', '[]'::jsonb, true, 4, true, false),
('ram', 'timing', 'Độ trễ (Timing/CAS)', 'Latency Timing', 'string', NULL, '[]'::jsonb, false, 5, false, false),
('ram', 'voltage', 'Điện áp hoạt động', 'Operating Voltage', 'number', 'V', '[]'::jsonb, false, 6, false, false),
('ram', 'xmp_support', 'Hỗ trợ cấu hình ép xung XMP/EXPO', 'XMP/EXPO Support', 'boolean', NULL, '[]'::jsonb, false, 7, true, false),

-- SSD / STORAGE
('ssd', 'form_factor', 'Hệ số hình thức (Form Factor)', 'Form Factor', 'select', NULL, '["M.2 2280", "2.5 inch", "3.5 inch"]'::jsonb, true, 1, true, false),
('ssd', 'interface', 'Giao thức kết nối', 'Interface', 'string', NULL, '[]'::jsonb, true, 2, true, false),
('ssd', 'capacity_gb', 'Dung lượng lưu trữ', 'Capacity', 'number', 'GB', '[]'::jsonb, true, 3, true, false),
('ssd', 'read_speed_mb', 'Tốc độ đọc tuần tự', 'Sequential Read', 'number', 'MB/s', '[]'::jsonb, false, 4, false, false),
('ssd', 'write_speed_mb', 'Tốc độ ghi tuần tự', 'Sequential Write', 'number', 'MB/s', '[]'::jsonb, false, 5, false, false),
('ssd', 'tbw', 'Độ bền ghi dữ liệu (TBW)', 'Endurance (TBW)', 'number', 'TBW', '[]'::jsonb, false, 6, false, false),

-- PSU
('psu', 'wattage', 'Công suất thực định danh', 'Total Wattage', 'number', 'W', '[]'::jsonb, true, 1, true, true),
('psu', 'efficiency', 'Chứng nhận hiệu suất 80 Plus', '80 Plus Certification', 'select', NULL, '["80 Plus Bronze", "80 Plus Gold", "80 Plus Platinum", "80 Plus Titanium", "Standard"]'::jsonb, false, 2, true, false),
('psu', 'modular', 'Cơ chế cáp nguồn (Modular)', 'Cable Management', 'select', NULL, '["Full Modular", "Semi-Modular", "Non-Modular"]'::jsonb, false, 3, false, false),
('psu', 'atx_version', 'Tiêu chuẩn nguồn ATX', 'ATX Standard', 'string', NULL, '[]'::jsonb, false, 4, false, false),
('psu', 'pcie5_ready', 'Hỗ trợ cáp chuẩn PCIe 5.0 (12VHPWR)', 'PCIe 5.0 Ready', 'boolean', NULL, '[]'::jsonb, false, 5, true, false),

-- CASE
('case', 'supported_motherboards', 'Kích cỡ bo mạch chủ hỗ trợ', 'Motherboard Support', 'array_string', NULL, '[]'::jsonb, true, 1, true, true),
('case', 'max_gpu_length_mm', 'Chiều dài VGA tối đa', 'Max GPU Length', 'number', 'mm', '[]'::jsonb, true, 2, false, true),
('case', 'max_cpu_cooler_height_mm', 'Chiều cao tản nhiệt CPU tối đa', 'Max CPU Cooler Height', 'number', 'mm', '[]'::jsonb, true, 3, false, true),
('case', 'radiator_support_mm', 'Hỗ trợ két tản nhiệt nước', 'Radiator Support', 'array_number', 'mm', '[]'::jsonb, false, 4, false, true),
('case', 'form_factor', 'Phân loại kích cỡ case', 'Case Form Factor', 'string', NULL, '[]'::jsonb, false, 5, true, false),

-- COOLING
('cooling', 'radiator_size_mm', 'Kích thước két tản nhiệt nước', 'Radiator Size', 'number', 'mm', '[]'::jsonb, false, 1, true, true),
('cooling', 'supported_sockets', 'Danh sách Socket CPU hỗ trợ', 'Supported Sockets', 'array_string', NULL, '[]'::jsonb, true, 2, true, true),
('cooling', 'tdp_cooling_capacity_watts', 'Công suất giải nhiệt tối đa', 'Cooling Capacity', 'number', 'W', '[]'::jsonb, false, 3, false, false),
('cooling', 'fan_rpm', 'Tốc độ quạt tản nhiệt', 'Fan Speed', 'string', 'RPM', '[]'::jsonb, false, 4, false, false),
('cooling', 'height_mm', 'Chiều cao khối tản nhiệt khí', 'Cooler Height', 'number', 'mm', '[]'::jsonb, false, 5, false, true),
('cooling', 'cooler_type', 'Loại tản nhiệt', 'Cooler Type', 'select', NULL, '["Air Cooler", "AIO Liquid 240mm", "AIO Liquid 360mm", "Custom Watercooling"]'::jsonb, false, 6, true, false)
ON CONFLICT (category_slug, key) DO UPDATE SET
    label_vi = EXCLUDED.label_vi,
    label_en = EXCLUDED.label_en,
    type = EXCLUDED.type,
    unit = EXCLUDED.unit,
    options = EXCLUDED.options,
    required = EXCLUDED.required,
    sort_order = EXCLUDED.sort_order,
    is_filterable = EXCLUDED.is_filterable,
    is_compatibility_key = EXCLUDED.is_compatibility_key;
