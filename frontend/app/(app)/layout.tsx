import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "ClaimLens",
  description: "AI-powered damage claim triage",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-5 py-8">{children}</main>
    </div>
  );
}
