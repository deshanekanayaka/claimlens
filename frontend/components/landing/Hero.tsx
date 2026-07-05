import React from "react";
import Link from "next/link";
import { Stamp, LabelTag } from "./primitives";

export default function Hero() {
  const stages = [
    { name: "adversarial_pre_filter", time: "0.1s" },
    { name: "claim_extraction", time: "2.4s" },
    { name: "image_analysis", time: "6.7s" },
    { name: "evidence_gates", time: "0.1s" },
    { name: "verdict", time: "4.2s" },
  ];
  return (
    <section id="top" className="relative border-b border-rule">
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-6 py-14 md:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h1 className="font-condensed text-[44px] leading-[0.95] tracking-[-0.02em] sm:text-[64px] md:text-[84px] lg:text-[104px]">
            Was this
            <br />
            claim <em className="not-italic text-form-blue">real</em>?
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
            ClaimLens reads the claim, inspects the photos, and returns a verdict in about fourteen seconds.
            It issues SUPPORTED, CONTRADICTED, or NOT ENOUGH INFO.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/submit"
              className="inline-flex h-12 items-center gap-3 bg-form-blue px-6 font-mono text-sm uppercase tracking-[0.18em] text-white shadow-[0_1px_0_0_rgba(31,36,33,0.9)] transition-transform hover:-translate-y-px"
            >
              Try it yourself
              <span aria-hidden>→</span>
            </Link>
            <a
              href="#pipeline"
              className="font-mono text-sm uppercase tracking-[0.16em] text-ink underline decoration-rule decoration-2 underline-offset-[6px] hover:decoration-form-blue"
            >
              See the pipeline
            </a>
          </div>
          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-rule pt-6 font-mono text-sm uppercase tracking-[0.16em] text-ink-soft">
            <div>
              <dt>Median verdict</dt>
              <dd className="mt-1 text-ink">14.2s</dd>
            </div>
            <div>
              <dt>Models</dt>
              <dd className="mt-1 text-ink">claude-opus-4-6 + claude-sonnet-4-6</dd>
            </div>
            <div>
              <dt>Hardening</dt>
              <dd className="mt-1 text-ink">8 defects found and fixed</dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-5">
          <figure className="relative border border-rule bg-sheet p-4 shadow-[0_1px_0_0_var(--color-rule),0_24px_60px_-30px_rgba(31,36,33,0.35)]">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/samples/parcel.jpg" alt="Damaged parcel with torn corner" width={1280} height={960} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/3 top-0 h-full w-px bg-white/25" />
                <div className="absolute left-2/3 top-0 h-full w-px bg-white/25" />
                <div className="absolute top-1/3 left-0 h-px w-full bg-white/25" />
                <div className="absolute top-2/3 left-0 h-px w-full bg-white/25" />
                <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-xs uppercase tracking-[0.2em] text-white">EXH · A</span>
              </div>
              <div className="absolute -right-2 bottom-4 md:right-4 md:bottom-6">
                <Stamp verdict="SUPPORTED" size="lg" rotate={-8} animate plated />
              </div>
            </div>
            <figcaption className="mt-4 flex items-center justify-between font-mono text-sm uppercase tracking-[0.16em] text-ink-soft">
              <span>Exhibit A · torn parcel, 2 photos submitted</span>
              <span>14.2s · 3 AI calls</span>
            </figcaption>
            <div className="mt-4 border-t border-rule pt-4">
              <LabelTag>Claim text</LabelTag>
              <p className="mt-2 font-mono text-sm leading-relaxed text-ink">
                “My parcel arrived ripped open at one end. I've attached a comparison photo of another parcel that arrived fine.”
              </p>
            </div>
            <ol className="mt-4 space-y-1.5 border-t border-rule pt-4">
              {stages.map((s, i) => (
                <li key={s.name} className="animate-tick flex items-center justify-between font-mono text-sm" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                  <span className="flex items-center gap-2 text-ink">
                    {/* tick icon */}
                    <svg viewBox="0 0 12 12" className="h-3 w-3 text-form-blue" aria-hidden>
                      <path d="M2 6.5l2.6 2.6L10 3.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="square" />
                    </svg>
                    {s.name}
                  </span>
                  <span className="text-ink-soft">{s.time}</span>
                </li>
              ))}
            </ol>
          </figure>
        </div>
      </div>
    </section>
  );
}
