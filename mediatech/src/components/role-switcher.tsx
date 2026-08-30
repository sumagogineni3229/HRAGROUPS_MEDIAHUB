"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { switchRoleAction } from "@/app/actions/switch-role";

const ROLES = [
  {
    key: "ADVERTISER",
    label: "Advertiser",
    icon: "📢",
    description: "Place ads & manage campaigns",
    home: "/advertiser/sites",
    color: "#3E4FEA",
    bg: "#EEF0FD",
  },
  {
    key: "PUBLISHER",
    label: "Publisher",
    icon: "🌐",
    description: "Monetise your website",
    home: "/publisher/platforms",
    color: "#059669",
    bg: "#D1FAE5",
  },
  {
    key: "INFLUENCER",
    label: "Influencer",
    icon: "⭐",
    description: "Grow with sponsored content",
    home: "/influencer/channels",
    color: "#D97706",
    bg: "#FEF3C7",
  },
] as const;

type Props = {
  activeRole: string;
  enabledRoles?: string[];
};

export function RoleSwitcher({ activeRole, enabledRoles = [] }: Props) {
  const session = useSession();
  const update = session?.update;
  const router = useRouter();
  const [switching, setSwitching] = useState<string | null>(null);

  const handleSwitch = async (roleKey: string) => {
    if (roleKey === activeRole || switching) return;

    setSwitching(roleKey);
    try {
      // 1. Call Server Action directly
      const result = await switchRoleAction(roleKey);

      if (!result.success) {
        // Fallback to fetch endpoint if needed
        const res = await fetch("/api/auth/switch-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: roleKey }),
        });
        if (!res.ok) {
          console.error("Failed to switch role:", result.error);
          return;
        }
      }

      // 2. Refresh JWT so activeRole propagates through session
      try {
        await update?.({ activeRole: roleKey });
      } catch (_) {}

      // 3. Navigate to the new role's home
      const target = ROLES.find((r) => r.key === roleKey)?.home ?? "/";
      window.location.href = target;
    } catch (err) {
      console.error("Role switch error:", err);
    } finally {
      setSwitching(null);
    }
  };

  return (
    <div className="role-switcher">
      <div className="role-switcher__label">Switch account</div>
      <div className="role-switcher__pills">
        {ROLES.map((r) => {
          const isActive = r.key === activeRole;
          const isLoading = switching === r.key;
          const wasEnabled = enabledRoles.includes(r.key);

          return (
            <button
              key={r.key}
              id={`role-switch-${r.key.toLowerCase()}`}
              onClick={() => handleSwitch(r.key)}
              disabled={isActive || !!switching}
              className="role-pill"
              title={r.description}
              style={{
                background: isActive ? r.bg : "transparent",
                color: isActive ? r.color : "var(--color-grey-blue)",
                border: isActive
                  ? `1.5px solid ${r.color}33`
                  : "1.5px solid var(--color-border)",
                cursor: isActive ? "default" : switching ? "wait" : "pointer",
                opacity: switching && !isLoading ? 0.5 : 1,
              }}
            >
              {isLoading ? (
                <span className="role-pill__spinner" />
              ) : (
                <span className="role-pill__icon">{r.icon}</span>
              )}
              <span className="role-pill__text">{r.label}</span>
              {isActive && <span className="role-pill__dot" style={{ background: r.color }} />}
            </button>
          );
        })}
      </div>

      <style>{`
        .role-switcher {
          padding: 10px 20px 4px;
        }
        .role-switcher__label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: var(--color-grey-blue);
          font-family: var(--font-inter);
          margin-bottom: 8px;
        }
        .role-switcher__pills {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .role-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          font-family: var(--font-inter);
          transition: background 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
          width: 100%;
          text-align: left;
        }
        .role-pill:not(:disabled):hover {
          background: var(--color-muted) !important;
          color: var(--color-dark) !important;
          border-color: var(--color-border) !important;
        }
        .role-pill__icon {
          font-size: 14px;
          line-height: 1;
          flex-shrink: 0;
        }
        .role-pill__text {
          flex: 1;
        }
        .role-pill__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .role-pill__spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
