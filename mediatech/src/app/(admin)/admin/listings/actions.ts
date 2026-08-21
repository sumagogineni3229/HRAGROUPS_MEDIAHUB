"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function approvePlatformAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const platformId = formData.get("platformId") as string;
  if (!platformId) return { success: false, error: "Platform ID is required" };

  const url = formData.get("url") as string;
  const niche = formData.get("niche") as string;
  const country = formData.get("country") as string;
  const language = (formData.get("language") as string) || "English";
  const da = parseInt((formData.get("da") as string) || "0", 10);
  const dr = parseInt((formData.get("dr") as string) || "0", 10);
  const traffic = parseInt((formData.get("traffic") as string) || "0", 10);

  // Update platform details and approve
  const updateData: any = {
    status: "ACTIVE",
  };
  if (url) updateData.url = url;
  if (niche) updateData.niche = niche;
  if (country) updateData.country = country;
  if (language) updateData.language = language;
  if (!isNaN(da)) updateData.da = da;
  if (!isNaN(dr)) updateData.dr = dr;
  if (!isNaN(traffic)) updateData.traffic = traffic;

  const platform = await db.platform.update({
    where: { id: platformId },
    data: updateData,
    include: { packages: true },
  });

  // Update packages if provided
  const packageTypes = ["ARTICLE_POSTING", "LINK_INSERTION", "PRESS_RELEASE"];
  for (const pType of packageTypes) {
    const priceStr = formData.get(`package_${pType}_price`) as string;
    if (priceStr !== null && priceStr !== undefined && priceStr !== "") {
      const price = parseFloat(priceStr);
      const existingPkg = platform.packages.find((p) => p.type === pType);
      if (existingPkg) {
        await db.package.update({
          where: { id: existingPkg.id },
          data: { price },
        });
      }
    }
  }

  await db.notification.create({
    data: {
      userId: platform.publisherId,
      type: "TASK_UPDATE",
      title: "Listing approved!",
      body: `Your website ${platform.url} has been approved and is now live on the marketplace.`,
      link: "/publisher/platforms",
    },
  });

  revalidatePath("/admin/listings");
  return { success: true };
}

export async function rejectPlatformAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const platformId = formData.get("platformId") as string;
  const note = (formData.get("note") as string) || "";
  if (!platformId) return { success: false, error: "Platform ID is required" };

  const platform = await db.platform.update({
    where: { id: platformId },
    data: { status: "REJECTED", adminNote: note },
  });

  await db.notification.create({
    data: {
      userId: platform.publisherId,
      type: "SYSTEM",
      title: "Listing rejected",
      body: note
        ? `Your website listing was rejected: ${note}`
        : "Your website listing was rejected. Please review our guidelines.",
      link: "/publisher/platforms",
    },
  });

  revalidatePath("/admin/listings");
  return { success: true };
}

export async function approveChannelAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const channelId = formData.get("channelId") as string;
  if (!channelId) return { success: false, error: "Channel ID is required" };

  const platform = formData.get("platform") as any;
  const handle = formData.get("handle") as string;
  const profileUrl = formData.get("profileUrl") as string;
  const niche = formData.get("niche") as string;
  const country = formData.get("country") as string;
  const language = (formData.get("language") as string) || "English";
  const followers = parseInt((formData.get("followers") as string) || "0", 10);
  const engagement = parseFloat((formData.get("engagement") as string) || "0");

  const updateData: any = {
    status: "ACTIVE",
  };
  if (platform) updateData.platform = platform;
  if (handle) updateData.handle = handle.replace(/^@/, "").trim();
  if (profileUrl !== undefined) updateData.profileUrl = profileUrl;
  if (niche) updateData.niche = niche;
  if (country) updateData.country = country;
  if (language) updateData.language = language;
  if (!isNaN(followers)) updateData.followers = followers;
  if (!isNaN(engagement)) updateData.engagement = engagement;

  const channel = await db.channel.update({
    where: { id: channelId },
    data: updateData,
    include: { packages: true },
  });

  // Update channel package prices
  const channelPkgTypes = ["POST", "STORY", "REEL", "VIDEO", "REVIEW"];
  for (const pkgType of channelPkgTypes) {
    const priceStr = formData.get(`package_${pkgType}_price`) as string;
    if (priceStr !== null && priceStr !== undefined && priceStr !== "") {
      const price = parseFloat(priceStr);
      const existingPkg = channel.packages.find((p) => p.type === pkgType);
      if (existingPkg) {
        await db.channelPackage.update({
          where: { id: existingPkg.id },
          data: { price },
        });
      }
    }
  }

  await db.notification.create({
    data: {
      userId: channel.influencerId,
      type: "TASK_UPDATE",
      title: "Channel approved!",
      body: `Your channel @${channel.handle} has been approved and is now live on the marketplace.`,
      link: "/influencer/channels",
    },
  });

  revalidatePath("/admin/listings");
  return { success: true };
}

export async function rejectChannelAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const channelId = formData.get("channelId") as string;
  const note = (formData.get("note") as string) || "";
  if (!channelId) return { success: false, error: "Channel ID is required" };

  const channel = await db.channel.update({
    where: { id: channelId },
    data: { status: "REJECTED", adminNote: note },
  });

  await db.notification.create({
    data: {
      userId: channel.influencerId,
      type: "SYSTEM",
      title: "Channel rejected",
      body: note
        ? `Your channel listing was rejected: ${note}`
        : "Your channel listing was rejected. Please review our guidelines.",
      link: "/influencer/channels",
    },
  });

  revalidatePath("/admin/listings");
  return { success: true };
}
