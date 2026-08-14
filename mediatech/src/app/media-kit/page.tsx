"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import {
  DEFAULT_MEDIAKIT_PAGE_CONTENT,
  MediaKitPageContent,
} from "@/lib/page-content-data";
import {
  SparklesIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  ArrowRightIcon,
  MicrophoneIcon,
  UsersIcon,
  DocumentTextIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

export default function MediaKitPage() {
  const [content, setContent] = useState<MediaKitPageContent>(DEFAULT_MEDIAKIT_PAGE_CONTENT);

  useEffect(() => {
    async function loadCms() {
      try {
        const res = await fetch("/api/cms/page?key=mediakit_page_data");
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
      <PublicHeader activePage="podcasts" />

      {/* ─────────────────────────────────────────────
         1. HERO SECTION (Exact Design As Is)
         ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7FAFC] via-white to-[#F7FAFC] py-20 border-b border-[#EAF1F6]">
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B]/40 text-[#D97706] text-xs font-bold font-mono uppercase tracking-widest shadow-xs">
            <SparklesIcon className="w-4 h-4 text-[#F59E0B]" />
            <span>MediaHub Talks</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black font-space leading-[1.12] tracking-tight text-[#112C3E]">
            {c.heroHeadline}
          </h1>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#677F9B]">
            <ChevronDownIcon className="w-4 h-4 animate-bounce text-[#F59E0B]" />
            <span>Scroll down to see the details</span>
          </div>

          {/* Visual Guest Feature Card */}
          <div className="bg-white border border-[#EAF1F6] rounded-3xl p-8 shadow-xl max-w-3xl mx-auto space-y-6 text-left relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                MediaHub Exclusive
              </span>
              <span className="text-xs text-slate-400 font-medium">New Episodes Monthly</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold font-space text-[#112C3E]">
                {c.guestVisualTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {c.guestVisualSubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         2. WHAT IS MEDIAHUB TALKS (Timeline)
         ───────────────────────────────────────────── */}
      <section className="py-20 border-b border-[#EAF1F6] bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#F59E0B]">Overview</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#112C3E] font-space">
              {c.timelineTitle}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-[#F8FAFC] border border-[#EAF1F6] p-6 rounded-2xl space-y-2">
              <h4 className="font-bold text-base text-[#112C3E] font-space">
                {c.timeline1Title}
              </h4>
              <p className="text-xs sm:text-sm text-[#677F9B] leading-relaxed">
                {c.timeline1Desc}
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#EAF1F6] p-6 rounded-2xl space-y-2">
              <h4 className="font-bold text-base text-[#112C3E] font-space">
                {c.timeline2Title}
              </h4>
              <p className="text-xs sm:text-sm text-[#677F9B] leading-relaxed">
                {c.timeline2Desc}
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#EAF1F6] p-6 rounded-2xl space-y-2">
              <h4 className="font-bold text-base text-[#112C3E] font-space">
                {c.timeline3Title}
              </h4>
              <p className="text-xs sm:text-sm text-[#677F9B] leading-relaxed">
                {c.timeline3Desc}
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#EAF1F6] p-6 rounded-2xl space-y-2">
              <h4 className="font-bold text-base text-[#112C3E] font-space">
                {c.timeline4Title}
              </h4>
              <p className="text-xs sm:text-sm text-[#677F9B] leading-relaxed">
                {c.timeline4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         3. WHY THIS PODCAST EXISTS
         ───────────────────────────────────────────── */}
      <section className="py-20 border-b border-[#EAF1F6] bg-[#FEF3C7]/30 text-center">
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black font-space text-[#112C3E] tracking-tight">
              {c.whyExistsTitle}
            </h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium max-w-3xl mx-auto">
              {c.whyExistsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {c.whyExistsBullets.map((b, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-amber-200/80 space-y-1 shadow-2xs">
                <span className="text-amber-600 font-bold text-base">✦</span>
                <p className="text-xs font-semibold text-slate-800 leading-snug">{b}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-300 max-w-xl mx-auto shadow-sm">
            <p className="text-xs font-bold text-slate-800">
              {c.noticeBannerText}
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         4. WHO IS IT FOR
         ───────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#EAF1F6]">
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto space-y-10 text-center">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#F59E0B]">Audience</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#112C3E] font-space">
              {c.whoIsItForTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#677F9B]">
              {c.whoIsItForSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
            {c.whoIsItForRoles.map((role, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#EAF1F6] text-xs font-bold text-[#112C3E] flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         5. WHY MEDIAHUB
         ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto space-y-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#112C3E] font-space">
            {c.whyMediaHubTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {c.whyMediaHubBullets.map((b, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#EAF1F6] space-y-1">
                <CheckCircleIcon className="w-5 h-5 text-[#F59E0B]" />
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{b}</p>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-[#112C3E] hover:bg-[#F59E0B] text-white font-bold text-sm transition shadow-md inline-flex items-center gap-2"
            >
              <span>Apply to be a Guest</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
      <FloatingSupportWidget />
    </div>
  );
}
