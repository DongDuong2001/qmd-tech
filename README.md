# QMD-Tech — PC Components & Custom Build Store 🚀

> **High-Performance Hardware Retail & Custom PC Configurator**  
> Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, `next-intl` (vi/en), and Modular Monolith Architecture.

---

## ⚡ Tech Stack & Architecture

- **Frontend**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/)
- **i18n Localization**: `next-intl` (`/vi/...` default, `/en/...` secondary)
- **Design System**: High-Tech Dark Mode default (`#0B0E14`), crisp surfaces (`#131722`), neon borders (`#2A3040`), Electric Blue (`#3B82F6`), Violet (`#7C3AED`), Amber (`#FACC15`). **Strictly solid surfaces — No gradients.**
- **Typography**: `Be Vietnam Pro` (Headings, full Vietnamese diacritics), `Inter` (Body), `JetBrains Mono` (Specs / Monospace).
- **Backend Architecture**: Modular Monolith with isolated domain modules and in-process typed event bus:
  - `src/modules/catalog/`: Categories, products, full-text search, filtering
  - `src/modules/builder/`: Custom PC Builder & hardware compatibility engine
  - `src/modules/cart/`: Cart state, dynamic discounts, free-shipping calculations
  - `src/modules/orders/`: Checkout flow, order lifecycle & tracking
  - `src/modules/payments/`: VNPay, MoMo, ZaloPay, COD payment adapters
  - `src/modules/shipping/`: GHN & GHTK shipping rate calculation adapters
  - `src/modules/auth/`: Supabase Auth & JWT management
  - `src/modules/reviews/`: Customer verified reviews
  - `src/modules/i18n/`: Multilingual content and VND/USD currency formatting
- **Database & Storage**: PostgreSQL via Supabase with Row-Level Security (RLS) policies and migrations.
- **Testing**: Vitest for hardware compatibility engine and domain services.
- **CI/CD & Releases**: GitHub Actions (`ci.yml` for lint/typecheck/tests/build, `release.yml` for Semantic Release and automated changelog generation).

---

## 🛠️ Project Structure

```
qmd-tech/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Automated CI (lint, typecheck, test, build)
│       └── release.yml               # Automated Semantic Versioning & GitHub Releases
├── messages/
│   ├── vi.json                       # Vietnamese dictionary (default)
│   └── en.json                       # English dictionary
├── public/                           # Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx            # Root locale layout with Google Fonts
│   │   │   ├── page.tsx              # High-tech Storefront Home
│   │   │   ├── build-pc/             # Custom PC Builder configurator
│   │   │   │   ├── page.tsx
│   │   │   │   └── [buildId]/page.tsx
│   │   │   ├── danh-muc/             # Category listings
│   │   │   ├── san-pham/[slug]/      # Product detail & structured specs
│   │   │   ├── gio-hang/page.tsx     # Shopping cart
│   │   │   ├── thanh-toan/page.tsx   # Checkout with VNPay / MoMo / COD
│   │   │   ├── tai-khoan/page.tsx    # User account dashboard
│   │   │   ├── khuyen-mai/page.tsx   # Deals & promo codes
│   │   │   ├── blog/page.tsx         # Hardware guides & reviews
│   │   │   ├── bao-hanh/page.tsx     # Warranty policies
│   │   │   └── lien-he/page.tsx      # Showroom & contact info
│   │   ├── api/                      # Modular API routes
│   │   └── globals.css               # Tailwind CSS v4 @theme design tokens
│   ├── components/
│   │   ├── builder/                  # Custom PC Builder & Wattage Meter
│   │   ├── common/                   # ThemeToggle, LanguageSwitcher
│   │   ├── layout/                   # Header, Footer, Navigation
│   │   ├── product/                  # ProductCard, PriceTag, Specs
│   │   └── ui/                       # Button, Card, Badge, Modal
│   ├── i18n/                         # next-intl routing and request config
│   ├── modules/                      # Modular Monolith domains
│   └── shared/                       # EventBus, Supabase DB, types, errors
├── supabase/
│   ├── migrations/                   # SQL schemas and RLS policies
│   └── seed.sql                      # Hardware seed data
├── .env.example
├── .releaserc.json                   # Semantic Release config
├── commitlint.config.mjs             # Conventional commit rules
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🧮 Custom PC Builder Compatibility Engine

The built-in compatibility engine (`src/modules/builder/compatibilityEngine.ts`) evaluates PC parts across 6 key hardware constraints:

1. **CPU ↔ Motherboard Socket Match**: Validates AMD AM5/AM4 vs Intel LGA1700/LGA1200 sockets.
2. **RAM Generation Matching**: Validates DDR4 vs DDR5 RAM and motherboard support.
3. **Cooler Socket Mounting**: Checks cooler bracket compatibility for CPU socket.
4. **Power Draw & Transient Headroom**: Calculates estimated system power consumption (CPU TDP + GPU TDP + 100W base) with 30% recommended transient headroom.
5. **Form Factor Compatibility**: Validates E-ATX / ATX / Micro-ATX / Mini-ITX motherboard fitment against case specifications.
6. **GPU Length Clearance**: Validates graphics card length against case maximum clearance in millimeters.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `22.x` or higher
- npm `10.x` or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/DongDuong2001/qmd-tech.git
cd qmd-tech

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (auto-redirects to `/vi` or `/en` based on locale).

### 4. Running Tests & Typecheck
```bash
# Run unit tests
npm run test

# Run TypeScript type check
npm run typecheck

# Run ESLint
npm run lint

# Production build
npm run build
```

---

## 📦 Database Setup (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Apply the migration in SQL Editor:
   - `supabase/migrations/20260901_initial_schema.sql`
3. Seed the sample PC hardware:
   - `supabase/seed.sql`
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env.local`.

---

## 🏷️ Conventional Commits & Version Release

This project enforces [Conventional Commits](https://www.conventionalcommits.org/). Automated semantic versioning and changelog generation are triggered on push to `main` via `.github/workflows/release.yml`:

- `feat:` -> Triggers MINOR version bump (e.g. `1.1.0`)
- `fix:` -> Triggers PATCH version bump (e.g. `1.0.1`)
- `feat!:` or `BREAKING CHANGE:` -> Triggers MAJOR version bump (e.g. `2.0.0`)

---

## 📄 License
MIT © 2026 QMD-Tech. Built by [@DongDuong2001](https://github.com/DongDuong2001).
