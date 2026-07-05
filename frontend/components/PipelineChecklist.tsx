"use client";

/**
 * The live inspection checklist: renders the pipeline's fixed stage sequence
 * and ticks each row as SSE events arrive. This is the interface's signature
 * moment; everything else stays quiet around it.
 */

import type { StageEvent } from "@/lib/api";

const STAGES: { key: string; label: string; description: string }[] = [
  { key: "prefilter", label: "Adversarial pre-filter", description: "Deterministic injection scan" },
  { key: "extract", label: "Claim extraction", description: "CALL 1 · claude-opus-4-6" },
  { key: "analyze_images", label: "Image analysis", description: "CALL 2 · claude-sonnet-4-6" },
  { key: "gates", label: "Evidence & risk gates", description: "Deterministic rules" },
  { key: "verdict", label: "Verdict", description: "CALL 3 · claude-opus-4-6, or NEI short-circuit" },
];

type StageState = "waiting" | "running" | "done";

function stageStates(events: StageEvent[]): Record<string, StageState> {
  const states: Record<string, StageState> = {};
  for (const { key } of STAGES) states[key] = "waiting";
  for (const event of events) {
    if (!(event.stage in states)) continue;
    states[event.stage] = event.detail.status === "done" ? "done" : "running";
  }
  return states;
}

/** Pull the most informative detail line for a completed stage. */
function stageNote(key: string, events: StageEvent[]): string | null {
  const done = [...events].reverse().find((e) => e.stage === key && e.detail.status === "done");
  if (!done) return null;
  const d = done.detail as Record<string, unknown>;
  switch (key) {
    case "extract":
      return d.claim_summary ? String(d.claim_summary) : null;
    case "analyze_images":
      return `sees ${d.overall_issue_visible} on ${d.overall_part_visible} · evidence ${
        d.evidence_standard_met ? "met" : "not met"
      }`;
    case "gates":
      return d.risk_flags && d.risk_flags !== "none" ? `flags: ${d.risk_flags}` : null;
    default:
      return null;
  }
}

export function PipelineChecklist({ events }: { events: StageEvent[] }) {
  const states = stageStates(events);
  return (
    <ol className="divide-y divide-rule border border-rule bg-sheet">
      {STAGES.map(({ key, label, description }) => {
        const state = states[key];
        const note = stageNote(key, events);
        return (
          <li key={key} className="flex items-start gap-3 px-4 py-3">
            <span
              aria-hidden
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border font-mono text-xs ${
                state === "done"
                  ? "border-verdict-green bg-verdict-green text-white"
                  : state === "running"
                    ? "animate-pulse border-form-blue text-form-blue"
                    : "border-rule text-transparent"
              }`}
            >
              {state === "done" ? "✓" : state === "running" ? "…" : "·"}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium">
                {label}
                <span className="ml-2 font-mono text-xs font-normal text-ink-soft">
                  {description}
                </span>
              </span>
              {note && (
                <span className="mt-0.5 block truncate font-mono text-xs text-ink-soft">
                  {note}
                </span>
              )}
            </span>
            <span className="ml-auto font-mono text-xs text-ink-soft">
              {state === "running" ? "running" : state === "done" ? "done" : ""}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
