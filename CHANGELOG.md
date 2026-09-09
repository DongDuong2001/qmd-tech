# [1.8.0](https://github.com/DongDuong2001/qmd-tech/compare/v1.7.1...v1.8.0) (2026-09-09)


### Bug Fixes

* **builder:** rehydrate products authoritatively server-side to prevent price manipulation ([152cc78](https://github.com/DongDuong2001/qmd-tech/commit/152cc78ee3b0b3a907baae73bb6b17d39097b708))
* **db:** harden stock decrement rpc, lockdown orders rls, and add atomic checkout rpc ([0a2a026](https://github.com/DongDuong2001/qmd-tech/commit/0a2a02617418f204681d430f82d80ad78671d62b))
* **orders:** add atomic checkout rpc with rollback and capability secret token ([79c2122](https://github.com/DongDuong2001/qmd-tech/commit/79c2122fbc00b07dfadceca18f61d5ab3230bd7e))
* **security:** upgrade html sanitizer to sanitize-html with strict tag and scheme allowlist ([a2b1490](https://github.com/DongDuong2001/qmd-tech/commit/a2b1490197ecf94fd0ad53ffd3509576c9c8b3ee))


### Features

* **admin:** add secure admin orders api route with service role and admin auth ([dede02b](https://github.com/DongDuong2001/qmd-tech/commit/dede02b1c6c12d5e2b90b08c23f3d164e5213d9a))
* **admin:** overhaul layout with fixed sidebar, enhanced product and order lists, and order detail modal ([dac05bd](https://github.com/DongDuong2001/qmd-tech/commit/dac05bd7b8be2cc7c0222d886b19cd55fdedd7fc))
* **admin:** render order_items with proper typing in order detail modal ([dab6d8f](https://github.com/DongDuong2001/qmd-tech/commit/dab6d8f57475bdeb55da86b77f25716b04dd6ba1))
* **admin:** route getOrders and updateOrderStatus through secure admin orders api ([db7bb18](https://github.com/DongDuong2001/qmd-tech/commit/db7bb18de47e51f738763aa25851eb221fbd1f57))
* **types:** add order_access_token field to Order interface ([9fc9b0f](https://github.com/DongDuong2001/qmd-tech/commit/9fc9b0f7c1f1337b431ae7c617479106fd8ffeb2))
* **types:** add order_items relation field to Order interface ([5d15484](https://github.com/DongDuong2001/qmd-tech/commit/5d154845d5bbd6bf3248f5327da740107032597f))

## [1.7.1](https://github.com/DongDuong2001/qmd-tech/compare/v1.7.0...v1.7.1) (2026-09-08)


### Bug Fixes

* **db:** make career policies idempotent with drop policy if exists ([1986aa5](https://github.com/DongDuong2001/qmd-tech/commit/1986aa5ec512fa1ee4d8c924764401a32983d1e4))
* **db:** make mega menu settings policies idempotent with drop policy if exists ([1a5bad6](https://github.com/DongDuong2001/qmd-tech/commit/1a5bad6b736753f5d130e4f5e247614a1a9a9e6b))
* **db:** strip UTF-8 BOM and make career applications policies idempotent ([b106027](https://github.com/DongDuong2001/qmd-tech/commit/b106027cc83f97a435f7f64edc6d5a2ba6934747))

# [1.7.0](https://github.com/DongDuong2001/qmd-tech/compare/v1.6.0...v1.7.0) (2026-09-08)


### Bug Fixes

* **admin:** auto-sanitize blog post slugs in create and edit modals ([5ebe6b4](https://github.com/DongDuong2001/qmd-tech/commit/5ebe6b4c955d0d61442eaffe4e171f0da46cb3c2))
* **admin:** use slugifyVietnamese for category slug normalization ([02e0fe5](https://github.com/DongDuong2001/qmd-tech/commit/02e0fe52e53cda2ad8a9cdfdb9fe64deed1a8c1a))
* **admin:** use slugifyVietnamese for product slug normalization ([f0c111b](https://github.com/DongDuong2001/qmd-tech/commit/f0c111b64b1e8000ebe6e5a5abd0a039a27a0864))
* **auth:** clear default pre-filled admin credential in login form ([6b9fc23](https://github.com/DongDuong2001/qmd-tech/commit/6b9fc23aa0e0f281c913577343e4e61e1852c32a))
* **auth:** eliminate email-based implicit admin privilege escalation ([4f0f1d0](https://github.com/DongDuong2001/qmd-tech/commit/4f0f1d05246fda8b29484896758dab368708c3d8))
* **auth:** remove hardcoded fallback credentials from admin-login route ([2406251](https://github.com/DongDuong2001/qmd-tech/commit/2406251120b4ba7e18aa98ef4de4d4749165ca13))
* **blog:** add slug sanitization and multi-pass post lookup ([53b1328](https://github.com/DongDuong2001/qmd-tech/commit/53b13280727f2980b67848260b3d8367f5ac7af9))
* **blog:** preserve banner text with ambient unclipped image presentation ([2436bb8](https://github.com/DongDuong2001/qmd-tech/commit/2436bb87c39176989ec4c8b73f821419aa0c9922))
* **blog:** refine hash splitting logic in sanitizeSlug helper ([239dbf9](https://github.com/DongDuong2001/qmd-tech/commit/239dbf977e68ff59cacf738b050bbece9ebcda78))
* **blog:** support decoded slugs and render unclipped ambient cover banner ([a51ac5d](https://github.com/DongDuong2001/qmd-tech/commit/a51ac5dd061319d3566738bec64b6f6e2baea31b))
* **builder:** resolve missing motherboards via category mapping and chipset heuristics ([44ad49f](https://github.com/DongDuong2001/qmd-tech/commit/44ad49fcf7625944a96f9075a9efba49b96119ac))
* **careers:** enhance hero contrast and adopt neutral corporate wording ([06c0eb3](https://github.com/DongDuong2001/qmd-tech/commit/06c0eb3bf10170d09eb72a5afe046b1afaa4ba91))
* **catalog:** sanitize search queries to prevent PostgREST syntax injection ([edf2744](https://github.com/DongDuong2001/qmd-tech/commit/edf2744553bb3261d742ca85862bec1c243eaed3))
* **home:** update delivery coverage badge to 34 provinces ([afcebaa](https://github.com/DongDuong2001/qmd-tech/commit/afcebaa88106a4c1aab43748939dd1fee9625a69))
* **navigation:** add click and focus handlers for category selection in mega menu ([efaa633](https://github.com/DongDuong2001/qmd-tech/commit/efaa6334dadf29ae37ef29f4648df0ff6c9e8f83))
* **navigation:** make category rows switch active tabs and remove clipping badges ([3eab147](https://github.com/DongDuong2001/qmd-tech/commit/3eab147643fbc652c9de05999c1309adaff4b48b))
* **orders:** add getOrderByTransactionId for payment replay verification ([0ad5c53](https://github.com/DongDuong2001/qmd-tech/commit/0ad5c5387e89708ae6bd505b1a68edfbdf2ecf5d))
* **orders:** mask pii in public order query and enforce server catalog validation ([d3e602a](https://github.com/DongDuong2001/qmd-tech/commit/d3e602a3721dd509801a0a934a0027fdccbcbb14))
* **payments:** add bank account validation and replay protection in sepay webhook ([8832048](https://github.com/DongDuong2001/qmd-tech/commit/88320481cb0cfc4b67ae0545cf2af2851448c3d8))
* **payments:** enforce strict apikey authorization format for sepay webhook ([b3d540d](https://github.com/DongDuong2001/qmd-tech/commit/b3d540df72b6f11fd8a6cd4b68ea6b0262a544a2))
* **product:** update delivery badge to Hanoi express ([2a06327](https://github.com/DongDuong2001/qmd-tech/commit/2a0632725dc4553e80f3abe1206f0e7be5e85f13))
* **security:** harden ip extraction against header spoofing in rate limiter ([63e754d](https://github.com/DongDuong2001/qmd-tech/commit/63e754d7e85901aa4add3ca420da0d9ea66f31e5))
* **security:** prevent timing attacks in admin authentication via timingSafeEqual ([2b30cdb](https://github.com/DongDuong2001/qmd-tech/commit/2b30cdb4df61c525688228e569fb764d7b878533))
* **security:** resolve jwt secret dynamically to prevent build-time failure ([cf0d423](https://github.com/DongDuong2001/qmd-tech/commit/cf0d4230945656d5cb9cc3ea3ea3f7ce88c95ca6))
* **styles:** move heading base styles to layer base with color inherit ([1687dee](https://github.com/DongDuong2001/qmd-tech/commit/1687deebdb459f09eb3f391ab8b56f91971f9665))
* **upload:** remove svg upload support and enforce magic byte validation ([bc75080](https://github.com/DongDuong2001/qmd-tech/commit/bc750801230bb5ffe4c8dbdd66688d52bd274b25))
* **warranty:** update on-site terms to Hanoi and 1-3 days courier nationwide ([ce638c9](https://github.com/DongDuong2001/qmd-tech/commit/ce638c9fe70fd2da1aa74ad81f346fa949b793c9))


### Features

* **admin:** add admin api route for mega menu customization and reset ([03c5fa7](https://github.com/DongDuong2001/qmd-tech/commit/03c5fa7e6a55986f8f6c1b1640a5924c604144d3))
* **admin:** add admin career applications API route ([7d88e84](https://github.com/DongDuong2001/qmd-tech/commit/7d88e8439fe86e7bf9adb349f01625ad99b743c2))
* **admin:** add career applications management methods to AdminService ([386d6fc](https://github.com/DongDuong2001/qmd-tech/commit/386d6fca3779eb6d4bdfd17d9ad207f44fb6b0a4))
* **admin:** add career applications review tab and candidate review modal ([082f778](https://github.com/DongDuong2001/qmd-tech/commit/082f7785028dc4cf34ff018a0de8bacfd75223a2))
* **admin:** add career management methods to admin service ([734426a](https://github.com/DongDuong2001/qmd-tech/commit/734426aa675b441e6eb1829035b4373ec9c3c489))
* **admin:** add career management tab with table and add edit modals ([a5d90dc](https://github.com/DongDuong2001/qmd-tech/commit/a5d90dc0268d3e04321426edd217e70b81840ed1))
* **admin:** add edit product modal and auto-formatted vnd price inputs ([a6ba3de](https://github.com/DongDuong2001/qmd-tech/commit/a6ba3deeb1a4d9388ca83d2b1e159d6ed48e9258))
* **admin:** add mega menu management methods to AdminService ([5cb8a8e](https://github.com/DongDuong2001/qmd-tech/commit/5cb8a8e66f77c01521716ce3ea8442603498d831))
* **admin:** add visual mega menu customizer with live editing and reordering ([0a14cae](https://github.com/DongDuong2001/qmd-tech/commit/0a14cae36f9ef5864145db0339fec74d97d9a12c))
* **api:** add admin careers crud endpoints with auth guard ([cce5d29](https://github.com/DongDuong2001/qmd-tech/commit/cce5d2993fcda4a7f58788619da9ca15a1e8a349))
* **api:** add location provinces endpoint for 34 administrative units ([5f49f66](https://github.com/DongDuong2001/qmd-tech/commit/5f49f660878d982f7f4687c333dbfb54e9b876e8))
* **api:** add location wards endpoint for 2-tier administrative divisions ([737b5f6](https://github.com/DongDuong2001/qmd-tech/commit/737b5f697c00a541f5255c3542bab965747c46f4))
* **api:** add public careers listing endpoint ([8e4f7fc](https://github.com/DongDuong2001/qmd-tech/commit/8e4f7fc8889836a36c16c9df1df527fdf5bcbde0))
* **careers:** add application data contracts and status types ([29319eb](https://github.com/DongDuong2001/qmd-tech/commit/29319ebba27b8d9e0089b11d4df710996990faca))
* **careers:** add candidate application management and PDF validation to CareerService ([961b693](https://github.com/DongDuong2001/qmd-tech/commit/961b693414ccdc5eac81263fb6257f84acb602df))
* **careers:** add optional id field to UpdateApplicationStatusInput ([280f7c9](https://github.com/DongDuong2001/qmd-tech/commit/280f7c93a398bff6f9e4d886e956ecaf33e7713c))
* **careers:** add PDF resume upload to quick apply modal on career page ([bc6e3a0](https://github.com/DongDuong2001/qmd-tech/commit/bc6e3a080e3c4bbb2515cf5d5150b326d9b8fac3))
* **careers:** add public candidate application endpoint with PDF validation ([fae00c3](https://github.com/DongDuong2001/qmd-tech/commit/fae00c3f935d89262f9a03a155cc6d8263b6f394))
* **careers:** add resilient timeout guard and url pathname slug extraction ([914cac0](https://github.com/DongDuong2001/qmd-tech/commit/914cac0ebd9fdcc8a3a0b18f4d66900d01568bbb))
* **careers:** define career job and input types ([e5adf28](https://github.com/DongDuong2001/qmd-tech/commit/e5adf28ab8d325daf3cf671d7b7554175e48d11d))
* **careers:** implement career service with defaults and crud ([76958d6](https://github.com/DongDuong2001/qmd-tech/commit/76958d6af1e9c6b790c1e0260838a162e4fe67f4))
* **careers:** support diacritics and space-agnostic search in getApplicationsAdmin ([80c4410](https://github.com/DongDuong2001/qmd-tech/commit/80c441058d96e675d9b6e8f58cddbcbc4e5be87a))
* **catalog:** add slug normalization and aliasing for hardware categories ([0cb5435](https://github.com/DongDuong2001/qmd-tech/commit/0cb5435493ea528eabe0a69418b39a8979be954f))
* **catalog:** enable searchParams query and brand filtering in categories page ([278f3c0](https://github.com/DongDuong2001/qmd-tech/commit/278f3c0e1a40cc26c1190fbe8d8fa9f754212bf5))
* **catalog:** sanitize search queries and expand search fields ([17acb99](https://github.com/DongDuong2001/qmd-tech/commit/17acb991a33a6a07afab28ea1cedebc8a97790c2))
* **catalog:** support searchParams filtering and remove english subtitle in category detail ([ca7ab83](https://github.com/DongDuong2001/qmd-tech/commit/ca7ab83b1c54eed2c6e15d01f64490588f9c5f99))
* **checkout:** add dynamic 34 provinces and wards linked selectors ([41cab5d](https://github.com/DongDuong2001/qmd-tech/commit/41cab5d294f84c5ada7b5c1e676f83103611fb72))
* **checkout:** add dynamic hanoi delivery notice and remove vnpay and momo payment options ([5e35457](https://github.com/DongDuong2001/qmd-tech/commit/5e3545791e61f799be41d481108d453d2e3cc785))
* **contact:** update delivery timeline policy for hanoi and other provinces ([fdfc1cb](https://github.com/DongDuong2001/qmd-tech/commit/fdfc1cb99cbccafdfc20659bfe2c37caed2defe7))
* **db:** add career applications table migration with pdf attachment support ([cf7ad6a](https://github.com/DongDuong2001/qmd-tech/commit/cf7ad6aa291bfda049678c7c4e49b2e5ee9961ac))
* **db:** add careers table schema migration ([4ba5693](https://github.com/DongDuong2001/qmd-tech/commit/4ba5693eb754032902fa1e5d25f63deaf0784ec9))
* **db:** add migration for mega_menu_settings table ([cf4eb9e](https://github.com/DongDuong2001/qmd-tech/commit/cf4eb9eb44b1d64a6b9c5ecae829cec5378a2ed3))
* **footer:** update delivery policy, add career link, and remove momo badge ([73fbe3f](https://github.com/DongDuong2001/qmd-tech/commit/73fbe3f8f1187d926f4349559ffb611a59903c80))
* **i18n:** restrict application locales to vietnamese only ([ac67894](https://github.com/DongDuong2001/qmd-tech/commit/ac67894cfce7d4e97d93b1ed1abdfa98d96debca))
* **i18n:** update request locale fallback for vietnamese routing ([54bce1f](https://github.com/DongDuong2001/qmd-tech/commit/54bce1f3fafc038a140b7b2f643dbe9e7bf487a9))
* **layout:** integrate category mega menu dropdown in desktop header and mobile drawer ([bc61e2f](https://github.com/DongDuong2001/qmd-tech/commit/bc61e2f8d095c8630fa771565983aadc3de60a85))
* **layout:** validate vietnamese locale in root layout ([ff8e17a](https://github.com/DongDuong2001/qmd-tech/commit/ff8e17a8865f1f1c74d799d17b5a6373b6d50c06))
* **location:** add official 34 provinces dataset fallback ([69c50e2](https://github.com/DongDuong2001/qmd-tech/commit/69c50e2e223c33cfc533250e9920bab5a49dec14))
* **location:** implement 34 provinces and wards service with online and fallback data ([72bb37c](https://github.com/DongDuong2001/qmd-tech/commit/72bb37cd5e470a7adf0f27dd1075a41850c23b50))
* **menu:** add initial local mega menu dataset fallback ([141c467](https://github.com/DongDuong2001/qmd-tech/commit/141c4670144dec98b34674c5dae45774c279c9e3))
* **menu:** add MenuService with database and disk persistence ([0abe9ee](https://github.com/DongDuong2001/qmd-tech/commit/0abe9ee6d71acae7c7cf3fe6cfeb9370c1e0dbcb))
* **menu:** add public GET api route for storefront mega menu ([738e496](https://github.com/DongDuong2001/qmd-tech/commit/738e4965e1a3ad197775cb4b51cb96a3ba8e4fee))
* **middleware:** redirect legacy english routes to vietnamese ([f909cfd](https://github.com/DongDuong2001/qmd-tech/commit/f909cfd4ea961996d4ab0c4c73742d46aac4f9dd))
* **navigation:** add 2-column category mega menu dropdown and mobile accordion ([bcc7b3a](https://github.com/DongDuong2001/qmd-tech/commit/bcc7b3a713746c7b7821d0210ce69193de3001cf))
* **navigation:** add icon resolver and serializable iconName to mega menu models ([b63c9de](https://github.com/DongDuong2001/qmd-tech/commit/b63c9def996f8f78a5d25c58a35d530080088308))
* **navigation:** connect desktop and mobile mega menu to dynamic menu API ([cf3e260](https://github.com/DongDuong2001/qmd-tech/commit/cf3e2604540b41c60aecae9563859fed61b757e4))
* **navigation:** define structured hardware categories and sub-series for mega menu ([80f5495](https://github.com/DongDuong2001/qmd-tech/commit/80f54956890e848ded07608346e99f57cfd2bce6))
* **sanitize:** add universal slugifyVietnamese helper with NFD transliteration ([61478d4](https://github.com/DongDuong2001/qmd-tech/commit/61478d4f8788b263cb5a16f7eb335af20b6ddde4))
* **storefront:** create career recruitment page with filters and quick apply modal ([b8c9af8](https://github.com/DongDuong2001/qmd-tech/commit/b8c9af85db1950d02491279b6c07b07981b44b8e))
* **types:** export career types in shared types ([daecf10](https://github.com/DongDuong2001/qmd-tech/commit/daecf101542c1fececa03d0adc34f29608b1de76))

# [1.6.0](https://github.com/DongDuong2001/qmd-tech/compare/v1.5.4...v1.6.0) (2026-09-07)


### Bug Fixes

* **admin:** guard categories api with requireAdmin and remove cache fallback ([9122a22](https://github.com/DongDuong2001/qmd-tech/commit/9122a2246b6e6c4bf5bec8763fef0dab5f1d4a24))
* **admin:** guard products api with requireAdmin and remove cache fallback ([7979858](https://github.com/DongDuong2001/qmd-tech/commit/79798587816e0b5fe9619f54702ec4dcb1c74b8a))
* **api:** enforce cryptographic admin token verification for categories ([55229e1](https://github.com/DongDuong2001/qmd-tech/commit/55229e192ee4bdbcd5e412fe6dce0eb30b9c2516))
* **api:** enforce cryptographic admin token verification for products ([234b614](https://github.com/DongDuong2001/qmd-tech/commit/234b61469bf8c9633d342f5a1829b60f719191ca))
* **api:** enforce cryptographic admin token verification for settings ([9c6c05e](https://github.com/DongDuong2001/qmd-tech/commit/9c6c05e3b59d51740400421150bd7703df52570c))
* **api:** harden image upload with auth check, MIME validation, and rate limit ([a534dc1](https://github.com/DongDuong2001/qmd-tech/commit/a534dc1db147d19484edd4dd70f8a07121d83071))
* **api:** harden order creation with server-side price calculation and stock checks ([7ae0e17](https://github.com/DongDuong2001/qmd-tech/commit/7ae0e175a78684fba03796d7c2ef0c1efc0ddaf7))
* **auth:** eliminate default admin credentials and enforce fail-closed check ([4d76559](https://github.com/DongDuong2001/qmd-tech/commit/4d765590919c761f771c4d673ed5446965e6727f))
* **blog:** sanitize article html and add bilingual locale fallbacks ([3ccfa15](https://github.com/DongDuong2001/qmd-tech/commit/3ccfa158926a644de4a63569e704bcc8661b5dfc))
* **builder:** add socket normalization, cooler clearance, and radiator checks ([59216d4](https://github.com/DongDuong2001/qmd-tech/commit/59216d4e4affb8ca45a47edb369b304c1b00b659))
* **builder:** reference shared CompatibilityIssue type in CompatibilityCheckResult ([fe2fe3f](https://github.com/DongDuong2001/qmd-tech/commit/fe2fe3f63a50852fd738b215f57b7500e6d9549f))
* **builder:** sanitize slots and recalculate pricing server-side ([7a0d7b8](https://github.com/DongDuong2001/qmd-tech/commit/7a0d7b88c19a6871089d16c4816d5c460341f4d2))
* **builder:** use valid uuids and getServiceSupabase for reliable persistence ([6dfa0f4](https://github.com/DongDuong2001/qmd-tech/commit/6dfa0f4f6401372c45b5805cace7a36322ca5fb2))
* **checkout:** add double-submission guard and clean unused imports ([87d0290](https://github.com/DongDuong2001/qmd-tech/commit/87d0290b91b2c397c4e5d46dc65e183b270a0c96))
* **db:** enforce fail-closed supabase service role and disable session persistence ([507ca76](https://github.com/DongDuong2001/qmd-tech/commit/507ca764ab39aec9a1ab6fdf73f207b87354ebbb))
* **orders:** enforce fail-closed order creation and transition checks ([5026100](https://github.com/DongDuong2001/qmd-tech/commit/502610020c6abdc8450572bad63e67985a05479f))
* **orders:** generate uuid for orders and items with atomic stock decrement ([948c3ba](https://github.com/DongDuong2001/qmd-tech/commit/948c3babade8fa93a7bb865301359b7de6c52211))
* **payments:** add idempotency guard for already-paid orders in webhook handler ([9ac289f](https://github.com/DongDuong2001/qmd-tech/commit/9ac289f05843a3dc5e0a0313bc8377276a832169))
* **payments:** add rate limiting and order code format validation ([a03d1ad](https://github.com/DongDuong2001/qmd-tech/commit/a03d1ade6511e10629f493a94cc61b6af7feffd2))
* **payments:** check cancelled order state and verify markOrderPaid result ([7940593](https://github.com/DongDuong2001/qmd-tech/commit/794059352b5e154d1aea605945f1fd12e4157b90))
* **payments:** return 401 for unauthorized webhook and 500 on db errors ([e8281d0](https://github.com/DongDuong2001/qmd-tech/commit/e8281d00b4afc9b398930e538c4f099fceb7eacc))
* **payments:** strictly reject unconfigured SePay webhook in production ([c053870](https://github.com/DongDuong2001/qmd-tech/commit/c0538705ac6f0fe38341eae7b3d7abde06ba345d))
* **product:** escape json-ld script to prevent xss breakout ([559d31a](https://github.com/DongDuong2001/qmd-tech/commit/559d31a102b10dc49be248d53ba17fc184dbb7fa))
* resolve issues [#5](https://github.com/DongDuong2001/qmd-tech/issues/5) and [#6](https://github.com/DongDuong2001/qmd-tech/issues/6) - cart, checkout, pc builder slot selection and overlay, auth show/hide password and mobile register ([a9af8cc](https://github.com/DongDuong2001/qmd-tech/commit/a9af8ccdda3ac330f9be49fb1c5e781b07b8defd))
* **reviews:** verify user purchases against database and clamp ratings ([1626c8c](https://github.com/DongDuong2001/qmd-tech/commit/1626c8cb402669afd0871bfa201d1e22fbfb0010))
* **security:** enforce 32-character jwt secret requirement and validate claims ([57d5adf](https://github.com/DongDuong2001/qmd-tech/commit/57d5adf67c27ab451da1b0fa4ec8f8ee827aeffb))
* **security:** unref rate limiter cleanup timer for serverless runtime ([24fe791](https://github.com/DongDuong2001/qmd-tech/commit/24fe7914b20a11fd4e73affd69bad3fae0332efa))
* **settings:** protect settings api with requireAdmin guard ([cd29774](https://github.com/DongDuong2001/qmd-tech/commit/cd2977436c80316e79d6c9b6b0b06f7c4bc24797))
* **storefront:** remove admin links and technical security labels from customer-facing pages ([198d485](https://github.com/DongDuong2001/qmd-tech/commit/198d485fa4e1e4f71796a63dad3f2834a659b203))
* **types:** expand CompatibilityIssue type with clearance checks ([1824818](https://github.com/DongDuong2001/qmd-tech/commit/1824818cd13de8b4bc0372a6f8df4f1854a91733))


### Features

* **security:** create centralized requireAdmin middleware guard ([01d78fb](https://github.com/DongDuong2001/qmd-tech/commit/01d78fbd80a261484eb4797e1ec5dd5c03455b66))
* **security:** create html and json-ld sanitizers for xss prevention ([f4d1579](https://github.com/DongDuong2001/qmd-tech/commit/f4d1579378eecd676bacd7b76c0c4b82241384e3))

## [1.5.4](https://github.com/DongDuong2001/qmd-tech/compare/v1.5.3...v1.5.4) (2026-09-06)


### Bug Fixes

* **admin:** connect products and categories admin service to secure server endpoints to bypass RLS and enable persistent CRUD ([8f24a9d](https://github.com/DongDuong2001/qmd-tech/commit/8f24a9d257766313edd40d6a3f649c601c000edc))

## [1.5.3](https://github.com/DongDuong2001/qmd-tech/compare/v1.5.2...v1.5.3) (2026-09-06)


### Bug Fixes

* **upload:** implement server-side signed cloudinary upload route to prevent 400 preset error ([c5c7256](https://github.com/DongDuong2001/qmd-tech/commit/c5c725611b63b02bb6096f2281ba7470828343ae))

## [1.5.2](https://github.com/DongDuong2001/qmd-tech/compare/v1.5.1...v1.5.2) (2026-09-06)


### Bug Fixes

* **admin:** move DEFAULT_HARDWARE_CATEGORIES outside class definition ([594c45e](https://github.com/DongDuong2001/qmd-tech/commit/594c45ec9fd9d96323047b109a5c810398a460fb))

## [1.5.1](https://github.com/DongDuong2001/qmd-tech/compare/v1.5.0...v1.5.1) (2026-09-06)


### Bug Fixes

* **admin:** provide default hardware categories fallback, edit and seed methods ([d5c056e](https://github.com/DongDuong2001/qmd-tech/commit/d5c056e2ecec3da51cc9becef2621f36948e742b))
* **admin:** resolve category tab rendering, add search, edit modal, and seed action ([57418cf](https://github.com/DongDuong2001/qmd-tech/commit/57418cfa95c01db1f3041835f0363a9ed9494093))
* **catalog:** fallback to default hardware categories when database is empty ([2addabf](https://github.com/DongDuong2001/qmd-tech/commit/2addabf0a38ba18751b83e9b410a0fada3033b05))

# [1.5.0](https://github.com/DongDuong2001/qmd-tech/compare/v1.4.0...v1.5.0) (2026-09-06)


### Bug Fixes

* **api:** correct verifyJWT response parsing in settings route ([6ef39c8](https://github.com/DongDuong2001/qmd-tech/commit/6ef39c8917c8f42cfee5d1329708ef557311e4cd))


### Features

* **admin:** add comprehensive site settings and enterprise configuration dashboard tab ([ddd07ac](https://github.com/DongDuong2001/qmd-tech/commit/ddd07ac7fdef53b62b825f28fbed4cc87ffb82fe))
* **admin:** add secure portal streaming loading screen ([e40a2d1](https://github.com/DongDuong2001/qmd-tech/commit/e40a2d139dc2eeffb961e98a95ea8a071597adbd))
* **admin:** integrate cloudinary image upload in blog, banner, product, and deal modals ([8352c92](https://github.com/DongDuong2001/qmd-tech/commit/8352c92d98c66a55c11e1aea75f7736d11464783))
* **admin:** integrate cloudinary image uploader dialog in rich text editor ([0385004](https://github.com/DongDuong2001/qmd-tech/commit/03850048be9df1a2b0f5f85abb1795f229a30950))
* **admin:** update login input placeholder and initial form state ([5258b26](https://github.com/DongDuong2001/qmd-tech/commit/5258b261b72ecf402b88ce6bc32acd0c85496d10))
* **api:** add settings endpoints for dynamic site configuration ([ab18a33](https://github.com/DongDuong2001/qmd-tech/commit/ab18a332528e26a21e1b4d5cd267d2146a5fc998))
* **api:** create real-time payment status polling route ([041f252](https://github.com/DongDuong2001/qmd-tech/commit/041f252f494b943df9b68df9ae13326dbb87b378))
* **api:** create sepay ipn webhook receiver endpoint ([7f811a7](https://github.com/DongDuong2001/qmd-tech/commit/7f811a77820a6e44262dc184bdd08706865fb0f8))
* **app:** add root locale streaming suspense loading state ([69018df](https://github.com/DongDuong2001/qmd-tech/commit/69018df01bdf6672e16aad4244b1bc5cf9cd3fe9))
* **auth:** issue cryptographically signed jwt for admin authentication sessions ([76f14ca](https://github.com/DongDuong2001/qmd-tech/commit/76f14ca144f9be8088f88ccd0d3e37b5743c384e))
* **auth:** support configurable admin authentication credentials via environment variables ([ed44866](https://github.com/DongDuong2001/qmd-tech/commit/ed44866b6b8b1e749e7f34ad5f557a8c1c142e3e))
* **checkout:** create interactive sepay vietqr modal with live polling and copy helpers ([2a462a8](https://github.com/DongDuong2001/qmd-tech/commit/2a462a81f912eca19fdfb0f3fdfb42d59c367026))
* **checkout:** embed sepay vietqr modal and configure sepay as default payment method ([8530be3](https://github.com/DongDuong2001/qmd-tech/commit/8530be35bc862d8e1421e263e193f9e3a153d4e6))
* **home:** replace mock product counts and meters with dynamic database data ([66f4735](https://github.com/DongDuong2001/qmd-tech/commit/66f4735324ab02b743255aabba5b8243b5c06226))
* **layout:** integrate PagePreloader into root locale layout ([7bd4701](https://github.com/DongDuong2001/qmd-tech/commit/7bd47017a075de5896abe2fe66ca8100c27e6c3b))
* **media:** implement cloudinary optimization utilities and quota preservation helpers ([715d866](https://github.com/DongDuong2001/qmd-tech/commit/715d86647c046904acfe69315c7a43b4c9153dec))
* **middleware:** verify admin jwt token signature and expiration on edge runtime ([ccd3da6](https://github.com/DongDuong2001/qmd-tech/commit/ccd3da6515d48ae5cd8a9e37de57d1b8903b1e56))
* **orders:** include sepay in order creation payment method types ([47ad720](https://github.com/DongDuong2001/qmd-tech/commit/47ad720f738b121159cf513f6ff459c2ceb443b6))
* **payment:** add bank name normalizer and update env template ([93ba609](https://github.com/DongDuong2001/qmd-tech/commit/93ba609cc1e7194ad3879504d71f7f1ecd3bdd73))
* **payments:** define sepay webhook payload and provider schema ([0e08830](https://github.com/DongDuong2001/qmd-tech/commit/0e088309995b762740cf75ec4daecb4badc0b84e))
* **payments:** implement sepay vietqr gateway adapter ([d5c0d40](https://github.com/DongDuong2001/qmd-tech/commit/d5c0d40ef0d5ceafe2eab8f1ef89ac92ad18a140))
* **payments:** integrate sepay payment generation and webhook reconciliation ([22e4bae](https://github.com/DongDuong2001/qmd-tech/commit/22e4bae975fda26c31330b286af0a2f486bdbd02))
* **security:** implement web crypto based hmac sha256 jwt signing and verification ([80de003](https://github.com/DongDuong2001/qmd-tech/commit/80de003ac5291d38056854b5b2b03a6fb0b008b5))
* **settings:** create SettingsService with dynamic online model and Bo Cong Thuong defaults ([50e1e36](https://github.com/DongDuong2001/qmd-tech/commit/50e1e365dc466316b02f5e212bb6036237e82552))
* **types:** add sepay payment provider to domain types ([eeea9b2](https://github.com/DongDuong2001/qmd-tech/commit/eeea9b2a4a1f8edc1f446c775a86f70f3836577f))
* **types:** add SiteSettings and ShowroomLocation interfaces for dynamic configuration ([5ecddc1](https://github.com/DongDuong2001/qmd-tech/commit/5ecddc1b5049bdf5bd1b17eb7e6746d2ca1ddcd2))
* **ui:** add PagePreloader for smooth page load transition and dissolve effect ([962b86c](https://github.com/DongDuong2001/qmd-tech/commit/962b86ca87b1932883bba23b633ba325bbe46559))
* **ui:** create cloudinary image upload component with client compression and dropzone ([dd288c5](https://github.com/DongDuong2001/qmd-tech/commit/dd288c53df93acb943b6615d7b32fe2952cccc56))
* **ui:** implement animated wipe hover effect across all button variants ([225a3f8](https://github.com/DongDuong2001/qmd-tech/commit/225a3f865dbd16b303ea8f4ca73e93e52a9ac2a6))
* **ui:** implement reusable TechLoader component with balanced animation timing ([4eb30ac](https://github.com/DongDuong2001/qmd-tech/commit/4eb30acef1436dc92984e51668fb650b85025bd7))

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
