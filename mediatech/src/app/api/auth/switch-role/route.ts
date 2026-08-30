import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_ROLES = ["ADVERTISER", "PUBLISHER", "INFLUENCER"] as const;
type SwitchableRole = (typeof VALID_ROLES)[number];

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const newRole = body?.role as string;

  if (!VALID_ROLES.includes(newRole as SwitchableRole)) {
    return NextResponse.json(
      { error: "Invalid role. Must be ADVERTISER, PUBLISHER, or INFLUENCER." },
      { status: 400 }
    );
  }

  const userId = session.user.id;
  const userEmail = session.user.email?.toLowerCase().trim();

  // Fetch current user by id or email (case-insensitive)
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
    console.error("[SWITCH_ROLE] User not found for session:", { userId, userEmail });
    return NextResponse.json({ error: "User not found", sessionUserId: userId, sessionUserEmail: userEmail }, { status: 404 });
  }

  if (user.role === "ADMIN" || (user.role as string) === "EDITOR") {
    return NextResponse.json({ error: "Administrative accounts cannot switch roles." }, { status: 403 });
  }

  // Build the new enabledRoles array (union of existing + new role)
  const existingRoles: string[] = user.enabledRoles && user.enabledRoles.length > 0 ? user.enabledRoles : [user.role];
  const updatedRoles = Array.from(new Set([...existingRoles, newRole]));

  // Update user's role and enabledRoles in the DB
  await db.user.update({
    where: { id: user.id },
    data: {
      role: newRole as any,
      enabledRoles: updatedRoles,
    },
  });

  return NextResponse.json({
    success: true,
    activeRole: newRole,
    enabledRoles: updatedRoles,
  });
}
