"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import {
  DEFAULT_TERMS_PAGE_CONTENT,
  TermsPageContent,
} from "@/lib/page-content-data";

export default function TermsPage() {
  const [content, setContent] = useState<TermsPageContent>(DEFAULT_TERMS_PAGE_CONTENT);

  useEffect(() => {
    async function loadCms() {
      try {
        const res = await fetch("/api/cms/page?key=terms_page_data");
        if (res.ok) {
          const data = await res.json();
          if (data.html) {
            try {
              const parsed = JSON.parse(data.html);
              setContent((prev) => ({ ...prev, ...parsed }));
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
    loadCms();
  }, []);

  const c = content;

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#112C3E] font-sans antialiased selection:bg-[#F59E0B] selection:text-white">
      {/* Header */}
      <PublicHeader activePage="home" />

      {/* Main Container */}
      <main className="w-full px-6 sm:px-8 lg:px-12 py-12 max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#EAF1F6] space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#112C3E] font-space tracking-tight">
              {c.title}
            </h1>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              {c.lastUpdated}
            </p>
          </div>

          <div className="space-y-6 text-sm text-[#475569] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#112C3E] font-space">
                {c.section1Title}
              </h2>
              <p>{c.section1Text}</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#112C3E] font-space">
                {c.section2Title}
              </h2>
              <p>{c.section2Text}</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#112C3E] font-space">
                {c.section3Title}
              </h2>
              <p>{c.section3Text}</p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <PublicFooter />
      <FloatingSupportWidget />
    </div>
  );
}
