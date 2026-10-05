"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GlobeAltIcon,
  PlusIcon,
  PencilSquareIcon,
  PencilIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { PlatformActionsDropdown } from "@/components/publisher/platform-actions-dropdown";

interface PublisherPlatformListProps {
  platforms: any[];
}

export function PublisherPlatformList({ platforms }: PublisherPlatformListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReviewsId, setExpandedReviewsId] = useState<string | null>(null);
  const pageSize = 50;

  const totalPages = Math.ceil(platforms.length / pageSize) || 1;
  const paginatedPlatforms = platforms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (platforms.length === 0) {
    return (
      <div className="card empty-state-container">
        <div className="empty-state">
          <GlobeAltIcon className="w-12 h-12 text-muted mb-4" />
          <p className="font-space font-medium text-dark text-lg m-0">No platforms listed yet</p>
          <p className="text-muted max-w-sm text-center">
            Add your first website to start receiving paid content creation, guest post placement, or link insertion orders.
          </p>
          <Link href="/publisher/platforms/new" className="btn btn-primary mt-2">
            <PlusIcon className="w-4 h-4" /> Add Website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Pagination Summary */}
      <div className="flex justify-between items-center mb-4 text-xs text-slate-500">
        <span>
          Showing <strong>{((currentPage - 1) * pageSize) + 1}</strong> - <strong>{Math.min(currentPage * pageSize, platforms.length)}</strong> of <strong>{platforms.length.toLocaleString()}</strong> platforms
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

      {/* Platforms Grid */}
      <div className="platforms-grid flex flex-col gap-6">
        {paginatedPlatforms.map((platform: any) => (
          <div key={platform.id} className="card bg-card border-base rounded-lg p-6 relative">
            {/* Top Row: URL, Status, Actions */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-space font-semibold text-lg hover:underline"
                >
                  {platform.url}
                </a>
                <span className="badge badge-pending flex items-center gap-1">
                  Verified
                </span>
                <span className="badge bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded border border-slate-200">
                  {platform.niche || "General"}
                </span>

                {/* Previous Work Link */}
                {platform.sampleUrl && (
                  <a
                    href={platform.sampleUrl.startsWith("http") ? platform.sampleUrl : `https://${platform.sampleUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-bold transition-all hover:scale-105"
                    title="View submitted previous work"
                  >
                    <span>Work</span>
                    <ArrowTopRightOnSquareIcon className="w-3 h-3 text-blue-600" />
                  </a>
                )}

                {/* Reviews & Ratings badge */}
                {(() => {
                  const reviewsCount = platform.reviews?.length || 0;
                  const avgRating =
                    reviewsCount > 0
                      ? (
                          platform.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewsCount
                        ).toFixed(1)
                      : null;

                  return (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedReviewsId(expandedReviewsId === platform.id ? null : platform.id)
                      }
                      className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm transition-all"
                      title="Click to view advertiser reviews"
                    >
                      <StarIcon className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{avgRating ? `${avgRating} (${reviewsCount} ${reviewsCount === 1 ? 'review' : 'reviews'})` : "No reviews yet"}</span>
                    </button>
                  );
                })()}
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-success text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-success"></span> Active
                </span>
                <Link
                  href={`/publisher/platforms/new?edit=${platform.id}`}
                  className="btn btn-outline flex items-center gap-2 btn-sm text-dark font-inter"
                  style={{ padding: "6px 12px" }}
                >
                  <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                </Link>
                <PlatformActionsDropdown platformId={platform.id} url={platform.url} />
              </div>
            </div>

            {/* Data Table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
              {/* Col 1: Status & Info */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold block mb-1" style={{ color: "#64748b" }}>
                    Status
                  </span>
                  <span
                    className="font-bold text-sm"
                    style={{
                      color:
                        platform.status === "ACTIVE"
                          ? "#059669"
                          : platform.status === "REJECTED"
                            ? "#dc2626"
                            : "#d97706",
                    }}
                  >
                    {platform.status === "ACTIVE"
                      ? "Approved"
                      : platform.status === "REJECTED"
                        ? "Rejected"
                        : "Pending specification"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold block mb-1" style={{ color: "#64748b" }}>
                    Country &amp; Language
                  </span>
                  <span className="font-bold text-sm" style={{ color: "#1e293b" }}>
                    {platform.country || "United States"} • {platform.language || "English"}
                  </span>
                </div>
              </div>

              {/* Col 2: SEO Metrics & Turnaround */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold block mb-1" style={{ color: "#64748b" }}>
                    Domain Metrics (DA / DR)
                  </span>
                  <span className="font-bold text-sm" style={{ color: "#1e293b" }}>
                    DA: {platform.da ?? 0} | DR: {platform.dr ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold block mb-1" style={{ color: "#64748b" }}>
                    Monthly Organic Traffic
                  </span>
                  <span className="font-bold text-sm" style={{ color: "#1e293b" }}>
                    {(platform.traffic ?? 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold block mb-1" style={{ color: "#64748b" }}>
                    Turnaround Time (TAT)
                  </span>
                  <span className="font-bold text-sm" style={{ color: "#1e293b" }}>
                    {platform.packages?.[0]?.turnaround ? `${platform.packages[0].turnaround} Days` : "7 Days"}
                  </span>
                </div>
              </div>

              {/* Col 3: Packages */}
              <div className="flex flex-col">
                <div className="border-b border-gray-200 pb-2 mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold block" style={{ color: "#64748b" }}>
                    Package Rates &amp; Pricing
                  </span>
                  {(!platform.packages || platform.packages.length === 0 || !platform.packages.some((p: any) => p.price > 0)) && (
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Request Pricing
                    </span>
                  )}
                </div>
                {platform.packages && platform.packages.some((p: any) => p.price > 0) ? (
                  <div className="space-y-3">
                    {platform.packages.find((p: any) => p.type === "ARTICLE_POSTING" && p.price > 0) && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium" style={{ color: "#475569" }}>
                          Content placement (Guest Post)
                        </span>
                        <span className="font-bold font-space flex items-center gap-1.5" style={{ color: "#0f172a" }}>
                          ${platform.packages.find((p: any) => p.type === "ARTICLE_POSTING")?.price?.toFixed(2)}
                          <Link href={`/publisher/platforms/new?edit=${platform.id}`}>
                            <PencilIcon className="w-3.5 h-3.5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                          </Link>
                        </span>
                      </div>
                    )}
                    {platform.packages.find((p: any) => p.type === "LINK_INSERTION" && p.price > 0) && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium" style={{ color: "#475569" }}>
                          Link insertion
                        </span>
                        <span className="font-bold font-space flex items-center gap-1.5" style={{ color: "#0f172a" }}>
                          ${platform.packages.find((p: any) => p.type === "LINK_INSERTION")?.price?.toFixed(2)}
                          <Link href={`/publisher/platforms/new?edit=${platform.id}`}>
                            <PencilIcon className="w-3.5 h-3.5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                          </Link>
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900">
                    <p className="font-semibold mb-1">Pricing on Request</p>
                    <p className="text-[11px] text-amber-800">
                      Advertisers will click &quot;Request Pricing&quot; to send you direct requirements.
                    </p>
                    <Link
                      href={`/publisher/platforms/new?edit=${platform.id}`}
                      className="inline-flex items-center gap-1 text-primary font-bold text-xs mt-2 hover:underline"
                    >
                      <PencilIcon className="w-3 h-3" /> Set fixed prices
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Expandable Advertiser Reviews Drawer */}
            {expandedReviewsId === platform.id && (
              <div className="mt-5 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-space flex items-center gap-1.5">
                    <StarIcon className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Advertiser Reviews &amp; Feedback ({platform.reviews?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setExpandedReviewsId(null)}
                    className="text-xs text-muted hover:text-dark font-medium underline"
                  >
                    Close
                  </button>
                </div>

                {platform.reviews && platform.reviews.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                    {platform.reviews.map((r: any) => (
                      <div key={r.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                              {r.user?.name ? r.user.name.charAt(0).toUpperCase() : "A"}
                            </div>
                            <span className="text-xs font-bold text-slate-900">
                              {r.user?.name || "Advertiser"}
                            </span>
                          </div>
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <StarIcon key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        {r.comment ? (
                          <p className="text-xs text-slate-600 leading-relaxed font-inter">{r.comment}</p>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No written comment provided.</p>
                        )}
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(r.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
                    No advertiser reviews submitted yet for this website platform.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-between items-center mt-8 p-4 bg-white border border-slate-200 rounded-xl shadow-sm gap-4">
          <span className="text-xs text-slate-600 font-medium">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({platforms.length.toLocaleString()} total platforms)
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
    </>
  );
}
