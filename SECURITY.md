# Security Policy and Information Security Guidelines - QMD Tech

This document establishes the security policies, defense architectures, and vulnerability disclosure procedures for the QMD Tech platform.

---

## 1. Vulnerability Reporting and Responsible Disclosure Policy

QMD Tech places paramount importance on customer data protection and system reliability. If you identify a security vulnerability, do not disclose it publicly, exploit it, or compromise system data in any way.

Please report all findings directly via email:
- Primary Contact: Dong Duong (QMD Tech Lead)
- Email Address: dongduong840@gmail.com
- Expected Response Time: Within 24 hours of report receipt

Please include the following details in your report:
- Type of vulnerability and estimated severity/impact
- Step-by-step reproduction instructions, including sample payloads where applicable
- Potential impact on users, infrastructure, or data integrity
- Recommended remediations or mitigation strategies, if known

QMD Tech is committed to verifying, investigating, and resolving all valid security issues promptly.

---

## 2. System Security Architecture

The QMD Tech platform incorporates defense-in-depth measures across the network, application layer, and database:

### 2.1. Session Authentication via HttpOnly Cookies
- Raw JWT access and refresh tokens are strictly forbidden from being stored in client-side `localStorage` or `sessionStorage`.
- All authentication sessions are managed exclusively on the server using secure HttpOnly Cookies:
  - `httpOnly: true`: Prevents client-side JavaScript from accessing session tokens, eliminating session theft through Cross-Site Scripting (XSS).
  - `secure: true`: Mandates encrypted transmission over SSL/TLS (HTTPS) in production environments.
  - `sameSite: "lax"`: Provides robust protection against Cross-Site Request Forgery (CSRF).
  - Dynamic expiration management: 30-day persistence when "Remember Me" is selected versus a 24-hour transient session.

### 2.2. Defense Against Brute-Force Attacks (Rate Limiting)
An in-memory sliding-window rate limiter monitors IP activity on sensitive authentication endpoints:
- Login Endpoint (`/api/auth/login`): Constrained to a maximum of 5 attempts per 60 seconds per IP address. Exceeding this threshold results in an HTTP 429 Too Many Requests response with an active `Retry-After` header.
- Registration Endpoint (`/api/auth/register`): Constrained to 3 account creations per 10 minutes per IP address to prevent registration spam.
- Automated Garbage Collection: Expired tracking records are automatically purged from memory every 60 seconds.

### 2.3. HTTP Security Headers
Every server response includes industry-standard security headers injected via Middleware:
- `X-Frame-Options: DENY`: Prevents the application from being framed within an iframe, defending against Clickjacking attacks.
- `X-Content-Type-Options: nosniff`: Instructs browsers not to sniff MIME types away from the declared content-type.
- `Referrer-Policy: strict-origin-when-cross-origin`: Protects referrer information during cross-origin navigation.
- `X-XSS-Protection: 1; mode=block`: Activates built-in browser XSS filtering.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`: Disables access to sensitive browser device features.

### 2.4. Database Isolation and Access Control (Supabase RLS)
- PostgreSQL applies Row-Level Security (RLS) policies across all primary tables: `products`, `categories`, `orders`, `order_items`, `builds`, and `reviews`.
- Client environments access data strictly through the Public Anon Key restricted to authorized read operations.
- All administrative mutations (creation, updates, deletions) require verified administrative authentication.

---

## 3. Developer Security Rules

All developers contributing to the QMD Tech codebase must adhere to the following mandatory standards:

1. Never Commit Sensitive Secrets:
   - The `.env.local` file containing Supabase credentials must remain strictly ignored in `.gitignore`.
   - Never hardcode API keys, passwords, database URLs, or secret tokens directly into code.
2. Comprehensive Input Validation:
   - All user submissions must undergo schema validation and format sanitization (email regex, Vietnamese phone format, minimum 8-character password length).
3. Pre-Commit Hygiene:
   - Run `git status` prior to committing to ensure no unintended files are staged.
   - If a sensitive file is accidentally staged, immediately run `git restore --staged <file_path>` before committing.
