"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  CheckIcon, 
  XMarkIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";

interface TasksClientProps {
  tasks: any[];
  currentTab: string;
  typeFilter: string;
  taskIdFilter: string;
  siteUrlFilter: string;
  promotedUrlFilter: string;
  anchorTextFilter: string;
  startDate: string;
  endDate: string;
  allCount: number;
  reviewCount: number;
  acceptanceCount: number;
  completedCount: number;
  onAccept: (formData: FormData) => Promise<void>;
  onReject: (formData: FormData) => Promise<void>;
  onSubmitDeliverable: (formData: FormData) => Promise<void>;
}

export default function TasksClient({
  tasks,
  currentTab,
  typeFilter,
  taskIdFilter,
  siteUrlFilter,
  promotedUrlFilter,
  anchorTextFilter,
  startDate,
  endDate,
  allCount,
  reviewCount,
  acceptanceCount,
  completedCount,
  onAccept,
  onReject,
  onSubmitDeliverable,
}: TasksClientProps) {
  const [productTypeOpen, setProductTypeOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState(typeFilter || "Product type (all)");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const productTypeRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (productTypeRef.current && !productTypeRef.current.contains(event.target as Node)) {
        setProductTypeOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      {/* Breadcrumb & Title */}
      <div className="mb-6 font-inter text-xs text-muted">
        <span>Home &gt; Tasks</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-space text-dark">Tasks</h1>
        <span className="text-xs font-semibold text-primary bg-[#eef0fd] px-2 py-1 rounded cursor-pointer font-space">FAQ</span>
      </div>

      {/* Filter Inputs Grid */}
      <div className="bg-card border-base rounded-lg p-6 mb-6">
        <form method="GET" action="/publisher/tasks" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="hidden" name="status" value={currentTab} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {/* Custom Product Type Dropdown Selector */}
            <div className="relative" ref={productTypeRef}>
              <div 
                onClick={() => setProductTypeOpen(!productTypeOpen)}
                className="input flex justify-between items-center cursor-pointer select-none text-muted"
                style={{ borderColor: productTypeOpen ? 'var(--color-primary)' : 'var(--color-border)' }}
              >
                <span>{selectedProductType === "ARTICLE_POSTING" ? "Article Posting" : selectedProductType === "LINK_INSERTION" ? "Link insertion" : selectedProductType}</span>
                <ChevronDownIcon className="w-4 h-4 text-primary transition-transform" style={{ transform: productTypeOpen ? 'rotate(180deg)' : 'none' }} />
              </div>
              <input type="hidden" name="type" value={selectedProductType === "Product type (all)" ? "" : selectedProductType} />
              
              {productTypeOpen && (
                <div className="absolute top-[48px] left-0 w-full bg-white border border-border rounded-lg shadow-lg z-50 py-1 font-inter text-sm">
                  <div 
                    onClick={() => { setSelectedProductType("Product type (all)"); setProductTypeOpen(false); }}
                    className="px-4 py-2 hover:bg-app cursor-pointer text-muted"
                  >
                    Product type (all)
                  </div>
                  <div 
                    onClick={() => { setSelectedProductType("ARTICLE_POSTING"); setProductTypeOpen(false); }}
                    className="px-4 py-2 hover:bg-app cursor-pointer text-dark flex items-center gap-2"
                  >
                    <span className="text-primary font-bold">+</span> Article Posting
                  </div>
                  <div 
                    onClick={() => { setSelectedProductType("PRESS_RELEASE"); setProductTypeOpen(false); }}
                    className="px-4 py-2 hover:bg-app cursor-pointer text-dark flex items-center gap-2"
                  >
                    <span className="text-primary font-bold">+</span> Press Release
                  </div>
                  <div 
                    onClick={() => { setSelectedProductType("LINK_INSERTION"); setProductTypeOpen(false); }}
                    className="px-4 py-2 hover:bg-app cursor-pointer text-dark"
                  >
                    Link insertion
                  </div>
                </div>
              )}
            </div>

            <div>
              <input name="taskId" className="input" type="text" placeholder="Task ID" defaultValue={taskIdFilter} />
            </div>

            {/* Custom Created Date calendar picker */}
            <div className="relative" ref={datePickerRef}>
              <div 
                onClick={() => setDatePickerOpen(!datePickerOpen)}
                className="input flex justify-between items-center cursor-pointer select-none text-muted"
                style={{ borderColor: datePickerOpen ? 'var(--color-primary)' : 'var(--color-border)' }}
              >
                <span>{startDate && endDate ? `${startDate} - ${endDate}` : "Created date"}</span>
                <ChevronDownIcon className="w-4 h-4 text-primary transition-transform" style={{ transform: datePickerOpen ? 'rotate(180deg)' : 'none' }} />
              </div>

              {datePickerOpen && (
                <div className="absolute top-[48px] right-0 bg-white border border-border rounded-xl shadow-2xl z-50 p-6 flex gap-6" style={{ minWidth: '550px' }}>
                  {/* Two month mock calendar picker display */}
                  <div className="flex-1 font-inter text-xs">
                    <div className="flex justify-between items-center mb-4 font-semibold text-dark">
                      <span>August 2026</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-muted font-medium mb-2">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      <span className="py-1"></span><span className="py-1"></span><span className="py-1"></span><span className="py-1"></span><span className="py-1"></span><span className="py-1"></span>
                      <span className="py-1 bg-primary text-white rounded-full font-bold cursor-pointer">1</span>
                      {Array.from({ length: 30 }).map((_, i) => (
                        <span key={i} className="py-1 text-dark hover:bg-app rounded-full cursor-pointer">{i + 2}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 font-inter text-xs">
                    <div className="flex justify-between items-center mb-4 font-semibold text-dark">
                      <span>September 2026</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-muted font-medium mb-2">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      <span className="py-1"></span><span className="py-1"></span>
                      {Array.from({ length: 30 }).map((_, i) => (
                        <span key={i} className="py-1 text-dark hover:bg-app rounded-full cursor-pointer">{i + 1}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <input name="siteUrl" className="input" type="text" placeholder="Your site's URL" defaultValue={siteUrlFilter} />
            </div>
            <div>
              <input name="promotedUrl" className="input" type="text" placeholder="Promoted URL(s)" defaultValue={promotedUrlFilter} />
            </div>
            <div>
              <input name="anchorText" className="input" type="text" placeholder="Anchor text" defaultValue={anchorTextFilter} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary font-space font-semibold" style={{ justifyContent: 'center', width: 'fit-content' }}>
            Apply filters
          </button>
        </form>
      </div>

      {/* Status Tabs Bar */}
      <div className="bg-card border-base rounded-lg p-6">
        <div className="status-tabs mb-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <Link href="/publisher/tasks?status=ALL" className={`status-tab pb-2 ${currentTab === 'ALL' ? 'active font-bold text-primary border-b-2 border-primary' : 'text-muted'}`}>
            All (except deleted) <span className="tab-count">{allCount}</span>
          </Link>
          <Link href="/publisher/tasks?status=TASK_REVIEW" className={`status-tab pb-2 ${currentTab === 'TASK_REVIEW' ? 'active font-bold text-primary border-b-2 border-primary' : 'text-muted'}`}>
            Task Review <span className="badge badge-new" style={{ fontSize: '10px', padding: '1px 5px', marginLeft: '4px' }}>new</span>
          </Link>
          <Link href="/publisher/tasks?status=TASK_ACCEPTANCE" className={`status-tab pb-2 ${currentTab === 'TASK_ACCEPTANCE' ? 'active font-bold text-primary border-b-2 border-primary' : 'text-muted'}`}>
            Your Acceptance <span className="tab-count">{acceptanceCount}</span>
          </Link>
          <Link href="/publisher/tasks?status=IN_PROGRESS" className={`status-tab pb-2 ${currentTab === 'IN_PROGRESS' ? 'active font-bold text-primary border-b-2 border-primary' : 'text-muted'}`}>
            In Progress
          </Link>
          <Link href="/publisher/tasks?status=YOUR_APPROVAL" className={`status-tab pb-2 ${currentTab === 'YOUR_APPROVAL' ? 'active font-bold text-primary border-b-2 border-primary' : 'text-muted'}`}>
            Approval
          </Link>
          <Link href="/publisher/tasks?status=IMPROVEMENT" className={`status-tab pb-2 ${currentTab === 'IMPROVEMENT' ? 'active font-bold text-primary border-b-2 border-primary' : 'text-muted'}`}>
            Improvement
          </Link>
          <Link href="/publisher/tasks?status=COMPLETED" className={`status-tab pb-2 ${currentTab === 'COMPLETED' ? 'active font-bold text-primary border-b-2 border-primary' : 'text-muted'}`}>
            Completed <span className="tab-count">{completedCount}</span>
          </Link>
          <Link href="/publisher/tasks?status=REJECTED" className={`status-tab pb-2 ${currentTab === 'REJECTED' ? 'active font-bold text-primary border-b-2 border-primary' : 'text-muted'}`}>
            Rejected
          </Link>
          <Link href="/publisher/tasks?status=ARCHIVED" className={`status-tab pb-2 ${currentTab === 'ARCHIVED' ? 'active font-bold text-primary border-b-2 border-primary' : 'text-muted'}`}>
            Archived
          </Link>
        </div>

        {/* List Content */}
        {tasks.length === 0 ? (
          <div className="py-12 text-center text-muted font-inter text-sm">
            This list is empty.
          </div>
        ) : (
          <div className="tasks-list flex flex-col gap-4">
            {tasks.map((task) => {
              const statusMap: Record<string, { label: string; bg: string; color: string }> = {
                TASK_REVIEW:     { label: "Task Review",        bg: "#eef2ff", color: "#4f46e5" },
                TASK_ACCEPTANCE: { label: "Acceptance Required", bg: "#fffbe6", color: "#d97706" },
                IN_PROGRESS:     { label: "In Progress",         bg: "#e0f2fe", color: "#0284c7" },
                YOUR_APPROVAL:   { label: "Awaiting Approval",   bg: "#fef3c7", color: "#b45309" },
                IMPROVEMENT:     { label: "Revisions Requested", bg: "#fff0f0", color: "#dc2626" },
                COMPLETED:       { label: "Completed",           bg: "#e8fbee", color: "#16a34a" },
                REJECTED:        { label: "Declined",            bg: "#fef2f2", color: "#991b1b" },
              };
              const statusCfg = statusMap[task.status] || { label: task.status, bg: "#f3f4f6", color: "#4b5563" };

              return (
                <div key={task.id} className="bg-card border border-border rounded-xl p-6 transition-all hover:shadow-sm">
                  {/* Top Row: URL, Status, View Action */}
                  <div className="flex justify-between items-center mb-4 gap-4">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-muted block mb-1 font-inter font-medium">Website URL</span>
                      <Link href={`/publisher/tasks/${task.id}`} className="font-space font-semibold text-primary hover:underline text-base truncate block max-w-xl">
                        {task.platform?.url}
                      </Link>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold font-inter"
                        style={{ background: statusCfg.bg, color: statusCfg.color }}
                      >
                        {statusCfg.label}
                      </span>
                      <Link href={`/publisher/tasks/${task.id}`} className="text-xs text-primary font-semibold hover:underline font-inter flex items-center gap-1">
                        View &rarr;
                      </Link>
                    </div>
                  </div>

                  {/* Specifications Grid Box */}
                  <div className="bg-[#F8FAFC] border border-border rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-inter">
                    <div className="min-w-0">
                      <span className="text-muted block mb-1 font-medium">Target Promoted URL</span>
                      <a href={task.targetUrl || ""} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium break-all block">
                        {task.targetUrl}
                      </a>
                    </div>
                    <div>
                      <span className="text-muted block mb-1 font-medium">Anchor Text</span>
                      <span className="text-dark font-semibold text-sm">{task.anchorText}</span>
                    </div>
                  </div>

                  {task.brief && (
                    <div className="bg-app p-4 rounded-lg text-xs font-inter text-muted mb-4 leading-relaxed">
                      <strong className="text-dark">Content Brief:</strong> {task.brief}
                    </div>
                  )}

                  {/* Workflow Actions */}
                  <div className="flex justify-end pt-4 border-t border-border gap-3">
                    {(task.status === "TASK_ACCEPTANCE" || task.status === "TASK_REVIEW") && (
                      <div className="flex gap-2">
                        <form action={onReject}>
                          <input type="hidden" name="taskId" value={task.id} />
                          <button type="submit" className="btn btn-outline flex items-center gap-1 btn-sm text-danger" style={{ borderColor: 'var(--color-danger)' }}>
                            <XMarkIcon className="w-4 h-4" /> Reject Order
                          </button>
                        </form>
                        <form action={onAccept}>
                          <input type="hidden" name="taskId" value={task.id} />
                          <button type="submit" className="btn btn-primary flex items-center gap-1 btn-sm">
                            <CheckIcon className="w-4 h-4" /> Accept & Start
                          </button>
                        </form>
                      </div>
                    )}

                    {task.status === "IN_PROGRESS" && (
                      <form action={onSubmitDeliverable} className="flex gap-2 w-full">
                        <input type="hidden" name="taskId" value={task.id} />
                        <input 
                          name="liveUrl" 
                          type="url" 
                          required 
                          placeholder="Paste your live guest post URL here..." 
                          className="input flex-1" 
                        />
                        <button type="submit" className="btn btn-primary flex items-center gap-1 btn-sm">
                          <CheckIcon className="w-4 h-4" /> Submit Live URL
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
