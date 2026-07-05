/* New landing page composed from co-located components. Server component by default. */

import Hero from "@/components/landing/Hero";
import WhatItCatches from "@/components/landing/WhatItCatches";
import Pipeline from "@/components/landing/Pipeline";
import Hardening from "@/components/landing/Hardening";
import ClosingCTA from "@/components/landing/ClosingCTA";

export default function Landing() {
  return (
    <div className="min-h-screen bg-ledger text-ink">
      <main>
        <Hero />
        <WhatItCatches />
        <Pipeline />
        <Hardening />
        <ClosingCTA />
      </main>
    </div>
  );
}
