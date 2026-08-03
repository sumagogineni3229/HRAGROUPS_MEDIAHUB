import Link from "next/link";

export const metadata = {
  title: "404 – Page Not Found | Media Partner Hub",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-app)",
      fontFamily: "var(--font-inter)",
      padding: "20px",
    }}>
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        {/* Decorative number */}
        <div style={{
          fontSize: "120px",
          fontWeight: 800,
          fontFamily: "var(--font-space-grotesk)",
          lineHeight: 1,
          background: "linear-gradient(135deg, #3E4FEA 0%, #a9b1ff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "24px",
          userSelect: "none",
        }}>
          404
        </div>

        <h1 style={{
          fontSize: "26px",
          fontWeight: 700,
          color: "var(--color-dark)",
          fontFamily: "var(--font-space-grotesk)",
          marginBottom: "12px",
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: "15px",
          color: "var(--color-grey-blue)",
          lineHeight: 1.6,
          marginBottom: "32px",
        }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "#3E4FEA",
              color: "white",
              borderRadius: "50px",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "var(--font-space-grotesk)",
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
          >
            ← Back to home
          </Link>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 24px",
              border: "1.5px solid var(--color-border)",
              background: "white",
              color: "var(--color-dark)",
              borderRadius: "50px",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "var(--font-space-grotesk)",
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
