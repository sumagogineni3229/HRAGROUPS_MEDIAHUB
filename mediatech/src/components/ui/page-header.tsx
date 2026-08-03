import React from "react";

interface PageHeaderProps {
  /** Breadcrumb labels in order, e.g. ["Home", "Balance", "Request earnings"] */
  crumbs: string[];
  /** Main h1 title */
  title: string;
  /** Optional right-side element (e.g. an action button) */
  action?: React.ReactNode;
}

/**
 * Reusable page header: breadcrumb trail + H1 title.
 * Matches the standard page layout pattern across all route groups.
 */
export function PageHeader({ crumbs, title, action }: PageHeaderProps) {
  return (
    <>
      <div className="mb-4 font-inter text-xs text-muted">
        <span>{crumbs.join(" > ")}</span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-space text-dark">{title}</h1>
        {action && <div>{action}</div>}
      </div>
    </>
  );
}
