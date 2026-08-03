import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ROLE_HOME: Record<string, string> = {
  ADVERTISER: "/advertiser/sites",
  PUBLISHER:  "/publisher/platforms",
  INFLUENCER: "/influencer/channels",
  ADMIN:      "/admin/dashboard",
};

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const searchParams = req.nextUrl.searchParams;
    const roleParam = searchParams.get("role");
    const cookieStore = await cookies();
    const roleCookie = cookieStore.get("signup_role")?.value;

    const requestedRole = (roleParam || roleCookie || "").toUpperCase();
    const validRoles = ["ADVERTISER", "PUBLISHER", "INFLUENCER"];

    let userRole = (session.user as any).role || "ADVERTISER";

    // If a valid role was requested during signup, update the user record
    if (validRoles.includes(requestedRole)) {
      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: { role: requestedRole as any },
        select: { role: true },
      });
      userRole = updatedUser.role;
    } else {
      // Fetch latest role from DB to ensure accuracy for login
      const dbUser = await db.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });
      if (dbUser?.role) {
        userRole = dbUser.role;
      }
    }

    const targetDashboard = ROLE_HOME[userRole] ?? "/";
    const response = NextResponse.redirect(new URL(targetDashboard, req.url));

    // Clear role cookie if present
    if (roleCookie) {
      response.cookies.delete("signup_role");
    }

    return response;
  } catch (error) {
    console.error("[OAUTH_CALLBACK_ERROR]", error);
    return NextResponse.redirect(new URL("/login?error=OAuthCallback", req.url));
  }
}
