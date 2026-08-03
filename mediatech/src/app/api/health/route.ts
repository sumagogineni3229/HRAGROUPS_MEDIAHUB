import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Health-check endpoint — used by deployment platforms (Railway, Vercel, etc.)
 * to verify the app and DB are reachable.
 *
 * GET /api/health → 200 { status: "ok", db: "ok", ts: "..." }
 *                 → 503 { status: "error", db: "unreachable", ts: "..." }
 */
export async function GET() {
  const ts = new Date().toISOString();

  try {
    // Lightweight DB ping
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "ok",
        db: "ok",
        version: process.env.npm_package_version ?? "0.1.0",
        ts,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[HEALTH_CHECK] DB unreachable:", err);
    return NextResponse.json(
      {
        status: "error",
        db: "unreachable",
        ts,
      },
      { status: 503 }
    );
  }
}
