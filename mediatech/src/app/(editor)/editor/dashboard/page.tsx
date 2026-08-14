import Link from "next/link";
import {
  DocumentTextIcon,
  PencilSquareIcon,
  GlobeAltIcon,
  SparklesIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  BookOpenIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";

export default function EditorDashboardPage() {
  const quickPages = [
    { title: "Landing Page (Home)", href: "/editor/pages", icon: GlobeAltIcon, desc: "Hero headline, subheadline, core services & consultation banner" },
    { title: "Solutions / Marketplace", href: "/editor/pages", icon: SparklesIcon, desc: "Marketing, Advertisers, Brands & Agencies tabs" },
    { title: "FAQ & Support", href: "/editor/pages", icon: QuestionMarkCircleIcon, desc: "FAQ hero headline, intro text & bottom support banner" },
    { title: "Contact Us Page", href: "/editor/pages", icon: EnvelopeIcon, desc: "MediaHub background, contact info & agency promo banner" },
    { title: "PR Suite & Podcasts", href: "/editor/pages", icon: MicrophoneIcon, desc: "MediaHub Talks headlines, timeline & audience descriptions" },
    { title: "Legal & Policies", href: "/editor/pages", icon: ShieldCheckIcon, desc: "Full Privacy Policy & Terms and Conditions document bodies" },
    { title: "Blog Hub Copy", href: "/editor/pages", icon: BookOpenIcon, desc: "Blog hub main headline & SERP rankings promo card" },
  ];

  return (
    <div className="w-full space-y-8 font-inter">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-space text-slate-900">Editor Workspace</h1>
          <p className="text-sm text-slate-500 font-inter mt-1">
            Complete control to edit and customize text copy for every page across the website.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold self-start">
          <SparklesIcon className="w-4 h-4 text-purple-600" />
          <span>Editor Content Manager Active</span>
        </div>
      </div>

      {/* Main 2 Feature Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/editor/pages"
          className="p-6 bg-white border border-slate-200 rounded-3xl hover:shadow-md hover:border-amber-400 transition group relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <GlobeAltIcon className="w-6 h-6 text-[#D97706]" />
          </div>
          <h2 className="text-lg font-bold font-space text-slate-900 group-hover:text-[#D97706] transition">
            Full-Page Website Text Editor
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Directly edit headline copy, body paragraphs, and callout sections for all 8+ pages (Home, Solutions, FAQ, Contact, Media Kit, Legal, and Blog).
          </p>
          <div className="mt-5 text-xs font-bold text-[#D97706] flex items-center gap-1">
            Open Website Page Editor &rarr;
          </div>
        </Link>

        <Link
          href="/editor/blogs"
          className="p-6 bg-white border border-slate-200 rounded-3xl hover:shadow-md hover:border-purple-400 transition group relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <PencilSquareIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold font-space text-slate-900 group-hover:text-purple-600 transition">
            Blog Post Management
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Create, update, delete blog articles and insert inline images between paragraphs with real-time formatting preview.
          </p>
          <div className="mt-5 text-xs font-bold text-purple-600 flex items-center gap-1">
            Manage Blog Articles &rarr;
          </div>
        </Link>
      </div>

      {/* Quick Editable Pages Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 font-space">
            All Editable Pages Available
          </h3>
          <Link
            href="/editor/pages"
            className="text-xs font-semibold text-[#D97706] hover:underline"
          >
            Open Full Editor &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickPages.map((page, idx) => {
            const Icon = page.icon;
            return (
              <Link
                key={idx}
                href={page.href}
                className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-amber-300 hover:shadow-2xs transition flex items-start gap-3.5 group"
              >
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 group-hover:text-[#D97706] group-hover:bg-amber-50 transition">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 font-space group-hover:text-[#D97706] transition">
                    {page.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                    {page.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Permissions Box */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1">
        <p className="font-semibold text-slate-900">🛡️ Permission Scoping Notice</p>
        <p>
          As an <strong>Editor</strong>, your account is granted full content editing access for interface pages and blog articles. User records, escrow funds, platform approvals, and system settings remain securely restricted to System Administrators.
        </p>
      </div>
    </div>
  );
}
