"use client";

import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#112C3E] font-sans antialiased selection:bg-[#3E4FEA] selection:text-white flex flex-col justify-between">
      <div>
        <PublicHeader activePage="other" />

        <main className="w-full px-6 sm:px-8 lg:px-12 py-12 max-w-4xl mx-auto space-y-8">
          <div className="border-b border-[#EAF1F6] pb-6 space-y-2">
            <h1 className="text-4xl font-extrabold font-space text-[#112C3E]">Privacy Policy</h1>
            <p className="text-xs text-[#677F9B]">Last updated: July 2026 • MediaHub Inc.</p>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAF1F6] shadow-sm space-y-6 text-sm text-[#475569] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#112C3E] font-space">1. Data Collection & Privacy</h2>
              <p>
                MediaHub respects your privacy. We collect minimal personal information required to facilitate escrow transactions, user authentication, and order fulfillment.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#112C3E] font-space">2. Data Security</h2>
              <p>
                All sensitive billing data is encrypted using SSL/TLS encryption. We do not sell or trade user information to third-party advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#112C3E] font-space">3. Account Deletion & GDPR</h2>
              <p>
                Users have the right to request account deactivation and complete deletion of stored data at any time via Account Settings.
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
