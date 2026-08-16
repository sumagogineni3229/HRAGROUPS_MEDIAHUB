"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GlobeAltIcon,
  UserCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";

interface PackageItem {
  id: string;
  type: string;
  price: number;
  turnaround?: number;
  description?: string | null;
  isActive: boolean;
}

interface NewTaskFormProps {
  platform: any | null;
  channel: any | null;
  packages: PackageItem[];
  initialPackageId: string;
  projects: Array<{ id: string; name: string }>;
  walletBalance: number;
  handleCreateOrder: (formData: FormData) => Promise<void>;
}

export function NewTaskForm({
  platform,
  channel,
  packages,
  initialPackageId,
  projects,
  walletBalance,
  handleCreateOrder,
}: NewTaskFormProps) {
  // Multiselect state: array of selected package IDs
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([
    initialPackageId,
  ]);
  const [showNewProject, setShowNewProject] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Toggle or select package
  const togglePackage = (pkgId: string) => {
    setSelectedPackageIds((prev) => {
      if (prev.includes(pkgId)) {
        // Prevent deselecting if it's the last one selected
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== pkgId);
      } else {
        return [...prev, pkgId];
      }
    });
  };

  const selectAllPackages = () => {
    if (selectedPackageIds.length === packages.length) {
      // Keep only first
      setSelectedPackageIds([packages[0].id]);
    } else {
      setSelectedPackageIds(packages.map((p) => p.id));
    }
  };

  // Selected packages objects
  const selectedPackages = packages.filter((p) =>
    selectedPackageIds.includes(p.id)
  );
  const totalPrice = selectedPackages.reduce((acc, p) => acc + p.price, 0);
  const insufficientFunds = walletBalance < totalPrice;

  const formatPlacementName = (type: string) => {
    switch (type) {
      case "POST":
        return "Dedicated Feed Post";
      case "STORY":
        return "Social Story / Slide";
      case "REEL":
        return "Video Reel / Short";
      case "VIDEO":
        return "Long-form Video";
      case "REVIEW":
        return "Product Review";
      case "ARTICLE_POSTING":
        return "Sponsored Article / Guest Post";
      case "LINK_INSERTION":
        return "Link Insertion / Niche Edit";
      case "BANNER":
        return "Display Banner Ad";
      default:
        return type.replace(/_/g, " ").toLowerCase() + " placement";
    }
  };

  return (
    <div className="w-full">
      <form
        action={async (formData: FormData) => {
          if (selectedPackageIds.length === 0) return;
          setIsSubmitting(true);
          try {
            await handleCreateOrder(formData);
          } finally {
            setIsSubmitting(false);
          }
        }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Hidden inputs to pass array of selected package IDs */}
        <input
          type="hidden"
          name="packageIds"
          value={selectedPackageIds.join(",")}
        />

        {/* Left Column: Configuration & Brief (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Package Selector Card */}
          <div className="card bg-card border-base rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-space font-semibold text-dark text-lg">
                  1. Choose Placements (Select Multiple)
                </h3>
                <p className="text-xs text-muted font-inter">
                  Select one or more promotional items you would like to order.
                </p>
              </div>

              {packages.length > 1 && (
                <button
                  type="button"
                  onClick={selectAllPackages}
                  className="text-xs text-primary font-semibold hover:underline bg-primary/5 px-3 py-1.5 rounded-md border border-primary/20 transition-all self-start sm:self-auto"
                >
                  {selectedPackageIds.length === packages.length
                    ? "Reset Selection"
                    : "Select All Placements"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {packages.map((pkg) => {
                const isSelected = selectedPackageIds.includes(pkg.id);
                return (
                  <div
                    key={pkg.id}
                    onClick={() => togglePackage(pkg.id)}
                    className={`cursor-pointer border rounded-xl p-4 transition-all flex flex-col justify-between select-none ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/40"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-sm font-semibold text-dark">
                        {formatPlacementName(pkg.type)}
                      </span>
                      {isSelected ? (
                        <CheckCircleSolidIcon className="w-5 h-5 text-primary shrink-0" />
                      ) : (
                        <CheckCircleIcon className="w-5 h-5 text-slate-300 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-baseline justify-between mt-auto pt-3 border-t border-slate-100">
                      <span className="text-xs text-muted">
                        {pkg.turnaround
                          ? `~${pkg.turnaround}d delivery`
                          : "Placement"}
                      </span>
                      <span className="font-bold text-base font-space text-dark">
                        ${pkg.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brief and Campaign Details Card */}
          <div className="card bg-card border-base rounded-xl p-6 flex flex-col gap-5">
            <h3 className="font-space font-semibold text-dark text-lg">
              2. Campaign & Guidelines
            </h3>

            {/* Campaign Selection */}
            <div>
              <label className="text-sm font-semibold text-dark block mb-2 font-inter">
                Campaign / Project
              </label>
              <select
                name="projectId"
                className="input select"
                defaultValue=""
                onChange={(e) => setShowNewProject(e.target.value === "NEW")}
              >
                <option value="">No Campaign (General Task)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
                <option value="NEW">+ Create New Project</option>
              </select>
            </div>

            {showNewProject && (
              <div>
                <label className="text-sm font-medium text-dark block mb-2 font-inter">
                  New Project Name *
                </label>
                <input
                  name="newProjectName"
                  type="text"
                  required
                  placeholder="e.g. Summer Brand Launch 2026"
                  className="input"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-dark block mb-2 font-inter">
                  Target Promoted URL *
                </label>
                <input
                  name="targetUrl"
                  type="url"
                  required
                  placeholder="https://yourbrand.com/landing-page"
                  className="input"
                />
                <span className="text-xs text-muted mt-1 block">
                  Link for the post swipe/bio/article link.
                </span>
              </div>

              <div>
                <label className="text-sm font-semibold text-dark block mb-2 font-inter">
                  Anchor Text / CTA *
                </label>
                <input
                  name="anchorText"
                  type="text"
                  required
                  placeholder="e.g. Try Acme or @acmebrand"
                  className="input"
                />
                <span className="text-xs text-muted mt-1 block">
                  Keywords or brand tag to mention.
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-dark block mb-2 font-inter">
                Content Brief & Guidelines *
              </label>
              <textarea
                name="brief"
                required
                rows={6}
                placeholder={`Provide instructions for your selected placements (${selectedPackages
                  .map((p) => formatPlacementName(p.type))
                  .join(", ")}). Include product key features, mandatory talking points, hashtags, or specific requirements.`}
                className="input"
                style={{ resize: "vertical", fontFamily: "var(--font-inter)" }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout (4 cols) sticky */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-6">
          <div className="card bg-card border-base rounded-xl p-6">
            <h3 className="font-space font-semibold text-dark text-lg mb-4">
              Order Summary
            </h3>

            <div className="flex items-start gap-3 pb-4 mb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                {platform ? (
                  <GlobeAltIcon className="w-6 h-6" />
                ) : (
                  <UserCircleIcon className="w-6 h-6" />
                )}
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-dark text-base font-space block truncate">
                  {platform ? platform.url : `@${channel?.handle}`}
                </span>
                <span className="text-xs text-muted font-inter">
                  {platform
                    ? "Website Placement"
                    : `Social Channel (${channel?.platform})`}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm font-inter mb-5">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                Selected Items ({selectedPackages.length})
              </span>

              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {selectedPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex justify-between items-center text-xs py-1.5 px-2 bg-slate-50 rounded border border-slate-100"
                  >
                    <span className="text-dark font-medium">
                      {formatPlacementName(pkg.type)}
                    </span>
                    <span className="font-semibold text-dark font-space">
                      ${pkg.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-base font-semibold text-dark">
                  Total Price
                </span>
                <span className="text-2xl font-bold font-space text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {insufficientFunds && (
              <div
                className="banner banner-promo rounded-lg mb-4 p-3"
                style={{ backgroundColor: "#FFF4D9" }}
              >
                <span className="text-xs text-dark font-inter leading-relaxed">
                  Your wallet balance (
                  <strong>${walletBalance.toFixed(2)}</strong>) is insufficient
                  for these placements (
                  <strong>${totalPrice.toFixed(2)}</strong>). Please{" "}
                  <Link
                    href="/advertiser/balance"
                    className="text-primary font-semibold hover:underline"
                  >
                    top up balance
                  </Link>
                  .
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={
                selectedPackages.length === 0 ||
                insufficientFunds ||
                isSubmitting
              }
              className="btn btn-primary font-space font-semibold w-full"
              style={{ justifyContent: "center", padding: "12px 20px" }}
            >
              {isSubmitting
                ? "Processing Order..."
                : `Confirm & Place Order ($${totalPrice.toFixed(2)})`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
