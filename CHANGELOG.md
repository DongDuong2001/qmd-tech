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
