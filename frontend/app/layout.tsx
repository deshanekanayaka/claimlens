import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClaimLens",
  description: "AI-powered damage claim triage",
};

function StampFilterDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <filter id="stamp-rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="1.6" />
      </filter>
    </svg>
  );
}

import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/landing/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <StampFilterDefs />
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
