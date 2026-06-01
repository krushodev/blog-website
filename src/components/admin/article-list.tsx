"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteArticle, publishArticle, unpublishArticle } from "@/actions/articles";

interface Article {
  id: string;
  slug: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  tags: string[];
  publishedAt: Date | string | null;
  updatedAt: Date | string;
}

export default function ArticleList({ articles: initial }: { articles: Article[] }) {
  const [articles, setArticles] = useState(initial);
  const [pending, setPending] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function fmt(date: Date | string | null) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  async function handleTogglePublish(id: string, currentStatus: "DRAFT" | "PUBLISHED") {
    setPending(id);
    const result =
      currentStatus === "PUBLISHED"
        ? await unpublishArticle(id)
        : await publishArticle(id);

    if (result.success) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
                publishedAt: currentStatus === "DRAFT" ? new Date() : null,
              }
            : a,
        ),
      );
    }
    setPending(null);
  }

  async function handleDelete(id: string) {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }
    setPending(id);
    const result = await deleteArticle(id);
    if (result.success) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
    setPending(null);
    setConfirmDelete(null);
  }

  if (articles.length === 0) {
    return (
      <div className="border border-[var(--color-border)] px-8 py-12 text-center">
        <p className="text-xs font-mono text-[var(--color-muted)]">No articles yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-[var(--color-border)]">
      {/* Header */}
      <div className="grid grid-cols-[1fr_100px_120px_140px] gap-4 px-6 py-3 border-b border-[var(--color-border)]">
        {(["Title", "Status", "Published", "Actions"] as const).map((h) => (
          <p key={h} className="text-2xs font-mono text-[var(--color-muted)] uppercase tracking-widest">
            {h}
          </p>
        ))}
      </div>

      {/* Rows */}
      {articles.map((article) => (
        <div
          key={article.id}
          className="grid grid-cols-[1fr_100px_120px_140px] gap-4 px-6 py-4 border-b border-[var(--color-border)] last:border-0 items-center hover:bg-[var(--color-surface)] transition-colors"
        >
          <div className="min-w-0">
            <Link
              href={`/admin/articles/${article.id}`}
              className="text-sm font-mono text-[var(--color-foreground)] hover:underline truncate block"
            >
              {article.title}
            </Link>
            {article.tags.length > 0 && (
              <p className="text-2xs font-mono text-[var(--color-muted)] mt-1 truncate">
                {article.tags.join(" · ")}
              </p>
            )}
          </div>

          <span
            className={`text-2xs font-mono uppercase tracking-widest ${
              article.status === "PUBLISHED"
                ? "text-[var(--color-foreground)]"
                : "text-[var(--color-muted)]"
            }`}
          >
            {article.status}
          </span>

          <span className="text-2xs font-mono text-[var(--color-muted)]">
            {fmt(article.publishedAt)}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTogglePublish(article.id, article.status)}
              disabled={pending === article.id}
              className="text-2xs font-mono text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors disabled:opacity-40 uppercase tracking-widest"
            >
              {pending === article.id
                ? "..."
                : article.status === "PUBLISHED"
                ? "Unpublish"
                : "Publish"}
            </button>

            <button
              onClick={() => handleDelete(article.id)}
              disabled={pending === article.id}
              className={`text-2xs font-mono uppercase tracking-widest transition-colors disabled:opacity-40 ${
                confirmDelete === article.id
                  ? "text-red-400 hover:text-red-300"
                  : "text-[var(--color-muted)] hover:text-red-400"
              }`}
              onBlur={() => setConfirmDelete(null)}
            >
              {confirmDelete === article.id ? "Confirm?" : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
