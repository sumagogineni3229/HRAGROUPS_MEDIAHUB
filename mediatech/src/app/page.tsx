"use client";

import Link from "next/link";
import { useState } from "react";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon,
  HandThumbUpIcon,
  PencilSquareIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
  StarIcon,
  SparklesIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

import { PublicHeader } from "@/components/layout/public-header";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMetricDomain, setActiveMetricDomain] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeWorkTab, setActiveWorkTab] = useState<"advertiser" | "publisher">("advertiser");
  const [chatOpen, setChatOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [showPromptBubble, setShowPromptBubble] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "support", text: "Hello! Welcome to MediaHub. How can we help you with your guest post campaign today?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [ctaEmail, setCtaEmail] = useState("");
  const [ctaRobotChecked, setCtaRobotChecked] = useState(false);
  const [ctaError, setCtaError] = useState("");

  const [demoCallModalOpen, setDemoCallModalOpen] = useState(false);
  const [demoCallForm, setDemoCallForm] = useState({ phone: "", email: "", reason: "" });
  const [demoCallSubmitting, setDemoCallSubmitting] = useState(false);
  const [demoCallSuccess, setDemoCallSuccess] = useState(false);
  const [demoCallError, setDemoCallError] = useState("");

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const userMsg = { id: Date.now(), sender: "user", text: inputMessage.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "support", text: "Thanks for messaging us! Our support team will get back to you in just a moment." }
      ]);
    }, 800);
  };

  const handleCallClick = (e: React.MouseEvent) => {
    const isMobile = typeof window !== "undefined" && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.matchMedia("(max-width: 768px)").matches
    );

    if (isMobile) {
      window.location.href = "tel:+919490056002";
    } else {
      e.preventDefault();
      setCallModalOpen(!callModalOpen);
      setChatOpen(false);
    }
  };

  const metricDomains = [
    {
      url: "https://techbullion.com",
      ahrefsTraffic: "16K",
      similarwebTraffic: "361K",
      mozDa: "74",
      semrushScore: "43",
      ahrefsDr: "81",
      language: "English",
      countries: [
        { flag: "🇺🇸", code: "223k" },
        { flag: "🇵🇰", code: "171k" },
      ],
      categories: "Finance, Technology, Internet",
    },
    {
      url: "https://msn.com",
      ahrefsTraffic: "23.2M",
      similarwebTraffic: "593M",
      mozDa: "95",
      semrushScore: "98",
      ahrefsDr: "92",
      language: "English",
      countries: [
        { flag: "🇺🇸", code: "1.2M" },
        { flag: "🇬🇧", code: "750k" },
      ],
      categories: "Business, News & Media, Sports",
    },
    {
      url: "https://metapress.com",
      ahrefsTraffic: "1K",
      similarwebTraffic: "176K",
      mozDa: "76",
      semrushScore: "32",
      ahrefsDr: "79",
      language: "English",
      countries: [{ flag: "🇺🇸", code: "223k" }],
      categories: "Business, Fashion, Technology",
    },
    {
      url: "https://urbansplatter.com",
      ahrefsTraffic: "12K",
      similarwebTraffic: "118K",
      mozDa: "48",
      semrushScore: "36",
      ahrefsDr: "64",
      language: "English",
      countries: [{ flag: "🇺🇸", code: "190k" }],
      categories: "Construction, Real Estate, Travel",
    },
  ];

  const clientReviews = [
    {
      initials: "KD",
      name: "Kai Donovan",
      reviewsCount: "1 review",
      timeAgo: "4 weeks ago",
      text: "Tried MediaHub for the first time and loved it! Fast service, real sites, and great support. Will definitely use again.",
    },
    {
      initials: "KB",
      name: "Kamal Barman",
      reviewsCount: "7 reviews",
      timeAgo: "4 months ago",
      text: "I've been using MediaHub for a few months now, and overall, it's a reliable and intuitive platform for link building. Excellent publisher variety!",
    },
    {
      initials: "AF",
      name: "Angélica Flores",
      reviewsCount: "1 review",
      timeAgo: "3 weeks ago",
      text: "It's easy to use, offers a good variety of sites, and has helpful filtering tools. Most orders are delivered on time, and content quality is high.",
    },
    {
      initials: "DM",
      name: "Donny Munoz",
      reviewsCount: "1 review",
      timeAgo: "4 months ago",
      text: "Extremely happy with the results of working with MediaHub. The rating system is on point for buyer's content. We look forward to the next campaign.",
    },
    {
      initials: "OT",
      name: "Olga Tarasenko",
      reviewsCount: "3 reviews",
      timeAgo: "5 months ago",
      text: "I have been using the service for the last 2 years. It's been very helpful with my company's guest publishing. The publisher database is priceless.",
    },
    {
      initials: "MS",
      name: "Mr S",
      reviewsCount: "36 reviews",
      timeAgo: "3 weeks ago",
      text: "Dependable platform that helps hugely with SEO efforts. Powerful filters and responsive support team.",
    },
  ];

  const blogPosts = [
    {
      title: "The Ultimate SEO Migration Checklist: 11 Steps to Protect Your Rankings",
      tag: "SEO Strategy",
      date: "Aug 2026",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "Cyrus Shepard: 'Create Pages That End The User's Search Journey' & Interview Highlights",
      tag: "Interview",
      date: "Jul 2026",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "Average Bounce Rate Benchmarks: 92 Key Statistics for 2026",
      tag: "Analytics",
      date: "Jul 2026",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "Case Study: How Fello Grew DR 12 to 29 and 2x Boosted Organic Impressions",
      tag: "Case Study",
      date: "Jun 2026",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "How to Promote a Podcast: A Step-by-Step Growth System With Real Examples",
      tag: "Podcasting",
      date: "Jun 2026",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "Thomas Peham: 'AI Search Isn't Just Another Version of SEO' & Expert Insights",
      tag: "AI & SEO",
      date: "May 2026",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
    },
  ];

  const faqs = [
    {
      q: "What is guest posting and how does MediaHub work?",
      a: "Guest posting is publishing articles on third-party blogs or news sites to build high-quality backlinks and reach new audiences. MediaHub connects advertisers with over 150,000+ verified publishers, providing secure escrow, automated post tracking, and real-time metric filtering.",
    },
    {
      q: "What guarantees do I get for content placement?",
      a: "We guarantee link insertion, indexing verification, and link retention. If a publisher removes your link or fails to complete the order according to requirements, our escrow system refunds your funds automatically.",
    },
    {
      q: "Can I filter platforms by Ahrefs DR, Moz DA, and GA Traffic?",
      a: "Yes! MediaHub provides 20+ granular metrics filters including Ahrefs Domain Rating (DR), Moz Domain Authority (DA), Semrush Authority Score, Google Analytics real traffic, language, target country, and content category.",
    },
    {
      q: "How does the escrow payment system protect my order?",
      a: "Your payment is held securely in escrow when you place an order. Funds are released to the publisher only after the post is live, checked for requirements, and verified by our system.",
    },
    {
      q: "How can I join as a Publisher or Content Creator?",
      a: "Publishers can sign up for free, submit their website domain, set their custom prices for guest posts or link insertions, and start receiving pre-paid order requests from global advertisers.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#112C3E] font-sans antialiased selection:bg-[#F59E0B] selection:text-white">
      {/* ─────────────────────────────────────────────
         1. DYNAMIC HEADER
         ───────────────────────────────────────────── */}
      <PublicHeader activePage="home" />

      {/* ─────────────────────────────────────────────
         2. HERO SECTION
         ───────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Main Hero Copy */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-[76px] font-extrabold leading-[1.03] tracking-tight text-[#112C3E] font-space">
                <span className="text-[#F59E0B]">Digital PR</span> &<br />
                Blog & Guest Posting Service
              </h1>

              <div className="space-y-3.5 text-lg sm:text-xl text-[#677F9B]">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-6 h-6 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706] font-bold text-sm">
                    ✓
                  </div>
                  <span className="font-semibold text-[#112C3E]">SEO, PR Distribution & Blog Posting</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-6 h-6 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706] font-bold text-sm">
                    ✓
                  </div>
                  <span className="font-semibold text-[#112C3E]">Turn your content into revenue!</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#112C3E] text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#F59E0B] transition shadow-xl group"
                >
                  <span>Sign Up for Free</span>
                  <div className="w-9 h-9 rounded-full bg-[#F59E0B] flex items-center justify-center group-hover:rotate-45 transition-transform text-white">
                    <ArrowUpRightIcon className="w-5 h-5 text-white" />
                  </div>
                </Link>
              </div>

              <div className="pt-6 flex items-center justify-center lg:justify-start gap-3 text-sm font-medium text-[#677F9B]">
                <div className="w-7 h-11 rounded-full border-2 border-[#677F9B] flex items-start justify-center p-1">
                  <div className="w-1.5 h-3 bg-[#677F9B] rounded-full animate-bounce mt-1"></div>
                </div>
                <span>Scroll down to learn more</span>
              </div>
            </div>

            {/* Right Metrics Cards */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl border border-[#EAF1F6] relative space-y-8">
                {/* Metric 1 */}
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FEF3C7] text-[#D97706] rounded-full text-xs font-bold">
                    <span>+500</span> added monthly
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl sm:text-6xl font-extrabold text-[#112C3E] tracking-tight">5k</span>
                    <span className="text-2xl font-semibold text-[#112C3E]">Verified Websites</span>
                  </div>
                </div>

                <hr className="border-[#EAF1F6]" />

                {/* Metric 2 */}
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FEF3C7] text-[#D97706] rounded-full text-xs font-bold">
                    <span>99%</span> Satisfaction
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl sm:text-6xl font-extrabold text-[#112C3E] tracking-tight">1.2k</span>
                    <span className="text-xl sm:text-2xl font-semibold text-[#112C3E] leading-snug">
                      Active Campaigns<br />& Client Reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Demo Call Banner */}
          <div className="mt-16 pt-8 border-t border-[#EAF1F6] flex flex-col sm:flex-row items-center justify-between gap-6 bg-white rounded-3xl p-6 sm:px-10 border border-[#EAF1F6] shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-base sm:text-lg font-semibold text-[#112C3E]">We'll help you get started with MediaHub.</p>
              <p className="text-sm font-bold text-[#F59E0B]">Schedule a demo call with our experts.</p>
            </div>
            <button
              onClick={() => {
                setDemoCallModalOpen(true);
                setDemoCallSuccess(false);
                setDemoCallError("");
              }}
              className="px-6 py-3 rounded-full border-2 border-[#112C3E] text-[#112C3E] hover:bg-[#112C3E] hover:text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>Book Demo Call</span>
            </button>
          </div>
        </div>
      </section>

      {/* Book Demo Call Modal */}
      {demoCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative text-[#112C3E] text-left">
            <button
              onClick={() => setDemoCallModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {!demoCallSuccess ? (
              <>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-xl mb-1">
                    📞
                  </div>
                  <h3 className="text-2xl font-extrabold font-space">
                    Schedule a Demo Call
                  </h3>
                  <p className="text-sm text-[#677F9B]">
                    Our platform specialists will reach out to discuss your campaign goals.
                  </p>
                </div>

                <form onSubmit={handleDemoCallSubmit} className="space-y-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9490056002"
                      value={demoCallForm.phone}
                      onChange={(e) => setDemoCallForm({ ...demoCallForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
                    />
                  </div>

                  {/* Gmail / Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                      Gmail / Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@gmail.com"
                      value={demoCallForm.email}
                      onChange={(e) => setDemoCallForm({ ...demoCallForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
                    />
                  </div>

                  {/* Reason for Call */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                      Reason for Demo Call <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Interested in guest posting inventory for tech blogs..."
                      value={demoCallForm.reason}
                      onChange={(e) => setDemoCallForm({ ...demoCallForm, reason: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
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
                    className="w-full py-3.5 rounded-full bg-[#112C3E] text-white font-bold text-sm hover:bg-[#F59E0B] transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{demoCallSubmitting ? "Submitting..." : "Confirm & Book Call"}</span>
                    <span>→</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-[#FEF3C7] text-[#D97706] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-extrabold font-space">
                  Demo Call Request Sent!
                </h3>
                <p className="text-sm text-[#677F9B]">
                  Thank you! We have received your call request at <span className="font-bold text-[#112C3E]">{demoCallForm.email}</span> and will call <span className="font-bold text-[#112C3E]">{demoCallForm.phone}</span> shortly.
                </p>
                <button
                  onClick={() => setDemoCallModalOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#112C3E] text-white font-semibold text-sm hover:bg-[#F59E0B] transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
         3. PROCESS & AUTOMATION CARDS SECTION
         ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#F4F7F9]">
        <div className="max-w-[1240px] mx-auto px-6">
          <h2 className="text-3xl sm:text-[42px] font-bold text-center text-[#112c3e] tracking-tight mb-16 font-space">
            The Fast, Friendly & Secure Guest Posting Process
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Card 1: 150K+ Platforms */}
            <div className="bg-white rounded-[40px] p-10 lg:p-12 shadow-sm border border-[#eaf1f6] flex flex-col justify-between min-h-[520px]">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-[30px] font-bold text-[#112c3e] leading-snug tracking-tight font-space">
                  Choose from 150K+ Platforms<br />and Filter by Actual Metrics
                </h3>
              </div>

              {/* Graphic Mockup */}
              <div className="relative h-[280px] bg-[#F5F8FA] rounded-3xl border border-[#eaf1f6] mt-8 flex items-center justify-center overflow-hidden">
                <div className="absolute top-6 left-6 right-6 h-[54px] rounded-2xl border border-[#dcdce5] bg-white px-5 flex items-center justify-between shadow-sm">
                  <div className="w-4 h-4 rounded-full border-2 border-[#112c3e] opacity-35"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-[#112c3e] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#112c3e] rounded-full"></div>
                  </div>
                </div>

                <div className="absolute z-10 w-[72px] h-[72px] rounded-full bg-[#677f9b] flex items-center justify-center shadow-lg border-4 border-white text-white">
                  <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                    <path d="M3 4h18v2L14 12v7l-4 3v-10L3 6V4z" />
                  </svg>
                </div>

                <div className="absolute left-8 bottom-24 w-[64px] h-[64px] rounded-full bg-white shadow-md border border-[#eaf1f6] flex items-center justify-center text-orange-500 font-extrabold text-2xl">
                  a
                </div>
                <div className="absolute right-16 top-24 w-[58px] h-[58px] rounded-full bg-white shadow-md border border-[#eaf1f6] flex items-center justify-center text-red-500 font-bold text-lg">
                  🔥
                </div>
                <div className="absolute left-28 bottom-6 w-[72px] h-[72px] rounded-full bg-white shadow-md border border-[#eaf1f6] flex items-center justify-center text-[#F59E0B] font-bold text-sm tracking-tight">
                  MOZ
                </div>
                <div className="absolute right-8 bottom-12 w-[56px] h-[56px] rounded-full bg-white shadow-md border border-[#eaf1f6] flex items-center justify-center text-amber-500 font-bold text-lg">
                  📊
                </div>
              </div>
            </div>

            {/* Card 2: Custom Organization */}
            <div className="bg-white rounded-[40px] p-10 lg:p-12 shadow-sm border border-[#eaf1f6] flex flex-col justify-between min-h-[520px] relative overflow-hidden">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-[30px] font-bold text-[#112c3e] leading-snug tracking-tight font-space">
                  Custom Organization of<br />Interfaces
                </h3>
                <ul className="space-y-2.5 pt-2 text-[#677f9b] text-base font-semibold">
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#369f17] font-extrabold text-sm">✓</span>
                    <span>Custom Website Lists</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#369f17] font-extrabold text-sm">✓</span>
                    <span>Custom Inventory Metrics</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#369f17] font-extrabold text-sm">✓</span>
                    <span>Set & Create Filter Subscriptions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#369f17] font-extrabold text-sm">✓</span>
                    <span>Import / Export Data</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 space-y-3 relative z-10">
                <button className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl border border-[#dcdce5] text-xs font-semibold text-[#677f9b] bg-white hover:bg-[#f4f7f9] transition">
                  <span>🔔</span> Notify about new sites
                </button>

                <div className="space-y-2.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-3.5 rounded-xl border border-[#eaf1f6] flex items-center justify-between shadow-sm">
                      <span className="text-xs font-bold text-[#F59E0B]">https://</span>
                      <div className="w-[120px] sm:w-[160px] h-2 bg-[#F59E0B] rounded-full mx-2"></div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#FEF3C7] inline-block"></span>
                        <span className="w-5 h-5 rounded-full bg-[#FEF3C7] inline-block"></span>
                        <span className="text-amber-400 text-sm">★</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Timeline Check */}
          <div className="max-w-[700px] bg-white rounded-[40px] p-10 lg:p-12 shadow-sm border border-[#eaf1f6] min-h-[460px] mx-auto flex flex-col justify-between">
            <div className="space-y-4 mb-6 text-center">
              <h3 className="text-2xl sm:text-[30px] font-bold text-[#112c3e] tracking-tight font-space">
                Automatic Content Check after<br />Guest Post Publication
              </h3>
            </div>

            <div className="relative border-t border-[#eaf1f6] pt-10 pb-4">
              <div className="flex justify-between text-xs text-[#677f9b] font-semibold mb-6 px-2">
                <span>1 Jan</span>
                <span>10 Jan</span>
                <span className="relative z-10 px-2.5 py-1 bg-[#F59E0B] text-white rounded-full text-[10px] font-bold">15 Jan</span>
                <span>20 Jan</span>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex">
                  <div className="bg-[#FEF3C7] text-[#D97706] font-bold text-xs py-2 px-4 rounded-full flex items-center gap-1.5 shadow-sm ml-2">
                    <span>✓</span> Post checked
                  </div>
                </div>
                <div className="flex justify-center pr-12">
                  <div className="bg-[#FEF3C7] text-[#D97706] font-bold text-xs py-2 px-4 rounded-full shadow-sm">
                    Google Index Control
                  </div>
                </div>
                <div className="flex justify-end pr-16">
                  <div className="bg-[#FEF3C7] text-[#D97706] font-bold text-xs py-2 px-4 rounded-full shadow-sm">
                    Post check
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#FEF3C7] text-[#D97706] font-bold text-xs py-2 px-4 rounded-full shadow-sm mr-8">
                    Google Index Control
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center justify-between gap-6 pl-8 pr-4 py-4 rounded-full bg-[#112c3e] text-white font-bold text-[16px] hover:bg-[#F59E0B] transition group shadow-lg"
            >
              <span>Place Guest Posts Securely</span>
              <div className="w-10 h-10 rounded-full bg-[#8cf08a] flex items-center justify-center text-[#112c3e] group-hover:rotate-45 transition-transform">
                <ArrowUpRightIcon className="w-5 h-5 text-[#112c3e]" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         4. WHAT YOU GET GRID (6 CARDS)
         ───────────────────────────────────────────── */}
      <section className="py-20 bg-[#F4F7F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-center text-[#112C3E] font-space">
            What You Get with MediaHub Blog Posting Service
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="bg-[#8CF08A] rounded-3xl p-8 flex flex-col justify-between min-h-[280px] text-[#112C3E]">
              <div className="w-14 h-14 rounded-2xl bg-[#112C3E] text-white flex items-center justify-center">
                <ChartBarIcon className="w-7 h-7" />
              </div>
              <div className="space-y-2 mt-8">
                <h3 className="text-2xl font-bold font-space">Moz DA, Ahrefs DR, GA Traffic</h3>
                <p className="text-sm font-medium opacity-85">
                  All the needed professional metrics for better posts placement & SEO results
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-[#8CF08A] rounded-3xl p-8 flex flex-col justify-between min-h-[280px] text-[#112C3E]">
              <div className="w-14 h-14 rounded-2xl bg-[#112C3E] text-white flex items-center justify-center">
                <ShieldCheckIcon className="w-7 h-7" />
              </div>
              <div className="space-y-2 mt-8">
                <h3 className="text-2xl font-bold font-space">Guarantees for advertisers</h3>
                <p className="text-sm font-medium opacity-85">
                  MediaHub monitors the presence of links and provides total task execution control
                </p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-[#8CF08A] rounded-3xl p-8 flex flex-col justify-between min-h-[280px] text-[#112C3E]">
              <div className="w-14 h-14 rounded-2xl bg-[#112C3E] text-white flex items-center justify-center">
                <HandThumbUpIcon className="w-7 h-7" />
              </div>
              <div className="space-y-2 mt-8">
                <h3 className="text-2xl font-bold font-space">Your feedback turned into features</h3>
                <p className="text-sm font-medium opacity-85">
                  We are always happy to hear your feedback that directly influences what features we build
                </p>
              </div>
            </div>

            {/* Box 4 */}
            <div className="bg-[#8CF08A] rounded-3xl p-8 flex flex-col justify-between min-h-[280px] text-[#112C3E]">
              <div className="w-14 h-14 rounded-2xl bg-[#112C3E] text-white flex items-center justify-center">
                <PencilSquareIcon className="w-7 h-7" />
              </div>
              <div className="space-y-2 mt-8">
                <h3 className="text-2xl font-bold font-space">Content placement</h3>
                <p className="text-sm font-medium opacity-85">
                  Easily place your content on chosen sites with real traffic and active audience
                </p>
              </div>
            </div>

            {/* Box 5 */}
            <div className="bg-[#8CF08A] rounded-3xl p-8 flex flex-col justify-between min-h-[280px] text-[#112C3E]">
              <div className="w-14 h-14 rounded-2xl bg-[#112C3E] text-white flex items-center justify-center">
                <SparklesIcon className="w-7 h-7" />
              </div>
              <div className="space-y-2 mt-8">
                <h3 className="text-2xl font-bold font-space">Secure choice of websites</h3>
                <p className="text-sm font-medium opacity-85">
                  20+ filters with SEO, internal, and product performance metrics
                </p>
              </div>
            </div>

            {/* Box 6 */}
            <div className="bg-[#8CF08A] rounded-3xl p-8 flex flex-col justify-between min-h-[280px] text-[#112C3E]">
              <div className="w-14 h-14 rounded-2xl bg-[#112C3E] text-white flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-7 h-7" />
              </div>
              <div className="space-y-2 mt-8">
                <h3 className="text-2xl font-bold font-space">Prompt & quality support</h3>
                <p className="text-sm font-medium opacity-85">
                  Team of professionals ready to solve any issue effectively or guide you through our solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         5. AWARDS MARQUEE TICKER (NAVY BANNER)
         ───────────────────────────────────────────── */}
      <section className="bg-[#112C3E] py-20 text-white overflow-hidden relative select-none w-full">
        <div className="w-full text-center space-y-10">
          <div className="flex items-center justify-center gap-2 text-[#f5a723] font-medium text-lg sm:text-xl">
            <span className="text-2xl">🌾</span>
            <h2 className="text-[#f4f7f9] font-bold text-3xl sm:text-[40px] tracking-tight font-space">Our Awards</h2>
            <span className="text-2xl">🌾</span>
          </div>

          <div className="space-y-6 pt-2 relative w-full">
            {/* Row 1: Left Marquee */}
            <div className="w-full overflow-hidden whitespace-nowrap flex py-1">
              <div className="flex gap-8 items-center text-3xl sm:text-5xl lg:text-[58px] font-black tracking-normal animate-marquee-left leading-none uppercase">
                <span className="text-stroke font-space">GROWTH STORIES SUMMIT & AWARDS</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-[#8CF08A] text-base font-extrabold text-[#8CF08A] normal-case">
                  🏆 Hyderabad 2026
                </span>
                <span className="text-white font-space">EXCELLENCE IN MEDIA MARKETING</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-[#8CF08A] text-base font-extrabold text-[#8CF08A] normal-case">
                  🏆 Hyderabad 2026
                </span>
                <span className="text-stroke font-space">GROWTH STORIES SUMMIT & AWARDS</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-[#8CF08A] text-base font-extrabold text-[#8CF08A] normal-case">
                  🏆 Hyderabad 2026
                </span>
              </div>
            </div>

            {/* Row 2: Right Marquee */}
            <div className="w-full overflow-hidden whitespace-nowrap flex py-1">
              <div className="flex gap-8 items-center text-3xl sm:text-5xl lg:text-[58px] font-black tracking-normal animate-marquee-right leading-none uppercase">
                <span className="text-white font-space">MEDTECH & HEALTHCARE SUMMIT AWARDS</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-yellow-400 text-base font-extrabold text-yellow-400 normal-case">
                  ⭐ Hyd 2026
                </span>
                <span className="text-stroke font-space">OUTSTANDING DIGITAL PLATFORM</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-yellow-400 text-base font-extrabold text-yellow-400 normal-case">
                  ⭐ Hyd 2026
                </span>
                <span className="text-white font-space">MEDTECH & HEALTHCARE SUMMIT AWARDS</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-yellow-400 text-base font-extrabold text-yellow-400 normal-case">
                  ⭐ Hyd 2026
                </span>
              </div>
            </div>

            {/* Row 3: Left Marquee */}
            <div className="w-full overflow-hidden whitespace-nowrap flex py-1">
              <div className="flex gap-8 items-center text-3xl sm:text-5xl lg:text-[58px] font-black tracking-normal animate-marquee-left leading-none uppercase">
                <span className="text-stroke font-space">GROWTH STORIES SUMMIT & AWARDS</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-sky-400 text-base font-extrabold text-sky-400 normal-case">
                  🌟 Goa 2026
                </span>
                <span className="text-white font-space">BEST CONTENT DISTRIBUTION PLATFORM</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-sky-400 text-base font-extrabold text-sky-400 normal-case">
                  🌟 Goa 2026
                </span>
                <span className="text-stroke font-space">GROWTH STORIES SUMMIT & AWARDS</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-sky-400 text-base font-extrabold text-sky-400 normal-case">
                  🌟 Goa 2026
                </span>
              </div>
            </div>

            {/* Row 4: Right Marquee */}
            <div className="w-full overflow-hidden whitespace-nowrap flex py-1">
              <div className="flex gap-8 items-center text-3xl sm:text-5xl lg:text-[58px] font-black tracking-normal animate-marquee-right leading-none uppercase">
                <span className="text-white font-space">GRAND HOSPITALITY & TOURISM SUMMIT AWARDS</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-amber-400 text-base font-extrabold text-amber-400 normal-case">
                  🎖️ Goa 2026
                </span>
                <span className="text-stroke font-space">OUTSTANDING PR & BRAND RECOGNITION</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-amber-400 text-base font-extrabold text-amber-400 normal-case">
                  🎖️ Goa 2026
                </span>
                <span className="text-white font-space">GRAND HOSPITALITY & TOURISM SUMMIT AWARDS</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-amber-400 text-base font-extrabold text-amber-400 normal-case">
                  🎖️ Goa 2026
                </span>
              </div>
            </div>

            {/* Row 5: Left Marquee */}
            <div className="w-full overflow-hidden whitespace-nowrap flex py-1">
              <div className="flex gap-8 items-center text-3xl sm:text-5xl lg:text-[58px] font-black tracking-normal animate-marquee-left leading-none uppercase">
                <span className="text-stroke font-space">GROWTH STORIES SUMMIT & AWARDS</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-emerald-400 text-base font-extrabold text-emerald-400 normal-case">
                  ✨ Dubai 2026
                </span>
                <span className="text-white font-space">GLOBAL MEDIA INNOVATION AWARD</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-emerald-400 text-base font-extrabold text-emerald-400 normal-case">
                  ✨ Dubai 2026
                </span>
                <span className="text-stroke font-space">GROWTH STORIES SUMMIT & AWARDS</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-emerald-400 text-base font-extrabold text-emerald-400 normal-case">
                  ✨ Dubai 2026
                </span>
              </div>
            </div>

            {/* Row 6: Right Marquee */}
            <div className="w-full overflow-hidden whitespace-nowrap flex py-1">
              <div className="flex gap-8 items-center text-3xl sm:text-5xl lg:text-[58px] font-black tracking-normal animate-marquee-right leading-none uppercase">
                <span className="text-white font-space">MEDIAHUB GLOBAL PUBLISHER MARKETPLACE</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-[#8CF08A] text-base font-extrabold text-[#8CF08A] normal-case">
                  🌍 International Winner
                </span>
                <span className="text-stroke font-space">TOP DIGITAL PR PLATFORM 2026</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-yellow-400 text-base font-extrabold text-yellow-400 normal-case">
                  ⚡ Excellence Award
                </span>
                <span className="text-white font-space">MEDIAHUB GLOBAL PUBLISHER MARKETPLACE</span>
                <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-[#8CF08A] text-base font-extrabold text-[#8CF08A] normal-case">
                  🌍 International Winner
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         6. METRICS DASHBOARD CAROUSEL
         ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#F4F7F9]">
        <div className="max-w-[1240px] mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-[44px] font-bold text-[#112c3e] leading-tight tracking-tight font-space max-w-2xl mx-auto">
              Choose Sites<br />by Actual Metrics &<br />Submit a Guest Post
            </h2>
            <div className="inline-flex items-center gap-2.5 px-6 py-2 bg-[#8CF08A] text-[#112c3e] rounded-full text-sm font-bold shadow-sm">
              <span>With automatic WhatsApp/email inventory updates reminder</span>
              <span className="w-2.5 h-2.5 bg-[#112c3e] rounded-full inline-block animate-ping"></span>
            </div>
          </div>

          <div className="max-w-[900px] mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="px-6 py-3 rounded-full bg-[#F59E0B] text-white font-bold text-base tracking-wide shadow-md">
                {metricDomains[activeMetricDomain].url}
              </span>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {metricDomains.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMetricDomain(idx)}
                      className={`w-3 h-3 rounded-full transition ${activeMetricDomain === idx ? "bg-[#112c3e]" : "bg-[#dcdce5]"}`}
                    />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setActiveMetricDomain((prev) => (prev > 0 ? prev - 1 : metricDomains.length - 1))}
                    className="w-9 h-9 rounded-full border border-[#dcdce5] bg-white flex items-center justify-center text-[#677f9b] hover:bg-slate-100 transition shadow-sm font-bold"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setActiveMetricDomain((prev) => (prev < metricDomains.length - 1 ? prev + 1 : 0))}
                    className="w-9 h-9 rounded-full border border-[#dcdce5] bg-white flex items-center justify-center text-[#677f9b] hover:bg-slate-100 transition shadow-sm font-bold"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-7 border border-[#eaf1f6] text-center shadow-sm flex flex-col justify-center min-h-[140px]">
                <span className="text-4xl font-extrabold text-[#112c3e] tracking-tight font-space">{metricDomains[activeMetricDomain].ahrefsTraffic}</span>
                <span className="text-xs font-bold text-[#677f9b] mt-1 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <span className="text-orange-500 font-bold">a</span> Ahrefs Organic Traffic
                </span>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-[#eaf1f6] text-center shadow-sm flex flex-col justify-center min-h-[140px]">
                <span className="text-4xl font-extrabold text-[#112c3e] tracking-tight font-space">{metricDomains[activeMetricDomain].similarwebTraffic}</span>
                <span className="text-xs font-bold text-[#677f9b] mt-1 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <span className="text-[#F59E0B]">◑</span> Similarweb Traffic
                </span>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-[#eaf1f6] text-center shadow-sm flex flex-col justify-center min-h-[140px]">
                <span className="text-4xl font-extrabold text-[#112c3e] tracking-tight font-space">{metricDomains[activeMetricDomain].mozDa}</span>
                <span className="text-xs font-bold text-[#677f9b] mt-1 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <span className="text-[#F59E0B] font-bold">M</span> Moz Domain Authority
                </span>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-[#eaf1f6] text-center shadow-sm flex flex-col justify-center min-h-[140px]">
                <span className="text-4xl font-extrabold text-[#112c3e] tracking-tight font-space">{metricDomains[activeMetricDomain].semrushScore}</span>
                <span className="text-xs font-bold text-[#677f9b] mt-1 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <span className="text-red-500 font-bold">🔥</span> Semrush Authority Score
                </span>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-[#eaf1f6] text-center shadow-sm flex flex-col justify-center min-h-[140px]">
                <span className="text-4xl font-extrabold text-[#112c3e] tracking-tight font-space">{metricDomains[activeMetricDomain].ahrefsDr}</span>
                <span className="text-xs font-bold text-[#677f9b] mt-1 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <span className="text-orange-500 font-bold">a</span> Ahrefs Domain Rank
                </span>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-[#eaf1f6] text-center shadow-sm flex flex-col justify-center min-h-[140px]">
                <span className="text-[26px] font-extrabold text-[#112c3e] tracking-tight font-space">{metricDomains[activeMetricDomain].language}</span>
                <span className="text-xs font-bold text-[#677f9b] mt-1 uppercase tracking-wide">Language</span>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-[#eaf1f6] text-center shadow-sm flex flex-col justify-center items-center min-h-[140px]">
                <div className="flex gap-4 items-center">
                  {metricDomains[activeMetricDomain].countries.map((c, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-2xl">{c.flag}</span>
                      <span className="text-[10px] text-[#677f9b] mt-0.5 font-bold">{c.code}</span>
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold text-[#677f9b] mt-2 uppercase tracking-wide">Countries</span>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-[#eaf1f6] text-center shadow-sm flex flex-col justify-center md:col-span-2 min-h-[140px]">
                <span className="text-xl font-extrabold text-[#112c3e] tracking-tight font-space">
                  {metricDomains[activeMetricDomain].categories}
                </span>
                <span className="text-xs font-bold text-[#677f9b] mt-1.5 uppercase tracking-wide">Category Matching</span>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Link
                href="/register"
                className="inline-flex items-center gap-6 pl-8 pr-4 py-3.5 rounded-full bg-[#112c3e] text-white font-bold text-[15px] hover:bg-[#F59E0B] transition group shadow-md"
              >
                <span>Get started</span>
                <div className="w-9 h-9 rounded-full bg-[#F59E0B] flex items-center justify-center text-white group-hover:rotate-45 transition-transform">
                  <ArrowUpRightIcon className="w-4 h-4 text-white" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         7. INTERNATIONAL PLATFORMS
         ───────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-[#eaf1f6]">
        <div className="max-w-[1240px] mx-auto px-6 space-y-12">
          <div className="text-center">
            <h2 className="text-3xl sm:text-[40px] font-bold text-[#112c3e] tracking-tight font-space">
              Fast-Growing International Platforms
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-[#F5F8FA] rounded-3xl p-7 border border-[#eaf1f6] space-y-3 shadow-sm">
              <div className="flex gap-2 text-3xl">🇺🇸 🇨🇦</div>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-[#112c3e] text-lg font-space">United States</h3>
                  <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full">+10k last month</span>
                </div>
                <p className="font-bold text-[#112c3e] text-lg font-space">Canada</p>
                <p className="text-xs font-bold text-[#677f9b] uppercase tracking-wider mt-2">North America</p>
              </div>
            </div>

            <div className="bg-[#F5F8FA] rounded-3xl p-7 border border-[#eaf1f6] space-y-3 shadow-sm">
              <div className="flex gap-1.5 text-3xl">🇬🇧 🇪🇸 🇮🇹 🇩🇪 🇫🇷</div>
              <div>
                <h3 className="font-bold text-[#112c3e] text-base leading-snug font-space">
                  United Kingdom, Germany, France, Italy, Spain
                </h3>
                <p className="text-xs font-bold text-[#677f9b] uppercase tracking-wider mt-2">Europe</p>
              </div>
            </div>

            <div className="bg-[#F5F8FA] rounded-3xl p-7 border border-[#eaf1f6] space-y-3 shadow-sm">
              <div className="flex gap-3 text-3xl">🇦🇪 🇦🇺</div>
              <div>
                <h3 className="font-bold text-[#112c3e] text-lg font-space">UAE & Australia</h3>
                <p className="text-xs font-bold text-[#677f9b] uppercase tracking-wider mt-2">Asia & Oceania</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         8. FREE GIFT (SEO CHECKLIST) SECTION
         ───────────────────────────────────────────── */}
      <section className="py-20 bg-[#112C3E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <h2 className="text-3xl sm:text-5xl font-extrabold font-space">
                We have <br />
                <span className="text-[#F59E0B]">a Free Gift for you</span>
              </h2>
              <p className="text-lg text-slate-300">
                Sign up to receive our in-depth SEO & Content Placement Checklist.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#F59E0B] hover:bg-[#D97706] font-bold text-white transition shadow-lg"
              >
                <span>Sign Up & Get the Guide</span>
                <ArrowUpRightIcon className="w-5 h-5 text-white" />
              </Link>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-1">
                <div className="text-lg font-bold text-[#F59E0B]">Technical SEO:</div>
                <div className="text-sm text-slate-200">To make sure your site is properly indexed and crawled.</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-1">
                <div className="text-lg font-bold text-[#F59E0B]">On-page SEO:</div>
                <div className="text-sm text-slate-200">To drive highly relevant organic traffic to your key pages.</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-1">
                <div className="text-lg font-bold text-[#F59E0B]">Off-page SEO:</div>
                <div className="text-sm text-slate-200">To prove your website's authority to search engine algorithms.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         9. WHAT OUR CLIENTS SAY (REVIEWS SECTION)
         ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#F4F7F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-[#112C3E] font-space">
              What Our Clients Say
            </h2>
            <div className="flex items-center justify-center gap-2 text-amber-500">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-6 h-6 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-lg text-[#112C3E]">4.9</span>
              <span className="text-sm font-medium text-[#677F9B]">rating of 82+ verified Google & Trustpilot reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientReviews.map((rev, idx) => (
              <div key={idx} className="bg-white p-7 rounded-3xl border border-[#EAF1F6] shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-white font-bold flex items-center justify-center text-sm">
                        {rev.initials}
                      </div>
                      <div>
                        <div className="font-bold text-[#112C3E] text-base font-space">{rev.name}</div>
                        <div className="text-xs text-[#677F9B]">{rev.reviewsCount}</div>
                      </div>
                    </div>
                    <span className="text-xs text-[#677F9B]">{rev.timeAgo}</span>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4" />
                    ))}
                  </div>

                  <p className="text-sm text-[#112C3E] leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Rating Badges Row */}
          <div className="pt-8 border-t border-[#EAF1F6] flex flex-wrap justify-center items-center gap-6 text-xs font-bold text-[#112C3E]">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#EAF1F6] shadow-sm">
              <span className="text-[#D97706]">★ 4.5/5</span>
              <span>G2 Review</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#EAF1F6] shadow-sm">
              <span className="text-[#D97706]">★ 5.0/5</span>
              <span>SourceForge</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#EAF1F6] shadow-sm">
              <span className="text-[#D97706]">★ 5.0/5</span>
              <span>Slashdot</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#EAF1F6] shadow-sm">
              <span className="text-[#D97706]">★ 4.5/5</span>
              <span>Trustpilot</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         10. HOW OUR PLATFORM WORKS
         ───────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-[#EAF1F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-[#112C3E] font-space">
              How Our Guest Blog Posting Platform Works
            </h2>

            <div className="inline-flex p-1.5 bg-[#F5F8FA] rounded-full border border-[#EAF1F6]">
              <button
                onClick={() => setActiveWorkTab("advertiser")}
                className={`px-8 py-3 rounded-full text-sm font-bold transition ${activeWorkTab === "advertiser" ? "bg-[#112C3E] text-white shadow-md" : "text-[#677F9B]"}`}
              >
                For Advertisers
              </button>
              <button
                onClick={() => setActiveWorkTab("publisher")}
                className={`px-8 py-3 rounded-full text-sm font-bold transition ${activeWorkTab === "publisher" ? "bg-[#112C3E] text-white shadow-md" : "text-[#677F9B]"}`}
              >
                For Publishers
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {activeWorkTab === "advertiser" ? (
              <>
                <div className="bg-[#F5F8FA] p-8 rounded-3xl border border-[#EAF1F6] space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-white font-bold flex items-center justify-center text-lg">1</div>
                  <h3 className="font-bold text-xl text-[#112C3E] font-space">Sign Up</h3>
                  <p className="text-sm text-[#677F9B]">Create your free advertiser account in under 60 seconds.</p>
                </div>
                <div className="bg-[#F5F8FA] p-8 rounded-3xl border border-[#EAF1F6] space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-white font-bold flex items-center justify-center text-lg">2</div>
                  <h3 className="font-bold text-xl text-[#112C3E] font-space">Set Metric Filters</h3>
                  <p className="text-sm text-[#677F9B]">Filter 150k+ platforms by Moz DA, Ahrefs DR, traffic, and category.</p>
                </div>
                <div className="bg-[#F5F8FA] p-8 rounded-3xl border border-[#EAF1F6] space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-white font-bold flex items-center justify-center text-lg">3</div>
                  <h3 className="font-bold text-xl text-[#112C3E] font-space">Select Sites</h3>
                  <p className="text-sm text-[#677F9B]">Choose the best target blogs matching your budget and audience.</p>
                </div>
                <div className="bg-[#F5F8FA] p-8 rounded-3xl border border-[#EAF1F6] space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-white font-bold flex items-center justify-center text-lg">4</div>
                  <h3 className="font-bold text-xl text-[#112C3E] font-space">Publish & Track</h3>
                  <p className="text-sm text-[#677F9B]">Submit your content and get verified backlinks with index guarantees.</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-[#F5F8FA] p-8 rounded-3xl border border-[#EAF1F6] space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold flex items-center justify-center text-lg">1</div>
                  <h3 className="font-bold text-xl text-[#112C3E] font-space">Add Platform</h3>
                  <p className="text-sm text-[#677F9B]">Register your website or blog with verified ownership.</p>
                </div>
                <div className="bg-[#F5F8FA] p-8 rounded-3xl border border-[#EAF1F6] space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold flex items-center justify-center text-lg">2</div>
                  <h3 className="font-bold text-xl text-[#112C3E] font-space">Set Pricing</h3>
                  <p className="text-sm text-[#677F9B]">Define your custom rates for guest posts and link insertions.</p>
                </div>
                <div className="bg-[#F5F8FA] p-8 rounded-3xl border border-[#EAF1F6] space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold flex items-center justify-center text-lg">3</div>
                  <h3 className="font-bold text-xl text-[#112C3E] font-space">Accept Tasks</h3>
                  <p className="text-sm text-[#677F9B]">Review incoming pre-paid order requests from global advertisers.</p>
                </div>
                <div className="bg-[#F5F8FA] p-8 rounded-3xl border border-[#EAF1F6] space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold flex items-center justify-center text-lg">4</div>
                  <h3 className="font-bold text-xl text-[#112C3E] font-space">Earn Money</h3>
                  <p className="text-sm text-[#677F9B]">Get paid directly after post publication & escrow release.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         11. LATEST FROM OUR BLOG
         ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#F4F7F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#112C3E] font-space">
              Latest Blog Articles
            </h2>
            <Link href="/blog" className="px-6 py-2.5 rounded-full border border-[#112C3E] font-bold text-sm text-[#112C3E] hover:bg-[#112C3E] hover:text-white transition">
              View All Posts →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-[#EAF1F6] shadow-sm flex flex-col justify-between group hover:shadow-xl transition duration-300">
                <div className="relative h-48 overflow-hidden bg-[#F5F8FA]">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-[#F59E0B]">
                    {post.tag}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-xs text-[#677F9B] font-semibold">{post.date}</span>
                  <h3 className="font-bold text-lg text-[#112C3E] leading-snug font-space group-hover:text-[#F59E0B] transition">
                    {post.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         12. FAQ ACCORDION SECTION
         ───────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-white border-t border-[#EAF1F6]">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#112C3E] font-space">
              Guest Posting Service FAQ
            </h2>
            <p className="text-base text-[#677F9B] font-medium">Frequently asked questions about guest blogging and MediaHub platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#F5F8FA] rounded-2xl border border-[#EAF1F6] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left font-bold text-lg text-[#112C3E] flex items-center justify-between gap-4 font-space"
                >
                  <span>{faq.q}</span>
                  <span className="text-2xl text-[#F59E0B] font-extrabold">{openFaq === idx ? "−" : "+"}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-[#677F9B] leading-relaxed font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still in doubt consultation box */}
          <div id="contact" className="mt-16 bg-[#112C3E] rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl font-bold font-space">Still in doubt?</h3>
              <p className="text-sm text-slate-300">Claim a free 1-on-1 consultation with our guest blogging experts.</p>
            </div>
            <button
              onClick={() => setCallModalOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#F59E0B] text-white font-bold text-sm hover:bg-[#D97706] transition whitespace-nowrap cursor-pointer shadow-lg"
            >
              Contact Support
            </button>
          </div>

          {/* Contact Support Modal */}
          {callModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full text-left space-y-6 shadow-2xl relative border border-slate-100 text-[#112C3E]">
                <button
                  onClick={() => setCallModalOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-xl">
                    📞
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-space">MediaHub Support</h3>
                    <p className="text-xs text-[#677F9B]">1-on-1 Expert Assistance & Inquiries</p>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  {/* Phone Number Display */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#677F9B]">Direct Helpline</span>
                    <div className="text-2xl font-extrabold text-[#112C3E] font-space tracking-tight">
                      +91 9490056002
                    </div>
                  </div>

                  <hr className="border-slate-200/60" />

                  {/* Timings & Days */}
                  <div className="space-y-2 text-xs text-[#112C3E]">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-[#677F9B]">Operating Hours:</span>
                      <span className="font-bold bg-[#FEF3C7] text-[#D97706] px-2.5 py-0.5 rounded-md">
                        9:00 AM – 6:00 PM (IST)
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-[#677F9B]">Working Days:</span>
                      <span className="font-bold">Monday to Saturday</span>
                    </div>
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-[#677F9B]">Email Support:</span>
                      <span className="font-bold text-[#F59E0B]">contact@thecconnects.com</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#677F9B] leading-relaxed">
                  💡 Call us during working hours for immediate strategy advice, publisher verification, or billing help.
                </p>

                {/* Call Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href="tel:+919490056002"
                    className="flex items-center justify-center gap-2 py-3 bg-[#112C3E] hover:bg-[#F59E0B] text-white font-bold text-xs rounded-xl transition shadow-md"
                  >
                    <PhoneIcon className="w-4 h-4 text-[#F59E0B]" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href="https://wa.me/919490056002"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-md"
                  >
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         13. READY TO GET STARTED SIGN-UP SECTION
         ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#F4F7F9] border-t border-[#eaf1f6] text-center relative select-none">
        <div className="max-w-[700px] mx-auto px-6 space-y-8">
          <h2 className="text-3xl sm:text-[44px] font-bold text-[#112c3e] tracking-tight font-space">
            Ready to Get Started?
          </h2>
          <p className="text-base text-[#677f9b] font-medium leading-relaxed max-w-lg mx-auto">
            Place your content on <span className="text-[#F59E0B] font-bold">quality sites</span> with real traffic. You are one click away!
          </p>

          {ctaError && (
            <div className="max-w-[480px] mx-auto p-3 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl">
              {ctaError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!ctaRobotChecked) {
                setCtaError("Please check the 'I'm not a robot' verification box.");
                return;
              }
              if (!ctaEmail.trim()) {
                setCtaError("Please enter your email address.");
                return;
              }
              setCtaError("");
              window.location.href = `/register?email=${encodeURIComponent(ctaEmail.trim())}`;
            }}
            className="space-y-6"
          >
            <div className="max-w-[480px] mx-auto flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-full border border-[#dcdce5] bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#F59E0B]">
              <input
                type="email"
                required
                placeholder="Your email"
                value={ctaEmail}
                onChange={(e) => {
                  setCtaEmail(e.target.value);
                  if (ctaError) setCtaError("");
                }}
                className="w-full bg-transparent px-5 py-3 outline-none text-[#112c3e] placeholder-[#677f9b] text-[15px]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto whitespace-nowrap bg-[#112c3e] text-white hover:bg-[#F59E0B] transition rounded-full px-7 py-3.5 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Sign Up for Free</span>
                <span>→</span>
              </button>
            </div>

            <div className="flex justify-center">
              <div
                onClick={() => {
                  setCtaRobotChecked(!ctaRobotChecked);
                  if (ctaError) setCtaError("");
                }}
                className={`w-[300px] bg-white rounded-xl border p-3.5 flex items-center justify-between text-left shadow-sm cursor-pointer transition ${ctaRobotChecked ? "border-emerald-500 bg-emerald-50/20" : "border-[#dcdce5]"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="recaptcha-mock"
                    checked={ctaRobotChecked}
                    onChange={(e) => {
                      setCtaRobotChecked(e.target.checked);
                      if (ctaError) setCtaError("");
                    }}
                    className="w-5 h-5 border-[#dcdce5] rounded cursor-pointer accent-emerald-500"
                  />
                  <label htmlFor="recaptcha-mock" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    I'm not a robot
                  </label>
                </div>
                <div className="flex flex-col items-center justify-center text-[8px] text-slate-400">
                  <span className="text-lg">{ctaRobotChecked ? "✅" : "🔄"}</span>
                  <span>reCAPTCHA</span>
                </div>
              </div>
            </div>
          </form>

          <div className="text-xs font-bold text-[#677f9b] uppercase tracking-widest pt-2">
            or continue with
          </div>

          <div className="flex justify-center items-center">
            <button
              onClick={async () => {
                if (!ctaRobotChecked) {
                  setCtaError("Please check the 'I'm not a robot' verification box first.");
                  return;
                }
                setCtaError("");
                try {
                  // Ensure signup_role cookie is cleared so this acts strictly as Sign In
                  document.cookie = "signup_role=; path=/; max-age=0";
                  const { signIn } = await import("next-auth/react");
                  await signIn("google", { callbackUrl: "/auth/oauth-callback" });
                } catch {
                  setCtaError("Failed to initiate Sign in with Google.");
                }
              }}
              className="flex items-center justify-center gap-3 px-8 py-3.5 bg-white border border-[#dcdce5] hover:bg-slate-50 transition rounded-full font-bold text-[15px] text-[#112c3e] shadow-sm cursor-pointer group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
         14. FOOTER
         ───────────────────────────────────────────── */}
      {/* Footer */}
      <PublicFooter />

      {/* Floating Call & Chat Controls */}
      <FloatingSupportWidget />

      <style>{`
        .text-stroke {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.4);
        }
        @keyframes marquee-l {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-r {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-left {
          display: inline-flex;
          animation: marquee-l 25s linear infinite;
          width: max-content;
        }
        .animate-marquee-right {
          display: inline-flex;
          animation: marquee-r 25s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}
