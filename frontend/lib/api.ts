/** Typed client for the ClaimLens API (proxied through Next rewrites). */

export type ClaimObject = "car" | "laptop" | "package";
export type RunStatus = "pending" | "running" | "done" | "failed";

export interface Verdict {
  evidence_standard_met: string;
  evidence_standard_met_reason: string;
  risk_flags: string;
  issue_type: string;
  object_part: string;
  claim_status: string;
  claim_status_justification: string;
  supporting_image_ids: string;
  valid_image: string;
  severity: string;
}

export interface ClaimSummary {
  id: string;
  created_at: number;
  claim_object: ClaimObject;
  status: RunStatus;
  claim_status: string | null;
  severity: string | null;
  risk_flags: string | null;
}

export interface ClaimDetail {
  id: string;
  created_at: number;
  claim_object: ClaimObject;
  user_claim: string;
  image_urls: string[];
  status: RunStatus;
  error: string | null;
  verdict: Verdict | null;
}

export interface StageEvent {
  id: number;
  created_at: number;
  stage: string;
  detail: { status?: string; [key: string]: unknown };
}

export async function submitClaim(
  claimObject: ClaimObject,
  userClaim: string,
  images: File[],
): Promise<{ id: string }> {
  const form = new FormData();
  form.set("claim_object", claimObject);
  form.set("user_claim", userClaim);
  for (const file of images) form.append("images", file);
  const res = await fetch("/api/claims", { method: "POST", body: form });
  if (!res.ok) throw new Error((await res.text()) || `Submit failed (${res.status})`);
  return res.json();
}

export async function getClaim(id: string): Promise<ClaimDetail> {
  const res = await fetch(`/api/claims/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Claim ${id} not found`);
  return res.json();
}

export async function listClaims(): Promise<ClaimSummary[]> {
  const res = await fetch("/api/claims", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load the claim queue");
  return res.json();
}

/**
 * Subscribe to the SSE stage stream for a claim.
 * Returns a cleanup function; the source also closes itself on `complete`.
 */
export function streamEvents(
  id: string,
  onEvent: (event: StageEvent) => void,
  onEnd: () => void,
): () => void {
  const source = new EventSource(`/api/claims/${id}/events`);
  source.onmessage = (msg) => {
    const event: StageEvent = JSON.parse(msg.data);
    onEvent(event);
    if (event.stage === "complete") {
      source.close();
      onEnd();
    }
  };
  source.onerror = () => {
    source.close();
    onEnd();
  };
  return () => source.close();
}
