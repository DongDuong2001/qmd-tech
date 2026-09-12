#!/usr/bin/env node

/**
 * Pre-Commit Secret Scanner
 * Scans git staged diffs for accidental credentials, secrets, or unencrypted keys.
 * Exits with status 1 if any high-risk secret is staged.
 */

import { execSync } from "node:child_process";

const HIGH_RISK_PATTERNS = [
  { name: "Private RSA/EC Key", regex: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/i },
  { name: "Raw Supabase Service Role Key", regex: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]{20,}/ },
  { name: "Hardcoded Database Password", regex: /postgres:\/\/[a-zA-Z0-9_-]+:[a-zA-Z0-9_!@#$%^&*()+=~-]+@[a-zA-Z0-9.-]+:[0-9]+\/[a-zA-Z0-9_-]+/i },
  { name: "Hardcoded JWT Secret Assignment", regex: /JWT_SECRET\s*=\s*["'][a-zA-Z0-9_!@#$%^&*()+=~-]{16,}["']/i },
  { name: "Cloudinary Secret Key", regex: /CLOUDINARY_API_SECRET\s*=\s*["'][a-zA-Z0-9_-]{10,}["']/i },
  { name: "SePay API Token", regex: /SEPAY_API_KEY\s*=\s*["'][a-zA-Z0-9_-]{10,}["']/i },
];

function main() {
  let stagedDiff = "";
  try {
    stagedDiff = execSync("git diff --cached", { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
  } catch (err) {
    console.error("[Pre-Commit Error] Failed to retrieve git diff:", err.message);
    process.exit(0);
  }

  if (!stagedDiff.trim()) {
    process.exit(0);
  }

  const addedLines = stagedDiff
    .split("\n")
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .join("\n");

  const violations = [];
  for (const pattern of HIGH_RISK_PATTERNS) {
    if (pattern.regex.test(addedLines)) {
      violations.push(pattern.name);
    }
  }

  if (violations.length > 0) {
    console.error("\n[SECURITY AUDIT FAILURE] Commit blocked! High-risk secret detected in staged changes:");
    for (const v of violations) {
      console.error(" - Detected: " + v);
    }
    console.error("Please move credentials to .env.local and stage sanitized files before committing.\n");
    process.exit(1);
  }

  process.exit(0);
}

main();
