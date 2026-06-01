import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Article" };

export default function NewArticlePage() {
  return (
    <main className="p-8 max-w-4xl">
      <h1 className="text-xl font-bold text-[var(--color-foreground)] mb-2">New Article</h1>
      <p className="text-xs font-mono text-[var(--color-muted)]">
        Task 5.2 — markdown editor
      </p>
    </main>
  );
}
