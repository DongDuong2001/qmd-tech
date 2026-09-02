# Quy Dinh Va Huong Dan Dong Gop Phat Trien - QMD Tech

Tai lieu nay danh cho cac lap trinh vien noi bo duoc moi tham gia vao du an he thong thuong mai dien tu QMD Tech.

---

## 1. Pham Vi Va Tinh Chat Du An

- QMD Tech la du an phan mem thuong mai doc quyen thuoc so huu cua QMD Tech Corporation.
- Ma nguon va he thong khong phai la du an ma nguon mo cong cong. Toan bo ma nguon, thiet ke giao dien, kien truc co so du lieu deu la tai san noi bo.
- Khong duoc phep sao chep, chia se ma nguon, deploy cong khai hoac chuyen giao cho bat ky ben thu ba nao ma khong co su dong y bang van ban tu nguoi quan ly du an.
- Moi yeu cau su dung, hop tac phat trien hoac cap phep phai duoc gui qua email: dongduong840@gmail.com

---

## 2. Quy Trinh Lam Viec Cua Doi Ngu Lap Trinh (Workflow)

### 2.1. Nhanh phat trien (Branching Strategy)
- Nhanh `main`: Danh rieng cho code phat hanh chinh thuc tren moi truong production. Tuyet doi khong commit truc tiep vao `main`.
- Nhanh `feat/real-data-admin-auth`: Nhanh phat trien tich hop hien tai.
- Khi phat trien tinh nang moi hoac sua loi, hay tao nhanh rieng tu nhanh dang phat trien:
  - Tinh nang moi: `feat/ten-chuc-nang`
  - Sua loi: `fix/ten-loi`
  - Tai lieu: `docs/noi-dung-cap-nhat`
  - Cai thien giao dien: `style/ten-thanh-phan`

### 2.2. Quy trinh dong bo code hang ngay
1. Luon chay `git pull origin feat/real-data-admin-auth` truoc khi bat dau ngay lam viec moi.
2. Code va kiem thu chuc nang tai may ca nhan.
3. Kiem tra trang thai bang `git status`.
4. Chi add cac file lien quan bang `git add <ten_file>`. Tuyet doi khong add `.env.local`.
5. Commit code theo chuan Conventional Commits.
6. Chay 4 lenh kiem tra bat buoc truoc khi push:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
7. Day nhanh len GitHub bang `git push origin <ten-nhanh>`.
8. Tao Pull Request (PR) vao nhanh `feat/real-data-admin-auth` tren GitHub de duoc review.

---

## 3. Quy Tac Dat Ten Commit (Conventional Commits)

Tat ca commit trong du an phai tuan thu cu phap:
```
<loai>(<pham_vi>): <mo_ta_ngan_gon>
```

Cac loai commit hop le:
- `feat`: Them mot tinh nang moi cho he thong
- `fix`: Sua mot loi logic hoac giao dien
- `style`: Thay doi CSS, mau sac, khoang cach ma khong anh huong den code chay
- `refactor`: To chuc lai code, toi uu cau truc ham/component
- `perf`: Cai thien toc do xu ly hoac hieu nang tai trang
- `test`: Them moi hoac cap nhat bo kiem thu don vi
- `docs`: Cap nhat hoac them moi tai lieu huong dan
- `chore`: Cap nhat file cau hinh, nang cap phu thuoc trong package.json

Vi du commit hop le:
- `feat(auth): implement remember me with 30 day cookie expiration`
- `fix(builder): correct power wattage calculation for high end gpu`
- `docs(security): add vulnerability reporting process`

---

## 4. Tieu Chuon Chat Luong Ma Nguon (Code Standards)

1. Tuan thu quy tac TypeScript nghiem ngat: Khong su dung kieu `any` khong kiem soat. Tat ca cac props va kieu du lieu phai duoc dinh nghia ro rang.
2. Tuan thu giao dien Light Theme: Su dung bang mau solid duoc quy dinh san (`#0F172A`, `#E11D48`, `#EA580C`, `#B45309`, `#16A34A`, `#2563EB`, `#FFFFFF`, `#F8FAFC`, `#E2E8F0`). Khong tu y them cac hieu ung gradient loe loet.
3. Bao ve tinh toan ven tai lieu: Khong xoa cac chu thich, docstring co san neu khong co yeu cau.
4. Xu ly bat dong bo: Luon boc cac loi goi API Supabase hoac fetch trong khoi `try...catch` de bat loi va dua ra thong bao than thien cho nguoi dung.

---

## 5. Lien He Va Ho Tro

Neu ban gap bat ky kho khan nao trong qua trinh thiet lap moi truong, thac mac ve kien truc he thong hoac can ho tro ky thuat, vui long lien he:

- Nguoi phu trach: Dong Duong
- Email: dongduong840@gmail.com
- Repository: https://github.com/DongDuong2001/qmd-tech
