type Props = {
  shape: "cross" | "circle" | "triangle" | "square";
  size?: number;
  className?: string;
  decorative?: boolean;
};

const LABELS: Record<Props["shape"], string> = {
  circle: "Cancel (PS circle button)",
  cross: "Confirm (PS cross button)",
  triangle: "PS triangle button",
  square: "PS square button",
};

export function PsIcon({ shape, size = 24, className = "", decorative = false }: Props) {
  const stroke = 2.2;
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": LABELS[shape] };

  if (shape === "circle") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" {...a11y}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={stroke} />
      </svg>
    );
  }
  if (shape === "cross") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" {...a11y}>
        <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
        <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
      </svg>
    );
  }
  if (shape === "triangle") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" {...a11y}>
        <polygon points="12,3.5 21,19.5 3,19.5" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" {...a11y}>
      <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth={stroke} rx="1.5" />
    </svg>
  );
}
