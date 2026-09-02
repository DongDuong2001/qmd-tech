# QMD-Tech - Professional PC Hardware and Custom PC Builder Platform

High-performance PC components e-commerce platform and intelligent Custom PC Configurator.
Engineered with Next.js 16 (App Router), React 19, Tailwind CSS v4, internationalization (`next-intl` vi/en), live PostgreSQL database via Supabase, server-side HttpOnly Cookie session management, sliding-window rate limiting, and a dedicated Enterprise Admin Console.

---

## 1. Tech Stack and Architecture

- Framework: Next.js 16 (App Router) with React 19
- Styling: Tailwind CSS v4 featuring an energetic Light Theme with clean, true solid surfaces (strictly no gradients)
- Localization: `next-intl` with mandatory locale prefix routing (`/vi` default, `/en` secondary)
- Database: Live PostgreSQL on Supabase directly querying products, categories, orders, builds, and reviews
- Authentication and Security:
  - 100% session management via HttpOnly Cookies (mitigates token theft through XSS)
  - Persistent Remember Me functionality supporting 30-day sessions
  - In-memory sliding-window Rate Limiter defending against brute-force attacks on auth endpoints
  - Robust HTTP Security Headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Custom PC Builder Compatibility Engine: Multi-point hardware validation checking CPU/motherboard sockets, RAM generations (DDR4/DDR5), PSU wattage recommendations, and chassis clearances
- Administration Portal: Dedicated standalone Enterprise Admin Console (decoupled from the consumer storefront) located at `/[locale]/admin`
- Brand Identity: 100% authentic vector logos from premier hardware manufacturers (ASUS, NVIDIA, Intel, AMD, MSI, GIGABYTE, Corsair, Samsung, Kingston, NZXT, Lian Li, Western Digital)

---

## 2. Directory Structure

```
qmd-tech/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Automated CI: lint, typecheck, test, build
│       └── release.yml               # Automated Semantic Versioning and GitHub Releases
├── messages/
│   ├── vi.json                       # Vietnamese dictionary (default)
│   └── en.json                       # English dictionary
├── public/
│   ├── brands/                       # Authentic vector SVG assets for hardware manufacturers
│   ├── favicon.ico                   # Standard website favicon
│   └── qmdtech_logo.png              # Official rounded QMD-Tech brand logo
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── admin/page.tsx        # Dedicated Enterprise Admin Console
│   │   │   ├── build-pc/             # Custom PC Builder configurator
│   │   │   ├── danh-muc/             # Hardware category catalog
│   │   │   ├── gio-hang/page.tsx     # Shopping cart
│   │   │   ├── thanh-toan/page.tsx   # Checkout and payment processing
│   │   │   ├── tai-khoan/page.tsx    # Customer account management with HttpOnly auth
│   │   │   ├── san-pham/[slug]/      # Hardware details and technical specifications
│   │   │   ├── bao-hanh/page.tsx     # Warranty and return policies
│   │   │   ├── khuyen-mai/page.tsx   # Promotions and special deals
│   │   │   ├── lien-he/page.tsx      # Showroom locations and contact info
│   │   │   ├── layout.tsx            # Storefront root layout
│   │   │   └── page.tsx              # Storefront homepage
│   │   ├── api/
│   │   │   ├── auth/                 # Rate-limited HttpOnly auth endpoints (login, register, session, logout)
│   │   │   ├── builder/              # Save and retrieve custom PC builds
│   │   │   ├── catalog/              # Hardware catalog query endpoints
│   │   │   └── orders/               # Order creation and fulfillment
│   │   ├── icon.png                  # Browser tab icon
│   │   ├── apple-icon.png            # Apple touch icon
│   │   └── globals.css               # Design tokens and Tailwind CSS v4 directives
│   ├── components/
│   │   ├── builder/                  # Custom PC Builder UI and Wattage Meter
│   │   ├── common/                   # Authentic BrandLogos, LanguageSwitcher
│   │   ├── layout/                   # Header, Footer (auto-hidden on /admin routes)
│   │   ├── product/                  # ProductCard, PriceDisplay
│   │   └── ui/                       # Button, Badge, Card, Modal primitives
│   ├── modules/                      # Domain services (admin, auth, catalog, cart, builder, orders, reviews, i18n)
│   ├── shared/
│   │   ├── db/                       # Supabase client configuration
│   │   ├── security/                 # RateLimiter and secure cookie management
│   │   └── types/                    # Domain data models and TypeScript types
│   └── middleware.ts                 # next-intl locale routing and HTTP Security Headers
├── CONTRIBUTING.md                   # Internal development workflow and standards
├── GIT_GUIDE.md                      # Comprehensive Git collaboration handbook for beginners
├── LICENSE                           # Proprietary commercial license (All Rights Reserved)
├── SECURITY.md                       # Information security policy and disclosure channel
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 3. Local Setup and Installation

### 3.1. Prerequisites
- Node.js version `22.x` or higher
- Package manager: `npm` (version 10.x or higher) or `pnpm`
- Git installed on your development machine

### 3.2. Setup Instructions

Step 1: Clone the repository and navigate into the workspace
```bash
git clone https://github.com/DongDuong2001/qmd-tech.git
cd qmd-tech
```

Step 2: Switch to the active development branch
```bash
git checkout feat/real-data-admin-auth
```

Step 3: Install project dependencies
```bash
npm install
```

Step 4: Configure environment variables
Create a `.env.local` file at the root of the project with Supabase credentials provided by the team lead:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
Important note: Never commit `.env.local` to Git or expose credentials publicly.

Step 5: Start the local development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.
The application will automatically direct you to `http://localhost:3000/vi` (Vietnamese) or `http://localhost:3000/en` (English).

---

## 4. Quality Verification Commands

Before staging and committing code to the repository, all four validation checks must pass without errors:

```bash
# 1. Static code analysis and linting (ESLint)
npm run lint

# 2. Static type verification (TypeScript)
npm run typecheck

# 3. Unit test execution (Vitest)
npm run test

# 4. Production build compilation (Next.js Build)
npm run build
```

Every command must exit with code 0 (zero errors and zero warnings).

---

## 5. Key System Features

### 5.1. E-Commerce Storefront
- Utility header: Showroom locator, technical hotline, warranty lookup, language switcher
- Keyword search with quick suggestion pills
- 12-category navigation grid (CPU, GPU, Motherboard, RAM, SSD, Power Supply, Chassis, Cooling...)
- Promotional banner with countdown urgency timer
- Prebuilt gaming rigs showcase
- Official corporate logo grid featuring 12 top hardware brands

### 5.2. Custom PC Builder Configurator
- Real-time power consumption estimation (Wattage Meter)
- Automated socket matching between CPU and motherboard
- Memory generation and slot validation (DDR4 vs DDR5)
- Intelligent PSU wattage headroom recommendations
- Shareable short URLs for custom builds
- Direct request quote and one-click cart transfer

### 5.3. Secure Authentication
- Dedicated route: `/[locale]/tai-khoan`
- Real-time user login and registration backed by Supabase Auth
- 100% HttpOnly cookie session storage, preventing token exfiltration via client-side scripts
- Optional 30-day persistent session via the Remember Me checkbox
- Sliding-window rate limiter on auth routes preventing brute-force password guessing

### 5.4. Enterprise Administration Console
- Dedicated route: `/[locale]/admin`
- Standalone backoffice layout with a dark slate sidebar (`#0F172A`)
- Automatic storefront header and footer suppression on `/admin` paths
- Real-time inventory overview: Multi-factor filters by brand, category, and stock levels
- Category management: Create and inspect hardware taxonomy
- Order fulfillment: Detailed customer contact, address, line items, and 1-click status transitions
- Customer review moderation
- Real-time status indicators for Supabase connectivity and security defenses

---

## 6. Development Handbooks and Policies

Refer to these specialized documents before making modifications to the codebase:

- Git Collaboration Guide for Beginners: [GIT_GUIDE.md](file:///d:/d-tech/GIT_GUIDE.md)
- Development Standards and Contribution Rules: [CONTRIBUTING.md](file:///d:/d-tech/CONTRIBUTING.md)
- Security Policy and Vulnerability Disclosure: [SECURITY.md](file:///d:/d-tech/SECURITY.md)
- Commercial License Terms: [LICENSE](file:///d:/d-tech/LICENSE)

---

## 7. License and Intellectual Property

Copyright (c) 2026 QMD Tech Corporation. All Rights Reserved.

This software is the proprietary and confidential property of QMD Tech. It is not open-source software. Unauthorized copying, distribution, modification, reverse engineering, public deployment, or commercial exploitation is strictly prohibited without prior written authorization.

For licensing requests or permissions, please contact:
- Representative: Dong Duong
- Email: dongduong840@gmail.com
