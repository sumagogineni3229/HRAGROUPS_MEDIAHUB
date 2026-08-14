"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import { PublicHeader } from "@/components/layout/public-header";
import { DEFAULT_HOME_PAGE_CONTENT, HomePageContent } from "@/lib/page-content-data";
import {
  MagnifyingGlassIcon,
  GlobeAltIcon,
  StarIcon,
  LinkIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  MegaphoneIcon,
  UserGroupIcon,
  CheckCircleIcon,
  WalletIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  XMarkIcon,
  SparklesIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

export default function Home() {
  const [content, setContent] = useState<HomePageContent>(DEFAULT_HOME_PAGE_CONTENT);
  const [demoCallModalOpen, setDemoCallModalOpen] = useState(false);
  const [demoCallForm, setDemoCallForm] = useState({ phone: "", email: "", reason: "" });
  const [demoCallSubmitting, setDemoCallSubmitting] = useState(false);
  const [demoCallSuccess, setDemoCallSuccess] = useState(false);
  const [demoCallError, setDemoCallError] = useState("");

  useEffect(() => {
    async function loadCms() {
      try {
        const res = await fetch("/api/cms/page?key=home_page_data");
        if (res.ok) {
          const data = await res.json();
          if (data.html) {
            try {
              const parsed = JSON.parse(data.html);
              setContent((prev) => ({ ...prev, ...parsed }));
            } catch (err) {
              console.error("Failed to parse home_page_data JSON", err);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadCms();
  }, []);

  const handleDemoCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoCallSubmitting(true);
    setDemoCallError("");

    try {
      const res = await fetch("/api/book-demo-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoCallForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to book demo call.");
      }

      setDemoCallSuccess(true);
    } catch (err: any) {
      setDemoCallError(err.message || "Failed to book demo call. Please try again.");
    } finally {
      setDemoCallSubmitting(false);
    }
  };

  const c = content;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased bg-box-grid selection:bg-[#F59E0B] selection:text-white">
      {/* ─────────────────────────────────────────────
         1. DYNAMIC HEADER
         ───────────────────────────────────────────── */}
      <PublicHeader activePage="home" />

      {/* ─────────────────────────────────────────────
         2. HERO SECTION (EXACT DESIGN AS IS)
         ───────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-slate-200/80 text-center">
        {/* Glow light background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-300/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="w-full px-6 sm:px-12 lg:px-16 relative z-10 max-w-5xl mx-auto space-y-8">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
            <SparklesIcon className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{c.heroBadge}</span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black leading-[1.08] tracking-tight text-slate-950 font-space">
            {c.heroTitle1}<br />
            <span className="bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-amber-700 bg-clip-text text-transparent">
              {c.heroTitleHighlight}
            </span><br />
            {c.heroTitle2}
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
            {c.heroSubtitle}
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/solutions"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
            >
              <MagnifyingGlassIcon className="w-4 h-4 text-white" />
              <span>{c.btnExplore}</span>
            </Link>

            <Link
              href="/register?role=publisher"
              className="px-7 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm flex items-center gap-2 hover:border-amber-400 hover:text-amber-600 hover:shadow-xs transition-all shadow-2xs"
            >
              <GlobeAltIcon className="w-4 h-4 text-slate-500" />
              <span>{c.btnPublisher}</span>
            </Link>

            <Link
              href="/register?role=influencer"
              className="px-7 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm flex items-center gap-2 hover:border-amber-400 hover:text-amber-600 hover:shadow-xs transition-all shadow-2xs"
            >
              <StarIcon className="w-4 h-4 text-slate-500" />
              <span>{c.btnInfluencer}</span>
            </Link>

            <button
              onClick={() => setDemoCallModalOpen(true)}
              className="px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center gap-2 hover:bg-[#F59E0B] transition-all shadow-md cursor-pointer"
            >
              <PhoneIcon className="w-4 h-4 text-amber-400" />
              <span>{c.btnDemo}</span>
            </button>
          </div>

          {/* 4 Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-slate-100 max-w-4xl mx-auto">
            <div className="text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#D97706] font-space tracking-tight">{c.metric1Value}</p>
              <p className="text-xs font-semibold text-slate-500">{c.metric1Label}</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#D97706] font-space tracking-tight">{c.metric2Value}</p>
              <p className="text-xs font-semibold text-slate-500">{c.metric2Label}</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#D97706] font-space tracking-tight">{c.metric3Value}</p>
              <p className="text-xs font-semibold text-slate-500">{c.metric3Label}</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#D97706] font-space tracking-tight">{c.metric4Value}</p>
              <p className="text-xs font-semibold text-slate-500">{c.metric4Label}</p>
            </div>
          </div>

          {/* Schedule Demo Banner */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white rounded-3xl p-6 sm:px-10 border border-slate-200 shadow-sm relative overflow-hidden text-left">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#F59E0B] to-[#D97706]" />
            <div className="space-y-1 pl-2">
              <p className="text-lg font-bold text-slate-900">{c.demoBannerTitle}</p>
              <p className="text-sm font-semibold text-[#D97706]">{c.demoBannerSubtitle}</p>
            </div>
            <button
              onClick={() => setDemoCallModalOpen(true)}
              className="px-7 py-3 rounded-full bg-slate-900 text-white hover:bg-[#F59E0B] font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <PhoneIcon className="w-4 h-4 text-amber-400" />
              <span>{c.demoBannerBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         3. CORE SERVICES (EXACT DESIGN AS IS)
         ───────────────────────────────────────────── */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="w-full px-6 sm:px-12 lg:px-16 space-y-12 text-center max-w-6xl mx-auto">
          {/* Badge & Title */}
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold uppercase">
              {c.servicesBadge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 font-space tracking-tight">
              {c.servicesTitle}
            </h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto">
              {c.servicesSubtitle}
            </p>
          </div>

          {/* 5 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 text-left">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs hover:border-amber-400 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <LinkIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">{c.service1Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {c.service1Desc}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs hover:border-amber-400 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">{c.service2Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {c.service2Desc}
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs hover:border-amber-400 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <PencilSquareIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">{c.service3Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {c.service3Desc}
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs hover:border-amber-400 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <MegaphoneIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">{c.service4Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {c.service4Desc}
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs hover:border-amber-400 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">{c.service5Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {c.service5Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         4. DUAL SPLIT CARDS (EXACT DESIGN AS IS)
         ───────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50/60 border-b border-slate-100">
        <div className="w-full px-6 sm:px-12 lg:px-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card Left: For Publishers */}
            <div className="bg-gradient-to-b from-amber-50/50 via-white to-white rounded-[32px] p-8 sm:p-10 border border-amber-200 shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold font-mono">
                  {c.pubCardBadge}
                </span>
                <h3 className="text-3xl font-black text-slate-950 font-space tracking-tight">
                  {c.pubCardTitle}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  {c.pubCardDesc}
                </p>

                <div className="space-y-3 pt-2 text-sm font-medium text-slate-700">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-[#D97706]" />
                    <span>{c.pubCardBullet1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-[#D97706]" />
                    <span>{c.pubCardBullet2}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-[#D97706]" />
                    <span>{c.pubCardBullet3}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-[#D97706]" />
                    <span>{c.pubCardBullet4}</span>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/register?role=publisher"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-sm hover:shadow-lg transition"
                >
                  <span>{c.pubCardBtn}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card Right: For Influencers */}
            <div className="bg-gradient-to-b from-amber-50/50 via-white to-white rounded-[32px] p-8 sm:p-10 border border-amber-200 shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold font-mono">
                  {c.infCardBadge}
                </span>
                <h3 className="text-3xl font-black text-slate-950 font-space tracking-tight">
                  {c.infCardTitle}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  {c.infCardDesc}
                </p>

                <div className="space-y-3 pt-2 text-sm font-medium text-slate-700">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-[#D97706]" />
                    <span>{c.infCardBullet1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-[#D97706]" />
                    <span>{c.infCardBullet2}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-[#D97706]" />
                    <span>{c.infCardBullet3}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-[#D97706]" />
                    <span>{c.infCardBullet4}</span>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/register?role=influencer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-sm hover:shadow-lg transition"
                >
                  <span>{c.infCardBtn}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         5. HOW IT WORKS 4 STEPS (EXACT DESIGN AS IS)
         ───────────────────────────────────────────── */}
      <section className="py-24 bg-white border-b border-slate-100 text-center">
        <div className="w-full px-6 sm:px-12 lg:px-16 space-y-12 max-w-6xl mx-auto">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold uppercase">
              {c.howItWorksBadge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 font-space tracking-tight">
              {c.howItWorksTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-xs">
                <MagnifyingGlassIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">{c.step1Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {c.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-xs">
                <WalletIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">{c.step2Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {c.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-xs">
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">{c.step3Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {c.step3Desc}
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-xs">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-space">{c.step4Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {c.step4Desc}
              </p>
            </div>
          </div>

          {/* 3 Trust Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100 text-left">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheckIcon className="w-5 h-5 text-[#D97706]" />
                <span className="font-space text-base">{c.trust1Title}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {c.trust1Desc}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <BoltIcon className="w-5 h-5 text-[#D97706]" />
                <span className="font-space text-base">{c.trust2Title}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {c.trust2Desc}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ArrowTrendingUpIcon className="w-5 h-5 text-[#D97706]" />
                <span className="font-space text-base">{c.trust3Title}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {c.trust3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         6. CONVERSION CTA BANNER (EXACT DESIGN AS IS)
         ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="w-full px-6 sm:px-12 lg:px-16 max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] p-12 sm:p-16 rounded-[36px] text-white shadow-2xl space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black font-space tracking-tight">
              {c.ctaTitle}
            </h2>
            <p className="text-amber-100 text-sm sm:text-base max-w-xl mx-auto font-medium">
              {c.ctaSubtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                href="/register"
                className="px-8 py-3.5 rounded-2xl bg-white text-slate-950 font-bold text-sm hover:bg-amber-50 hover:shadow-lg transition"
              >
                {c.ctaBtn1}
              </Link>
              <Link
                href="/solutions"
                className="px-8 py-3.5 rounded-2xl bg-white/10 border border-white/30 text-white font-bold text-sm hover:bg-white/20 transition"
              >
                {c.ctaBtn2}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Book Demo Call Modal */}
      {demoCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative text-slate-900 text-left">
            <button
              onClick={() => setDemoCallModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {!demoCallSuccess ? (
              <>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-[#D97706] flex items-center justify-center font-bold text-xl mb-1">
                    📞
                  </div>
                  <h3 className="text-2xl font-extrabold font-space">
                    Schedule a Demo Call
                  </h3>
                  <p className="text-sm text-slate-500">
                    Our platform specialists will reach out to discuss your campaign goals.
                  </p>
                </div>

                <form onSubmit={handleDemoCallSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9490056002"
                      value={demoCallForm.phone}
                      onChange={(e) => setDemoCallForm({ ...demoCallForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                      Gmail / Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@gmail.com"
                      value={demoCallForm.email}
                      onChange={(e) => setDemoCallForm({ ...demoCallForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                      Reason for Demo Call <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Interested in guest posting inventory for tech blogs..."
                      value={demoCallForm.reason}
                      onChange={(e) => setDemoCallForm({ ...demoCallForm, reason: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] text-sm text-slate-900"
                    />
                  </div>

                  {demoCallError && (
                    <div className="p-3 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl">
                      {demoCallError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={demoCallSubmitting}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-sm hover:shadow-lg transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{demoCallSubmitting ? "Submitting..." : "Confirm & Book Call"}</span>
                    <span>→</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-amber-100 text-[#D97706] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-extrabold font-space">
                  Demo Call Request Sent!
                </h3>
                <p className="text-sm text-slate-600">
                  Thank you! We have received your call request at <span className="font-bold text-slate-900">{demoCallForm.email}</span> and will call <span className="font-bold text-slate-900">{demoCallForm.phone}</span> shortly.
                </p>
                <button
                  onClick={() => setDemoCallModalOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-[#F59E0B] transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer & Floating Support */}
      <PublicFooter />
      <FloatingSupportWidget />
    </div>
  );
}
