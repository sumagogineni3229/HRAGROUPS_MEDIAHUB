"use client";

import Link from "next/link";
import { useState } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  TagIcon,
  ClockIcon,
  DocumentTextIcon,
  XMarkIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

interface GuideArticle {
  id: number;
  title: string;
  speaker: string;
  role: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  writtenDigest: {
    keyTakeaways: string[];
    technicalHighlights: string[];
    planMdReference: string;
  };
  featured?: boolean;
}

const MEDIAHUB_GUIDES: GuideArticle[] = [
  {
    id: 1,
    title: "Escrow Payment Architecture: 100% Financial Safety for Advertisers & Publishers",
    speaker: "MediaHub Engineering & Ops Team",
    role: "Core Marketplace Architecture",
    category: "Escrow & Security",
    readTime: "5 min read",
    date: "Aug 2026",
    summary:
      "An inside breakdown of MediaHub's digital escrow system. Learn how funds remain locked until live post URL verification and auto-releases after 72 hours of advertiser approval.",
    writtenDigest: {
      keyTakeaways: [
        "Advertiser deposits funds into platform escrow prior to work initiation.",
        "Funds are only released to publisher/influencer after live link verification.",
        "72-hour auto-approval window prevents payout deadlocks.",
        "100% money-back guarantee if a publisher fails to deliver verified live link.",
      ],
      technicalHighlights: [
        "Escrow Status Tracking: Pending Deposit → Locked in Escrow → Live Verification → Released to Available Balance",
        "PCI DSS compliant tokenized payment handling via Stripe, PayPal & Razorpay",
      ],
      planMdReference: "Section 3.3 (Order Placement & Escrow Flow) & Section 7.2 (Escrow Logic)",
    },
    featured: true,
  },
  {
    id: 2,
    title: "Automated Link Retention Monitoring & 24/7 Nofollow/Removal Alerts",
    speaker: "MediaHub Quality Control Lead",
    role: "Link Integrity & System Audits",
    category: "Quality Assurance",
    readTime: "4 min read",
    date: "Aug 2026",
    summary:
      "How MediaHub's automated monitoring engine checks published articles daily for link removals, nofollow changes, or HTTP downtime with automatic remediation workflows.",
    writtenDigest: {
      keyTakeaways: [
        "System checks live guest post URLs daily via automated web crawlers.",
        "Instant email & dashboard alerts if a link is removed or changed to nofollow.",
        "7-day publisher remediation grace period before auto-refund escalation.",
        "12-month link retention guarantee backed by mandatory replacement policies.",
      ],
      technicalHighlights: [
        "Link Crawler: Periodic HTTP status check + DOM anchor tag attribute parsing",
        "Automated Dispute Escalation: Triggers refund if status is uncorrected",
      ],
      planMdReference: "Section 4.3 (Link Monitoring & Auto-Alerts) & Section 3.3.3",
    },
    featured: false,
  },
  {
    id: 3,
    title: "Why Admin-Moderated Communication Eliminates Spam & Protects Creators",
    speaker: "MediaHub Moderation Operations",
    role: "Platform Health & Privacy",
    category: "Platform Moderation",
    readTime: "6 min read",
    date: "Jul 2026",
    summary:
      "Exploring our core philosophy: 'Advertiser messages never reach creators directly — Admin is the communication bridge.' Learn how we prevent off-platform spam and handle custom briefs.",
    writtenDigest: {
      keyTakeaways: [
        "All advertiser pre-sale inquiries and custom briefs route through the Admin Moderation Inbox.",
        "Prevents off-platform solicitation, fee evasion, and harassment.",
        "SLA response targets ensure fast turnarounds on custom orders.",
        "Admin facilitates custom package negotiations between creators and buyers.",
      ],
      technicalHighlights: [
        "RBAC Message Routing: Advertiser → Admin Inbox → Creator Notification → Admin Approval → Advertiser",
        "Audit Trail: Immutable history for dispute resolution and compliance",
      ],
      planMdReference: "Section 3.4 (Admin-Moderated Messaging Flow) & Section 1.0 Philosophy",
    },
    featured: false,
  },
  {
    id: 4,
    title: "Publisher Monetization Blueprint: Guest Posts, Content Writing & Multi-Tier Pricing",
    speaker: "Head of Publisher Relations",
    role: "Creator Monetization",
    category: "Publisher Growth",
    readTime: "7 min read",
    date: "Jul 2026",
    summary:
      "A complete guide for website owners to optimize domain authority metrics, set pricing tiers for 'Guest Post Only' vs 'Guest Post + Writing', and maximize monthly CPM yields.",
    writtenDigest: {
      keyTakeaways: [
        "Publishers list websites with transparent DA/DR, traffic, and language metrics.",
        "Flexible pricing tiers: Guest Post Only (client content) or Guest Post + Writing (publisher content).",
        "Clear content guidelines and category selection across all major industries.",
        "Withdraw earnings via UPI, PayPal, Bank Wire, Wise, or Payoneer.",
      ],
      technicalHighlights: [
        "Moz/Ahrefs API metrics sync with manual verification override",
        "Plagiarism & SEO quality check tools integrated into writing workflow",
      ],
      planMdReference: "Section 3.1.1 (Publisher Onboarding) & Section 4.4 (Content Marketplace)",
    },
    featured: false,
  },
  {
    id: 5,
    title: "Influencer Package Structuring Across YouTube, Instagram & TikTok",
    speaker: "MediaHub Creator Strategy",
    role: "Influencer Ecosystem",
    category: "Influencer Campaigns",
    readTime: "5 min read",
    date: "Jun 2026",
    summary:
      "How social influencers create multi-tier deliverables (Reels, Shorts, Dedicated Reviews) and utilize pre-approval draft uploads to reduce revisions and ensure brand safety.",
    writtenDigest: {
      keyTakeaways: [
        "Influencers connect YouTube, Instagram, and TikTok channels via secure OAuth.",
        "Pre-approval draft uploads allow advertisers to review content prior to public posting.",
        "Transparent follower, engagement rate, and audience demographic display.",
        "Standardized turnaround times and add-on pricing for extra revisions.",
      ],
      technicalHighlights: [
        "OAuth 2.0 Integration: Real-time API subscriber & engagement rate fetching",
        "Content Pre-Approval: Versioned video draft storage on Cloudflare R2 / S3",
      ],
      planMdReference: "Section 3.1.2 (Influencer Registration) & Section 4.5 (Draft Pre-Approval)",
    },
    featured: false,
  },
  {
    id: 6,
    title: "Global Multi-Currency Escrow Payouts & Tax Compliance",
    speaker: "MediaHub Financial Controller",
    role: "Finance & Treasury",
    category: "Escrow & Security",
    readTime: "5 min read",
    date: "Jun 2026",
    summary:
      "Understanding dynamic currency conversions, international payout methods (UPI India, PayPal, Wire, Wise), and automated W-8BEN / W-9 tax documentation collection.",
    writtenDigest: {
      keyTakeaways: [
        "Real-time dynamic currency conversion for advertisers worldwide.",
        "Local payment methods including UPI (India), Cards (Stripe), and PayPal.",
        "Global payouts via PayPal, Wise, Payoneer, and direct ACH/SEPA wire transfers.",
        "Automated tax invoice generation and compliance tracking.",
      ],
      technicalHighlights: [
        "Dynamic FX Rate Sync Engine with FX risk absorption",
        "KYC Identity Verification gate before initial payout release",
      ],
      planMdReference: "Section 4.6 (Dynamic Pricing) & Section 7.1 (Supported Payment Methods)",
    },
    featured: false,
  },
];

export default function PodcastLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDigest, setSelectedDigest] = useState<GuideArticle | null>(null);

  const categories = ["All", "Escrow & Security", "Quality Assurance", "Platform Moderation", "Publisher Growth", "Influencer Campaigns"];

  const filteredEpisodes = MEDIAHUB_GUIDES.filter((ep) => {
    const matchesSearch =
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || ep.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredEpisode = MEDIAHUB_GUIDES.find((ep) => ep.featured) || MEDIAHUB_GUIDES[0];

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#112C3E] font-sans antialiased selection:bg-[#3E4FEA] selection:text-white flex flex-col justify-between">
      <div>
        {/* Header */}
        <PublicHeader activePage="podcasts" />

        {/* FULL SCREEN CONTAINER (max-w-[1600px] matching Media Kit page) */}
        <main className="w-full px-6 sm:px-10 lg:px-16 max-w-[1600px] mx-auto py-10 space-y-12">
          
          {/* Hero Banner Section */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAF1F6] shadow-sm relative overflow-hidden space-y-8">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#3E4FEA]/10 via-[#8CF08A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3E4FEA]/10 border border-[#3E4FEA]/20 text-[#3E4FEA] text-xs font-bold uppercase tracking-wider">
                  <BookOpenIcon className="w-4 h-4 text-[#3E4FEA]" />
                  <span>MediaHub Technical Strategy & Knowledge Base</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-space text-[#112C3E] tracking-tight leading-[1.1]">
                  Media<span className="text-[#3E4FEA]">Hub</span> Strategy Library
                </h1>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  Read official technical design guides and operational architecture summaries directly from our startup specification (<code className="text-[#3E4FEA] bg-[#3E4FEA]/10 px-2 py-0.5 rounded font-mono text-xs">plan.md</code>). Includes Escrow security rules, daily link crawlers, admin moderation, and creator payout systems.
                </p>

                {/* 3 Key Operational Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#EAF1F6]">
                    <ShieldCheckIcon className="w-6 h-6 text-[#22c55e] shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-[#112C3E] block">100% Escrow Guard</span>
                      <span className="text-[11px] text-slate-500">Funds locked until verification</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#EAF1F6]">
                    <CheckCircleIcon className="w-6 h-6 text-[#3E4FEA] shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-[#112C3E]">Daily Retention Crawls</span>
                      <span className="text-[11px] text-slate-500 block">Automated HTTP & link checks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#EAF1F6]">
                    <BanknotesIcon className="w-6 h-6 text-[#8B5CF6] shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-[#112C3E]">Multi-Currency Payouts</span>
                      <span className="text-[11px] text-slate-500 block">UPI, PayPal, Wise & Wire</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-4 shrink-0 relative z-10">
                <Link
                  href="/media-kit"
                  className="px-8 py-4 rounded-2xl bg-[#112C3E] text-white font-bold text-sm hover:bg-[#3E4FEA] transition shadow-md text-center flex items-center justify-center gap-2"
                >
                  <span>Explore Media Kit</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <span className="text-xs text-slate-500 font-medium text-center lg:text-right">6 Technical Strategy Guides Available</span>
              </div>
            </div>
          </div>

          {/* Featured Strategy Guide Banner */}
          {featuredEpisode && (
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C172C] via-[#11254B] to-[#1B365D] text-white p-8 sm:p-12 shadow-xl border border-white/10 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 rounded-full bg-[#8CF08A] text-[#0C172C] text-xs font-black uppercase tracking-wider">
                      ★ Featured Technical Guide
                    </span>
                    <span className="text-xs text-slate-300 flex items-center gap-1 font-medium bg-white/10 px-3 py-1 rounded-full">
                      <ClockIcon className="w-3.5 h-3.5" /> {featuredEpisode.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-space leading-snug text-white">
                    {featuredEpisode.title}
                  </h2>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {featuredEpisode.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
                      <div className="w-9 h-9 rounded-full bg-[#3E4FEA] flex items-center justify-center font-bold text-white text-xs shadow-md">
                        MH
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">{featuredEpisode.speaker}</span>
                        <span className="text-[11px] text-slate-300">{featuredEpisode.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-4">
                  <button
                    onClick={() => setSelectedDigest(featuredEpisode)}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#3E4FEA] text-white font-bold text-base hover:bg-[#8CF08A] hover:text-[#0C172C] transition shadow-lg flex items-center justify-center gap-3"
                  >
                    <DocumentTextIcon className="w-6 h-6" />
                    <span>Read Featured Guide</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Filter and Search Bar Container */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EAF1F6] shadow-sm">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-[#3E4FEA] text-white shadow-md"
                      : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200 border border-[#EAF1F6]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search MediaHub topics, escrow, link crawlers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#EAF1F6] bg-[#F8FAFC] text-xs font-medium text-[#112C3E] focus:outline-none focus:ring-2 focus:ring-[#3E4FEA] focus:bg-white"
              />
            </div>
          </div>

          {/* Episode Cards Grid - 3 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEpisodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => setSelectedDigest(ep)}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAF1F6] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group hover:-translate-y-1 cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#3E4FEA] uppercase tracking-wider bg-[#3E4FEA]/10 px-3 py-1 rounded-full border border-[#3E4FEA]/20">
                      <TagIcon className="w-3 h-3" /> {ep.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{ep.readTime} • {ep.date}</span>
                  </div>

                  <h3 className="text-lg font-bold font-space text-[#112C3E] leading-snug group-hover:text-[#3E4FEA] transition-colors">
                    {ep.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {ep.summary}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#EAF1F6]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#112C3E] text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                        MH
                      </div>
                      <div className="max-w-[140px] truncate">
                        <span className="font-bold text-xs text-[#112C3E] block truncate">{ep.speaker}</span>
                        <span className="text-[10px] text-slate-500 truncate block">{ep.role}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDigest(ep);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#3E4FEA] hover:bg-[#2632A3] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <DocumentTextIcon className="w-4 h-4" />
                      <span>Read Guide</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* WRITTEN DIGEST MODAL (Extracted from plan.md) */}
      {selectedDigest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 text-[#112C3E] animate-in zoom-in-95">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3E4FEA] uppercase tracking-wider bg-[#3E4FEA]/10 px-2.5 py-0.5 rounded-full mb-2">
                  {selectedDigest.category} • Technical Guide
                </span>
                <h3 className="text-xl font-bold font-space text-[#112C3E] leading-snug">
                  {selectedDigest.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDigest(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Executive Overview</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-[#F8FAFC] p-4 rounded-2xl border border-[#EAF1F6]">
                {selectedDigest.summary}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-[#3E4FEA]" /> Key Strategic Principles
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {selectedDigest.writtenDigest.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3E4FEA] mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Architecture */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BanknotesIcon className="w-4 h-4 text-[#22c55e]" /> System Architecture & Compliance
              </h4>
              <div className="space-y-2 text-xs text-slate-700 bg-[#112C3E] text-slate-200 p-4 rounded-2xl font-mono">
                {selectedDigest.writtenDigest.technicalHighlights.map((tech, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#8CF08A] font-bold">›</span>
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference to plan.md */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Reference: {selectedDigest.writtenDigest.planMdReference}</span>
              <button
                onClick={() => setSelectedDigest(null)}
                className="px-5 py-2 rounded-xl bg-[#3E4FEA] text-white font-bold hover:bg-[#2632A3] transition"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer & Floating Support */}
      <PublicFooter />
      <FloatingSupportWidget />
    </div>
  );
}
