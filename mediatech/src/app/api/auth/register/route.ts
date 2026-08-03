import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

const RegisterSchema = z.object({
  name:     z.string().min(2).max(80),
  email:    z.string().email(),
  password: z.string().min(8).max(100),
  role:     z.enum(["ADVERTISER", "PUBLISHER", "INFLUENCER"]),
  ref:      z.string().optional(),  // referrer userId
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password, role, ref } = parsed.data;

    // Check if email already taken
    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: { name, email, password: hashed, role },
      select: { id: true, email: true, name: true, role: true },
    });

    // Wire referral if a valid referrer was provided
    if (ref && ref !== user.id) {
      const referrer = await db.user.findUnique({ where: { id: ref }, select: { id: true } });
      if (referrer) {
        await db.referral.create({
          data: { referrerId: referrer.id, referredId: user.id, commission: 0 },
        });
      }
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("[REGISTER_ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
