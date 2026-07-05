import React from "react";

export default function Pipeline() {
  const stages = [
    {
      id: "01",
      key: "adversarial_pre_filter",
      title: "Adversarial pre-filter",
      ms: "0.1s",
      body: "Deterministic pattern match flags injection attempts in the transcript before any model call.",
      note: "deterministic",
    },
    {
      id: "02",
      key: "claim_extraction",
      title: "Claim extraction",
      ms: "~2.4s",
      body: "First AI call: distils the transcript into structured facts: part, issue, claim summary.",
      note: "claude-opus-4-6",
    },
    {
      id: "03",
      key: "image_analysis",
      title: "Image analysis",
      ms: "~6.7s",
      body: "Second AI call: inspects each photo for the claimed damage, authenticity signals, and quality issues.",
      note: "claude-sonnet-4-6",
    },
    {
      id: "04",
      key: "evidence_gates",
      title: "Evidence & risk gates",
      ms: "0.1s",
      body: "Rule-based checks: evidence standard, history flags, issue-family equivalence, schema enforcement.",
      note: "deterministic",
    },
    {
      id: "05",
      key: "verdict",
      title: "Verdict",
      ms: "~4.2s",
      body: "Third AI call, tightly scoped: SUPPORTED or CONTRADICTED with cited evidence; NOT ENOUGH INFO is issued deterministically when evidence fails the gate.",
      note: "claude-opus-4-6",
    },
  ];

  return (
    <section id="pipeline" className="border-b border-rule bg-sheet">
      <div className="mx-auto max-w-[1240px] px-6 py-20 md:py-28">
        <h2 className="font-condensed text-[40px] leading-[0.95] tracking-[-0.02em] md:text-[56px]">
          Five stages.
          <br />
          Streamed live.
        </h2>

        {/* Pipeline flow diagram */}
        <div className="mt-10 w-full overflow-x-auto">
          <svg
            viewBox="0 0 810 200"
            className="w-full min-w-[500px]"
            aria-label="Pipeline flow: adversarial pre-filter feeds into CALL 1 claim extraction, then CALL 2 image analysis, then evidence gates which either short-circuits to NOT ENOUGH INFO or proceeds to CALL 3 verdict"
          >
            <defs>
              <marker id="pl-ah" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill="#5c635e" />
              </marker>
            </defs>

            {/* ── Boxes ── */}
            {/* 0: pre-filter */}
            <rect x="9" y="72" width="136" height="48" fill="var(--color-sheet)" stroke="var(--color-rule)" strokeWidth="1" />
            <text x="77" y="91" fontFamily="var(--font-mono)" fontSize="10" fontWeight="600" fill="#1f2421" textAnchor="middle" letterSpacing="0.1em">PRE-FILTER</text>
            <text x="77" y="108" fontFamily="var(--font-mono)" fontSize="9" fill="#5c635e" textAnchor="middle" letterSpacing="0.07em">deterministic</text>

            {/* 1: CALL 1 extract */}
            <rect x="173" y="72" width="136" height="48" fill="var(--color-sheet)" stroke="var(--color-rule)" strokeWidth="1" />
            <text x="241" y="91" fontFamily="var(--font-mono)" fontSize="10" fontWeight="600" fill="#2b4c8c" textAnchor="middle" letterSpacing="0.1em">CALL 1</text>
            <text x="241" y="108" fontFamily="var(--font-mono)" fontSize="9" fill="#5c635e" textAnchor="middle" letterSpacing="0.07em">claim extraction</text>

            {/* 2: CALL 2 inspect */}
            <rect x="337" y="72" width="136" height="48" fill="var(--color-sheet)" stroke="var(--color-rule)" strokeWidth="1" />
            <text x="405" y="91" fontFamily="var(--font-mono)" fontSize="10" fontWeight="600" fill="#2b4c8c" textAnchor="middle" letterSpacing="0.1em">CALL 2</text>
            <text x="405" y="108" fontFamily="var(--font-mono)" fontSize="9" fill="#5c635e" textAnchor="middle" letterSpacing="0.07em">image analysis</text>

            {/* 3: gates */}
            <rect x="501" y="72" width="136" height="48" fill="var(--color-sheet)" stroke="var(--color-rule)" strokeWidth="1" />
            <text x="569" y="91" fontFamily="var(--font-mono)" fontSize="10" fontWeight="600" fill="#1f2421" textAnchor="middle" letterSpacing="0.1em">GATES</text>
            <text x="569" y="108" fontFamily="var(--font-mono)" fontSize="9" fill="#5c635e" textAnchor="middle" letterSpacing="0.07em">deterministic</text>

            {/* 4: CALL 3 verdict */}
            <rect x="665" y="72" width="136" height="48" fill="var(--color-sheet)" stroke="var(--color-rule)" strokeWidth="1" />
            <text x="733" y="91" fontFamily="var(--font-mono)" fontSize="10" fontWeight="600" fill="#2b4c8c" textAnchor="middle" letterSpacing="0.1em">CALL 3</text>
            <text x="733" y="108" fontFamily="var(--font-mono)" fontSize="9" fill="#5c635e" textAnchor="middle" letterSpacing="0.07em">verdict</text>

            {/* ── Horizontal arrows ── */}
            <line x1="145" y1="96" x2="170" y2="96" stroke="#5c635e" strokeWidth="1" markerEnd="url(#pl-ah)" />
            <line x1="309" y1="96" x2="334" y2="96" stroke="#5c635e" strokeWidth="1" markerEnd="url(#pl-ah)" />
            <line x1="473" y1="96" x2="498" y2="96" stroke="#5c635e" strokeWidth="1" markerEnd="url(#pl-ah)" />
            <line x1="637" y1="96" x2="662" y2="96" stroke="#5c635e" strokeWidth="1" markerEnd="url(#pl-ah)" />

            {/* ── NEI short-circuit branch ── */}
            <line x1="569" y1="120" x2="569" y2="146" stroke="#5c635e" strokeWidth="1" markerEnd="url(#pl-ah)" />
            <text x="576" y="136" fontFamily="var(--font-mono)" fontSize="8" fill="#5c635e" letterSpacing="0.06em">short-circuit</text>

            {/* NEI box */}
            <rect x="495" y="148" width="148" height="36" fill="var(--color-sheet)" stroke="#d8b888" strokeWidth="1" />
            <text x="569" y="171" fontFamily="var(--font-mono)" fontSize="9.5" fontWeight="600" fill="#a06a00" textAnchor="middle" letterSpacing="0.08em">NOT ENOUGH INFO</text>
          </svg>
        </div>

        <ol className="mt-12 divide-y divide-rule border-y border-rule">
          {stages.map((s) => (
            <li key={s.id} className="grid grid-cols-12 items-start gap-6 py-8 transition-colors hover:bg-ledger">
              <div className="col-span-2 md:col-span-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">{s.id}</div>
              <div className="col-span-10 md:col-span-4">
                <h3 className="font-condensed text-2xl leading-tight md:text-3xl">{s.title}</h3>
                <div className="mt-1 font-mono text-sm text-ink-soft">{s.key}</div>
              </div>
              <p className="col-span-12 md:col-span-5 text-base leading-relaxed text-ink-soft">{s.body}</p>
              <div className="col-span-12 md:col-span-2 flex items-center justify-start md:justify-end gap-2 font-mono text-sm">
                <svg viewBox="0 0 12 12" className="h-3 w-3 text-form-blue" aria-hidden>
                  <path d="M2 6.5l2.6 2.6L10 3.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="square" />
                </svg>
                <span className="text-ink">{s.ms}</span>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
          Total ~14.2s · 3 AI calls · deterministic gates between each
        </p>
      </div>
    </section>
  );
}
