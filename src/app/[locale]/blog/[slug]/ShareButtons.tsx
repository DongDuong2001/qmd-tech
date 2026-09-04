"use client";

import React, { useState } from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const shareOnFacebook = () => {
    const targetUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareOnTwitter = () => {
    const targetUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(targetUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-[#64748B] flex items-center gap-1 mr-1">
        <Share2 className="h-3.5 w-3.5" />
        Chia sẻ:
      </span>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        type="button"
        className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-all ${
          copied
            ? "border-[#16A34A] bg-[#DCFCE7] text-[#16A34A]"
            : "border-[#CBD5E1] bg-white text-[#475569] hover:border-[#0063FD] hover:text-[#0063FD]"
        }`}
        title="Sao chép liên kết bài viết"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-[#16A34A]" />
            <span>Đã chép</span>
          </>
        ) : (
          <>
            <LinkIcon className="h-3.5 w-3.5" />
            <span>Sao chép link</span>
          </>
        )}
      </button>

      {/* Facebook */}
      <button
        onClick={shareOnFacebook}
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#1877F2] hover:bg-[#EFF6FF] hover:border-[#1877F2] transition-colors"
        title="Chia sẻ lên Facebook"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>

      {/* Twitter / X */}
      <button
        onClick={shareOnTwitter}
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-[#F1F5F9] hover:border-[#0F172A] transition-colors"
        title="Chia sẻ lên X / Twitter"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
    </div>
  );
}
