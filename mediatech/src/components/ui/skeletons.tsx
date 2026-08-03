/**
 * Loading skeleton components for tables, cards, and stat blocks.
 * Use in loading.tsx files or Suspense boundaries.
 */

export function SkeletonLine({ width = "100%", height = "14px", className = "" }: { width?: string; height?: string; className?: string }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: "6px" }}
    />
  );
}

export function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="card bg-card border-base rounded-xl p-5">
      {children}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonLine width="40px" height="40px" className="mb-3" />
      <SkeletonLine width="80px" height="28px" className="mb-2" />
      <SkeletonLine width="60%" height="12px" className="mb-1" />
      <SkeletonLine width="80%" height="12px" />
    </SkeletonCard>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3">
          <SkeletonLine width={i === 0 ? "120px" : "80px"} />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="card bg-card border-base rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-app">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-5 py-3">
                  <SkeletonLine width="70px" height="12px" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} cols={cols} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i}>
          <SkeletonLine width="40px" height="40px" className="mb-4" />
          <SkeletonLine width="70%" height="18px" className="mb-2" />
          <SkeletonLine width="90%" height="12px" className="mb-1" />
          <SkeletonLine width="60%" height="12px" className="mb-4" />
          <SkeletonLine height="32px" />
        </SkeletonCard>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="mb-6">
        <SkeletonLine width="120px" height="12px" className="mb-2" />
        <SkeletonLine width="220px" height="28px" className="mb-2" />
        <SkeletonLine width="180px" height="14px" />
      </div>
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <TableSkeleton />
    </div>
  );
}
