import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevLog — AI & Programming",
  description: "High-signal writing on AI and software engineering.",
};

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-6">
        latest
      </p>
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] leading-tight mb-4">
        Writing on AI &amp; Software Engineering
      </h1>
      <p className="text-sm font-mono text-[var(--color-muted)] mb-16">
        High-signal articles on building software with and without AI.
      </p>
      <div className="h-px bg-[var(--color-border)] mb-8" />
      <p className="text-2xs font-mono text-[var(--color-muted)]">
        Task 6.2 — article list
      </p>
    </div>
  );
}
