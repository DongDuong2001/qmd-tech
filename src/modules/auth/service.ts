import { supabase } from "@/shared/db/supabase";

export class AuthService {
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return null;
      return user;
    } catch {
      return null;
    }
  }

  async signInWithGoogle(redirectTo?: string) {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      },
    });
  }

  async signOut() {
    return supabase.auth.signOut();
  }
}

export const authService = new AuthService();
