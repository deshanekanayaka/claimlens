import React from "react";

type FixedDefect = {
  id: string;
  vulnerability: string;
  guardrail: string;
  status: "fixed";
};

type LimitDefect = {
  id: string;
  vulnerability: string;
  status: "known_limit";
};

type Defect = FixedDefect | LimitDefect;

type Group = {
  label: string;
  defects: Defect[];
};

const groups: Group[] = [
  {
    label: "Fraud and authenticity",
    defects: [
      {
        id: "01",
        vulnerability: "Stock photos and a sculpture of a crushed box were approved as claim evidence (supported, severity high)",
        guardrail: "Authenticity check in CALL 2: watermarks, staged composition, and non-photographic subjects flag non_original_image / possible_manipulation and fail the evidence gate",
        status: "fixed",
      },
      {
        id: "02",
        vulnerability: "Image descriptions echoed the claimant's wording instead of reporting the pixels",
        guardrail: "Independent-description rule: what_is_visible must be written as if the claim was never read",
        status: "fixed",
      },
      {
        id: "06",
        vulnerability: "Stock-photo watermarks were misread as injection attempts — text_instruction_present fired on a stock-photo ID number",
        guardrail: "Flag-taxonomy clarification: watermarks and brand text belong under non_original_image; text_instruction_present is reserved for text that directs the review",
        status: "fixed",
      },
    ],
  },
  {
    label: "Output correctness",
    defects: [
      {
        id: "03",
        vulnerability: "A non-existent requirement ID (REQ_REVIEW_TRUST) was cited in an evidence decision",
        guardrail: "Citation constraint: only IDs present in the provided requirements list may be referenced",
        status: "fixed",
      },
      {
        id: "04",
        vulnerability: "Out-of-vocabulary labels leaked into the output — CALL 2 returned object_part=body for a package claim",
        guardrail: "Deterministic schema enforcement (_coerce_allowed) in agent.py: illegal issue_type / object_part values coerce to unknown",
        status: "fixed",
      },
      {
        id: "05",
        vulnerability: "Clear contradictions were misrouted as not-enough-information; CALL 3 never got to rule contradicted",
        guardrail: "Evidence-gate reframe: a clear contradiction is usable evidence (evidence_standard_met=true with claim_mismatch)",
        status: "fixed",
      },
      {
        id: "07",
        vulnerability: "A claimant's honest comparison photo caused a false rejection of a real claim — decoy-filter bypass via merged flag union",
        guardrail: "_supporting_flags rewrite in agent.py: CALL 3 receives quality flags from supporting images only; the full flag union is preserved for human reviewers",
        status: "fixed",
      },
      {
        id: "08",
        vulnerability: "Clean, watermark-free reused imagery is undetectable at the prompt level — reverse-image lookup on roadmap",
        status: "known_limit",
      },
    ],
  },
];

export default function Hardening() {
  return (
    <section id="hardening" className="border-b border-rule">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-14 px-6 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">§ 04 : Red-team log</div>
          <h2 className="mt-4 font-condensed text-[40px] leading-[0.95] tracking-[-0.02em] md:text-[56px]">
            Hardened by
            <br />
            adversaries<span className="text-form-blue">.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Adversarial testing found eight defects before shipping. Seven were patched; one—clean reused imagery—remains a documented detection boundary.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 border border-rule bg-sheet px-4 py-3 font-mono text-xs uppercase tracking-[0.16em]">
            <span className="h-2 w-2 rounded-full bg-form-blue" />
            Attack surface: reviewed
          </div>
        </div>

        <div className="lg:col-span-7">
          {groups.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? "mt-10" : ""}>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                {group.label}
              </div>
              <ol>
                {group.defects.map((d) => (
                  <li key={d.id} className="grid grid-cols-[2.5rem_1fr] items-start gap-4 border-t border-rule py-4 last:border-b">
                    <span className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                      DEF-{d.id}
                    </span>
                    {d.status === "fixed" ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-3">
                        <span className="text-sm leading-relaxed text-ink">{d.vulnerability}</span>
                        <span className="hidden text-ink-soft sm:block" aria-hidden>→</span>
                        <span className="text-sm font-medium leading-relaxed text-ink">{d.guardrail}</span>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-sm leading-relaxed text-ink">{d.vulnerability}</span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-verdict-amber">known limit</span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
