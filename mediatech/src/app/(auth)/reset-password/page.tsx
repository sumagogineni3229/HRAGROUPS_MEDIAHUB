"use client";

import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";

function ResetPasswordForm() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // If no token in URL — show invalid state immediately
  const [tokenMissing] = useState(!token);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset link. Please request a new one.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Password strength helper
  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "#ED254E", "#F5A723", "#369F17"][strength];

  return (
    <main className="login-page">
      <div className="login-bg">
        <div className="login-bg__blob login-bg__blob--purple" />
        <div className="login-bg__blob login-bg__blob--green" />
      </div>

      <span className="da-watermark" style={{ top: "12%", left: "8%" }}>DA: 67</span>
      <span className="da-watermark" style={{ top: "20%", right: "10%" }}>DA: 31</span>
      <span className="da-watermark" style={{ bottom: "25%", left: "12%" }}>DA: 54</span>
      <span className="da-watermark" style={{ bottom: "18%", right: "8%" }}>DA: 42</span>

      <div className="login-card">
        <div className="login-logo">
          <Link href="/">
            <img
              src="/mediahub.png"
              alt="Media Hub Logo"
              style={{ height: "28px", width: "auto", objectFit: "contain", margin: "0 auto" }}
            />
          </Link>
        </div>

        {success ? (
          <div className="fp-success">
            <div className="fp-success__icon">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#D6F5D0" />
                <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#1A6A14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="fp-success__title">Password updated!</h2>
            <p className="fp-success__body">
              Your password has been changed successfully. Redirecting you to login…
            </p>
            <Link href="/login" className="btn btn-dark btn-lg" style={{ marginTop: "20px", borderRadius: "50px", width: "100%", justifyContent: "center", textDecoration: "none" }}>
              Go to Log In
            </Link>
          </div>
        ) : tokenMissing ? (
          <>
            <h1 className="login-title" style={{ fontSize: "24px" }}>Invalid Link</h1>
            <p className="fp-subtitle">
              This reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="btn btn-dark btn-lg"
              style={{ marginTop: "24px", borderRadius: "50px", width: "100%", justifyContent: "center", textDecoration: "none" }}
            >
              Request a New Link
            </Link>
          </>
        ) : (
          <>
            <h1 className="login-title">Set New Password</h1>
            <p className="fp-subtitle">
              Choose a strong password for your account.
            </p>

            {error && (
              <Alert message={error} type="error" onDismiss={() => setError("")} />
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "20px" }}>
              {/* New password */}
              <div style={{ position: "relative" }}>
                <input
                  className="input"
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  style={{ paddingRight: "60px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Strength meter */}
              {password.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ flex: 1, display: "flex", gap: "4px" }}>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          height: "4px", flex: 1, borderRadius: "4px",
                          background: i <= strength ? strengthColor : "var(--color-border)",
                          transition: "background 0.2s",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "12px", fontFamily: "var(--font-inter)", color: strengthColor, fontWeight: 500, minWidth: "40px" }}>
                    {strengthLabel}
                  </span>
                </div>
              )}

              {/* Confirm password */}
              <div style={{ position: "relative" }}>
                <input
                  className="input"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  style={{ paddingRight: "60px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="password-toggle"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>

              {/* Match indicator */}
              {confirm.length > 0 && (
                <p style={{ fontSize: "12px", fontFamily: "var(--font-inter)", color: password === confirm ? "#369F17" : "#ED254E", margin: 0 }}>
                  {password === confirm ? "✓ Passwords match" : "✗ Passwords don't match"}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
                style={{ marginTop: "4px" }}
              >
                <span>{loading ? "Updating…" : "Set New Password"}</span>
                <span className="login-submit-arrow">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#112C3E" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </form>

            <p className="login-footer" style={{ marginTop: "16px" }}>
              <Link href="/login">Back to Log In</Link>
            </p>
          </>
        )}
      </div>

      <style>{`
        .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: #f5f8fa; padding: 20px; }
        .login-bg { position: absolute; inset: 0; pointer-events: none; }
        .login-bg__blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.35; }
        .login-bg__blob--purple { width: 500px; height: 500px; background: #a9b1ff; top: -120px; left: -120px; }
        .login-bg__blob--green { width: 400px; height: 400px; background: #8cf08a; bottom: -100px; right: -100px; }
        .da-watermark { position: absolute; font-size: 13px; font-family: var(--font-inter); font-weight: 500; color: #677f9b; opacity: 0.4; user-select: none; pointer-events: none; }
        .login-card { position: relative; z-index: 10; background: white; border-radius: 20px; padding: 40px 44px; width: 100%; max-width: 460px; box-shadow: 0 8px 40px rgba(17,44,62,0.10); }
        .login-logo { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 20px; font-size: 16px; font-weight: 600; color: var(--color-dark); }
        .login-title { font-size: 28px; font-weight: 700; color: var(--color-dark); text-align: center; margin-bottom: 8px; font-family: var(--font-space-grotesk); }
        .fp-subtitle { font-size: 14px; color: var(--color-grey-blue); font-family: var(--font-inter); text-align: center; line-height: 1.6; }
        .password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 13px; font-family: var(--font-inter); color: var(--color-primary); cursor: pointer; font-weight: 500; }
        .login-submit-btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 13px 16px 13px 20px; background: var(--color-dark); color: white; border: none; border-radius: 50px; font-size: 15px; font-weight: 600; font-family: var(--font-space-grotesk); cursor: pointer; transition: opacity 0.15s ease; }
        .login-submit-btn:hover:not(:disabled) { opacity: 0.88; }
        .login-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-submit-arrow { width: 34px; height: 34px; background: #8cf08a; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .login-footer { text-align: center; font-size: 14px; font-family: var(--font-inter); color: var(--color-grey-blue); }
        .login-footer a { color: var(--color-primary); font-weight: 500; }
        .login-footer a:hover { text-decoration: underline; }
        .fp-success { display: flex; flex-direction: column; align-items: center; text-align: center; padding-top: 8px; gap: 12px; }
        .fp-success__icon { margin-bottom: 4px; }
        .fp-success__title { font-size: 22px; font-weight: 700; color: var(--color-dark); font-family: var(--font-space-grotesk); }
        .fp-success__body { font-size: 14px; color: var(--color-grey-blue); font-family: var(--font-inter); line-height: 1.6; }
        @media (max-width: 500px) { .login-card { padding: 28px 24px; } .da-watermark { display: none; } }
      `}</style>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="login-page">
        <div className="login-bg">
          <div className="login-bg__blob login-bg__blob--purple" />
          <div className="login-bg__blob login-bg__blob--green" />
        </div>
        <div className="login-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
          <div style={{ width: "28px", height: "28px", border: "3px solid #3E4FEA", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
        <style>{`
          .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f8fa; }
          .login-bg { position: absolute; inset: 0; pointer-events: none; }
          .login-bg__blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.35; }
          .login-bg__blob--purple { width: 500px; height: 500px; background: #a9b1ff; top: -120px; left: -120px; }
          .login-bg__blob--green { width: 400px; height: 400px; background: #8cf08a; bottom: -100px; right: -100px; }
          .login-card { position: relative; z-index: 10; background: white; border-radius: 20px; padding: 40px 44px; width: 100%; max-width: 460px; box-shadow: 0 8px 40px rgba(17,44,62,0.10); }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
