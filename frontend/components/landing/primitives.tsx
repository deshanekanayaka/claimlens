import React from "react";

export type Verdict = "SUPPORTED" | "CONTRADICTED" | "NOT ENOUGH INFO";

export function Stamp({ verdict, rotate = -7, size = "md", animate = false, plated = false }: {
  verdict: Verdict;
  rotate?: number;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  plated?: boolean;
}) {
  const color = verdict === "SUPPORTED" ? "text-verdict-green" : verdict === "CONTRADICTED" ? "text-verdict-red" : "text-verdict-amber";
  const sizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xl",
    xl: "text-3xl md:text-5xl",
  } as const;

  const stampEl = (
    <span
      className={`stamp ${sizes[size]} ${color} ${animate ? "animate-stamp-in" : ""}`}
      style={plated ? undefined : { transform: `rotate(${rotate}deg)` }}
    >
      {verdict}
    </span>
  );

  if (!plated) return stampEl;

  // The .stamp utility already applies generous em-based padding (0.55em 1.1em)
  // plus its own 3px double border, and both scale correctly with font size on
  // their own. The plate only needs to add a thin, near-constant margin around
  // that existing shape, just enough that the rotated dashed border never
  // clips the plate's edge. Do NOT scale this up with size, it double-counts
  // spacing the stamp already provides and produces an oversized card.
  const plateStyles = {
    sm: { padding: "2px", radius: "4px" },
    md: { padding: "3px", radius: "5px" },
    lg: { padding: "4px", radius: "6px" },
    xl: { padding: "6px", radius: "8px" },
  } as const;

  const plate = plateStyles[size];

  return (
    <span
      className="inline-block bg-white-warm"
      style={{
        transform: `rotate(${rotate}deg)`,
        padding: plate.padding,
        borderRadius: plate.radius,
      }}
    >
      {stampEl}
    </span>
  );
}

export function FlagChip({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "red" | "amber" }) {
  const toneClass = tone === "red"
    ? "text-verdict-red border-verdict-red/40"
    : tone === "amber"
      ? "text-verdict-amber border-verdict-amber/40"
      : "text-ink-soft";
  return <span className={`flag-chip ${toneClass}`}>{label}</span>;
}

export function LabelTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink">
      {children}
    </span>
  );
}

export function LensMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 15l5.2 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}