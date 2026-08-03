"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
