"use client";

import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { PsIcon } from "./PsIcon";

type Props = {
  label: string;
  value: number;
  pct: number;
  tone: "out" | "in";
};

export function CountStat({ label, value, pct, tone }: Props) {
  const animated = useAnimatedNumber(value);
  const isOut = tone === "out";
  const accent = isOut ? "text-[var(--cancel)]" : "text-[var(--ps-blue)]";
  return (
    <div className="flex flex-col gap-2">
      <span className={`eyebrow flex items-center gap-1.5 ${accent}`}>
        <PsIcon shape={isOut ? "circle" : "cross"} size={11} decorative />
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-5xl font-bold leading-none text-[var(--ink)] tabular-nums sm:text-[64px]">
          {animated.toLocaleString("en-US")}
        </span>
        <span className="font-mono text-sm font-medium text-[var(--ink-mid)] tabular-nums">
          {pct.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
