"use client";

import { PsIcon } from "./PsIcon";
import { ShareButton } from "./ShareButton";

type Side = "in" | "out";
type Counts = { in: number; out: number };

type Props = {
  vote: Side;
  counts: Counts;
  shareText: string;
  siteUrl: string;
  onUndo: () => void;
  undoing: boolean;
};

export function VotedPanel({ vote, counts, shareText, siteUrl, onUndo, undoing }: Props) {
  const isOut = vote === "out";
  const tally = isOut ? counts.out : counts.in;
  const label = isOut ? "OUT" : "IN";
  const shape = isOut ? "circle" : "cross";
  const accent = isOut ? "text-[var(--cancel)]" : "text-[var(--ps-blue)]";

  return (
    <div className="card card-shadow card-hover flex flex-col gap-5 p-6 sm:p-7">
      <div className="flex items-center gap-4">
        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 ${isOut ? "border-[var(--cancel)]" : "border-[var(--ps-blue)]"} ${accent}`}>
          <PsIcon shape={shape} size={28} />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="eyebrow text-[var(--ink-mid)]">Your vote</span>
          <span className={`heading-caps text-3xl ${accent} sm:text-4xl`}>
            You&apos;re {label}
          </span>
        </div>
      </div>
      <p className="text-base leading-relaxed text-[var(--ink-mid)] sm:text-lg">
        <span className="font-mono font-bold text-[var(--ink)]">
          {tally.toLocaleString("en-US")}
        </span>{" "}
        {isOut ? "gamers are canceling alongside you." : "gamers are renewing too."}
      </p>
      <ShareButton text={shareText} url={siteUrl} />
      <button
        onClick={onUndo}
        disabled={undoing}
        className="self-start text-sm font-medium text-[var(--ps-blue)] underline-offset-4 transition hover:underline disabled:opacity-40"
      >
        {undoing ? "Updating..." : "Change my vote"}
      </button>
    </div>
  );
}
