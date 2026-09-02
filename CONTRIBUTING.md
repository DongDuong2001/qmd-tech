# Contribution Guidelines and Development Standards - QMD Tech

This document outlines the internal development policies, branching standards, and engineering practices for developers invited to collaborate on the QMD Tech e-commerce platform.

---

## 1. Project Scope and Ownership

- QMD Tech is a proprietary commercial software project owned and operated exclusively by QMD Tech Corporation.
- This codebase is not an open-source public repository. All source code, visual UI assets, software architectures, and database schemas remain private, confidential property.
- Copying, redistributing, publicly hosting, or transferring this software to third parties without prior written consent is strictly prohibited.
- For partnership inquiries, licensing requests, or permission to utilize any component of this software, contact: dongduong840@gmail.com

---

## 2. Team Development Workflow

### 2.1. Branching Strategy
- The `main` branch is strictly reserved for production releases. Direct commits to `main` are prohibited.
- Active integration and feature development occurs on the `feat/real-data-admin-auth` branch.
- When developing new features or fixing defects, create a descriptive topic branch off the active development branch:
  - Feature work: `feat/feature-name`
  - Bug fixes: `fix/defect-name`
  - Documentation: `docs/documentation-topic`
  - Styling adjustments: `style/component-name`

### 2.2. Daily Development Routine
1. Always run `git pull origin feat/real-data-admin-auth` before beginning your workday.
2. Develop and test your changes locally.
3. Review modified files using `git status` and `git diff`.
4. Stage only relevant files with `git add <file_path>`. Never stage `.env.local`.
5. Write clear commit messages conforming to Conventional Commits.
6. Run the four mandatory pre-push verification checks:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
7. Push your branch to GitHub using `git push origin <branch_name>`.
8. Open a Pull Request targeting `feat/real-data-admin-auth` for code review.

---

## 3. Conventional Commits Standard

All commit messages must adhere to the following specification:
```
<type>(<scope>): <concise_description>
```

Accepted commit types:
- `feat`: A new feature added to the platform
- `fix`: A defect or bug resolution
- `style`: Markup, spacing, CSS, or styling adjustments with no logic changes
- `refactor`: Structural code reorganization with no behavioral alteration
- `perf`: Performance optimizations
- `test`: Unit tests or integration test adjustments
- `docs`: Documentation revisions or additions
- `chore`: Dependency updates or build tooling adjustments

Valid commit examples:
- `feat(auth): implement remember me with 30 day cookie expiration`
- `fix(builder): correct power wattage calculation for high end gpu`
- `docs(security): document vulnerability disclosure channel`

---

## 4. Code and Architecture Standards

1. Strict TypeScript Compliance: Explicit typing is required across all components, hooks, and domain services. The use of uncontrolled `any` is strictly prohibited.
2. Light Theme Visual Consistency: The application strictly utilizes the curated solid light palette (`#0F172A`, `#E11D48`, `#EA580C`, `#B45309`, `#16A34A`, `#2563EB`, `#FFFFFF`, `#F8FAFC`, `#E2E8F0`). Do not introduce extraneous gradient layers or unapproved dark backgrounds.
3. Code Integrity: Preserve all preexisting architectural comments, domain logic docstrings, and interface annotations unless an explicit instruction specifies otherwise.
4. Robust Asynchronous Handling: All external API interactions (Supabase, payment gateways, authentication) must be wrapped in `try...catch` blocks with user-friendly error feedback.

---

## 5. Support and Communications

If you encounter difficulties during local environment setup or have architectural questions, contact the project maintainer:

- Maintainer: Dong Duong
- Email: dongduong840@gmail.com
- Repository: https://github.com/DongDuong2001/qmd-tech
