"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  EllipsisHorizontalIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  ArrowTopRightOnSquareIcon 
} from "@heroicons/react/24/outline";
import { deleteChannel } from "@/app/(influencer)/influencer/channels/actions";

interface ChannelActionsDropdownProps {
  channelId: string;
  platform: string;
  handle: string;
  profileUrl?: string | null;
}

export function ChannelActionsDropdown({
  channelId,
  platform,
  handle,
  profileUrl,
}: ChannelActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Determine external URL for social handle if profileUrl is not set
  const cleanHandle = handle.replace(/^@/, "");
  let targetUrl = profileUrl;
  if (!targetUrl) {
    switch (platform.toUpperCase()) {
      case "INSTAGRAM":
        targetUrl = `https://instagram.com/${cleanHandle}`;
        break;
      case "YOUTUBE":
        targetUrl = `https://youtube.com/@${cleanHandle}`;
        break;
      case "TIKTOK":
        targetUrl = `https://tiktok.com/@${cleanHandle}`;
        break;
      case "X":
      case "TWITTER":
        targetUrl = `https://x.com/${cleanHandle}`;
        break;
      case "FACEBOOK":
        targetUrl = `https://facebook.com/${cleanHandle}`;
        break;
      case "LINKEDIN":
        targetUrl = `https://linkedin.com/in/${cleanHandle}`;
        break;
      default:
        targetUrl = "#";
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove the channel "${handle}"?`)) {
      return;
    }
    setIsDeleting(true);
    const res = await deleteChannel(channelId);
    setIsDeleting(false);
    if (!res.success) {
      alert(res.error || "Could not delete channel");
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline btn-sm text-dark px-2.5 py-1.5 flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-300 rounded-md"
        title="More actions"
      >
        <EllipsisHorizontalIcon className="w-5 h-5 text-slate-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-slate-100 py-1">
          {targetUrl && targetUrl !== "#" && (
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-500" />
            </a>
          )}
          <Link
            href={`/influencer/channels/new?edit=${channelId}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <PencilSquareIcon className="w-4 h-4 text-slate-500" />
            Edit Channel & Pkgs
          </Link>
          <div className="border-t border-slate-100 my-1"></div>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <TrashIcon className="w-4 h-4 text-red-500" />
            {isDeleting ? "Deleting..." : "Delete Channel"}
          </button>
        </div>
      )}
    </div>
  );
}
