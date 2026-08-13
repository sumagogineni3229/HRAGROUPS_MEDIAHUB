"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon, SparklesIcon } from "@heroicons/react/24/solid";

interface PublicHeaderProps {
  activePage?: "home" | "blog" | "solutions" | "podcasts" | "faq" | "contact" | "other";
}

export function PublicHeader({ activePage = "other" }: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      <div className="w-full px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center group py-1.5">
          <img
            src="/mediahub1.png"
            alt="Media Hub Logo"
            className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-slate-800">
          <Link
            href="/solutions"
            className={`transition hover:text-[#F59E0B] relative py-1 ${
              activePage === "solutions" ? "text-[#F59E0B] font-bold" : ""
            }`}
          >
            Marketplace
            {activePage === "solutions" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F59E0B] rounded-full" />
            )}
          </Link>

          <Link
            href="/blog"
            className={`flex items-center gap-2 group transition hover:text-[#F59E0B] relative py-1 ${
              activePage === "blog" ? "text-[#F59E0B] font-bold" : ""
            }`}
          >
            <span>AI Engine</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-sm uppercase tracking-wider group-hover:scale-105 transition-transform animate-pulse">
              PRO
            </span>
          </Link>

          <Link
            href="/faq"
            className={`transition hover:text-[#F59E0B] relative py-1 ${
              activePage === "faq" ? "text-[#F59E0B] font-bold" : ""
            }`}
          >
            FAQ
          </Link>

          {/* Podcasts Dropdown */}
          <div
            className="relative group cursor-pointer flex items-center gap-1.5 py-1 hover:text-[#F59E0B] transition"
            onMouseEnter={() => setActiveDropdown("podcasts")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className={activePage === "podcasts" ? "text-[#F59E0B] font-bold" : ""}>PR Suite</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#F59E0B] transition-transform duration-200" />

            {activeDropdown === "podcasts" && (
              <div className="absolute top-full left-0 mt-2 w-60 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <Link
                  href="/media-kit"
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-amber-50 font-medium text-sm text-slate-800 hover:text-[#F59E0B] transition"
                >
                  <span>Media Kit</span>
                  <SparklesIcon className="w-4 h-4 text-[#F59E0B]" />
                </Link>
                <Link
                  href="/podcasts/library"
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-amber-50 font-medium text-sm text-slate-800 hover:text-[#F59E0B] transition"
                >
                  <span>Podcast Sponsorships</span>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">AUDIO</span>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`transition hover:text-[#F59E0B] relative py-1 ${
              activePage === "contact" ? "text-[#F59E0B] font-bold" : ""
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-full border border-slate-300 text-slate-900 font-bold text-[15px] hover:bg-slate-900 hover:text-white transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-[15px] hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md"
          >
            Launch AI Campaign
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-800 hover:bg-amber-50 transition"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <XMarkIcon className="w-6 h-6 text-[#F59E0B]" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-6 py-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <Link href="/solutions" className="block text-lg font-bold text-slate-800 hover:text-[#F59E0B]">
            Marketplace
          </Link>

          <Link href="/blog" className="flex items-center justify-between text-lg font-bold text-slate-800 hover:text-[#F59E0B]">
            <span>AI Engine</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white uppercase">
              PRO
            </span>
          </Link>

          <Link href="/faq" className="block text-lg font-bold text-slate-800 hover:text-[#F59E0B]">
            FAQ
          </Link>
          <div className="space-y-2 pl-3 border-l-2 border-amber-500">
            <span className="text-xs uppercase font-extrabold text-[#F59E0B] tracking-wider">PR Suite</span>
            <Link href="/media-kit" className="block text-base font-semibold text-slate-700 hover:text-[#F59E0B]">
              Media Kit
            </Link>
            <Link href="/podcasts/library" className="block text-base font-semibold text-slate-700 hover:text-[#F59E0B]">
              Podcast Sponsorships
            </Link>
          </div>
          <Link href="/contact" className="block text-lg font-bold text-slate-800 hover:text-[#F59E0B]">
            Contact
          </Link>

          <div className="pt-4 flex flex-col gap-3">
            <Link href="/login" className="w-full text-center py-3 rounded-full border border-slate-300 font-bold text-slate-900 hover:bg-slate-900 hover:text-white">
              Sign In
            </Link>
            <Link href="/register" className="w-full text-center py-3 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold shadow-md">
              Launch AI Campaign
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}


