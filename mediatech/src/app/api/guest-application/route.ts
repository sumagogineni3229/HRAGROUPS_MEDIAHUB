import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, linkedin, topic } = await req.json();

    if (!name || !email || !topic) {
      return NextResponse.json(
        { error: "Name, email, and proposed topic are required." },
        { status: 400 }
      );
    }

    const ownerEmail = process.env.OWNER_EMAIL || "mediahubworks@gmail.com";
    const notificationSubject = `🎙️ New Podcast Guest Application: ${name} (${company || "Independent"})`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; color: #112c3e; border-radius: 16px; border: 1px solid #e2e8f0;">
        <div style="background: #112c3e; color: #ffffff; padding: 20px 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">MediaHub Talks — Guest Application</h2>
        </div>
        <div style="background: #ffffff; padding: 24px; border-radius: 0 0 12px 12px;">
          <h3 style="margin-top: 0; color: #3e4fea;">Applicant Details</h3>
          <p style="margin: 6px 0;"><strong>Full Name:</strong> ${name}</p>
          <p style="margin: 6px 0;"><strong>Email Address:</strong> <a href="mailto:${email}" style="color: #3e4fea;">${email}</a></p>
          <p style="margin: 6px 0;"><strong>Company / Organization:</strong> ${company || "N/A"}</p>
          <p style="margin: 6px 0;"><strong>LinkedIn / Website:</strong> ${linkedin ? `<a href="${linkedin}" target="_blank" style="color: #3e4fea;">${linkedin}</a>` : "Not provided"}</p>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

          <h3 style="margin-top: 0; color: #112c3e;">Proposed Topic / Key Insight</h3>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; font-style: italic; color: #334155; line-height: 1.6;">
            "${topic}"
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${email}?subject=RE: MediaHub Talks Guest Application" style="display: inline-block; background: #3e4fea; color: #ffffff; padding: 12px 24px; border-radius: 50px; font-weight: bold; text-decoration: none;">
              Reply to ${name}
            </a>
          </div>
        </div>
      </div>
    `;

    // 1. Send notification email via Resend if API key is present
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const data = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "MediaHub <onboarding@resend.dev>",
          to: ownerEmail,
          subject: notificationSubject,
          html: emailHtml,
        });
        console.log("[RESEND EMAIL SUCCESS]", data);
      } catch (emailErr) {
        console.error("[RESEND EMAIL ERROR]", emailErr);
      }
    } else {
      console.log(`[DEV EMAIL NOTIFICATION] Guest Application received for ${ownerEmail}:`, {
        name,
        email,
        company,
        linkedin,
        topic,
      });
    }

    // Sync to HubSpot Leads & CRM
    const { submitToHubSpot } = await import("@/lib/hubspot");
    submitToHubSpot({
      email,
      name,
      companyName: company || undefined,
      query: `[Topic: ${topic}] LinkedIn/Website: ${linkedin || "None"}`,
      type: "Podcast Guest Application",
    }).catch((hubErr) => console.warn("HubSpot guest app sync error:", hubErr));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[guest-application route error]", err);
    return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 });
  }
}
