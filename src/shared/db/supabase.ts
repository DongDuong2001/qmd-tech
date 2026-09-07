import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL CONFIGURATION ERROR: NEXT_PUBLIC_SUPABASE_URL is not set.");
    }
    return "https://mock-project.supabase.co";
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL CONFIGURATION ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.");
    }
    return "mock-anon-key";
  }
  return key;
}

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY is required for server service operations.");
    }
    console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY not configured. Falling back to anon key for non-production environment.");
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
