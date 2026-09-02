# Huong Dan Su Dung Git Danh Cho Nguoi Moi Bat Dau - Du An QMD-Tech

Tai lieu nay danh cho cac lap trinh vien moi tham gia vao du an QMD-Tech. Huong dan chi tiet tung buoc tu cai dat, thao tac hang ngay, cach dat ten commit, quy tac an toan ma nguon den xu ly loi xung dot (conflict).

---

## 1. Cai Dat Ban Dau Tren May Tinh

### 1.1. Kiem tra Git
Mo terminal (PowerShell tren Windows hoac Terminal tren macOS/Linux) va go:
```bash
git --version
```
Neu chua co Git, hay tai va cai dat tai trang chu: https://git-scm.com/

### 1.2. Thiet lap thong tin ca nhan
Day la thong tin se gan lien voi moi commit ban tao:
```bash
git config --global user.name "Ten Cua Ban"
git config --global user.email "email_cua_ban@example.com"
```
Kiem tra lai thong tin da luu:
```bash
git config --list
```

---

## 2. Quy Trinh Clone Du An Ve May

### 2.1. Clone ma nguon
```bash
git clone https://github.com/DongDuong2001/qmd-tech.git
cd qmd-tech
```

### 2.2. Kiem tra cac nhanh (branch) hien co
Hien thi danh sach tat ca cac nhanh tren may va tren remote server:
```bash
git branch -a
```

### 2.3. Chuyen sang nhanh dang phat trien chinh
Hien tai du an dang tap trung phat trien tren nhanh `feat/real-data-admin-auth`:
```bash
git checkout feat/real-data-admin-auth
```
Kiem tra nhanh hien tai dang dung:
```bash
git branch
```
(Dau sao `*` mau xanh se nam o nhanh ban dang dung).

---

## 3. Quy Trinh Lam Viec Hang Ngay (Daily Workflow)

Moi ngay khi bat dau lam viec, ban can thuc hien theo dung thu tu 6 buoc sau:

### Buoc 1: Dong bo ma nguon moi nhat tu GitHub ve may
Truoc khi code bat ky tinh nang nao, luon luon keo code moi nhat ve de tranh bi trung lap hoac xung dot:
```bash
git pull origin feat/real-data-admin-auth
```

### Buoc 2: Kiem tra trang thai tep tin sau khi chinh sua
Sau khi viet code hoac sua file, go:
```bash
git status
```
Git se liet ke:
- Cac file mau do (Changes not staged): file da sua nhung chua dua vao khu vuc commit.
- Cac file mau xanh (Changes to be committed): file da san sang de commit.
- Untracked files: file moi tao chua duoc Git theo doi.

Xem chi tiet cac dong da sua:
```bash
git diff
```

### Buoc 3: Dua tung file vao khu vuc cho commit (Staging)
QUY TAC QUAN TRONG: Chi add tung file hoac nhom file co cung chuc nang. Khong su dung `git add .` bua bai.

```bash
# Add file cu the:
git add src/app/[locale]/page.tsx

# Hoac add nhieu file lien quan den mot chuc nang:
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx
```

CANH BAO BAO MAT:
Khong bao gio duoc add file `.env.local` hoac file chua thong tin mat khau, API key ca nhan vao Git. Neu lo add, phai go bo ngay bang lenh:
```bash
git restore --staged .env.local
```

### Buoc 4: Ghi nhan commit theo chuan Conventional Commits
Moi commit can co thong diep ro rang, mo ta dung thay doi da lam. Du an ap dung chuan Conventional Commits:

Cu phap:
```bash
git commit -m "loai_thay_doi(pham_vi): mo ta ngan gon ve thay doi"
```

Cac tien to (prefix) tieu chuan bat buoc su dung:
- `feat`: Tinh nang moi (VD: `git commit -m "feat(auth): them tinh nang ghi nho mat khau"`)
- `fix`: Sua loi (VD: `git commit -m "fix(builder): sua loi tinh toan cong suat nguon"`)
- `style`: Thay doi giao dien, mau sac, CSS ma khong doi logic (VD: `git commit -m "style(home): cap nhat mau nen sang cho the san pham"`)
- `refactor`: To chuc lai code, khong them tinh nang, khong sua bug (VD: `git commit -m "refactor(catalog): tach nho component danh muc"`)
- `perf`: Cai thien hieu nang (VD: `git commit -m "perf(image): them thuoc tinh sizes cho the Image"`)
- `test`: Them hoac sua unit test (VD: `git commit -m "test(security): bo sung kiem thu cho rate limiter"`)
- `docs`: Cap nhat tai lieu (VD: `git commit -m "docs: cap nhat huong dan lap trinh cho team"`)
- `chore`: Thay doi goi thu vien, file cau hinh (VD: `git commit -m "chore: cap nhat package.json"`)

### Buoc 5: Kiem tra truoc khi day len GitHub
Truoc khi day code len GitHub, bat buoc phai chay 4 lenh kiem tra sau de dam bao khong gay loi:
```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
Khi ca 4 lenh tren deu bao thanh cong (code 0), moi duoc phep day code len.

### Buoc 6: Day code len GitHub (Push)
Neu dang lam tren nhanh hien tai:
```bash
git push origin feat/real-data-admin-auth
```

Neu ban tao mot nhanh rieng cua ban:
```bash
# Tao nhanh moi
git checkout -b feat/ten-chuc-nang-moi

# Sau khi commit xong, day nhanh moi len remote:
git push -u origin feat/ten-chuc-nang-moi
```

---

## 4. Cach Xu Ly Cac Tinh Huong Thuong Gap

### Tinh huong 1: Muon huy bo thay doi tren 1 file (chua `git add`)
Neu ban da sua file nhung thay bi sai va muon khoi phuc lai nguyen ban ban dau:
```bash
git restore ten-file-can-khoi-phuc
```

### Tinh huong 2: Lo `git add` nhung chua commit va muon bo ra
```bash
git restore --staged ten-file-can-bo
```

### Tinh huong 3: Muon xem lich su commit gan nhat
```bash
git log --oneline -n 10
```

### Tinh huong 4: Xu ly xung dot code (Conflict)
Khi ban va nguoi khac cung sua tren cung 1 dong code, khi chay `git pull` se xuat hien conflict:
1. Mo file bi conflict tren VS Code / trinh soan thao.
2. Ban se thay cac ky hieu:
   - `<<<<<<< HEAD` (Code hien tai cua ban tren may)
   - `=======` (Ranh gioi ngan cach)
   - `>>>>>>> ...` (Code cua dong nghiep keo tu GitHub ve)
3. Thao luan voi dong nghiep va chon giu lai code dung (xoa cac ky hieu `<<<<<<<`, `=======`, `>>>>>>>`).
4. Luu file lai va chay:
   ```bash
   git add ten-file-da-sua-xong
   git commit -m "fix: resolve merge conflict in ten-file"
   git push
   ```

---

## 5. Bang Tra Cuu Cac Lenh Git Thong Dung

| Lenh | Y nghia |
| --- | --- |
| `git status` | Xem trang thai cac file (da sua, da add, chua add) |
| `git pull origin <branch>` | Keo code moi nhat ve may |
| `git add <file>` | Dua file vao khu vuc cho commit |
| `git commit -m "..."` | Ghi lai lich su commit |
| `git push origin <branch>` | Day commit len GitHub |
| `git branch` | Xem danh sach nhanh o may ca nhan |
| `git checkout <branch>` | Chuyen sang nhanh khac |
| `git checkout -b <branch>` | Tao nhanh moi va chuyen sang nhanh do ngay |
| `git log --oneline` | Xem lich su commit ngan gon |
| `git diff` | Xem chi tiet cac dong code thay doi |
