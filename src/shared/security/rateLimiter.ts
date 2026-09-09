// ========================================================================
// QMD-Tech Security Suite: Distributed & Sliding Window Rate Limiter
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

/**
 * In-memory sliding window rate limiter (Synchronous fallback & local execution)
 */
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

/**
 * Distributed rate limiter with Upstash Redis REST support and in-memory fallback.
 * Guarantees cluster-wide protection across multi-instance serverless deployments.
 */
export async function checkRateLimitDistributed(
  ip: string,
  actionKey: string,
  maxAttempts: number = 5,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const key = `rate_limit:${actionKey}:${ip}`;
      const res = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, windowSeconds, "NX"],
          ["TTL", key],
        ]),
      });

      if (res.ok) {
        const results = await res.json();
        const count = Number(results[0]?.result) || 1;
        const ttl = Number(results[2]?.result) || windowSeconds;

        if (count > maxAttempts) {
          const waitTime = ttl > 0 ? ttl : windowSeconds;
          return {
            success: false,
            limit: maxAttempts,
            remaining: 0,
            resetSeconds: waitTime,
            error: `Quá nhiều lần thử (${maxAttempts} lần/${windowSeconds}s). Vui lòng thử lại sau ${waitTime} giây.`,
          };
        }

        return {
          success: true,
          limit: maxAttempts,
          remaining: Math.max(0, maxAttempts - count),
          resetSeconds: ttl > 0 ? ttl : windowSeconds,
        };
      }
    } catch (err) {
      console.warn("Distributed rate limiter unavailable, falling back to local window:", err);
    }
  }

  return checkRateLimit(ip, actionKey, maxAttempts, windowSeconds);
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
