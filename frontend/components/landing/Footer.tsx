"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="bg-ledger">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-condensed text-[13px] font-bold uppercase tracking-[0.14em]">ClaimLens</span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            built on a three-call Claude pipeline
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-6 font-mono text-sm uppercase tracking-[0.18em] text-ink-soft">
          {isHome ? (
            <>
              <a href="#evidence" className="hover:text-ink">Evidence</a>
              <a href="#pipeline" className="hover:text-ink">Pipeline</a>
              <a href="#hardening" className="hover:text-ink">Hardening</a>
            </>
          ) : (
            <Link href="/" className="hover:text-ink">Home</Link>
          )}
          <a href="https://github.com/deshanekanayaka/claimlens" className="text-form-blue hover:text-form-blue-deep">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
