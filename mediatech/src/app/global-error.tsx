"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service in production
    console.error("[GLOBAL_ERROR]", error);
  }, [error]);

  return (
    <html>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f5f8fa" }}>
        <main style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}>
          <div style={{ textAlign: "center", maxWidth: "440px" }}>
            <div style={{
              width: "64px",
              height: "64px",
              background: "#fff0f0",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: "28px",
            }}>
              ⚠️
            </div>

            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#112C3E", marginBottom: "12px" }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: "14px", color: "#677F9B", lineHeight: 1.6, marginBottom: "28px" }}>
              An unexpected error occurred. Our team has been notified.
              {error.digest && (
                <span style={{ display: "block", marginTop: "8px", fontSize: "11px", opacity: 0.6 }}>
                  Error ref: {error.digest}
                </span>
              )}
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={reset}
                style={{
                  padding: "11px 22px",
                  background: "#3E4FEA",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <Link
                href="/"
                style={{
                  padding: "11px 22px",
                  border: "1.5px solid #DCDCE5",
                  background: "white",
                  color: "#112C3E",
                  borderRadius: "50px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Go home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
