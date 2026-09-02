// ========================================================================
// QMD-Tech Client Authentication Service (HttpOnly Cookie Protected)
// ========================================================================

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
    [key: string]: unknown;
  };
  created_at?: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  rememberMe?: boolean;
}

export interface SignInParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export class AuthService {
  async signUp({ email, password, fullName, phone, rememberMe = true }: SignUpParams) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName, phone, rememberMe }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Đăng ký không thành công.");
    }

    return data;
  }

  async signIn({ email, password, rememberMe = true }: SignInParams) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Đăng nhập không thành công.");
    }

    return data;
  }

  async signOut() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Đăng xuất không thành công.");
    }

    return data;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const res = await fetch("/api/auth/session", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
