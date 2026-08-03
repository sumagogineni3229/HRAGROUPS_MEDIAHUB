import React from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import { VectorLoader } from "@/components/ui/loader";

export const metadata = {
  title: "Log In",
  description: "Sign in to your Media Partner Hub account.",
};

export default function LoginPage() {
  return (
    <main className="login-page">
      {/* Gradient background blobs */}
      <div className="login-bg">
        <div className="login-bg__blob login-bg__blob--purple" />
        <div className="login-bg__blob login-bg__blob--green" />
      </div>


      {/* Login card */}
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="#3E4FEA" />
            <text x="18" y="23" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Space Grotesk">M</text>
          </svg>
          <span>Media Partner Hub</span>
        </div>

        <h1 className="login-title">Log In</h1>

        {/* Social buttons */}
        <div className="social-btns">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button type="submit" className="social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </form>
        </div>

        <div className="login-divider">
          <span>Or continue with</span>
        </div>

        <React.Suspense fallback={<VectorLoader />}>
          <LoginForm />
        </React.Suspense>

        <p className="login-footer">
          No account yet?{" "}
          <Link href="/register">Create a new account</Link>
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
        }
        .login-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .login-bg__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
        }
        .login-bg__blob--purple {
          width: 500px; height: 500px;
          background: #a9b1ff;
          top: -120px; left: -120px;
        }
        .login-bg__blob--green {
          width: 400px; height: 400px;
          background: #8cf08a;
          bottom: -100px; right: -100px;
        }
        .da-watermark {
          position: absolute;
          font-size: 13px;
          font-family: var(--font-inter);
          font-weight: 500;
          color: #677f9b;
          opacity: 0.4;
          user-select: none;
          pointer-events: none;
        }
        .login-card {
          position: relative;
          z-index: 10;
          background: white;
          border-radius: 20px;
          padding: 40px 44px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 8px 40px rgba(17,44,62,0.10);
        }
        .login-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: 600;
          color: var(--color-dark);
        }
        .login-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--color-dark);
          text-align: center;
          margin-bottom: 24px;
          font-family: var(--font-space-grotesk);
        }
        .social-btns {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 11px 16px;
          border: 1px solid var(--color-border);
          border-radius: 50px;
          background: white;
          font-size: 14px;
          font-weight: 500;
          font-family: var(--font-inter);
          color: var(--color-dark);
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .social-btn:hover { background: var(--color-app); }
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          font-size: 13px;
          color: var(--color-grey-blue);
          font-family: var(--font-inter);
        }
        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }
        .login-footer {
          text-align: center;
          font-size: 14px;
          font-family: var(--font-inter);
          color: var(--color-grey-blue);
          margin-top: 20px;
        }
        .login-footer a {
          color: var(--color-primary);
          font-weight: 500;
        }
        .login-footer a:hover { text-decoration: underline; }
        @media (max-width: 500px) {
          .login-card { margin: 16px; padding: 28px 24px; }
          .da-watermark { display: none; }
        }
      `}</style>
    </main>
  );
}
