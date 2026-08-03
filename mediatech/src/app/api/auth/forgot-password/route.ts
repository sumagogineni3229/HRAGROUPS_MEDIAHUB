import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, name: true },
    });

    // Always return success even if user not found (security: don't leak emails)
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Store token in DB
    await db.passwordResetToken.upsert({
      where: { email: user.email },
      update: { token, expires },
      create: { email: user.email, token, expires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // Send email via Resend (lazy init — only runs at request time, not build time)
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "noreply@mediapartnerhub.com",
        to: user.email,
        subject: "Reset your Media Partner Hub password",
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; background: #f5f8fa;">
            <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(17,44,62,0.08);">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #112C3E;">
                  <div style="width: 32px; height: 32px; background: #3E4FEA; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px;">M</div>
                  Media Partner Hub
                </div>
              </div>
              <h1 style="font-size: 22px; font-weight: 700; color: #112C3E; margin: 0 0 12px;">Reset your password</h1>
              <p style="font-size: 14px; color: #677F9B; line-height: 1.6; margin: 0 0 24px;">
                Hi ${user.name ?? "there"},<br/><br/>
                We received a request to reset the password for your account.
                Click the button below to set a new password. This link expires in 1 hour.
              </p>
              <a href="${resetUrl}" style="display: block; text-align: center; background: #112C3E; color: white; padding: 14px 24px; border-radius: 50px; font-size: 15px; font-weight: 600; text-decoration: none; margin-bottom: 20px;">
                Reset Password →
              </a>
              <p style="font-size: 12px; color: #677F9B; line-height: 1.6; margin: 0;">
                If you didn't request this, you can safely ignore this email. Your password won't change.<br/><br/>
                Or copy this link: <a href="${resetUrl}" style="color: #3E4FEA;">${resetUrl}</a>
              </p>
            </div>
          </div>
        `,
      });
    } else {
      // Dev mode: log the reset URL
      console.log(`[DEV] Password reset link for ${user.email}: ${resetUrl}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
