import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { submitToHubSpot } from "@/lib/hubspot";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { name, companyName, email, phone, specificWebsite, query, type, platformId, hubspotUtk } = body;

    if (!name || !email || !query) {
      return NextResponse.json(
        { error: "Name, email, and requirement query are required." },
        { status: 400 }
      );
    }

    // Save to Database
    const enquiry = await db.enquiry.create({
      data: {
        name,
        companyName: companyName || null,
        email,
        phone: phone || null,
        specificWebsite: specificWebsite || null,
        query,
        type: type === "PRICING_REQUEST" ? "PRICING_REQUEST" : "GENERAL_REQUIREMENT",
        platformId: platformId || null,
        userId: session?.user?.id || null,
        hubspotUtk: hubspotUtk || null,
      },
    });

    // Sync to HubSpot
    let hubspotContactId: string | undefined;
    try {
      const hubspotResult = await submitToHubSpot({
        name,
        companyName,
        email,
        phone,
        specificWebsite,
        query,
        type: enquiry.type,
        hubspotUtk,
        pageUri: req.headers.get("referer") || undefined,
        pageName: "Media Hub Requirement Form",
      });
      if (hubspotResult.hubspotContactId) {
        hubspotContactId = hubspotResult.hubspotContactId;
        await db.enquiry.update({
          where: { id: enquiry.id },
          data: { hubspotContactId },
        });
      }
    } catch (err) {
      console.warn("HubSpot sync error:", err);
    }

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      message: "Your requirement has been submitted successfully. Our team will contact you shortly.",
    });
  } catch (error: any) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit requirement. Please try again." },
      { status: 500 }
    );
  }
}
