import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/data/articles";
import ArticleEditor from "@/components/admin/article-editor";

export const metadata: Metadata = { title: "Edit Article" };

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  return (
    <div className="h-screen flex flex-col">
      <ArticleEditor
        initialData={{
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          tags: article.tags,
          status: article.status,
        }}
      />
    </div>
  );
}
