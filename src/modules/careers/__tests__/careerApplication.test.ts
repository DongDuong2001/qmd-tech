import { describe, it, expect } from "vitest";
import {
  CareerService,
  isPdfBuffer,
  isPdfDataUri,
  SAMPLE_PDF_BASE64,
} from "../service";

describe("Career Applications & PDF Resume Attachment", () => {
  it("validates PDF magic bytes correctly", () => {
    // Valid PDF buffer starting with %PDF (0x25, 0x50, 0x44, 0x46)
    const validPdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
    expect(isPdfBuffer(validPdfBuffer)).toBe(true);

    // Invalid buffer (e.g., PNG header 0x89, 0x50, 0x4E, 0x47)
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(isPdfBuffer(pngBuffer)).toBe(false);

    // Empty or short buffer
    expect(isPdfBuffer(Buffer.from([0x25, 0x50]))).toBe(false);
  });

  it("validates PDF Base64 Data URIs correctly", () => {
    expect(isPdfDataUri(SAMPLE_PDF_BASE64)).toBe(true);

    // Non-PDF data URI
    expect(isPdfDataUri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==")).toBe(false);
    expect(isPdfDataUri("https://example.com/file.pdf")).toBe(false);
    expect(isPdfDataUri("")).toBe(false);
  });

  it("validates candidate inputs during submission", async () => {
    const service = new CareerService();

    // Missing candidate name
    await expect(
      service.submitApplication({
        job_title: "Kỹ Thuật Viên PC",
        full_name: "",
        email: "an@example.com",
        phone: "0912345678",
        resume_url: SAMPLE_PDF_BASE64,
        resume_filename: "CV.pdf",
        resume_file_size: 500,
      })
    ).rejects.toThrow("Vui lòng nhập họ và tên ứng viên.");

    // Invalid email
    await expect(
      service.submitApplication({
        job_title: "Kỹ Thuật Viên PC",
        full_name: "Nguyễn Văn An",
        email: "not-an-email",
        phone: "0912345678",
        resume_url: SAMPLE_PDF_BASE64,
        resume_filename: "CV.pdf",
        resume_file_size: 500,
      })
    ).rejects.toThrow("Vui lòng nhập địa chỉ email hợp lệ.");

    // Missing phone
    await expect(
      service.submitApplication({
        job_title: "Kỹ Thuật Viên PC",
        full_name: "Nguyễn Văn An",
        email: "an@example.com",
        phone: "",
        resume_url: SAMPLE_PDF_BASE64,
        resume_filename: "CV.pdf",
        resume_file_size: 500,
      })
    ).rejects.toThrow("Vui lòng nhập số điện thoại liên hệ.");

    // Invalid resume format
    await expect(
      service.submitApplication({
        job_title: "Kỹ Thuật Viên PC",
        full_name: "Nguyễn Văn An",
        email: "an@example.com",
        phone: "0912345678",
        resume_url: "data:text/plain;base64,SGVsbG8=",
        resume_filename: "CV.txt",
        resume_file_size: 100,
      })
    ).rejects.toThrow("File đính kèm không đúng định dạng PDF hợp lệ.");
  });

  it("submits a valid application and retrieves it in admin list", async () => {
    const service = new CareerService();

    const newApp = await service.submitApplication({
      career_id: "job-tech-01",
      job_title: "Kỹ Thuật Viên Lắp Ráp & Cài Đặt PC",
      full_name: "Lê Hoàng Nam",
      email: "nam.le@example.com",
      phone: "0909123456",
      experience: "3 năm ráp PC gaming custom",
      introduction: "Đam mê tản nhiệt nước custom và đi dây thẩm mỹ.",
      resume_url: SAMPLE_PDF_BASE64,
      resume_filename: "CV_LeHoangNam_KyThuat.pdf",
      resume_file_size: 485,
    });

    expect(newApp.id).toBeDefined();
    expect(newApp.status).toBe("pending");
    expect(newApp.full_name).toBe("Lê Hoàng Nam");
    expect(newApp.resume_filename).toBe("CV_LeHoangNam_KyThuat.pdf");

    // Admin retrieval
    const allApps = await service.getApplicationsAdmin();
    expect(allApps.some((a) => a.id === newApp.id)).toBe(true);

    // Search filter
    const searchResults = await service.getApplicationsAdmin({ search: "LeHoangNam" });
    expect(searchResults.some((a) => a.id === newApp.id)).toBe(true);

    // Status update
    const updated = await service.updateApplicationStatus(newApp.id, {
      status: "interview",
      notes: "Hẹn phỏng vấn vào 14h chiều thứ Tư tại trụ sở Cầu Giấy.",
    });
    expect(updated?.status).toBe("interview");
    expect(updated?.notes).toContain("Hẹn phỏng vấn");

    // Delete application
    const deleteRes = await service.deleteApplication(newApp.id);
    expect(deleteRes).toBe(true);

    const afterDelete = await service.getApplicationsAdmin();
    expect(afterDelete.some((a) => a.id === newApp.id)).toBe(false);
  });
});
