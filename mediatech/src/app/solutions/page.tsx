"use client";

import Link from "next/link";
import { useState } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
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

interface SolutionTabInfo {
  id: TabType;
  title: string;
  badge: string;
  heroHeadline: string;
  heroSubheadline: string;
  stats: { value: string; label: string }[];
  features: { title: string; desc: string; icon: any }[];
  workflowTitle: string;
  workflowSteps: { step: string; title: string; desc: string }[];
  ctaHeadline: string;
}

const SOLUTIONS_DATA: Record<TabType, SolutionTabInfo> = {
  marketing: {
    id: "marketing",
    title: "Marketing & Growth",
    badge: "All-in-One Growth Platform",
    heroHeadline: "Scale Digital PR & Content Marketing with Guaranteed Results",
    heroSubheadline: "Connect with 25,000+ verified blogs, tech publications, and podcast hosts. Launch high-impact content campaigns with escrow protection and real-time ROI analytics.",
    stats: [
      { value: "25,000+", label: "Verified Outlets" },
      { value: "99.4%", label: "Placement Success" },
      { value: "3.8x", label: "Average Organic Lift" },
      { value: "100%", label: "Escrow Secured" },
    ],
    features: [
      {
        title: "Curated Publisher Marketplace",
        desc: "Filter media outlets by Domain Authority, Ahrefs DR, Organic Traffic, Geo Location, and niche topics in seconds.",
        icon: GlobeAltIcon,
      },
      {
        title: "Escrow Payment Protection",
        desc: "Funds are securely locked in escrow and only released after your article or podcast ad is published and verified live.",
        icon: ShieldCheckIcon,
      },
      {
        title: "AI-Powered Media Matching",
        desc: "Smart algorithm pairs your niche SaaS or e-commerce store with high-converting publications for optimal audience fit.",
        icon: SparklesIcon,
      },
      {
        title: "Multi-Channel Distribution",
        desc: "Manage guest posts, sponsored news features, podcast mentions, and influencer shoutouts under one unified dashboard.",
        icon: MegaphoneIcon,
      },
    ],
    workflowTitle: "How Content Marketing Works on MediaHub",
    workflowSteps: [
      { step: "01", title: "Select Media Outlets", desc: "Choose from pre-vetted blogs, media platforms, and podcast shows based on DA, traffic, and price." },
      { step: "02", title: "Submit Content & Brief", desc: "Provide your drafted article or request expert content creation from verified native copywriters." },
      { step: "03", title: "Escrow & Publication", desc: "Publishers review, post your content with contextual links, and submit live URLs for instant verification." },
    ],
    ctaHeadline: "Supercharge your brand's digital presence today",
  },
  advertisers: {
    id: "advertisers",
    title: "For Advertisers",
    badge: "High-ROI Ad Placements",
    heroHeadline: "Buy Authentic Backlinks & High-Authority Content Placements",
    heroSubheadline: "Stop wasting budget on low-tier guest posts. Access top-tier media outlets with transparent metrics, instant pricing, and zero negotiation hassle.",
    stats: [
      { value: "15K+", label: "Active Advertisers" },
      { value: "$0", label: "Hidden Agency Fees" },
      { value: "48 Hrs", label: "Avg Turnaround" },
      { value: "100%", label: "Refund Guarantee" },
    ],
    features: [
      {
        title: "Direct Publisher Access",
        desc: "Skip middleman markups and communicate directly with editorial teams to secure contextual link placements.",
        icon: BuildingOffice2Icon,
      },
      {
        title: "Real-Time Traffic Verification",
        desc: "Live integrations with Moz, Ahrefs, and SimilarWeb ensure every metrics snapshot is 100% accurate and fresh.",
        icon: ChartBarIcon,
      },
      {
        title: "Transparent & Fixed Pricing",
        desc: "View clear upfront pricing for sponsored posts, link insertions, and podcast host-read ads with zero hidden surcharges.",
        icon: CurrencyDollarIcon,
      },
      {
        title: "Guaranteed Indexation",
        desc: "All sponsored articles are monitored to guarantee Google search indexation and link longevity.",
        icon: RocketLaunchIcon,
      },
    ],
    workflowTitle: "Advertiser Success Framework",
    workflowSteps: [
      { step: "01", title: "Explore Catalog", desc: "Filter publications by Niche, Spam Score, Organic Traffic, and Ahrefs DR metrics." },
      { step: "02", title: "Place Escrow Order", desc: "Fund your account safely; your deposit remains protected until publication is confirmed." },
      { step: "03", title: "Track Backlinks & Traffic", desc: "Monitor link status, indexed pages, and referral analytics right inside your advertiser dashboard." },
    ],
    ctaHeadline: "Start acquiring high-DR backlinks with zero risk",
  },
  brands: {
    id: "brands",
    title: "For Brands",
    badge: "Enterprise Brand Growth",
    heroHeadline: "Build Brand Authority, Trust & Top-of-Funnel organic Reach",
    heroSubheadline: "Position your brand as an industry leader through story-driven editorial coverage, podcast guesting, and high-impact press releases.",
    stats: [
      { value: "500+", label: "Global Brands" },
      { value: "10M+", label: "Target Impressions" },
      { value: "98.8%", label: "Brand Safety Rating" },
      { value: "24/7", label: "VIP Account Management" },
    ],
    features: [
      {
        title: "Brand Safety Compliance",
        desc: "Rigorous quality controls guarantee your brand appears exclusively alongside brand-safe, premium quality editorial content.",
        icon: ShieldCheckIcon,
      },
      {
        title: "Integrated PR & Sponsorships",
        desc: "Combine press release distribution, industry blog coverage, and podcast sponsorships into single cohesive campaigns.",
        icon: UserGroupIcon,
      },
      {
        title: "Custom Managed Services",
        desc: "Our dedicated PR specialists manage content strategy, publisher outreach, and reporting end-to-end for your brand.",
        icon: AdjustmentsHorizontalIcon,
      },
      {
        title: "Brand Lift & Search Growth",
        desc: "Boost domain authority, referral leads, and brand search volume through authoritative placements on news portals.",
        icon: ArrowTrendingUpIcon,
      },
    ],
    workflowTitle: "Brand Building Playbook",
    workflowSteps: [
      { step: "01", title: "Strategy Alignment", desc: "Define target audience demographics, press goals, and desired publication tier." },
      { step: "02", title: "Curated Press Package", desc: "Receive a tailored selection of top-tier news sites and podcasts matched to your niche." },
      { step: "03", title: "Omnichannel Launch", desc: "Distribute story-driven content simultaneously across authoritative digital channels." },
    ],
    ctaHeadline: "Elevate your brand reputation with premium media",
  },
  agencies: {
    id: "agencies",
    title: "For Agencies",
    badge: "Agency Scaling Suite",
    heroHeadline: "White-Label Content Marketing & Digital PR for Scaling Agencies",
    heroSubheadline: "Manage dozens of client campaigns seamlessly with bulk order discounts, custom white-label reports, and multi-user team collaboration tools.",
    stats: [
      { value: "1,200+", label: "Partner Agencies" },
      { value: "Up to 30%", label: "Bulk Savings" },
      { value: "1-Click", label: "White-Label Reports" },
      { value: "Unlimited", label: "Team Workspaces" },
    ],
    features: [
      {
        title: "White-Label PDF Reports",
        desc: "Generate professional client reports carrying your agency's logo, colors, and branding in just one click.",
        icon: ChartBarIcon,
      },
      {
        title: "Bulk Ordering & Discounts",
        desc: "Unlock tiered volume pricing discounts as your agency scales content placements across multiple client accounts.",
        icon: CurrencyDollarIcon,
      },
      {
        title: "Multi-Client Workspaces",
        desc: "Organize campaigns into dedicated client folders with separate budgets, team permissions, and progress trackers.",
        icon: UserGroupIcon,
      },
      {
        title: "Dedicated Agency API",
        desc: "Automate order placement, status updates, and metrics syncing directly into your internal agency CRM.",
        icon: RocketLaunchIcon,
      },
    ],
    workflowTitle: "Agency Workflow Engine",
    workflowSteps: [
      { step: "01", title: "Create Client Projects", desc: "Set up separate sub-accounts and allocate custom campaign budgets per client." },
      { step: "02", title: "Execute Bulk Campaigns", desc: "Order placements across hundreds of domains using quick CSV uploads or batch selection." },
      { step: "03", title: "Export Branded Reports", desc: "Download clean white-labeled client progress decks highlighting live links and DR metrics." },
    ],
    ctaHeadline: "Scale your agency's PR & link building output seamlessly",
  },
};

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("marketing");

  const currentData = SOLUTIONS_DATA[activeTab];

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#112C3E] font-sans antialiased selection:bg-[#3E4FEA] selection:text-white flex flex-col justify-between">
      {/* Public Header */}
      <PublicHeader activePage="solutions" />

      {/* Main Full-Width Container */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-[1600px] mx-auto flex-1 space-y-12 lg:space-y-16">
        
        {/* ─────────────────────────────────────────────
           1. TOP NAVIGATION TABS (Adsy Style Clean Switcher)
           ───────────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E9F0F5] p-1.5 rounded-full border border-[#D5E1EA] shadow-inner max-w-full overflow-x-auto">
            {(Object.keys(SOLUTIONS_DATA) as TabType[]).map((tabKey) => {
              const tab = SOLUTIONS_DATA[tabKey];
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#3E4FEA] text-white shadow-md scale-105"
                      : "text-[#677F9B] hover:text-[#112C3E] hover:bg-white/60"
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
          <p className="text-xs font-semibold text-[#677F9B]">
            Tailored solutions designed for your specific digital growth objectives
          </p>
        </section>

        {/* ─────────────────────────────────────────────
           2. DYNAMIC HERO SECTION
           ───────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#0F1E36] via-[#11254B] to-[#1E3A8A] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-white/10 w-full transition-all duration-300">
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#3E4FEA]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#8CF08A]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full">
                <SparklesIcon className="w-4 h-4 text-[#8CF08A]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {currentData.badge}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-space">
                {currentData.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                {currentData.heroSubheadline}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-full bg-[#8CF08A] hover:bg-[#7be279] text-[#0C172C] font-extrabold text-base transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 group"
                >
                  <span>Get Started Now</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base transition"
                >
                  Book Demo Strategy
                </Link>
              </div>

              {/* Guarantees Row */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-300 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-[#8CF08A]" /> No monthly subscriptions
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-[#8CF08A]" /> 100% Escrow Protection
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-[#8CF08A]" /> Verified Metrics
                </span>
              </div>
            </div>

            {/* Hero Right Visual Cards */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-300">Marketplace Overview</span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#8CF08A]/20 text-[#8CF08A] border border-[#8CF08A]/30">
                    Live Platform Stats
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {currentData.stats.map((stat, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                      <div className="text-2xl sm:text-3xl font-black text-white font-space">{stat.value}</div>
                      <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#0C172C]/60 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#8CF08A] animate-ping" />
                    <span className="text-xs font-semibold text-slate-200">Active Campaign Matcher</span>
                  </div>
                  <span className="text-xs font-bold text-[#8CF08A]">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           3. KEY FEATURES GRID (Adsy Clean Card Style)
           ───────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#112C3E] font-space">
              Why Leaders Choose MediaHub for {currentData.title}
            </h2>
            <p className="text-sm sm:text-base text-[#677F9B]">
              Streamline outreach, verify domain metrics, and maximize marketing ROI with our clean platform suite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentData.features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#EAF1F6] rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F0F4FF] flex items-center justify-center text-[#3E4FEA]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#112C3E] font-space">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-[#677F9B] leading-relaxed">{feature.desc}</p>
                  </div>
                  <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#3E4FEA]">
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
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#3E4FEA]">Step-by-Step</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#112C3E] font-space">
              {currentData.workflowTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {currentData.workflowSteps.map((step, idx) => (
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
           5. COMPARISON / TRUST TABLE (Adsy Style Clarity)
           ───────────────────────────────────────────── */}
        <section className="bg-[#112C3E] text-white rounded-[32px] p-8 sm:p-12 shadow-xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3E4FEA] text-white uppercase tracking-wider">
                The MediaHub Advantage
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-space">
                Traditional Outreach vs. MediaHub Platform
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Say goodbye to endless email cold pitching, unverified metric claims, non-responsive webmasters, and payment fraud.
              </p>
            </div>

            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-2 text-xs uppercase font-bold text-slate-400 border-b border-white/10 pb-3">
                <div>Manual Guest Posting</div>
                <div className="text-[#8CF08A]">MediaHub Marketplace</div>
              </div>

              <div className="grid grid-cols-2 text-xs sm:text-sm py-2 border-b border-white/5">
                <div className="text-slate-400">High agency markup fees</div>
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <CheckIcon className="w-4 h-4 text-[#8CF08A]" /> Direct publisher pricing
                </div>
              </div>

              <div className="grid grid-cols-2 text-xs sm:text-sm py-2 border-b border-white/5">
                <div className="text-slate-400">Uncertain payment risk</div>
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <CheckIcon className="w-4 h-4 text-[#8CF08A]" /> 100% Escrow protected
                </div>
              </div>

              <div className="grid grid-cols-2 text-xs sm:text-sm py-2 border-b border-white/5">
                <div className="text-slate-400">Manual metric checking</div>
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <CheckIcon className="w-4 h-4 text-[#8CF08A]" /> Live Ahrefs & Moz metrics
                </div>
              </div>

              <div className="grid grid-cols-2 text-xs sm:text-sm py-2">
                <div className="text-slate-400">Weeks of cold negotiation</div>
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <CheckIcon className="w-4 h-4 text-[#8CF08A]" /> Instant ordering & 48h turnaround
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           6. BOTTOM CTA BANNER
           ───────────────────────────────────────────── */}
        <section className="rounded-[32px] bg-gradient-to-r from-[#3E4FEA] via-[#2D3ECE] to-[#1E2BB8] text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black font-space">
              {currentData.ctaHeadline}
            </h2>
            <p className="text-sm sm:text-base text-slate-200">
              Join thousands of growth marketers, advertisers, brand strategists, and agencies scaling content distribution on MediaHub.
            </p>
            <div className="pt-2 flex flex-wrap justify-center items-center gap-4">
              <Link
                href="/register"
                className="px-8 py-3.5 rounded-full bg-[#8CF08A] hover:bg-[#7be279] text-[#0C172C] font-extrabold text-sm sm:text-base transition shadow-md hover:scale-105"
              >
                Create Free Account
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm sm:text-base transition"
              >
                Contact Sales Team
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Support Widget */}
      <FloatingSupportWidget />

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
