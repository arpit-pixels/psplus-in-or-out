export function PriceTable() {
  const rows: [string, string, string][] = [
    ["Essential · 1-month", "₹499", "₹649"],
    ["Essential · 12-month", "₹3,949", "₹5,139"],
    ["Extra · 12-month", "₹6,649", "₹8,649"],
    ["Deluxe · 12-month", "₹7,749", "₹10,049"],
  ];
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-2 text-center">
        <span className="eyebrow text-[var(--ps-blue)]">
          India · May 20, 2026
        </span>
        <h2 className="heading-caps text-[1.8rem] text-[var(--ink)] sm:text-[2.4rem]">
          The hike that started this
        </h2>
      </div>
      <div className="card overflow-hidden">
        {rows.map(([tier, before, after], i) => (
          <div
            key={tier}
            className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-5 py-4 text-sm sm:text-base ${
              i > 0 ? "border-t border-[var(--hairline)]" : ""
            }`}
          >
            <span className="font-medium text-[var(--ink)]">{tier}</span>
            <span className="font-mono text-[var(--ink-soft)] line-through">{before}</span>
            <span className="font-mono text-[var(--ink-soft)]">→</span>
            <span className="font-mono font-bold text-[var(--cancel)]">
              {after}
            </span>
          </div>
        ))}
      </div>
      <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-[var(--ink-mid)]">
        All four PS Plus tiers raised. Existing Indian subscribers pay the new
        price on their next renewal. ~500K subscribers affected — and Sony has a
        track record of regional hikes that go global.
      </p>
    </div>
  );
}
