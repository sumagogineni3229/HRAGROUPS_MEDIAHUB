"use client";

import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#112C3E] font-sans antialiased selection:bg-[#3E4FEA] selection:text-white flex flex-col justify-between">
      <div>
        <PublicHeader activePage="other" />

        <main className="w-full px-6 sm:px-8 lg:px-12 py-12 max-w-4xl mx-auto space-y-8">
          <div className="border-b border-[#EAF1F6] pb-6 space-y-2">
            <h1 className="text-4xl font-extrabold font-space text-[#112C3E]">Terms and Conditions</h1>
            <p className="text-xs text-[#677F9B]">Last updated: July 2026 • MediaHub Inc.</p>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAF1F6] shadow-sm space-y-6 text-sm text-[#475569] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#112C3E] font-space">1. Platform Services</h2>
              <p>
                MediaHub operates a digital escrow-protected marketplace connecting Advertisers with website Publishers and Influencers for guest posting, content creation, and digital PR placements.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#112C3E] font-space">2. Escrow & Payment Protection</h2>
              <p>
                All payments placed by Advertisers are held securely in escrow until order completion is verified. Funds are released to Publishers only after live post verification. If a Publisher fails to deliver, 100% of the funds are refunded to the Advertiser's available balance.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#112C3E] font-space">3. Publisher Guarantee & Link Retention</h2>
              <p>
                Publishers agree to retain published articles and contextual links permanently. Links removed within 12 months are subject to mandatory replacement or full order refund.
              </p>
            </section>
          </div>
        </main>
      </div>

      <PublicFooter />
      <FloatingSupportWidget />
    </div>
  );
}
