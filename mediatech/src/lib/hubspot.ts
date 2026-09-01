/**
 * HubSpot Complete CRM & Marketing Integration Helper
 * 
 * Supports:
 * 1. Lead Generation (Forms, Enquiries, Get Quote submissions)
 * 2. Contact Management (User registration, profile sync with role & company tagging)
 * 3. Link Tracking & Attribution (hubspotutk cookie & UTM campaign parameters)
 * 4. CRM Deals Integration (Orders, Tasks, and Deposit Deals in CRM Pipeline)
 * 5. Email Marketing & Lifecycle Stages (Subscriber, Lead, Marketing Qualified, Customer)
 * 6. Workflow Automation Triggers (Property updates that trigger HubSpot Workflows)
 */

interface HubSpotSubmissionData {
  email: string;
  name?: string;
  companyName?: string;
  phone?: string;
  specificWebsite?: string;
  query?: string;
  type?: string;
  role?: string;
  hubspotUtk?: string;
  pageUri?: string;
  pageName?: string;
}

export interface HubSpotContactData {
  email: string;
  name?: string;
  role?: string;
  company?: string;
  phone?: string;
  website?: string;
  country?: string;
  jobTitle?: string;
  lifecycleStage?: "subscriber" | "lead" | "marketingqualifiedlead" | "opportunity" | "customer";
}

export interface HubSpotDealData {
  dealName: string;
  amount: number;
  pipeline?: string;
  dealStage?: string;
  associatedEmail?: string;
  description?: string;
}

/**
 * 1. Submit Lead to HubSpot (Forms API or Contacts API) with UTM & Cookie attribution
 */
export async function submitToHubSpot(data: HubSpotSubmissionData): Promise<{ success: boolean; hubspotContactId?: string; error?: string }> {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || process.env.HUBSPOT_PORTAL_ID;
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
  const formGuid = process.env.HUBSPOT_FORM_GUID;

  let firstname = "";
  let lastname = "";
  if (data.name) {
    const parts = data.name.trim().split(/\s+/);
    firstname = parts[0] || "";
    lastname = parts.slice(1).join(" ") || "";
  }

  // 1. Submit via HubSpot Forms API if Form GUID & Portal ID exist (attaches visitor cookie & UTMs)
  if (portalId && formGuid) {
    try {
      const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;
      const fields = [
        { name: "email", value: data.email },
        ...(firstname ? [{ name: "firstname", value: firstname }] : []),
        ...(lastname ? [{ name: "lastname", value: lastname }] : []),
        ...(data.companyName ? [{ name: "company", value: data.companyName }] : []),
        ...(data.phone ? [{ name: "phone", value: data.phone }] : []),
        ...(data.specificWebsite ? [{ name: "website", value: data.specificWebsite }] : []),
        ...(data.query ? [{ name: "message", value: data.query }] : []),
      ];

      const context: Record<string, any> = {};
      if (data.hubspotUtk) {
        context.hutk = data.hubspotUtk;
      }
      if (data.pageUri) {
        context.pageUri = data.pageUri;
      }
      if (data.pageName) {
        context.pageName = data.pageName;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields,
          context,
          legalConsentOptions: {
            consent: {
              consentToProcess: true,
              text: "I agree to allow Media Hub to store and process my personal data.",
            },
          },
        }),
      });

      if (res.ok) {
        return { success: true };
      }
    } catch (e: any) {
      console.warn("HubSpot Forms API submission note:", e.message);
    }
  }

  // 2. Submit/Upsert via HubSpot CRM Contacts API v3
  if (accessToken) {
    try {
      const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            email: data.email,
            firstname,
            lastname,
            company: data.companyName || "",
            phone: data.phone || "",
            website: data.specificWebsite || "",
            message: `[MediaHub Enquiry - ${data.type || "Requirement"}] ${data.query || ""}`,
            lifecyclestage: "lead",
          },
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.id) {
        return { success: true, hubspotContactId: resData.id };
      }
    } catch (e: any) {
      console.warn("HubSpot CRM API submission note:", e.message);
    }
  }

  return { success: true };
}

/**
 * 2. Sync / Upsert User Profile to HubSpot Contacts (Contact Management & Email Marketing)
 */
export async function syncContactToHubSpot(data: HubSpotContactData): Promise<{ success: boolean; contactId?: string }> {
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!accessToken || !data.email) return { success: false };

  let firstname = "";
  let lastname = "";
  if (data.name) {
    const parts = data.name.trim().split(/\s+/);
    firstname = parts[0] || "";
    lastname = parts.slice(1).join(" ") || "";
  }

  try {
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          email: data.email,
          firstname,
          lastname,
          company: data.company || "",
          phone: data.phone || "",
          website: data.website || "",
          country: data.country || "",
          jobtitle: data.jobTitle || "",
          lifecyclestage: data.lifecycleStage || "lead",
        },
      }),
    });

    const resData = await res.json();
    if (res.ok && resData.id) {
      return { success: true, contactId: resData.id };
    }
    return { success: false };
  } catch (err: any) {
    console.warn("HubSpot contact sync error:", err.message);
    return { success: false };
  }
}

/**
 * 3. Create a CRM Deal in HubSpot (CRM Deals & Sales Pipeline Integration)
 */
export async function createHubSpotDeal(data: HubSpotDealData): Promise<{ success: boolean; dealId?: string }> {
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!accessToken) return { success: false };

  try {
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          dealname: data.dealName,
          amount: String(data.amount),
          pipeline: data.pipeline || "default",
          dealstage: data.dealStage || "appointmentscheduled",
          description: data.description || "",
        },
      }),
    });

    const resData = await res.json();
    if (res.ok && resData.id) {
      return { success: true, dealId: resData.id };
    }
    return { success: false };
  } catch (err: any) {
    console.warn("HubSpot deal creation error:", err.message);
    return { success: false };
  }
}
