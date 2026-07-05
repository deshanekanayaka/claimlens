"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { type ClaimDetail, getClaim } from "@/lib/api";
import { VerdictCard } from "@/components/VerdictCard";

export default function ClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [claim, setClaim] = useState<ClaimDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getClaim(id).then(setClaim).catch((e) => setError(String(e)));
  }, [id]);

  if (error) {
    return (
      <p role="alert" className="text-sm text-verdict-red">
        {error}{" "}
        <Link href="/claims" className="text-form-blue underline">
          Back to the queue
        </Link>
      </p>
    );
  }
  if (!claim) return <p className="font-mono text-xs text-ink-soft">Loading claim…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-condensed text-2xl font-bold uppercase tracking-wide">
          Claim record
        </h1>
        <span className="font-mono text-xs text-ink-soft">
          {claim.id} · {new Date(claim.created_at * 1000).toLocaleString()}
        </span>
      </div>

      <section className="border border-rule bg-sheet px-5 py-4">
        <p className="form-heading">Claimant statement · {claim.claim_object}</p>
        <p className="mt-2 whitespace-pre-wrap text-sm">{claim.user_claim}</p>
      </section>

      {claim.verdict ? (
        <VerdictCard claim={claim} />
      ) : claim.status === "failed" ? (
        <p role="alert" className="border border-verdict-red/40 bg-verdict-red/5 px-4 py-3 text-sm text-verdict-red">
          The pipeline failed on this claim: {claim.error}
        </p>
      ) : (
        <p className="font-mono text-xs text-ink-soft">
          Still in review. Refresh in a few seconds.
        </p>
      )}

      <Link href="/claims" className="inline-block text-sm text-form-blue underline">
        Back to the queue
      </Link>
    </div>
  );
}
