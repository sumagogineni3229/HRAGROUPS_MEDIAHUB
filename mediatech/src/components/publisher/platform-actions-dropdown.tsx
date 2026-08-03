"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  EllipsisHorizontalIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

interface PlatformActionsDropdownProps {
  platformId: string;
  url: string;
}

export function PlatformActionsDropdown({ platformId, url }: PlatformActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline btn-sm text-dark px-2.5 py-1.5 flex items-center justify-center hover:bg-slate-100 transition-colors"
        title="More actions"
      >
        <EllipsisHorizontalIcon className="w-5 h-5 text-slate-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-slate-100 py-1">
          <Link
            href={`/publisher/platforms/new?edit=${platformId}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <PencilSquareIcon className="w-4 h-4 text-slate-500" />
            Edit Platform
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-500" />
            Visit Website
          </a>
          <div className="border-t border-slate-100 my-1"></div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              alert("Platform management options updating...");
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <TrashIcon className="w-4 h-4 text-red-500" />
            Delete / Archive
          </button>
        </div>
      )}
    </div>
  );
}
