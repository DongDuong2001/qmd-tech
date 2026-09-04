# [1.4.0](https://github.com/DongDuong2001/qmd-tech/compare/v1.3.0...v1.4.0) (2026-09-04)


### Features

* **admin:** add blog management tab and rich text article publishing modals ([0769478](https://github.com/DongDuong2001/qmd-tech/commit/0769478f69c8bdfd0f2593dd4ef02f1194d0d311))
* **admin:** build rich text editor component with toolbar and live preview ([8592f98](https://github.com/DongDuong2001/qmd-tech/commit/8592f9802c0aa46a6b303a58275a71000dc441b9))
* **admin:** create secure admin login portal with rate limiting feedback ([3e186ff](https://github.com/DongDuong2001/qmd-tech/commit/3e186ffe66746049ada9d85aa444befc41d8d216))
* **api:** create httponly cookie backed cart endpoints ([cb517e7](https://github.com/DongDuong2001/qmd-tech/commit/cb517e763da5716a17e9ee02907e9a28749ea0b3))
* **auth:** implement admin login api with rate limiting and secure session cookies ([1c96ac8](https://github.com/DongDuong2001/qmd-tech/commit/1c96ac84e1e6d959c2b75a645f3bea7666a34774))
* **blog:** build storefront blog listing page with category filters and spotlight hero ([bde201a](https://github.com/DongDuong2001/qmd-tech/commit/bde201add21c84df45174f4bea88a87e62f54bcd))
* **blog:** create dynamic article reader page with prose typography and share buttons ([59534f1](https://github.com/DongDuong2001/qmd-tech/commit/59534f169eb0d74530e62f50a9f1d4c4176fcccf))
* **blog:** implement BlogService for database crud and view count analytics ([7e7d8e2](https://github.com/DongDuong2001/qmd-tech/commit/7e7d8e2cc0ebc2cdbc8ff4469b3e1a4a2f8c64e7))
* **cart:** update storefront cart page to use httponly cookie api ([f33a25f](https://github.com/DongDuong2001/qmd-tech/commit/f33a25febc31e73d8661b048fdd3414cdbdc2a90))
* **checkout:** connect checkout flow to httponly cookie cart state ([b4c5857](https://github.com/DongDuong2001/qmd-tech/commit/b4c5857f74bf2187cd2ddc1dd5128a244e145129))
* **db:** add blog_posts table migration and rls policies ([e22ca68](https://github.com/DongDuong2001/qmd-tech/commit/e22ca6882ef6b0348cdc8d8f7a06983286e7c56c))
* **middleware:** add admin route protection and session token validation ([7e9cd4f](https://github.com/DongDuong2001/qmd-tech/commit/7e9cd4fa17524526b60f07b82984348c08f8b5bf))
* **navigation:** integrate blog links into header top bar, mobile menu, and footer ([e3c0a80](https://github.com/DongDuong2001/qmd-tech/commit/e3c0a801515fb6d83b2d9234a32e4e05278879b0))
* **security:** implement httponly cart cookie serialization and cookie helpers ([3dc8da1](https://github.com/DongDuong2001/qmd-tech/commit/3dc8da1b26d52f87097c56ba4339d34c27638bd4))
* **seo:** add dynamic sitemap and robots generator with blog and product routes ([b94ddc6](https://github.com/DongDuong2001/qmd-tech/commit/b94ddc636e20b221b8e2a7ee41d9208f112f4a7e))
* **seo:** configure opengraph twitter metadata and verification tags in root layout ([1b1f182](https://github.com/DongDuong2001/qmd-tech/commit/1b1f18271a14ccd011bbce0c05bb46fd62fad65c))
* **types:** add BlogPost and CreateBlogPostInput domain interfaces ([8103d04](https://github.com/DongDuong2001/qmd-tech/commit/8103d04da2cb1d72cd33c661c5516363a9d9eecc))
* **ui:** add global localized error boundary component ([ee9bb89](https://github.com/DongDuong2001/qmd-tech/commit/ee9bb897788aa9dd01eb4fccaaa21f0e204cc33a))
* **ui:** implement vending machine pure css 404 animation page ([60bdd73](https://github.com/DongDuong2001/qmd-tech/commit/60bdd73dec6caf9ce45fa15501c9e0df4fdd27b8))

# [1.3.0](https://github.com/DongDuong2001/qmd-tech/compare/v1.2.0...v1.3.0) (2026-09-03)


### Bug Fixes

* **carousel:** convert hero banner to full-bleed clickable event poster slider with light theme event tabs ([f5f8445](https://github.com/DongDuong2001/qmd-tech/commit/f5f8445c04d3c936b401989ba02ac60736bb8097))
* **hero:** align hotline support card background and badge with turquoise teal animation icon palette ([420f268](https://github.com/DongDuong2001/qmd-tech/commit/420f268d57a558c5476da6b78eab1a197c006a01))
* **hero:** eliminate bottom white gap by binding poster container to equal-height flex column ([71bfe13](https://github.com/DongDuong2001/qmd-tech/commit/71bfe1336d7f6b11270ea5f7610fa43d7a91da96))
* **layout:** apply electric blue and dark slate branding to header, footer, and root layout ([0b1d54d](https://github.com/DongDuong2001/qmd-tech/commit/0b1d54d5f2f14c929fab3cda44046741b715430f))
* **layout:** prevent horizontal viewport overflow on mobile devices and add responsive inline mobile search ([f4b4c37](https://github.com/DongDuong2001/qmd-tech/commit/f4b4c379ac7a9541c9fa51118ff54496dbb5dd4a))
* **responsive:** optimize mobile viewport with 16:9 banner aspect ratio swipeable categories and 2-col product grids ([a516015](https://github.com/DongDuong2001/qmd-tech/commit/a5160156325e5d0b8159975e33dcdb7d5fff52a4))
* **theme:** update design tokens and UI components to match authentic logo electric blue palette ([79a4686](https://github.com/DongDuong2001/qmd-tech/commit/79a46865c5a4857432682b437d479f9e89a64598))
* **ui:** enhance hero carousel text legibility with frosted glass scrim and electric blue accents ([90c417c](https://github.com/DongDuong2001/qmd-tech/commit/90c417c2e51ff2a8cfd16bdc6adb20808a785cc1))
* **views:** replace remaining red and orange tones with electric blue throughout storefront and admin ([d649d19](https://github.com/DongDuong2001/qmd-tech/commit/d649d197ffe87967832a536421cc51a83e8861e4))


### Features

* **admin:** add event banners, prebuilt deals reordering, and suppliers management ([4ea3df1](https://github.com/DongDuong2001/qmd-tech/commit/4ea3df15a0282161ffbe62b9dd1e1224b8bd6fed))
* **domain:** add banner, prebuilt deals, and supplier models with supabase service ([338e430](https://github.com/DongDuong2001/qmd-tech/commit/338e430244f3290e3d9ca332e065d9975f85d536))
* **hero-admin:** convert hero carousel to pure full-bleed poster slider and enable admin event poster CRUD with live preview ([ceaca12](https://github.com/DongDuong2001/qmd-tech/commit/ceaca1243ac46bba73f8a8b58628fd760eff6ae7))
* **hero:** integrate animated GIF icons in side promo cards with responsive desktop tablet mobile layout ([86aa883](https://github.com/DongDuong2001/qmd-tech/commit/86aa883fa39ecef671eed8ef5b32b218f7417557))
* **storefront:** integrate hero carousel, dynamic deals, and neutral marketing tone ([104fe1d](https://github.com/DongDuong2001/qmd-tech/commit/104fe1d16bcaff586c65a3678f3719be7bf3102d))
* **ui:** implement vietnamese retailer hero carousel and hover specs popover ([5819ff9](https://github.com/DongDuong2001/qmd-tech/commit/5819ff90d827f1f61295bf2c3f0a130162749991))

# [1.2.0](https://github.com/DongDuong2001/qmd-tech/compare/v1.1.0...v1.2.0) (2026-09-02)


### Features

* **admin:** build Admin Dashboard management portal ([60f8f0d](https://github.com/DongDuong2001/qmd-tech/commit/60f8f0dbf1af928b9f80d47a7ae9e84ac72f69b3))
* **admin:** build dedicated standalone enterprise backoffice console layout ([8472df0](https://github.com/DongDuong2001/qmd-tech/commit/8472df0055a6032f804f9a538a18856debfc1ed3))
* **admin:** implement AdminService for Supabase operations ([90693aa](https://github.com/DongDuong2001/qmd-tech/commit/90693aab48fd9f4ea986d14a58f7994df6a83f98))
* **auth:** create rate-limited HttpOnly cookie auth API route handlers ([62fa20f](https://github.com/DongDuong2001/qmd-tech/commit/62fa20fea27662dae0ba29f4bf3680230f821463))
* **auth:** implement real Login, Register and User Profile views with Supabase Auth ([78b29dc](https://github.com/DongDuong2001/qmd-tech/commit/78b29dc664308a995d64bfb25ae8dd5545f5208e))
* **auth:** integrate Supabase Auth service ([5b0dfa3](https://github.com/DongDuong2001/qmd-tech/commit/5b0dfa3969629e2d06e6f1bdb35880aa83942d1c))
* **auth:** update AuthService to use HttpOnly cookie endpoints with remember-me ([e76769a](https://github.com/DongDuong2001/qmd-tech/commit/e76769affdaedbfc2d552757ea9a2d1a42c2f510))
* **branding:** add qmdtech official logo and tab favicons ([baca7eb](https://github.com/DongDuong2001/qmd-tech/commit/baca7eb1fc8ef09bdcbdfce9968cc38531b79a37))
* **branding:** integrate authentic official manufacturer vector logos ([4cc32ed](https://github.com/DongDuong2001/qmd-tech/commit/4cc32ed0dad556a7ad5ed47b5aa1f645bd3c2ac1))
* **builder:** connect Custom PC Builder to live DB products ([0111c4c](https://github.com/DongDuong2001/qmd-tech/commit/0111c4c9d610d070880539ef16f78f517236a4bd))
* **catalog:** connect category catalog views to live DB ([b22c2fe](https://github.com/DongDuong2001/qmd-tech/commit/b22c2fe35a1cb6b61d270cd1998af55a069a398a))
* **catalog:** switch catalog service to live Supabase DB queries and remove mockData ([5c4ef25](https://github.com/DongDuong2001/qmd-tech/commit/5c4ef2526894dfb9a03cd16163c3276e764afeed))
* **checkout:** connect cart and checkout flows to live DB orders ([53080e0](https://github.com/DongDuong2001/qmd-tech/commit/53080e0e7310f62c4c9416e11f5076ee89af855d))
* **home:** redesign homepage in authentic Vietnamese gaming retailer style ([669001f](https://github.com/DongDuong2001/qmd-tech/commit/669001f25e76354c78d0467cca8135f0a1c2d918))
* **layout:** redesign header and footer with solid gaming retailer styling ([53dfb87](https://github.com/DongDuong2001/qmd-tech/commit/53dfb8705fcae127402fc3312e8d3825d9cc1668))
* **pages:** update store pages for light theme and live data ([533dd21](https://github.com/DongDuong2001/qmd-tech/commit/533dd213bb5a4d7925cd682b604ec201bdb6f382))
* **product:** redesign ProductCard for light theme with solid colors ([773e66b](https://github.com/DongDuong2001/qmd-tech/commit/773e66b072f0c62730f00a7ad634d8c0decc617e))
* **security:** add HTTP security headers to middleware ([07cc306](https://github.com/DongDuong2001/qmd-tech/commit/07cc306ec47af6a446a32b4710f70127ce113930))
* **security:** implement in-memory rate limiter and secure cookie options ([70bd35a](https://github.com/DongDuong2001/qmd-tech/commit/70bd35a70cb10792a53de22694e13a0799789455))
* **ui:** add authentic official vector brand logos ([867697f](https://github.com/DongDuong2001/qmd-tech/commit/867697f41d53688b640254b8eae5af0f9462b564))
* **ui:** add Remember Me checkbox and security badges to account view ([129a3c6](https://github.com/DongDuong2001/qmd-tech/commit/129a3c68369c735dd465e6848bb09dca1f62b154))
* **ui:** apply rounded qmdtech logo to header, footer and browser tab ([04b521b](https://github.com/DongDuong2001/qmd-tech/commit/04b521b0c9a284b13fc00ff719e3d547e4a265b8))
* **ui:** update LanguageSwitcher component ([764c99a](https://github.com/DongDuong2001/qmd-tech/commit/764c99a9b4f6e50dee446e81be297cb61b67d994))
* **ui:** update UI primitives with solid true colors ([28f4460](https://github.com/DongDuong2001/qmd-tech/commit/28f44606b727722bf4c5fcff127afdb3f7878071))


### Performance Improvements

* **image:** add sizes prop to all fill Image components for optimal page loading ([1bd3f9b](https://github.com/DongDuong2001/qmd-tech/commit/1bd3f9b5d6ac74f9b5144a7acb2ee845aacc24fa))

# [1.1.0](https://github.com/DongDuong2001/qmd-tech/compare/v1.0.1...v1.1.0) (2026-09-02)


### Features

* update Supabase database integrations and upgrade CI/CD to Node 24 ([5222585](https://github.com/DongDuong2001/qmd-tech/commit/522258565fc25c93ad1707ba495f22f01ee053a8))

## [1.0.1](https://github.com/DongDuong2001/qmd-tech/compare/v1.0.0...v1.0.1) (2026-09-02)


### Bug Fixes

* resolve lint and typecheck errors for CI pipeline ([ef39c72](https://github.com/DongDuong2001/qmd-tech/commit/ef39c72a68de27f9351795d97cacd288e3990e28))

# 1.0.0 (2026-09-01)


### Features

* scaffold QMD-Tech modular monolith with Next.js 16, i18n, PC builder, and CI/CD ([ad46e7a](https://github.com/DongDuong2001/qmd-tech/commit/ad46e7a790195e623b8cee24e2b0f7faf4db8f45))
