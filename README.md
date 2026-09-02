# QMD-Tech - He Thong Thuong Mai Dien Tu Linh Kien PC Gaming Chuyen Nghiep

He thong ban le linh kien may tinh va cong cu Custom PC Builder thong minh.
Du an duoc xay dung tren nen tang Next.js 16 (App Router), React 19, Tailwind CSS v4, ho tro da ngon ngu (next-intl vi/en), ket noi co so du lieu Supabase PostgreSQL, co che xac thuc bao mat HttpOnly Cookies, he thong gioi han luot truy cap (Rate Limiting) va giao dien quan tri Admin Dashboard rieng biet.

---

## 1. Cong Nghe Va Kien Truc Du An

- Framework: Next.js 16 (App Router) kem React 19
- Styling: Tailwind CSS v4 voi giao dien Light Theme, su dung mau don sac ro rang (true solid colors), khong su dung gradient
- Da ngon ngu (i18n): next-intl voi tien to ngon ngu bat buoc (`/vi` la mac dinh, `/en` la ngon ngu phu)
- Co so du lieu: Supabase (PostgreSQL) truy van truc tiep cac bang products, categories, orders, builds, reviews
- Xac thuc va bao mat:
  - 100% phien dang nhap duoc quan ly qua HttpOnly Cookies (chong tan cong danh cap token XSS)
  - Tinh nang Ghi nho dang nhap (Remember Me) voi thoi han 30 ngay
  - Bo loc gioi han tan suat truy cap (In-memory Sliding Window Rate Limiter) chong do quet mat khau (Brute-force)
  - Header bao mat HTTP: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- He thong Custom PC Builder: Thuat toan kiem tra tuong thich 6 tieu chi phan cung (Socket CPU/Mainboard, the he RAM DDR4/DDR5, cong suat nguon PSU, kich thuoc case va do dai VGA)
- Giao dien quan tri: Admin Dashboard rieng biet (tach biet khoi Header va Footer ban hang) tai duong dan `/[locale]/admin`
- Bo nhan dien thuong hieu: Su dung 100% logo vector chinh hang cua cac nha san xuat (ASUS, NVIDIA, Intel, AMD, MSI, GIGABYTE, Corsair, Samsung, Kingston, NZXT, Lian Li, Western Digital)

---

## 2. Cau Truc Thu Muc Du An

```
qmd-tech/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Kiem tra tu dong: lint, typecheck, test, build
│       └── release.yml               # Tu dong hoa phat hanh phien ban semantic
├── messages/
│   ├── vi.json                       # Tu dien tieng Viet (mac dinh)
│   └── en.json                       # Tu dien tieng Anh
├── public/
│   ├── brands/                       # Vector SVG chinh hang cua cac thuong hieu
│   ├── favicon.ico                   # Favicon website
│   └── qmdtech_logo.png              # Logo chinh thuc cua QMD-Tech (bo tron)
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── admin/page.tsx        # Giao dien Admin Console rieng biet
│   │   │   ├── build-pc/             # Cong cu tu rap PC
│   │   │   ├── danh-muc/             # Danh muc linh kien theo hang muc
│   │   │   ├── gio-hang/page.tsx     # Gio hang
│   │   │   ├── thanh-toan/page.tsx   # Dat hang va thanh toan
│   │   │   ├── tai-khoan/page.tsx    # Dang nhap, dang ky va trang ca nhan
│   │   │   ├── san-pham/[slug]/      # Chi tiet linh kien va thong so ky thuat
│   │   │   ├── bao-hanh/page.tsx     # Chinh sach bao hanh
│   │   │   ├── khuyen-mai/page.tsx   # Chuong trinh khuyen mai
│   │   │   ├── lien-he/page.tsx      # He thong showroom
│   │   │   ├── layout.tsx            # Layout chinh cho storefront
│   │   │   └── page.tsx              # Trang chu ban hang
│   │   ├── api/
│   │   │   ├── auth/                 # API login, register, session, logout (HttpOnly)
│   │   │   ├── builder/              # API luu va chia se cau hinh
│   │   │   ├── catalog/              # API truy van san pham
│   │   │   └── orders/               # API tao don hang
│   │   ├── icon.png                  # Tab icon cho trinh duyet
│   │   ├── apple-icon.png            # Icon cho thiet bi Apple
│   │   └── globals.css               # Cau hinh bien mau Tailwind v4
│   ├── components/
│   │   ├── builder/                  # Component Custom PC Builder
│   │   ├── common/                   # BrandLogos, LanguageSwitcher
│   │   ├── layout/                   # Header, Footer (tu an tren trang /admin)
│   │   ├── product/                  # ProductCard
│   │   └── ui/                       # Button, Badge, Card, Modal
│   ├── modules/                      # Domain services (admin, auth, catalog, cart, builder, orders, reviews, i18n)
│   ├── shared/
│   │   ├── db/                       # Supabase client connection
│   │   ├── security/                 # RateLimiter va cau hinh HttpOnly Cookies
│   │   └── types/                    # Domain models va TypeScript interfaces
│   └── middleware.ts                 # Dinh tuyen ngon ngu next-intl va HTTP Security Headers
├── CONTRIBUTING.md                   # Quy dinh dong gop va quy trinh lam viec noi bo
├── GIT_GUIDE.md                      # Huong dan chi tiet cach dung Git cho lap trinh vien moi
├── LICENSE                           # Giay phep ban quyen doc quyen QMD Tech (Proprietary)
├── SECURITY.md                       # Chinh sach bao mat va bao cao lo hong
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 3. Huong Dan Cai Dat Va Chay Du An Tai Local

### 3.1. Yeu cau he thong
- Node.js phien ban `22.x` tro len
- Trinh quan ly goi: `npm` (phien ban 10.x tro len) hoac `pnpm`
- Git da duoc cai dat tren may

### 3.2. Cac buoc cai dat

Buoc 1: Clone ma nguon va chuyen vao thu muc du an
```bash
git clone https://github.com/DongDuong2001/qmd-tech.git
cd qmd-tech
```

Buoc 2: Chuyen sang nhanh dang phat trien
```bash
git checkout feat/real-data-admin-auth
```

Buoc 3: Cai dat cac thu vien phu thuoc
```bash
npm install
```

Buoc 4: Cau hinh bien moi truong
Tao file `.env.local` tai thu muc goc cua du an va dien cac thong so ket noi Supabase do truong nhom cung cap:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
Luu y: Tuyet doi khong commit file `.env.local` len GitHub.

Buoc 5: Khoi dong server phat trien (Development Server)
```bash
npm run dev
```
Mo trinh duyet va truy cap: `http://localhost:3000`
He thong se tu dong chuyen huong den `http://localhost:3000/vi` (Tieng Viet) hoac `http://localhost:3000/en` (Tieng Anh).

---

## 4. Cac Lenh Kiem Tra Chat Luong Code

Truoc khi commit va day code len remote repository, bat buoc phai chay 4 lenh kiem tra sau:

```bash
# 1. Kiem tra cu phap va quy tac ma nguon (ESLint)
npm run lint

# 2. Kiem tra kieu du lieu tinh (TypeScript)
npm run typecheck

# 3. Chay toan bo bo kiem thu don vi (Vitest)
npm run test

# 4. Bien dich san pham (Next.js Build)
npm run build
```

Tat ca 4 lenh deu phai vuot qua voi ma thoat 0 (0 error, 0 warning).

---

## 5. Cac Tinh Nang Chinh Cua He Thong

### 5.1. Trang chu ban hang (Storefront)
- Thanh tien ich: showroom, hotline, tra cuu bao hanh, chuyen doi ngon ngu
- Thanh tim kiem linh kien thong minh
- Luoi bieu tuong 12 danh muc phan cung (CPU, VGA, Mainboard, RAM, SSD, Nguon, Case, Tan nhiet...)
- Banner khuyen mai Flash Sale kem dong ho dem nguoc
- Danh sach bo may PC Gaming rap san (Prebuilt Gaming Rigs)
- Luoi logo chinh hang cua 12 thuong hieu hang dau

### 5.2. Cong cu tu build PC (Custom PC Builder)
- Tinh toan cong suat dien tieu thu uoc tinh (Wattage Meter)
- Tu dong kiem tra tuong thich chan socket CPU va bo mach chu
- Kiem tra the he RAM va khe cam RAM
- Dua ra muc cong suat nguon PSU de xuat kem danh gia phan khuc cau hinh
- Luu va chia se cau hinh qua duong dan ngan
- Gui yeu cau bao gia va rap may ve he thong

### 5.3. Xac thuc bao mat (Authentication)
- Duong dan: `/[locale]/tai-khoan`
- Ho tro dang nhap, dang ky voi du lieu thuc luu tren Supabase Auth
- Luu phien dang nhap an toan qua HttpOnly Cookies, khong de lo token ra JavaScript
- Checkbox "Ghi nho dang nhap" cho phep luu phien 30 ngay
- Gioi han luot thu dang nhap (Rate Limit) ngan chan tan cong do mat khau

### 5.4. He thong quan tri rieng biet (Admin Dashboard)
- Duong dan: `/[locale]/admin`
- Giao dien Console rieng biet voi thanh Sidebar toi mau kieu Enterprise
- Tu dong an Header va Footer cua trang ban hang khi truy cap vao khu vuc admin
- Quan ly kho san pham: bang du lieu truc quan, loc theo hang, danh muc, ton kho, form them linh kien day du thong so PC Builder
- Quan ly danh muc: tao va xoa danh muc phan cung
- Quan ly don hang: xem thong tin khach dat, dia chi, tong tien va cap nhat trang thai 1-click (Xu ly, Giao hang, Hoan thanh)
- Kiem duyet danh gia cua khach hang
- Theo doi trang thai ket noi co so du lieu va he thong bao mat

---

## 6. Tai Lieu Huong Dan Va Quy Dinh Danh Cho Lap Trinh Vien

Vui long tham khao cac tai lieu chuyen biet duoi day truoc khi thuc hien bat ky thao tac nao tren ma nguon:

- Huong dan su dung Git tu co ban den nang cao: [GIT_GUIDE.md](file:///d:/d-tech/GIT_GUIDE.md)
- Quy dinh dong gop phat trien va quy trinh lam viec nhom: [CONTRIBUTING.md](file:///d:/d-tech/CONTRIBUTING.md)
- Chinh sach bao mat va quy trinh bao cao lo hong an toan thong tin: [SECURITY.md](file:///d:/d-tech/SECURITY.md)
- Giay phep ban quyen va dieu khoan su dung: [LICENSE](file:///d:/d-tech/LICENSE)

---

## 7. Giay Phep Ban Quyen (License)

Copyright (c) 2026 QMD Tech Corporation. All Rights Reserved.

Day la phan mem thuong mai doc quyen thuoc so huu cua QMD Tech. Toan bo ma nguon, kien truc he thong va thiet ke giao dien khong phai la ma nguon mo va khong duoc phep phat hanh, sao chep, sua doi hoac chia se ra ben ngoai khi chua co su dong y bang van ban.

Moi thac mac hoac yeu cau cap phep su dung, vui long lien he:
- Dai dien: Dong Duong
- Email: dongduong840@gmail.com
