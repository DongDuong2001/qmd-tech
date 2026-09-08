import { describe, it, expect } from "vitest";
import { slugifyVietnamese } from "../sanitize";

describe("slugifyVietnamese Universal Helper", () => {
  it("should accurately transliterate Vietnamese diacritics into clean ASCII slug", () => {
    const input = "Bộ vi xử lý Intel Core i9 14900KS";
    const result = slugifyVietnamese(input);
    expect(result).toBe("bo-vi-xu-ly-intel-core-i9-14900ks");
  });

  it("should accurately map uppercase and lowercase đ and Đ to d", () => {
    const input = "Đồ họa đỉnh cao và Màn hình OLED";
    const result = slugifyVietnamese(input);
    expect(result).toBe("do-hoa-dinh-cao-va-man-hinh-oled");
  });

  it("should extract slug from full URLs with protocols and queries", () => {
    const url = "https://qmdtech.vn/san-pham/card-man-hinh-asus-rtx-4090?utm_source=fb";
    const result = slugifyVietnamese(url);
    expect(result).toBe("card-man-hinh-asus-rtx-4090");
  });

  it("should strip special characters, symbols, and collapse consecutive hyphens", () => {
    const input = "VGA ASUS TUF Gaming @#$% RTX 4070 Ti (Super) -- 16GB";
    const result = slugifyVietnamese(input);
    expect(result).toBe("vga-asus-tuf-gaming-rtx-4070-ti-super-16gb");
  });

  it("should return fallback for empty, null, or undefined values", () => {
    expect(slugifyVietnamese("")).toBe("item");
    expect(slugifyVietnamese(null, "default-fallback")).toBe("default-fallback");
    expect(slugifyVietnamese("   !@#$%^&*()   ", "san-pham")).toBe("san-pham");
  });
});
