"use client";

import Script from "next/script";

export function HubSpotTracker() {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;

  if (!portalId) return null;

  return (
    <Script
      id="hs-script-loader"
      src={`//js.hs-scripts.com/${portalId}.js`}
      strategy="afterInteractive"
    />
  );
}
