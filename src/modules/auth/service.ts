import { supabase } from "@/shared/db/supabase";
import { User, Session } from "@supabase/supabase-js";

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export class AuthService {
  async signUp({ email, password, fullName, phone }: SignUpParams) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || "",
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signIn({ email, password }: SignInParams) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn("Failed to get Supabase session:", error.message);
      return null;
    }
    return data.session;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return null;
    }
    return data.user;
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
