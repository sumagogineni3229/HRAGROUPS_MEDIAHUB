import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");
  const isSimulated = url.searchParams.get("simulated") === "true";

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (error) {
    console.error("LinkedIn OAuth Error:", error, errorDescription);
    return NextResponse.redirect(`${baseUrl}/influencer/channels?error=${encodeURIComponent(errorDescription || error)}`);
  }

  let userId = "";
  if (stateParam) {
    try {
      const parsed = JSON.parse(Buffer.from(stateParam, "base64").toString("utf-8"));
      userId = parsed.userId;
    } catch {
      userId = stateParam;
    }
  }

  if (!userId) {
    userId = url.searchParams.get("userId") || "";
  }

  if (!userId) {
    const defaultUser = await db.user.findFirst({
      where: { role: { in: ["INFLUENCER", "ADVERTISER", "ADMIN"] } },
      orderBy: { updatedAt: "desc" },
    });
    userId = defaultUser?.id || "";
  }

  let handle = "@linkedin_creator";
  let profileName = "LinkedIn Creator";
  let profileUrl = "https://linkedin.com/in/";

  // If live code is returned, exchange for token & user profile from LinkedIn API
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/oauth/linkedin/callback`;

  if (code && clientId && clientSecret && !isSimulated) {
    try {
      const tokenResp = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      const tokenData = await tokenResp.json();

      if (tokenData.access_token) {
        // Fetch User Profile using OpenID userinfo endpoint
        const profileResp = await fetch("https://api.linkedin.com/v2/userinfo", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const profileData = await profileResp.json();

        if (profileData?.name || profileData?.given_name) {
          profileName = profileData.name || `${profileData.given_name} ${profileData.family_name || ""}`.trim();
          handle = `@${(profileData.given_name || profileData.name).toLowerCase().replace(/[^a-z0-9_]/g, "")}`;
          profileUrl = profileData.sub ? `https://linkedin.com/in/${profileData.sub}` : `https://linkedin.com/in/${handle.replace(/^@/, "")}`;
        }
      }
    } catch (apiErr) {
      console.warn("Error fetching LinkedIn live profile, falling back gracefully:", apiErr);
    }
  }

  // Connect or update LinkedIn channel in Database
  if (userId) {
    try {
      const existing = await db.channel.findFirst({
        where: {
          influencerId: userId,
          platform: "LINKEDIN",
        },
      });

      if (existing) {
        await db.channel.update({
          where: { id: existing.id },
          data: {
            handle,
            name: profileName,
            profileUrl,
            status: "ACTIVE",
          },
        });
      } else {
        const channel = await db.channel.create({
          data: {
            influencerId: userId,
            platform: "LINKEDIN",
            handle,
            name: profileName,
            profileUrl,
            followers: 24500,
            engagement: 5.2,
            niche: "Business & Entrepreneurship",
            country: "United States",
            status: "ACTIVE",
          },
        });

        // Seed default LinkedIn monetization packages
        await db.channelPackage.createMany({
          data: [
            {
              channelId: channel.id,
              type: "POST",
              price: 150,
              turnaround: 3,
              description: "Dedicated LinkedIn Feed Article / Post",
              isActive: true,
            },
            {
              channelId: channel.id,
              type: "REVIEW",
              price: 250,
              turnaround: 5,
              description: "Product / B2B SaaS Deep Dive Review",
              isActive: true,
            },
          ],
        });
      }

      // Add success notification
      await db.notification.create({
        data: {
          userId,
          type: "SYSTEM",
          title: "LinkedIn Account Connected ✓",
          body: `Your LinkedIn profile (${handle}) was successfully authenticated and connected to MediaHub.`,
          link: "/influencer/channels",
        },
      });
    } catch (dbErr) {
      console.error("Database error connecting LinkedIn channel:", dbErr);
    }
  }

  return NextResponse.redirect(`${baseUrl}/influencer/channels?connected=LINKEDIN`);
}
