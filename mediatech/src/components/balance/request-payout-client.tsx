"use client";

import { useState, useTransition } from "react";
import { BuildingLibraryIcon, QrCodeIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/ui/page-header";

interface RequestPayoutClientProps {
  initialBalance: number;
  onWithdrawalAction: (
    amount: number,
    method: string,
    details: string
  ) => Promise<void>;
  basePath: "publisher" | "influencer";
}

/**
 * Shared "Request Earnings" page for Publisher & Influencer roles.
 * Supports UPI & Direct Bank Transfer for payouts.
 */
export default function RequestPayoutClient({
  initialBalance,
  onWithdrawalAction,
  basePath,
}: RequestPayoutClientProps) {
  const [method, setMethod] = useState<"UPI" | "BANK">("UPI");
  const [amount, setAmount] = useState("");

  // UPI Fields
  const [upiId, setUpiId] = useState("");
  const [upiHolderName, setUpiHolderName] = useState("");

  // Bank Fields
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (withdrawAmount > initialBalance) {
      alert("Insufficient balance available");
      return;
    }
    if (withdrawAmount < 5) {
      alert("Minimum payout amount is $5.00");
      return;
    }

    let payoutDetails = "";
    let methodLabel = "";

    if (method === "UPI") {
      if (!upiId.trim()) {
        alert("Please enter your UPI ID (VPA)");
        return;
      }
      methodLabel = "UPI";
      payoutDetails = `UPI ID: ${upiId.trim()}${upiHolderName.trim() ? ` (Name: ${upiHolderName.trim()})` : ""}`;
    } else {
      if (!accountHolderName.trim() || !bankName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
        alert("Please fill in all bank account details (A/C Name, Bank, Account Number, IFSC Code)");
        return;
      }
      methodLabel = "Bank Transfer";
      payoutDetails = `A/C Name: ${accountHolderName.trim()} | Bank: ${bankName.trim()} | A/C No: ${accountNumber.trim()} | IFSC: ${ifscCode.trim().toUpperCase()}`;
    }

    startTransition(async () => {
      try {
        await onWithdrawalAction(withdrawAmount, methodLabel, payoutDetails);
      } catch (err: any) {
        alert(err.message || "Payout request failed");
      }
    });
  }

  return (
    <div className="w-full">
      {/* Breadcrumb & Title */}
      <PageHeader
        crumbs={["Home", "Balance", "Request earnings"]}
        title="Request earnings payout"
      />

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 360px" }}>
        {/* Left — Form */}
        <div>
          <div className="card bg-card border-base rounded-xl p-6 mb-6">
            {/* Available balance banner */}
            <div className="bg-[#EEF0FD] rounded-xl p-5 mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted font-inter uppercase tracking-wide font-semibold block mb-0.5">
                  Available to withdraw
                </span>
                <span className="text-2xl font-bold font-space text-primary">
                  ${initialBalance.toFixed(2)}
                </span>
              </div>
              <span className="text-xs font-semibold font-inter px-3 py-1.5 rounded-full bg-white text-primary border border-border">
                Min: $5.00
              </span>
            </div>

            {/* Payout Method Selector */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider font-inter block mb-3">
                Select Payout Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod("UPI")}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left cursor-pointer ${
                    method === "UPI"
                      ? "border-primary bg-[#EEF0FD]"
                      : "border-border bg-white hover:border-muted"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                    style={{
                      background: method === "UPI" ? "#3E4FEA" : "#F1F5F9",
                      color: method === "UPI" ? "white" : "#64748B",
                    }}
                  >
                    <QrCodeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-sm font-space text-dark block">UPI Transfer</span>
                    <span className="text-xs text-muted font-inter">PhonePe, GPay, Paytm</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("BANK")}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left cursor-pointer ${
                    method === "BANK"
                      ? "border-primary bg-[#EEF0FD]"
                      : "border-border bg-white hover:border-muted"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                    style={{
                      background: method === "BANK" ? "#3E4FEA" : "#F1F5F9",
                      color: method === "BANK" ? "white" : "#64748B",
                    }}
                  >
                    <BuildingLibraryIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-sm font-space text-dark block">Bank Account</span>
                    <span className="text-xs text-muted font-inter">IMPS / NEFT / RTGS</span>
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* UPI Form Fields */}
              {method === "UPI" && (
                <div className="bg-[#F8FAFC] border border-border p-4 rounded-xl flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-dark block mb-1.5 font-inter">
                      UPI ID (VPA) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@ybl, name@oksbi, user@paytm"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-dark block mb-1.5 font-inter">
                      Account Holder / Beneficiary Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={upiHolderName}
                      onChange={(e) => setUpiHolderName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="input"
                    />
                  </div>
                </div>
              )}

              {/* Bank Transfer Form Fields */}
              {method === "BANK" && (
                <div className="bg-[#F8FAFC] border border-border p-4 rounded-xl flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-dark block mb-1.5 font-inter">
                        Account Holder Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        placeholder="Full Name on Account"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark block mb-1.5 font-inter">
                        Bank Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-dark block mb-1.5 font-inter">
                        Bank Account Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Account Number"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark block mb-1.5 font-inter">
                        IFSC Code <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="e.g. HDFC0001234, SBIN0004567"
                        className="input font-mono"
                        style={{ textTransform: "uppercase" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Amount field */}
              <div>
                <label className="text-xs font-semibold text-dark block mb-1.5 font-inter">
                  Amount to withdraw ($ USD) <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted font-inter font-bold">$</span>
                  <input
                    type="number"
                    required
                    min="5"
                    step="0.01"
                    max={initialBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="5.00"
                    className="input font-bold text-lg"
                    style={{ paddingLeft: "28px" }}
                  />
                </div>
                <p className="text-xs text-muted mt-1.5 font-inter">
                  Minimum payout amount is $5.00. Max available: ${initialBalance.toFixed(2)}.
                </p>
              </div>

              {/* Preset buttons */}
              {initialBalance >= 5 && (
                <div className="flex gap-2 flex-wrap">
                  {["5", "10", "25", "50", "100", "250", "500"]
                    .filter((p) => parseFloat(p) <= initialBalance)
                    .map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className={`btn btn-sm font-space ${
                          amount === preset ? "btn-primary" : "btn-outline text-muted"
                        }`}
                        style={{ borderRadius: "8px" }}
                      >
                        ${preset}
                      </button>
                    ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || initialBalance < 5}
                className="btn btn-primary font-space font-semibold w-full mt-2"
                style={{ padding: "14px", borderRadius: "10px", justifyContent: "center" }}
              >
                {isPending
                  ? "Submitting Request..."
                  : `Request ${method === "UPI" ? "UPI" : "Bank"} Payout`}
              </button>
            </form>
          </div>
        </div>

        {/* Right — Info sidebar */}
        <div className="flex flex-col gap-4">
          <div className="card bg-card border-base rounded-xl p-6">
            <h3 className="font-space font-semibold text-dark text-sm mb-4">
              Payout Information
            </h3>
            <div className="flex flex-col gap-3 text-xs font-inter text-muted leading-relaxed">
              <div className="flex items-start gap-2">
                <CheckBadgeIcon className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Fast Processing</strong>: Payouts are reviewed and dispatched directly via UPI or NEFT/IMPS.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckBadgeIcon className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>
                  <strong>No Hidden Fees</strong>: Funds are converted and settled into your registered Indian bank account or UPI VPA.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckBadgeIcon className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Secure Escrow</strong>: Available balance is reserved until payment completion.
                </span>
              </div>
            </div>
          </div>

          <div className="card bg-card border-base rounded-xl p-6">
            <h3 className="font-space font-semibold text-dark text-sm mb-3">
              Estimated Settlement
            </h3>
            <div className="flex flex-col gap-2.5 text-xs font-inter">
              <div className="flex justify-between">
                <span className="text-muted">Requested Amount</span>
                <span className="font-semibold text-dark">
                  {amount ? `$${parseFloat(amount).toFixed(2)} USD` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Est. INR Conversion</span>
                <span className="font-bold text-success">
                  {amount ? `≈ ₹${(parseFloat(amount) * 95.61).toFixed(2)} INR` : "—"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted">Payout Method</span>
                <span className="font-semibold text-dark">
                  {method === "UPI" ? "UPI (Instant)" : "Bank Transfer"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
