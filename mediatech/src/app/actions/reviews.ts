"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitPlatformReview({
  platformId,
  rating,
  comment,
}: {
  platformId: string;
  rating: number;
  comment?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to review a website platform." };
  }

  if (!platformId) {
    return { success: false, error: "Platform ID is required." };
  }

  const parsedRating = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));

  try {
    // Find platform and verify it exists
    const platform = await db.platform.findUnique({
      where: { id: platformId },
      select: { id: true, url: true, publisherId: true },
    });

    if (!platform) {
      return { success: false, error: "Platform not found." };
    }

    // Upsert review (one review per advertiser per platform)
    const review = await db.review.upsert({
      where: {
        platformId_userId: {
          platformId,
          userId: session.user.id,
        },
      },
      update: {
        rating: parsedRating,
        comment: comment?.trim() || null,
      },
      create: {
        platformId,
        userId: session.user.id,
        rating: parsedRating,
        comment: comment?.trim() || null,
      },
    });

    // Notify publisher if it's a new review from someone else
    if (platform.publisherId !== session.user.id) {
      const reviewerName = session.user.name || session.user.email || "An advertiser";
      await db.notification.create({
        data: {
          userId: platform.publisherId,
          type: "SYSTEM",
          title: `New ⭐ ${parsedRating}-Star Review!`,
          body: `${reviewerName} left a ${parsedRating}/5 star review for your website ${platform.url}.`,
          link: "/publisher/platforms",
        },
      });
    }

    revalidatePath("/advertiser/sites");
    revalidatePath("/publisher/platforms");

    return { success: true, review };
  } catch (error: any) {
    console.error("Error submitting platform review:", error);
    return { success: false, error: error?.message || "Failed to submit review." };
  }
}
