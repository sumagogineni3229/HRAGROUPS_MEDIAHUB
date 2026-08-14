import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const hash = await bcrypt.hash("Editor@12345", 12);
    const user = await db.user.upsert({
      where: { email: "editor@mediahub.com" },
      update: { role: "EDITOR", password: hash },
      create: {
        name: "MediaHub Content Editor",
        email: "editor@mediahub.com",
        password: hash,
        role: "EDITOR",
      },
      select: { id: true, email: true, role: true }
    });
    return NextResponse.json({ success: true, message: "Editor credentials ready", user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to setup editor credentials" }, { status: 500 });
  }
}
