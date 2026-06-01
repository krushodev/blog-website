import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/data/articles";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "DevLog — AI & Programming",
  description: "High-signal writing on AI and software engineering.",
};

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function HomePage() {
  let articles: Awaited<ReturnType<typeof getPublishedArticles>> = [];
  try {
    articles = await getPublishedArticles();
  } catch {
    /* DB unavailable — show empty state */
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Page header */}
      <div className="flex items-baseline justify-between mb-12">
        <div>
          <p className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-2">
            latest
          </p>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Writing</h1>
        </div>
        {articles.length > 0 && (
          <p className="text-2xs font-mono text-[var(--color-muted)]">
            {articles.length} article{articles.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* List */}
      {articles.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="divide-y divide-[var(--color-border)]">
          {articles.map((article) => (
            <li key={article.id} className="group py-10 first:pt-0 last:pb-0">
              {article.publishedAt && (
                <p className="text-2xs font-mono text-[var(--color-muted)] mb-3">
                  {formatDate(article.publishedAt)}
                </p>
              )}

              <Link href={`/blog/${article.slug}`} className="block">
                <h2 className="text-xl font-bold text-[var(--color-foreground)] leading-snug mb-3 group-hover:underline decoration-1 underline-offset-4">
                  {article.title}
                </h2>
              </Link>

              {article.excerpt && (
                <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
              )}

              {article.tags.length > 0 && (
                <p className="text-2xs font-mono text-[var(--color-muted)]">
                  {article.tags.join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-[var(--color-border)] px-8 py-16 text-center">
      <p className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-3">
        no articles yet
      </p>
      <p className="text-xs font-mono text-[var(--color-muted)]">Content is coming soon.</p>
    </div>
  );
}
