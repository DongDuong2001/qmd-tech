import { describe, it, expect } from "vitest";
import { sanitizeSlug, blogService } from "@/modules/blog/service";

describe("blogService - sanitizeSlug helper", () => {
  it("converts Vietnamese title to clean lowercase slug", () => {
    const slug = sanitizeSlug(
      "",
      "Noctua chính thức ra mắt NL-LC1 – AIO đầu tiên của hãng, tập trung vào hiệu năng và độ êm"
    );
    expect(slug).toBe("noctua-chinh-thuc-ra-mat-nl-lc1-aio-dau-tien-cua-hang-tap-trung-vao-hieu-nang-va-do-em");
  });

  it("extracts path segment from full external URLs and strips query params", () => {
    const url = "https://www.noctua.at/en/news/noctua-introduces-nl-lc1-all-in-one-liquid-coolers?utm_source=chatgpt.com";
    const slug = sanitizeSlug(url);
    expect(slug).toBe("noctua-introduces-nl-lc1-all-in-one-liquid-coolers");
  });

  it("handles empty input with random timestamp fallback", () => {
    const slug = sanitizeSlug("");
    expect(slug.startsWith("post-")).toBe(true);
  });

  it("cleans special characters, symbols, and multiple dashes", () => {
    const raw = "  ---ASUS ROG Strix RTX 5090 @#% Gaming (2026)---  ";
    const slug = sanitizeSlug(raw);
    expect(slug).toBe("asus-rog-strix-rtx-5090-gaming-2026");
  });
});
