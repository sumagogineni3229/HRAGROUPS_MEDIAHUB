import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

// next/font: self-hosted, zero layout shift, no external requests
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Media Partner Hub",
    template: "%s | Media Partner Hub",
  },
  description:
    "The escrow-based content marketplace connecting advertisers with publishers and influencers.",
  keywords: ["guest posting", "link insertion", "influencer marketing", "content marketplace"],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="font-space bg-app antialiased" suppressHydrationWarning>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
