"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export function PublicFooter() {
  const [showAdditional, setShowAdditional] = useState(false);

  return (
    <footer className="relative bg-[#F7FAFC] border-t border-[#EAF1F6] pt-12 pb-8 text-[#112C3E] w-full font-sans">
      <div className="w-full px-6 sm:px-10 lg:px-16 max-w-[1600px] mx-auto space-y-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-center">
          
          {/* 1. Left: Brand Logo & Short Bio */}
          <div className="lg:col-span-3 space-y-3">
            <Link href="/" className="inline-flex items-center gap-3 group">
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
            <p className="text-xs text-[#677F9B] leading-relaxed max-w-xs">
              Escrow-Protected Content Marketing & Digital PR Marketplace for Advertisers, Publishers, and Influencers.
            </p>
          </div>

          {/* 2. Center: Primary Nav & Payment Method Vectors */}
          <div className="lg:col-span-6 flex flex-col items-start lg:items-center space-y-6">
            
            {/* Top Navigation Links Bar */}
            <div className="flex flex-wrap items-center justify-start lg:justify-center gap-5 sm:gap-7 text-sm font-semibold text-[#112C3E]">
              <Link href="/solutions" className="hover:text-[#3E4FEA] transition">
                Solutions
              </Link>
              
              <Link href="/blog" className="flex items-center gap-1.5 hover:text-[#3E4FEA] transition group">
                <span>Blog</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-gradient-to-r from-[#3E4FEA] to-[#FF4B8B] text-white rounded-full uppercase tracking-wider">
                  NEW
                </span>
              </Link>

              <Link href="/faq" className="hover:text-[#3E4FEA] transition">
                FAQ
              </Link>

              <Link href="/media-kit" className="hover:text-[#3E4FEA] transition">
                Media Kit
              </Link>

              <Link href="/podcasts/library" className="hover:text-[#3E4FEA] transition">
                Podcast Library
              </Link>

              <Link href="/contact" className="hover:text-[#3E4FEA] transition">
                Contact us
              </Link>

              {/* Additional Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAdditional(!showAdditional)}
                  className="flex items-center gap-1 hover:text-[#3E4FEA] transition font-semibold"
                >
                  <span>Additional services</span>
                  <ChevronDownIcon className="w-3.5 h-3.5 text-[#677F9B]" />
                </button>
                {showAdditional && (
                  <div className="absolute top-full mt-2 left-0 lg:left-1/2 lg:-translate-x-1/2 w-48 bg-white shadow-xl rounded-xl border border-[#EAF1F6] p-2 z-50 animate-in fade-in">
                    <Link href="/solutions" className="block px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-50">
                      API Service
                    </Link>
                    <Link href="/solutions" className="block px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-50">
                      MediaHub Checker
                    </Link>
                    <Link href="/solutions" className="block px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-50">
                      Managed Services
                    </Link>
                    <Link href="/influencer/referral" className="block px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-50">
                      Referral Program
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Payment Method Logos (Authentic Vectors) */}
            <div className="flex items-center gap-3 pt-1">
              {/* VISA */}
              <div className="h-7 px-2.5 flex items-center justify-center bg-white rounded border border-slate-200/80 shadow-2xs">
                <svg className="h-4 w-auto" viewBox="0 0 100 32" fill="none">
                  <path
                    d="M38.8 3.5L25.3 31.2H17.2L10.3 7.8C9.9 6.2 9.5 5.5 8.2 4.7C6.1 3.5 2.8 2.5 0 1.8L0.4 0.2H14.1C15.9 0.2 17.4 1.4 17.8 3.4L21.3 21.8L29.7 0.2H38.8ZM73.2 21.3C73.3 13.2 61.8 12.7 61.9 9.1C62 8 63.1 6.8 65.6 6.5C66.8 6.3 70.3 6.2 74.3 8.1L75.8 1.4C73.7 0.6 70.8 0 67.1 0C58.9 0 53.1 4.3 53 10.4C52.9 15 57.1 17.6 60.2 19.1C63.4 20.7 64.5 21.7 64.4 23.1C64.3 25.2 61.8 26.1 59.5 26.2C55.4 26.2 53 25 51.1 24.1L49.5 31.1C51.6 32 55.4 32.7 59.4 32.8C68.3 32.8 73.1 28.4 73.2 21.3ZM94.2 31.2H100L94.9 0.2H89.9C88.5 0.2 87.3 1.1 86.8 2.3L74.1 31.2H82.4L84.1 26.6H92.3L94.2 31.2ZM86.4 20.3L89.8 11L91.7 20.3H86.4ZM51.3 0.2L44.8 31.2H37L43.5 0.2H51.3Z"
                    fill="#1A1F71"
                  />
                </svg>
              </div>

              {/* Mastercard */}
              <div className="h-7 px-2.5 flex items-center justify-center bg-white rounded border border-slate-200/80 shadow-2xs">
                <svg className="h-5 w-auto" viewBox="0 0 40 25" fill="none">
                  <circle cx="14" cy="12.5" r="11" fill="#EB001B" />
                  <circle cx="26" cy="12.5" r="11" fill="#F79E1B" fillOpacity="0.92" />
                  <path
                    d="M20 4.1A10.9 10.9 0 0 0 14 12.5A10.9 10.9 0 0 0 20 20.9A10.9 10.9 0 0 0 26 12.5A10.9 10.9 0 0 0 20 4.1Z"
                    fill="#FF5F00"
                  />
                </svg>
              </div>

              {/* Maestro */}
              <div className="h-7 px-2.5 flex items-center justify-center bg-white rounded border border-slate-200/80 shadow-2xs gap-1.5">
                <svg className="h-5 w-auto" viewBox="0 0 40 25" fill="none">
                  <circle cx="14" cy="12.5" r="11" fill="#EB001B" />
                  <circle cx="26" cy="12.5" r="11" fill="#0061A8" />
                  <path
                    d="M20 4.1A10.9 10.9 0 0 0 14 12.5A10.9 10.9 0 0 0 20 20.9A10.9 10.9 0 0 0 26 12.5A10.9 10.9 0 0 0 20 4.1Z"
                    fill="#6C6BBD"
                  />
                </svg>
                <span className="text-[10px] font-bold text-[#112C3E] tracking-tight">maestro</span>
              </div>

              {/* American Express (AMEX) */}
              <div className="h-7 px-2.5 flex items-center justify-center bg-[#006FCF] rounded border border-[#006FCF] shadow-2xs">
                <span className="text-[10px] font-black text-white tracking-tighter italic">AMEX</span>
              </div>
            </div>

          </div>

          {/* 3. Right: Social Icons & Address */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end space-y-4">
            
            {/* Social Vector Icons */}
            <div className="flex items-center gap-2.5">
              {/* Telegram */}
              <a href="https://telegram.org" target="_blank" rel="noreferrer" title="Telegram" className="hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#2AABEE" />
                  <path d="M7.8 15.6L22.4 9.9C23.1 9.6 23.7 10 23.5 10.8L21 22.4C20.8 23.3 20.3 23.5 19.5 23.1L15.7 20.3L13.8 22.1C13.6 22.3 13.4 22.5 13 22.5L13.3 18.4L20.8 11.6C21.1 11.3 20.7 11.1 20.3 11.4L11 17.2L7 16C6.1 15.7 6.1 15.1 7.8 15.6Z" fill="white" />
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook" className="hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#1877F2" />
                  <path d="M21.3 16H18V25H14V16H12V13H14V11C14 9.1 15.3 7 18.5 7H21V10H19.2C18 10 18 10.5 18 11.3V13H21.3L21.3 16Z" fill="white" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a href="https://x.com" target="_blank" rel="noreferrer" title="X (Twitter)" className="hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#000000" />
                  <path d="M19.8 9.5H21.7L17.5 14.3L22.4 20.8H18.6L15.6 16.9L12.2 20.8H10.3L14.8 15.6L10 9.5H13.9L16.6 13.1L19.8 9.5ZM19.1 19.6H20.2L13.4 10.6H12.2L19.1 19.6Z" fill="white" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn" className="hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#0A66C2" />
                  <path d="M10.8 12.7H13.5V21.3H10.8V12.7ZM12.1 9.5C13 9.5 13.7 10.2 13.7 11.1C13.7 12 13 12.7 12.1 12.7C11.3 12.7 10.6 12 10.6 11.1C10.6 10.2 11.3 9.5 12.1 9.5ZM15.1 12.7H17.7V13.9H17.7C18.1 13.2 19 12.4 20.4 12.4C23.3 12.4 23.8 14.3 23.8 16.8V21.3H21.1V17.1C21.1 16.1 21.1 14.8 19.7 14.8C18.3 14.8 18.1 15.9 18.1 17V21.3H15.4L15.1 12.7Z" fill="white" />
                </svg>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube" className="hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#FF0000" />
                  <path d="M22.8 13.4C22.6 12.7 22.1 12.2 21.4 12C20.1 11.7 16 11.7 16 11.7C16 11.7 11.9 11.7 10.6 12C9.9 12.2 9.4 12.7 9.2 13.4C8.9 14.7 8.9 17.5 8.9 17.5C8.9 17.5 8.9 20.3 9.2 21.6C9.4 22.3 9.9 22.8 10.6 23C11.9 23.3 16 23.3 16 23.3C16 23.3 20.1 23.3 21.4 23C22.1 22.8 22.6 22.3 22.8 21.6C23.1 20.3 23.1 17.5 23.1 17.5C23.1 17.5 23.1 14.7 22.8 13.4ZM14.6 19.8V15.2L18.6 17.5L14.6 19.8Z" fill="white" />
                </svg>
              </a>

              {/* Spotify */}
              <a href="https://spotify.com" target="_blank" rel="noreferrer" title="Spotify" className="hover:scale-110 transition-transform">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#1DB954" />
                  <path d="M20.9 21.4C20.7 21.7 20.3 21.8 20 21.6C17.5 20.1 14.4 19.7 10.8 20.6C10.5 20.7 10.1 20.4 10 20.1C9.9 19.8 10.2 19.4 10.5 19.3C14.5 18.4 17.9 18.8 20.7 20.5C21 20.7 21.1 21.1 20.9 21.4ZM22.4 18.5C22.1 18.9 21.6 19 21.2 18.8C18.6 17.2 14.7 16.7 10.9 17.9C10.5 18 10 17.8 9.9 17.3C9.8 16.9 10 16.4 10.5 16.3C14.7 15 19 15.5 22 17.3C22.4 17.6 22.6 18.1 22.4 18.5ZM22.6 15.4C19.4 13.5 14.1 13.3 11.1 14.2C10.6 14.4 10.1 14.1 9.9 13.6C9.7 13.1 10 12.6 10.5 12.4C14 11.3 19.9 11.5 23.6 13.7C24 13.9 24.2 14.5 23.9 14.9C23.7 15.4 23.1 15.6 22.6 15.4Z" fill="white" />
                </svg>
              </a>
            </div>

            {/* Address Text */}
            <div className="text-[11px] text-[#94A3B8] font-medium leading-relaxed lg:text-right">
              Miyapur, Hyderabad<br />
              500049, India
            </div>
          </div>

        </div>

        {/* Bottom Legal Links Divider */}
        <div className="pt-6 border-t border-[#EAF1F6] flex items-center justify-center gap-3 text-xs text-[#677F9B] font-medium">
          <Link href="/terms" className="hover:text-[#3E4FEA] transition">
            Terms and Conditions
          </Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-[#3E4FEA] transition">
            Privacy Policy
          </Link>
        </div>

      </div>
    </footer>
  );
}
