import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main className="page-fade">{children}</main>
      <footer className="border-t border-borderSoft mt-20">
        <div className="container py-10 text-sm text-mutedInk flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="font-serif text-base text-moss">Skillswap — small skills, passed forward.</p>
          <p>No payment. No pressure. Just people helping people.</p>
        </div>
      </footer>
    </div>
  );
}
