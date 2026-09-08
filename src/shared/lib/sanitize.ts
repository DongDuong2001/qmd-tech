/**
 * Universal HTML and JSON-LD Sanitizer for XSS Prevention.
 * Strips active script vectors, malicious schemas, event handlers, and embeds.
 */

const DANGEROUS_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
  "applet",
  "meta",
  "link",
  "style",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "base",
];

export function sanitizeHtml(html: string | undefined | null): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  let sanitized = html;

  // 1. Remove dangerous paired tags and their contents
  for (const tag of DANGEROUS_TAGS) {
    const pairedRegex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
    sanitized = sanitized.replace(pairedRegex, "");

    // Remove self-closing or lone opening tags
    const loneRegex = new RegExp(`<${tag}[^>]*\\/?>`, "gi");
    sanitized = sanitized.replace(loneRegex, "");
  }

  // 2. Strip inline event handlers (onclick, onerror, onload, onmouseover, etc.)
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  // 3. Strip dangerous protocol schemes in attributes (javascript:, data:text/html, vbscript:)
  sanitized = sanitized.replace(
    /(href|src|action|formaction)\s*=\s*["']?\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^"'>\s]*["']?/gi,
    '$1="#"'
  );

  return sanitized;
}

/**
 * Escapes closing script tags in JSON strings to prevent breaking out of <script type="application/ld+json">.
 */
export function escapeJsonLd(jsonString: string): string {
  if (!jsonString || typeof jsonString !== "string") {
    return "";
  }
  return jsonString.replace(/<\/script/gi, "\\u003c/script");
}

/**
 * Universal Vietnamese slug generator.
 * Normalizes unicode diacritics (NFD), maps đ/Đ to d, removes non-alphanumeric chars,
 * and collapses multiple hyphens into a clean SEO-friendly slug.
 */
export function slugifyVietnamese(text?: string | null, fallback: string = "item"): string {
  if (!text || typeof text !== "string") {
    return fallback;
  }

  // If text is a full URL, extract the pathname segment
  let cleaned = text.trim();
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://") || cleaned.includes("://")) {
    try {
      const url = new URL(cleaned);
      const segments = url.pathname.split("/").filter(Boolean);
      cleaned = segments.pop() || fallback;
    } catch {
      cleaned = cleaned.replace(/^https?:\/\/[^/]+/i, "").replace(/^\/+/, "");
      cleaned = cleaned.split("?")[0].split("#")[0];
    }
  } else if (cleaned.includes("?")) {
    cleaned = cleaned.split("?")[0];
  }

  const slug = cleaned
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || fallback;
}
