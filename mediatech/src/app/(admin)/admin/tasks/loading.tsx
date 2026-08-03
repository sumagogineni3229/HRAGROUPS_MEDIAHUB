import { TableSkeleton } from "@/components/ui/skeletons";
export default function Loading() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="mb-6">
        <div className="skeleton mb-2" style={{ width: "120px", height: "12px", borderRadius: "6px" }} />
        <div className="skeleton mb-2" style={{ width: "220px", height: "28px", borderRadius: "6px" }} />
      </div>
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}
