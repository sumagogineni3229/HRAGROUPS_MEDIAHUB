import { NextResponse } from "next/server";
import { submitToHubSpot } from "@/lib/hubspot";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, companyName, email, phone, specificWebsite, query, hubspotUtk } = body;

    if (!name || !email || !query) {
      return NextResponse.json(
        { error: "Name, email, and requirement details are required." },
        { status: 400 }
      );
    }

    // Submit lead directly to HubSpot Form / CRM
    const hubspotResult = await submitToHubSpot({
      name,
      companyName,
      email,
      phone,
      specificWebsite,
      query,
      type: "Custom Requirement",
      hubspotUtk,
      pageUri: req.headers.get("referer") || "https://mediahub.com/advertiser/sites",
      pageName: "Confidential Inventory Requirement Form",
    });

    return NextResponse.json({
      success: true,
      message: "Your requirement has been submitted to our team via HubSpot successfully.",
      hubspot: hubspotResult,
    });
  } catch (error: any) {
    console.error("[SUBMIT_REQUIREMENT_HUBSPOT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to submit requirement to HubSpot. Please try again." },
      { status: 500 }
    );
  }
}
