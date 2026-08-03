"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

interface PublicHeaderProps {
  activePage?: "home" | "blog" | "solutions" | "podcasts" | "faq" | "contact" | "other";
}

export function PublicHeader({ activePage = "other" }: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#EAF1F6]">
      <div className="w-full px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            className="transition-transform group-hover:scale-105"
          >
            <rect width="36" height="36" rx="18" fill="#3E4FEA" />
            <path
              d="M10 24V12L15.5 19.5L20.5 12V24"
              stroke="white"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="25.5" cy="22.5" r="2" fill="#8CF08A" />
          </svg>
          <span className="font-bold text-2xl text-[#112C3E] tracking-tight font-space">
            Media<span className="text-[#3E4FEA]">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#112C3E]">
          {/* Solutions Nav Link */}
          <Link
            href="/solutions"
            className={`transition ${activePage === "solutions" ? "text-[#3E4FEA] font-semibold" : "hover:text-[#3E4FEA]"}`}
          >
            Solutions
          </Link>

          {/* Blog Nav item with dynamic "NEW" Badge */}
          <Link
            href="/blog"
            className={`flex items-center gap-2 group transition ${
              activePage === "blog" ? "text-[#3E4FEA] font-semibold" : "hover:text-[#3E4FEA]"
            }`}
          >
            <span>Blog</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-[#3E4FEA] to-[#FF4B8B] text-white shadow-sm uppercase tracking-wider group-hover:scale-105 transition-transform animate-pulse">
              NEW
            </span>
          </Link>

          {/* FAQ */}
          <Link
            href="/faq"
            className={`transition ${activePage === "faq" ? "text-[#3E4FEA] font-semibold" : "hover:text-[#3E4FEA]"}`}
          >
            FAQ
          </Link>

          {/* Podcasts Dropdown */}
          <div
            className="relative group cursor-pointer flex items-center gap-1.5 hover:text-[#3E4FEA] transition"
            onMouseEnter={() => setActiveDropdown("podcasts")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className={activePage === "podcasts" ? "text-[#3E4FEA] font-semibold" : ""}>Podcasts</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-[#677F9B]" />

            {activeDropdown === "podcasts" && (
              <div className="absolute top-full left-0 w-52 bg-white shadow-xl rounded-2xl border border-[#EAF1F6] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <Link href="/media-kit" className="block px-4 py-2.5 rounded-xl hover:bg-[#F5F8FA] font-medium text-sm text-[#112C3E]">
                  Media Kit
                </Link>
                <Link href="/podcasts/library" className="block px-4 py-2.5 rounded-xl hover:bg-[#F5F8FA] font-medium text-sm text-[#112C3E]">
                  Podcast Library
                </Link>
              </div>
            )}
          </div>

          {/* Contact Us */}
          <Link
            href="/contact"
            className={`transition ${activePage === "contact" ? "text-[#3E4FEA] font-semibold" : "hover:text-[#3E4FEA]"}`}
          >
            Contact us
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-full border border-[#112C3E] text-[#112C3E] font-semibold text-[15px] hover:bg-[#EAF1F6] transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 rounded-full bg-[#112C3E] text-white font-semibold text-[15px] hover:bg-[#3E4FEA] transition shadow-sm"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#112C3E] hover:bg-[#EAF1F6]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#EAF1F6] px-6 py-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          <Link href="/solutions" className="block text-lg font-medium text-[#112C3E]">
            Solutions
          </Link>

          <Link href="/blog" className="flex items-center justify-between text-lg font-medium text-[#112C3E]">
            <span>Blog</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#3E4FEA] to-[#FF4B8B] text-white uppercase">
              NEW
            </span>
          </Link>

          <Link href="/faq" className="block text-lg font-medium text-[#112C3E]">
            FAQ
          </Link>
          <div className="space-y-2 pl-2 border-l-2 border-[#EAF1F6]">
            <span className="text-xs uppercase font-bold text-[#677F9B] tracking-wider">Podcasts</span>
            <Link href="/media-kit" className="block text-base font-medium text-[#112C3E] hover:text-[#3E4FEA]">
              Media Kit
            </Link>
            <Link href="/podcasts/library" className="block text-base font-medium text-[#112C3E] hover:text-[#3E4FEA]">
              Podcast Library
            </Link>
          </div>
          <Link href="/contact" className="block text-lg font-medium text-[#112C3E]">
            Contact us
          </Link>

          <div className="pt-4 flex flex-col gap-3">
            <Link href="/login" className="w-full text-center py-3 rounded-full border border-[#112C3E] font-semibold text-[#112C3E]">
              Login
            </Link>
            <Link href="/register" className="w-full text-center py-3 rounded-full bg-[#112C3E] text-white font-semibold hover:bg-[#3E4FEA]">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
