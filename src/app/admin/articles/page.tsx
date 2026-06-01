import type { Metadata } from "next";
import Link from "next/link";
import { getArticlesForAdmin } from "@/lib/data/articles";
import ArticleList from "@/components/admin/article-list";

export const metadata: Metadata = { title: "Articles" };

export default async function ArticlesPage() {
  let articles: Awaited<ReturnType<typeof getArticlesForAdmin>> = [];
  try {
    articles = await getArticlesForAdmin();
  } catch {
    /* DB not available — show empty state */
  }

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8 max-w-4xl">
        <div>
          <p className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest mb-1">
            content
          </p>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Articles</h1>
        </div>
        <Link
          href="/admin/articles/new"
          className="text-xs font-mono border border-[var(--color-foreground)] text-[var(--color-foreground)] px-4 py-2 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] transition-colors"
        >
          New Article →
        </Link>
      </div>

      <div className="max-w-4xl">
        <ArticleList articles={articles} />
      </div>
    </main>
  );
}
