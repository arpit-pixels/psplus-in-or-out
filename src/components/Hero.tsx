import { PsIcon } from "./PsIcon";

export function Hero({ total }: { total: number }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 pb-16 pt-14 sm:gap-8 sm:px-8 sm:pb-28 sm:pt-20">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-white/65">
          PlayStation Plus · Subscriber sentiment
        </span>
        <span className="eyebrow flex items-center gap-2 text-white/65">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
          {total.toLocaleString("en-US")} voted
        </span>
      </div>

      <div className="flex items-center gap-3 text-white/85">
        <PsIcon shape="triangle" size={22} />
        <PsIcon shape="circle" size={22} />
        <PsIcon shape="cross" size={22} />
        <PsIcon shape="square" size={22} />
      </div>

      <h1 className="heading-caps text-balance text-[2.5rem] text-white sm:text-[4.2rem]">
        Sony just hiked PS Plus.
        <br />
        <span className="text-white/95">Are you IN or OUT?</span>
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
        India got a <span className="font-semibold text-white">30% jump on May 20</span>.
        Other regions are next. Vote and see where gamers worldwide stand.
      </p>
    </div>
  );
}
