// ========================================================================
// QMD-Tech Security Suite: In-Memory Sliding Window Rate Limiter
// ========================================================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodically purge stale records to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

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

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
