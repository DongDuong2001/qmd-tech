/**
 * Universal HTML and JSON-LD Sanitizer for XSS Prevention.
 * Strips active script vectors, malicious schemas, event handlers, and embeds.
 */

import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li", "blockquote",
  "a", "img", "pre", "code", "br", "hr",
  "table", "thead", "tbody", "tr", "th", "td",
  "span", "div", "figure", "figcaption"
];

export function sanitizeHtml(html: string | undefined | null): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  return sanitize(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["class", "id"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      a: ["http", "https", "mailto", "tel"],
      img: ["http", "https", "data"],
    },
  });
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
