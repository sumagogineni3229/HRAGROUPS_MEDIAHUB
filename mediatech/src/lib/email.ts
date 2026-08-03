/**
 * Email notifications helper using Resend.
 * Lazily loads the resend package to prevent build-time/edge execution errors.
 */

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not defined. Email skipped.");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@mediapartnerhub.com";

    const response = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
  }
}

export async function sendTaskAcceptedEmail(
  advertiserEmail: string,
  advertiserName: string,
  sellerName: string,
  taskTitle: string,
  taskId: string
) {
  const taskUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/advertiser/tasks/${taskId}`;
  await sendEmail({
    to: advertiserEmail,
    subject: `Order Accepted: ${taskTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #3E4FEA;">Your placement order has been accepted!</h2>
        <p>Hi ${advertiserName},</p>
        <p><strong>${sellerName}</strong> has accepted your placement request for <strong>${taskTitle}</strong> and is currently working on it.</p>
        <p>You will be notified once the deliverable is ready for your review.</p>
        <div style="margin: 24px 0;">
          <a href="${taskUrl}" style="background-color: #3E4FEA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View Task details
          </a>
        </div>
        <p style="color: #777; font-size: 12px; margin-top: 40px;">This is an automated notification from Media Partner Hub.</p>
      </div>
    `,
  });
}

export async function sendDeliverableSubmittedEmail(
  advertiserEmail: string,
  advertiserName: string,
  sellerName: string,
  taskTitle: string,
  taskId: string
) {
  const taskUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/advertiser/tasks/${taskId}`;
  await sendEmail({
    to: advertiserEmail,
    subject: `Deliverable Submitted for Review: ${taskTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #3E4FEA;">Deliverable Submitted — Review Required</h2>
        <p>Hi ${advertiserName},</p>
        <p><strong>${sellerName}</strong> has completed the work and submitted the deliverable for <strong>${taskTitle}</strong>.</p>
        <p>Please review the submitted link/details and approve it to release funds from escrow, or request revisions if improvements are needed.</p>
        <div style="margin: 24px 0;">
          <a href="${taskUrl}" style="background-color: #3E4FEA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Review Deliverable
          </a>
        </div>
        <p style="color: #777; font-size: 12px; margin-top: 40px;">This is an automated notification from Media Partner Hub.</p>
      </div>
    `,
  });
}

export async function sendWithdrawalProcessedEmail(
  userEmail: string,
  userName: string,
  amount: number,
  status: string,
  details: string
) {
  const isApproved = status === "PAID";
  const statusLabel = isApproved ? "Processed & Paid" : "Declined";
  const statusColor = isApproved ? "#22c55e" : "#ef4444";

  await sendEmail({
    to: userEmail,
    subject: `Withdrawal Request Update: ${statusLabel}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: ${statusColor};">Withdrawal Request: ${statusLabel}</h2>
        <p>Hi ${userName},</p>
        <p>Your request to withdraw <strong>$${amount.toFixed(2)}</strong> has been processed by our finance team.</p>
        <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusLabel}</span></p>
        <p><strong>Details:</strong> ${details}</p>
        ${!isApproved ? `<p style="color: #ef4444;">If your request was declined, your funds have been returned to your wallet balance. Please review the admin notes on your balance dashboard.</p>` : ""}
        <p style="color: #777; font-size: 12px; margin-top: 40px;">This is an automated notification from Media Partner Hub.</p>
      </div>
    `,
  });
}
