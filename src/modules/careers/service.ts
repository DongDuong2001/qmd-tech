import { supabase, getServiceSupabase } from "@/shared/db/supabase";
import {
  CareerJob,
  CreateCareerInput,
  UpdateCareerInput,
  CareerApplication,
  SubmitApplicationInput,
  UpdateApplicationStatusInput,
  ApplicationStatus,
} from "./types";

export function sanitizeCareerSlug(rawSlug?: string, fallbackTitle?: string): string {
  let text = (rawSlug || "").trim();

  // If empty, use fallback title
  if (!text && fallbackTitle) {
    text = fallbackTitle.trim();
  }

  // If text is a full URL
  if (text.startsWith("http://") || text.startsWith("https://") || text.includes("://")) {
    try {
      const url = new URL(text);
      const segments = url.pathname.split("/").filter(Boolean);
      text = segments.pop() || fallbackTitle || "vi-tri-tuyen-dung";
    } catch {
      text = text.replace(/^https?:\/\/[^/]+/i, "").replace(/^\/+/, "");
      text = text.split("?")[0].split("#")[0];
    }
  } else if (text.includes("?")) {
    text = text.split("?")[0];
  }

  // Vietnamese diacritic transliteration
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `career-${Date.now()}`;
}

async function withTimeout<T>(promise: PromiseLike<T>, ms = 1200): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Supabase query timeout")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export function isPdfBuffer(buffer: Uint8Array | Buffer): boolean {
  if (!buffer || buffer.length < 4) return false;
  return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
}

export function isPdfDataUri(uri: string): boolean {
  if (!uri || typeof uri !== "string") return false;
  if (!uri.startsWith("data:application/pdf;base64,")) return false;
  const base64Data = uri.slice("data:application/pdf;base64,".length);
  return base64Data.startsWith("JVBERi");
}

export const SAMPLE_PDF_BASE64 =
  "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQVQgL0YxIDI0IFRmCjcwIDcwMCBUZAooQ1YgLSBRTUQgVGVjaCBBcHBsaWNhbnQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE4IDAwMDAwIG4gCjAwMDAwMDAwNzcgMDAwMDAgbiAKMDAwMDAwMDEzNCAwMDAwMCBuIAowMDAwMDAwMjMwIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzI2CiUlRU9GCg==";

export const DEFAULT_APPLICATIONS: CareerApplication[] = [
  {
    id: "app-demo-01",
    career_id: "job-tech-01",
    job_title: "Kỹ Thuật Viên Lắp Ráp & Cài Đặt PC",
    full_name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    phone: "0912345678",
    experience: "2 năm kinh nghiệm",
    introduction: "Em có 2 năm kinh nghiệm build PC custom và bảo trì hệ thống tại Hà Nội. Rất mong muốn được đồng hành cùng QMD-TECH.",
    resume_url: SAMPLE_PDF_BASE64,
    resume_filename: "CV_NguyenVanAn_KyThuatVien.pdf",
    resume_file_size: 485,
    status: "pending",
    notes: "",
    created_at: "2026-09-08T08:30:00.000Z",
    updated_at: "2026-09-08T08:30:00.000Z",
  },
  {
    id: "app-demo-02",
    career_id: "job-sale-02",
    job_title: "Chuyên Viên Tư Vấn Bán Hàng Showroom & Online",
    full_name: "Trần Thị Mai",
    email: "mai.tran@example.com",
    phone: "0987654321",
    experience: "1 năm kinh nghiệm bán lẻ IT",
    introduction: "Đã từng làm tư vấn gear và linh kiện máy tính, am hiểu khách hàng công nghệ.",
    resume_url: SAMPLE_PDF_BASE64,
    resume_filename: "CV_TranThiMai_Sales.pdf",
    resume_file_size: 485,
    status: "reviewed",
    notes: "Hồ sơ khá tốt, chuẩn bị liên hệ phỏng vấn vòng 1.",
    created_at: "2026-09-07T14:15:00.000Z",
    updated_at: "2026-09-07T16:00:00.000Z",
  },
];

export const DEFAULT_CAREERS: CareerJob[] = [
  {
    id: "job-tech-01",
    slug: "ky-thuat-vien-lap-rap-cai-dat-pc",
    title: "Kỹ Thuật Viên Lắp Ráp & Cài Đặt PC",
    department: "Kỹ Thuật & Phần Cứng",
    location: "Hà Nội (Trụ sở 18 Cầu Giấy)",
    employment_type: "Toàn thời gian",
    salary: "12.000.000₫ - 18.000.000₫",
    experience: "1 năm kinh nghiệm hoặc đam mê PC",
    description: "Thực hiện lắp ráp linh kiện máy tính, đi dây thẩm mỹ (cable management), cài đặt hệ điều hành Windows, driver, stress test phần cứng (FurMark, Cinebench, Prime95) và đóng gói chống sốc cho khách hàng.",
    requirements: "Am hiểu về độ tương thích phần cứng (socket, chipset, kích thước case, công suất nguồn PSU). Cẩn thận, tỉ mỉ, có trách nhiệm với từng dàn máy.",
    benefits: "Lương cứng + thưởng theo số lượng máy hoàn thiện. Chế độ BHXH đầy đủ, phụ cấp ăn trưa. Ưu đãi mua linh kiện PC giá gốc tại QMD-Tech.",
    contact_email: "tuyendung@qmdtech.vn",
    is_active: true,
    created_at: "2026-09-01T08:00:00Z",
    updated_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "job-sales-02",
    slug: "chuyen-vien-tu-van-ban-hang-linh-kien-pc",
    title: "Chuyên Viên Tư Vấn Bán Hàng Linh Kiện & Build PC",
    department: "Kinh Doanh & Chăm Sóc Khách Hàng",
    location: "Hà Nội",
    employment_type: "Toàn thời gian",
    salary: "10.000.000₫ - 22.000.000₫ (Lương cứng + Thưởng KPI)",
    experience: "Không yêu cầu (Được đào tạo bài bản)",
    description: "Tiếp nhận nhu cầu khách hàng qua Hotline, Zalo OA, Website chat; tư vấn cấu hình PC tối ưu ngân sách theo mục đích chơi game, đồ họa, render 3D; hỗ trợ chốt đơn và chăm sóc hậu mãi.",
    requirements: "Giao tiếp lưu loát, giọng nói truyền cảm, nhiệt tình hỗ trợ khách hàng. Có kiến thức cơ bản về CPU, VGA RTX, RAM, Mainboard.",
    benefits: "Hoa hồng không giới hạn theo doanh số. Thưởng nóng tuần/tháng. Môi trường trẻ trung, cởi mở.",
    contact_email: "tuyendung@qmdtech.vn",
    is_active: true,
    created_at: "2026-09-02T09:00:00Z",
    updated_at: "2026-09-02T09:00:00Z",
  },
  {
    id: "job-qc-03",
    slug: "ky-su-phan-cung-bao-hanh-qc",
    title: "Kỹ Sư Phần Cứng & Kiểm Định Bảo Hành (QC)",
    department: "Bảo Hành & Kiểm Soát Chất Lượng",
    location: "Hà Nội",
    employment_type: "Toàn thời gian",
    salary: "15.000.000₫ - 24.000.000₫",
    experience: "Từ 2 năm kinh nghiệm",
    description: "Kiểm tra, chẩn đoán lỗi phần cứng chuyên sâu. Thực hiện quy trình bảo hành 1 đổi 1 nhanh chóng và phối hợp trực tiếp với các nhà phân phối chính hãng (ASUS, MSI, Gigabyte, Noctua, Corsair...).",
    requirements: "Nắm vững nguyên lý hoạt động bo mạch và linh kiện điện tử. Trung thực, cẩn trọng, kỷ luật cao.",
    benefits: "Thu nhập cạnh tranh theo năng lực, thưởng hiệu suất hàng quý, lộ trình thăng tiến rõ ràng lên Trưởng bộ phận QC.",
    contact_email: "tuyendung@qmdtech.vn",
    is_active: true,
    created_at: "2026-09-03T10:00:00Z",
    updated_at: "2026-09-03T10:00:00Z",
  },
  {
    id: "job-mkt-04",
    slug: "content-creator-reviewer-phan-cung",
    title: "Content Creator & Reviewer Sản Phẩm Công Nghệ",
    department: "Marketing & Truyền Thông",
    location: "Hà Nội",
    employment_type: "Toàn thời gian / Bán thời gian",
    salary: "12.000.000₫ - 18.000.000₫",
    experience: "1 năm sáng tạo nội dung Tech",
    description: "Lên kịch bản và tham gia ghi hình review, unbox linh kiện phần cứng mới, thử nghiệm benchmark game thực tế trên kênh TikTok, YouTube, Fanpage QMD-Tech.",
    requirements: "Tự tin trước ống kính, nắm bắt xu hướng công nghệ nhanh nhạy, văn phong hiện đại và đam mê linh kiện máy tính.",
    benefits: "Trải nghiệm sớm nhất các sản phẩm phần cứng mới ra mắt trên thị trường. Thưởng view, thưởng video triệu view.",
    contact_email: "tuyendung@qmdtech.vn",
    is_active: true,
    created_at: "2026-09-04T11:00:00Z",
    updated_at: "2026-09-04T11:00:00Z",
  },
];

export class CareerService {
  private localCareers: CareerJob[] = [...DEFAULT_CAREERS];
  private localApplications: CareerApplication[] = [...DEFAULT_APPLICATIONS];

  async getPublicCareers(): Promise<CareerJob[]> {
    try {
      const res = await withTimeout(
        supabase
          .from("careers")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
      );

      if (!res.error && Array.isArray(res.data) && res.data.length > 0) {
        return res.data as CareerJob[];
      }
    } catch {
      // Fallback to local
    }
    return this.localCareers.filter((j) => j.is_active);
  }

  async getAllCareersAdmin(): Promise<CareerJob[]> {
    try {
      const client = typeof window === "undefined" ? getServiceSupabase() : supabase;
      const res = await withTimeout(
        client
          .from("careers")
          .select("*")
          .order("created_at", { ascending: false })
      );

      if (!res.error && Array.isArray(res.data) && res.data.length > 0) {
        return res.data as CareerJob[];
      }
    } catch {
      // Fallback to local
    }
    return [...this.localCareers];
  }

  async getCareerBySlug(slug: string): Promise<CareerJob | null> {
    const clean = sanitizeCareerSlug(slug);

    try {
      const res = await withTimeout(
        supabase
          .from("careers")
          .select("*")
          .or(`slug.eq.${slug},slug.eq.${clean},id.eq.${slug}`)
          .single()
      );

      if (!res.error && res.data) {
        return res.data as CareerJob;
      }
    } catch {
      // Fallback
    }

    const found = this.localCareers.find(
      (j) => j.slug === slug || j.slug === clean || j.id === slug
    );
    return found || null;
  }

  async createCareer(input: CreateCareerInput): Promise<CareerJob> {
    const title = input.title.trim();
    if (!title) {
      throw new Error("Vui lòng nhập tên vị trí tuyển dụng.");
    }
    if (!input.salary.trim()) {
      throw new Error("Vui lòng nhập mức lương cho vị trí tuyển dụng.");
    }
    if (!input.description.trim()) {
      throw new Error("Vui lòng nhập mô tả công việc.");
    }

    const finalSlug = sanitizeCareerSlug(input.slug, title);
    const now = new Date().toISOString();

    const newJob: CareerJob = {
      id: `job-${Date.now()}`,
      slug: finalSlug,
      title,
      department: input.department.trim() || "Kỹ Thuật",
      location: input.location?.trim() || "Hà Nội",
      employment_type: input.employment_type?.trim() || "Toàn thời gian",
      salary: input.salary.trim(),
      experience: input.experience?.trim() || "1 năm kinh nghiệm",
      description: input.description.trim(),
      requirements: input.requirements.trim() || "Am hiểu phần cứng máy tính và có tinh thần trách nhiệm.",
      benefits: input.benefits?.trim() || "Đầy đủ chế độ BHXH, thưởng lễ tết, ưu đãi mua linh kiện.",
      contact_email: input.contact_email?.trim() || "tuyendung@qmdtech.vn",
      is_active: input.is_active ?? true,
      created_at: now,
      updated_at: now,
    };

    try {
      const client = typeof window === "undefined" ? getServiceSupabase() : supabase;
      const res = await withTimeout(
        client
          .from("careers")
          .insert([newJob])
          .select()
          .single()
      );

      if (!res.error && res.data) {
        return res.data as CareerJob;
      }
    } catch {
      // Fallback to local
    }

    this.localCareers.unshift(newJob);
    return newJob;
  }

  async updateCareer(id: string, updates: UpdateCareerInput): Promise<CareerJob | null> {
    const patch: Partial<CareerJob> = { ...updates, updated_at: new Date().toISOString() };
    if (updates.title && !updates.slug) {
      patch.slug = sanitizeCareerSlug("", updates.title);
    } else if (updates.slug) {
      patch.slug = sanitizeCareerSlug(updates.slug, updates.title || "");
    }

    try {
      const client = typeof window === "undefined" ? getServiceSupabase() : supabase;
      const res = await withTimeout(
        client
          .from("careers")
          .update(patch)
          .eq("id", id)
          .select()
          .single()
      );

      if (!res.error && res.data) {
        return res.data as CareerJob;
      }
    } catch {
      // Fallback to local
    }

    const idx = this.localCareers.findIndex((j) => j.id === id);
    if (idx !== -1) {
      this.localCareers[idx] = { ...this.localCareers[idx], ...patch } as CareerJob;
      return this.localCareers[idx];
    }
    return null;
  }

  async deleteCareer(id: string): Promise<boolean> {
    try {
      const client = typeof window === "undefined" ? getServiceSupabase() : supabase;
      await withTimeout(client.from("careers").delete().eq("id", id));
    } catch {
      // ignore
    }

    this.localCareers = this.localCareers.filter((j) => j.id !== id);
    return true;
  }

  // --- Applications Management ---

  async submitApplication(input: SubmitApplicationInput): Promise<CareerApplication> {
    const full_name = input.full_name.trim();
    if (!full_name) {
      throw new Error("Vui lòng nhập họ và tên ứng viên.");
    }
    const email = input.email.trim();
    if (!email || !email.includes("@")) {
      throw new Error("Vui lòng nhập địa chỉ email hợp lệ.");
    }
    const phone = input.phone.trim();
    if (!phone) {
      throw new Error("Vui lòng nhập số điện thoại liên hệ.");
    }
    if (!input.resume_url || !input.resume_url.trim()) {
      throw new Error("Vui lòng đính kèm file CV định dạng PDF.");
    }
    if (!isPdfDataUri(input.resume_url) && !input.resume_url.startsWith("http")) {
      throw new Error("File đính kèm không đúng định dạng PDF hợp lệ.");
    }

    let job_title = input.job_title?.trim() || "";
    if (!job_title && input.career_id) {
      const job = await this.getCareerById(input.career_id);
      if (job) job_title = job.title;
    }

    const now = new Date().toISOString();
    const newApp: CareerApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      career_id: input.career_id || null,
      job_title: job_title || "Vị trí ứng tuyển",
      full_name,
      email,
      phone,
      experience: input.experience?.trim() || null,
      introduction: input.introduction?.trim() || null,
      resume_url: input.resume_url,
      resume_filename: input.resume_filename?.trim() || "CV_UngVien.pdf",
      resume_file_size: input.resume_file_size || 0,
      status: "pending",
      notes: null,
      created_at: now,
      updated_at: now,
    };

    try {
      const client = typeof window === "undefined" ? getServiceSupabase() : supabase;
      const res = await withTimeout(
        client
          .from("career_applications")
          .insert([newApp])
          .select()
          .single()
      );

      if (!res.error && res.data) {
        const created = res.data as CareerApplication;
        this.localApplications.unshift(created);
        return created;
      }
    } catch {
      // Fallback to local
    }

    this.localApplications.unshift(newApp);
    return newApp;
  }

  async getCareerById(id: string): Promise<CareerJob | null> {
    try {
      const res = await withTimeout(
        supabase
          .from("careers")
          .select("*")
          .eq("id", id)
          .single()
      );
      if (!res.error && res.data) {
        return res.data as CareerJob;
      }
    } catch {
      // Fallback
    }
    return this.localCareers.find((c) => c.id === id) || null;
  }

  async getApplicationsAdmin(filters?: {
    status?: ApplicationStatus;
    career_id?: string;
    search?: string;
  }): Promise<CareerApplication[]> {
    try {
      const client = typeof window === "undefined" ? getServiceSupabase() : supabase;
      let query = client
        .from("career_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.career_id) {
        query = query.eq("career_id", filters.career_id);
      }

      const res = await withTimeout(query);
      if (!res.error && Array.isArray(res.data) && res.data.length > 0) {
        let results = res.data as CareerApplication[];
        if (filters?.search) {
          const s = filters.search.toLowerCase().trim();
          const sNorm = s
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d");
          const sNoSpace = sNorm.replace(/\s+/g, "");
          results = results.filter((a) => {
            const nameNorm = a.full_name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[đĐ]/g, "d");
            const titleNorm = a.job_title
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[đĐ]/g, "d");
            return (
              a.full_name.toLowerCase().includes(s) ||
              nameNorm.includes(sNorm) ||
              nameNorm.replace(/\s+/g, "").includes(sNoSpace) ||
              a.email.toLowerCase().includes(s) ||
              a.phone.toLowerCase().includes(s) ||
              a.job_title.toLowerCase().includes(s) ||
              titleNorm.includes(sNorm)
            );
          });
        }
        return results;
      }
    } catch {
      // Fallback to local
    }

    let list = [...this.localApplications];
    if (filters?.status) {
      list = list.filter((a) => a.status === filters.status);
    }
    if (filters?.career_id) {
      list = list.filter((a) => a.career_id === filters.career_id);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase().trim();
      const sNorm = s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d");
      const sNoSpace = sNorm.replace(/\s+/g, "");
      list = list.filter((a) => {
        const nameNorm = a.full_name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d");
        const titleNorm = a.job_title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d");
        return (
          a.full_name.toLowerCase().includes(s) ||
          nameNorm.includes(sNorm) ||
          nameNorm.replace(/\s+/g, "").includes(sNoSpace) ||
          a.email.toLowerCase().includes(s) ||
          a.phone.toLowerCase().includes(s) ||
          a.job_title.toLowerCase().includes(s) ||
          titleNorm.includes(sNorm)
        );
      });
    }
    return list;
  }

  async getApplicationById(id: string): Promise<CareerApplication | null> {
    try {
      const client = typeof window === "undefined" ? getServiceSupabase() : supabase;
      const res = await withTimeout(
        client
          .from("career_applications")
          .select("*")
          .eq("id", id)
          .single()
      );
      if (!res.error && res.data) {
        return res.data as CareerApplication;
      }
    } catch {
      // Fallback
    }
    return this.localApplications.find((a) => a.id === id) || null;
  }

  async updateApplicationStatus(
    idOrInput: string | (UpdateApplicationStatusInput & { id: string }),
    maybeInput?: UpdateApplicationStatusInput
  ): Promise<CareerApplication | null> {
    const targetId = typeof idOrInput === "string" ? idOrInput : idOrInput.id;
    const payload: Partial<UpdateApplicationStatusInput> =
      typeof idOrInput === "string" ? maybeInput || {} : idOrInput;

    const patch: Partial<CareerApplication> = {
      updated_at: new Date().toISOString(),
    };
    if (payload.status) {
      patch.status = payload.status;
    }
    if (typeof payload.notes === "string") {
      patch.notes = payload.notes;
    }

    try {
      const client = typeof window === "undefined" ? getServiceSupabase() : supabase;
      const res = await withTimeout(
        client
          .from("career_applications")
          .update(patch)
          .eq("id", targetId)
          .select()
          .single()
      );
      if (!res.error && res.data) {
        const updated = res.data as CareerApplication;
        const idx = this.localApplications.findIndex((a) => a.id === targetId);
        if (idx !== -1) {
          this.localApplications[idx] = updated;
        }
        return updated;
      }
    } catch {
      // Fallback
    }

    const idx = this.localApplications.findIndex((a) => a.id === targetId);
    if (idx !== -1) {
      this.localApplications[idx] = {
        ...this.localApplications[idx],
        ...patch,
      } as CareerApplication;
      return this.localApplications[idx];
    }
    return null;
  }

  async deleteApplication(id: string): Promise<boolean> {
    try {
      const client = typeof window === "undefined" ? getServiceSupabase() : supabase;
      await withTimeout(client.from("career_applications").delete().eq("id", id));
    } catch {
      // ignore
    }

    this.localApplications = this.localApplications.filter((a) => a.id !== id);
    return true;
  }
}

export const careerService = new CareerService();
