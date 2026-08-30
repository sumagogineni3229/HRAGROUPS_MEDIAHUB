"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deletePlatform(platformId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Verify ownership and check if platform exists
    const platform = await db.platform.findFirst({
      where: {
        id: platformId,
        publisherId: session.user.id,
      },
      include: {
        tasks: true,
      },
    });

    if (!platform) {
      return { success: false, error: "Website platform not found or unauthorized" };
    }

    // Check if there are active tasks in progress on this platform
    const hasActiveTasks = platform.tasks.some(
      (t) =>
        t.status === "IN_PROGRESS" ||
        t.status === "TASK_REVIEW" ||
        t.status === "TASK_ACCEPTANCE" ||
        t.status === "YOUR_APPROVAL" ||
        t.status === "IMPROVEMENT"
    );

    if (hasActiveTasks) {
      return {
        success: false,
        error: "Cannot delete website platform with active ongoing tasks/orders.",
      };
    }

    // Dissociate any completed/archived tasks before deleting the platform
    if (platform.tasks.length > 0) {
      await db.task.updateMany({
        where: { platformId },
        data: { platformId: null, packageId: null },
      });
    }

    // Delete associated packages
    await db.package.deleteMany({
      where: { platformId },
    });

    // Delete the platform
    await db.platform.delete({
      where: { id: platformId },
    });

    revalidatePath("/publisher/platforms");
    revalidatePath("/admin/listings");
    revalidatePath("/advertiser/sites");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete platform:", error);
    return { success: false, error: error?.message || "Failed to delete platform" };
  }
}
