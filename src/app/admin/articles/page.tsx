import type { Metadata } from "next";

export const metadata: Metadata = { title: "Articles" };

export default function ArticlesPage() {
  return (
    <main className="p-8 max-w-4xl">
      <h1 className="text-xl font-bold text-[var(--color-foreground)] mb-2">Articles</h1>
      <p className="text-xs font-mono text-[var(--color-muted)]">
        Task 5.2 — article list with CRUD actions
      </p>
    </main>
  );
}
