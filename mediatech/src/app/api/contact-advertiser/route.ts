import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, countryCode, phone, companySize, goal, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const ownerEmail = process.env.OWNER_EMAIL || "mediahubworks@gmail.com";
    const notificationSubject = `📩 New Advertiser Contact Inquiry from ${name}`;
    const fullPhone = phone ? `${countryCode || "+91"} ${phone}` : "Not provided";

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; color: #112c3e; border-radius: 16px; border: 1px solid #e2e8f0;">
        <div style="background: #112c3e; color: #ffffff; padding: 20px 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">MediaHub Advertiser Contact Form</h2>
        </div>
        <div style="background: #ffffff; padding: 24px; border-radius: 0 0 12px 12px;">
          <h3 style="margin-top: 0; color: #3e4fea;">Contact Details</h3>
          <p style="margin: 6px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3e4fea;">${email}</a></p>
          <p style="margin: 6px 0;"><strong>Phone:</strong> ${fullPhone}</p>
          <p style="margin: 6px 0;"><strong>Company Size:</strong> ${companySize || "Not specified"}</p>
          <p style="margin: 6px 0;"><strong>Goal:</strong> ${goal || "Not specified"}</p>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

          <h3 style="margin-top: 0; color: #112c3e;">Message / Inquiry</h3>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; font-style: italic; color: #334155; line-height: 1.6;">
            "${message}"
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${email}?subject=RE: MediaHub Advertiser Inquiry" style="display: inline-block; background: #3e4fea; color: #ffffff; padding: 12px 24px; border-radius: 50px; font-weight: bold; text-decoration: none;">
              Reply to ${name}
            </a>
          </div>
        </div>
      </div>
    `;

    // Send email via Resend if API key is present
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "MediaHub Notifications <onboarding@resend.dev>";
        const data = await resend.emails.send({
          from: fromEmail,
          to: ownerEmail,
          replyTo: email,
          subject: notificationSubject,
          html: emailHtml,
        });
        console.log("[ADVERTISER CONTACT EMAIL SUCCESS]", data);
      } catch (emailErr) {
        console.error("[ADVERTISER CONTACT EMAIL ERROR]", emailErr);
      }
    } else {
      console.log(`[DEV CONTACT EMAIL] Advertiser inquiry for ${ownerEmail}:`, {
        name,
        email,
        phone: fullPhone,
        companySize,
        goal,
        message,
      });
    }

    // Sync to HubSpot Leads & CRM
    const { submitToHubSpot } = await import("@/lib/hubspot");
    submitToHubSpot({
      email,
      name,
      phone: fullPhone,
      companyName: companySize ? `Company (${companySize})` : undefined,
      query: `[Goal: ${goal || "General"}] ${message}`,
      type: "Advertiser Inquiry",
    }).catch((hubErr) => console.warn("HubSpot advertiser inquiry sync error:", hubErr));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact-advertiser route error]", err);
    return NextResponse.json({ error: "Failed to submit inquiry. Please try again." }, { status: 500 });
  }
}
