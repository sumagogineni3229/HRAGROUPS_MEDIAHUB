"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  subItems?: { label: string; href: string }[];
};

type SidebarProps = {
  navItems: NavItem[];
  role: string;
};

export function Sidebar({ navItems, role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo__icon">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="#3E4FEA" />
            <text x="18" y="23" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Space Grotesk">M</text>
          </svg>
        </div>
        <span className="sidebar-logo__text">MediaHub</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const hasChildren = item.subItems && item.subItems.length > 0;
          return (
            <div key={item.href} className="sidebar-nav__group">
              <Link
                href={item.href}
                className={cn("sidebar-nav__item", isActive && "sidebar-nav__item--active")}
              >
                <span className="sidebar-nav__icon">{item.icon}</span>
                <span className="sidebar-nav__label">{item.label}</span>
              </Link>
              {hasChildren && isActive && (
                <div className="sidebar-nav__sublist">
                  {item.subItems!.map((sub) => {
                    // Check if current path matches subItem href (exact match)
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn("sidebar-nav__subitem", isSubActive && "sidebar-nav__subitem--active")}
                      >
                        <span className="sidebar-nav__bullet">•</span>
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <style>{`
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px 20px;
        }
        .sidebar-logo__text {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-dark);
          font-family: var(--font-space-grotesk);
        }
        .sidebar-nav {
          flex: 1;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
        }
        .sidebar-nav__item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          font-family: var(--font-inter);
          color: var(--color-grey-blue);
          text-decoration: none;
          transition: background 0.12s ease, color 0.12s ease;
        }
        .sidebar-nav__item:hover {
          background: #f5f8fa;
          color: var(--color-dark);
        }
        .sidebar-nav__item--active {
          background: transparent;
          color: var(--color-primary);
          font-weight: 600;
        }
        .sidebar-nav__item--active .sidebar-nav__icon {
          color: var(--color-primary);
        }
        .sidebar-nav__icon {
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--color-grey-blue);
        }
        .sidebar-nav__sublist {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-left: 28px;
          margin-top: 4px;
        }
        .sidebar-nav__subitem {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          font-size: 13.5px;
          font-weight: 500;
          font-family: var(--font-inter);
          color: var(--color-grey-blue);
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.12s, color 0.12s;
        }
        .sidebar-nav__subitem:hover {
          background: #f5f8fa;
          color: var(--color-dark);
        }
        .sidebar-nav__subitem--active {
          color: var(--color-primary);
          font-weight: 600;
        }
        .sidebar-nav__bullet {
          font-size: 14px;
          color: var(--color-grey-blue);
        }
        .sidebar-nav__subitem--active .sidebar-nav__bullet {
          color: var(--color-primary);
        }
      `}</style>
    </aside>
  );
}