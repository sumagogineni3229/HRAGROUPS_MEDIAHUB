"use client";

import Link from "next/link";
import { useState } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import {
  ChevronRightIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  PlayIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  TvIcon,
  GlobeAltIcon,
  PaperAirplaneIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";

export default function MediaKitPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [guestForm, setGuestForm] = useState({
    name: "",
    email: "",
    company: "",
    linkedin: "",
    topic: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/guest-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application");
      }

      setApplied(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#112C3E] font-sans antialiased selection:bg-[#3E4FEA] selection:text-white flex flex-col justify-between">
      {/* Navbar */}
      <PublicHeader activePage="podcasts" />

      {/* Main Full-Width Wrapper */}
      <main className="w-full px-4 sm:px-8 lg:px-14 py-8 space-y-16 lg:space-y-24 max-w-[1600px] mx-auto flex-1">
        
        {/* ─────────────────────────────────────────────
           1. HERO BANNER ("MediaHub Talks")
           ───────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-gradient-to-r from-[#0C172C] via-[#11254B] to-[#1B365D] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-white/10 w-full">
          {/* Subtle Background Glow Elements */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#3E4FEA]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#8CF08A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              {/* MediaHub Talks Branding Badge */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 px-5 py-2.5 rounded-full">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tracking-tight text-white font-space">
                    Media<span className="text-[#3E4FEA]">Hub</span>
                  </span>
                  <span className="font-serif italic text-2xl text-[#8CF08A] font-semibold -ml-1">
                    Talks
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-space leading-[1.15] tracking-tight">
                Talks with people who are shaping the future of search & media
              </h1>

              {/* Scroll Down Indicator */}
              <div className="flex items-center gap-3 pt-4 text-xs sm:text-sm text-slate-300 font-medium">
                <div className="w-6 h-10 rounded-full border-2 border-slate-400/60 flex items-start justify-center p-1">
                  <div className="w-1.5 h-2.5 bg-[#8CF08A] rounded-full animate-bounce mt-1" />
                </div>
                <span>Scroll down to learn more</span>
              </div>
            </div>

            {/* Right Graphic: Dynamic Host/Guest Visual representation */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-lg aspect-square rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-8 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-sm">
                
                {/* Floating 3D style accent badges */}
                <div className="absolute top-6 right-6 bg-gradient-to-br from-[#3E4FEA] to-[#6366F1] p-3.5 rounded-2xl shadow-lg border border-white/20 animate-pulse">
                  <PlayIcon className="w-7 h-7 text-white" />
                </div>
                
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8CF08A]/20 text-[#8CF08A] text-xs font-bold uppercase tracking-wider border border-[#8CF08A]/30">
                    <SparklesIcon className="w-4 h-4" /> MediaHub Exclusive
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-space text-white leading-snug">
                    Where Digital Leaders Share Unfiltered Strategy
                  </h3>
                </div>

                {/* Avatar Stack Mockup */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3 overflow-hidden">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm border-2 border-[#11254B]">
                        AR
                      </div>
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm border-2 border-[#11254B]">
                        MK
                      </div>
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-sm border-2 border-[#11254B]">
                        SJ
                      </div>
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center font-bold text-white text-sm border-2 border-[#11254B]">
                        +40
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-200">
                      <span className="font-bold text-white block">Industry Experts</span>
                      Featured on MediaHub Talks
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           2. WHAT IS MEDIAHUB TALKS? (Timeline Section)
           ───────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-6 w-full">
          
          {/* Left Column: Branding & CTAs */}
          <div className="lg:col-span-5 space-y-8 sticky top-28">
            <div className="space-y-4">
              <span className="text-3xl sm:text-4xl font-extrabold font-space text-[#112C3E] block">
                What is
              </span>
              <div className="flex items-center gap-3">
                <span className="font-black text-4xl sm:text-5xl text-[#112C3E] tracking-tight font-space">
                  Media<span className="text-[#3E4FEA]">Hub</span>
                </span>
                <span className="font-serif italic text-4xl sm:text-5xl text-[#3E4FEA] font-bold">
                  Talks
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/solutions"
                className="px-6 py-3.5 rounded-full border border-[#112C3E] text-[#112C3E] font-semibold text-sm hover:bg-[#112C3E] hover:text-white transition shadow-sm"
              >
                Learn more about MediaHub
              </Link>
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3.5 rounded-full bg-[#112C3E] text-white font-semibold text-sm hover:bg-[#3E4FEA] transition flex items-center gap-2 shadow-md"
              >
                <PlayIcon className="w-4 h-4 text-[#8CF08A] fill-[#8CF08A]" />
                <span>Apply as a Guest</span>
              </button>
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="lg:col-span-7 relative pl-6 sm:pl-10 border-l-2 border-slate-200 space-y-12">
            
            {/* Timeline Item 1 (Blue) */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#3B82F6] border-4 border-white shadow-md group-hover:scale-125 transition-transform" />
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#112C3E] font-space">
                  Honest conversations about search in the AI era
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  MediaHub Talks is where we have honest, strategic conversations about how search, content monetization, and brand authority are changing in the AI era.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 (Green) */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#22C55E] border-4 border-white shadow-md group-hover:scale-125 transition-transform" />
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#112C3E] font-space">
                  No recycled basics
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  We don’t recycle basic tips. We don’t do “SEO for beginners.”
                </p>
              </div>
            </div>

            {/* Timeline Item 3 (Orange) */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#F97316] border-4 border-white shadow-md group-hover:scale-125 transition-transform" />
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#112C3E] font-space">
                  Voices shaping the future of discovery
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  We talk to the people who are actually shaping SEO, AI-driven discovery, digital PR, and brand authority — and we go deep.
                </p>
              </div>
            </div>

            {/* Timeline Item 4 (Red) */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#EF4444] border-4 border-white shadow-md group-hover:scale-125 transition-transform" />
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#112C3E] font-space">
                  Not tactics — perspective
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  This isn’t a tactical checklist podcast. It’s a forward-looking conversation for people who already live and breathe search, content, and publisher growth.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────────
           3. WHY THIS PODCAST EXISTS?
           ───────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#0D1B36] via-[#122A4F] to-[#18395B] text-white p-8 sm:p-14 lg:p-20 text-center space-y-10 border border-white/10 shadow-2xl w-full">
          {/* Radial Dashed Circles Graphic Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
            <div className="w-[800px] h-[800px] rounded-full border-2 border-dashed border-white flex items-center justify-center">
              <div className="w-[600px] h-[600px] rounded-full border-2 border-dashed border-white flex items-center justify-center">
                <div className="w-[400px] h-[400px] rounded-full border-2 border-dashed border-white" />
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black font-space text-[#8CF08A] tracking-tight">
              Why This Podcast Exists?
            </h2>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
              Search isn’t just about rankings anymore. AI answers, zero-click behavior, entity signals, brand authority — the game is shifting fast.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <p className="text-lg font-bold font-space text-white uppercase tracking-wider">
              On MediaHub Talks, we unpack:
            </p>

            <div className="max-w-3xl mx-auto space-y-4 text-left">
              {[
                "Why rankings are no longer the only metric that matters",
                "What citations and authority mean in AI search",
                "How brand visibility works when users don't click",
                "How SEO, PR, and content are merging",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="w-full bg-white/95 backdrop-blur-md text-[#112C3E] rounded-full px-6 py-4 flex items-center gap-4 shadow-lg hover:bg-white hover:scale-[1.01] transition-all cursor-default"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-[#112C3E] flex items-center justify-center shrink-0">
                    <ChevronRightIcon className="w-4 h-4 text-[#112C3E] stroke-[3]" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-4">
            <p className="text-sm sm:text-base text-slate-300 font-medium">
              We're documenting ☕ how serious marketers & publishers adapt — in real time.
            </p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           4. CURATED LINEUP NOTICE BANNER
           ───────────────────────────────────────────── */}
        <section className="w-full max-w-5xl mx-auto">
          <div className="bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534] rounded-2xl p-5 sm:p-6 flex items-center justify-center gap-3 text-center shadow-sm">
            <InformationCircleIcon className="w-6 h-6 shrink-0 text-[#166534]" />
            <p className="font-semibold text-sm sm:text-base">
              And we’re building a curated lineup of people who genuinely move the industry forward.
            </p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           5. WHO IS IT FOR?
           ───────────────────────────────────────────── */}
        <section className="rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#0F1B2E] via-[#142642] to-[#182E4F] text-white p-8 sm:p-14 lg:p-16 text-center space-y-10 border border-white/10 shadow-2xl w-full">
          <div className="max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black font-space text-white tracking-tight">
              Who Is It For?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              This podcast is a perfect match for (yet, anyone in the industry is welcome to watch us):
            </p>
          </div>

          {/* 6 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              "Senior SEO specialists",
              "Heads of Growth",
              "Digital PR leaders",
              "Agency founders",
              "SaaS marketing teams",
              "In-house search professionals",
            ].map((role, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-left flex items-start gap-4 hover:bg-white/15 hover:border-white/25 transition-all shadow-md"
              >
                <div className="w-7 h-7 rounded-full bg-[#8CF08A] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <CheckIcon className="w-4 h-4 text-[#0F1B2E] stroke-[3]" />
                </div>
                <span className="font-bold text-base text-white font-space">
                  {role}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           6. WHY JOIN MEDIAHUB TALKS?
           ───────────────────────────────────────────── */}
        <section className="space-y-12 text-center py-4 w-full">
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-space text-[#112C3E] tracking-tight">
              Why Join MediaHub Talks?
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              If you’re already shaping the industry, this isn’t an interview — it’s a real conversation. Here’s what you get:
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition text-left flex flex-col justify-between space-y-6">
              <div className="w-14 h-14 rounded-2xl border-2 border-[#112C3E] flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-7 h-7 text-[#112C3E]" />
              </div>
              <h3 className="text-xl font-bold font-space text-[#112C3E] leading-snug">
                A smart, peer-level discussion
              </h3>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition text-left flex flex-col justify-between space-y-6">
              <div className="w-14 h-14 rounded-2xl border-2 border-[#112C3E] flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-7 h-7 text-[#112C3E]" />
              </div>
              <h3 className="text-xl font-bold font-space text-[#112C3E] leading-snug">
                Evergreen discoverability
              </h3>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition text-left flex flex-col justify-between space-y-6">
              <div className="w-14 h-14 rounded-2xl border-2 border-[#112C3E] flex items-center justify-center">
                <TvIcon className="w-7 h-7 text-[#112C3E]" />
              </div>
              <h3 className="text-xl font-bold font-space text-[#112C3E] leading-snug">
                Full episode on YouTube and Spotify
              </h3>
            </div>

            {/* Card 4 (2 Cols Span on Desktop) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition text-left flex flex-col justify-between space-y-6">
              <div className="w-14 h-14 rounded-2xl border-2 border-[#112C3E] flex items-center justify-center">
                <GlobeAltIcon className="w-7 h-7 text-[#112C3E]" />
              </div>
              <h3 className="text-xl font-bold font-space text-[#112C3E] leading-snug max-w-lg">
                Your website, tools, research, and social profiles featured in the episode description
              </h3>
            </div>

            {/* Card 5 (Social Clips) */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition text-left space-y-6">
              <h3 className="text-xl font-bold font-space text-[#112C3E] leading-snug">
                Short-form clips & episode promotion across:
              </h3>

              {/* Social Icons row */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  YT
                </div>
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  X
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  in
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  IG
                </div>
                <div className="w-10 h-10 rounded-full bg-[#229ED9] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  TG
                </div>
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs shadow-sm border border-slate-700">
                  TT
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm font-semibold text-slate-600">
            You’ll receive ready-to-share clips and quote graphics.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 rounded-full bg-[#3E4FEA] text-white font-bold text-base hover:bg-[#112C3E] transition shadow-lg hover:shadow-xl"
            >
              Apply to join as a guest
            </button>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           7. WHY MEDIAHUB? (Added from latest user screenshots)
           ───────────────────────────────────────────── */}
        <section className="rounded-[36px] bg-[#EEF4FF] border border-[#D5E2FF] p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-sm w-full">
          {/* Subtle floating 3D chain link graphics mockup */}
          <div className="absolute top-6 left-8 text-blue-300/40 text-6xl pointer-events-none transform -rotate-45 font-black">
            🔗
          </div>
          <div className="absolute top-10 right-10 text-blue-300/40 text-6xl pointer-events-none transform rotate-12 font-black">
            🔗
          </div>
          <div className="absolute bottom-6 right-16 text-blue-300/40 text-5xl pointer-events-none transform -rotate-12 font-black">
            🔗
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column: Mascot Artwork */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#3E4FEA] to-[#6366F1] flex items-center justify-center shadow-2xl border-4 border-white/60">
                {/* 3D Mascot Representation */}
                <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-[#112C3E] flex flex-col items-center justify-center text-center p-6 shadow-inner relative overflow-hidden">
                  <div className="flex gap-4 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-[#3E4FEA]" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-[#3E4FEA]" />
                    </div>
                  </div>
                  <div className="w-6 h-3 bg-[#8CF08A] rounded-b-full mb-3" />
                  <span className="font-bold text-white font-space text-lg tracking-tight">
                    Media<span className="text-[#3E4FEA]">Hub</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Key Points */}
            <div className="lg:col-span-7 space-y-8">
              <h2 className="text-3xl sm:text-5xl font-black font-space text-[#112C3E]">
                Why MediaHub?
              </h2>

              <div className="space-y-6">
                {[
                  "At MediaHub, we work at the intersection of content distribution, digital PR, and authority-building.",
                  "We talk to SEO professionals and agencies every day.",
                  "MediaHub Talks is an extension of those real conversations.",
                  "We see what’s breaking, what’s working, and what’s misunderstood.",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <CheckIcon className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                    <p className="text-base sm:text-lg font-medium text-[#112C3E] leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/solutions"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#112C3E] text-white font-bold text-base hover:bg-[#3E4FEA] transition shadow-md group"
                >
                  <span>Learn more about MediaHub</span>
                  <div className="w-7 h-7 rounded-full bg-[#8CF08A] flex items-center justify-center text-[#112C3E] group-hover:translate-x-0.5 transition-transform">
                    <ArrowUpRightIcon className="w-4 h-4 stroke-[3]" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ─────────────────────────────────────────────
         GUEST APPLICATION MODAL
         ───────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => {
                setModalOpen(false);
                setApplied(false);
              }}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {!applied ? (
              <>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black font-space text-[#112C3E]">
                    Apply as a Guest on MediaHub Talks
                  </h3>
                  <p className="text-sm text-slate-500">
                    Tell us about your background and what strategic topic you’d like to unpack.
                  </p>
                </div>

                <form onSubmit={handleGuestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#112C3E] uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={guestForm.name}
                      onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3E4FEA] text-sm text-[#112C3E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#112C3E] uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@company.com"
                        value={guestForm.email}
                        onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3E4FEA] text-sm text-[#112C3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#112C3E] uppercase tracking-wider mb-1.5">
                        Company / Agency
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Media Agency"
                        value={guestForm.company}
                        onChange={(e) => setGuestForm({ ...guestForm, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3E4FEA] text-sm text-[#112C3E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#112C3E] uppercase tracking-wider mb-1.5">
                      LinkedIn Profile / Website
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={guestForm.linkedin}
                      onChange={(e) => setGuestForm({ ...guestForm, linkedin: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3E4FEA] text-sm text-[#112C3E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#112C3E] uppercase tracking-wider mb-1.5">
                      Proposed Topic or Key Insight
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Briefly describe what unique perspective or strategy you want to share..."
                      value={guestForm.topic}
                      onChange={(e) => setGuestForm({ ...guestForm, topic: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3E4FEA] text-sm text-[#112C3E]"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-full bg-[#112C3E] text-white font-bold text-sm hover:bg-[#3E4FEA] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <PaperAirplaneIcon className={`w-4 h-4 text-[#8CF08A] ${submitting ? "animate-pulse" : ""}`} />
                    <span>{submitting ? "Sending Application..." : "Submit Guest Application"}</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-[#DCFCE7] text-[#166534] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircleIcon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black font-space text-[#112C3E]">
                  Application Received!
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Thank you for applying to join MediaHub Talks. Our production team will review your profile and reach out shortly.
                </p>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setApplied(false);
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#112C3E] text-white font-semibold text-sm hover:bg-[#3E4FEA] transition"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <PublicFooter />
      <FloatingSupportWidget />
    </div>
  );
}
