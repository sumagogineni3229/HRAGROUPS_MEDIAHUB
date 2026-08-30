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
} from "@heroicons/react/24/outline";

interface EnquiryItem {
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
    country: string;
  } | null;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface AdminEnquiriesClientProps {
  initialEnquiries: EnquiryItem[];
}

export function AdminEnquiriesClient({ initialEnquiries }: AdminEnquiriesClientProps) {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(
    initialEnquiries[0] || null
  );
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Sync selected notes when selection changes
  const handleSelectEnquiry = (enquiry: EnquiryItem) => {
    setSelectedEnquiry(enquiry);
    setEditNotes(enquiry.adminNotes || "");
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
    if (!confirm("Are you sure you want to permanently delete this enquiry?")) return;
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
    const matchesSearch =
      searchTerm === "" ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.companyName && e.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.specificWebsite && e.specificWebsite.toLowerCase().includes(searchTerm.toLowerCase())) ||
      e.query.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">New</span>;
      case "IN_PROGRESS":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold">In Progress</span>;
      case "CONTACTED":
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-bold">Contacted</span>;
      case "RESOLVED":
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">Resolved</span>;
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
          <span className="text-xs text-muted font-inter">Admin &gt; Enquiries</span>
          <h1 className="text-2xl font-bold font-space text-slate-900 mt-1">Client Requirements &amp; Enquiries</h1>
          <p className="text-xs text-slate-500">Manage incoming quote requests, website queries, and client specifications.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
            Total: {enquiries.length} submissions
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

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "NEW", "IN_PROGRESS", "CONTACTED", "RESOLVED", "ARCHIVED"].map((status) => (
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

      {/* Two Column Layout: List + Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Enquiry List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[700px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 font-space flex items-center justify-between">
            <span>Enquiries ({filteredEnquiries.length})</span>
            <FunnelIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                No enquiries matching filter
              </div>
            ) : (
              filteredEnquiries.map((enquiry) => {
                const isSelected = selectedEnquiry?.id === enquiry.id;
                return (
                  <div
                    key={enquiry.id}
                    onClick={() => handleSelectEnquiry(enquiry)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-amber-50/70 border-l-4 border-amber-500"
                        : "hover:bg-slate-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {enquiry.name}
                      </span>
                      {getStatusBadge(enquiry.status)}
                    </div>

                    <p className="text-xs text-slate-600 font-medium truncate mb-1">
                      {enquiry.email} {enquiry.companyName && `· ${enquiry.companyName}`}
                    </p>

                    {enquiry.specificWebsite && (
                      <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block mb-1">
                        🎯 {enquiry.specificWebsite}
                      </div>
                    )}

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {enquiry.query}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                      <span className="capitalize text-slate-500 font-medium">
                        {enquiry.type.replace("_", " ").toLowerCase()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Enquiry Detail & Action Panel */}
        <div className="lg:col-span-7">
          {selectedEnquiry ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
              {/* Header Details */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold font-space text-slate-900">
                      {selectedEnquiry.name}
                    </h2>
                    {getStatusBadge(selectedEnquiry.status)}
                  </div>
                  <span className="text-xs text-slate-400">
                    Received on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </span>
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
                    <option value="RESOLVED">Status: Resolved</option>
                    <option value="ARCHIVED">Status: Archived</option>
                  </select>

                  <button
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    title="Delete Enquiry"
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
                    <span className="font-medium text-slate-500">Target Domain:</span>
                    <span className="font-bold text-amber-700">
                      {selectedEnquiry.specificWebsite || "Any / General Requirement"}
                    </span>
                  </div>
                </div>
              </div>

              {/* HubSpot & Link Attribution Tracking Info */}
              {(selectedEnquiry.hubspotUtk || selectedEnquiry.hubspotContactId) && (
                <div className="p-3 bg-indigo-50 border border-indigo-200/70 rounded-lg text-xs text-indigo-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span><strong>HubSpot Tracking Connected:</strong> Visitor Token &amp; Link Attribution Synced</span>
                  </div>
                  {selectedEnquiry.hubspotContactId && (
                    <span className="text-[11px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                      ID: {selectedEnquiry.hubspotContactId}
                    </span>
                  )}
                </div>
              )}

              {/* Requirement Query Message */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-space">
                  Client Requirement / Message
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.query}
                </div>
              </div>

              {/* Admin Internal Follow-up Notes */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-space">
                    Admin Follow-up Notes &amp; History
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
                  rows={4}
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
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-center py-2.5 rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  Reply via Email &rarr;
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs font-medium">
              Select an enquiry from the left to view details and manage follow-ups.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
