import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { getArticleStats } from "@/lib/data/articles";

export const metadata: Metadata = { title: "Dashboard" };

async function safeStats() {
  try {
    return await getArticleStats();
  } catch {
    return { total: 0, published: 0, draft: 0 };
  }
}

export default async function AdminDashboard() {
  const [session, stats] = await Promise.all([auth(), safeStats()]);

  return (
    <main className="p-8 max-w-3xl">
      <p className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-2">
        welcome back
      </p>
      <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-10">
        {session?.user?.email}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px border border-[var(--color-border)] mb-12">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Published" value={stats.published} />
        <StatCard label="Drafts" value={stats.draft} />
      </div>

      {/* Quick actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/articles/new"
          className="text-xs font-mono border border-[var(--color-foreground)] text-[var(--color-foreground)] px-4 py-2 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] transition-colors"
        >
          New Article →
        </Link>
        <Link
          href="/admin/articles"
          className="text-xs font-mono border border-[var(--color-border)] text-[var(--color-muted)] px-4 py-2 hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          View All Articles
        </Link>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[var(--color-surface)] px-6 py-5">
      <p className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-3xl font-bold text-[var(--color-foreground)] font-mono">{value}</p>
    </div>
  );
}
