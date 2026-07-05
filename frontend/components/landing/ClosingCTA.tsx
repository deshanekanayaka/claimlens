import React from "react";
import Link from "next/link";

export default function ClosingCTA() {
  return (
    <section id="try" className="border-b border-rule">
      <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-20">
        <p className="font-condensed text-2xl leading-tight tracking-[-0.01em] text-ink-soft md:text-3xl">
          That&rsquo;s the pipeline. See it decide your claim.
        </p>
        <Link
          href="/submit"
          className="mt-8 inline-flex h-12 items-center gap-3 bg-form-blue px-6 font-mono text-sm uppercase tracking-[0.18em] text-white shadow-[0_1px_0_0_rgba(31,36,33,0.9)] transition-transform hover:-translate-y-px"
        >
          Try it yourself
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
