import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for catching bugs early
  reactStrictMode: true,

  // Optimize images from external sources
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"], // Best compression formats
  },

  // Reduce bundle size: only ship used locales
  i18n: undefined,

  // Compress responses
  compress: true,

  // Skip type checking on build (we check separately)
  typescript: {
    ignoreBuildErrors: false,
  },

  // Experimental: faster builds + better tree-shaking
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
    ],
  },
};

export default nextConfig;
