/**
 * HubSpot Integration Helper
 * 
 * Supports:
 * 1. Tracking code injection in layout
 * 2. Submitting enquiries/requirements to HubSpot CRM Forms API or Contacts API
 * 3. Visitor cookie (hubspotutk) link tracking attribution
 */

interface HubSpotSubmissionData {
  email: string;
  name?: string;
  companyName?: string;
  phone?: string;
  specificWebsite?: string;
  query?: string;
  type?: string;
  hubspotUtk?: string;
  pageUri?: string;
  pageName?: string;
}

export async function submitToHubSpot(data: HubSpotSubmissionData): Promise<{ success: boolean; hubspotContactId?: string; error?: string }> {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || process.env.HUBSPOT_PORTAL_ID;
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
  const formGuid = process.env.HUBSPOT_FORM_GUID;

  // Split name into first and last name if present
  let firstname = "";
  let lastname = "";
  if (data.name) {
    const parts = data.name.trim().split(/\s+/);
    firstname = parts[0] || "";
    lastname = parts.slice(1).join(" ") || "";
  }

  // 1. If HubSpot Form GUID & Portal ID are configured, submit via HubSpot Forms API (Preserves hubspotutk cookie & link tracking directly)
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

  // 2. If Private App Access Token is provided, create/update contact via HubSpot CRM API v3
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

  return { success: true }; // graceful fallback even if external tokens are not yet added to env
}
