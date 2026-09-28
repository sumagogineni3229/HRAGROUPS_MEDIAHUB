"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function connectChannelAction(data: {
  platform: string;
  handle: string;
  profileUrl?: string;
  followers?: number;
  engagement?: number;
  niche?: string;
  country?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await db.channel.findFirst({
      where: {
        influencerId: session.user.id,
        platform: data.platform as any,
      },
    });

    if (existing) {
      // Update existing connection
      await db.channel.update({
        where: { id: existing.id },
        data: {
          handle: data.handle,
          profileUrl: data.profileUrl || `https://${data.platform.toLowerCase()}.com/${data.handle.replace(/^@/, '')}`,
          followers: data.followers ?? existing.followers,
          engagement: data.engagement ?? existing.engagement,
          niche: data.niche ?? existing.niche,
          country: data.country ?? existing.country,
          status: "ACTIVE",
        },
      });
    } else {
      // Create new connected channel with default packages
      const channel = await db.channel.create({
        data: {
          influencerId: session.user.id,
          platform: data.platform as any,
          handle: data.handle,
          profileUrl: data.profileUrl || `https://${data.platform.toLowerCase()}.com/${data.handle.replace(/^@/, '')}`,
          followers: data.followers ?? 15000,
          engagement: data.engagement ?? 4.2,
          niche: data.niche ?? "Technology & Gadgets",
          country: data.country ?? "United States",
          status: "ACTIVE",
        },
      });

      // Seed default service packages
      await db.channelPackage.createMany({
        data: [
          {
            channelId: channel.id,
            type: "POST",
            price: 50,
            turnaround: 3,
            description: "Dedicated sponsored post",
            isActive: true,
          },
          {
            channelId: channel.id,
            type: "STORY",
            price: 25,
            turnaround: 1,
            description: "24h Story mention with swipe-up/link",
            isActive: true,
          },
          {
            channelId: channel.id,
            type: "REEL",
            price: 100,
            turnaround: 5,
            description: "High-engagement video reel/short",
            isActive: true,
          },
        ],
      });
    }

    revalidatePath("/influencer/channels");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to connect social account:", error);
    return { success: false, error: error?.message || "Failed to connect social account" };
  }
}

export async function deleteChannel(channelId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Verify ownership and delete channel
    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        influencerId: session.user.id,
      },
    });

    if (!channel) {
      return { success: false, error: "Channel not found or unauthorized" };
    }

    await db.channel.delete({
      where: { id: channelId },
    });

    revalidatePath("/influencer/channels");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete channel" };
  }
}

