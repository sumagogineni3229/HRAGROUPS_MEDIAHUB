import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, phone, reason } = await req.json();

    if (!email || !phone || !reason) {
      return NextResponse.json(
        { error: "Gmail/Email, phone number, and reason for call are required." },
        { status: 400 }
      );
    }

    const ownerEmail = process.env.OWNER_EMAIL || "mediahubworks@gmail.com";
    const notificationSubject = `📞 New Demo Call Booking Request`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; color: #112c3e; border-radius: 16px; border: 1px solid #e2e8f0;">
        <div style="background: #112c3e; color: #ffffff; padding: 20px 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">MediaHub — Demo Call Request</h2>
        </div>
        <div style="background: #ffffff; padding: 24px; border-radius: 0 0 12px 12px;">
          <h3 style="margin-top: 0; color: #3e4fea;">Contact Information</h3>
          <p style="margin: 6px 0;"><strong>Gmail / Email:</strong> <a href="mailto:${email}" style="color: #3e4fea;">${email}</a></p>
          <p style="margin: 6px 0;"><strong>Phone Number:</strong> <a href="tel:${phone}" style="color: #3e4fea;">${phone}</a></p>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

          <h3 style="margin-top: 0; color: #112c3e;">Reason for Demo Call</h3>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; font-style: italic; color: #334155; line-height: 1.6;">
            "${reason}"
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${email}?subject=RE: MediaHub Demo Call Schedule" style="display: inline-block; background: #3e4fea; color: #ffffff; padding: 12px 24px; border-radius: 50px; font-weight: bold; text-decoration: none;">
              Reply & Confirm Schedule
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
        const data = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "MediaHub <onboarding@resend.dev>",
          to: ownerEmail,
          subject: notificationSubject,
          html: emailHtml,
        });
        console.log("[DEMO CALL EMAIL SUCCESS]", data);
      } catch (emailErr) {
        console.error("[DEMO CALL EMAIL ERROR]", emailErr);
      }
    } else {
      console.log(`[DEV DEMO CALL EMAIL] Demo call request for ${ownerEmail}:`, {
        email,
        phone,
        reason,
      });
    }

    // Sync to HubSpot Leads & CRM
    const { submitToHubSpot } = await import("@/lib/hubspot");
    submitToHubSpot({
      email,
      phone,
      query: `Reason for Demo Call: ${reason}`,
      type: "Demo Call Booking",
    }).catch((hubErr) => console.warn("HubSpot demo call sync error:", hubErr));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[book-demo-call route error]", err);
    return NextResponse.json({ error: "Failed to book demo call. Please try again." }, { status: 500 });
  }
}
