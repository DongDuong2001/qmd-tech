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
