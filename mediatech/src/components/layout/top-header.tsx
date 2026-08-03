"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { BellIcon, ChevronDownIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

type Crumb = { label: string; href?: string };

type RecentNotif = {
  id: string;
  type: string;
  title: string;
  body: string;
  link?: string | null;
  isRead: boolean;
  createdAt: Date;
};

type TopHeaderProps = {
  breadcrumbs: Crumb[];
  balance?: number;
  reserved?: number;
  bonus?: number;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  notificationCount?: number;
  recentNotifications?: RecentNotif[];
};

export function TopHeader({
  breadcrumbs,
  balance = 0,
  reserved = 0,
  bonus = 0,
  userName = "",
  userRole = "Media Partner",
  userAvatar,
  notificationCount = 0,
  recentNotifications = [],
}: TopHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const balanceHref =
    userRole === "Advertiser"
      ? "/advertiser/balance"
      : userRole === "Publisher"
      ? "/publisher/balance"
      : "/influencer/balance";

  const notifPageHref = "/notifications";

  // Notification type colors
  const typeColor: Record<string, string> = {
    TASK_UPDATE: "#3E4FEA",
    PAYMENT: "#22c55e",
    MESSAGE: "#3E4FEA",
    SYSTEM: "#94a3b8",
  };

  return (
    <header className="top-header">
      {/* Breadcrumbs */}
      <nav className="header-breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="header-breadcrumb__item">
            {i > 0 && <span className="header-breadcrumb__sep">›</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="header-breadcrumb__link">
                {crumb.label}
              </Link>
            ) : (
              <span className="header-breadcrumb__current">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="header-right">
        {/* Wallet info */}
        <Link href={balanceHref} className="header-wallet hover:opacity-80 transition-opacity">
          <span className="header-wallet__item">
            Balance: <strong>${balance.toFixed(2)}</strong>
          </span>
          <span className="header-wallet__sep" />
          <span className="header-wallet__item">
            Reserved: <strong>${reserved.toFixed(2)}</strong>
          </span>
          <span className="header-wallet__sep" />
          <span className="header-wallet__item">
            Bonus: <strong>${bonus.toFixed(2)}</strong>
          </span>
        </Link>

        {/* Actions */}
        <div className="header-actions">
          {/* Notification Bell with Dropdown */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button
              className="header-icon-btn"
              aria-label="Notifications"
              onClick={() => {
                setNotifOpen(!notifOpen);
                setDropdownOpen(false);
              }}
            >
              <BellIcon className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="header-notif-badge">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="notif-dropdown">
                {/* Header */}
                <div className="notif-dropdown__header">
                  <span className="notif-dropdown__title">Notifications</span>
                  {notificationCount > 0 && (
                    <span className="notif-dropdown__badge">{notificationCount} new</span>
                  )}
                </div>

                {/* List */}
                <div className="notif-dropdown__list">
                  {recentNotifications.length === 0 ? (
                    <div className="notif-dropdown__empty">
                      <BellIcon className="w-8 h-8" style={{ color: "#94a3b8", marginBottom: "8px" }} />
                      <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>All caught up!</p>
                    </div>
                  ) : (
                    recentNotifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link || notifPageHref}
                        onClick={() => setNotifOpen(false)}
                        className="notif-item"
                        style={{ background: n.isRead ? "transparent" : "#F8F9FF" }}
                      >
                        {/* Color dot */}
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: typeColor[n.type] ?? "#94a3b8",
                            flexShrink: 0,
                            marginTop: "5px",
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="notif-item__title">{n.title}</p>
                          <p className="notif-item__body">{n.body}</p>
                          <p className="notif-item__time">
                            {new Date(n.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {!n.isRead && (
                          <div
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: "#3E4FEA",
                              flexShrink: 0,
                              marginTop: "6px",
                            }}
                          />
                        )}
                      </Link>
                    ))
                  )}
                </div>

                {/* Footer */}
                <Link
                  href={notifPageHref}
                  onClick={() => setNotifOpen(false)}
                  className="notif-dropdown__footer"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          {/* Profile Dropdown Area */}
          <div className="profile-dropdown-container" ref={dropdownRef}>
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotifOpen(false);
              }}
              className="header-avatar-trigger"
              aria-label="Toggle profile menu"
            >
              <div className="header-avatar">
                {userAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={userAvatar} alt={userName} width={32} height={32} />
                ) : (
                  <span>{initials || "U"}</span>
                )}
              </div>
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-user-info">
                  <div className="user-role">{userRole}</div>
                  <div className="user-name">{userName || "User"}</div>
                </div>

                <div className="dropdown-divider" />

                <div className="dropdown-section">
                  <Link
                    href={balanceHref}
                    className="dropdown-item dropdown-item-wallet"
                  >
                    <span>Balance</span>
                    <ChevronDownIcon className="w-4 h-4 text-grey-blue" />
                  </Link>
                  <Link href="/account-settings" className="dropdown-item">
                    Account Settings
                  </Link>
                  <Link href="/notifications" className="dropdown-item">
                    Notifications
                    {notificationCount > 0 && (
                      <span
                        style={{
                          background: "#3E4FEA",
                          color: "white",
                          fontSize: "11px",
                          fontWeight: 700,
                          borderRadius: "10px",
                          padding: "1px 7px",
                        }}
                      >
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="dropdown-item text-danger"
                  >
                    Log out
                  </button>
                </div>

                <div className="dropdown-divider" />

                <div className="dropdown-footer-status">
                  <span className="status-label">Activity status</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={activityStatus}
                      onChange={(e) => setActivityStatus(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .header-breadcrumb {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }
        .header-breadcrumb__item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-family: var(--font-inter);
        }
        .header-breadcrumb__sep { color: var(--color-grey-blue); }
        .header-breadcrumb__link { color: var(--color-grey-blue); text-decoration: none; }
        .header-breadcrumb__link:hover { color: var(--color-primary); }
        .header-breadcrumb__current { color: var(--color-dark); font-weight: 500; }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .header-wallet {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-family: var(--font-inter);
          color: var(--color-grey-blue);
          text-decoration: none;
        }
        .header-wallet strong { color: var(--color-dark); }
        .header-wallet__sep {
          width: 1px;
          height: 14px;
          background: var(--color-border);
          display: block;
        }
        .header-actions { display: flex; align-items: center; gap: 8px; }
        .header-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-grey-blue);
          background: none;
          border: none;
          text-decoration: none;
          position: relative;
          transition: background 0.12s;
          cursor: pointer;
        }
        .header-icon-btn:hover { background: var(--color-muted); color: var(--color-dark); }
        .header-notif-badge {
          position: absolute;
          top: 2px; right: 2px;
          background: var(--color-danger);
          color: white;
          font-size: 9px;
          font-weight: 700;
          border-radius: 10px;
          padding: 0 4px;
          min-width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-inter);
        }

        /* Notification Dropdown */
        .notif-dropdown {
          position: absolute;
          top: 42px;
          right: 0;
          width: 360px;
          background: white;
          border-radius: 14px;
          border: 1px solid var(--color-border);
          box-shadow: 0 12px 40px rgba(17,44,62,0.14);
          z-index: 60;
          overflow: hidden;
        }
        .notif-dropdown__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px 12px;
          border-bottom: 1px solid var(--color-border);
        }
        .notif-dropdown__title {
          font-size: 14px;
          font-weight: 700;
          font-family: var(--font-space-grotesk);
          color: var(--color-dark);
        }
        .notif-dropdown__badge {
          font-size: 11px;
          font-weight: 700;
          font-family: var(--font-inter);
          color: white;
          background: #3E4FEA;
          border-radius: 10px;
          padding: 2px 8px;
        }
        .notif-dropdown__list {
          max-height: 320px;
          overflow-y: auto;
        }
        .notif-dropdown__empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
        }
        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          text-decoration: none;
          border-bottom: 1px solid var(--color-border);
          transition: background 0.1s;
        }
        .notif-item:hover { background: #f8f9ff !important; }
        .notif-item:last-child { border-bottom: none; }
        .notif-item__title {
          margin: 0 0 2px;
          font-size: 12.5px;
          font-weight: 600;
          font-family: var(--font-space-grotesk);
          color: var(--color-dark);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .notif-item__body {
          margin: 0 0 3px;
          font-size: 11.5px;
          font-family: var(--font-inter);
          color: var(--color-grey-blue);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .notif-item__time {
          margin: 0;
          font-size: 10.5px;
          font-family: var(--font-inter);
          color: var(--color-muted);
        }
        .notif-dropdown__footer {
          display: block;
          text-align: center;
          padding: 11px;
          font-size: 12.5px;
          font-weight: 600;
          font-family: var(--font-inter);
          color: var(--color-primary);
          text-decoration: none;
          border-top: 1px solid var(--color-border);
          background: #fafbff;
          transition: background 0.1s;
        }
        .notif-dropdown__footer:hover { background: #EEF0FD; }

        .profile-dropdown-container { position: relative; }
        .header-avatar-trigger {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .header-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #677F9B;
          color: white;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          overflow: hidden;
          font-family: var(--font-inter);
          flex-shrink: 0;
        }
        .header-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .profile-dropdown {
          position: absolute;
          top: 40px;
          right: 0;
          width: 240px;
          background: white;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          box-shadow: 0 10px 30px rgba(17,44,62,0.12);
          z-index: 50;
          padding: 16px 0 12px;
          display: flex;
          flex-direction: column;
        }
        .dropdown-user-info { padding: 0 20px 12px; }
        .dropdown-user-info .user-role {
          font-size: 11px;
          color: var(--color-grey-blue);
          text-transform: uppercase;
          font-family: var(--font-inter);
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .dropdown-user-info .user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-dark);
          font-family: var(--font-space-grotesk);
          margin-top: 2px;
        }
        .dropdown-divider {
          height: 1px;
          background: #EEF0FD;
          margin: 4px 0;
        }
        .dropdown-section {
          display: flex;
          flex-direction: column;
          padding: 6px 0;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          font-size: 13.5px;
          font-family: var(--font-inter);
          color: var(--color-dark);
          text-decoration: none;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }
        .dropdown-item:hover { background: #F5F8FA; }
        .dropdown-item.text-primary { color: var(--color-primary); font-weight: 500; }
        .dropdown-item.text-danger { color: var(--color-danger); }
        .dropdown-item-wallet { font-weight: 500; }

        .dropdown-footer-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px 4px;
        }
        .status-label {
          font-size: 13.5px;
          font-family: var(--font-inter);
          color: var(--color-grey-blue);
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 38px;
          height: 20px;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #DCDCE5;
          transition: .3s;
          border-radius: 20px;
        }
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
        input:checked + .toggle-slider { background-color: #4cd964; }
        input:checked + .toggle-slider:before { transform: translateX(18px); }

        @media (max-width: 768px) {
          .header-wallet { display: none; }
          .notif-dropdown { width: 300px; right: -40px; }
        }
      `}</style>
    </header>
  );
}
