"use client";

import { useState } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        readOnly
        value={link}
        className="input flex-1"
        style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--color-grey-blue)" }}
        onClick={(e) => (e.target as HTMLInputElement).select()}
      />
      <button
        onClick={copy}
        className="btn btn-primary font-inter font-semibold flex items-center gap-2 flex-shrink-0"
        style={{ borderRadius: "8px", padding: "10px 16px" }}
      >
        {copied ? (
          <>
            <CheckIcon className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <ClipboardDocumentIcon className="w-4 h-4" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
