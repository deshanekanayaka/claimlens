import type { ClaimDetail } from "@/lib/api";
import { RiskFlags, SeverityBadge, VerdictStamp } from "./Badges";

/** Full adjudication result for one claim, laid out like an inspection report. */
export function VerdictCard({ claim }: { claim: ClaimDetail }) {
  const v = claim.verdict;
  if (!v) return null;
  const supportingIds = v.supporting_image_ids.split(";").map((s) => s.trim());

  return (
    <section className="border border-rule bg-sheet">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule px-5 py-4">
        <VerdictStamp status={v.claim_status} />
        <SeverityBadge severity={v.severity} />
      </div>

      <dl className="grid gap-x-8 gap-y-4 px-5 py-4 sm:grid-cols-2">
        <div>
          <dt className="form-heading">Justification</dt>
          <dd className="mt-1.5 text-sm">{v.claim_status_justification}</dd>
        </div>
        <div>
          <dt className="form-heading">Evidence standard</dt>
          <dd className="mt-1.5 text-sm">
            <span className="font-mono text-xs">
              {v.evidence_standard_met === "true" ? "met" : "not met"}
            </span>
            {" · "}
            {v.evidence_standard_met_reason}
          </dd>
        </div>
        <div>
          <dt className="form-heading">Finding</dt>
          <dd className="mt-1.5 font-mono text-sm">
            {v.issue_type} / {v.object_part}
          </dd>
        </div>
        <div>
          <dt className="form-heading">Risk flags</dt>
          <dd className="mt-1.5"><RiskFlags flags={v.risk_flags} /></dd>
        </div>
      </dl>

      <div className="border-t border-rule px-5 py-4">
        <p className="form-heading">Submitted images</p>
        <ul className="mt-3 flex flex-wrap gap-3">
          {claim.image_urls.map((url) => {
            const imageId = url.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
            const supporting = supportingIds.includes(imageId);
            return (
              <li key={url} className="w-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Submitted evidence ${imageId}`}
                  className={`h-28 w-40 border object-cover ${
                    supporting ? "border-2 border-verdict-green" : "border-rule"
                  }`}
                />
                <span className="mt-1 block font-mono text-xs text-ink-soft">
                  {imageId}
                  {supporting && (
                    <span className="text-verdict-green"> · supporting</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
