import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface InfoBannerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable blue info banner matching the platform design system.
 * Wraps content with the standard blue tinted background and info icon.
 */
export function InfoBanner({ children, className = "" }: InfoBannerProps) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border border-primary bg-[#EEF0FD] ${className}`}
    >
      <InformationCircleIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <span className="text-sm font-inter text-dark leading-relaxed">{children}</span>
    </div>
  );
}
