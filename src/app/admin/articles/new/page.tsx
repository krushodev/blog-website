import type { Metadata } from "next";
import ArticleEditor from "@/components/admin/article-editor";

export const metadata: Metadata = { title: "New Article" };

export default function NewArticlePage() {
  return (
    <div className="h-screen flex flex-col">
      <ArticleEditor />
    </div>
  );
}
