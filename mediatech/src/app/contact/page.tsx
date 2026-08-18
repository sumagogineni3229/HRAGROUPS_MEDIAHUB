"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import {
  DEFAULT_CONTACT_PAGE_CONTENT,
  ContactPageContent,
} from "@/lib/page-content-data";
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { ALL_COUNTRIES } from "@/lib/countries";

export default function ContactPage() {
  const [contactContent, setContactContent] = useState<ContactPageContent>(DEFAULT_CONTACT_PAGE_CONTENT);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    companySize: "",
    goal: "",
    message: "",
    robotChecked: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCms() {
      try {
        const res = await fetch("/api/cms/page?key=contact_page_data");
        if (res.ok) {
          const data = await res.json();
          if (data.html) {
            try {
              const parsed = JSON.parse(data.html);
              setContactContent((prev) => ({ ...prev, ...parsed }));
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
    loadCms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.robotChecked) {
      setErrorMsg("Please check the 'I'm not a robot' verification box.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact-advertiser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const c = contactContent;

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#112C3E] font-sans antialiased selection:bg-[#F59E0B] selection:text-white">
      {/* Header */}
      <PublicHeader activePage="contact" />

      {/* MAIN CONTAINER */}
      <main className="w-full px-6 sm:px-8 lg:px-12 py-12 max-w-6xl mx-auto space-y-16">

        {/* ─────────────────────────────────────────────
           1. HERO CONTACT INFORMATION (Exact Design As Is)
           ───────────────────────────────────────────── */}
        <section className="space-y-8">
          <h1 className="text-4xl sm:text-5xl font-black text-[#112C3E] font-space tracking-tight">
            {c.heroTitle}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: A few words about MediaHub */}
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-2xl font-bold font-space text-[#112C3E]">
                {c.aboutTitle}
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed">
                {c.aboutParagraph1}
              </p>
              <p className="text-sm text-[#475569] leading-relaxed">
                {c.aboutParagraph2}
              </p>
            </div>

            {/* Right Column: Questions & Contact Info */}
            <div className="lg:col-span-6 space-y-5">
              <h2 className="text-2xl font-bold font-space text-[#112C3E] leading-snug">
                {c.questionsTitle}
              </h2>
              <p className="text-sm text-[#677F9B]">
                {c.questionsSubtitle}
              </p>

              {/* User Email & Phone Pill Badge */}
              <div className="bg-[#FEF3C7]/40 border border-[#F59E0B]/30 text-[#112C3E] font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl inline-block shadow-sm">
                <a href={`mailto:${c.contactEmail}`} className="hover:text-[#F59E0B] transition">
                  {c.contactEmail}
                </a>{" "}
                /{" "}
                <a href={`tel:${c.contactPhone}`} className="hover:text-[#F59E0B] transition">
                  {c.contactPhone}
                </a>
              </div>

              {/* Company Address */}
              <div className="text-xs text-[#677F9B] leading-relaxed font-medium pt-2">
                <p className="font-bold text-[#112C3E]">{c.companyName}</p>
                <p>{c.companyAddress}</p>
              </div>

              {/* Talk to us on socials */}
              <div className="pt-2 space-y-2">
                <h4 className="text-base font-bold text-[#112C3E] font-space">
                  {c.socialsTitle}
                </h4>
                <div className="flex items-center gap-3">
                  <a href="https://t.me" target="_blank" rel="noreferrer" title="Telegram" className="hover:scale-110 transition-transform">
                    <svg className="w-9 h-9" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="#24A1DE" />
                      <path d="M22.5 9.5L6.8 15.6C5.7 16 5.7 16.7 6.6 17L10.6 18.3L19.9 12.4C20.3 12.1 20.7 12.3 20.4 12.6L12.9 19.4L12.6 23.2C13 23.2 13.2 23 13.4 22.8L15.3 21L19.3 23.9C20 24.3 20.6 24 20.8 23.2L23.4 10.8C23.7 9.8 23 9.3 22.5 9.5Z" fill="white" />
                    </svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook" className="hover:scale-110 transition-transform">
                    <svg className="w-9 h-9" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="#1877F2" />
                      <path d="M18.8 16.5H16.4V24H13.3V16.5H11.8V13.8H13.3V12.1C13.3 10.6 14.1 8.5 17.2 8.5H19.5V11.2H17.8C16.7 11.2 16.4 11.7 16.4 12.4V13.8H19.6L18.8 16.5Z" fill="white" />
                    </svg>
                  </a>
                  <a href="https://x.com" target="_blank" rel="noreferrer" title="X (Twitter)" className="hover:scale-110 transition-transform">
                    <svg className="w-9 h-9" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="#000000" />
                      <path d="M19.8 9.5H21.7L17.5 14.3L22.4 20.8H18.6L15.6 16.9L12.2 20.8H10.3L14.8 15.6L10 9.5H13.9L16.6 13.1L19.8 9.5ZM19.1 19.6H20.2L13.4 10.6H12.2L19.1 19.6Z" fill="white" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn" className="hover:scale-110 transition-transform">
                    <svg className="w-9 h-9" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="#0A66C2" />
                      <path d="M10.8 12.7H13.5V21.3H10.8V12.7ZM12.1 9.5C13 9.5 13.7 10.2 13.7 11.1C13.7 12 13 12.7 12.1 12.7C11.3 12.7 10.6 12 10.6 11.1C10.6 10.2 11.3 9.5 12.1 9.5ZM15.1 12.7H17.7V13.9H17.7C18.1 13.2 19 12.4 20.4 12.4C23.3 12.4 23.8 14.3 23.8 16.8V21.3H21.1V17.1C21.1 16.1 21.1 14.8 19.7 14.8C18.3 14.8 18.1 15.9 18.1 17V21.3H15.4L15.1 12.7Z" fill="white" />
                    </svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube" className="hover:scale-110 transition-transform">
                    <svg className="w-9 h-9" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="#FF0000" />
                      <path d="M22.8 13.4C22.6 12.7 22.1 12.2 21.4 12C20.1 11.7 16 11.7 16 11.7C16 11.7 11.9 11.7 10.6 12C9.9 12.2 9.4 12.7 9.2 13.4C8.9 14.7 8.9 17.5 8.9 17.5C8.9 17.5 8.9 20.3 9.2 21.6C9.4 22.3 9.9 22.8 10.6 23C11.9 23.3 16 23.3 16 23.3C16 23.3 20.1 23.3 21.4 23C22.1 22.8 22.6 22.3 22.8 21.6C23.1 20.3 23.1 17.5 23.1 17.5C23.1 17.5 23.1 14.7 22.8 13.4ZM14.6 19.8V15.2L18.6 17.5L14.6 19.8Z" fill="white" />
                    </svg>
                  </a>
                  <a href="https://wa.me/919490056002" target="_blank" rel="noreferrer" title="WhatsApp" className="hover:scale-110 transition-transform">
                    <svg className="w-9 h-9" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="#25D366" />
                      <path d="M21.7 19.7C21.4 19.6 20.1 19 19.8 18.9C19.6 18.8 19.4 18.7 19.2 18.9C19 19.1 18.5 19.7 18.3 19.9C18.2 20.1 18 20.1 17.7 20C17.4 19.9 16.5 19.6 15.4 18.6C14.5 17.8 13.9 16.8 13.8 16.5C13.7 16.2 13.8 16.1 13.9 16C14 15.9 14.2 15.7 14.3 15.5C14.4 15.3 14.4 15.2 14.5 15C14.6 14.8 14.5 14.7 14.4 14.5C14.3 14.3 13.8 13 13.5 12.4C13.3 11.8 13.1 11.9 12.9 11.9H12.4C12.2 11.9 11.9 12 11.7 12.2C11.5 12.4 10.9 12.8 10.9 13.9C10.9 15 11.7 16.1 11.8 16.2C11.9 16.3 13.4 18.6 15.7 19.6C16.2 19.8 16.7 20 17 20.1C17.6 20.3 18.1 20.3 18.5 20.2C19 20.1 20 19.6 20.2 19C20.4 18.4 20.4 17.9 20.3 17.8C20.2 17.7 20 17.7 19.7 17.6M16.3 8C11.9 8 8.3 11.6 8.3 16C8.3 17.7 8.8 19.3 9.7 20.6L8.5 24.3L12.3 23.1C13.5 23.9 14.9 24.3 16.3 24.3C20.7 24.3 24.3 20.7 24.3 16.3C24.3 11.9 20.7 8 16.3 8Z" fill="white" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
           2. "FOR ADVERTISERS" FORM CARD (Exact Design As Is)
           ───────────────────────────────────────────── */}
        <section>
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 text-slate-900 space-y-6 max-w-4xl mx-auto relative overflow-hidden">
            <div>
              <h3 className="text-3xl font-extrabold font-space text-slate-950">{c.advertiserFormTitle}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Fields marked <span className="text-red-500 font-bold">*</span> are required
              </p>
            </div>

            {submitted ? (
              <div className="bg-amber-50 rounded-2xl p-8 text-center space-y-3 border border-amber-200">
                <CheckCircleIcon className="w-12 h-12 text-[#D97706] mx-auto" />
                <h4 className="text-xl font-bold font-space text-slate-900">Message Received!</h4>
                <p className="text-sm text-slate-600">
                  Thank you for contacting MediaHub. Our campaign specialists will get back to you at {formData.email} within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Your name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900 placeholder-slate-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Your email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="Email address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900 placeholder-slate-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Your phone <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#F59E0B] shrink-0"
                        style={{ maxWidth: "160px" }}
                      >
                        {ALL_COUNTRIES.map((c) => (
                          <option key={c.code + c.dialCode} value={c.dialCode}>
                            {c.flag} {c.dialCode} ({c.code})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        required
                        placeholder="9490056002"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900 placeholder-slate-400 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Your company size</label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900 font-medium"
                    >
                      <option value="">Choose size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-800">What goals would you like to achieve with MediaHub?</label>
                    <select
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900 font-medium"
                    >
                      <option value="">Choose goal</option>
                      <option value="serp">Improve SERP Rankings</option>
                      <option value="backlinks">Build High-DA Backlinks</option>
                      <option value="pr">Digital PR & Media Exposure</option>
                      <option value="agency">Scale Agency Guest Posting</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-800">How can we help you? <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Your message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900 placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div
                    onClick={() => setFormData({ ...formData, robotChecked: !formData.robotChecked })}
                    className={`bg-slate-50 rounded-xl border p-3 flex items-center gap-4 text-xs font-semibold text-slate-700 shrink-0 cursor-pointer transition ${
                      formData.robotChecked ? "border-emerald-500 bg-emerald-50/50" : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id="recaptcha-check"
                      checked={formData.robotChecked}
                      onChange={(e) => setFormData({ ...formData, robotChecked: e.target.checked })}
                      className="w-5 h-5 accent-[#F59E0B] rounded cursor-pointer"
                    />
                    <label htmlFor="recaptcha-check" className="cursor-pointer select-none font-bold">
                      I'm not a robot
                    </label>
                    <div className="text-[9px] text-slate-400 text-center pl-2 border-l border-slate-200">
                      <span className="text-base block">{formData.robotChecked ? "✅" : "🔄"}</span>
                      <span className="font-semibold text-slate-500">reCAPTCHA</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-3 px-9 py-3.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-extrabold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      <span>{submitting ? "Submitting..." : "Submit"}</span>
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <ArrowUpRightIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  By submitting your message you agree to our{" "}
                  <Link href="/terms" className="underline font-bold text-slate-700">Terms and Conditions</Link> and{" "}
                  <Link href="/privacy" className="underline font-bold text-slate-700">Privacy Policy</Link>
                </p>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* ─────────────────────────────────────────────
         3. AGENCY OR BRAND BANNER (Exact Design As Is)
         ───────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto my-12">
        <div className="bg-[#FEF3C7]/40 rounded-3xl p-8 sm:p-14 text-[#112C3E] shadow-xl space-y-10 border border-[#F59E0B]/30 text-center w-full">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-extrabold font-space text-[#112C3E]">
              {c.agencyBannerTitle}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {c.agencyBannerSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-[#112C3E]">
            {/* For Agencies */}
            <div className="bg-white rounded-3xl p-8 space-y-6 shadow-lg flex flex-col justify-between border border-amber-200/60">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold font-space">For Agencies</h4>
                  <Link
                    href="/solutions"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#112C3E] text-xs font-bold hover:bg-[#38D479] transition"
                  >
                    <span>Get solutions</span>
                    <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <ul className="space-y-2.5 text-xs text-[#475569] font-medium">
                  {c.agencyBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">✓</span> {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* For Brands */}
            <div className="bg-white rounded-3xl p-8 space-y-6 shadow-lg flex flex-col justify-between border border-amber-200/60">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold font-space">For Brands</h4>
                  <Link
                    href="/solutions"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#112C3E] text-xs font-bold hover:bg-[#38D479] transition"
                  >
                    <span>Get solutions</span>
                    <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <ul className="space-y-2.5 text-xs text-[#475569] font-medium">
                  {c.brandBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">✓</span> {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="w-full px-6 sm:px-8 lg:px-12 pb-12 max-w-6xl mx-auto space-y-16">

        {/* ─────────────────────────────────────────────
           4. PREFER FINDING ANSWERS ON YOUR OWN? (Exact Design As Is)
           ───────────────────────────────────────────── */}
        <section className="text-center space-y-6 pt-4">
          <h2 className="text-3xl font-extrabold text-[#112C3E] font-space">
            {c.faqJumpTitle}
          </h2>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAF1F6] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <span className="font-bold text-base text-[#112C3E] font-space">
                {c.faqJumpText}
              </span>
            </div>

            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#607D9B] text-white font-bold text-xs hover:bg-[#112C3E] transition shadow-sm shrink-0"
            >
              <span>{c.faqJumpBtn}</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
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
