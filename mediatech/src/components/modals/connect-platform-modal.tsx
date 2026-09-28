"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  SparklesIcon,
  LockClosedIcon,
  ArrowRightIcon,
  KeyIcon,
  UserPlusIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export interface ConnectPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: {
    key: string;
    name: string;
    color: string;
    bgColor: string;
    borderColor: string;
    iconSvg: React.ReactNode;
    authType: string;
    scopes: string[];
    defaultHandlePrefix?: string;
  } | null;
  onConnectSuccess: (data: {
    platform: string;
    handle: string;
    profileUrl?: string;
    followers: number;
    engagement: number;
    niche: string;
    country: string;
  }) => Promise<void>;
}

type ModalFlowStep = "oauth_login" | "oauth_signup" | "oauth_consent" | "oauth_processing" | "account_confirmed";

export function ConnectPlatformModal({
  isOpen,
  onClose,
  platform,
  onConnectSuccess,
}: ConnectPlatformModalProps) {
  const [step, setStep] = useState<ModalFlowStep>("oauth_login");
  
  // Login / Signup Form States
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [handle, setHandle] = useState("");
  const [niche, setNiche] = useState("Technology & Gadgets");
  const [country, setCountry] = useState("United States");
  const [followers, setFollowers] = useState<number>(25000);
  const [engagement, setEngagement] = useState<number>(4.8);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen && platform) {
      setStep("oauth_login");
      setAuthEmail("");
      setAuthPassword("");
      setCreatorName("");
      setFormError("");
      const generatedHandle = `@${platform.name.toLowerCase().replace(/[^a-z0-9]/g, "")}_creator`;
      setHandle(generatedHandle);
    }
  }, [isOpen, platform]);

  if (!isOpen || !platform) return null;

  // 1. Handle Login on Platform OAuth Portal
  const handlePlatformLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setFormError("Please enter your account email and password.");
      return;
    }
    setFormError("");
    // Infer handle from email username if not custom
    const emailPrefix = authEmail.split("@")[0];
    if (emailPrefix) {
      setHandle(`@${emailPrefix.toLowerCase().replace(/[^a-z0-9_.]/g, "")}`);
    }
    setStep("oauth_consent");
  };

  // 2. Handle Sign Up on Platform OAuth Portal
  const handlePlatformSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim() || !creatorName.trim()) {
      setFormError("Please fill in all fields to create your account.");
      return;
    }
    setFormError("");
    const emailPrefix = authEmail.split("@")[0];
    if (emailPrefix) {
      setHandle(`@${emailPrefix.toLowerCase().replace(/[^a-z0-9_.]/g, "")}`);
    }
    setStep("oauth_consent");
  };

  // 3. User clicks "Authorize MediaHub" on Consent Screen
  const handleAuthorizeApp = () => {
    setStep("oauth_processing");
    // Simulate OAuth callback handshake & profile retrieval
    setTimeout(() => {
      setStep("account_confirmed");
    }, 1600);
  };

  // 4. Final Submission -> Connects and Updates Database
  const handleCompleteConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConnectSuccess({
        platform: platform.key,
        handle: handle.startsWith("@") ? handle : `@${handle}`,
        profileUrl: `https://${platform.key.toLowerCase()}.com/${handle.replace(/^@/, "")}`,
        followers: Number(followers) || 12000,
        engagement: Number(engagement) || 4.2,
        niche,
        country,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to connect channel. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Brand Banner Header */}
        <div
          className="p-5 text-white relative flex items-center justify-between"
          style={{ backgroundColor: platform.color }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 p-2 flex items-center justify-center backdrop-blur-sm shadow-inner">
              {platform.iconSvg}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 block">
                {platform.authType}
              </span>
              <h2 className="text-lg font-bold font-space text-white">
                {platform.name} Authentication Gateway
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-black/10 hover:bg-black/25 p-1.5 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* ─────────────────────────────────────────────────────────────
              FLOW STEP 1: Platform Login Portal
          ───────────────────────────────────────────────────────────── */}
          {step === "oauth_login" && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <div
                  className="w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.iconSvg}
                </div>
                <h3 className="text-base font-bold text-slate-900 font-space">
                  Sign in to {platform.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Log in with your {platform.name} account to link with MediaHub.
                </p>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handlePlatformLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {platform.name} Email or Phone / Username
                  </label>
                  <input
                    type="text"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder={`your_account@${platform.key.toLowerCase()}.com`}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-[11px] text-amber-600 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs hover:opacity-95 hover:scale-[1.01]"
                  style={{ backgroundColor: platform.color }}
                >
                  <KeyIcon className="w-4 h-4" />
                  <span>Sign In &amp; Continue</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Toggle to Sign Up */}
              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  New to {platform.name}?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setFormError("");
                      setStep("oauth_signup");
                    }}
                    className="text-amber-600 font-bold hover:underline"
                  >
                    Create a {platform.name} Account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              FLOW STEP 1B: Platform Sign Up Portal
          ───────────────────────────────────────────────────────────── */}
          {step === "oauth_signup" && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <div
                  className="w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.iconSvg}
                </div>
                <h3 className="text-base font-bold text-slate-900 font-space">
                  Join {platform.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create a new {platform.name} creator profile and connect instantly.
                </p>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handlePlatformSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name or Channel Name
                  </label>
                  <input
                    type="text"
                    required
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="e.g. Alex Media Creator"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="creator@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs hover:opacity-95 hover:scale-[1.01]"
                  style={{ backgroundColor: platform.color }}
                >
                  <UserPlusIcon className="w-4 h-4" />
                  <span>Sign Up &amp; Authorize</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Toggle back to Login */}
              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setFormError("");
                      setStep("oauth_login");
                    }}
                    className="text-amber-600 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              FLOW STEP 2: OAuth Permission Consent Screen ("Authorize MediaHub")
          ───────────────────────────────────────────────────────────── */}
          {step === "oauth_consent" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep("oauth_login")}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5" /> Back
                </button>
                <span className="text-[11px] font-semibold text-slate-500">
                  Logged in as: <strong>{authEmail || "creator@media.com"}</strong>
                </span>
              </div>

              <div className="text-center py-1 space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-space">
                  Authorize MediaHub to access your {platform.name} account?
                </h3>
                <p className="text-xs text-slate-500">
                  MediaHub would like permission to access your channel insights and public handle.
                </p>
              </div>

              {/* Scopes Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                  Requested Access Permissions:
                </span>
                <ul className="space-y-2 text-slate-600">
                  {platform.scopes.map((scope, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800 font-semibold">{scope}</strong>
                        <p className="text-[11px] text-slate-500">Verify profile statistics and active handle visibility.</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-amber-600 shrink-0" />
                <span>MediaHub adheres strictly to official API standards and will never post content without approval.</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleAuthorizeApp}
                  className="w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs hover:opacity-95"
                  style={{ backgroundColor: platform.color }}
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Authorize MediaHub &amp; Return</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep("oauth_login")}
                  className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Deny &amp; Cancel
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              FLOW STEP 3: Handshake Animation (Returning to MediaHub)
          ───────────────────────────────────────────────────────────── */}
          {step === "oauth_processing" && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: `${platform.color}18` }}
                >
                  <ArrowPathIcon
                    className="w-8 h-8 animate-spin"
                    style={{ color: platform.color }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-space">
                  Returning to MediaHub...
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Exchanging OAuth tokens and securely importing your {platform.name} channel metrics.
                </p>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              FLOW STEP 4: Connected ✓ Confirmation & Customization
          ───────────────────────────────────────────────────────────── */}
          {step === "account_confirmed" && (
            <form onSubmit={handleCompleteConnection} className="space-y-4">
              {/* Success Banner */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-medium">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <strong className="block text-emerald-950 font-bold text-sm">
                    {platform.name} Account Connected ✓
                  </strong>
                  <span>Your OAuth authentication succeeded. Confirm your collaboration rates:</span>
                </div>
              </div>

              {/* Handle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Connected {platform.name} Handle
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">@</span>
                  <input
                    type="text"
                    required
                    value={handle.replace(/^@/, "")}
                    onChange={(e) => setHandle(`@${e.target.value}`)}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Audience Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Followers / Subscribers
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={followers}
                    onChange={(e) => setFollowers(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Avg. Engagement Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={engagement}
                    onChange={(e) => setEngagement(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Niche & Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Content Niche
                  </label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Technology & Gadgets">Technology &amp; Gadgets</option>
                    <option value="Business & Finance">Business &amp; Finance</option>
                    <option value="Lifestyle & Fashion">Lifestyle &amp; Fashion</option>
                    <option value="Health & Fitness">Health &amp; Fitness</option>
                    <option value="Travel & Tourism">Travel &amp; Tourism</option>
                    <option value="Gaming & Esports">Gaming &amp; Esports</option>
                    <option value="Education & SaaS">Education &amp; SaaS</option>
                    <option value="Food & Cooking">Food &amp; Cooking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Audience Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Final Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs hover:opacity-95"
                  style={{ backgroundColor: platform.color }}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Saving Channel Connection...
                    </span>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4" />
                      Complete Connection &amp; Publish to Marketplace
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
