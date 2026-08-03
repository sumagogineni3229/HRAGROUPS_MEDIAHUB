"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { id, type, message, duration }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const ctx: ToastContextType = {
    toast: addToast,
    success: (m) => addToast(m, "success"),
    error: (m) => addToast(m, "error"),
    info: (m) => addToast(m, "info"),
    warning: (m) => addToast(m, "warning"),
  };

  const TOAST_STYLES: Record<ToastType, { bg: string; border: string; color: string; icon: React.ElementType }> = {
    success: { bg: "#e8fbee", border: "#22c55e40", color: "#16a34a", icon: CheckCircleIcon },
    error:   { bg: "#fff0f0", border: "#ef444440", color: "#dc2626", icon: XCircleIcon },
    info:    { bg: "#EEF0FD", border: "#3E4FEA40", color: "#3E4FEA", icon: InformationCircleIcon },
    warning: { bg: "#FFF8E8", border: "#f59e0b40", color: "#d97706", icon: InformationCircleIcon },
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* Toast Container */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "380px",
          width: "100%",
        }}
        aria-live="polite"
      >
        {toasts.map((t) => {
          const style = TOAST_STYLES[t.type];
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: "12px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                boxShadow: "0 8px 24px rgba(17,44,62,0.12)",
                animation: "toast-in 0.25s ease",
              }}
            >
              <Icon style={{ width: "18px", height: "18px", color: style.color, flexShrink: 0, marginTop: "1px" }} />
              <p style={{ flex: 1, margin: 0, fontSize: "13.5px", fontFamily: "var(--font-inter)", color: "var(--color-dark)", lineHeight: "1.45" }}>
                {t.message}
              </p>
              <button
                onClick={() => removeToast(t.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: style.color, padding: 0, flexShrink: 0 }}
                aria-label="Dismiss"
              >
                <XMarkIcon style={{ width: "16px", height: "16px" }} />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
