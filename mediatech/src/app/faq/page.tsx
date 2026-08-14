"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import { FaqItem } from "@/lib/faq-data";
import { DEFAULT_FAQ_PAGE_CONTENT, FaqPageContent } from "@/lib/page-content-data";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [faqContent, setFaqContent] = useState<FaqPageContent>(DEFAULT_FAQ_PAGE_CONTENT);

  useEffect(() => {
    async function loadCms() {
      try {
        const res = await fetch("/api/cms/page?key=faq_page_data");
        if (res.ok) {
          const data = await res.json();
          if (data.html) {
            try {
              const parsed = JSON.parse(data.html);
              setFaqContent((prev) => ({ ...prev, ...parsed }));
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
    loadCms();
  }, []);

  const items = faqContent.faqs && faqContent.faqs.length > 0 ? faqContent.faqs : DEFAULT_FAQ_PAGE_CONTENT.faqs;

  const filteredFaqs = items.filter((item) => {
    return (
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Group FAQs by Category
  const buyerFaqs = filteredFaqs.filter((item) => item.category === "Buyer's FAQs");
  const taskFaqs = filteredFaqs.filter((item) => item.category === "Task & Statuses");
  const metricFaqs = filteredFaqs.filter((item) => item.category === "Platform Metrics");
  const guaranteeFaqs = filteredFaqs.filter((item) => item.category === "Guarantees & Refunds");
  const accountFaqs = filteredFaqs.filter((item) => item.category === "Account & Billing");

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const renderFaqSection = (title: string, faqs: FaqItem[]) => {
    if (faqs.length === 0) return null;
    return (
      <div className="space-y-4 pt-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#112C3E] font-space tracking-tight">
          {title}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-[22px] border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#F59E0B] shadow-md ring-1 ring-[#F59E0B]/20"
                    : "border-[#EAF1F6] hover:border-[#D5E1EA] shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-7 py-5 text-left flex items-center justify-between gap-4 focus:outline-none group cursor-pointer"
                >
                  <span className="font-bold text-base sm:text-lg text-[#112C3E] font-space group-hover:text-[#F59E0B] transition-colors leading-snug">
                    {faq.question}
                  </span>

                  {isOpen ? (
                    <MinusCircleIcon className="w-6 h-6 text-[#F59E0B] shrink-0" />
                  ) : (
                    <PlusCircleIcon className="w-6 h-6 text-[#F59E0B] shrink-0 group-hover:scale-110 transition-transform" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-7 pb-6 pt-1 text-sm text-[#475569] leading-relaxed border-t border-[#F1F5F9] whitespace-pre-line bg-[#F9FBFC]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#112C3E] font-sans antialiased selection:bg-[#F59E0B] selection:text-white relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <PublicHeader activePage="faq" />

        {/* Decorative Watermark Metrics */}
        <div className="absolute top-28 left-20 text-xs font-bold text-[#E2E8F0] tracking-widest pointer-events-none select-none hidden md:block">
          DA: 54
        </div>
        <div className="absolute top-20 right-28 text-xs font-bold text-[#E2E8F0] tracking-widest pointer-events-none select-none hidden md:block">
          DA: 31
        </div>

        {/* MAIN ACCORDIONS CONTAINER */}
        <main className="w-full px-6 sm:px-8 lg:px-12 py-12 max-w-4xl mx-auto space-y-12 relative z-10">
          
          {/* 1. HERO TITLE (Design Preserved) */}
          <div className="text-center space-y-6 pt-4">
            <h1 className="text-5xl sm:text-6xl font-black text-[#112C3E] font-space tracking-tight">
              {faqContent.heroTitle}
            </h1>

            {/* 2. SEARCH BAR */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={faqContent.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-6 pr-12 py-4 bg-[#EAF0F5] rounded-full text-base text-[#112C3E] placeholder-[#677F9B] border border-transparent focus:border-[#F59E0B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 transition shadow-inner"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-[#677F9B] absolute right-5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* 3. FAQ ACCORDIONS (Grouped By Category) */}
          <div className="space-y-10">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#EAF1F6] p-12 text-center space-y-3 shadow-sm">
                <h3 className="text-lg font-bold text-[#112C3E] font-space">No matching answers found</h3>
                <p className="text-sm text-[#677F9B]">
                  We couldn't find any questions matching "{searchQuery}".
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 py-2 rounded-full bg-[#F59E0B] text-white text-xs font-bold"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <>
                {renderFaqSection(faqContent.cat1Title || "Buyer`s Frequently Asked Questions", buyerFaqs)}
                {renderFaqSection(faqContent.cat2Title || "Task Statuses & Workflow", taskFaqs)}
                {renderFaqSection(faqContent.cat3Title || "Platform Metrics & Verification", metricFaqs)}
                {renderFaqSection(faqContent.cat4Title || "Guarantees & Escrow Refund Policy", guaranteeFaqs)}
                {renderFaqSection(faqContent.cat5Title || "Account, Billing & Data Management", accountFaqs)}
              </>
            )}
          </div>

        </main>
      </div>

      {/* ─────────────────────────────────────────────
         2-LINE CONTACT BANNER (Design Preserved)
         ───────────────────────────────────────────── */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-[#F7FAFC] via-white to-[#F4F7FA] relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-1 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#112C3E] font-space leading-tight tracking-tight">
            {faqContent.contactBannerLine1}
          </h2>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#112C3E] font-space leading-tight tracking-tight">
            {faqContent.contactBannerLine2}{" "}
            <a href={`mailto:${faqContent.contactEmail}`} className="text-[#F59E0B] hover:underline transition">
              {faqContent.contactEmail}
            </a>
          </h2>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
      <FloatingSupportWidget />
    </div>
  );
}
