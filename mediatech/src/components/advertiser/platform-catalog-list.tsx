"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBagIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { RequirementModal } from "@/components/modals/requirement-modal";
import { RequestPricingModal } from "@/components/modals/request-pricing-modal";

interface PlatformCatalogProps {
  platforms: any[];
}

function cleanUrl(url: string) {
  try {
    const formatted = url.startsWith("http") ? url : `https://${url}`;
    const parsed = new URL(formatted);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function PlatformCatalogList({ platforms }: PlatformCatalogProps) {
  const [generalModalOpen, setGeneralModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const totalPages = Math.ceil(platforms.length / pageSize) || 1;
  const paginatedPlatforms = platforms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenGeneralRequirement = () => {
    setSelectedSite("");
    setSelectedPlatformId(undefined);
    setGeneralModalOpen(true);
  };

  const handleRequestPricing = (siteUrl: string, platformId: string) => {
    setSelectedSite(cleanUrl(siteUrl));
    setSelectedPlatformId(platformId);
    setPricingModalOpen(true);
  };

  return (
    <>
      {/* Banner: Complete Website Inventory Notice + Submit Requirement CTA */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <SparklesIcon className="w-3.5 h-3.5" /> Confidential &amp; Verified Inventory
          </div>
          <h3 className="text-base font-bold font-space text-white">
            Need a specific high-authority publication or niche website?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Due to security and publisher exclusivity, only a curated preview is displayed publicly. Submit your requirement, and our team will match your target domain or custom niche criteria immediately.
          </p>
        </div>
        <button
          onClick={handleOpenGeneralRequirement}
          className="shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
        >
          <ChatBubbleLeftRightIcon className="w-4 h-4" /> Submit Your Requirement
        </button>
      </div>

      {/* Pagination Top Summary */}
      <div className="flex justify-between items-center mb-4 text-xs text-slate-500">
        <span>
          Showing <strong>{((currentPage - 1) * pageSize) + 1}</strong> - <strong>{Math.min(currentPage * pageSize, platforms.length)}</strong> of <strong>{platforms.length.toLocaleString()}</strong> websites
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="px-3 py-1 rounded bg-white border border-slate-200 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              &larr; Prev
            </button>
            <span className="font-semibold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="px-3 py-1 rounded bg-white border border-slate-200 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Website Listings Grid */}
      <div className="platforms-grid flex flex-col gap-6">
        {paginatedPlatforms.map((platform: any) => {
          const domainName = cleanUrl(platform.url);

          const articlePkg = platform.packages?.find((p: any) => p.type === "ARTICLE_POSTING" && p.isActive);
          const linkPkg = platform.packages?.find((p: any) => p.type === "LINK_INSERTION" && p.isActive);
          const pressPkg = platform.packages?.find((p: any) => p.type === "PRESS_RELEASE" && p.isActive);

          // Check if explicit pricing is available
          const hasPricing = Boolean(
            (articlePkg && articlePkg.price > 0) ||
            (linkPkg && linkPkg.price > 0) ||
            (pressPkg && pressPkg.price > 0)
          );

          const isDoFollow = platform.packages?.some((p: any) => p.isDoFollow) ?? true;
          const turnaroundDays = articlePkg?.turnaround || linkPkg?.turnaround || pressPkg?.turnaround || 7;

          return (
            <div
              key={platform.id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 space-y-6"
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={platform.url.startsWith("http") ? platform.url : `https://${platform.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 font-bold text-lg hover:underline flex items-center gap-1.5 font-space"
                  >
                    {domainName}
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 text-amber-500" />
                  </a>

                  {/* Verified Badge */}
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" /> Verified Publisher
                  </span>

                  {/* Niche Badge */}
                  <span className="bg-slate-900 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {platform.niche || "General"}
                  </span>
                </div>

                {/* Pricing / Action Button */}
                <div className="flex items-center gap-3">
                  {hasPricing ? (
                    <Link
                      href={`/advertiser/tasks/new?platformId=${platform.id}`}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-5 py-2 rounded-lg inline-flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <ShoppingBagIcon className="w-4 h-4" /> Order Placement
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleRequestPricing(platform.url, platform.id)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-sm px-5 py-2 rounded-lg inline-flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-indigo-600" /> Request Pricing
                    </button>
                  )}
                </div>
              </div>

              {/* Metric Card Grid Body with Vertical Dividers - exact fields from Publisher Form */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 text-xs">
                {/* Col 1: Publishing TAT */}
                <div className="space-y-1 pr-3 pb-3 sm:pb-0">
                  <span className="text-slate-600 font-medium block">Publishing Speed (TAT)</span>
                  <span className="text-slate-900 font-bold text-sm block mt-1">{turnaroundDays} {turnaroundDays === 1 ? "Day" : "Days"}</span>
                </div>

                {/* Col 2: SEO Metrics (DA & DR) */}
                <div className="space-y-3 px-0 sm:px-4 py-3 sm:py-0">
                  <div>
                    <span className="text-slate-600 font-medium block">Moz DA</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">{platform.da ?? 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium block">Ahrefs DR</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">{platform.dr ?? 0}</span>
                  </div>
                </div>

                {/* Col 3: Organic Traffic */}
                <div className="space-y-3 px-0 sm:px-4 py-3 sm:py-0">
                  <div>
                    <span className="text-slate-600 font-medium block">Organic Traffic</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">
                      {(platform.traffic ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Col 4: Location & Language */}
                <div className="space-y-3 px-0 sm:px-4 py-3 sm:py-0">
                  <div>
                    <span className="text-slate-600 font-medium block">Language</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">
                      {platform.language || "English"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium block">Country</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">
                      {platform.country || "Global"}
                    </span>
                  </div>
                </div>

                {/* Col 5: Link Type */}
                <div className="space-y-3 px-0 sm:px-4 py-3 sm:py-0">
                  <div>
                    <span className="text-slate-600 font-medium block mb-1">Link Type</span>
                    <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded text-xs border border-emerald-200">
                      {isDoFollow ? "Dofollow" : "Nofollow"}
                    </span>
                  </div>
                </div>

                {/* Col 6: Service Rates */}
                <div className="space-y-3 pl-0 sm:pl-4 pt-3 sm:pt-0">
                  {hasPricing ? (
                    <>
                      {articlePkg && articlePkg.price > 0 && (
                        <div>
                          <span className="text-slate-600 font-medium block">Content placement</span>
                          <span className="font-bold text-slate-900 text-base block mt-0.5 font-space">
                            ${articlePkg.price.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {linkPkg && linkPkg.price > 0 && (
                        <div>
                          <span className="text-slate-600 font-medium block">Writing &amp; Placement</span>
                          <span className="font-bold text-slate-900 text-base block mt-0.5 font-space">
                            ${linkPkg.price.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {pressPkg && pressPkg.price > 0 && (
                        <div>
                          <span className="text-slate-600 font-medium block">Special Topic</span>
                          <span className="font-bold text-slate-900 text-base block mt-0.5 font-space">
                            ${pressPkg.price.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-2">
                      <span className="text-xs text-slate-400 font-medium block mb-2">Custom Pricing</span>
                      <button
                        onClick={() => handleRequestPricing(platform.url, platform.id)}
                        className="text-amber-600 font-bold text-xs hover:underline flex items-center gap-1"
                      >
                        Request pricing quote &rarr;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Bottom Bar */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-between items-center mt-8 p-4 bg-white border border-slate-200 rounded-xl shadow-sm gap-4">
          <span className="text-xs text-slate-600 font-medium">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({platforms.length.toLocaleString()} total websites)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(1);
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &larr; Previous
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
              {currentPage}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(totalPages);
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* 1. General Requirement Modal (Triggered by Top Banner only) */}
      <RequirementModal
        isOpen={generalModalOpen}
        onClose={() => setGeneralModalOpen(false)}
      />

      {/* 2. Direct Price Request Modal (Triggered by 'Request pricing quote' on platform card only) */}
      <RequestPricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        targetWebsite={selectedSite}
        platformId={selectedPlatformId}
      />
    </>
  );
}
