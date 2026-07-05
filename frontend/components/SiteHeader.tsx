"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LensMark } from "@/components/landing/primitives";

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSubmit = pathname === "/submit";

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-sheet/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LensMark className="h-5 w-5 text-form-blue" />
          <span className="font-condensed text-[15px] font-bold tracking-[0.14em] uppercase">ClaimLens</span>
        </Link>
        {isHome ? (
          <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.14em] text-ink-soft md:flex">
            <a href="#evidence" className="hover:text-ink">Evidence</a>
            <a href="#pipeline" className="hover:text-ink">Pipeline</a>
            <a href="#hardening" className="hover:text-ink">Hardening</a>
            <Link href="/claims" className="hover:text-ink">Review queue</Link>
          </nav>
        ) : (
          <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.14em] text-ink-soft md:flex">
            <Link href="/" className="hover:text-ink">Home</Link>
            <Link href="/claims" className="hover:text-ink">Review queue</Link>
          </nav>
        )}
        {!isSubmit && (
          <Link
            href="/submit"
            className="inline-flex h-9 items-center gap-2 bg-form-blue px-3.5 font-mono text-xs uppercase tracking-[0.16em] text-white transition-transform hover:-translate-y-px"
          >
            Try it yourself →
          </Link>
        )}
      </div>
    </header>
  );
}
