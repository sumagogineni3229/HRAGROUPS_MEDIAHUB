import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create Account",
  description: "Join Media Partner Hub as an Advertiser, Publisher, or Influencer.",
};

export default function RegisterPage() {
  return (
    <main className="login-page">
      <div className="login-bg">
        <div className="login-bg__blob login-bg__blob--purple" />
        <div className="login-bg__blob login-bg__blob--green" />
      </div>

      <div className="login-card" style={{ maxWidth: 500 }}>
        <div className="login-logo">
          <Link href="/">
            <img
              src="/mediahub1.png"
              alt="Media Hub Logo"
              style={{ height: "42px", width: "auto", objectFit: "contain", margin: "0 auto" }}
            />
          </Link>
        </div>

        <h1 className="login-title">Create Account</h1>

        <Suspense fallback={
          <div style={{ height: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="skeleton" style={{ width: "100%", height: "240px", borderRadius: "12px" }} />
          </div>
        }>
          <RegisterForm />
        </Suspense>

        <p className="login-footer">
          Already have an account?{" "}
          <Link href="/login">Log in</Link>
        </p>
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
        .login-card { position: relative; z-index: 10; background: white; border-radius: 20px; padding: 40px 44px; width: 100%; box-shadow: 0 8px 40px rgba(17,44,62,0.10); }
        .login-logo { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 20px; font-size: 16px; font-weight: 600; color: var(--color-dark); }
        .login-title { font-size: 28px; font-weight: 700; color: var(--color-dark); text-align: center; margin-bottom: 24px; font-family: var(--font-space-grotesk); }
        .login-footer { text-align: center; font-size: 14px; font-family: var(--font-inter); color: var(--color-grey-blue); margin-top: 20px; }
        .login-footer a { color: var(--color-primary); font-weight: 500; }
        .login-footer a:hover { text-decoration: underline; }
        @media (max-width: 540px) { .login-card { padding: 28px 20px; } .da-watermark { display: none; } }
      `}</style>
    </main>
  );
}
