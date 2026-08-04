"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Alert } from "@/components/ui/alert";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const oauthError = searchParams.get("error");
  const [error, setError] = useState(
    oauthError === "NoAccountFound"
      ? "No account found with this Google email. Please register first."
      : oauthError === "OAuthSignin" || oauthError === "OAuthCallback"
      ? "Google sign in failed. Please try again."
      : oauthError === "CredentialsSignin"
      ? "Account not found or password incorrect."
      : ""
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError("Account not found or password incorrect.");
      return;
    }

    // Dynamic role redirection instead of landing page "/" fallback
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.role) {
        const role = session.user.role;
        const roleHome: Record<string, string> = {
          ADVERTISER: "/advertiser/sites",
          PUBLISHER:  "/publisher/platforms",
          INFLUENCER: "/influencer/channels",
          ADMIN:      "/admin/dashboard",
        };
        router.push(roleHome[role] ?? "/");
        router.refresh();
        return;
      }
    } catch (e) {
      console.error("Failed to fetch session for redirect:", e);
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {error && (
        <Alert message={error} type="error" onDismiss={() => setError("")} />
      )}

      <div className="form-field">
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-field" style={{ position: "relative" }}>
        <input
          className="input"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
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

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Link href="/forgot-password" className="forgot-link">
          Lost password?
        </Link>
      </div>

      {/* Login button — dark with green arrow */}
      <button
        type="submit"
        disabled={loading}
        className="login-submit-btn"
      >
        <span>{loading ? "Signing in…" : "Log In"}</span>
        <span className="login-submit-arrow">
          <ArrowRightIcon className="w-4 h-4 text-dark" />
        </span>
      </button>

      <style>{`
        .form-error-banner {
          background: #fddde5;
          color: #b91c3d;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          font-family: var(--font-inter);
        }
        .form-field { position: relative; }
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 13px;
          font-family: var(--font-inter);
          color: var(--color-primary);
          cursor: pointer;
          font-weight: 500;
        }
        .forgot-link {
          font-size: 13px;
          font-family: var(--font-inter);
          color: var(--color-grey-blue);
        }
        .forgot-link:hover { color: var(--color-primary); }
        .login-submit-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 13px 16px 13px 20px;
          background: var(--color-dark);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          font-family: var(--font-space-grotesk);
          cursor: pointer;
          transition: opacity 0.15s ease;
          margin-top: 4px;
        }
        .login-submit-btn:hover:not(:disabled) { opacity: 0.88; }
        .login-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-submit-arrow {
          width: 34px;
          height: 34px;
          background: #8cf08a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .login-submit-arrow svg path { stroke: #112c3e; }
      `}</style>
    </form>
  );
}
