"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ClaimDetail,
  type ClaimObject,
  type StageEvent,
  getClaim,
  streamEvents,
  submitClaim,
} from "@/lib/api";
import { PipelineChecklist } from "@/components/PipelineChecklist";
import { VerdictCard } from "@/components/VerdictCard";

const OBJECTS: ClaimObject[] = ["car", "laptop", "package"];

export default function NewClaimPage() {
  const [claimObject, setClaimObject] = useState<ClaimObject>("car");
  const [userClaim, setUserClaim] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [claimId, setClaimId] = useState<string | null>(null);
  const [events, setEvents] = useState<StageEvent[]>([]);
  const [result, setResult] = useState<ClaimDetail | null>(null);
  const [phase, setPhase] = useState<"form" | "running" | "done">("form");
  const cleanupRef = useRef<() => void>(() => {});

  useEffect(() => () => cleanupRef.current(), []);

  const onSubmit = useCallback(async () => {
    setError(null);
    if (!userClaim.trim()) return setError("Describe the damage before submitting.");
    if (files.length === 0) return setError("Attach at least one photo of the damage.");
    try {
      const { id } = await submitClaim(claimObject, userClaim, files);
      setClaimId(id);
      setPhase("running");
      cleanupRef.current = streamEvents(
        id,
        (event) => setEvents((prev) => [...prev, event]),
        async () => {
          setResult(await getClaim(id));
          setPhase("done");
        },
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed.");
    }
  }, [claimObject, userClaim, files]);

  const reset = () => {
    cleanupRef.current();
    setClaimId(null);
    setEvents([]);
    setResult(null);
    setUserClaim("");
    setFiles([]);
    setPhase("form");
  };

  return (
    <div className="space-y-8">
      {phase === "form" && (
        <>
          <div>
            <h1 className="font-condensed text-3xl font-bold uppercase tracking-wide">
              Submit a damage claim
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink-soft">
              Describe the damage and attach photos. The pipeline extracts your
              claim, inspects the images, and returns a verdict with the
              evidence it rests on.
            </p>
          </div>

          <div className="space-y-6 border border-rule bg-sheet p-5">
            <fieldset>
              <legend className="form-heading w-full">Claim object</legend>
              <div className="mt-3 flex gap-2">
                {OBJECTS.map((obj) => (
                  <button
                    key={obj}
                    type="button"
                    onClick={() => setClaimObject(obj)}
                    aria-pressed={claimObject === obj}
                    className={`border px-4 py-1.5 text-sm capitalize ${
                      claimObject === obj
                        ? "border-form-blue bg-form-blue text-white"
                        : "border-rule bg-sheet hover:border-form-blue"
                    }`}
                  >
                    {obj}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="claim" className="form-heading block">
                What happened
              </label>
              <textarea
                id="claim"
                value={userClaim}
                onChange={(e) => setUserClaim(e.target.value)}
                rows={4}
                placeholder="e.g. Courier dropped the box; the corner is crushed and the seal is torn."
                className="mt-3 w-full border border-rule bg-white p-3 text-sm focus:border-form-blue"
              />
            </div>

            <div>
              <label htmlFor="photos" className="form-heading block">
                Photos (1 to 6)
              </label>
              <input
                id="photos"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 6))}
                className="mt-3 block text-sm file:mr-3 file:border file:border-rule file:bg-ledger file:px-3 file:py-1.5 file:text-sm"
              />
              {files.length > 0 && (
                <p className="mt-2 font-mono text-xs text-ink-soft">
                  {files.map((f) => f.name).join(" · ")}
                </p>
              )}
            </div>

            {error && (
              <p role="alert" className="border border-verdict-red/40 bg-verdict-red/5 px-3 py-2 text-sm text-verdict-red">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={onSubmit}
              className="bg-form-blue px-5 py-2 text-sm font-medium text-white hover:bg-form-blue-deep"
            >
              Submit claim
            </button>
          </div>
        </>
      )}

      {phase !== "form" && (
        <>
          <div className="flex items-baseline justify-between">
            <h1 className="font-condensed text-2xl font-bold uppercase tracking-wide">
              {phase === "running" ? "Reviewing claim" : "Review complete"}
            </h1>
            <span className="font-mono text-xs text-ink-soft">claim {claimId}</span>
          </div>

          <PipelineChecklist events={events} />

          {phase === "done" && result?.verdict && <VerdictCard claim={result} />}
          {phase === "done" && result?.status === "failed" && (
            <p role="alert" className="border border-verdict-red/40 bg-verdict-red/5 px-4 py-3 text-sm text-verdict-red">
              The pipeline failed on this claim: {result.error}. Submit it again,
              or check the backend logs.
            </p>
          )}

          {phase === "done" && (
            <button
              type="button"
              onClick={reset}
              className="border border-form-blue px-5 py-2 text-sm font-medium text-form-blue hover:bg-form-blue hover:text-white"
            >
              Submit another claim
            </button>
          )}
        </>
      )}
    </div>
  );
}
