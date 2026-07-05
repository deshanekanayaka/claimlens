/** Small shared display primitives for verdicts, severity, and risk flags. */

const STAMP_STYLE: Record<string, string> = {
  supported: "text-verdict-green",
  contradicted: "text-verdict-red",
  not_enough_information: "text-verdict-amber",
};

const STAMP_LABEL: Record<string, string> = {
  supported: "Supported",
  contradicted: "Contradicted",
  not_enough_information: "Not enough information",
};

export function VerdictStamp({ status }: { status: string }) {
  return (
    <span className={`stamp ${STAMP_STYLE[status] ?? "text-ink-soft"}`}>
      {STAMP_LABEL[status] ?? status}
    </span>
  );
}

const SEVERITY_STYLE: Record<string, string> = {
  none: "bg-ledger text-ink-soft",
  low: "bg-verdict-green/10 text-verdict-green",
  medium: "bg-verdict-amber/10 text-verdict-amber",
  high: "bg-verdict-red/10 text-verdict-red",
  unknown: "bg-ledger text-ink-soft",
};

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      className={`rounded px-2 py-0.5 font-mono text-xs font-medium ${
        SEVERITY_STYLE[severity] ?? SEVERITY_STYLE.unknown
      }`}
    >
      severity: {severity}
    </span>
  );
}

export function RiskFlags({ flags }: { flags: string }) {
  const list = (flags || "none").split(";").map((f) => f.trim()).filter(Boolean);
  if (list.length === 1 && list[0] === "none") {
    return <span className="font-mono text-xs text-ink-soft">no risk flags</span>;
  }
  return (
    <span className="flex flex-wrap gap-1.5">
      {list.map((flag) => (
        <span
          key={flag}
          className="rounded border border-verdict-red/40 bg-verdict-red/5 px-2 py-0.5 font-mono text-xs text-verdict-red"
        >
          {flag}
        </span>
      ))}
    </span>
  );
}
