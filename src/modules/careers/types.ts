export interface CareerJob {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  salary: string;
  experience: string;
  description: string;
  requirements: string;
  benefits: string;
  contact_email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCareerInput {
  title: string;
  slug?: string;
  department: string;
  location?: string;
  employment_type?: string;
  salary: string;
  experience?: string;
  description: string;
  requirements: string;
  benefits?: string;
  contact_email?: string;
  is_active?: boolean;
}

export type UpdateCareerInput = Partial<CreateCareerInput>;

export type ApplicationStatus =
  | "pending"     // Chờ duyệt
  | "reviewed"    // Đã xem qua
  | "contacted"   // Đã liên hệ
  | "interview"   // Phỏng vấn
  | "accepted"    // Tuyển dụng
  | "rejected";   // Từ chối / Chưa phù hợp

export interface CareerApplication {
  id: string;
  career_id?: string | null;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  experience?: string | null;
  introduction?: string | null;
  resume_url: string;
  resume_filename: string;
  resume_file_size: number;
  status: ApplicationStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmitApplicationInput {
  career_id?: string | null;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  experience?: string;
  introduction?: string;
  resume_url: string;
  resume_filename: string;
  resume_file_size: number;
}

export interface UpdateApplicationStatusInput {
  id?: string;
  status: ApplicationStatus;
  notes?: string;
}
