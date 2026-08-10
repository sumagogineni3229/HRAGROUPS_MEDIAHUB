// ⚠️ Next.js 16: proxy.ts replaces middleware.ts
// This runs on the Edge — must NOT import Prisma or Node.js modules
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// Role → their home dashboard
const ROLE_HOME: Record<string, string> = {
  ADVERTISER: "/advertiser/sites",
  PUBLISHER:  "/publisher/platforms",
  INFLUENCER: "/influencer/channels",
  ADMIN:      "/admin/dashboard",
};

// Route prefixes each role is allowed
const ROLE_ROUTES: Record<string, string[]> = {
  ADVERTISER: ["/advertiser", "/wallet", "/profile", "/notifications"],
  PUBLISHER:  ["/publisher",  "/wallet", "/profile", "/notifications"],
  INFLUENCER: ["/influencer", "/wallet", "/profile", "/notifications"],
  ADMIN:      ["/admin", "/advertiser", "/publisher", "/influencer", "/wallet", "/profile", "/notifications"],
};

const AUTH_ROUTES   = ["/login", "/register", "/forgot-password", "/reset-password"];
const PUBLIC_ROUTES = ["/", "/api/auth", "/blog", "/solutions", "/podcasts", "/media-kit", "/faq", "/contact", "/terms", "/privacy"];

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const session = req.auth;

  // Bypass static files / images
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/i)) {
    return NextResponse.next();
  }

  const isAuthRoute   = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isPublicRoute = pathname === "/" || PUBLIC_ROUTES.some((r) => r !== "/" && pathname.startsWith(r));
  const isApiRoute    = pathname.startsWith("/api/");

  console.log(`[MIDDLEWARE] Path: ${pathname} | isAuth: ${isAuthRoute} | isPublic: ${isPublicRoute} | HasSession: ${!!session?.user}`);

  // Allow all API routes through (handled separately)
  if (isApiRoute) return NextResponse.next();

  // Logged-in user visiting auth page → redirect to dashboard
  if (isAuthRoute && session?.user) {
    const role = ((session.user as any).activeRole ?? (session.user as any).role) as string;
    console.log(`[MIDDLEWARE] Redirecting logged-in user to: ${ROLE_HOME[role]}`);
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/login", nextUrl));
  }

  // Allow public + auth pages
  if (isPublicRoute || isAuthRoute) return NextResponse.next();

  // Not logged in → send to login
  if (!session?.user) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  const role = ((session.user as any).activeRole ?? (session.user as any).role) as string;
  const allowed = ROLE_ROUTES[role] ?? [];
  const isAllowed = allowed.some((r) => pathname.startsWith(r));

  if (!isAllowed) {
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)"],
};
