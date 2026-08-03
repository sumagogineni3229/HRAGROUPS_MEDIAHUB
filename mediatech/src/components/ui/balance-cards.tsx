"use client";

import { WalletIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

interface BalanceCardsProps {
  balance: number;
  reserved: number;
  thirdMetric: number;
  thirdMetricLabel: string;
}

export function BalanceCards({
  balance,
  reserved,
  thirdMetric,
  thirdMetricLabel
}: BalanceCardsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
      {/* Main Balance card */}
      <div className="card bg-card rounded-lg p-6" style={{ border: '2.5px solid #3E4FEA' }}>
        <div className="text-3xl font-bold text-dark font-space mb-2">
          ${Math.floor(balance)}<span className="text-lg">.{((balance % 1) * 100).toFixed(0).padStart(2, '0')}</span>
        </div>
        <span className="text-xs font-medium text-dark font-space block mb-1">Main balance</span>
        <p className="text-xs text-muted leading-relaxed font-inter">Funds you have added through available payment methods</p>
      </div>

      {/* Reserved Balance card */}
      <div className="card bg-card border-base rounded-lg p-6">
        <div className="text-3xl font-bold text-dark font-space mb-2">
          ${Math.floor(reserved)}<span className="text-lg">.{((reserved % 1) * 100).toFixed(0).padStart(2, '0')}</span>
        </div>
        <span className="text-xs font-medium text-dark font-space block mb-1">Reserved balance</span>
        <p className="text-xs text-muted leading-relaxed font-inter">Funds that have been reserved as a task payment</p>
      </div>

      {/* Third Metric card (Bonus / Lifetime Earnings) */}
      <div className="card bg-card border-base rounded-lg p-6">
        <div className="text-3xl font-bold text-dark font-space mb-2">
          ${Math.floor(thirdMetric)}<span className="text-lg">.{((thirdMetric % 1) * 100).toFixed(0).padStart(2, '0')}</span>
        </div>
        <span className="text-xs font-medium text-dark font-space block mb-1">{thirdMetricLabel}</span>
        <p className="text-xs text-muted leading-relaxed font-inter">
          {thirdMetricLabel === "Bonus balance" 
            ? "Extra funds that may be added for special activities" 
            : "Total earnings accumulated over the lifespan of this account"}
        </p>
      </div>
    </div>
  );
}
