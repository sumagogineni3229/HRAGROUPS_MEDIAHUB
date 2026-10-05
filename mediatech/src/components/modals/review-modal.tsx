"use client";

import React, { useState, useTransition } from "react";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { submitPlatformReview } from "@/app/actions/reviews";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: {
    id: string;
    url: string;
    sampleUrl?: string | null;
    reviews?: any[];
  } | null;
  currentUserId?: string;
  onSuccess?: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  platform,
  currentUserId,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Pre-fill existing user review if already submitted
  React.useEffect(() => {
    if (platform && currentUserId) {
      const userReview = platform.reviews?.find((r) => r.userId === currentUserId);
      if (userReview) {
        setRating(userReview.rating);
        setComment(userReview.comment || "");
      } else {
        setRating(5);
        setComment("");
      }
    }
  }, [platform, currentUserId]);

  if (!isOpen || !platform) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const res = await submitPlatformReview({
        platformId: platform.id,
        rating,
        comment,
      });

      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to submit review");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-space font-bold text-slate-900 text-lg">Review & Rate Website</h3>
            <p className="text-xs text-slate-500 font-inter mt-0.5 truncate max-w-sm">
              {platform.url}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Star Selection */}
          <div className="text-center py-2 space-y-2">
            <span className="text-xs font-semibold text-slate-600 block uppercase tracking-wider">
              Your Rating
            </span>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    {isFilled ? (
                      <StarIcon className="w-8 h-8 text-amber-400 fill-amber-400" />
                    ) : (
                      <StarOutlineIcon className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-bold text-amber-600">
              {rating === 5
                ? "⭐⭐⭐⭐⭐ Exceptional"
                : rating === 4
                ? "⭐⭐⭐⭐ Very Good"
                : rating === 3
                ? "⭐⭐⭐ Good Quality"
                : rating === 2
                ? "⭐⭐ Fair"
                : "⭐ Needs Improvement"}
            </span>
          </div>

          {/* Comment input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Review Feedback / Quality Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about content quality, publishing speed, or previous work inspection..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-inter resize-none bg-slate-50/50"
            />
          </div>

          {/* Past Reviews List Preview if any */}
          {platform.reviews && platform.reviews.length > 0 && (
            <div className="border-t border-slate-100 pt-3">
              <span className="text-[11px] font-bold text-slate-500 block mb-2 uppercase tracking-wide">
                Community Reviews ({platform.reviews.length})
              </span>
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1 text-xs">
                {platform.reviews.map((r: any) => (
                  <div key={r.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 text-[11px]">
                        {r.user?.name || "Advertiser"}
                      </span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <StarIcon key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-[11px] text-slate-600 font-normal leading-relaxed">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
