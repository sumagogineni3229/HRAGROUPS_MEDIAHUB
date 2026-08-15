"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DEFAULT_HOME_PAGE_CONTENT,
  DEFAULT_SOLUTIONS_PAGE_CONTENT,
  DEFAULT_FAQ_PAGE_CONTENT,
  DEFAULT_CONTACT_PAGE_CONTENT,
  DEFAULT_MEDIAKIT_PAGE_CONTENT,
  DEFAULT_PODCAST_SPONSORSHIP_PAGE_CONTENT,
  DEFAULT_PRIVACY_PAGE_CONTENT,
  DEFAULT_TERMS_PAGE_CONTENT,
  DEFAULT_BLOG_PAGE_CONTENT,
  HomePageContent,
  SolutionsPageContent,
  FaqPageContent,
  ContactPageContent,
  MediaKitPageContent,
  PodcastSponsorshipPageContent,
  PrivacyPageContent,
  TermsPageContent,
  BlogPageContent,
} from "@/lib/page-content-data";
import {
  CheckCircleIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

type PageKey =
  | "home_page_data"
  | "solutions_page_data"
  | "faq_page_data"
  | "contact_page_data"
  | "mediakit_page_data"
  | "podcast_sponsorship_page_data"
  | "privacy_page_data"
  | "terms_page_data"
  | "blog_page_data";

interface PageSectionConfig {
  key: PageKey;
  category: "Landing & Home" | "Solutions / Marketplace" | "Public Pages" | "PR Suite & Podcasts" | "Legal & Compliance" | "Blog Hub";
  title: string;
  pageUrl: string;
  description: string;
}

const EDITABLE_PAGES: PageSectionConfig[] = [
  {
    key: "home_page_data",
    category: "Landing & Home",
    title: "Landing Page (Home) → All Page Text & Copy",
    pageUrl: "/",
    description: "Edit hero headline, subheadline, 4 stat metrics, consultation banner, 5 core services, publisher & influencer cards, 4 steps, and CTA banner.",
  },
  {
    key: "solutions_page_data",
    category: "Solutions / Marketplace",
    title: "Solutions / Marketplace → 4 Tabs Complete Content",
    pageUrl: "/solutions",
    description: "Edit all content across Marketing & Growth, For Advertisers, For Brands, and For Agencies (Hero, stats, 4 features, 3 workflow steps, comparison matrix, and CTAs).",
  },
  {
    key: "faq_page_data",
    category: "Public Pages",
    title: "FAQ Page → All 17 Questions & Support Banner",
    pageUrl: "/faq",
    description: "Edit page header, search placeholder, all 5 categories, 17 questions/answers, and 2-line bottom contact banner.",
  },
  {
    key: "contact_page_data",
    category: "Public Pages",
    title: "Contact Us Page → Company Details, Bullets & Banners",
    pageUrl: "/contact",
    description: "Edit 'About MediaHub', questions info, email/phone, agency & brand 7 bullet points each, and form title.",
  },
  {
    key: "mediakit_page_data",
    category: "PR Suite & Podcasts",
    title: "MediaHub Talks & Media Kit → All Sections",
    pageUrl: "/media-kit",
    description: "Edit podcast headlines, guest feature card, 4 timeline items, why exists section, audience roles, and benefits.",
  },
  {
    key: "podcast_sponsorship_page_data",
    category: "PR Suite & Podcasts",
    title: "Podcast Sponsorships & Strategy Library → All Sections",
    pageUrl: "/podcasts/library",
    description: "Edit hero headline, 3 operational pillars, featured technical strategy guide, read time, and buttons.",
  },
  {
    key: "privacy_page_data",
    category: "Legal & Compliance",
    title: "Privacy Policy → Document Sections",
    pageUrl: "/privacy",
    description: "Edit privacy title, last updated timestamp, and section 1-3 headings and legal copy.",
  },
  {
    key: "terms_page_data",
    category: "Legal & Compliance",
    title: "Terms and Conditions → Document Sections",
    pageUrl: "/terms",
    description: "Edit terms title, last updated timestamp, escrow policies, and publisher guarantees.",
  },
  {
    key: "blog_page_data",
    category: "Blog Hub",
    title: "Blog Hub → Headlines & SERP Promo Widget",
    pageUrl: "/blog",
    description: "Edit blog hub headline, and dark SERP rankings promo card text & button.",
  },
];

const CATEGORIES = [
  "All Pages",
  "Landing & Home",
  "Solutions / Marketplace",
  "Public Pages",
  "PR Suite & Podcasts",
  "Legal & Compliance",
  "Blog Hub",
] as const;

export default function EditorPagesPage() {
  const [selectedKey, setSelectedKey] = useState<PageKey>("home_page_data");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Pages");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Structured state stores for all pages
  const [homeData, setHomeData] = useState<HomePageContent>(DEFAULT_HOME_PAGE_CONTENT);
  const [solutionsData, setSolutionsData] = useState<SolutionsPageContent>(DEFAULT_SOLUTIONS_PAGE_CONTENT);
  const [activeSolutionTab, setActiveSolutionTab] = useState<"marketing" | "advertisers" | "brands" | "agencies">("marketing");
  const [faqData, setFaqData] = useState<FaqPageContent>(DEFAULT_FAQ_PAGE_CONTENT);
  const [contactData, setContactData] = useState<ContactPageContent>(DEFAULT_CONTACT_PAGE_CONTENT);
  const [mediakitData, setMediakitData] = useState<MediaKitPageContent>(DEFAULT_MEDIAKIT_PAGE_CONTENT);
  const [podcastData, setPodcastData] = useState<PodcastSponsorshipPageContent>(DEFAULT_PODCAST_SPONSORSHIP_PAGE_CONTENT);
  const [privacyData, setPrivacyData] = useState<PrivacyPageContent>(DEFAULT_PRIVACY_PAGE_CONTENT);
  const [termsData, setTermsData] = useState<TermsPageContent>(DEFAULT_TERMS_PAGE_CONTENT);
  const [blogData, setBlogData] = useState<BlogPageContent>(DEFAULT_BLOG_PAGE_CONTENT);

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isPreview, setIsPreview] = useState<boolean>(false);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    hero: true,
    metrics: true,
    demo: true,
    services: true,
    dual: true,
    steps: true,
    trust: true,
    cta: true,
    solHero: true,
    solStats: true,
    solFeatures: true,
    solSteps: true,
    solComparison: true,
    solCta: true,
  });

  const toggleSection = (s: string) => {
    setOpenSections((prev) => ({ ...prev, [s]: !prev[s] }));
  };

  const activeConfig = EDITABLE_PAGES.find((p) => p.key === selectedKey) || EDITABLE_PAGES[0];

  const filteredPages = EDITABLE_PAGES.filter((p) => {
    const matchesCategory = selectedCategory === "All Pages" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    async function loadPage() {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");
      try {
        const res = await fetch(`/api/cms/page?key=${selectedKey}`);
        if (res.ok) {
          const data = await res.json();
          if (data.html) {
            try {
              const parsed = JSON.parse(data.html);
              if (selectedKey === "home_page_data") setHomeData({ ...DEFAULT_HOME_PAGE_CONTENT, ...parsed });
              if (selectedKey === "solutions_page_data") setSolutionsData({ ...DEFAULT_SOLUTIONS_PAGE_CONTENT, ...parsed });
              if (selectedKey === "faq_page_data") setFaqData({ ...DEFAULT_FAQ_PAGE_CONTENT, ...parsed });
              if (selectedKey === "contact_page_data") setContactData({ ...DEFAULT_CONTACT_PAGE_CONTENT, ...parsed });
              if (selectedKey === "mediakit_page_data") setMediakitData({ ...DEFAULT_MEDIAKIT_PAGE_CONTENT, ...parsed });
              if (selectedKey === "podcast_sponsorship_page_data") setPodcastData({ ...DEFAULT_PODCAST_SPONSORSHIP_PAGE_CONTENT, ...parsed });
              if (selectedKey === "privacy_page_data") setPrivacyData({ ...DEFAULT_PRIVACY_PAGE_CONTENT, ...parsed });
              if (selectedKey === "terms_page_data") setTermsData({ ...DEFAULT_TERMS_PAGE_CONTENT, ...parsed });
              if (selectedKey === "blog_page_data") setBlogData({ ...DEFAULT_BLOG_PAGE_CONTENT, ...parsed });
            } catch (e) {
              console.error("Parse error", e);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [selectedKey]);

  const getCurrentPayload = () => {
    switch (selectedKey) {
      case "home_page_data": return JSON.stringify(homeData);
      case "solutions_page_data": return JSON.stringify(solutionsData);
      case "faq_page_data": return JSON.stringify(faqData);
      case "contact_page_data": return JSON.stringify(contactData);
      case "mediakit_page_data": return JSON.stringify(mediakitData);
      case "podcast_sponsorship_page_data": return JSON.stringify(podcastData);
      case "privacy_page_data": return JSON.stringify(privacyData);
      case "terms_page_data": return JSON.stringify(termsData);
      case "blog_page_data": return JSON.stringify(blogData);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = getCurrentPayload();
      const res = await fetch("/api/cms/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: selectedKey, html: payload }),
      });
      if (!res.ok) throw new Error("Failed to save page content.");
      setSuccessMsg(`"${activeConfig.title}" published successfully! The visual design remains 100% intact.`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save content.");
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = async () => {
    if (!confirm(`Are you sure you want to revert "${activeConfig.title}" to its original default text?`)) return;
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/cms/page?key=${selectedKey}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to revert content.");

      if (selectedKey === "home_page_data") setHomeData(DEFAULT_HOME_PAGE_CONTENT);
      if (selectedKey === "solutions_page_data") setSolutionsData(DEFAULT_SOLUTIONS_PAGE_CONTENT);
      if (selectedKey === "faq_page_data") setFaqData(DEFAULT_FAQ_PAGE_CONTENT);
      if (selectedKey === "contact_page_data") setContactData(DEFAULT_CONTACT_PAGE_CONTENT);
      if (selectedKey === "mediakit_page_data") setMediakitData(DEFAULT_MEDIAKIT_PAGE_CONTENT);
      if (selectedKey === "podcast_sponsorship_page_data") setPodcastData(DEFAULT_PODCAST_SPONSORSHIP_PAGE_CONTENT);
      if (selectedKey === "privacy_page_data") setPrivacyData(DEFAULT_PRIVACY_PAGE_CONTENT);
      if (selectedKey === "terms_page_data") setTermsData(DEFAULT_TERMS_PAGE_CONTENT);
      if (selectedKey === "blog_page_data") setBlogData(DEFAULT_BLOG_PAGE_CONTENT);

      setSuccessMsg(`"${activeConfig.title}" reverted to original default text successfully!`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to revert content.");
    } finally {
      setSaving(false);
    }
  };

  const sol = solutionsData[activeSolutionTab];

  return (
    <div className="w-full space-y-6 font-inter pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[#D97706]">
              <DocumentTextIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold font-space text-slate-900">
              Website Page Content Editor
            </h1>
          </div>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Safely edit all copy across the website while keeping all designs, styling, grids, icons, and gradients 100% preserved.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={activeConfig.pageUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
            title="Open the live public page in a new tab"
          >
            <span>View Live Page</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={handleRevert}
            disabled={saving}
            className="px-3.5 py-2.5 bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 transition disabled:opacity-50 flex items-center gap-1.5"
            title="Cancel edits & restore default text"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
            <span>Revert to Default</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#112C3E] text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            <SparklesIcon className="w-4 h-4 text-[#F59E0B]" />
            <span>{saving ? "Publishing..." : "Publish Page Changes"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl animate-in fade-in">
          {errorMsg}
        </div>
      )}

      {/* Category Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Categories Pill Nav */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (cat !== "All Pages") {
                      const firstPage = EDITABLE_PAGES.find((p) => p.category === cat);
                      if (firstPage) setSelectedKey(firstPage.key);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-[#112C3E] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Live Search */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search editable pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            />
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Clickable Page Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
          {filteredPages.map((p) => {
            const isSelected = selectedKey === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setSelectedKey(p.key)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? "border-[#F59E0B] bg-[#FEF3C7]/40 ring-2 ring-[#F59E0B]/30 shadow-xs"
                    : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isSelected ? "bg-[#112C3E] text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {p.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{p.pageUrl}</span>
                </div>
                <span className={`text-xs font-bold leading-snug ${isSelected ? "text-slate-950" : "text-slate-700"}`}>
                  {p.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Design Protection Notice */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>
            <strong>100% Design Preservation Active:</strong> All text fields for <strong>{activeConfig.title}</strong> are editable below without breaking layout or styling.
          </span>
        </div>
      </div>

      {/* Structured Content Forms */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
          <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-2" />
          Loading page content...
        </div>
      ) : isPreview ? (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 uppercase tracking-wider">
              Preview Mode: {activeConfig.title}
            </span>
            <span className="text-xs text-slate-400">Target URL: {activeConfig.pageUrl}</span>
          </div>
          <p className="text-xs text-slate-500">
            Previewing updated content. Click <strong>"Publish Page Changes"</strong> to apply live or <strong>"View Live Page"</strong> to inspect on the public route.
          </p>
        </div>
      ) : selectedKey === "home_page_data" ? (
        /* ─────────────────────────────────────────────
           1. HOME PAGE STRUCTURED FORM (ALL 8 SECTIONS)
           ───────────────────────────────────────────── */
        <div className="space-y-4">
          {/* Section 1: Hero */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection("hero")}
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
            >
              <span>1. 🌟 Hero Headline, Badge & Subtitle</span>
              {openSections.hero ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {openSections.hero && (
              <div className="p-5 space-y-4 text-xs font-medium border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Top Pill Badge Text</label>
                  <input
                    type="text"
                    value={homeData.heroBadge}
                    onChange={(e) => setHomeData({ ...homeData, heroBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Title Line 1</label>
                    <input
                      type="text"
                      value={homeData.heroTitle1}
                      onChange={(e) => setHomeData({ ...homeData, heroTitle1: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Title Highlight (Gradient)</label>
                    <input
                      type="text"
                      value={homeData.heroTitleHighlight}
                      onChange={(e) => setHomeData({ ...homeData, heroTitleHighlight: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Title Line 2</label>
                    <input
                      type="text"
                      value={homeData.heroTitle2}
                      onChange={(e) => setHomeData({ ...homeData, heroTitle2: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Hero Subheading</label>
                  <textarea
                    rows={2}
                    value={homeData.heroSubtitle}
                    onChange={(e) => setHomeData({ ...homeData, heroSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-slate-600">Button 1 Label</label>
                    <input
                      type="text"
                      value={homeData.btnExplore}
                      onChange={(e) => setHomeData({ ...homeData, btnExplore: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600">Button 2 Label</label>
                    <input
                      type="text"
                      value={homeData.btnPublisher}
                      onChange={(e) => setHomeData({ ...homeData, btnPublisher: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600">Button 3 Label</label>
                    <input
                      type="text"
                      value={homeData.btnInfluencer}
                      onChange={(e) => setHomeData({ ...homeData, btnInfluencer: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600">Button 4 Label</label>
                    <input
                      type="text"
                      value={homeData.btnDemo}
                      onChange={(e) => setHomeData({ ...homeData, btnDemo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Metrics Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection("metrics")}
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
            >
              <span>2. 📊 4 Key Metrics Counters</span>
              {openSections.metrics ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {openSections.metrics && (
              <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium border-t border-slate-100">
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border">
                  <label className="text-slate-700 font-bold block">Metric 1</label>
                  <input type="text" value={homeData.metric1Value} onChange={(e) => setHomeData({ ...homeData, metric1Value: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" placeholder="Value" />
                  <input type="text" value={homeData.metric1Label} onChange={(e) => setHomeData({ ...homeData, metric1Label: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" placeholder="Label" />
                </div>
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border">
                  <label className="text-slate-700 font-bold block">Metric 2</label>
                  <input type="text" value={homeData.metric2Value} onChange={(e) => setHomeData({ ...homeData, metric2Value: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" placeholder="Value" />
                  <input type="text" value={homeData.metric2Label} onChange={(e) => setHomeData({ ...homeData, metric2Label: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" placeholder="Label" />
                </div>
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border">
                  <label className="text-slate-700 font-bold block">Metric 3</label>
                  <input type="text" value={homeData.metric3Value} onChange={(e) => setHomeData({ ...homeData, metric3Value: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" placeholder="Value" />
                  <input type="text" value={homeData.metric3Label} onChange={(e) => setHomeData({ ...homeData, metric3Label: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" placeholder="Label" />
                </div>
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border">
                  <label className="text-slate-700 font-bold block">Metric 4</label>
                  <input type="text" value={homeData.metric4Value} onChange={(e) => setHomeData({ ...homeData, metric4Value: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" placeholder="Value" />
                  <input type="text" value={homeData.metric4Label} onChange={(e) => setHomeData({ ...homeData, metric4Label: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" placeholder="Label" />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Consultation Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection("demo")}
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
            >
              <span>3. 📞 Enterprise Consultation Callout Banner</span>
              {openSections.demo ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {openSections.demo && (
              <div className="p-5 space-y-3 text-xs font-medium border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Banner Headline</label>
                  <input
                    type="text"
                    value={homeData.demoBannerTitle}
                    onChange={(e) => setHomeData({ ...homeData, demoBannerTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-slate-700 font-bold">Banner Subtext (Orange Accent)</label>
                    <input
                      type="text"
                      value={homeData.demoBannerSubtitle}
                      onChange={(e) => setHomeData({ ...homeData, demoBannerSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Button Label</label>
                    <input
                      type="text"
                      value={homeData.demoBannerBtn}
                      onChange={(e) => setHomeData({ ...homeData, demoBannerBtn: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Core Services */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection("services")}
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
            >
              <span>4. 🛠️ Core Services Header & 5 Product Cards</span>
              {openSections.services ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {openSections.services && (
              <div className="p-5 space-y-4 text-xs font-medium border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Badge Text</label>
                    <input
                      type="text"
                      value={homeData.servicesBadge}
                      onChange={(e) => setHomeData({ ...homeData, servicesBadge: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-slate-700 font-bold">Main Services Heading</label>
                    <input
                      type="text"
                      value={homeData.servicesTitle}
                      onChange={(e) => setHomeData({ ...homeData, servicesTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Services Subtitle</label>
                  <input
                    type="text"
                    value={homeData.servicesSubtitle}
                    onChange={(e) => setHomeData({ ...homeData, servicesSubtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-2">
                    <span className="font-bold text-slate-800 block">Link Insertion</span>
                    <input type="text" value={homeData.service1Title} onChange={(e) => setHomeData({ ...homeData, service1Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-semibold" />
                    <textarea rows={3} value={homeData.service1Desc} onChange={(e) => setHomeData({ ...homeData, service1Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-2">
                    <span className="font-bold text-slate-800 block">Guest Posting</span>
                    <input type="text" value={homeData.service2Title} onChange={(e) => setHomeData({ ...homeData, service2Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-semibold" />
                    <textarea rows={3} value={homeData.service2Desc} onChange={(e) => setHomeData({ ...homeData, service2Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-2">
                    <span className="font-bold text-slate-800 block">Content + Post</span>
                    <input type="text" value={homeData.service3Title} onChange={(e) => setHomeData({ ...homeData, service3Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-semibold" />
                    <textarea rows={3} value={homeData.service3Desc} onChange={(e) => setHomeData({ ...homeData, service3Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-2">
                    <span className="font-bold text-slate-800 block">PR Packages</span>
                    <input type="text" value={homeData.service4Title} onChange={(e) => setHomeData({ ...homeData, service4Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-semibold" />
                    <textarea rows={3} value={homeData.service4Desc} onChange={(e) => setHomeData({ ...homeData, service4Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-2">
                    <span className="font-bold text-slate-800 block">Influencer</span>
                    <input type="text" value={homeData.service5Title} onChange={(e) => setHomeData({ ...homeData, service5Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-semibold" />
                    <textarea rows={3} value={homeData.service5Desc} onChange={(e) => setHomeData({ ...homeData, service5Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Dual Split Cards */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection("dual")}
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
            >
              <span>5. 👥 Publishers & Influencers Split Cards</span>
              {openSections.dual ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {openSections.dual && (
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium border-t border-slate-100">
                {/* Publishers Card */}
                <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/80 space-y-3">
                  <span className="font-bold text-amber-900 block text-sm">For Publishers Card</span>
                  <div className="space-y-1">
                    <label className="text-slate-600">Heading</label>
                    <input
                      type="text"
                      value={homeData.pubCardTitle}
                      onChange={(e) => setHomeData({ ...homeData, pubCardTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600">Subtitle</label>
                    <textarea
                      rows={2}
                      value={homeData.pubCardDesc}
                      onChange={(e) => setHomeData({ ...homeData, pubCardDesc: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-600">4 Bullet Points</label>
                    <input
                      type="text"
                      value={homeData.pubCardBullet1}
                      onChange={(e) => setHomeData({ ...homeData, pubCardBullet1: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border rounded text-xs"
                    />
                    <input
                      type="text"
                      value={homeData.pubCardBullet2}
                      onChange={(e) => setHomeData({ ...homeData, pubCardBullet2: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border rounded text-xs"
                    />
                    <input
                      type="text"
                      value={homeData.pubCardBullet3}
                      onChange={(e) => setHomeData({ ...homeData, pubCardBullet3: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border rounded text-xs"
                    />
                    <input
                      type="text"
                      value={homeData.pubCardBullet4}
                      onChange={(e) => setHomeData({ ...homeData, pubCardBullet4: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border rounded text-xs"
                    />
                  </div>
                </div>

                {/* Influencers Card */}
                <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/80 space-y-3">
                  <span className="font-bold text-amber-900 block text-sm">For Influencers Card</span>
                  <div className="space-y-1">
                    <label className="text-slate-600">Heading</label>
                    <input
                      type="text"
                      value={homeData.infCardTitle}
                      onChange={(e) => setHomeData({ ...homeData, infCardTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600">Subtitle</label>
                    <textarea
                      rows={2}
                      value={homeData.infCardDesc}
                      onChange={(e) => setHomeData({ ...homeData, infCardDesc: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-600">4 Bullet Points</label>
                    <input
                      type="text"
                      value={homeData.infCardBullet1}
                      onChange={(e) => setHomeData({ ...homeData, infCardBullet1: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border rounded text-xs"
                    />
                    <input
                      type="text"
                      value={homeData.infCardBullet2}
                      onChange={(e) => setHomeData({ ...homeData, infCardBullet2: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border rounded text-xs"
                    />
                    <input
                      type="text"
                      value={homeData.infCardBullet3}
                      onChange={(e) => setHomeData({ ...homeData, infCardBullet3: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border rounded text-xs"
                    />
                    <input
                      type="text"
                      value={homeData.infCardBullet4}
                      onChange={(e) => setHomeData({ ...homeData, infCardBullet4: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 6: How It Works */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection("steps")}
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
            >
              <span>6. ⚙️ How It Works 4-Step Process & Trust Guarantees</span>
              {openSections.steps ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {openSections.steps && (
              <div className="p-5 space-y-4 text-xs font-medium border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">Section Heading</label>
                  <input
                    type="text"
                    value={homeData.howItWorksTitle}
                    onChange={(e) => setHomeData({ ...homeData, howItWorksTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                    <input type="text" value={homeData.step1Title} onChange={(e) => setHomeData({ ...homeData, step1Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-bold" />
                    <textarea rows={2} value={homeData.step1Desc} onChange={(e) => setHomeData({ ...homeData, step1Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                    <input type="text" value={homeData.step2Title} onChange={(e) => setHomeData({ ...homeData, step2Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-bold" />
                    <textarea rows={2} value={homeData.step2Desc} onChange={(e) => setHomeData({ ...homeData, step2Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                    <input type="text" value={homeData.step3Title} onChange={(e) => setHomeData({ ...homeData, step3Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-bold" />
                    <textarea rows={2} value={homeData.step3Desc} onChange={(e) => setHomeData({ ...homeData, step3Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                    <input type="text" value={homeData.step4Title} onChange={(e) => setHomeData({ ...homeData, step4Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-bold" />
                    <textarea rows={2} value={homeData.step4Desc} onChange={(e) => setHomeData({ ...homeData, step4Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                    <input type="text" value={homeData.trust1Title} onChange={(e) => setHomeData({ ...homeData, trust1Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-bold" />
                    <textarea rows={2} value={homeData.trust1Desc} onChange={(e) => setHomeData({ ...homeData, trust1Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                    <input type="text" value={homeData.trust2Title} onChange={(e) => setHomeData({ ...homeData, trust2Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-bold" />
                    <textarea rows={2} value={homeData.trust2Desc} onChange={(e) => setHomeData({ ...homeData, trust2Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                    <input type="text" value={homeData.trust3Title} onChange={(e) => setHomeData({ ...homeData, trust3Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-bold" />
                    <textarea rows={2} value={homeData.trust3Desc} onChange={(e) => setHomeData({ ...homeData, trust3Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-[11px]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 7: Conversion CTA Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection("cta")}
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
            >
              <span>7. 🚀 Bottom Conversion CTA Banner</span>
              {openSections.cta ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {openSections.cta && (
              <div className="p-5 space-y-3 text-xs font-medium border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">CTA Headline</label>
                  <input
                    type="text"
                    value={homeData.ctaTitle}
                    onChange={(e) => setHomeData({ ...homeData, ctaTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold">CTA Subtitle</label>
                  <input
                    type="text"
                    value={homeData.ctaSubtitle}
                    onChange={(e) => setHomeData({ ...homeData, ctaSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-slate-600">Button 1 Label</label>
                    <input
                      type="text"
                      value={homeData.ctaBtn1}
                      onChange={(e) => setHomeData({ ...homeData, ctaBtn1: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600">Button 2 Label</label>
                    <input
                      type="text"
                      value={homeData.ctaBtn2}
                      onChange={(e) => setHomeData({ ...homeData, ctaBtn2: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : selectedKey === "solutions_page_data" ? (
        /* ─────────────────────────────────────────────
           2. SOLUTIONS PAGE STRUCTURED FORM (ALL CONTENT)
           ───────────────────────────────────────────── */
        <div className="space-y-6">
          {/* Sub-tab selection */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {(["marketing", "advertisers", "brands", "agencies"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSolutionTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition capitalize ${
                  activeSolutionTab === tab ? "bg-[#112C3E] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab === "marketing" ? "Marketing & Growth" : `For ${tab}`}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* Section 1: Hero Section & Guarantees */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection("solHero")}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
              >
                <span>1. 🌟 Hero Section, Buttons & Guarantees ({activeSolutionTab})</span>
                {openSections.solHero ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </button>
              {openSections.solHero && (
                <div className="p-5 space-y-4 text-xs font-medium border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold">Top Pill Badge Text</label>
                      <input
                        type="text"
                        value={sol.badge}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, badge: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-slate-700 font-bold">Hero Headline</label>
                      <input
                        type="text"
                        value={sol.heroHeadline}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, heroHeadline: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Hero Subheadline Paragraph</label>
                    <textarea
                      rows={2}
                      value={sol.heroSubheadline}
                      onChange={(e) => setSolutionsData({
                        ...solutionsData,
                        [activeSolutionTab]: { ...sol, heroSubheadline: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold">Primary Button Label</label>
                      <input
                        type="text"
                        value={sol.btn1Text}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, btn1Text: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold">Secondary Button Label</label>
                      <input
                        type="text"
                        value={sol.btn2Text}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, btn2Text: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-slate-100">
                    <div className="space-y-1">
                      <label className="text-slate-600">Guarantee 1</label>
                      <input
                        type="text"
                        value={sol.guarantee1}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, guarantee1: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600">Guarantee 2</label>
                      <input
                        type="text"
                        value={sol.guarantee2}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, guarantee2: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600">Guarantee 3</label>
                      <input
                        type="text"
                        value={sol.guarantee3}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, guarantee3: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Platform Stats & Overview */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection("solStats")}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
              >
                <span>2. 📊 Marketplace Overview Box & 4 Key Stats</span>
                {openSections.solStats ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </button>
              {openSections.solStats && (
                <div className="p-5 space-y-4 text-xs font-medium border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold">Overview Box Title</label>
                      <input
                        type="text"
                        value={sol.overviewTitle}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, overviewTitle: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold">Overview Box Badge</label>
                      <input
                        type="text"
                        value={sol.overviewBadge}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, overviewBadge: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                      <label className="font-bold">Stat 1</label>
                      <input type="text" value={sol.stat1Value} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, stat1Value: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                      <input type="text" value={sol.stat1Label} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, stat1Label: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                      <label className="font-bold">Stat 2</label>
                      <input type="text" value={sol.stat2Value} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, stat2Value: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                      <input type="text" value={sol.stat2Label} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, stat2Label: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                      <label className="font-bold">Stat 3</label>
                      <input type="text" value={sol.stat3Value} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, stat3Value: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                      <input type="text" value={sol.stat3Label} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, stat3Label: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                      <label className="font-bold">Stat 4</label>
                      <input type="text" value={sol.stat4Value} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, stat4Value: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                      <input type="text" value={sol.stat4Label} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, stat4Label: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: 4 Key Features */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection("solFeatures")}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
              >
                <span>3. 🛠️ Key Features Grid (4 Feature Cards)</span>
                {openSections.solFeatures ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </button>
              {openSections.solFeatures && (
                <div className="p-5 space-y-4 text-xs font-medium border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Section Heading</label>
                    <input
                      type="text"
                      value={sol.featuresHeading}
                      onChange={(e) => setSolutionsData({
                        ...solutionsData,
                        [activeSolutionTab]: { ...sol, featuresHeading: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Section Subtitle</label>
                    <input
                      type="text"
                      value={sol.featuresSubtitle}
                      onChange={(e) => setSolutionsData({
                        ...solutionsData,
                        [activeSolutionTab]: { ...sol, featuresSubtitle: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                      <span className="font-bold text-slate-800">Feature 1</span>
                      <input type="text" value={sol.feat1Title} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, feat1Title: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded font-semibold text-xs" />
                      <textarea rows={2} value={sol.feat1Desc} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, feat1Desc: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                      <span className="font-bold text-slate-800">Feature 2</span>
                      <input type="text" value={sol.feat2Title} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, feat2Title: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded font-semibold text-xs" />
                      <textarea rows={2} value={sol.feat2Desc} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, feat2Desc: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                      <span className="font-bold text-slate-800">Feature 3</span>
                      <input type="text" value={sol.feat3Title} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, feat3Title: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded font-semibold text-xs" />
                      <textarea rows={2} value={sol.feat3Desc} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, feat3Desc: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                      <span className="font-bold text-slate-800">Feature 4</span>
                      <input type="text" value={sol.feat4Title} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, feat4Title: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded font-semibold text-xs" />
                      <textarea rows={2} value={sol.feat4Desc} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, feat4Desc: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Workflow Steps */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection("solSteps")}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
              >
                <span>4. ⚙️ Step-by-Step Workflow (3 Steps)</span>
                {openSections.solSteps ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </button>
              {openSections.solSteps && (
                <div className="p-5 space-y-4 text-xs font-medium border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold">Workflow Badge</label>
                      <input
                        type="text"
                        value={sol.workflowBadge}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, workflowBadge: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-slate-700 font-bold">Workflow Section Heading</label>
                      <input
                        type="text"
                        value={sol.workflowTitle}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, workflowTitle: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                      <span className="font-bold text-slate-800">Step 01</span>
                      <input type="text" value={sol.step1Title} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, step1Title: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded font-semibold text-xs" />
                      <textarea rows={2} value={sol.step1Desc} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, step1Desc: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                      <span className="font-bold text-slate-800">Step 02</span>
                      <input type="text" value={sol.step2Title} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, step2Title: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded font-semibold text-xs" />
                      <textarea rows={2} value={sol.step2Desc} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, step2Desc: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                      <span className="font-bold text-slate-800">Step 03</span>
                      <input type="text" value={sol.step3Title} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, step3Title: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded font-semibold text-xs" />
                      <textarea rows={2} value={sol.step3Desc} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, step3Desc: e.target.value } })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Comparison Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection("solComparison")}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
              >
                <span>5. ⚖️ Comparison Table & Guarantee Matrix</span>
                {openSections.solComparison ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </button>
              {openSections.solComparison && (
                <div className="p-5 space-y-4 text-xs font-medium border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold">Badge Text</label>
                      <input
                        type="text"
                        value={sol.comparisonBadge}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, comparisonBadge: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-slate-700 font-bold">Section Heading</label>
                      <input
                        type="text"
                        value={sol.comparisonTitle}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, comparisonTitle: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Section Subtitle</label>
                    <input
                      type="text"
                      value={sol.comparisonSubtitle}
                      onChange={(e) => setSolutionsData({
                        ...solutionsData,
                        [activeSolutionTab]: { ...sol, comparisonSubtitle: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <input type="text" value={sol.comparisonCol1} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, comparisonCol1: e.target.value } })} className="w-full px-3 py-1.5 bg-slate-100 border rounded-lg font-bold" placeholder="Col 1 Title" />
                    <input type="text" value={sol.comparisonCol2} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, comparisonCol2: e.target.value } })} className="w-full px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg font-bold text-amber-900" placeholder="Col 2 Title" />
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={sol.comparisonRow1Left} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, comparisonRow1Left: e.target.value } })} className="w-full px-2 py-1 bg-slate-50 border rounded text-xs" />
                      <input type="text" value={sol.comparisonRow1Right} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, comparisonRow1Right: e.target.value } })} className="w-full px-2 py-1 bg-amber-50/50 border rounded text-xs font-semibold" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={sol.comparisonRow2Left} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, comparisonRow2Left: e.target.value } })} className="w-full px-2 py-1 bg-slate-50 border rounded text-xs" />
                      <input type="text" value={sol.comparisonRow2Right} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, comparisonRow2Right: e.target.value } })} className="w-full px-2 py-1 bg-amber-50/50 border rounded text-xs font-semibold" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={sol.comparisonRow3Left} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, comparisonRow3Left: e.target.value } })} className="w-full px-2 py-1 bg-slate-50 border rounded text-xs" />
                      <input type="text" value={sol.comparisonRow3Right} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, comparisonRow3Right: e.target.value } })} className="w-full px-2 py-1 bg-amber-50/50 border rounded text-xs font-semibold" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={sol.comparisonRow4Left} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, comparisonRow4Left: e.target.value } })} className="w-full px-2 py-1 bg-slate-50 border rounded text-xs" />
                      <input type="text" value={sol.comparisonRow4Right} onChange={(e) => setSolutionsData({ ...solutionsData, [activeSolutionTab]: { ...sol, comparisonRow4Right: e.target.value } })} className="w-full px-2 py-1 bg-amber-50/50 border rounded text-xs font-semibold" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 6: Bottom CTA */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection("solCta")}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left font-bold text-sm text-slate-900 transition"
              >
                <span>6. 🚀 Bottom Conversion CTA Banner</span>
                {openSections.solCta ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </button>
              {openSections.solCta && (
                <div className="p-5 space-y-4 text-xs font-medium border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">CTA Headline</label>
                    <input
                      type="text"
                      value={sol.ctaHeadline}
                      onChange={(e) => setSolutionsData({
                        ...solutionsData,
                        [activeSolutionTab]: { ...sol, ctaHeadline: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">CTA Subtitle</label>
                    <input
                      type="text"
                      value={sol.ctaSubtitle}
                      onChange={(e) => setSolutionsData({
                        ...solutionsData,
                        [activeSolutionTab]: { ...sol, ctaSubtitle: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold">Primary Button Text</label>
                      <input
                        type="text"
                        value={sol.ctaBtn1}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, ctaBtn1: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold">Secondary Button Text</label>
                      <input
                        type="text"
                        value={sol.ctaBtn2}
                        onChange={(e) => setSolutionsData({
                          ...solutionsData,
                          [activeSolutionTab]: { ...sol, ctaBtn2: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : selectedKey === "faq_page_data" ? (
        /* ─────────────────────────────────────────────
           3. FAQ PAGE STRUCTURED FORM
           ───────────────────────────────────────────── */
        <div className="space-y-4">
          {/* Section 1: Hero & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">1. 🌟 FAQ Page Header & Search Bar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Hero Page Title</label>
                <input
                  type="text"
                  value={faqData.heroTitle}
                  onChange={(e) => setFaqData({ ...faqData, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Search Input Placeholder Text</label>
                <input
                  type="text"
                  value={faqData.searchPlaceholder}
                  onChange={(e) => setFaqData({ ...faqData, searchPlaceholder: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: 5 Category Section Titles */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">2. 🏷️ Category Section Titles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Category 1 (Buyer's FAQs)</label>
                <input
                  type="text"
                  value={faqData.cat1Title}
                  onChange={(e) => setFaqData({ ...faqData, cat1Title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Category 2 (Task Statuses)</label>
                <input
                  type="text"
                  value={faqData.cat2Title}
                  onChange={(e) => setFaqData({ ...faqData, cat2Title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Category 3 (Platform Metrics)</label>
                <input
                  type="text"
                  value={faqData.cat3Title}
                  onChange={(e) => setFaqData({ ...faqData, cat3Title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Category 4 (Guarantees & Refunds)</label>
                <input
                  type="text"
                  value={faqData.cat4Title}
                  onChange={(e) => setFaqData({ ...faqData, cat4Title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-slate-700 font-bold">Category 5 (Account & Billing)</label>
                <input
                  type="text"
                  value={faqData.cat5Title}
                  onChange={(e) => setFaqData({ ...faqData, cat5Title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 3: All FAQ Items by Category */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-2xs text-xs font-medium">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">3. ❓ All 17 Questions & Detailed Answers</h3>
              <span className="text-xs text-slate-500">Total: {faqData.faqs.length} FAQs</span>
            </div>

            {(["Buyer's FAQs", "Task & Statuses", "Platform Metrics", "Guarantees & Refunds", "Account & Billing"] as const).map((catName) => {
              const catFaqs = faqData.faqs.filter((f) => f.category === catName);
              return (
                <div key={catName} className="space-y-3 pt-2">
                  <div className="flex items-center justify-between bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 text-xs">{catName} ({catFaqs.length})</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newFaq = {
                          id: `custom-faq-${Date.now()}`,
                          category: catName,
                          question: "New FAQ Question",
                          answer: "New FAQ Answer details...",
                        };
                        setFaqData({ ...faqData, faqs: [...faqData.faqs, newFaq] });
                      }}
                      className="px-2.5 py-1 bg-[#112C3E] text-white rounded-lg text-[11px] font-bold hover:bg-slate-800"
                    >
                      + Add Question
                    </button>
                  </div>

                  <div className="space-y-3 pl-2">
                    {catFaqs.map((faq) => (
                      <div key={faq.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = faqData.faqs.map((f) => f.id === faq.id ? { ...f, question: e.target.value } : f);
                              setFaqData({ ...faqData, faqs: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white border rounded-lg font-bold text-xs text-slate-900"
                            placeholder="Question"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFaqData({ ...faqData, faqs: faqData.faqs.filter((f) => f.id !== faq.id) });
                            }}
                            className="text-red-500 hover:text-red-700 px-2 py-1 text-xs font-bold shrink-0"
                            title="Delete FAQ"
                          >
                            ✕
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = faqData.faqs.map((f) => f.id === faq.id ? { ...f, answer: e.target.value } : f);
                            setFaqData({ ...faqData, faqs: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs text-slate-700"
                          placeholder="Answer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 4: Bottom 2-Line Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">4. 📞 2-Line Bottom Support Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Banner Line 1</label>
                <input
                  type="text"
                  value={faqData.contactBannerLine1}
                  onChange={(e) => setFaqData({ ...faqData, contactBannerLine1: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Banner Line 2 (Text before email)</label>
                <input
                  type="text"
                  value={faqData.contactBannerLine2}
                  onChange={(e) => setFaqData({ ...faqData, contactBannerLine2: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Support Email Address</label>
              <input
                type="email"
                value={faqData.contactEmail}
                onChange={(e) => setFaqData({ ...faqData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
          </div>
        </div>
      ) : selectedKey === "contact_page_data" ? (
        /* ─────────────────────────────────────────────
           4. CONTACT PAGE STRUCTURED FORM (ALL CONTENT)
           ───────────────────────────────────────────── */
        <div className="space-y-4">
          {/* Section 1: Hero & About MediaHub */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">1. 🌟 Hero Page Title & 'About MediaHub'</h3>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Hero Page Title</label>
              <input
                type="text"
                value={contactData.heroTitle}
                onChange={(e) => setContactData({ ...contactData, heroTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">'About MediaHub' Heading</label>
              <input
                type="text"
                value={contactData.aboutTitle}
                onChange={(e) => setContactData({ ...contactData, aboutTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">About Paragraph 1</label>
              <textarea
                rows={3}
                value={contactData.aboutParagraph1}
                onChange={(e) => setContactData({ ...contactData, aboutParagraph1: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">About Paragraph 2</label>
              <textarea
                rows={3}
                value={contactData.aboutParagraph2}
                onChange={(e) => setContactData({ ...contactData, aboutParagraph2: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
          </div>

          {/* Section 2: Contact Info & Address */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">2. 📞 Contact Information & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Questions Section Title</label>
                <input
                  type="text"
                  value={contactData.questionsTitle}
                  onChange={(e) => setContactData({ ...contactData, questionsTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Questions Subtitle</label>
                <input
                  type="text"
                  value={contactData.questionsSubtitle}
                  onChange={(e) => setContactData({ ...contactData, questionsSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Contact Email</label>
                <input
                  type="text"
                  value={contactData.contactEmail}
                  onChange={(e) => setContactData({ ...contactData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Contact Phone Number</label>
                <input
                  type="text"
                  value={contactData.contactPhone}
                  onChange={(e) => setContactData({ ...contactData, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Company Name</label>
                <input
                  type="text"
                  value={contactData.companyName}
                  onChange={(e) => setContactData({ ...contactData, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Company Physical Address</label>
                <input
                  type="text"
                  value={contactData.companyAddress}
                  onChange={(e) => setContactData({ ...contactData, companyAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Socials Section Title</label>
                <input
                  type="text"
                  value={contactData.socialsTitle}
                  onChange={(e) => setContactData({ ...contactData, socialsTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Advertiser Form Title</label>
                <input
                  type="text"
                  value={contactData.advertiserFormTitle}
                  onChange={(e) => setContactData({ ...contactData, advertiserFormTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Agency & Brand Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">3. 🏢 Agency & Brand Solutions Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Banner Title</label>
                <input
                  type="text"
                  value={contactData.agencyBannerTitle}
                  onChange={(e) => setContactData({ ...contactData, agencyBannerTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Banner Subtitle</label>
                <input
                  type="text"
                  value={contactData.agencyBannerSubtitle}
                  onChange={(e) => setContactData({ ...contactData, agencyBannerSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border space-y-2">
                <span className="font-bold text-slate-800 block">Agency Features (7 Bullets)</span>
                {contactData.agencyBullets.map((b, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const updated = [...contactData.agencyBullets];
                      updated[idx] = e.target.value;
                      setContactData({ ...contactData, agencyBullets: updated });
                    }}
                    className="w-full px-2.5 py-1 bg-white border rounded text-xs"
                  />
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border space-y-2">
                <span className="font-bold text-slate-800 block">Brand Features (7 Bullets)</span>
                {contactData.brandBullets.map((b, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const updated = [...contactData.brandBullets];
                      updated[idx] = e.target.value;
                      setContactData({ ...contactData, brandBullets: updated });
                    }}
                    className="w-full px-2.5 py-1 bg-white border rounded text-xs"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: FAQ Jump Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">4. 📚 FAQ Jump Callout Box</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Callout Title</label>
                <input
                  type="text"
                  value={contactData.faqJumpTitle}
                  onChange={(e) => setContactData({ ...contactData, faqJumpTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Callout Text</label>
                <input
                  type="text"
                  value={contactData.faqJumpText}
                  onChange={(e) => setContactData({ ...contactData, faqJumpText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Button Text</label>
                <input
                  type="text"
                  value={contactData.faqJumpBtn}
                  onChange={(e) => setContactData({ ...contactData, faqJumpBtn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      ) : selectedKey === "mediakit_page_data" ? (
        /* ─────────────────────────────────────────────
           5. MEDIA KIT / TALKS STRUCTURED FORM (ALL CONTENT)
           ───────────────────────────────────────────── */
        <div className="space-y-4">
          {/* Section 1: Hero & Visual Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">1. 🌟 Hero Headline & Guest Visual Card</h3>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Podcast Hero Main Headline</label>
              <input
                type="text"
                value={mediakitData.heroHeadline}
                onChange={(e) => setMediakitData({ ...mediakitData, heroHeadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Guest Feature Card Title</label>
                <input
                  type="text"
                  value={mediakitData.guestVisualTitle}
                  onChange={(e) => setMediakitData({ ...mediakitData, guestVisualTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Guest Feature Card Subtitle</label>
                <input
                  type="text"
                  value={mediakitData.guestVisualSubtitle}
                  onChange={(e) => setMediakitData({ ...mediakitData, guestVisualSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Timeline Blocks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">2. ⏳ 'What is MediaHub Talks' (4 Timeline Blocks)</h3>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Timeline Section Title</label>
              <input
                type="text"
                value={mediakitData.timelineTitle}
                onChange={(e) => setMediakitData({ ...mediakitData, timelineTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                <span className="font-bold text-slate-800">Block 1</span>
                <input type="text" value={mediakitData.timeline1Title} onChange={(e) => setMediakitData({ ...mediakitData, timeline1Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded font-semibold text-xs" />
                <textarea rows={2} value={mediakitData.timeline1Desc} onChange={(e) => setMediakitData({ ...mediakitData, timeline1Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                <span className="font-bold text-slate-800">Block 2</span>
                <input type="text" value={mediakitData.timeline2Title} onChange={(e) => setMediakitData({ ...mediakitData, timeline2Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded font-semibold text-xs" />
                <textarea rows={2} value={mediakitData.timeline2Desc} onChange={(e) => setMediakitData({ ...mediakitData, timeline2Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                <span className="font-bold text-slate-800">Block 3</span>
                <input type="text" value={mediakitData.timeline3Title} onChange={(e) => setMediakitData({ ...mediakitData, timeline3Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded font-semibold text-xs" />
                <textarea rows={2} value={mediakitData.timeline3Desc} onChange={(e) => setMediakitData({ ...mediakitData, timeline3Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                <span className="font-bold text-slate-800">Block 4</span>
                <input type="text" value={mediakitData.timeline4Title} onChange={(e) => setMediakitData({ ...mediakitData, timeline4Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded font-semibold text-xs" />
                <textarea rows={2} value={mediakitData.timeline4Desc} onChange={(e) => setMediakitData({ ...mediakitData, timeline4Desc: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs" />
              </div>
            </div>
          </div>

          {/* Section 3: Why This Podcast Exists */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">3. 💡 'Why This Podcast Exists' & Core Principles</h3>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Section Heading</label>
              <input
                type="text"
                value={mediakitData.whyExistsTitle}
                onChange={(e) => setMediakitData({ ...mediakitData, whyExistsTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Section Subtitle</label>
              <textarea
                rows={2}
                value={mediakitData.whyExistsSubtitle}
                onChange={(e) => setMediakitData({ ...mediakitData, whyExistsSubtitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-slate-700 font-bold">4 Key Takeaway Bullets</label>
              {mediakitData.whyExistsBullets.map((b, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={b}
                  onChange={(e) => {
                    const updated = [...mediakitData.whyExistsBullets];
                    updated[idx] = e.target.value;
                    setMediakitData({ ...mediakitData, whyExistsBullets: updated });
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg text-xs"
                />
              ))}
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-slate-700 font-bold">Bottom Notice Banner</label>
              <input
                type="text"
                value={mediakitData.noticeBannerText}
                onChange={(e) => setMediakitData({ ...mediakitData, noticeBannerText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium"
              />
            </div>
          </div>

          {/* Section 4: Who Is It For & Why MediaHub */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">4. 👥 'Who Is It For' Audience Roles & 'Why MediaHub'</h3>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">'Who Is It For' Title</label>
              <input
                type="text"
                value={mediakitData.whoIsItForTitle}
                onChange={(e) => setMediakitData({ ...mediakitData, whoIsItForTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">'Who Is It For' Subtitle</label>
              <input
                type="text"
                value={mediakitData.whoIsItForSubtitle}
                onChange={(e) => setMediakitData({ ...mediakitData, whoIsItForSubtitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-1">
              {mediakitData.whoIsItForRoles.map((role, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={role}
                  onChange={(e) => {
                    const updated = [...mediakitData.whoIsItForRoles];
                    updated[idx] = e.target.value;
                    setMediakitData({ ...mediakitData, whoIsItForRoles: updated });
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg text-xs font-bold"
                />
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="text-slate-700 font-bold">'Why MediaHub' Title & 4 Highlights</label>
              <input
                type="text"
                value={mediakitData.whyMediaHubTitle}
                onChange={(e) => setMediakitData({ ...mediakitData, whyMediaHubTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
              />
              {mediakitData.whyMediaHubBullets.map((b, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={b}
                  onChange={(e) => {
                    const updated = [...mediakitData.whyMediaHubBullets];
                    updated[idx] = e.target.value;
                    setMediakitData({ ...mediakitData, whyMediaHubBullets: updated });
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg text-xs"
                />
              ))}
            </div>
          </div>
        </div>
      ) : selectedKey === "podcast_sponsorship_page_data" ? (
        /* ─────────────────────────────────────────────
           6. PODCAST SPONSORSHIPS & STRATEGY LIBRARY FORM
           ───────────────────────────────────────────── */
        <div className="space-y-4">
          {/* Section 1: Hero Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">1. 🌟 Hero Banner & 3 Operational Pillars</h3>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Top Pill Badge Text</label>
              <input
                type="text"
                value={podcastData.badge}
                onChange={(e) => setPodcastData({ ...podcastData, badge: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Hero Headline (Prefix)</label>
                <input
                  type="text"
                  value={podcastData.heroHeadline}
                  onChange={(e) => setPodcastData({ ...podcastData, heroHeadline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Hero Headline Highlight (Orange)</label>
                <input
                  type="text"
                  value={podcastData.heroHeadlineHighlight}
                  onChange={(e) => setPodcastData({ ...podcastData, heroHeadlineHighlight: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold text-amber-600"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Hero Subtitle</label>
              <textarea
                rows={3}
                value={podcastData.heroSubtitle}
                onChange={(e) => setPodcastData({ ...podcastData, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                <label className="font-bold text-slate-800">Pillar 1</label>
                <input type="text" value={podcastData.pillar1Title} onChange={(e) => setPodcastData({ ...podcastData, pillar1Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-semibold" />
                <input type="text" value={podcastData.pillar1Subtitle} onChange={(e) => setPodcastData({ ...podcastData, pillar1Subtitle: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs text-slate-500" />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                <label className="font-bold text-slate-800">Pillar 2</label>
                <input type="text" value={podcastData.pillar2Title} onChange={(e) => setPodcastData({ ...podcastData, pillar2Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-semibold" />
                <input type="text" value={podcastData.pillar2Subtitle} onChange={(e) => setPodcastData({ ...podcastData, pillar2Subtitle: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs text-slate-500" />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                <label className="font-bold text-slate-800">Pillar 3</label>
                <input type="text" value={podcastData.pillar3Title} onChange={(e) => setPodcastData({ ...podcastData, pillar3Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs font-semibold" />
                <input type="text" value={podcastData.pillar3Subtitle} onChange={(e) => setPodcastData({ ...podcastData, pillar3Subtitle: e.target.value })} className="w-full px-2 py-1 bg-white border rounded text-xs text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Button Label</label>
                <input
                  type="text"
                  value={podcastData.btnExploreMediaKit}
                  onChange={(e) => setPodcastData({ ...podcastData, btnExploreMediaKit: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Guides Count Label</label>
                <input
                  type="text"
                  value={podcastData.guidesCountLabel}
                  onChange={(e) => setPodcastData({ ...podcastData, guidesCountLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Featured Strategy Guide Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">2. ★ Featured Technical Strategy Guide Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Featured Badge Text</label>
                <input
                  type="text"
                  value={podcastData.featuredBadge}
                  onChange={(e) => setPodcastData({ ...podcastData, featuredBadge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold text-amber-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Estimated Read Time</label>
                <input
                  type="text"
                  value={podcastData.featuredReadTime}
                  onChange={(e) => setPodcastData({ ...podcastData, featuredReadTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Featured Guide Title</label>
              <input
                type="text"
                value={podcastData.featuredTitle}
                onChange={(e) => setPodcastData({ ...podcastData, featuredTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Featured Guide Executive Summary</label>
              <textarea
                rows={3}
                value={podcastData.featuredSummary}
                onChange={(e) => setPodcastData({ ...podcastData, featuredSummary: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Speaker Name</label>
                <input
                  type="text"
                  value={podcastData.featuredSpeaker}
                  onChange={(e) => setPodcastData({ ...podcastData, featuredSpeaker: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Speaker Role</label>
                <input
                  type="text"
                  value={podcastData.featuredRole}
                  onChange={(e) => setPodcastData({ ...podcastData, featuredRole: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">Action Button Label</label>
                <input
                  type="text"
                  value={podcastData.featuredBtnText}
                  onChange={(e) => setPodcastData({ ...podcastData, featuredBtnText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      ) : selectedKey === "privacy_page_data" ? (
        /* ─────────────────────────────────────────────
           7. PRIVACY POLICY STRUCTURED FORM
           ───────────────────────────────────────────── */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Document Title</label>
            <input
              type="text"
              value={privacyData.title}
              onChange={(e) => setPrivacyData({ ...privacyData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Last Updated Line</label>
            <input
              type="text"
              value={privacyData.lastUpdated}
              onChange={(e) => setPrivacyData({ ...privacyData, lastUpdated: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
            />
          </div>
          <div className="space-y-2 p-3 bg-slate-50 rounded-xl border">
            <input type="text" value={privacyData.section1Title} onChange={(e) => setPrivacyData({ ...privacyData, section1Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded font-bold" />
            <textarea rows={2} value={privacyData.section1Text} onChange={(e) => setPrivacyData({ ...privacyData, section1Text: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" />
          </div>
          <div className="space-y-2 p-3 bg-slate-50 rounded-xl border">
            <input type="text" value={privacyData.section2Title} onChange={(e) => setPrivacyData({ ...privacyData, section2Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded font-bold" />
            <textarea rows={2} value={privacyData.section2Text} onChange={(e) => setPrivacyData({ ...privacyData, section2Text: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" />
          </div>
          <div className="space-y-2 p-3 bg-slate-50 rounded-xl border">
            <input type="text" value={privacyData.section3Title} onChange={(e) => setPrivacyData({ ...privacyData, section3Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded font-bold" />
            <textarea rows={2} value={privacyData.section3Text} onChange={(e) => setPrivacyData({ ...privacyData, section3Text: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" />
          </div>
        </div>
      ) : selectedKey === "terms_page_data" ? (
        /* ─────────────────────────────────────────────
           8. TERMS AND CONDITIONS STRUCTURED FORM
           ───────────────────────────────────────────── */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Document Title</label>
            <input
              type="text"
              value={termsData.title}
              onChange={(e) => setTermsData({ ...termsData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Last Updated Line</label>
            <input
              type="text"
              value={termsData.lastUpdated}
              onChange={(e) => setTermsData({ ...termsData, lastUpdated: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
            />
          </div>
          <div className="space-y-2 p-3 bg-slate-50 rounded-xl border">
            <input type="text" value={termsData.section1Title} onChange={(e) => setTermsData({ ...termsData, section1Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded font-bold" />
            <textarea rows={2} value={termsData.section1Text} onChange={(e) => setTermsData({ ...termsData, section1Text: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" />
          </div>
          <div className="space-y-2 p-3 bg-slate-50 rounded-xl border">
            <input type="text" value={termsData.section2Title} onChange={(e) => setTermsData({ ...termsData, section2Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded font-bold" />
            <textarea rows={2} value={termsData.section2Text} onChange={(e) => setTermsData({ ...termsData, section2Text: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" />
          </div>
          <div className="space-y-2 p-3 bg-slate-50 rounded-xl border">
            <input type="text" value={termsData.section3Title} onChange={(e) => setTermsData({ ...termsData, section3Title: e.target.value })} className="w-full px-2 py-1 bg-white border rounded font-bold" />
            <textarea rows={2} value={termsData.section3Text} onChange={(e) => setTermsData({ ...termsData, section3Text: e.target.value })} className="w-full px-2 py-1 bg-white border rounded" />
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────
           9. BLOG HUB STRUCTURED FORM
           ───────────────────────────────────────────── */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs text-xs font-medium">
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Blog Hub Main Headline</label>
            <input
              type="text"
              value={blogData.heroHeadline}
              onChange={(e) => setBlogData({ ...blogData, heroHeadline: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
            />
          </div>
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
            <span className="text-amber-400 font-bold block">SERP Rankings Dark Widget</span>
            <input
              type="text"
              value={blogData.serpPromoTitle}
              onChange={(e) => setBlogData({ ...blogData, serpPromoTitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
              placeholder="Widget Title"
            />
            <input
              type="text"
              value={blogData.serpPromoSubtitle}
              onChange={(e) => setBlogData({ ...blogData, serpPromoSubtitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300"
              placeholder="Widget Subtitle"
            />
            <input
              type="text"
              value={blogData.serpPromoBtn}
              onChange={(e) => setBlogData({ ...blogData, serpPromoBtn: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-amber-400 font-bold"
              placeholder="Button Text"
            />
          </div>
        </div>
      )}
    </div>
  );
}
