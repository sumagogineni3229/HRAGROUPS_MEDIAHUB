import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const hash = await bcrypt.hash("MediahubPublisher@7890", 12);
    const user = await db.user.upsert({
      where: { email: "mediahub@publisher.com" },
      update: { 
        role: "PUBLISHER", 
        password: hash,
        enabledRoles: ["PUBLISHER"],
        company: "MediaHub Company"
      },
      create: {
        name: "MediaHub Company Publisher",
        email: "mediahub@publisher.com",
        password: hash,
        role: "PUBLISHER",
        enabledRoles: ["PUBLISHER"],
        company: "MediaHub Company"
      },
      select: { id: true, email: true, role: true, name: true }
    });
    return NextResponse.json({ success: true, message: "MediaHub Company Publisher account ready", user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to setup MediaHub Company Publisher account" }, { status: 500 });
  }
}
