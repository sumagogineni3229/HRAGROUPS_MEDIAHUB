"use client";

import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export interface PricingEnquiryItem {
  id: string;
  name: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  specificWebsite: string | null;
  query: string;
  type: string;
  status: string;
  adminNotes: string | null;
  hubspotContactId: string | null;
  hubspotUtk: string | null;
  createdAt: string;
  platform?: {
    id: string;
    url: string;
    niche: string;
    da: number;
    dr?: number;
    country: string;
    packages?: any[];
  } | null;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface PriceManagementClientProps {
  initialEnquiries: PricingEnquiryItem[];
  isCompanyPublisher?: boolean;
}

export function PriceManagementClient({ initialEnquiries, isCompanyPublisher = false }: PriceManagementClientProps) {
  const [enquiries, setEnquiries] = useState<PricingEnquiryItem[]>(initialEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<PricingEnquiryItem | null>(
    initialEnquiries[0] || null
  );
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Price Setting States
  const [placementPrice, setPlacementPrice] = useState("");
  const [writingPrice, setWritingPrice] = useState("");
  const [specialTopicPrice, setSpecialTopicPrice] = useState("");
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [priceSuccessMessage, setPriceSuccessMessage] = useState("");
  const [priceErrorMessage, setPriceErrorMessage] = useState("");

  // Notes state
  const [editNotes, setEditNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Sync selected notes and pricing when selection changes
  const handleSelectEnquiry = (enquiry: PricingEnquiryItem) => {
    setSelectedEnquiry(enquiry);
    setEditNotes(enquiry.adminNotes || "");
    setPriceSuccessMessage("");
    setPriceErrorMessage("");

    const articlePkg = enquiry.platform?.packages?.find((p: any) => p.type === "ARTICLE_POSTING");
    const linkPkg = enquiry.platform?.packages?.find((p: any) => p.type === "LINK_INSERTION");
    const pressPkg = enquiry.platform?.packages?.find((p: any) => p.type === "PRESS_RELEASE");

    setPlacementPrice(articlePkg?.price ? String(articlePkg.price) : "");
    setWritingPrice(linkPkg?.price ? String(linkPkg.price) : "");
    setSpecialTopicPrice(pressPkg?.price ? String(pressPkg.price) : "");
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleSavePrice = async () => {
    if (!selectedEnquiry?.platform?.id) return;
    setIsSavingPrice(true);
    setPriceSuccessMessage("");
    setPriceErrorMessage("");

    try {
      const res = await fetch("/api/admin/enquiries/update-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformId: selectedEnquiry.platform.id,
          enquiryId: selectedEnquiry.id,
          placementPrice: placementPrice ? parseFloat(placementPrice) : 0,
          writingPrice: writingPrice ? parseFloat(writingPrice) : 0,
          specialTopicPrice: specialTopicPrice ? parseFloat(specialTopicPrice) : 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to set platform pricing");
      }

      setPriceSuccessMessage("Pricing updated successfully! Marketplace rates have been updated.");
      
      // Update local state
      setEnquiries((prev) =>
        prev.map((e) => {
          if (e.id === selectedEnquiry.id) {
            return {
              ...e,
              status: "RESOLVED",
              platform: e.platform
                ? {
                    ...e.platform,
                    packages: data.platform?.packages || e.platform.packages,
                  }
                : e.platform,
            };
          }
          return e;
        })
      );

      if (selectedEnquiry) {
        setSelectedEnquiry((prev) =>
          prev
            ? {
                ...prev,
                status: "RESOLVED",
                platform: prev.platform
                  ? {
                      ...prev.platform,
                      packages: data.platform?.packages || prev.platform.packages,
                    }
                  : prev.platform,
              }
            : null
        );
      }
    } catch (err: any) {
      setPriceErrorMessage(err.message || "Failed to update pricing.");
    } finally {
      setIsSavingPrice(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: editNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) =>
            e.id === selectedEnquiry.id ? { ...e, adminNotes: editNotes } : e
          )
        );
        setSelectedEnquiry((prev) => (prev ? { ...prev, adminNotes: editNotes } : null));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this request?")) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered List
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    const matchesType = typeFilter === "ALL" || (typeFilter === "PRICING_REQUEST" ? e.type === "PRICING_REQUEST" : e.type !== "PRICING_REQUEST");
    const matchesSearch =
      searchTerm === "" ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.companyName && e.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.specificWebsite && e.specificWebsite.toLowerCase().includes(searchTerm.toLowerCase())) ||
      e.query.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">New Request</span>;
      case "IN_PROGRESS":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold">In Review</span>;
      case "CONTACTED":
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-bold">Quoted / Contacted</span>;
      case "RESOLVED":
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">Price Set &amp; Live</span>;
      case "ARCHIVED":
        return <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">Archived</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">{status}</span>;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-space text-slate-900">Price Management &amp; Requests</h1>
            {isCompanyPublisher && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                🏢 Company Publisher Portal
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage incoming advertiser quote requests, review requirements, and set custom website package pricing in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
            Total Requests: {enquiries.length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, company, domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Type & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setTypeFilter("ALL")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                typeFilter === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter("PRICING_REQUEST")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                typeFilter === "PRICING_REQUEST" ? "bg-white text-amber-700 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Price Quotes Only
            </button>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {["ALL", "NEW", "IN_PROGRESS", "CONTACTED", "RESOLVED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === status
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: List + Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Requests List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[750px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 font-space flex items-center justify-between">
            <span>Incoming Inquiries ({filteredEnquiries.length})</span>
            <FunnelIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                No inquiries matching criteria
              </div>
            ) : (
              filteredEnquiries.map((enquiry) => {
                const isSelected = selectedEnquiry?.id === enquiry.id;
                const isQuote = enquiry.type === "PRICING_REQUEST";
                return (
                  <div
                    key={enquiry.id}
                    onClick={() => handleSelectEnquiry(enquiry)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-amber-50/80 border-l-4 border-amber-500"
                        : "hover:bg-slate-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {enquiry.name}
                        </span>
                        {isQuote && (
                          <span className="text-[10px] uppercase font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                            Quote
                          </span>
                        )}
                      </div>
                      {getStatusBadge(enquiry.status)}
                    </div>

                    <p className="text-xs text-slate-600 font-medium truncate mb-1">
                      {enquiry.email} {enquiry.companyName && `· ${enquiry.companyName}`}
                    </p>

                    {enquiry.specificWebsite && (
                      <div className="text-[11px] font-semibold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded inline-block mb-1">
                        🎯 {enquiry.specificWebsite}
                      </div>
                    )}

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                      {enquiry.query}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1" suppressHydrationWarning>
                        <ClockIcon className="w-3 h-3" />
                        {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Detail & Pricing Action Pane */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-[750px] overflow-y-auto">
          {selectedEnquiry ? (
            <div className="space-y-6">
              {/* Header Details */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 font-space">
                      {selectedEnquiry.name}
                    </h2>
                    {selectedEnquiry.type === "PRICING_REQUEST" && (
                      <span className="bg-amber-100 text-amber-800 text-[11px] px-2 py-0.5 rounded-full font-bold">
                        Direct Price Quote Request
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5" suppressHydrationWarning>
                    Submitted on{" "}
                    {new Date(selectedEnquiry.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleUpdateStatus(selectedEnquiry.id, e.target.value)}
                    disabled={loadingId === selectedEnquiry.id}
                    className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="NEW">Status: New</option>
                    <option value="IN_PROGRESS">Status: In Progress</option>
                    <option value="CONTACTED">Status: Contacted</option>
                    <option value="RESOLVED">Status: Resolved (Price Set)</option>
                    <option value="ARCHIVED">Status: Archived</option>
                  </select>

                  <button
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    title="Delete Request"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Client Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <EnvelopeIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-500">Email:</span>
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="text-amber-600 font-bold hover:underline truncate"
                    >
                      {selectedEnquiry.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <PhoneIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-500">Phone:</span>
                    <span className="font-bold text-slate-900">
                      {selectedEnquiry.phone || "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <BuildingOfficeIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-500">Company:</span>
                    <span className="font-bold text-slate-900">
                      {selectedEnquiry.companyName || "Not provided"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <GlobeAltIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-500">Target Website:</span>
                    <span className="font-bold text-amber-700">
                      {selectedEnquiry.specificWebsite || "Any / General Requirement"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SET / UPDATE WEBSITE PRICING SECTION */}
              {selectedEnquiry.platform ? (
                <div className="bg-gradient-to-br from-amber-50/70 to-indigo-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="w-5 h-5 text-amber-600" />
                      <h3 className="font-space font-bold text-slate-900 text-sm">
                        Set Marketplace Prices for {selectedEnquiry.platform.url}
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold bg-white border border-amber-200 text-amber-900 px-2.5 py-1 rounded-full">
                      DA {selectedEnquiry.platform.da || "—"} · {selectedEnquiry.platform.niche || "General"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Entering prices here will update the public package pricing for this website so the advertiser can immediately order.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Content Placement ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="e.g. 50.00"
                          value={placementPrice}
                          onChange={(e) => setPlacementPrice(e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Writing &amp; Placement ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="e.g. 75.00"
                          value={writingPrice}
                          onChange={(e) => setWritingPrice(e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Special Topic ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="e.g. 100.00"
                          value={specialTopicPrice}
                          onChange={(e) => setSpecialTopicPrice(e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {priceSuccessMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      {priceSuccessMessage}
                    </div>
                  )}

                  {priceErrorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                      {priceErrorMessage}
                    </div>
                  )}

                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleSavePrice}
                      disabled={isSavingPrice}
                      className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      {isSavingPrice ? (
                        <>
                          <ArrowPathIcon className="w-4 h-4 animate-spin" /> Updating Marketplace Rates...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-4 h-4" /> Save &amp; Publish Prices
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : selectedEnquiry.specificWebsite ? (
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/80 text-xs text-amber-900">
                  <p className="font-semibold mb-1">Target Website: {selectedEnquiry.specificWebsite}</p>
                  <p className="text-[11px] text-amber-800">
                    This inquiry was submitted for custom domain <strong>{selectedEnquiry.specificWebsite}</strong>. Reply to the client directly via email with your custom quotation.
                  </p>
                </div>
              ) : null}

              {/* Requirement Query Message */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-space">
                  Client Requirement / Message
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.query}
                </div>
              </div>

              {/* Follow-up Notes */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-space">
                    Internal Follow-up Notes &amp; History
                  </h3>
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    {isSavingNotes ? (
                      <>
                        <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save Notes"
                    )}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add internal notes on publisher outreach, pricing quoted, or follow-up status..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Follow-up Quick Action */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Media Hub - Regarding your enquiry for ${selectedEnquiry.specificWebsite || "Media Inventory"}`}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-center py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  Reply via Email &rarr;
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs font-medium">
              Select an inquiry from the left to view details, set custom rates, and manage quotes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
