"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRightIcon, ShoppingBagIcon, GlobeAltIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

type Role = "ADVERTISER" | "PUBLISHER" | "INFLUENCER";

const ROLES = [
  {
    value: "ADVERTISER" as Role,
    label: "Advertiser",
    icon: ShoppingBagIcon,
    desc: "Buy guest posts, link insertions & influencer shoutouts",
  },
  {
    value: "PUBLISHER" as Role,
    label: "Publisher",
    icon: GlobeAltIcon,
    desc: "Monetize your website by accepting paid content",
  },
  {
    value: "INFLUENCER" as Role,
    label: "Influencer",
    icon: DevicePhoneMobileIcon,
    desc: "Earn from brand deals on your social channels",
  },
];

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") ?? undefined;
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("ADVERTISER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, jobTitle, company, phone, website, country, ref: refCode }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); setLoading(false); return; }

      // Auto-login after register
      const { signIn } = await import("next-auth/react");
      await signIn("credentials", { email, password, redirect: false });
      router.push(
        role === "ADVERTISER" ? "/advertiser/sites" :
          role === "PUBLISHER" ? "/publisher/platforms" :
            "/influencer/channels"
      );
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setLoading(true);
    setError("");
    try {
      document.cookie = `signup_role=${role}; path=/; max-age=300`;
      if (refCode) {
        document.cookie = `signup_ref=${refCode}; path=/; max-age=300`;
      }
      const { signIn } = await import("next-auth/react");
      await signIn("google", { callbackUrl: `/auth/oauth-callback?role=${role}` });
    } catch {
      setError("Failed to sign up with Google. Please try again.");
      setLoading(false);
    }
  }

  const ActiveRoleIcon = ROLES.find(r => r.value === role)?.icon || ShoppingBagIcon;
  const activeRoleLabel = ROLES.find(r => r.value === role)?.label || "Advertiser";

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {error && <div className="reg-error">{error}</div>}

      {step === 1 && (
        <>
          <p className="reg-label">I want to join as a…</p>
          <div className="role-grid">
            {ROLES.map((r) => {
              const IconComponent = r.icon;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`role-card ${role === r.value ? "role-card--active" : ""}`}
                >
                  <span className="role-icon-wrapper">
                    <IconComponent className="w-5 h-5 text-grey-blue" />
                  </span>
                  <span className="role-name">{r.label}</span>
                  <span className="role-desc">{r.desc}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
            <button type="submit" className="login-submit-btn">
              <span>Continue with Email</span>
              <span className="login-submit-arrow">
                <ArrowRightIcon className="w-4 h-4 text-dark" />
              </span>
            </button>

            <div className="login-divider">
              <span>Or join using</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="social-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up as {activeRoleLabel} with Google
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <button type="button" onClick={() => setStep(1)} className="reg-back">
            ← Back
          </button>
          <div className="reg-role-chip">
            <ActiveRoleIcon className="w-4 h-4" /> Joining as {activeRoleLabel}
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="social-btn"
            style={{ marginBottom: "6px" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up as {activeRoleLabel} with Google
          </button>

          <div className="login-divider" style={{ margin: "4px 0 10px 0" }}>
            <span>Or register with details</span>
          </div>

          <input className="input" type="text" placeholder="Full name *" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
          <input className="input" type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          <div style={{ position: "relative" }}>
            <input className="input" type={showPassword ? "text" : "password"} placeholder="Password (min 8 characters) *" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" style={{ paddingRight: "60px" }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input className="input" type="text" placeholder="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} autoComplete="organization-title" />
          <input className="input" type="text" placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} autoComplete="organization" />
          <input className="input" type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" />
          <input className="input" type="url" placeholder="Website (e.g. https://example.com)" value={website} onChange={e => setWebsite(e.target.value)} autoComplete="url" />
          <input className="input" type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} autoComplete="country-name" />

          <button type="submit" disabled={loading} className="login-submit-btn">
            <span>{loading ? "Creating account…" : "Create Account"}</span>
            <span className="login-submit-arrow">
              <ArrowRightIcon className="w-4 h-4 text-dark" />
            </span>
          </button>
        </>
      )}

      <style>{`
        .reg-error { background: #fddde5; color: #b91c3d; border-radius: 8px; padding: 10px 14px; font-size: 13px; font-family: var(--font-inter); }
        .reg-label { font-size: 14px; font-family: var(--font-inter); color: var(--color-grey-blue); margin-bottom: -4px; }
        .role-grid { display: flex; flex-direction: column; gap: 8px; }
        .role-card { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 14px 16px; border: 1.5px solid var(--color-border); border-radius: 10px; background: white; cursor: pointer; text-align: left; transition: border-color 0.15s, background 0.15s; }
        .role-card:hover { border-color: var(--color-primary); background: #f0f2fd; }
        .role-card--active { border-color: var(--color-primary); background: #f0f2fd; }
        .role-icon { font-size: 20px; }
        .role-name { font-size: 15px; font-weight: 600; color: var(--color-dark); font-family: var(--font-space-grotesk); }
        .role-desc { font-size: 12px; color: var(--color-grey-blue); font-family: var(--font-inter); }
        .login-submit-btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 13px 16px 13px 20px; background: var(--color-dark); color: white; border: none; border-radius: 50px; font-size: 15px; font-weight: 600; font-family: var(--font-space-grotesk); cursor: pointer; transition: opacity 0.15s ease; }
        .login-submit-btn:hover:not(:disabled) { opacity: 0.88; }
        .login-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-submit-arrow { width: 34px; height: 34px; background: #8cf08a; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 13px; font-family: var(--font-inter); color: var(--color-primary); cursor: pointer; font-weight: 500; }
        .reg-back { background: none; border: none; color: var(--color-grey-blue); font-size: 13px; font-family: var(--font-inter); cursor: pointer; text-align: left; padding: 0; }
        .reg-back:hover { color: var(--color-dark); }
        .reg-role-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #e8eaf9; border-radius: 20px; font-size: 13px; font-weight: 500; color: var(--color-primary); font-family: var(--font-inter); }
        .social-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 11px 16px; border: 1px solid var(--color-border); border-radius: 50px; background: white; font-size: 14px; font-weight: 500; font-family: var(--font-inter); color: var(--color-dark); cursor: pointer; transition: background 0.15s ease; }
        .social-btn:hover:not(:disabled) { background: #f0f2fd; }
        .social-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-divider { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--color-grey-blue); font-family: var(--font-inter); }
        .login-divider::before, .login-divider::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }
      `}</style>
    </form>
  );
}
