"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CountStat } from "@/components/CountStat";
import { VoteBar } from "@/components/VoteBar";
import { Hero } from "@/components/Hero";
import { VoteButtons } from "@/components/VoteButtons";
import { VotedPanel } from "@/components/VotedPanel";
import { PriceTable } from "@/components/PriceTable";
import { Ticker } from "@/components/Ticker";

type Side = "in" | "out";
type Counts = { in: number; out: number };
type Status = "loading" | "ready" | "voting" | "voted" | "undoing";

const LS_KEY = "psplus_vote";
const POLL_MS = 4000;
const SITE_URL = "https://psplus-poll.vercel.app";

export default function Home() {
  const [counts, setCounts] = useState<Counts>({ in: 0, out: 0 });
  const [vote, setVote] = useState<Side | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCounts = useCallback(async () => {
    try {
      const r = await fetch("/api/counts", { cache: "no-store" });
      if (r.ok) setCounts(await r.json());
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem(LS_KEY) as Side | null)
        : null;
    if (stored === "in" || stored === "out") {
      setVote(stored);
      setStatus("voted");
    } else {
      setStatus("ready");
    }
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") fetchCounts();
    };
    pollRef.current = setInterval(tick, POLL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchCounts]);

  const onVote = async (side: Side) => {
    if (status === "voting" || status === "voted" || status === "undoing") return;
    setStatus("voting");
    try {
      const r = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ side }),
      });
      if (r.ok) {
        const data = (await r.json()) as Counts & { side: Side };
        setCounts({ in: data.in, out: data.out });
        setVote(side);
        localStorage.setItem(LS_KEY, side);
        setStatus("voted");
      } else {
        setStatus("ready");
      }
    } catch {
      setStatus("ready");
    }
  };

  const onUndo = async () => {
    if (!vote || status === "undoing") return;
    setStatus("undoing");
    try {
      const r = await fetch("/api/vote", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ side: vote }),
      });
      if (r.ok) {
        const data = (await r.json()) as Counts;
        setCounts({ in: data.in, out: data.out });
      }
    } catch {
      /* still reset locally */
    }
    localStorage.removeItem(LS_KEY);
    setVote(null);
    setStatus("ready");
  };

  const total = counts.in + counts.out;
  const outPct = total === 0 ? 50 : (counts.out / total) * 100;
  const inPct = total === 0 ? 50 : (counts.in / total) * 100;

  const shareText =
    vote === "out"
      ? `I just voted OUT — ${counts.out.toLocaleString("en-US")} gamers are canceling PS Plus over Sony's price hikes. Where do you stand?`
      : vote === "in"
      ? `I'm staying on PS Plus despite Sony's price hikes. ${counts.in.toLocaleString("en-US")} other gamers feel the same. Where do you stand?`
      : `Sony just hiked PS Plus prices. ${counts.out.toLocaleString("en-US")} gamers have canceled. Are you IN or OUT?`;

  return (
    <main className="flex w-full flex-1 flex-col">
      <section className="navy-hero-bg diag-bottom">
        <Hero total={total} />
      </section>

      <section className="diag-bottom -mt-9 bg-white pb-14 pt-14 sm:-mt-20 sm:pb-24 sm:pt-24">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-7 px-5 sm:gap-9 sm:px-8">
          <div className="card card-shadow flex flex-col gap-5 p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <CountStat label="OUT" value={counts.out} pct={outPct} tone="out" />
              <CountStat label="IN" value={counts.in} pct={inPct} tone="in" />
            </div>
            <VoteBar outPct={outPct} inPct={inPct} />
            <div className="flex items-center justify-between text-xs text-[var(--ink-mid)] sm:text-sm">
              <span className="font-mono">
                {total.toLocaleString("en-US")} total votes
              </span>
              <span className="eyebrow flex items-center gap-1.5 text-[var(--ink-mid)]">
                <span className="live-dot inline-block h-1 w-1 rounded-full bg-[var(--ps-blue)]" />
                Live
              </span>
            </div>
          </div>

          {status === "voted" && vote ? (
            <VotedPanel
              vote={vote}
              counts={counts}
              shareText={shareText}
              siteUrl={SITE_URL}
              onUndo={onUndo}
              undoing={status === ("undoing" as Status)}
            />
          ) : (
            <VoteButtons
              onVote={onVote}
              disabled={status === "voting" || status === "undoing"}
            />
          )}
        </div>
      </section>

      <section className="ps-blue-bg diag-bottom -mt-9 pb-14 pt-14 sm:-mt-20 sm:pb-24 sm:pt-24">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-5 sm:px-8">
          <div className="flex flex-col gap-1 text-center">
            <span className="eyebrow text-white/75">Around the world</span>
            <h2 className="heading-caps text-[1.6rem] text-white sm:text-[2.2rem]">
              Where gamers are voting
            </h2>
          </div>
          <Ticker />
        </div>
      </section>

      <section className="-mt-9 bg-white pb-14 pt-14 sm:-mt-20 sm:pb-24 sm:pt-24">
        <div className="mx-auto flex w-full max-w-2xl flex-col px-5 sm:px-8">
          <PriceTable />
        </div>
      </section>

      <footer className="ps-blue-bg pb-9 pt-9 text-white sm:pb-12 sm:pt-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-5 text-center sm:px-8">
          <div className="flex items-center gap-3 text-white">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polygon points="12,3.5 21,19.5 3,19.5" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
            </svg>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
            </svg>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2.2" rx="1.5" />
            </svg>
          </div>
          <p className="eyebrow text-white/85">PS Plus · IN or OUT</p>
          <p className="text-xs leading-relaxed text-white/70 sm:text-sm">
            Built by gamers, for gamers. One vote per browser. Not affiliated
            with Sony or PlayStation.
          </p>
          <p className="text-[11px] leading-relaxed text-white/55">
            Your approximate city and country (from your IP) may appear in the
            live ticker. We don&apos;t store IPs, names, emails, or any other
            personal info.
          </p>
        </div>
      </footer>
    </main>
  );
}
