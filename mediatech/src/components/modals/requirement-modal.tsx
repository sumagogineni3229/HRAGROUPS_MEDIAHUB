"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface RequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWebsite?: string;
}

export function RequirementModal({
  isOpen,
  onClose,
  defaultWebsite = "",
}: RequirementModalProps) {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specificWebsite, setSpecificWebsite] = useState(defaultWebsite);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (defaultWebsite) {
      setSpecificWebsite(defaultWebsite);
    }
  }, [defaultWebsite]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Extract HubSpot tracking cookie if present
    let hubspotUtk = "";
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/);
      if (match) {
        hubspotUtk = match[1];
      }
    }

    try {
      const res = await fetch("/api/submit-requirement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          companyName,
          email,
          phone,
          specificWebsite,
          query,
          hubspotUtk,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit requirement.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setCompanyName("");
    setEmail("");
    setPhone("");
    setSpecificWebsite("");
    setQuery("");
    setSubmitted(false);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Submit Custom Requirement</span>
          </div>
          <h2 className="text-xl font-bold font-space text-white">
            Can&apos;t find your target site?
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Tell us your exact goals, and our media team will match you with vetted publishers.
          </p>
        </div>

        {/* Security & Confidentiality Notice */}
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-6 py-3.5 flex items-start gap-3 text-amber-900 text-xs">
          <ShieldCheckIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            Due to security and publisher confidentiality agreements, we do not publish our complete inventory publicly on Media Hub. Submit your requirements below, and our dedicated team will provide the available inventory and verified pricing.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-space">Requirement Received!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. A member of our Media Hub team will review your requirement and follow up with you at <strong>{email}</strong> shortly.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                  {error}
                </div>
              )}

              {/* Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Specific Website in Mind */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Website in Mind? <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={specificWebsite}
                  onChange={(e) => setSpecificWebsite(e.target.value)}
                  placeholder="e.g. techcrunch.com, forbes.com or niche domains"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Requirement Query */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Write Your Query / Requirement <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your niche, preferred DA/DR, traffic range, turnaround time, or any target media goals..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-4 h-4" />
                      Submit Requirement
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
