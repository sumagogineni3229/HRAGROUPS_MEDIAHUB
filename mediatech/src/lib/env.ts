/**
 * Environment variable validation — runs at startup.
 * Throws clearly if any required variable is missing so the app
 * fails fast instead of silently using undefined values.
 */

const REQUIRED_VARS = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXTAUTH_URL",
] as const;

const OPTIONAL_VARS = [
  "DIRECT_URL",
  "SUPABASE_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_APP_NAME",
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[ENV] Missing required environment variables:\n${missing.map(k => `  ❌ ${k}`).join("\n")}\n\nCopy .env.example to .env and fill in all values.`
    );
  }

  // Warn about optional but useful ones
  if (process.env.NODE_ENV === "production") {
    for (const key of OPTIONAL_VARS) {
      if (!process.env[key]) {
        console.warn(`[ENV] Optional variable not set: ${key}`);
      }
    }
  }
}

// Typed access helpers — use these instead of process.env directly
export const env = {
  DATABASE_URL:        process.env.DATABASE_URL!,
  AUTH_SECRET:         process.env.AUTH_SECRET!,
  NEXTAUTH_URL:        process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  APP_URL:             process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  APP_NAME:            process.env.NEXT_PUBLIC_APP_NAME ?? "Media Partner Hub",
  GOOGLE_CLIENT_ID:    process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
  IS_PROD:             process.env.NODE_ENV === "production",
} as const;
