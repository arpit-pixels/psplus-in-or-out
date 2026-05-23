"use client";

import { useCallback, useEffect, useState } from "react";

type Side = "in" | "out";

type RecentVote = {
  side: Side;
  city: string | null;
  country: string | null;
  ts: number;
};

function timeAgo(ms: number): string {
  const diff = Math.max(0, Date.now() - ms);
  const s = Math.floor(diff / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function location(v: RecentVote): string {
  if (v.city && v.country) return `${v.city}, ${v.country}`;
  if (v.country) return v.country;
  return "Somewhere";
}

export function Ticker() {
  const [items, setItems] = useState<RecentVote[]>([]);
  const [stamp, setStamp] = useState(Date.now());

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/recent", { cache: "no-store" });
      if (!r.ok) return;
      const data = (await r.json()) as { items: RecentVote[] };
      setItems(data.items.slice(0, 7));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => setStamp(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-white/25 px-5 py-4">
        <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
        <span className="eyebrow text-white/80">
          Waiting for first votes...
        </span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/20">
      <div className="flex items-center justify-between border-b border-white/15 px-5 py-3">
        <span className="eyebrow flex items-center gap-2 text-white/85">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
          Live · recent votes
        </span>
        <span className="eyebrow text-white/55">
          Updated {timeAgo(stamp - 1000)}
        </span>
      </div>
      <ul className="divide-y divide-white/10">
        {items.map((v, i) => {
          const isOut = v.side === "out";
          return (
            <li
              key={`${v.ts}-${i}`}
              className="ticker-row flex items-center justify-between gap-3 px-5 py-3 text-sm text-white sm:text-base"
            >
              <div className="flex items-center gap-3 truncate">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    isOut ? "border-white/80" : "border-white/80"
                  } font-mono text-[11px] font-bold text-white`}
                  aria-hidden="true"
                >
                  {isOut ? "○" : "×"}
                </span>
                <span className="truncate">
                  <span className="font-semibold">{location(v)}</span>{" "}
                  <span className="text-white/65">voted</span>{" "}
                  <span className="font-semibold">
                    {isOut ? "OUT" : "IN"}
                  </span>
                </span>
              </div>
              <span className="shrink-0 eyebrow text-white/55">
                {timeAgo(v.ts)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
