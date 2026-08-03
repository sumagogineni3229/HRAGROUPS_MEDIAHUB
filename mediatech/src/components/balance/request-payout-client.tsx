"use client";

import { useState, useTransition } from "react";
import { CreditCardIcon } from "@heroicons/react/24/outline";
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
 * Shared "Request Earnings" page used by both publisher and influencer roles.
 * Supports PayPal payout only (Credit Card not applicable for payouts).
 */
export default function RequestPayoutClient({
  initialBalance,
  onWithdrawalAction,
  basePath,
}: RequestPayoutClientProps) {
  const [amount, setAmount] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
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
    if (withdrawAmount < 60) {
      alert("Minimum payout amount is $60.00");
      return;
    }

    startTransition(async () => {
      try {
        await onWithdrawalAction(withdrawAmount, "PayPal", paypalEmail);
      } catch (err: any) {
        alert(err.message || "Payout request failed");
      }
    });
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Breadcrumb & Title */}
      <PageHeader
        crumbs={["Home", "Balance", "Request earnings"]}
        title="Request earnings"
      />

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 340px" }}>
        {/* Left — Form */}
        <div>
          <div className="card bg-card border-base rounded-xl p-6 mb-6">
            <h2 className="font-space font-semibold text-dark text-lg mb-5">
              PayPal Payout
            </h2>

            {/* Available balance */}
            <div className="bg-[#EEF0FD] rounded-xl p-4 mb-6 flex items-center justify-between">
              <span className="text-sm text-muted font-inter">Available to withdraw</span>
              <span className="text-2xl font-bold font-space text-primary">
                ${initialBalance.toFixed(2)}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium text-dark block mb-2 font-inter">
                  PayPal email address
                </label>
                <input
                  type="email"
                  required
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="your@paypal.com"
                  className="input"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-dark block mb-2 font-inter">
                  Amount to withdraw ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted font-inter">$</span>
                  <input
                    type="number"
                    required
                    min="60"
                    max={initialBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="60.00"
                    className="input"
                    style={{ paddingLeft: "24px" }}
                  />
                </div>
                <p className="text-xs text-muted mt-1.5 font-inter">
                  Minimum payout: $60.00
                </p>
              </div>

              {/* Preset amounts */}
              {initialBalance >= 60 && (
                <div className="flex gap-2 flex-wrap">
                  {["60", "100", "250", "500"]
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
                disabled={isPending}
                className="btn btn-primary font-space font-semibold w-full"
                style={{ padding: "12px", borderRadius: "8px", justifyContent: "center" }}
              >
                {isPending ? "Submitting..." : "Request PayPal Payout"}
              </button>
            </form>
          </div>
        </div>

        {/* Right — Info sidebar */}
        <div className="flex flex-col gap-4">
          <div className="card bg-card border-base rounded-xl p-6">
            <h3 className="font-space font-semibold text-dark text-sm mb-4">
              How payouts work
            </h3>
            <div className="flex flex-col gap-4 text-xs font-inter text-muted leading-relaxed">
              <p>
                Payout requests are forwarded to the finance team and processed on the{" "}
                <strong className="text-dark">5th</strong> and{" "}
                <strong className="text-dark">20th</strong> of each month.
              </p>
              <p>
                Funds are typically received between the{" "}
                <strong className="text-dark">5th–10th</strong> and{" "}
                <strong className="text-dark">20th–25th</strong>.
              </p>
              <p>
                A <strong className="text-dark">4% PayPal processing fee</strong> applies to
                all payout requests.
              </p>
            </div>
          </div>

          <div className="card bg-card border-base rounded-xl p-6">
            <h3 className="font-space font-semibold text-dark text-sm mb-4 flex items-center gap-2">
              <CreditCardIcon className="w-4 h-4 text-primary" />
              Processing fee
            </h3>
            <div className="flex flex-col gap-3 text-xs font-inter">
              <div className="flex justify-between">
                <span className="text-muted">PayPal fee</span>
                <span className="font-semibold text-dark">4.00%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Platform fee</span>
                <span className="font-semibold text-dark">3.90%</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted">You receive</span>
                <span className="font-bold text-success">
                  {amount
                    ? `$${(parseFloat(amount || "0") * 0.921).toFixed(2)}`
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
