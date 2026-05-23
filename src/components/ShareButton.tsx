"use client";

import { useState } from "react";

type Props = {
  text: string;
  url: string;
};

export function ShareButton({ text, url }: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const full = `${text} ${url}`;
    if (
      typeof navigator !== "undefined" &&
      "share" in navigator &&
      /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share({ text, url });
        return;
      } catch {
        /* fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this:", full);
    }
  };

  return (
    <button
      onClick={onClick}
      className="pill pill-ghost w-full px-7 py-4 text-base sm:py-5 sm:text-lg"
    >
      {copied ? "LINK COPIED ✓" : "SHARE — TELL OTHER GAMERS"}
    </button>
  );
}
