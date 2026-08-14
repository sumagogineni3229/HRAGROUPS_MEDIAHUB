"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import {
  DEFAULT_SOLUTIONS_PAGE_CONTENT,
  SolutionsPageContent,
} from "@/lib/page-content-data";
import {
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  MegaphoneIcon,
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  ArrowTrendingUpIcon,
  AdjustmentsHorizontalIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

type TabType = "marketing" | "advertisers" | "brands" | "agencies";

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("marketing");
  const [solutionsData, setSolutionsData] = useState<SolutionsPageContent>(DEFAULT_SOLUTIONS_PAGE_CONTENT);

  useEffect(() => {
    async function loadCms() {
      try {
        const res = await fetch("/api/cms/page?key=solutions_page_data");
        if (res.ok) {
          const data = await res.json();
          if (data.html) {
            try {
              const parsed = JSON.parse(data.html);
              setSolutionsData((prev) => ({ ...prev, ...parsed }));
            } catch (err) {
              console.error("Failed to parse solutions_page_data", err);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadCms();
  }, []);

  const currentTab = solutionsData[activeTab] || DEFAULT_SOLUTIONS_PAGE_CONTENT[activeTab];

  const tabTitles: Record<TabType, string> = {
    marketing: "Marketing & Growth",
    advertisers: "For Advertisers",
    brands: "For Brands",
    agencies: "For Agencies",
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#112C3E] font-sans antialiased selection:bg-[#F59E0B] selection:text-white flex flex-col justify-between">
      {/* Public Header */}
      <PublicHeader activePage="solutions" />

      {/* Main Full-Width Container */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-[1600px] mx-auto flex-1 space-y-12 lg:space-y-16">
        
        {/* ─────────────────────────────────────────────
           1. TOP NAVIGATION TABS (Clean Switcher)
           ───────────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E9F0F5] p-1.5 rounded-full border border-[#D5E1EA] shadow-inner max-w-full overflow-x-auto">
            {(["marketing", "advertisers", "brands", "agencies"] as TabType[]).map((tabKey) => {
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#F59E0B] text-white shadow-md scale-105"
                      : "text-[#677F9B] hover:text-[#112C3E] hover:bg-white/60"
                  }`}
                >
                  {tabTitles[tabKey]}
                </button>
              );
            })}
          </div>
          <p className="text-xs font-semibold text-[#677F9B]">
            Tailored solutions designed for your specific digital growth objectives
          </p>
        </section>

        {/* ─────────────────────────────────────────────
           2. DYNAMIC HERO SECTION (Exact Design As Is)
           ───────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[#FEF3C7]/40 text-[#112C3E] p-8 sm:p-12 lg:p-16 shadow-2xl border border-[#F59E0B]/30 w-full transition-all duration-300">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FEF3C7]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-2 rounded-full">
                <SparklesIcon className="w-4 h-4 text-amber-800" />
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  {currentTab.badge}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-space text-[#112C3E]">
                {currentTab.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-medium">
                {currentTab.heroSubheadline}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-extrabold text-base transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 group"
                >
                  <span>{currentTab.btn1Text}</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-full bg-white hover:bg-amber-50 border border-amber-300 text-[#112C3E] font-bold text-base transition shadow-sm"
                >
                  {currentTab.btn2Text}
                </Link>
              </div>

              {/* Guarantees Row */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-700 border-t border-amber-300/60">
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-amber-700" /> {currentTab.guarantee1}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-amber-700" /> {currentTab.guarantee2}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-amber-700" /> {currentTab.guarantee3}
                </span>
              </div>
            </div>

            {/* Hero Right Visual Cards */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-[#112C3E]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-600">{currentTab.overviewTitle}</span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    {currentTab.overviewBadge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FEFCE8] border border-amber-200 rounded-2xl p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-[#112C3E] font-space">{currentTab.stat1Value}</div>
                    <div className="text-xs text-slate-600 mt-1">{currentTab.stat1Label}</div>
                  </div>
                  <div className="bg-[#FEFCE8] border border-amber-200 rounded-2xl p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-[#112C3E] font-space">{currentTab.stat2Value}</div>
                    <div className="text-xs text-slate-600 mt-1">{currentTab.stat2Label}</div>
                  </div>
                  <div className="bg-[#FEFCE8] border border-amber-200 rounded-2xl p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-[#112C3E] font-space">{currentTab.stat3Value}</div>
                    <div className="text-xs text-slate-600 mt-1">{currentTab.stat3Label}</div>
                  </div>
                  <div className="bg-[#FEFCE8] border border-amber-200 rounded-2xl p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-[#112C3E] font-space">{currentTab.stat4Value}</div>
                    <div className="text-xs text-slate-600 mt-1">{currentTab.stat4Label}</div>
                  </div>
                </div>

                <div className="bg-[#FEF9C3] rounded-2xl p-4 border border-[#FDE047] flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-xs font-bold text-amber-950">Active Campaign Matcher</span>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           3. KEY FEATURES GRID (Exact Design As Is)
           ───────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#112C3E] font-space">
              {currentTab.featuresHeading}
            </h2>
            <p className="text-sm sm:text-base text-[#677F9B]">
              {currentTab.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: currentTab.feat1Title, desc: currentTab.feat1Desc, icon: GlobeAltIcon },
              { title: currentTab.feat2Title, desc: currentTab.feat2Desc, icon: ShieldCheckIcon },
              { title: currentTab.feat3Title, desc: currentTab.feat3Desc, icon: SparklesIcon },
              { title: currentTab.feat4Title, desc: currentTab.feat4Desc, icon: MegaphoneIcon },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#EAF1F6] rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#112C3E] font-space">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-[#677F9B] leading-relaxed">{feature.desc}</p>
                  </div>
                  <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#F59E0B]">
                    <span>Learn pattern</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           4. WORKFLOW STEPS SECTION (1-2-3 Execution)
           ───────────────────────────────────────────── */}
        <section className="bg-white border border-[#EAF1F6] rounded-[32px] p-8 sm:p-12 shadow-sm space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#F59E0B]">
              {currentTab.workflowBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#112C3E] font-space">
              {currentTab.workflowTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: "01", title: currentTab.step1Title, desc: currentTab.step1Desc },
              { step: "02", title: currentTab.step2Title, desc: currentTab.step2Desc },
              { step: "03", title: currentTab.step3Title, desc: currentTab.step3Desc },
            ].map((step, idx) => (
              <div key={idx} className="relative space-y-4 bg-[#F8FAFC] border border-[#EAF1F6] p-6 sm:p-8 rounded-2xl">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#112C3E] text-white font-black text-sm font-space">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-[#112C3E] font-space">{step.title}</h3>
                <p className="text-xs sm:text-sm text-[#677F9B] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           5. COMPARISON / TRUST TABLE (Light Yellow Theme)
           ───────────────────────────────────────────── */}
        <section className="bg-[#FEF3C7]/40 text-[#112C3E] rounded-[32px] p-8 sm:p-12 shadow-xl space-y-8 border border-[#F59E0B]/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-800 text-white uppercase tracking-wider shadow-sm">
                {currentTab.comparisonBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-space text-[#112C3E]">
                {currentTab.comparisonTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {currentTab.comparisonSubtitle}
              </p>
            </div>

            <div className="lg:col-span-7 bg-white/90 border border-amber-300/70 rounded-2xl p-6 space-y-4 shadow-md text-[#112C3E]">
              <div className="grid grid-cols-2 text-xs uppercase font-bold border-b border-amber-200 pb-3">
                <div className="text-slate-600">{currentTab.comparisonCol1}</div>
                <div className="text-amber-800 font-extrabold">{currentTab.comparisonCol2}</div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-medium">
                <div className="grid grid-cols-2 py-1.5 border-b border-slate-100 items-center">
                  <span className="text-slate-500">{currentTab.comparisonRow1Left}</span>
                  <span className="text-amber-900 font-bold flex items-center gap-1">
                    <CheckIcon className="w-4 h-4 text-emerald-600 stroke-[3]" /> {currentTab.comparisonRow1Right}
                  </span>
                </div>
                <div className="grid grid-cols-2 py-1.5 border-b border-slate-100 items-center">
                  <span className="text-slate-500">{currentTab.comparisonRow2Left}</span>
                  <span className="text-amber-900 font-bold flex items-center gap-1">
                    <CheckIcon className="w-4 h-4 text-emerald-600 stroke-[3]" /> {currentTab.comparisonRow2Right}
                  </span>
                </div>
                <div className="grid grid-cols-2 py-1.5 border-b border-slate-100 items-center">
                  <span className="text-slate-500">{currentTab.comparisonRow3Left}</span>
                  <span className="text-amber-900 font-bold flex items-center gap-1">
                    <CheckIcon className="w-4 h-4 text-emerald-600 stroke-[3]" /> {currentTab.comparisonRow3Right}
                  </span>
                </div>
                <div className="grid grid-cols-2 py-1.5 items-center">
                  <span className="text-slate-500">{currentTab.comparisonRow4Left}</span>
                  <span className="text-amber-900 font-bold flex items-center gap-1">
                    <CheckIcon className="w-4 h-4 text-emerald-600 stroke-[3]" /> {currentTab.comparisonRow4Right}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           6. BOTTOM CONVERSION CTA
           ───────────────────────────────────────────── */}
        <section className="py-12 bg-white rounded-[32px] border border-[#EAF1F6] p-8 sm:p-14 text-center space-y-6 shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-space text-[#112C3E] tracking-tight">
            {currentTab.ctaHeadline}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto font-medium">
            {currentTab.ctaSubtitle}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 rounded-full bg-[#112C3E] hover:bg-[#F59E0B] text-white font-extrabold text-sm transition-all shadow-md"
            >
              {currentTab.ctaBtn1}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-[#F8FAFC] border border-[#D5E1EA] text-[#112C3E] font-bold text-sm hover:bg-[#EAF0F5] transition"
            >
              {currentTab.ctaBtn2}
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <PublicFooter />
      <FloatingSupportWidget />
    </div>
  );
}
