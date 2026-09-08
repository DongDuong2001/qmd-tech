// ========================================================================
// QMD-Tech Security Suite: In-Memory Sliding Window Rate Limiter
// ========================================================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodically purge stale records to avoid memory leaks
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

if (typeof cleanupInterval.unref === "function") {
  cleanupInterval.unref();
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  error?: string;
}

export function checkRateLimit(
  ip: string,
  actionKey: string,
  maxAttempts: number = 5,
  windowSeconds: number = 60
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const identifier = `${actionKey}:${ip}`;

  const record = rateLimitStore.get(identifier);

  if (!record || record.resetAt <= now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit: maxAttempts,
      remaining: maxAttempts - 1,
      resetSeconds: windowSeconds,
    };
  }

  if (record.count >= maxAttempts) {
    const remainingSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      success: false,
      limit: maxAttempts,
      remaining: 0,
      resetSeconds: remainingSeconds,
      error: `Quá nhiều lần thử (${maxAttempts} lần/${windowSeconds}s). Vui lòng thử lại sau ${remainingSeconds} giây.`,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: maxAttempts,
    remaining: maxAttempts - record.count,
    resetSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

// Validates IPv4, standard IPv6, and localhost
const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}$|^::1$/;

export function getClientIp(req: Request): string {
  // 1. Cloudflare CF-Connecting-IP (cannot be spoofed behind Cloudflare)
  const cfIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cfIp && IP_REGEX.test(cfIp)) {
    return cfIp;
  }

  // 2. Standard reverse proxy header (Vercel, Nginx)
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp && IP_REGEX.test(realIp)) {
    return realIp;
  }

  // 3. X-Forwarded-For: examine comma-separated list and validate structure
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const candidates = forwardedFor.split(",").map((p) => p.trim());
    for (const candidate of candidates) {
      if (IP_REGEX.test(candidate)) {
        return candidate;
      }
    }
  }

  return "127.0.0.1";
}
