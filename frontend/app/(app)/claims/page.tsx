"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type ClaimSummary, listClaims } from "@/lib/api";
import { SeverityBadge } from "@/components/Badges";

const STATUS_TONE: Record<string, string> = {
  supported: "text-verdict-green",
  contradicted: "text-verdict-red",
  not_enough_information: "text-verdict-amber",
};

export default function QueuePage() {
  const [claims, setClaims] = useState<ClaimSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listClaims().then(setClaims).catch((e) => setError(String(e)));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-condensed text-3xl font-bold uppercase tracking-wide">
          Review queue
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Every submitted claim with its verdict, most recent first.
        </p>
      </div>

      {error && <p role="alert" className="text-sm text-verdict-red">{error}</p>}

      {claims && claims.length === 0 && (
        <div className="border border-rule bg-sheet px-5 py-8 text-center text-sm text-ink-soft">
          No claims yet.{" "}
          <Link href="/" className="text-form-blue underline">
            Submit the first one
          </Link>
          .
        </div>
      )}

      {claims && claims.length > 0 && (
        <ul className="divide-y divide-rule border border-rule bg-sheet">
          {claims.map((claim) => (
            <li key={claim.id}>
              <Link
                href={`/claims/${claim.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-ledger"
              >
                <span className="font-mono text-xs text-ink-soft">{claim.id}</span>
                <span className="text-sm capitalize">{claim.claim_object}</span>
                <span
                  className={`font-mono text-xs font-medium ${
                    STATUS_TONE[claim.claim_status ?? ""] ?? "text-ink-soft"
                  }`}
                >
                  {claim.status === "done"
                    ? claim.claim_status
                    : claim.status === "failed"
                      ? "failed"
                      : "in review"}
                </span>
                <span className="ml-auto flex items-center gap-3">
                  {claim.severity && <SeverityBadge severity={claim.severity} />}
                  <span className="font-mono text-xs text-ink-soft">
                    {new Date(claim.created_at * 1000).toLocaleString()}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
