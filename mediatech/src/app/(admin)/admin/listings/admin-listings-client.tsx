"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  XCircleIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  PencilSquareIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { SOCIAL_PLATFORMS, getSocialPlatformLabel, getSocialProfileUrl } from "@/lib/social-platforms";
import { INFLUENCER_CATEGORIES } from "@/lib/categories";
import { CountrySelect } from "@/components/ui/country-select";
import {
  approvePlatformAction,
  rejectPlatformAction,
  approveChannelAction,
  rejectChannelAction,
} from "./actions";

interface AdminListingsClientProps {
  pendingPlatforms: any[];
  pendingChannels: any[];
  tab: string;
}

export function AdminListingsClient({
  pendingPlatforms,
  pendingChannels,
  tab,
}: AdminListingsClientProps) {
  const [isPending, startTransition] = useTransition();

  // Edit Modals State
  const [editingPlatform, setEditingPlatform] = useState<any | null>(null);
  const [editingChannel, setEditingChannel] = useState<any | null>(null);

  // Reject Notes State
  const [platformRejectNotes, setPlatformRejectNotes] = useState<Record<string, string>>({});
  const [channelRejectNotes, setChannelRejectNotes] = useState<Record<string, string>>({});

  // Quick Approval Handlers
  const handleQuickApprovePlatform = (p: any) => {
    if (!confirm(`Are you sure you want to approve ${p.url}?`)) return;
    const formData = new FormData();
    formData.append("platformId", p.id);
    startTransition(async () => {
      await approvePlatformAction(formData);
    });
  };

  const handleQuickApproveChannel = (c: any) => {
    if (!confirm(`Are you sure you want to approve @${c.handle}?`)) return;
    const formData = new FormData();
    formData.append("channelId", c.id);
    startTransition(async () => {
      await approveChannelAction(formData);
    });
  };

  // Rejection Handlers
  const handleRejectPlatform = (platformId: string) => {
    const note = platformRejectNotes[platformId] || "";
    if (!confirm("Are you sure you want to reject this website listing?")) return;
    const formData = new FormData();
    formData.append("platformId", platformId);
    formData.append("note", note);
    startTransition(async () => {
      await rejectPlatformAction(formData);
      setPlatformRejectNotes((prev) => ({ ...prev, [platformId]: "" }));
    });
  };

  const handleRejectChannel = (channelId: string) => {
    const note = channelRejectNotes[channelId] || "";
    if (!confirm("Are you sure you want to reject this channel listing?")) return;
    const formData = new FormData();
    formData.append("channelId", channelId);
    formData.append("note", note);
    startTransition(async () => {
      await rejectChannelAction(formData);
      setChannelRejectNotes((prev) => ({ ...prev, [channelId]: "" }));
    });
  };

  // Modal Submit Handlers (Edit + Approve)
  const handleSaveAndApprovePlatform = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const res = await approvePlatformAction(formData);
      if (res.success) {
        setEditingPlatform(null);
      } else {
        alert(res.error || "Failed to update and approve platform");
      }
    });
  };

  const handleSaveAndApproveChannel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const res = await approveChannelAction(formData);
      if (res.success) {
        setEditingChannel(null);
      } else {
        alert(res.error || "Failed to update and approve channel");
      }
    });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Admin &gt; Listings</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-1">Listings Approval Queue</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-app rounded-xl p-1 border border-border" style={{ width: "fit-content" }}>
        <Link
          href="/admin/listings?tab=platforms"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-inter transition-colors ${tab === "platforms" ? "bg-card text-dark shadow-sm" : "text-muted hover:text-dark"
            }`}
        >
          <GlobeAltIcon className="w-4 h-4" />
          Websites
          {pendingPlatforms.length > 0 && (
            <span className="bg-danger text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">
              {pendingPlatforms.length}
            </span>
          )}
        </Link>
        <Link
          href="/admin/listings?tab=channels"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-inter transition-colors ${tab === "channels" ? "bg-card text-dark shadow-sm" : "text-muted hover:text-dark"
            }`}
        >
          <DevicePhoneMobileIcon className="w-4 h-4" />
          Channels
          {pendingChannels.length > 0 && (
            <span className="bg-danger text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">
              {pendingChannels.length}
            </span>
          )}
        </Link>
      </div>

      {/* Platforms Tab */}
      {tab === "platforms" && (
        <div className="flex flex-col gap-4">
          {pendingPlatforms.length === 0 ? (
            <div className="card bg-card border-base rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <CheckCircleIcon className="w-10 h-10 text-success mb-3" />
              <p className="font-space font-semibold text-dark">All caught up!</p>
              <p className="text-sm text-muted font-inter mt-1">No websites pending review.</p>
            </div>
          ) : (
            pendingPlatforms.map((p: any) => (
              <div key={p.id} className="card bg-card border-base rounded-xl p-5 shadow-sm hover:border-border-hover transition-all">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <a
                        href={p.url.startsWith("http") ? p.url : `https://${p.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-space font-bold text-dark text-base hover:text-primary flex items-center gap-1.5"
                      >
                        {p.url}
                        <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-muted" />
                      </a>
                    </div>
                    <p className="text-xs text-muted font-inter mt-0.5">
                      by {p.publisher?.name ?? p.publisher?.email} · submitted {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFF8E8] text-warning font-inter flex-shrink-0">
                      PENDING
                    </span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center">
                  {[
                    ["DA", p.da],
                    ["DR", p.dr],
                    ["Traffic", p.traffic?.toLocaleString?.() ?? p.traffic],
                    ["Niche", p.niche],
                  ].map(([label, val]: any) => (
                    <div key={label as string} className="bg-app rounded-lg p-3 border border-border/50">
                      <p className="text-xs text-muted font-inter mb-0.5">{label}</p>
                      <p className="text-sm font-bold font-space text-dark">{val || "—"}</p>
                    </div>
                  ))}
                </div>

                {/* Classification info */}
                <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-muted font-inter bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  <span>
                    <strong className="text-dark font-medium">Country:</strong> {p.country || "Not specified"}
                  </span>
                  <span>
                    <strong className="text-dark font-medium">Language:</strong> {p.language || "English"}
                  </span>
                </div>

                {/* Packages */}
                {p.packages && p.packages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted font-inter mb-2 uppercase tracking-wide">
                      Packages & Rates
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.packages.map((pkg: any) => (
                        <span
                          key={pkg.id}
                          className="text-xs font-inter px-3 py-1.5 bg-[#EEF0FD] text-primary rounded-lg font-semibold border border-primary/10"
                        >
                          {pkg.type.replace(/_/g, " ")} — ${pkg.price}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions: Edit & Approve, Quick Approve, Reject */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-border mt-2 items-stretch sm:items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setEditingPlatform(p)}
                      disabled={isPending}
                      className="btn btn-sm font-space font-semibold flex items-center gap-1.5 bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                      <PencilSquareIcon className="w-4 h-4" /> Edit & Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickApprovePlatform(p)}
                      disabled={isPending}
                      className="btn btn-sm font-space font-semibold flex items-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                      <CheckCircleIcon className="w-4 h-4" /> Quick Approve
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-1 sm:max-w-md">
                    <input
                      type="text"
                      placeholder="Rejection reason (optional)"
                      value={platformRejectNotes[p.id] || ""}
                      onChange={(e) =>
                        setPlatformRejectNotes((prev) => ({ ...prev, [p.id]: e.target.value }))
                      }
                      className="input text-xs py-2 px-3 flex-1 bg-white border border-border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRejectPlatform(p.id)}
                      disabled={isPending}
                      className="btn btn-sm font-space font-semibold flex items-center gap-1.5 bg-rose-600 text-white hover:bg-rose-700 px-3.5 py-2 rounded-lg flex-shrink-0 transition-colors shadow-sm"
                    >
                      <XCircleIcon className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Channels Tab */}
      {tab === "channels" && (
        <div className="flex flex-col gap-4">
          {pendingChannels.length === 0 ? (
            <div className="card bg-card border-base rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <CheckCircleIcon className="w-10 h-10 text-success mb-3" />
              <p className="font-space font-semibold text-dark">All caught up!</p>
              <p className="text-sm text-muted font-inter mt-1">No channels pending review.</p>
            </div>
          ) : (
            pendingChannels.map((c: any) => {
              const profileLink = getSocialProfileUrl(c.platform, c.handle, c.profileUrl);
              return (
                <div key={c.id} className="card bg-card border-base rounded-xl p-5 shadow-sm hover:border-border-hover transition-all">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <a
                          href={profileLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-space font-bold text-dark text-base hover:text-primary flex items-center gap-1.5"
                        >
                          @{c.handle}{" "}
                          <span className="text-sm font-normal text-muted font-inter">
                            ({getSocialPlatformLabel(c.platform)})
                          </span>
                          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-muted" />
                        </a>
                      </div>
                      <p className="text-xs text-muted font-inter mt-0.5">
                        by {c.influencer?.name ?? c.influencer?.email} · submitted {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFF8E8] text-warning font-inter flex-shrink-0">
                        PENDING
                      </span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center">
                    {[
                      ["Followers", c.followers?.toLocaleString?.() ?? c.followers],
                      ["Engagement", `${c.engagement}%`],
                      ["Niche", c.niche],
                      ["Country", c.country],
                    ].map(([label, val]: any) => (
                      <div key={label as string} className="bg-app rounded-lg p-3 border border-border/50">
                        <p className="text-xs text-muted font-inter mb-0.5">{label}</p>
                        <p className="text-sm font-bold font-space text-dark">{val || "—"}</p>
                      </div>
                    ))}
                  </div>

                  {/* Classification info */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-muted font-inter bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                    <span>
                      <strong className="text-dark font-medium">Platform:</strong> {getSocialPlatformLabel(c.platform)}
                    </span>
                    <span>
                      <strong className="text-dark font-medium">Language:</strong> {c.language || "English"}
                    </span>
                    {c.profileUrl && (
                      <span className="truncate max-w-xs">
                        <strong className="text-dark font-medium">Custom URL:</strong> {c.profileUrl}
                      </span>
                    )}
                  </div>

                  {/* Packages */}
                  {c.packages && c.packages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-muted font-inter mb-2 uppercase tracking-wide">
                        Packages & Rates
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {c.packages.map((pkg: any) => (
                          <span
                            key={pkg.id}
                            className="text-xs font-inter px-3 py-1.5 bg-[#EEF0FD] text-primary rounded-lg font-semibold border border-primary/10"
                          >
                            {pkg.type} — ${pkg.price}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions: Edit & Approve, Quick Approve, Reject */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-border mt-2 items-stretch sm:items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setEditingChannel(c)}
                        disabled={isPending}
                        className="btn btn-sm font-space font-semibold flex items-center gap-1.5 bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-lg transition-colors shadow-sm"
                      >
                        <PencilSquareIcon className="w-4 h-4" /> Edit & Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickApproveChannel(c)}
                        disabled={isPending}
                        className="btn btn-sm font-space font-semibold flex items-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                      >
                        <CheckCircleIcon className="w-4 h-4" /> Quick Approve
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-1 sm:max-w-md">
                      <input
                        type="text"
                        placeholder="Rejection reason (optional)"
                        value={channelRejectNotes[c.id] || ""}
                        onChange={(e) =>
                          setChannelRejectNotes((prev) => ({ ...prev, [c.id]: e.target.value }))
                        }
                        className="input text-xs py-2 px-3 flex-1 bg-white border border-border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRejectChannel(c.id)}
                        disabled={isPending}
                        className="btn btn-sm font-space font-semibold flex items-center gap-1.5 bg-rose-600 text-white hover:bg-rose-700 px-3.5 py-2 rounded-lg flex-shrink-0 transition-colors shadow-sm"
                      >
                        <XCircleIcon className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* PLATFORM EDIT & APPROVE MODAL */}
      {editingPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border animate-in fade-in zoom-in-95 duration-150">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-border flex items-center justify-between z-10">
              <div>
                <h3 className="font-space font-bold text-dark text-lg">Edit & Approve Website Listing</h3>
                <p className="text-xs text-muted font-inter">
                  Review and make corrections to the website details before publishing live.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlatform(null)}
                className="p-1 rounded-lg text-muted hover:text-dark hover:bg-slate-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAndApprovePlatform} className="p-6 space-y-4 font-inter text-sm">
              <input type="hidden" name="platformId" value={editingPlatform.id} />

              <div>
                <label className="block text-xs font-semibold text-dark mb-1">Website URL *</label>
                <input
                  type="text"
                  name="url"
                  required
                  defaultValue={editingPlatform.url}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">DA (Domain Authority)</label>
                  <input
                    type="number"
                    name="da"
                    min="0"
                    max="100"
                    defaultValue={editingPlatform.da}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">DR (Domain Rating)</label>
                  <input
                    type="number"
                    name="dr"
                    min="0"
                    max="100"
                    defaultValue={editingPlatform.dr}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">Monthly Traffic</label>
                  <input
                    type="number"
                    name="traffic"
                    min="0"
                    defaultValue={editingPlatform.traffic}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">Niche / Category *</label>
                  <input
                    type="text"
                    name="niche"
                    required
                    defaultValue={editingPlatform.niche}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">Country *</label>
                  <CountrySelect
                    name="country"
                    defaultValue={editingPlatform.country}
                    required
                    placeholder="Select country"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">Language</label>
                  <input
                    type="text"
                    name="language"
                    defaultValue={editingPlatform.language || "English"}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>

              {/* Package Pricing edits */}
              <div className="border-t border-border pt-4 mt-2">
                <h4 className="text-xs font-bold text-dark font-space uppercase tracking-wider mb-3">
                  Package Pricing ($ USD)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["ARTICLE_POSTING", "LINK_INSERTION", "PRESS_RELEASE"].map((pType) => {
                    const existingPkg = editingPlatform.packages?.find((p: any) => p.type === pType);
                    return (
                      <div key={pType} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {pType.replace(/_/g, " ")}
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-xs text-muted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            name={`package_${pType}_price`}
                            defaultValue={existingPkg?.price ?? ""}
                            placeholder="Not offered"
                            className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-border rounded focus:outline-none focus:border-primary font-semibold"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPlatform(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-muted hover:text-dark hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  {isPending ? "Saving..." : "Save Corrections & Approve"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANNEL EDIT & APPROVE MODAL */}
      {editingChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border animate-in fade-in zoom-in-95 duration-150">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-border flex items-center justify-between z-10">
              <div>
                <h3 className="font-space font-bold text-dark text-lg">Edit & Approve Channel Listing</h3>
                <p className="text-xs text-muted font-inter">
                  Review and make corrections to social channel details before publishing live.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingChannel(null)}
                className="p-1 rounded-lg text-muted hover:text-dark hover:bg-slate-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAndApproveChannel} className="p-6 space-y-4 font-inter text-sm">
              <input type="hidden" name="channelId" value={editingChannel.id} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">Platform *</label>
                  <select
                    name="platform"
                    defaultValue={editingChannel.platform}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm bg-white"
                  >
                    {SOCIAL_PLATFORMS.map((plat) => (
                      <option key={plat.value} value={plat.value}>
                        {plat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">Handle / Username *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm text-muted">@</span>
                    <input
                      type="text"
                      name="handle"
                      required
                      defaultValue={editingChannel.handle}
                      className="w-full pl-7 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1">Custom Profile URL (Optional)</label>
                <input
                  type="text"
                  name="profileUrl"
                  defaultValue={editingChannel.profileUrl || ""}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">Followers Count</label>
                  <input
                    type="number"
                    name="followers"
                    min="0"
                    defaultValue={editingChannel.followers}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">Engagement Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="engagement"
                    min="0"
                    max="100"
                    defaultValue={editingChannel.engagement}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">Niche / Category *</label>
                  <select
                    name="niche"
                    defaultValue={editingChannel.niche}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm bg-white"
                  >
                    {INFLUENCER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">Country *</label>
                  <CountrySelect
                    name="country"
                    defaultValue={editingChannel.country}
                    required
                    placeholder="Select country"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark mb-1">Language</label>
                  <input
                    type="text"
                    name="language"
                    defaultValue={editingChannel.language || "English"}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>

              {/* Channel Package Pricing edits */}
              <div className="border-t border-border pt-4 mt-2">
                <h4 className="text-xs font-bold text-dark font-space uppercase tracking-wider mb-3">
                  Channel Packages & Rates ($ USD)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["POST", "STORY", "REEL", "VIDEO", "REVIEW"].map((pkgType) => {
                    const existingPkg = editingChannel.packages?.find((p: any) => p.type === pkgType);
                    return (
                      <div key={pkgType} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {pkgType} Package
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-xs text-muted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            name={`package_${pkgType}_price`}
                            defaultValue={existingPkg?.price ?? ""}
                            placeholder="Not offered"
                            className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-border rounded focus:outline-none focus:border-primary font-semibold"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingChannel(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-muted hover:text-dark hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  {isPending ? "Saving..." : "Save Corrections & Approve"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
