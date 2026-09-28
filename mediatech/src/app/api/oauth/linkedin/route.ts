import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/oauth/linkedin/callback`;

  // If live credentials are configured, redirect directly to LinkedIn's official OAuth portal
  if (clientId && !clientId.includes("your_linkedin")) {
    const state = Buffer.from(JSON.stringify({ userId: session.user.id })).toString("base64");
    const scope = encodeURIComponent("openid profile email");
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;

    return NextResponse.redirect(linkedInAuthUrl);
  }

  // Fallback simulator redirect if keys are pending
  return NextResponse.redirect(`${baseUrl}/api/oauth/linkedin/callback?simulated=true&userId=${encodeURIComponent(session.user.id)}`);
}
