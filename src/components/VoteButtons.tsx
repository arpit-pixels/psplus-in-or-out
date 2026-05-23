"use client";

import { PsIcon } from "./PsIcon";

type Side = "in" | "out";

type Props = {
  onVote: (side: Side) => void;
  disabled: boolean;
};

export function VoteButtons({ onVote, disabled }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <button
        onClick={() => onVote("out")}
        disabled={disabled}
        className="pill pill-red w-full px-7 py-5 text-base disabled:opacity-50 sm:py-6 sm:text-lg"
      >
        <PsIcon shape="circle" size={20} className="text-white" decorative />
        I&apos;M CANCELING
      </button>

      <button
        onClick={() => onVote("in")}
        disabled={disabled}
        className="pill pill-blue w-full px-7 py-5 text-base disabled:opacity-50 sm:py-6 sm:text-lg"
      >
        <PsIcon shape="cross" size={20} className="text-white" decorative />
        I&apos;M STAYING
      </button>
    </div>
  );
}
