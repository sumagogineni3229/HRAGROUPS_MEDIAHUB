"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  InformationCircleIcon,
  BanknotesIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/ui/page-header";
import { InfoBanner } from "@/components/ui/info-banner";

interface BalanceClientProps {
  initialBalance: number;
  initialReserved: number;
  initialEarnings: number;
  transactions: any[];
  currentTab: string;
  onWithdrawalAction?: (
    amount: number,
    method: string,
    details: string
  ) => Promise<void>;
  onAddFundsAction?: (
    amount: number,
    method: string
  ) => Promise<{ url?: string; error?: string } | void | any>;
  activeBalanceType?: "main" | "reserved" | "bonus";
  /** Role-specific base path: "publisher" | "influencer" | "advertiser" */
  basePath: "publisher" | "influencer" | "advertiser";
}

export function BalanceClient({
  initialBalance,
  initialReserved,
  initialEarnings,
  transactions,
  currentTab,
  onWithdrawalAction,
  onAddFundsAction,
  activeBalanceType = "main",
  basePath,
}: BalanceClientProps) {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<"paypal" | "wire">("paypal");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [isPending, startTransition] = useTransition();

  const balanceTitle =
    activeBalanceType === "reserved"
      ? "Reserved balance"
      : activeBalanceType === "bonus"
      ? (basePath === "advertiser" ? "Bonus balance" : "Total earnings")
      : "Balance";

  const breadcrumbLabel =
    activeBalanceType === "reserved"
      ? "Reserved balance"
      : activeBalanceType === "bonus"
      ? (basePath === "advertiser" ? "Bonus balance" : "Total earnings")
      : "Main balance";

  function handleRequestWithdrawal(e: React.FormEvent) {
    e.preventDefault();
    if (!onWithdrawalAction) return;
    const withdrawValue = parseFloat(amount);
    if (isNaN(withdrawValue) || withdrawValue <= 0 || withdrawValue > initialBalance) {
      alert("Invalid withdrawal amount or insufficient balance.");
      return;
    }

    startTransition(async () => {
      try {
        const methodLabel = withdrawMethod === "paypal" ? "PayPal" : "Bank Transfer";
        const details =
          withdrawMethod === "paypal"
            ? paypalEmail
            : `${bankName} (${accountNumber})`;

        await onWithdrawalAction(withdrawValue, methodLabel, details);
        setIsWithdrawOpen(false);
        window.location.reload();
      } catch (err: any) {
        alert(err.message || "Withdrawal failed");
      }
    });
  }

  function handleAddFunds(e: React.FormEvent) {
    e.preventDefault();
    if (!onAddFundsAction) return;
    const depositValue = parseFloat(amount);
    if (isNaN(depositValue) || depositValue < 5) {
      alert("Minimum top-up amount is $5.00.");
      return;
    }

    startTransition(async () => {
      try {
        let checkoutUrl = "";

        if (onAddFundsAction) {
          try {
            const res = await onAddFundsAction(depositValue, "PhonePe");
            if (res?.url) {
              checkoutUrl = res.url;
            } else if (res?.error) {
              alert(res.error);
              return;
            }
          } catch (serverActionErr: any) {
            console.warn("Server action failed, falling back to API route:", serverActionErr);
          }
        }

        if (!checkoutUrl) {
          const resp = await fetch("/api/payments/phonepe/initiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: depositValue }),
          });
          const data = await resp.json();
          if (data?.checkoutUrl) {
            checkoutUrl = data.checkoutUrl;
          } else if (data?.error) {
            alert(data.error);
            return;
          }
        }

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }

        alert("Failed to initialize PhonePe checkout session.");
      } catch (err: any) {
        alert(err.message || "Top-up failed");
      }
    });
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Breadcrumb & H1 */}
      <PageHeader crumbs={["Home", breadcrumbLabel]} title={balanceTitle} />

      {/* Accordion Guide Block */}
      {basePath !== "advertiser" && (
        <details
          open
          className="faq-details border-base bg-card rounded-lg mb-6"
          style={{ borderColor: "#E8ECFD" }}
        >
          <summary
            className="font-space font-medium p-4 cursor-pointer flex justify-between items-center list-none"
            style={{ backgroundColor: "#EEF0FD" }}
          >
            <div className="flex items-center gap-3">
              <span className="help-icon">?</span>
              <span className="text-primary font-semibold">How it works</span>
            </div>
            <ChevronDownIcon className="arrow-icon w-4 h-4 transition-transform text-primary" />
          </summary>
          <div className="p-6 border-t border-muted text-sm text-dark leading-relaxed font-inter">
            <p className="mb-4">
              Here you can check your balance divided into 3 categories:
            </p>
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div>
                <p className="font-semibold mb-1">
                  • Main balance:{" "}
                  <span className="text-muted font-normal">
                    Funds you have earned for completed tasks
                  </span>
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">
                  • Reserved balance:{" "}
                  <span className="text-muted font-normal">
                    Funds that have been reserved as a task payment
                  </span>
                </p>
                <Link
                  href={`/${basePath}/balance?view=reserved`}
                  className="text-primary hover:underline block text-xs mt-1"
                >
                  Learn more
                </Link>
              </div>
              <div>
                <p className="font-semibold mb-1">
                  • Bonus balance:{" "}
                  <span className="text-muted font-normal">
                    Extra funds that may be added for special activities
                  </span>
                </p>
              </div>
            </div>

            <p className="font-semibold text-dark mb-4">
              You will be able to request a payout after you earn at least $60.
            </p>

            <InfoBanner className="mb-4">
              Please note that the final sum you receive will differ from the one
              you see on your account. That&apos;s because we charge
              different commissions for available payment methods.
            </InfoBanner>

            <p className="text-xs text-muted mb-3 font-semibold uppercase">
              The following commissions apply when you make your earnings request:
            </p>
            <div className="bg-[#EEF0FD] p-4 rounded-lg text-xs mb-4">
              <p className="font-semibold mb-1 text-dark">PayPal</p>
              <ul className="list-disc pl-4 flex flex-col gap-1 text-muted">
                <li>
                  4.00% - PayPal takes from 2.9% to 6.4%{" "}
                  <Link href="#" className="text-primary hover:underline">
                    commissions (learn more here)
                  </Link>
                  ; to save you some funds, we&apos;ll take only 4% from your
                  balance and pay PayPal commission on our side, so this way
                  you&apos;ll save on PayPal commission and get payment with NO
                  commission (applies to all publishers). The same 4% commission
                  applies to all other methods to cover the transaction fee.
                </li>
                <li>
                  3.90% - the platform fee used for advertising to attract more buyers
                  and ensure you receive higher income (applies to the publishers
                  who&apos;ve joined after August 1st, 2018).
                </li>
              </ul>
            </div>

            <div className="bg-[#EEF0FD] p-4 rounded-lg text-xs mb-4">
              <p className="font-semibold mb-1 text-dark">USDT</p>
              <ul className="list-disc pl-4 flex flex-col gap-1 text-muted">
                <li>
                  5.45% - this transaction commission applies if you decide to
                  send earnings to your USDT address.
                </li>
                <li>
                  3.90% - the platform service fee will still be applied, if
                  applicable.
                </li>
              </ul>
            </div>

            <p className="font-semibold text-dark mt-4 mb-2">
              Once a request is submitted, it is forwarded to the financial
              department and goes through several processing stages.
            </p>
            <p className="text-xs text-muted mb-4">
              Once a earnings request is submitted, it is forwarded to the
              financial department and goes through several processing stages. As
              a result, there will be a delay between your request and the actual
              receipt of funds. The payout process begins on the{" "}
              <strong>5th</strong> and <strong>20th</strong> of each month, so
              please ensure your request is submitted{" "}
              <strong>before these dates</strong> (including 5th and 20th).
              Payments are typically received between the{" "}
              <strong>5th-10th</strong> and the <strong>20th-25th</strong> of
              each month.
            </p>

            <InfoBanner>
              Please note do not send us emails about your earnings request. We
              see all the requests, and we&apos;ll process them during the payment
              period without an extra reminder
            </InfoBanner>
          </div>
        </details>
      )}

      {/* Action CTA Box */}
      <div className="flex justify-between items-center bg-[#81F5FF20] border border-[#81F5FF60] p-6 rounded-lg mb-6">
        <div>
          <h4 className="font-space font-semibold text-dark text-md mb-1">
            {basePath === "advertiser"
              ? "Need to add funds to place placements?"
              : "Do you want to get your payments?"}
          </h4>
        </div>
        {basePath === "advertiser" ? (
          <button
            onClick={() => setIsTopUpOpen(true)}
            className="btn btn-primary font-semibold font-space cursor-pointer"
            style={{ borderRadius: "8px", padding: "12px 24px" }}
          >
            Add Funds
          </button>
        ) : (
          <Link
            href={`/${basePath}/balance?action=request`}
            className="btn btn-dark font-semibold font-space"
            style={{ borderRadius: "8px", padding: "12px 24px", textDecoration: "none" }}
          >
            Request Earnings
          </Link>
        )}
      </div>


      {/* Grid of Balance Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Link
          href={`/${basePath}/balance?view=main`}
          className={`card bg-card border-base rounded-lg p-6 flex flex-col justify-between transition-all ${
            activeBalanceType === "main"
              ? "border-primary shadow-md"
              : "hover:border-primary"
          }`}
          style={{ borderWidth: activeBalanceType === "main" ? "2px" : "1px" }}
        >
          <div>
            <span className="text-2xl font-bold text-dark font-space block mb-1">
              ${initialBalance.toFixed(2)}
            </span>
            <span className="text-xs text-muted font-inter">
              Main balance: Funds you have earned for completed tasks
            </span>
          </div>
        </Link>

        <Link
          href={`/${basePath}/balance?view=reserved`}
          className={`card bg-card border-base rounded-lg p-6 flex flex-col justify-between transition-all ${
            activeBalanceType === "reserved"
              ? "border-primary shadow-md"
              : "hover:border-primary"
          }`}
          style={{
            borderWidth: activeBalanceType === "reserved" ? "2px" : "1px",
          }}
        >
          <div>
            <span className="text-2xl font-bold text-dark font-space block mb-1">
              ${initialReserved.toFixed(2)}
            </span>
            <span className="text-xs text-muted font-inter">
              Reserved balance: Funds that have been reserved as a task payment
            </span>
          </div>
        </Link>

        <Link
          href={`/${basePath}/balance?view=bonus`}
          className={`card bg-card border-base rounded-lg p-6 flex flex-col justify-between transition-all ${
            activeBalanceType === "bonus"
              ? "border-primary shadow-md"
              : "hover:border-primary"
          }`}
          style={{ borderWidth: activeBalanceType === "bonus" ? "2px" : "1px" }}
        >
          <div>
            <span className="text-2xl font-bold text-dark font-space block mb-1">
              ${initialEarnings.toFixed(2)}
            </span>
            <span className="text-xs text-muted font-inter">
              {basePath === "advertiser"
                ? "Bonus balance: Extra funds that may be added for special activities"
                : "Total earnings: Lifetime net earnings from completed orders"}
            </span>
          </div>
        </Link>
      </div>

      {/* Transactions List */}
      <div className="bg-card border-base rounded-lg p-6 mb-8">
        {/* Search Filter and Transaction tabs */}
        {activeBalanceType === "main" && (
          <div className="mb-6">
            <div className="relative mb-4" style={{ maxWidth: "400px" }}>
              <input
                type="text"
                className="input"
                placeholder="Task ID or Content order ID"
                style={{ paddingRight: "36px" }}
              />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm bg-[#EEF0FD] border-none text-dark font-semibold">
                All Payments
              </button>
              <button className="btn btn-ghost btn-sm text-muted">
                Product Payments
              </button>
              <button className="btn btn-ghost btn-sm text-muted">
                Earnings received
              </button>
              <button className="btn btn-ghost btn-sm text-muted">Other</button>
            </div>
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="py-8 text-center text-muted font-inter text-sm">
            This list is empty. You have no transactions yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-inter text-sm">
              <thead>
                <tr className="border-b border-border text-muted text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold w-32">Date</th>
                  <th className="py-3 px-4 font-semibold">Transaction description</th>
                  <th className="py-3 px-4 font-semibold text-right w-48">
                    Transaction amount
                  </th>
                  <th className="py-3 px-4 font-semibold text-right w-28">Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-[#F8FAFC]">
                    <td className="py-4 px-4 text-muted font-medium whitespace-nowrap" suppressHydrationWarning>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-semibold text-dark max-w-xl break-words">
                      {tx.note || "Placement Earnings"}
                    </td>
                    <td
                      className={`py-4 px-4 text-right font-bold whitespace-nowrap ${
                        tx.amount < 0 ? "text-danger" : "text-success"
                      }`}
                    >
                      {tx.amount < 0 ? "-" : "+"}$
                      {Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right text-muted font-medium whitespace-nowrap">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdrawal Request Modal */}
      {isWithdrawOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17,44,62,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="card bg-card rounded-xl p-8"
            style={{
              width: "100%",
              maxWidth: "500px",
              border: "1px solid var(--color-border)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              margin: "auto",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-space text-dark">
                Request Withdrawal
              </h2>
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="text-muted hover:text-dark font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <button
                type="button"
                onClick={() => setWithdrawMethod("paypal")}
                className={`btn btn-sm flex flex-col items-center gap-1 p-3 cursor-pointer ${
                  withdrawMethod === "paypal"
                    ? "btn-primary"
                    : "btn-outline text-muted"
                }`}
                style={{ height: "auto", borderRadius: "8px" }}
              >
                <span className="font-bold text-sm">P</span>
                <span className="text-xs">PayPal</span>
              </button>
              <button
                type="button"
                onClick={() => setWithdrawMethod("wire")}
                className={`btn btn-sm flex flex-col items-center gap-1 p-3 cursor-pointer ${
                  withdrawMethod === "wire"
                    ? "btn-primary"
                    : "btn-outline text-muted"
                }`}
                style={{ height: "auto", borderRadius: "8px" }}
              >
                <BanknotesIcon className="w-5 h-5" />
                <span className="text-xs">Bank Transfer</span>
              </button>
            </div>

            <form
              onSubmit={handleRequestWithdrawal}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label className="text-sm font-medium text-dark block mb-2 font-inter">
                  Withdrawal Amount ($)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="5"
                  step="0.01"
                  max={initialBalance}
                  className="input"
                  placeholder="Minimum $5.00"
                />
              </div>

              {withdrawMethod === "paypal" ? (
                <div>
                  <label className="text-sm font-medium text-dark block mb-2 font-inter">
                    PayPal Email Address
                  </label>
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    required
                    className="input"
                    placeholder="name@example.com"
                  />
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                >
                  <div>
                    <label className="text-sm font-medium text-dark block mb-2 font-inter">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                      className="input"
                      placeholder="Chase Bank"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark block mb-2 font-inter">
                      IBAN / Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                      className="input"
                      placeholder="US1234567890"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full font-space font-semibold mt-4"
                disabled={isPending}
              >
                {isPending ? "Processing..." : "Submit Withdrawal Request"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Top-up Modal (Advertiser only) */}
      {isTopUpOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17,44,62,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsTopUpOpen(false);
          }}
        >
          <div
            className="card bg-card rounded-xl p-8"
            style={{
              width: "100%",
              maxWidth: "420px",
              border: "1px solid var(--color-border)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              margin: "auto",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-space text-dark">
                Add Funds
              </h2>
              <button
                onClick={() => setIsTopUpOpen(false)}
                className="text-muted hover:text-dark font-bold text-lg"
              >
                ×
              </button>
            </div>

            {/* MediaHub Payments Badge Header (Yellow/Amber Theme) */}
            <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#F59E0B] text-white font-black flex items-center justify-center text-xs shadow-xs font-space">
                  MH
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#78350F] font-space">MediaHub Payments</h4>
                  <p className="text-[10px] text-[#92400E]">UPI · QR · Cards · NetBanking</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>

            <form
              onSubmit={handleAddFunds}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label className="text-sm font-medium text-dark block mb-2 font-inter">
                  Amount to Deposit ($ USD)
                </label>
                <input
                  type="number"
                  min="5"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min $5.00"
                  className="input focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl space-y-1.5 text-xs text-[#78350F]">
                <div className="flex justify-between font-semibold">
                  <span>INR Equivalent Amount:</span>
                  <span className="font-bold text-sm text-[#92400E]">
                    ₹{parseFloat(amount || "0") > 0 ? (parseFloat(amount) * 95.61).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"} INR
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#B45309]">
                  <span>Exchange rate reference:</span>
                  <span className="font-semibold">1 USD = ₹95.61 INR</span>
                </div>
                <div className="pt-1.5 border-t border-[#FDE68A] text-[10px] text-[#92400E] flex items-center gap-1">
                  <span>⚡ Instant Credit · Supports GPay, PhonePe, Paytm, BHIM UPI, QR, Credit/Debit & NetBanking</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn w-full font-space font-bold mt-2 cursor-pointer bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-md transition-all text-sm py-3 rounded-xl"
                disabled={isPending}
              >
                {isPending
                  ? "Processing Payment..."
                  : `Pay ($${amount || "0.00"} USD)`}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .help-icon {
          width: 20px;
          height: 20px;
          background: #3E4FEA;
          color: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
