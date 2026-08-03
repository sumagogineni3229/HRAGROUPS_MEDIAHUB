import React from "react";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

type AlertProps = {
  message: string;
  type?: "error" | "warning" | "info" | "success";
  onDismiss?: () => void;
};

export function Alert({ message, type = "error", onDismiss }: AlertProps) {
  const themes = {
    error: {
      bg: "bg-[#FDF2F2]",
      border: "border-[#F05252]",
      text: "text-[#9B1C1C]",
      iconColor: "text-[#F05252]",
    },
    warning: {
      bg: "bg-[#FDF6B2]",
      border: "border-[#E3A008]",
      text: "text-[#723B10]",
      iconColor: "text-[#C27803]",
    },
    info: {
      bg: "bg-[#EBF5FF]",
      border: "border-[#3F83F8]",
      text: "text-[#1E429F]",
      iconColor: "text-[#3F83F8]",
    },
    success: {
      bg: "bg-[#EDFDFD]",
      border: "border-[#0E9F6E]",
      text: "text-[#03543F]",
      iconColor: "text-[#0E9F6E]",
    },
  };

  const currentTheme = themes[type];

  return (
    <div className={`alert-banner ${currentTheme.bg} ${currentTheme.border} ${currentTheme.text}`}>
      <div className="alert-content">
        <ExclamationCircleIcon className={`alert-icon ${currentTheme.iconColor}`} />
        <span className="alert-message">{message}</span>
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="alert-close-btn" aria-label="Dismiss">
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}

      <style>{`
        .alert-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-left: 4px solid;
          border-radius: 8px;
          margin-bottom: 16px;
          font-family: var(--font-inter);
          font-size: 13.5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
          transition: all 0.2s ease;
        }
        .alert-content {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }
        .alert-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        .alert-message {
          font-weight: 500;
          line-height: 1.4;
        }
        .alert-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.6;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.15s, background-color 0.15s;
          color: currentColor;
        }
        .alert-close-btn:hover {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
