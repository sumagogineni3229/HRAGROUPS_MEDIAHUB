"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  TrashIcon,
  PencilSquareIcon,
  SparklesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { ConnectPlatformModal } from "@/components/modals/connect-platform-modal";
import { connectChannelAction, deleteChannel } from "@/app/(influencer)/influencer/channels/actions";
import { getSocialProfileUrl } from "@/lib/social-platforms";

export interface SocialAccountDef {
  key: string;
  name: string;
  category: string;
  color: string;
  bgColor: string;
  borderColor: string;
  authType: string;
  scopes: string[];
  iconSvg: React.ReactNode;
}

const SUPPORTED_PLATFORMS: SocialAccountDef[] = [
  {
    key: "LINKEDIN",
    name: "LinkedIn",
    category: "Professional Network",
    color: "#0A66C2",
    bgColor: "#EEF4FB",
    borderColor: "#CCE0F5",
    authType: "LinkedIn OAuth 2.0",
    scopes: ["r_liteprofile", "r_emailaddress", "w_member_social", "r_organization_social"],
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.94 0 1.7-.76 1.7-1.7s-.76-1.7-1.7-1.7-1.7.76-1.7 1.7.76 1.7 1.7 1.7m1.4 9.74v-8.37H5.06v8.37h2.8z" />
      </svg>
    ),
  },
  {
    key: "INSTAGRAM",
    name: "Instagram",
    category: "Visual Content & Reels",
    color: "#E1306C",
    bgColor: "#FDF0F4",
    borderColor: "#F9CCD9",
    authType: "Meta / Instagram Graph API",
    scopes: ["instagram_basic", "instagram_content_publish", "pages_show_list", "instagram_manage_insights"],
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    key: "YOUTUBE",
    name: "YouTube",
    category: "Video & Shorts",
    color: "#FF0000",
    bgColor: "#FEF0F0",
    borderColor: "#FDC8C8",
    authType: "Google OAuth 2.0 / YouTube API",
    scopes: ["youtube.readonly", "youtube.channel_statistics", "userinfo.profile"],
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    key: "FACEBOOK",
    name: "Facebook",
    category: "Meta Page / Community",
    color: "#1877F2",
    bgColor: "#EEF5FD",
    borderColor: "#CBE0FC",
    authType: "Meta Business Login",
    scopes: ["pages_manage_posts", "pages_read_engagement", "pages_show_list"],
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    key: "X",
    name: "X (Twitter)",
    category: "Microblogging & Threads",
    color: "#0F1419",
    bgColor: "#F3F4F6",
    borderColor: "#E5E7EB",
    authType: "X (Twitter) OAuth 2.0",
    scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: "TIKTOK",
    name: "TikTok",
    category: "Short-form Video",
    color: "#000000",
    bgColor: "#F0F0F0",
    borderColor: "#DCDCDC",
    authType: "TikTok Login Kit API",
    scopes: ["user.info.basic", "user.info.stats", "video.list", "video.publish"],
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    key: "THREADS",
    name: "Threads",
    category: "Meta Threads API",
    color: "#000000",
    bgColor: "#F8F8F8",
    borderColor: "#E2E2E2",
    authType: "Meta Threads API",
    scopes: ["threads_basic", "threads_content_publish", "threads_read_replies"],
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12.186 24C5.467 24 0 18.667 0 12.107 0 5.547 5.467.213 12.186.213c6.72 0 12.187 5.334 12.187 11.894 0 .746-.08 1.493-.213 2.24-1.12-1.067-2.48-1.84-3.973-2.293.08-.453.133-.907.133-1.387 0-4.48-3.627-8.107-8.133-8.107-4.507 0-8.134 3.627-8.134 8.107 0 4.48 3.627 8.107 8.134 8.107 1.6 0 3.067-.48 4.32-1.28.373 1.12 1.013 2.133 1.866 2.986C16.586 23.413 14.453 24 12.186 24z" />
      </svg>
    ),
  },
  {
    key: "TELEGRAM",
    name: "Telegram",
    category: "Channels & Broadcasts",
    color: "#229ED9",
    bgColor: "#EDF8FC",
    borderColor: "#C7ECF9",
    authType: "Telegram Bot API Auth",
    scopes: ["channel_posts", "channel_subscribers_read"],
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.894-.972 4.437-1.371 6.302-.168.79-.46 1.055-.741 1.08-.611.056-1.074-.403-1.666-.791-.926-.607-1.449-.984-2.348-1.576-1.039-.684-.365-1.06.227-1.674.155-.16 2.845-2.607 2.896-2.828.006-.028.012-.132-.05-.187s-.152-.036-.218-.021c-.092.021-1.564.996-4.414 2.92-.418.287-.796.428-1.135.42-.374-.008-1.093-.212-1.628-.386-.656-.213-1.178-.326-1.133-.688.024-.189.283-.382.778-.58 3.048-1.328 5.082-2.203 6.101-2.626 2.908-1.209 3.513-1.42 3.906-1.426.087-.001.279.02.404.122.106.086.135.202.148.283-.004.066.002.261-.014.397z" />
      </svg>
    ),
  },
];

interface ConnectedChannelsClientProps {
  channels: any[];
}

export function ConnectedChannelsClient({ channels }: ConnectedChannelsClientProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialAccountDef | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const handleOpenConnect = (platform: SocialAccountDef) => {
    setSelectedPlatform(platform);
    setModalOpen(true);
  };

  const handleConnectSuccess = async (data: any) => {
    const res = await connectChannelAction(data);
    if (!res.success) {
      throw new Error(res.error || "Failed to link channel");
    }
  };

  const handleDisconnect = async (channelId: string, channelName: string) => {
    if (!confirm(`Are you sure you want to disconnect ${channelName}?`)) {
      return;
    }
    setDisconnectingId(channelId);
    try {
      const res = await deleteChannel(channelId);
      if (!res.success) {
        alert(res.error || "Failed to disconnect channel");
      }
    } finally {
      setDisconnectingId(null);
    }
  };

  return (
    <>
      {/* Platform Connection Hub Grid */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold font-space text-slate-900">
              Social Media Account Connections
            </h2>
            <p className="text-xs text-slate-500">
              Connect your official creator profiles to unlock brand collaboration campaigns and automatic metric sync.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{channels.length} Connected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUPPORTED_PLATFORMS.map((p) => {
            const connectedChannel = channels.find(
              (c) => c.platform.toUpperCase() === p.key.toUpperCase()
            );
            const isConnected = Boolean(connectedChannel);

            return (
              <div
                key={p.key}
                className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md ${
                  isConnected ? "border-emerald-300 ring-1 ring-emerald-500/10" : "border-slate-200"
                }`}
              >
                {/* Top Badge & Platform Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl p-2.5 flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.iconSvg}
                    </div>

                    {isConnected ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" /> Connected ✓
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-md">
                        Not Connected
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 font-space text-base">{p.name}</h3>
                  <span className="text-[11px] text-slate-400 block mb-2">{p.category}</span>

                  {isConnected && connectedChannel && (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 my-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Handle:</span>
                        <a
                          href={getSocialProfileUrl(connectedChannel.platform, connectedChannel.handle, connectedChannel.profileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-slate-900 hover:text-amber-600 flex items-center gap-1"
                        >
                          <span>{connectedChannel.handle}</span>
                          <ArrowTopRightOnSquareIcon className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Audience:</span>
                        <span className="font-semibold text-slate-700">
                          {(connectedChannel.followers || 0).toLocaleString()} followers
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Engagement:</span>
                        <span className="font-semibold text-emerald-600">
                          {connectedChannel.engagement || 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom CTA Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  {isConnected && connectedChannel ? (
                    <>
                      <Link
                        href={`/influencer/channels/new?edit=${connectedChannel.id}`}
                        className="flex-1 text-center py-2 px-3 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <PencilSquareIcon className="w-3.5 h-3.5" /> Edit Details
                      </Link>
                      <button
                        type="button"
                        disabled={disconnectingId === connectedChannel.id}
                        onClick={() => handleDisconnect(connectedChannel.id, `${p.name} (${connectedChannel.handle})`)}
                        className="py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                        title="Disconnect Account"
                      >
                        {disconnectingId === connectedChannel.id ? (
                          <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <TrashIcon className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenConnect(p)}
                      className="w-full text-center py-2.5 px-4 text-xs font-bold text-white rounded-xl shadow-sm transition-all hover:opacity-95 flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: p.color }}
                    >
                      <span>Connect {p.name}</span>
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OAuth Simulator / Consent Modal */}
      <ConnectPlatformModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        platform={selectedPlatform}
        onConnectSuccess={handleConnectSuccess}
      />
    </>
  );
}
