import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/shared/db/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";
  let dbLatencyMs = 0;
  let dbError: string | null = null;

  try {
    const db = getServiceSupabase();
    const { error } = await db.from("categories").select("id").limit(1);
    dbLatencyMs = Date.now() - startTime;

    if (error) {
      dbStatus = "degraded";
      dbError = error.message;
    }
  } catch (err: unknown) {
    dbStatus = "unreachable";
    dbError = err instanceof Error ? err.message : "Unknown database error";
    dbLatencyMs = Date.now() - startTime;
  }

  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  const isHealthy = dbStatus === "healthy";

  const payload = {
    status: isHealthy ? "operational" : "degraded",
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    environment: process.env.NODE_ENV || "development",
    version: "1.11.0",
    checks: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        error: dbError,
      },
      memory: {
        rssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
        heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
        heapTotalMb: Math.round(memoryUsage.heapTotal / (1024 * 1024)),
      },
    },
  };

  return NextResponse.json(payload, { status: isHealthy ? 200 : 503 });
}
