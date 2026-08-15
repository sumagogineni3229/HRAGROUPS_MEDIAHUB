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
  const [withdrawMethod, setWithdrawMethod] = useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = useState("");
  const [upiHolderName, setUpiHolderName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
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

    let methodLabel = "";
    let details = "";

    if (withdrawMethod === "upi") {
      if (!upiId.trim()) {
        alert("Please enter a valid UPI ID");
        return;
      }
      methodLabel = "UPI";
      details = `UPI ID: ${upiId.trim()}${upiHolderName.trim() ? ` (Name: ${upiHolderName.trim()})` : ""}`;
    } else {
      if (!accountHolderName.trim() || !bankName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
        alert("Please fill in all bank account fields");
        return;
      }
      methodLabel = "Bank Transfer";
      details = `A/C Name: ${accountHolderName.trim()} | Bank: ${bankName.trim()} | A/C No: ${accountNumber.trim()} | IFSC: ${ifscCode.trim().toUpperCase()}`;
    }

    startTransition(async () => {
      try {
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
    <div className="w-full">
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
        <div className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const q = (formData.get("search") as string) || "";
              const params = new URLSearchParams(window.location.search);
              if (q.trim()) {
                params.set("query", q.trim());
              } else {
                params.delete("query");
              }
              window.location.search = params.toString();
            }}
            className="flex gap-3 mb-4"
            style={{ maxWidth: "500px" }}
          >
            <input
              type="text"
              name="search"
              defaultValue={typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("query") || "" : ""}
              className="input flex-1"
              placeholder="Search by Note, Order ID, or Tx ID..."
            />
            <button type="submit" className="btn btn-outline btn-sm font-semibold">
              Search
            </button>
          </form>

          {/* Role-Specific Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {basePath === "advertiser" ? (
              <>
                <Link
                  href="/advertiser/balance?type=ALL"
                  className={`btn btn-sm ${currentTab === "ALL" ? "bg-primary text-white" : "btn-ghost text-muted"}`}
                >
                  All Transactions
                </Link>
                <Link
                  href="/advertiser/balance?type=TOPUP"
                  className={`btn btn-sm ${currentTab === "TOPUP" ? "bg-primary text-white" : "btn-ghost text-muted"}`}
                >
                  Top-Ups (Deposits)
                </Link>
                <Link
                  href="/advertiser/balance?type=PAYMENT"
                  className={`btn btn-sm ${currentTab === "PAYMENT" ? "bg-primary text-white" : "btn-ghost text-muted"}`}
                >
                  Order Payments
                </Link>
                <Link
                  href="/advertiser/balance?type=REFUND"
                  className={`btn btn-sm ${currentTab === "REFUND" ? "bg-primary text-white" : "btn-ghost text-muted"}`}
                >
                  Refunds
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/${basePath}/balance?type=ALL`}
                  className={`btn btn-sm ${currentTab === "ALL" ? "bg-primary text-white" : "btn-ghost text-muted"}`}
                >
                  All Transactions
                </Link>
                <Link
                  href={`/${basePath}/balance?type=EARNING`}
                  className={`btn btn-sm ${currentTab === "EARNING" ? "bg-primary text-white" : "btn-ghost text-muted"}`}
                >
                  Order Earnings
                </Link>
                <Link
                  href={`/${basePath}/balance?type=WITHDRAWAL`}
                  className={`btn btn-sm ${currentTab === "WITHDRAWAL" ? "bg-primary text-white" : "btn-ghost text-muted"}`}
                >
                  Withdrawals / Payouts
                </Link>
              </>
            )}
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="py-8 text-center text-muted font-inter text-sm">
            No transactions found for this selection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-inter text-sm">
              <thead>
                <tr className="border-b border-border text-muted text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold w-28">Date</th>
                  <th className="py-3 px-4 font-semibold w-28">Type</th>
                  <th className="py-3 px-4 font-semibold w-28">Status</th>
                  <th className="py-3 px-4 font-semibold">Description / Details</th>
                  <th className="py-3 px-4 font-semibold text-right w-44">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  const typeLabel =
                    tx.type === "TOPUP"
                      ? "Top-Up"
                      : tx.type === "PAYMENT"
                      ? "Payment"
                      : tx.type === "EARNING"
                      ? "Earning"
                      : tx.type === "WITHDRAWAL"
                      ? "Withdrawal"
                      : tx.type === "REFUND"
                      ? "Refund"
                      : tx.type;

                  const badgeColor =
                    tx.type === "TOPUP"
                      ? { bg: "#ECFDF5", text: "#059669" }
                      : tx.type === "EARNING"
                      ? { bg: "#ECFDF5", text: "#059669" }
                      : tx.type === "REFUND"
                      ? { bg: "#EFF6FF", text: "#2563EB" }
                      : tx.type === "PAYMENT"
                      ? { bg: "#FEF2F2", text: "#DC2626" }
                      : { bg: "#FFFBEB", text: "#D97706" };

                  // Status badge for withdrawals & transactions
                  const status = (tx.status || "COMPLETED").toUpperCase();
                  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
                    PENDING: { label: "Pending", bg: "#FFFBEB", text: "#D97706" },
                    PROCESSING: { label: "Processing", bg: "#EFF6FF", text: "#2563EB" },
                    PAID: { label: "Completed", bg: "#ECFDF5", text: "#059669" },
                    COMPLETED: { label: "Completed", bg: "#ECFDF5", text: "#059669" },
                    REJECTED: { label: "Rejected", bg: "#FEF2F2", text: "#DC2626" },
                  };
                  const sc = statusConfig[status] || statusConfig["COMPLETED"];

                  return (
                    <tr key={tx.id} className="border-b border-border hover:bg-[#F8FAFC]">
                      <td className="py-4 px-4 text-muted font-medium whitespace-nowrap text-xs" suppressHydrationWarning>
                        {new Date(tx.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: badgeColor.bg, color: badgeColor.text }}
                        >
                          {typeLabel}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className="px-2.5 py-0.5 rounded-md text-xs font-semibold"
                          style={{ background: sc.bg, color: sc.text }}
                        >
                          {sc.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-dark max-w-xl">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-sm text-dark">
                            {tx.note || (tx.type === "TOPUP" ? "Funds Added via PhonePe" : "Order Payment")}
                          </span>
                          {tx.task && (
                            <span className="text-xs text-muted">
                              Order ID:{" "}
                              <Link
                                href={`/${basePath}/tasks/${tx.task.id}`}
                                className="text-primary hover:underline font-mono"
                              >
                                {tx.task.id}
                              </Link>
                              {tx.task.platform?.url && ` · ${tx.task.platform.url}`}
                              {tx.task.channel?.handle && ` · @${tx.task.channel.handle}`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className={`py-4 px-4 text-right font-bold whitespace-nowrap text-sm ${
                          isPositive ? "text-success" : "text-danger"
                        }`}
                      >
                        {isPositive ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
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
                marginBottom: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => setWithdrawMethod("upi")}
                className={`btn btn-sm flex flex-col items-center gap-1 p-3 cursor-pointer ${
                  withdrawMethod === "upi"
                    ? "btn-primary"
                    : "btn-outline text-muted"
                }`}
                style={{ height: "auto", borderRadius: "8px" }}
              >
                <span className="font-bold text-sm">UPI</span>
                <span className="text-xs">Instant VPA</span>
              </button>
              <button
                type="button"
                onClick={() => setWithdrawMethod("bank")}
                className={`btn btn-sm flex flex-col items-center gap-1 p-3 cursor-pointer ${
                  withdrawMethod === "bank"
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
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label className="text-xs font-semibold text-dark block mb-1 font-inter">
                  Withdrawal Amount ($ USD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="5"
                  step="0.01"
                  max={initialBalance}
                  className="input font-bold"
                  placeholder="Minimum $5.00"
                />
              </div>

              {withdrawMethod === "upi" ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-dark block mb-1 font-inter">
                      UPI ID (VPA) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                      className="input"
                      placeholder="e.g. mobile@ybl, username@oksbi"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-dark block mb-1 font-inter">
                      Account Holder Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={upiHolderName}
                      onChange={(e) => setUpiHolderName(e.target.value)}
                      className="input"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-dark block mb-1 font-inter">
                      Account Holder Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      required
                      className="input"
                      placeholder="Name as per bank records"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-dark block mb-1 font-inter">
                        Bank Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                        className="input"
                        placeholder="e.g. HDFC Bank"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark block mb-1 font-inter">
                        IFSC Code <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        required
                        className="input font-mono"
                        placeholder="HDFC0001234"
                        style={{ textTransform: "uppercase" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-dark block mb-1 font-inter">
                      Account Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                      className="input"
                      placeholder="Bank Account Number"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full font-space font-semibold mt-2"
                disabled={isPending}
                style={{ padding: "12px", borderRadius: "8px", justifyContent: "center" }}
              >
                {isPending ? "Submitting..." : `Request ${withdrawMethod === "upi" ? "UPI" : "Bank"} Payout`}
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
