"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      {/* Gradient background blobs */}
      <div className="login-bg">
        <div className="login-bg__blob login-bg__blob--purple" />
        <div className="login-bg__blob login-bg__blob--green" />
      </div>

      {/* DA watermark decorations */}
      <span className="da-watermark" style={{ top: "12%", left: "8%" }}>DA: 67</span>
      <span className="da-watermark" style={{ top: "20%", right: "10%" }}>DA: 31</span>
      <span className="da-watermark" style={{ bottom: "25%", left: "12%" }}>DA: 54</span>
      <span className="da-watermark" style={{ bottom: "18%", right: "8%" }}>DA: 42</span>

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="#3E4FEA" />
            <text x="18" y="23" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Space Grotesk">M</text>
          </svg>
          <span>Media Partner Hub</span>
        </div>

        {!success ? (
          <>
            <h1 className="login-title">Reset Password</h1>
            <p className="fp-subtitle">
              Enter your account email and we&apos;ll send you a link to reset your password.
            </p>

            {error && (
              <Alert message={error} type="error" onDismiss={() => setError("")} />
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "20px" }}>
              <input
                className="input"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />

              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                <span>{loading ? "Sending link…" : "Send Reset Link"}</span>
                <span className="login-submit-arrow">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#112C3E" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </form>

            <p className="login-footer" style={{ marginTop: "16px" }}>
              Remembered it?{" "}
              <Link href="/login">Back to Log In</Link>
            </p>
          </>
        ) : (
          /* Success state */
          <div className="fp-success">
            <div className="fp-success__icon">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#D6F5D0" />
                <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#1A6A14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="fp-success__title">Check your email</h2>
            <p className="fp-success__body">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
              Check your inbox and follow the link to set a new password.
            </p>
            <p className="fp-success__note">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                type="button"
                onClick={() => { setSuccess(false); setEmail(""); }}
                className="fp-resend-btn"
              >
                try again
              </button>
              .
            </p>
            <Link href="/login" className="btn btn-dark btn-lg" style={{ marginTop: "20px", borderRadius: "50px", width: "100%", justifyContent: "center" }}>
              Back to Log In
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #f5f8fa;
          padding: 20px;
        }
        .login-bg { position: absolute; inset: 0; pointer-events: none; }
        .login-bg__blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.35; }
        .login-bg__blob--purple { width: 500px; height: 500px; background: #a9b1ff; top: -120px; left: -120px; }
        .login-bg__blob--green { width: 400px; height: 400px; background: #8cf08a; bottom: -100px; right: -100px; }
        .da-watermark { position: absolute; font-size: 13px; font-family: var(--font-inter); font-weight: 500; color: #677f9b; opacity: 0.4; user-select: none; pointer-events: none; }
        .login-card { position: relative; z-index: 10; background: white; border-radius: 20px; padding: 40px 44px; width: 100%; max-width: 460px; box-shadow: 0 8px 40px rgba(17,44,62,0.10); }
        .login-logo { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 20px; font-size: 16px; font-weight: 600; color: var(--color-dark); }
        .login-title { font-size: 28px; font-weight: 700; color: var(--color-dark); text-align: center; margin-bottom: 8px; font-family: var(--font-space-grotesk); }
        .fp-subtitle { font-size: 14px; color: var(--color-grey-blue); font-family: var(--font-inter); text-align: center; line-height: 1.6; }
        .login-submit-btn {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 13px 16px 13px 20px;
          background: var(--color-dark); color: white;
          border: none; border-radius: 50px;
          font-size: 15px; font-weight: 600; font-family: var(--font-space-grotesk);
          cursor: pointer; transition: opacity 0.15s ease;
        }
        .login-submit-btn:hover:not(:disabled) { opacity: 0.88; }
        .login-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-submit-arrow {
          width: 34px; height: 34px; background: #8cf08a; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .login-footer { text-align: center; font-size: 14px; font-family: var(--font-inter); color: var(--color-grey-blue); }
        .login-footer a { color: var(--color-primary); font-weight: 500; }
        .login-footer a:hover { text-decoration: underline; }
        .fp-success { display: flex; flex-direction: column; align-items: center; text-align: center; padding-top: 8px; gap: 12px; }
        .fp-success__icon { margin-bottom: 4px; }
        .fp-success__title { font-size: 22px; font-weight: 700; color: var(--color-dark); font-family: var(--font-space-grotesk); }
        .fp-success__body { font-size: 14px; color: var(--color-grey-blue); font-family: var(--font-inter); line-height: 1.6; }
        .fp-success__body strong { color: var(--color-dark); font-weight: 600; }
        .fp-success__note { font-size: 13px; color: var(--color-grey-blue); font-family: var(--font-inter); }
        .fp-resend-btn { background: none; border: none; color: var(--color-primary); font-size: 13px; font-family: var(--font-inter); font-weight: 500; cursor: pointer; padding: 0; }
        .fp-resend-btn:hover { text-decoration: underline; }
        @media (max-width: 500px) { .login-card { padding: 28px 24px; } .da-watermark { display: none; } }
      `}</style>
    </main>
  );
}
