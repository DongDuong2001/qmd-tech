# Chinh Sach Bao Mat Va Huong Dan An Toan Thong Tin - QMD Tech

Tai lieu nay quy dinh cac tieu chuan bao mat he thong, kien truc phong thu va quy trinh bao cao lo hong bao mat cua nen tang QMD Tech.

---

## 1. Chinh Sach Bao Cao Lo Hong (Responsible Disclosure Policy)

QMD Tech rat coi trong van de an toan thong tin cua khach hang va tinh toan ven cua he thong. Neu ban phat hien bat ky lo hong bao mat nao, vui long khong cong bo cong khai hoac khai thac gay ton hai den he thong.

Hay gui bao cao chi tiet ve dia chi email truc tiep:
- Nguoi tiep nhan: Dong Duong (QMD Tech Lead)
- Email lien he: dongduong840@gmail.com
- Thoi gian phan hoi: Trong vong 24 gio ke tu khi nhan duoc thong tin

Noi dung bao cao nen bao gom:
- Mo ta loai lo hong va muc do anh huong uoc tinh
- Cac buoc tai hien chi tiet (kem payload mau neu co)
- Anh huong du kien doi voi du lieu nguoi dung hoac he thong
- Giai phap hoac khuyen nghi khac phuc (neu co)

QMD Tech cam ket se xac minh, danh gia va tien hanh sua loi trong thoi gian som nhat.

---

## 2. Kien Truc Bao Mat He Thong

Nen tang QMD Tech duoc trang bi nhieu lop bao ve tu tang mang, tang ung dung den tang co so du lieu:

### 2.1. Quan ly phien dang nhap bang HttpOnly Cookies
- Khong luu tru access token hoac refresh token trong `localStorage` hay `sessionStorage` o phia trinh duyet.
- Tat ca token xac thuc duoc cap phat va luu tru thong qua HttpOnly Cookies:
  - `httpOnly: true`: Trinh duyet chan hoan toan ma JavaScript phia client doc cookie, ngan chan triet de nguy co danh cap phien dang nhap thong qua cac cuoc tan cong Cross-Site Scripting (XSS).
  - `secure: true`: Bat buoc truyen tai qua giao thuc HTTPS da duoc ma hoa SSL/TLS tren moi truong production.
  - `sameSite: "lax"`: Chong tan cong gia mao yeu cau cheo trang Cross-Site Request Forgery (CSRF).
  - Thoi gian ton tai cookie duoc kiem soat dong: 30 ngay doi voi phien tick "Ghi nho dang nhap" va 24 gio doi voi phien thong thuong.

### 2.2. Co che phong thu do quet mat khau (Rate Limiting)
He thong ap dung bo loc gioi han tan suat truy cap Sliding Window dua tren dia chi IP tai cac endpoint xac thuc nhay cam:
- Endpoint Dang nhap (`/api/auth/login`): Gioi han toi da 5 yeu cau trong vong 60 giay cho moi IP. Neu vuot qua, he thong se tu choi yeu cau voi ma HTTP 429 Too Many Requests va yeu cau cho.
- Endpoint Dang ky (`/api/auth/register`): Gioi han toi da 3 lan tao tai khoan trong vong 10 phut cho moi IP de ngan chan thuat toan tao tai khoan rac tu dong.
- Co che thu hoi bo nho tu dong (periodic cleanup) giup giai phong IP tracker dinh ky moi 60 giay.

### 2.3. Tieu chuan Header bao mat HTTP
Moi phan hoi tu server deu duoc gan cac header bao mat tieu chuan thong qua Middleware:
- `X-Frame-Options: DENY`: Ngan chan trang web bi nhung vao iframe, chong tan cong Clickjacking.
- `X-Content-Type-Options: nosniff`: Ngan chan trinh duyet tu y doan MIME type cua tep tin, tranh thuc thi ma doc.
- `Referrer-Policy: strict-origin-when-cross-origin`: Bao ve thong tin referrer khi chuyen huong ngoai mien.
- `X-XSS-Protection: 1; mode=block`: Kich hoat bo loc XSS tich hop san cua trinh duyet.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`: Khoa quyen truy cap phan cung nhay cam cua thiet bi.

### 2.4. Bao mat co so du lieu va phan quyen (Supabase RLS)
- Co so du lieu PostgreSQL ap dung chinh sach Row-Level Security (RLS) tren tat ca cac bang: `products`, `categories`, `orders`, `order_items`, `builds`, `reviews`.
- Client chi duoc cap quyen thong qua Public Anon Key danh cho cac thao tac doc duoc phep.
- Cac thao tac them, sua, xoa nhay cam deu yeu cau xac thuc phan quyen admin.

---

## 3. Quy Tac An Toan Danh Cho Lap Trinh Vien

Tat ca thanh vien tham gia phat trien ma nguon tai QMD Tech phai tuan thu tuyet doi cac nguyen tac sau:

1. Khong bao gio commit cac file chua bi mat:
   - File `.env.local` chua URL va Anon Key cua Supabase phai luon nam trong `.gitignore`.
   - Khong hardcode API key, password, secret token truc tiep vao ma nguon.
2. Kiem tra tinh hop le cua du lieu dau vao:
   - Tat ca du lieu tu nguoi dung gui len deu phai duoc kiem tra dinh dang (regex email, so dien thoai Viet Nam hop le, do dai mat khau toi thieu 8 ky tu).
3. Luon kiem tra trang thai truoc khi commit:
   - Chay `git status` de kiem tra danh sach file.
   - Neu lo add file nhay cam, dung lenh `git restore --staged <ten_file>` ngay lap tuc.
