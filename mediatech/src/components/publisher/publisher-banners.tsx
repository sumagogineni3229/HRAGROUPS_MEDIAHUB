"use client";

import { useState, useEffect } from "react";

export function PublisherBanners({ hasRejectedPlatforms }: { hasRejectedPlatforms: boolean }) {
  const [show2fa, setShow2fa] = useState(false);
  const [showModeration, setShowModeration] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("dismiss-2fa-reminder") !== "true") {
      setShow2fa(true);
    }
    if (hasRejectedPlatforms && localStorage.getItem("dismiss-moderation-rejected") !== "true") {
      setShowModeration(true);
    }
  }, [hasRejectedPlatforms]);

  const dismiss2fa = () => {
    setShow2fa(false);
    localStorage.setItem("dismiss-2fa-reminder", "true");
  };

  const dismissModeration = () => {
    setShowModeration(false);
    localStorage.setItem("dismiss-moderation-rejected", "true");
  };

  return (
    <>
      {show2fa && (
        <div id="banner-2fa-reminder" className="banner banner-info rounded-lg mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="info-icon">ℹ</span>
            <span>Get more protection by adding Two-Factor Authentication (2FA) via Google Authenticator</span>
          </div>
          <button 
            onClick={dismiss2fa}
            className="text-muted hover:text-dark cursor-pointer font-bold px-2"
          >
            ×
          </button>
        </div>
      )}

      {showModeration && (
        <div id="banner-moderation-rejected" className="banner banner-promo rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="warning-icon">⚠️</span>
            <span>Unfortunately, one or several of your sites didn&apos;t pass the moderation. We recommend you to join our partner platform - Magenet - to earn money from your sites by placing contextual ads on them.</span>
          </div>
          <button 
            onClick={dismissModeration}
            className="text-muted hover:text-dark cursor-pointer font-bold px-2"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
