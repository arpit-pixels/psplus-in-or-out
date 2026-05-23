"use client";

type Props = {
  outPct: number;
  inPct: number;
};

export function VoteBar({ outPct, inPct }: Props) {
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-[var(--offwhite)] ring-1 ring-[var(--hairline)]">
      <div
        className="absolute left-0 top-0 h-full bg-[var(--cancel)] transition-[width] duration-700 ease-out"
        style={{ width: `${outPct}%` }}
      />
      <div
        className="absolute right-0 top-0 h-full bg-[var(--ps-blue)] transition-[width] duration-700 ease-out"
        style={{ width: `${inPct}%` }}
      />
    </div>
  );
}
