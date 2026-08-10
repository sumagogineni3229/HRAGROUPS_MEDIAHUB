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

  // Fetch current user to merge enabledRoles
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true, enabledRoles: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Build the new enabledRoles array (union of existing + new role)
  const existingRoles: string[] = user.enabledRoles.length > 0 ? user.enabledRoles : [user.role];
  const updatedRoles = Array.from(new Set([...existingRoles, newRole]));

  // Update user's role and enabledRoles in the DB
  await db.user.update({
    where: { id: userId },
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
