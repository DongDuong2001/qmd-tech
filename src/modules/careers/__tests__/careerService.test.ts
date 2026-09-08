import { describe, it, expect } from "vitest";
import { CareerService, sanitizeCareerSlug } from "../service";

describe("CareerService and Slug Sanitizer", () => {
  it("sanitizes Vietnamese job title into kebab-case slug", () => {
    const slug = sanitizeCareerSlug(
      "",
      "Kỹ Thuật Viên Lắp Ráp & Test Hệ Thống PC Gaming"
    );
    expect(slug).toBe("ky-thuat-vien-lap-rap-test-he-thong-pc-gaming");
  });

  it("strips full URLs and query parameters from raw slug input", () => {
    const slug = sanitizeCareerSlug(
      "https://qmdtech.vn/careers/chuyen-vien-tu-van-pc?source=fb#apply",
      "Fallback Title"
    );
    expect(slug).toBe("chuyen-vien-tu-van-pc");
  });

  it("returns active careers for storefront display", async () => {
    const service = new CareerService();
    const publicJobs = await service.getPublicCareers();
    expect(publicJobs.length).toBeGreaterThan(0);
    expect(publicJobs.every((j) => j.is_active)).toBe(true);
  });

  it("validates mandatory fields and creates a new career posting", async () => {
    const service = new CareerService();

    await expect(
      service.createCareer({
        title: "",
        department: "Kỹ Thuật",
        salary: "15.000.000₫",
        description: "Mô tả",
        requirements: "Yêu cầu",
      })
    ).rejects.toThrow("Vui lòng nhập tên vị trí tuyển dụng.");

    const created = await service.createCareer({
      title: "Chuyên Viên Đóng Gói Vận Chuyển Hà Nội",
      department: "Kho Vận & Logistics",
      salary: "9.000.000₫ - 13.000.000₫",
      description: "Đóng gói bọc bọt khí chống sốc 3 lớp linh kiện PC",
      requirements: "Cẩn thận, sức khỏe tốt",
      location: "Hà Nội",
    });

    expect(created.id).toBeDefined();
    expect(created.slug).toBe("chuyen-vien-dong-goi-van-chuyen-ha-noi");
    expect(created.salary).toBe("9.000.000₫ - 13.000.000₫");

    // Test update
    const updated = await service.updateCareer(created.id, {
      salary: "10.000.000₫ - 14.000.000₫",
    });
    expect(updated?.salary).toBe("10.000.000₫ - 14.000.000₫");

    // Test delete
    const deleted = await service.deleteCareer(created.id);
    expect(deleted).toBe(true);
    const notFound = await service.getCareerBySlug(created.slug);
    expect(notFound).toBeNull();
  });
});
