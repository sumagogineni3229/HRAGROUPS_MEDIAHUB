"use client";

import React, { useState } from "react";
import {
  XMarkIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface UpgradeProModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance?: number;
}

export function UpgradeProModal({
  isOpen,
  onClose,
  currentBalance = 0,
}: UpgradeProModalProps) {
  const [amount, setAmount] = useState<number>(20);
  const [gateway, setGateway] = useState<"phonepe" | "paypal">("phonepe");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (!isOpen) return null;

  const quickAmounts = [20, 50, 100, 250, 500];

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (amount < 20) {
      setErrorMessage("Minimum top-up amount to unlock Pro website access is $20.00 USD.");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint =
        gateway === "paypal"
          ? "/api/payments/paypal/initiate"
          : "/api/payments/phonepe/initiate";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          note: "MediaHub Pro Account Upgrade & Website Access Unlock",
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to initialize payment gateway.");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned from payment processor.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
            <SparklesIcon className="w-4 h-4" /> Pro Advertiser Access
          </div>

          <h2 className="text-2xl font-bold font-space text-white">
            Upgrade Account to Unlock All Websites
          </h2>
          <p className="text-amber-100 text-xs mt-1.5 leading-relaxed">
            Maintain a minimum balance of <strong>$20.00 USD</strong> to browse complete publisher domains, access SEO metrics, and place direct campaigns.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Current Balance Notice */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-slate-600 font-medium">Your Current Account Balance:</span>
            <span className="font-bold font-space text-slate-900 text-sm">
              ${Number(currentBalance).toFixed(2)} USD
            </span>
          </div>

          {/* Benefits Bullet Points */}
          <div className="space-y-2 text-xs text-slate-600 bg-amber-50/60 border border-amber-200/80 rounded-xl p-4">
            <p className="font-bold text-amber-950 flex items-center gap-1.5 mb-1.5">
              <ShieldCheckIcon className="w-4 h-4 text-amber-600" />
              What you get with Pro access:
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full visibility of <strong>all publisher website domains</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant access to transparent pricing &amp; turnaround time</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% of deposited funds remain <strong>usable for orders</strong></span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
              {errorMessage}
            </div>
          )}

          {/* Top-up Form */}
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Deposit Amount (USD)
              </label>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-5 gap-2 mb-2.5">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      amount === amt
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  min="20"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter amount (min $20)"
                  required
                />
              </div>
            </div>

            {/* Payment Gateway Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Choose Payment Gateway
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGateway("phonepe")}
                  className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition-all ${
                    gateway === "phonepe"
                      ? "bg-purple-50/50 border-purple-500 ring-2 ring-purple-500/20 text-purple-900"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs">PhonePe / UPI</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">UPI / Cards</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Auto-converts USD to INR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGateway("paypal")}
                  className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition-all ${
                    gateway === "paypal"
                      ? "bg-sky-50/50 border-sky-500 ring-2 ring-sky-500/20 text-sky-900"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs">PayPal</span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold">USD</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Cards &amp; PayPal Wallet</span>
                </button>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || amount < 20}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting to Payment Gateway...
                  </span>
                ) : (
                  <>
                    <CreditCardIcon className="w-5 h-5" />
                    Upgrade to Pro &amp; Deposit ${amount} USD
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                🔒 Secure 256-bit SSL encrypted checkout. Balance updates automatically upon completion.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
