"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const VALID_ROLES = ["ADVERTISER", "PUBLISHER", "INFLUENCER"] as const;

export async function switchRoleAction(newRole: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Unauthorized. Please log in again." };
    }

    if (!VALID_ROLES.includes(newRole as any)) {
      return { success: false, error: "Invalid role." };
    }

    const userId = session.user.id;
    const userEmail = session.user.email?.toLowerCase().trim();

    // Query user by ID or Email
    const user = await db.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: { equals: userEmail, mode: "insensitive" as const } }] : []),
        ],
      },
      select: { id: true, email: true, role: true, enabledRoles: true },
    });

    if (!user) {
      return { success: false, error: "User account not found." };
    }

    if (user.role === "ADMIN" || (user.role as string) === "EDITOR") {
      return { success: false, error: "Administrative accounts cannot switch roles." };
    }

    const existingRoles: string[] = user.enabledRoles && user.enabledRoles.length > 0 ? user.enabledRoles : [user.role];
    const updatedRoles = Array.from(new Set([...existingRoles, newRole]));

    await db.user.update({
      where: { id: user.id },
      data: {
        role: newRole as any,
        enabledRoles: updatedRoles,
      },
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      activeRole: newRole,
      enabledRoles: updatedRoles,
    };
  } catch (err: any) {
    console.error("[SWITCH_ROLE_ACTION_ERROR]", err);
    return { success: false, error: err.message || "Failed to switch role" };
  }
}
