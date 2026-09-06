/**
 * Cryptographic JSON Web Token (JWT) Implementation
 * Built with standard W3C Web Crypto API (HMAC-SHA256).
 * Zero native dependencies - 100% compatible with Next.js Edge Runtime (Middleware) and Node.js.
 */

export interface JWTPayload {
  [key: string]: unknown;
  sub?: string;
  role?: string;
  user?: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

export const DEFAULT_JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.SUPABASE_JWT_SECRET ||
  "qmdtech_super_secure_jwt_secret_key_2026_production";

/**
 * Universal Base64URL encoding
 */
export function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Universal Base64URL decoding
 */
export function fromBase64Url(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function uint8ArrayToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    stringToUint8Array(secret) as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs a cryptographic JWT using HMAC-SHA256
 */
export async function signJWT(
  payload: JWTPayload,
  secret: string = DEFAULT_JWT_SECRET,
  expiresInSeconds: number = 12 * 60 * 60
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);

  const fullPayload: JWTPayload = {
    ...payload,
    iat: payload.iat ?? now,
    exp: payload.exp ?? now + expiresInSeconds,
    iss: payload.iss ?? "qmdtech",
  };

  const headerB64 = toBase64Url(stringToUint8Array(JSON.stringify(header)));
  const payloadB64 = toBase64Url(stringToUint8Array(JSON.stringify(fullPayload)));
  const dataToSign = `${headerB64}.${payloadB64}`;

  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    stringToUint8Array(dataToSign) as unknown as BufferSource
  );

  const signatureB64 = toBase64Url(new Uint8Array(signatureBuffer));
  return `${dataToSign}.${signatureB64}`;
}

/**
 * Cryptographically verifies signature and expiration time of a JWT
 */
export async function verifyJWT<T extends JWTPayload = JWTPayload>(
  token: string,
  secret: string = DEFAULT_JWT_SECRET
): Promise<{ valid: boolean; payload?: T; error?: string }> {
  try {
    if (!token || typeof token !== "string") {
      return { valid: false, error: "Token không tồn tại hoặc sai định dạng." };
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "Cấu trúc JWT không hợp lệ." };
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const dataToVerify = `${headerB64}.${payloadB64}`;
    const signatureBytes = fromBase64Url(signatureB64);

    const key = await getCryptoKey(secret);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      stringToUint8Array(dataToVerify) as unknown as BufferSource
    );

    if (!isValid) {
      return { valid: false, error: "Chữ ký JWT không hợp lệ hoặc đã bị thay đổi." };
    }

    const payloadJson = uint8ArrayToString(fromBase64Url(payloadB64));
    const payload = JSON.parse(payloadJson) as T;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
    }

    return { valid: true, payload };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xác thực JWT.";
    return { valid: false, error: msg };
  }
}

/**
 * Creates a signed Admin Session Token
 */
export async function createAdminToken(username: string): Promise<string> {
  return await signJWT(
    {
      role: "admin",
      user: username,
    },
    DEFAULT_JWT_SECRET,
    12 * 60 * 60 // 12 hours
  );
}

/**
 * Verifies an Admin Session Token
 */
export async function verifyAdminToken(
  token: string
): Promise<{ valid: boolean; user?: string; error?: string }> {
  const result = await verifyJWT(token, DEFAULT_JWT_SECRET);
  if (!result.valid || !result.payload) {
    return { valid: false, error: result.error };
  }

  if (result.payload.role !== "admin") {
    return { valid: false, error: "Không có quyền quản trị viên." };
  }

  return { valid: true, user: result.payload.user as string };
}
