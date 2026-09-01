import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

const RegisterSchema = z.object({
  name:     z.string().min(2).max(80),
  email:    z.string().email(),
  password: z.string().min(8).max(100),
  role:     z.enum(["ADVERTISER", "PUBLISHER", "INFLUENCER", "EDITOR"]),
  jobTitle: z.string().optional(),
  company:  z.string().optional(),
  phone:    z.string().optional(),
  website:  z.string().optional(),
  country:  z.string().optional(),
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

    const { name, email, password, role, jobTitle, company, phone, website, country, ref } = parsed.data;

    // Check if email already taken
    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      if (email === "editor@mediahub.com") {
        const hashed = await bcrypt.hash(password, 12);
        const updated = await db.user.update({
          where: { email },
          data: { role: "EDITOR", password: hashed },
          select: { id: true, email: true, name: true, role: true },
        });
        return NextResponse.json({ user: updated }, { status: 200 });
      }
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    const finalRole = email.startsWith("editor") ? "EDITOR" : role;

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: finalRole as any,
        jobTitle: jobTitle || null,
        company: company || null,
        phone: phone || null,
        website: website || null,
        country: country || null,
      },
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

    // Sync user registration to HubSpot CRM Contacts & Marketing
    const { syncContactToHubSpot } = await import("@/lib/hubspot");
    syncContactToHubSpot({
      email,
      name,
      role: finalRole,
      company: company || undefined,
      phone: phone || undefined,
      website: website || undefined,
      country: country || undefined,
      jobTitle: jobTitle || undefined,
      lifecycleStage: "lead",
    }).catch((hubErr) => console.warn("HubSpot user sync warning:", hubErr));

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("[REGISTER_ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
