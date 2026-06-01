import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getPublishedArticleBySlug, getPublishedArticles } from "@/lib/data/articles";

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getPublishedArticles().catch(() => []);
  return articles.map((a) => ({ slug: a.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug).catch(() => null);
  if (!article) return { title: "Not Found" };

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      tags: article.tags,
    },
  };
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug).catch(() => null);
  if (!article) notFound();

  const mins = readingTime(article.content);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Back */}
      <Link
        href="/"
        className="text-2xs font-mono text-[var(--color-muted)] hover:text-[var(--color-foreground)] uppercase tracking-widest transition-colors mb-12 inline-block"
      >
        ← Back
      </Link>

      {/* Meta */}
      <div className="mb-8">
        {article.publishedAt && (
          <p className="text-2xs font-mono text-[var(--color-muted)] mb-3">
            {formatDate(article.publishedAt)}
            <span className="mx-2">·</span>
            {mins} min read
          </p>
        )}
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] leading-tight mb-4">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-base text-[var(--color-muted)] leading-relaxed">
            {article.excerpt}
          </p>
        )}
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <p className="text-2xs font-mono text-[var(--color-muted)] mb-8">
          {article.tags.join(" · ")}
        </p>
      )}

      {/* Divider */}
      <div className="h-px bg-[var(--color-border)] mb-12" />

      {/* Content */}
      <div className="prose-public">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
        <Link
          href="/"
          className="text-2xs font-mono text-[var(--color-muted)] hover:text-[var(--color-foreground)] uppercase tracking-widest transition-colors"
        >
          ← All articles
        </Link>
      </div>
    </div>
  );
}
