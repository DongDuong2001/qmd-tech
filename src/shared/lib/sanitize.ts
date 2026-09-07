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
