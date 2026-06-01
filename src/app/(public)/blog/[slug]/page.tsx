import type { Metadata } from "next";

export const metadata: Metadata = { title: "Article" };

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-4">
        {slug}
      </p>
      <p className="text-xs font-mono text-[var(--color-muted)]">
        Task 6.3 — article rendering
      </p>
    </div>
  );
}
